import React, { useState } from 'react';
import axios from 'axios';

export default function App() {
  const [file, setFile] = useState(null);
  
  // Configuration adaptée au format Legacy Code / Migration
  const [templateName, setTemplateName] = useState("Legacy_Migration_Template");
  const [startMarker, setStartMarker] = useState("MODULE_START");
  const [endMarker, setEndMarker] = useState("MODULE_END");
  
  // Champs spécifiques extraits du code legacy
  const [fields, setFields] = useState([
    { name: "id", regex: "ID:\\s*([A-Z0-9-]+)" },
    { name: "client_name", regex: "CLIENT_NAME\\s*=\\s*\"([^\"]+)\"" },
    { name: "status", regex: "STATUS\\s*=\\s*\"([^\"]+)\"" },
    { name: "balance", regex: "BALANCE\\s*=\\s*([\\d\\.]+)" }
  ]);

  const [results, setResults] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const handleAddField = () => {
    setFields([...fields, { name: "", regex: "" }]);
  };

  const handleFieldChange = (index, key, value) => {
    const newFields = [...fields];
    newFields[index][key] = value;
    setFields(newFields);
  };

  const handleRemoveField = (index) => {
    setFields(fields.filter((_, i) => i !== index));
  };

  const handleDrop = (e) => {
    e.preventDefault();
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      setFile(e.dataTransfer.files[0]);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!file) {
      alert("Veuillez sélectionner un fichier de code legacy.");
      return;
    }

    setLoading(true);
    setError(null);
    setResults(null);

    const fieldsConfig = {};
    fields.forEach(f => {
      if (f.name.trim() && f.regex.trim()) {
        fieldsConfig[f.name.trim()] = f.regex.trim();
      }
    });

    const templateConfig = {
      template_name: templateName,
      start_marker: startMarker,
      end_marker: endMarker,
      fields: fieldsConfig
    };

    const formData = new FormData();
    formData.append("file", file);
    formData.append("template_json", JSON.stringify(templateConfig));

    try {
      const response = await axios.post("http://127.0.0.1:8000/api/v1/parse/dynamic", formData);
      setResults(response.data);
    } catch (err) {
      setError(err.response?.data?.detail || "Erreur de communication avec le serveur.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ minHeight: '100vh', backgroundColor: '#0f172a', color: '#f8fafc', padding: '2rem', fontFamily: 'system-ui, sans-serif' }}>
      <div style={{ maxWidth: '80rem', margin: '0 auto' }}>
        
        {/* En-tête professionnel */}
        <header style={{ marginBottom: '2rem', borderBottom: '1px solid #1e293b', paddingBottom: '1rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <div>
            <h1 style={{ fontSize: '1.75rem', fontWeight: '800', color: '#38bdf8' }}>Legacy Migration Engine</h1>
            <p style={{ color: '#94a3b8', fontSize: '0.875rem', marginTop: '0.25rem' }}>Outil d'extraction et de conversion de code propriétaire pour migration cloud.</p>
          </div>
          <span style={{ backgroundColor: '#0284c7', color: 'white', padding: '0.25rem 0.75rem', borderRadius: '9999px', fontSize: '0.75rem', fontWeight: 'bold' }}>
            Mode Enterprise
          </span>
        </header>

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '2rem' }}>
          
          {/* Panneau de configuration (Gauche) */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
            
            {/* Zone Drag and Drop */}
            <div 
              onDragOver={(e) => e.preventDefault()}
              onDrop={handleDrop}
              style={{ border: '2px dashed #334155', borderRadius: '0.75rem', padding: '1.5rem', textAlign: 'center', backgroundColor: '#1e293b', cursor: 'pointer' }}
            >
              <input 
                type="file" 
                id="fileUpload" 
                style={{ display: 'none' }} 
                onChange={(e) => setFile(e.target.files[0])} 
              />
              <label htmlFor="fileUpload" style={{ cursor: 'pointer' }}>
                <p style={{ fontSize: '0.875rem', color: '#cbd5e1' }}>
                  {file ? <span style={{ fontWeight: 'bold', color: '#38bdf8' }}>Fichier chargé : {file.name}</span> : "Glissez votre fichier de code legacy ici (.dsl, .txt, .log)"}
                </p>
              </label>
            </div>

            {/* Paramètres de Délimitation */}
            <div style={{ backgroundColor: '#1e293b', padding: '1rem', borderRadius: '0.5rem', border: '1px solid #334155' }}>
              <h3 style={{ fontSize: '0.9rem', fontWeight: 'bold', color: '#7dd3fc', marginBottom: '0.75rem' }}>1. Balises de Blocs (Syntaxe)</h3>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.75rem' }}>
                <div>
                  <label style={{ fontSize: '0.75rem', color: '#94a3b8' }}>Début de module :</label>
                  <input 
                    type="text" 
                    value={startMarker} 
                    onChange={(e) => setStartMarker(e.target.value)}
                    style={{ width: '100%', backgroundColor: '#0f172a', border: '1px solid #475569', borderRadius: '0.25rem', padding: '0.4rem', color: 'white', marginTop: '0.25rem' }}
                  />
                </div>
                <div>
                  <label style={{ fontSize: '0.75rem', color: '#94a3b8' }}>Fin de module :</label>
                  <input 
                    type="text" 
                    value={endMarker} 
                    onChange={(e) => setEndMarker(e.target.value)}
                    style={{ width: '100%', backgroundColor: '#0f172a', border: '1px solid #475569', borderRadius: '0.25rem', padding: '0.4rem', color: 'white', marginTop: '0.25rem' }}
                  />
                </div>
              </div>
            </div>

            {/* Mapping des Propriétés */}
            <div style={{ backgroundColor: '#1e293b', padding: '1rem', borderRadius: '0.5rem', border: '1px solid #334155' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.75rem' }}>
                <h3 style={{ fontSize: '0.9rem', fontWeight: 'bold', color: '#7dd3fc' }}>2. Mapping des Champs (Regex)</h3>
                <button 
                  type="button" 
                  onClick={handleAddField}
                  style={{ backgroundColor: '#334155', color: '#38bdf8', border: 'none', padding: '0.2rem 0.5rem', borderRadius: '0.25rem', cursor: 'pointer', fontSize: '0.75rem', fontWeight: 'bold' }}
                >
                  + Ajouter
                </button>
              </div>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                {fields.map((field, index) => (
                  <div key={index} style={{ display: 'flex', gap: '0.5rem', alignItems: 'center' }}>
                    <input 
                      type="text" 
                      placeholder="Nom (ex: balance)" 
                      value={field.name}
                      onChange={(e) => handleFieldChange(index, 'name', e.target.value)}
                      style={{ flex: 1, backgroundColor: '#0f172a', border: '1px solid #475569', borderRadius: '0.25rem', padding: '0.35rem', color: 'white', fontSize: '0.8rem' }}
                    />
                    <input 
                      type="text" 
                      placeholder="Regex de capture" 
                      value={field.regex}
                      onChange={(e) => handleFieldChange(index, 'regex', e.target.value)}
                      style={{ flex: 2, backgroundColor: '#0f172a', border: '1px solid #475569', borderRadius: '0.25rem', padding: '0.35rem', color: '#7dd3fc', fontFamily: 'monospace', fontSize: '0.8rem' }}
                    />
                    <button 
                      type="button" 
                      onClick={() => handleRemoveField(index)}
                      style={{ backgroundColor: '#991b1b', color: '#fca5a5', border: 'none', padding: '0.35rem 0.5rem', borderRadius: '0.25rem', cursor: 'pointer' }}
                    >
                      ✕
                    </button>
                  </div>
                ))}
              </div>
            </div>

            <button
              onClick={handleSubmit}
              disabled={loading}
              style={{ width: '100%', backgroundColor: '#0284c7', color: 'white', fontWeight: 'bold', padding: '0.75rem', borderRadius: '0.5rem', border: 'none', cursor: 'pointer', transition: 'background 0.2s' }}
            >
              {loading ? "Migration et parsing en cours..." : "Lancer l'extraction de migration"}
            </button>

            {error && <div style={{ color: '#f87171', fontSize: '0.875rem' }}>{error}</div>}
          </div>

          {/* Panneau de résultats et validation client (Droite) */}
          <div style={{ backgroundColor: '#1e293b', border: '1px solid #334155', borderRadius: '0.75rem', padding: '1.5rem', display: 'flex', flexDirection: 'column' }}>
            <h2 style={{ fontSize: '1.1rem', fontWeight: 'bold', marginBottom: '1rem', color: '#f1f5f9' }}>Rapport de Migration</h2>

            {results ? (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem', flex: 1 }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.85rem', color: '#94a3b8', backgroundColor: '#0f172a', padding: '0.75rem', borderRadius: '0.5rem', border: '1px solid #334155' }}>
                  <span>Modules convertis : <strong style={{ color: '#38bdf8' }}>{results.extracted_count}</strong></span>
                  <a 
                    href={`http://127.0.0.1:8000${results.excel_download_ready}`} 
                    target="_blank" 
                    rel="noreferrer"
                    style={{ color: '#38bdf8', textDecoration: 'none', fontWeight: 'bold' }}
                  >
                    📥 Télécharger l'Audit Excel
                  </a>
                </div>

                <div style={{ overflowX: 'auto', flex: 1 }}>
                  <table style={{ width: '100%', textAlign: 'left', borderCollapse: 'collapse', fontSize: '0.85rem' }}>
                    <thead>
                      <tr style={{ borderBottom: '1px solid #334155', color: '#94a3b8' }}>
                        {fields.map((f, i) => f.name && <th key={i} style={{ padding: '0.5rem' }}>{f.name}</th>)}
                      </tr>
                    </thead>
                    <tbody>
                      {results.data.map((rec, index) => (
                        <tr key={index} style={{ borderBottom: '1px solid #334155' }}>
                          {fields.map((f, i) => f.name && (
                            <td key={i} style={{ padding: '0.5rem', fontFamily: 'monospace', color: '#e2e8f0' }}>
                              {rec[f.name] !== undefined ? String(rec[f.name]) : "-"}
                            </td>
                          ))}
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            ) : (
              <div style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#64748b', textAlign: 'center', padding: '2rem', border: '1px dashed #334155', borderRadius: '0.5rem' }}>
                <p>Importez un fichier source legacy et lancez l'analyse pour visualiser le rapport de migration et valider les données.</p>
              </div>
            )}
          </div>

        </div>
      </div>
    </div>
  );
}
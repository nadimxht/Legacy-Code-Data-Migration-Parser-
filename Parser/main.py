import os
import json
from fastapi import FastAPI, File, UploadFile, Form, HTTPException
from fastapi.responses import FileResponse
from fastapi.middleware.cors import CORSMiddleware
from src.dynamic_parser import AdvancedDynamicParser
from src.exporter import Exporter

app = FastAPI(
    title="Legacy Migration Engine API",
    description="API de parsing dynamique et de migration de code/logs pour SaaS B2B.",
    version="1.0.0"
)

# Activer le CORS pour permettre la communication avec l'interface React
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # Autorise toutes les origines en développement local
    allow_credentials=True,
    allow_methods=["*"],  # Autorise toutes les méthodes HTTP (GET, POST, etc.)
    allow_headers=["*"],  # Autorise tous les headers
)

# Dossier temporaire pour stocker les rapports Excel générés
TEMP_DIR = "temp_output"
os.makedirs(TEMP_DIR, exist_ok=True)

@app.get("/")
def read_root():
    return {"message": "Bienvenue sur l'API Legacy Migration Engine ! Le serveur est opérationnel."}

@app.post("/api/v1/parse/dynamic")
async def parse_dynamic_file(
    file: UploadFile = File(...),
    template_json: str = Form(...)
):
    try:
        # 1. Charger et valider le template JSON envoyé par le front-end
        try:
            template_config = json.loads(template_json)
        except json.JSONDecodeError as e:
            raise HTTPException(status_code=400, detail=f"Template JSON invalide : {str(e)}")

        # 2. Lire le contenu du fichier téléchargé
        content = await file.read()
        try:
            text_content = content.decode("utf-8")
        except UnicodeDecodeError:
            text_content = content.decode("latin-1")

        # 3. Initialiser le parseur dynamique et extraire les données
        parser = AdvancedDynamicParser(template_config)
        parse_result = parser.parse_text(text_content)

        # 4. Préparer le nom et le chemin du fichier Excel de sortie
        safe_filename = file.filename.split('.')[0] if file.filename else "export"
        output_filename = f"dynamic_report_{safe_filename}.xlsx"
        output_path = os.path.join(TEMP_DIR, output_filename)

        # 5. Encapsulation pour l'exportateur Excel
        class VirtualProgramAST:
            def __init__(self, records):
                self.records = records

        virtual_ast = VirtualProgramAST(parse_result.get("records", []))
        Exporter.to_excel(virtual_ast, output_path)

        # 6. Retourner la réponse JSON structurée au front-end React
        return {
            "filename": file.filename,
            "status": "success",
            "extracted_count": parse_result.get("total_records", 0),
            "data": parse_result.get("records", []),
            "excel_download_ready": f"/api/v1/download/{output_filename}"
        }

    except HTTPException as he:
        raise he
    except Exception as e:
        print(f"ERREUR SERVEUR INTERNE : {str(e)}")
        raise HTTPException(status_code=500, detail=f"Erreur interne du serveur : {str(e)}")
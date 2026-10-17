import json
import pandas as pd

class Exporter:
    @staticmethod
    def to_json(program_ast, output_path):
        data = []
        for rec in program_ast.records:
            data.append({
                "record_id": rec.record_id,
                "client_name": rec.client_name,
                "transactions": rec.transactions
            })
        with open(output_path, 'w', encoding='utf-8') as f:
            json.dump(data, f, indent=4)

    @staticmethod
    def to_excel(program_ast, output_path):
        rows = []
        
        # On récupère la liste des enregistrements (depuis .records ou directement si c'est déjà une liste)
        records = getattr(program_ast, 'records', program_ast)
        
        for rec in records:
            rows.append(rec)
        
        df = pd.DataFrame(rows)
        with pd.ExcelWriter(output_path, engine='openpyxl') as writer:
            df.to_excel(writer, index=False, sheet_name='Extracted Data')
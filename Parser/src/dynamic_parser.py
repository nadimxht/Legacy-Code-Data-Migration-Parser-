import re

class AdvancedDynamicParser:
    def __init__(self, template_config: dict):
        self.start_marker = template_config.get("start_marker")
        self.end_marker = template_config.get("end_marker")
        self.field_regexes = {
            field_name: re.compile(pattern) 
            for field_name, pattern in template_config.get("fields", {}).items()
        }

    def parse_text(self, raw_text: str) -> dict:
        lines = raw_text.splitlines()
        raw_records = []
        current_record = None
        in_record = False

        for line in lines:
            stripped = line.strip()
            if not stripped:
                continue

            if self.start_marker in stripped:
                in_record = True
                current_record = {}
                continue
            
            if self.end_marker in stripped and in_record:
                if current_record:
                    raw_records.append(current_record)
                in_record = False
                current_record = None
                continue

            if in_record and current_record is not None:
                # Tester chaque regex configurée par l'utilisateur
                for field_name, regex in self.field_regexes.items():
                    match = regex.search(stripped)
                    if match:
                        val = match.groups()[0] if match.groups() else match.group(0)
                        
                        # Conversion intelligente (Nombre, Date ou Texte)
                        try:
                            if '.' in val:
                                val = float(val)
                            elif val.isdigit():
                                val = int(val)
                        except ValueError:
                            pass
                        
                        # Enregistrer le champ dynamiquement (quel que soit son type/nom)
                        current_record[field_name] = val

        return {
            "total_records": len(raw_records),
            "records": raw_records
        }
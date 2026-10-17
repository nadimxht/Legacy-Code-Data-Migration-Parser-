class LegacyParser:
    def __init__(self, tokens):
        self.tokens = tokens
        self.pos = 0

    def parse(self):
        modules = []
        current_module = None

        while self.pos < len(self.tokens):
            token = self.tokens[self.pos]

            if token.type == 'MODULE_START':
                current_module = {}
            
            elif token.type == 'MODULE_END' and current_module is not None:
                modules.append(current_module)
                current_module = None

            elif current_module is not None:
                if token.type == 'IDENTIFIER':
                    current_module['id'] = token.value[0]
                elif token.type == 'PROPERTY':
                    key, val = token.value
                    current_module[key.lower()] = val
                elif token.type == 'ASSIGNMENT':
                    key, val = token.value
                    try:
                        current_module[key.lower()] = float(val) if '.' in val else int(val)
                    except ValueError:
                        current_module[key.lower()] = val

            self.pos += 1

        return {
            "total_modules": len(modules),
            "modules": modules
        }
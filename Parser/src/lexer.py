import re

class Token:
    def __init__(self, type_, value):
        self.type = type_
        self.value = value

    def __repr__(self):
        return f"Token({self.type}, {repr(self.value)})"

class LegacyLexer:
    # Patterns for our mock legacy proprietary language (DSL)
    RULES = [
        ('MODULE_START', r'MODULE_START'),
        ('MODULE_END',   r'MODULE_END'),
        ('PROPERTY',     r'([A-Z_]+)\s*=\s*"([^"]+)"'),
        ('ASSIGNMENT',   r'([A-Z_]+)\s*=\s*([\d\.]+)'),
        ('IDENTIFIER',   r'ID:\s*([A-Z0-9-]+)'),
        ('SKIP',         r'[ \t\r]+'),
        ('NEWLINE',      r'\n'),
    ]

    def __init__(self, text):
        self.text = text

    def tokenize(self):
        tokens = []
        pos = 0
        while pos < len(self.text):
            match_found = False
            for token_type, regex in self.RULES:
                match = re.compile(regex).match(self.text, pos)
                if match:
                    if token_type not in ('SKIP', 'NEWLINE'):
                        val = match.groups() if match.groups() else match.group(0)
                        tokens.append(Token(token_type, val))
                    pos = match.end()
                    match_found = True
                    break
            if not match_found:
                pos += 1  # Skip unrecognized characters safely
        return tokens
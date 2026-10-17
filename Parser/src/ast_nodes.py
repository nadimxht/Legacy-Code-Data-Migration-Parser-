class ASTNode:
    pass

class RecordNode(ASTNode):
    def __init__(self, record_id, client_name):
        self.record_id = record_id
        self.client_name = client_name
        self.transactions = []

    def add_transaction(self, amount, tx_type):
        self.transactions.append({"amount": amount, "type": tx_type})

class ProgramAST(ASTNode):
    def __init__(self):
        self.records = []
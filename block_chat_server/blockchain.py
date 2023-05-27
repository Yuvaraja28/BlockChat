import datetime, hashlib, json, random, uuid

class Blockchain:
    def __init__(self):
        self.msg_chain = []
        self.CreateMsgBlock(proof=random.randint(1, 100)*1024, previous_hash=hex(int(uuid.uuid1()))[2:], msg='Initial Hash', author='Server')
    def CreateMsgBlock(self, proof, previous_hash, msg, author):
        block = {
            'index': len(self.msg_chain) + 1,
            'msg': msg,
            'author': author,
            'timestamp': str(datetime.datetime.now()),
            'proof': proof,
            'previous_hash': previous_hash, 
        }
        if (not self.VerifyChain(self.msg_chain)):
            return None
        self.msg_chain.append(block)
        return block
    def GetPreviousMsgBlock(self):
        return self.msg_chain[-1]
    def CalcProofOfWork(self, previous_proof):
        new_proof = 1
        check_proof = False 
        while check_proof is False:
            hash_operation = hashlib.sha256(str(new_proof**2 - previous_proof**2).encode()).hexdigest()
            if hash_operation[:5] == '00000':
                check_proof = True
            else:
                new_proof += 1
        return new_proof 
    def Hash(self, block):
        encoded_block = json.dumps(block, sort_keys=True).encode()
        return hashlib.sha256(encoded_block).hexdigest()
    def VerifyChain(self, msg_chain):
        if len(self.msg_chain) == 0:
            return True
        previous_block = msg_chain[0]
        for block in msg_chain[1:]:
            if block.get('previous_hash') != self.Hash(previous_block):
                return False
            previous_proof = previous_block.get('proof')
            proof = block.get('proof')
            hash_operation = hashlib.sha256(str(proof**2 - previous_proof**2).encode()).hexdigest()
            if hash_operation[:5] != '00000':
                return False
            previous_block = block
        return True

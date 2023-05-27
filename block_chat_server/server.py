import asyncio, json
from blockchain import Blockchain
from websockets.server import serve

with open('users.json') as user_file:
    total_users = json.load(user_file)

blockchain = Blockchain()

class BackendServer:
    def __init__(self):
        self.clients: list = []
    async def SendMessages(self, response):
        for websocket in self.clients:
            try:
                response.update({'type': 'msg_logs'})
                asyncio.create_task(websocket.send(json.dumps(response)))
            except: break
    async def ClientHandler(self, websocket, path):
        self.clients.append(websocket)
        print(f"Connected [{path[1:]}] [{websocket.remote_address[0]}:{websocket.remote_address[1]}]")
        try:
            async for data in websocket:
                data = json.loads(data)
                if data.get('type') == 'login':
                    print(data)
                    login = data.get('login', {})
                    if total_users.get(login.get('userid'), {}).get('password') == login.get('password'):
                        response = {"code": 200, "type": "full_msg_logs", "chain": blockchain.msg_chain}
                        await websocket.send(json.dumps(response))
                    else:
                        await websocket.send(json.dumps({"code": 404, "message": "User not Found"}))
                elif data.get('type') == 'send_msg_block':
                    print(data)
                    previous_block = blockchain.GetPreviousMsgBlock()
                    if previous_block.get('previous_hash') == data.get('previous_hash'):
                        previous_proof = previous_block.get('proof')
                        proof = blockchain.CalcProofOfWork(previous_proof)
                        previous_hash = blockchain.Hash(previous_block)
                        block = blockchain.CreateMsgBlock(proof, previous_hash, data.get('msg'), data.get('author', ''))
                        if block == None:
                            await websocket.send(json.dumps({"code": 404, "message": "Block Chain Verification Failed"}))
                        else:
                            response = {
                                        "code": 200,
                                        'index': block.get('index'),
                                        'timestamp': block.get('timestamp'),
                                        'author': data.get('author'),
                                        'msg': data.get('msg'),
                                        'proof': block.get('proof'),
                                        'previous_hash': block.get('previous_hash')
                                    }
                            print(block)
                            print(response)
                            asyncio.create_task(self.SendMessages(response))
                    else:
                        await websocket.send(json.dumps({"code": 404, "message": "Unauthorized Access"}))
                elif data.get('type') == 'get_msg_blocks':
                    response = {"code": 200, "type": "full_msg_logs", "chain": blockchain.msg_chain}
                    print(response)
                    await websocket.send(json.dumps(response))
                elif data.get('type') == 'check_block_chain':
                    valid = blockchain.VerifyChain(blockchain.msg_chain)
                    if valid:
                        message, code = 'The Blockchain is valid.', 200
                    else:
                        message, code = 'The Blockchain is not valid.', 404
                    await websocket.send(json.dumps({"code": code, 'type': 'verify_chain', "message": message}))
                else:
                    print(f"[{websocket.remote_address[0]}:{websocket.remote_address[1]}] sends {json.loads(data)} from {path[1:]}")
        except:
            print(f"Disconnected [{path[1:]}] [{websocket.remote_address[0]}:{websocket.remote_address[1]}]")
            self.clients.remove(websocket)
    async def BlockChatServer(self):
        async with serve(self.ClientHandler, "0.0.0.0", 8000):
            await asyncio.Future()

if __name__ == '__main__':
    print("BlockChat BackEnd Server")
    print("Waiting for the Connections")
    asyncio.run(BackendServer().BlockChatServer())

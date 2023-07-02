# TechTriumph 1.0

TechTriumph 1.0 - 18hrs Hackathon
This is a Chat App Project which is Based on BlockChain Technique.

# Working
- At first the backend server sends the first hash value to the connected clients
- Then client sends the previous hash value along with the message data to the backend server
- Then the backend server will check if the hash value being sent matches with the last Hash present in the server's array.
- Upon successfully verifying the hash, it will then broadcast the message and the new hash value to all other connected clients.

# Setup
**First Git clone this Repo**
> Backend Server
- change directory to `cd block_chat_server`
- Install all the required packages by `python -m pip install -r requirements.txt`
- Start the Backend Server with the command `python server.py` and the Websocket Server will be started
> Frontend NextJS
- change directory to `cd block_chat_web`
- Install the Packages by running `npm i`
- Build the Frontend with `npm run build`
- Run the Frontend with `npm start`

# Config
> Frontend
- change directory to `cd frix_cloud_web`
- Inside the Frontend `/app/chat/page.js` file
- Replace the Backend Websocket Server IP and Port
![ip_port](https://github.com/Yuvaraja28/BlockChat_Tech_Triumph_1.0/assets/64340067/1b595583-7842-4915-bc5a-fe4d473cc365)

# Showcase

![Chat](https://github.com/Yuvaraja28/BlockChat_Tech_Triumph_1.0/assets/64340067/1a4a0a89-a253-43e6-aa9c-ce5a9fe742b1)

'use client';
import './styles.scss'
import Image from 'next/image'
import { Fredoka, Lexend, Comfortaa, Secular_One } from 'next/font/google'
import useWebSocket from "react-use-websocket";
import { useState, useRef } from 'react';

const lexend = Lexend({ weight: ['400', '500', '600'], subsets: ['latin'] })
const comfortaa = Comfortaa({ weight: ['400', '500', '600', '700'], subsets: ['latin'] })
const secular_one = Secular_One({ weight: ['400'], subsets: ['latin'] })
const fredoka = Fredoka({ weight: ['400', '500', '600'], subsets: ['latin'] })

export default function ChatServer(req, res) {
  const [author, setAuthor] = useState(req.searchParams.userid)
  const [messageLogs, setMessageLogs] = useState([])
  const [previousHash, setPreviousHash] = useState()
  const [webSocketStatus, setWebSocketStatus] = useState(false)
  const [authorized, setAuthorized] = useState(false)
  const msg_input = useRef()
  const msg_output = useRef()
  const { sendJsonMessage, getWebSocket } = useWebSocket('ws://127.0.0.1:8000', {
    onOpen: () => {console.log('BlockChat Websocket Opened'); (req.searchParams.userid === undefined) ? '' : sendJsonMessage({type: 'login', login: req.searchParams}); setWebSocketStatus(true); setAuthorized(true)},
    onClose: () => {console.log('BlockChat Websocket Closed'); setWebSocketStatus(false)},
    shouldReconnect: (closeEvent) => true,
    onMessage: (event) =>  processMessages(event)
  });
  function processMessages(event) {
    let data = JSON.parse(event.data)
    console.log(data)
    if (data.code === 404) {
      setMessageLogs([])
      setPreviousHash(null)
      setAuthorized(false)
      console.log("Unauthorized User Access")
    } else if (data.type === 'msg_logs') {
      console.log(data)
      console.log(messageLogs)
      setMessageLogs([...messageLogs, data])
      setPreviousHash(data.previous_hash)
      setAuthorized(true)
      console.log(data.previous_hash)
    } else if (data.type === 'full_msg_logs') {
      console.log(data.chain)
      setMessageLogs(data.chain)
      setPreviousHash(data.chain[data.chain.length - 1].previous_hash)
      setAuthorized(true)
    }
    msg_output.current.scrollTop = msg_output.current.scrollHeight;
  }
  function SendMessage(event) {
    if ((authorized) && (webSocketStatus === true)) {
      if (msg_input.current.value != '') {
        sendJsonMessage({type: 'send_msg_block', author: author, msg: msg_input.current.value, previous_hash: previousHash})
        msg_input.current.value = ''
      }
    }
  }
  return (
    <div className={'maincontainer'}>
      <div className={'topnav'}>
        <span className={[fredoka.className, 'topheading'].join(' ')}>BlockChat</span>
        <div className={'profile-box'}>
          <span className={lexend.className}>{((!authorized || (req.searchParams.userid === undefined))) ? 'Not Authorized' : (author.charAt(0).toUpperCase(0) + author.slice(1))}</span>
          {((!authorized || (req.searchParams.userid === undefined))) ? '' :<Image alt='user_profile' src={'/' + author + '.png'} width={40} height={40} style={{ borderRadius: '50%', boxShadow: "rgba(0, 0, 0, 0.19) 0px 10px 20px, rgba(0, 0, 0, 0.23) 0px 6px 6px" }}></Image>}
        </div>
      </div>
      <div className={'main_inner_container'}>
        <div className={'active-users-list'}>
          <span className={['total-active-head', secular_one.className].join(' ')}>Users</span>
          {['adhil', 'kamal', 'leo', 'yuvaraja'].map(s =>
            ((s !== author) ? <div key={Math.random()} className={'user'}>
              <Image key={Math.random()} alt='user_profile' src={'/' + s + '.png'} width={35} height={35}></Image>
              <span key={Math.random()} className={lexend.className}>{s.charAt(0).toUpperCase(0) + s.slice(1)}</span>          
            </div> : '')
          )}
        </div>
        <div className={'total-messages'} ref={msg_output}>
          <span className={['total-messages-head', secular_one.className].join(' ')}>Chats - <span style={{ color: ((!authorized || (req.searchParams.userid === undefined))) ? 'red' : (webSocketStatus) ? '#14e014' : 'red' }}>{((!authorized || (req.searchParams.userid === undefined))) ? 'Not Authorized' : (webSocketStatus) ? 'Connected' : 'Disconnected'}</span></span>
          <div className={'message-main-container'}>
            {messageLogs.slice(1).map(msg =>
              <div key={Math.random()} className={'sent-messages'} style={{ alignItems: ((msg.author === author) ? 'flex-end' : 'flex-start') }}>
                <div className={'message-container'} style={{ alignItems: ((msg.author === author) ? 'flex-end' : 'flex-start') }}>
                  <div className={'message-header'}>
                    <span className={['message-author', secular_one.className].join(' ')}>
                      <Image alt='user_profile' src={'/' + msg.author + '.png'} width={15} height={15}></Image>
                      {msg.author.charAt(0).toUpperCase(0) + msg.author.slice(1)}
                    </span>
                    <span className={['message-timestamp', lexend.className].join(' ')}>{new Date(msg.timestamp).toDateString()} {new Date(msg.timestamp).toLocaleTimeString()}</span>
                  </div>
                  <span className={['message-content', comfortaa.className].join(' ')}>{msg.msg}</span>
                </div> 
              </div>
            )}
          </div>
          <div className={'sent-messages-control'}>
            <input ref={msg_input} onKeyDown={s => ((s.code === 'Enter') ? SendMessage(s) : '')} className={lexend.className} placeholder='Enter a Message'></input>
            <button onClick={s => SendMessage(s)} className={lexend.className}>Send</button>
          </div>
        </div>
      </div>
    </div>        
  )
}

'use client';
import Image from 'next/image'
import './styles.scss'
import { useRouter } from 'next/navigation'

export default function Login() {
  const router = useRouter()
  return (
    <>
      <img alt='bg' style={{ position: 'absolute' }} src='/bg.jpg'></img>
      <div style={{ position: 'absolute' }} className="container">
        <Image alt='logo' src='/favicon.ico' width={125} height={125}></Image>
        <form action="/chat" method="GET">
          <input type="text" name="userid" placeholder="UserID" required />
          <input type="password" name="password" placeholder="Password" required />
          <input className={'submit'} type="submit" value="Log In" />
        </form>
      </div>
    </>
  )
}

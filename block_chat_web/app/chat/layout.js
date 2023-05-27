import '../globals.css'

export const metadata = {
  title: 'Block Chat',
  description: 'Block Chain Chat Server',
}

export default function RootChatLayout({ children }) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  )
}

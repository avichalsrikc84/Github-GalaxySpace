import "./globals.css"
import Providers from "./providers"

export default function RootLayout({ children }: any){
  return (
    <html lang="en">
      <body style={{ margin: 0, overflow: "hidden" }}>
        <Providers>
          {children}
        </Providers>
      </body>
    </html>
  )
}
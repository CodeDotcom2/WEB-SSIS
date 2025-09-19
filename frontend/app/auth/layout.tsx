export default function AuthLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <div className="h-screen flex items-center justify-center bg-[radial-gradient(circle_at_15%_5%,_#3a3a4a_0%,_#1a1a1a_10%,_#000814_50%,_#000815_100%)] text-white">
      <main>
        {children}
      </main>
    </div>
  )
}

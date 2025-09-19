import Sidebar from "@/components/Sidebar"

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <div className="h-screen grid grid-cols-[300px_1fr] overflow-hidden bg-[radial-gradient(circle_at_15%_5%,_#3a3a4a_0%,_#1a1a1a_10%,_#000814_50%,_#000815_100%)]">
      <Sidebar />
      <main className="flex flex-col p-6 overflow-auto bg-transparent text-white">
        {children}
      </main>
    </div>
  )
}

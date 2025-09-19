"use client"

import { Button } from "@/components/ui/button"
import { useState, useEffect } from "react"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogTrigger,
} from "@/components/ui/dialog"

export default function AddProgramDialog({ onAdd }: { onAdd: () => void }) {
  const [colleges, setColleges] = useState<any[]>([])
  const [programName, setProgramName] = useState("")
  const [programCode, setProgramCode] = useState("")
  const [collegeId, setCollegeId] = useState("")
  const [loading, setLoading] = useState(false)
  const [open, setOpen] = useState(false)

  useEffect(() => {
    async function fetchColleges() {
      try {
        const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/dashboard/colleges`)
        const data = await res.json()
        setColleges(data.colleges || [])
      } catch (err) {
        console.error("Error fetching colleges:", err)
      }
    }
    fetchColleges()
  }, [])

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (!programName || !programCode || !collegeId) return

    setLoading(true)
    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/dashboard/programs`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          program_code: programCode,
          program_name: programName,
          college_id: parseInt(collegeId, 10),
        }),
      })

      if (res.ok) {
        setProgramName("")
        setProgramCode("")
        setCollegeId("")
        onAdd()       // 🔑 refresh parent list
        setOpen(false) // 🔑 close dialog
      } else {
        const data = await res.json()
        alert(data.error || "Failed to add program")
      }
    } catch (err) {
      console.error(err)
      alert("Something went wrong")
    } finally {
      setLoading(false)
    }
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="blue" size="lg">Add Program</Button>
      </DialogTrigger>
      <DialogContent className="glass2 sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle className="text-white">Add Program</DialogTitle>
          <DialogDescription>
            Fill in the details below to add a new Program.
          </DialogDescription>
        </DialogHeader>
        <form className="flex flex-col gap-4" onSubmit={handleSubmit}>
          <input
            value={programName}
            onChange={e => setProgramName(e.target.value)}
            type="text"
            placeholder="Program Name"
            className="border border-gray-400 rounded-lg px-4 py-2 flex-1 bg-transparent text-white placeholder-gray-400 focus:border-white focus:outline-none"
          />
          <input
            value={programCode}
            onChange={e => setProgramCode(e.target.value)}
            type="text"
            placeholder="Program Code"
            className="border border-gray-400 rounded-lg px-4 py-2 flex-1 bg-transparent text-white placeholder-gray-400 focus:border-white focus:outline-none"
          />
          <select
            value={collegeId}
            onChange={e => setCollegeId(e.target.value)}
            className="border border-gray-400 rounded-lg px-4 py-2 flex-1 bg-transparent focus:border-white focus:outline-none text-gray-400 invalid:text-gray-400 valid:text-white"
            required
          >
            <option value="" disabled hidden className="bg-gray-900 text-white">
              Select College
            </option>
            {colleges.map((c) => (
              <option key={c.id} value={c.id} className="bg-gray-900 text-white">
                {c.college_name}
              </option>
            ))}
          </select>
          <Button variant="blue" type="submit" disabled={loading}>
            {loading ? "Saving..." : "Save"}
          </Button>
        </form>
      </DialogContent>
    </Dialog>
  )
}

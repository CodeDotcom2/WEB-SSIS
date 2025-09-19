"use client"

import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogTrigger,
  DialogClose
} from "@/components/ui/dialog"
import { useState } from "react"

export default function AddCollegeDialog({ onAdd }: { onAdd: () => void }) {
  const [collegeName, setCollegeName] = useState("")
  const [collegeCode, setCollegeCode] = useState("")
  const [loading, setLoading] = useState(false)
  const [open, setOpen] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!collegeName || !collegeCode) return

    setLoading(true)
    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/dashboard/colleges`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ college_name: collegeName, college_code: collegeCode }),
      })



      if (res.ok) {
        setCollegeName("")
        setCollegeCode("")
        onAdd()
        setOpen(false) // Refresh parent list
      } else {
        const data = await res.json()
        alert(data.error || "Failed to add college")
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
        <Button variant="blue" size="lg">Add College</Button>
      </DialogTrigger>
      <DialogContent className="glass2 sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle className="text-white">Add College</DialogTitle>
          <DialogDescription>
            Fill in the details below to add a new College.
          </DialogDescription>
        </DialogHeader>
        <form className="flex flex-col gap-4" onSubmit={handleSubmit}>
          <input
            value={collegeName}
            onChange={e => setCollegeName(e.target.value)}
            type="text"
            placeholder="College Name"
            className="border border-gray-400 rounded-lg px-4 py-2 flex-1 bg-transparent text-white placeholder-gray-400 focus:border-white focus:outline-none"
          />
          <input
            value={collegeCode}
            onChange={e => setCollegeCode(e.target.value)}
            type="text"
            placeholder="College Code"
            className="border border-gray-400 rounded-lg px-4 py-2 flex-1 bg-transparent text-white placeholder-gray-400 focus:border-white focus:outline-none"
          />
          <Button variant="blue" type="submit" disabled={loading}>
              {loading ? "Saving..." : "Save"}
          </Button>
        </form>
      </DialogContent>
    </Dialog>
  )
}

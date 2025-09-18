"use client"

import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogTrigger,
} from "@/components/ui/dialog"

export default function AddProgramDialog() {
  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant="blue" size="lg">Add Program</Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Add Program</DialogTitle>
          <DialogDescription>
            Fill in the details below to add a new Program.
          </DialogDescription>
        </DialogHeader>
        <form className="flex flex-col gap-4">
          <input
            type="text"
            placeholder="Program Name"
            className="border rounded-lg px-4 py-2"
          />
          <input
            type="text"
            placeholder="Program Code"
            className="border rounded-lg px-4 py-2"
          />
          <select className="border rounded-lg px-4 py-2 flex-1">
            <option value="">Select College</option>
            <option value="CCS">College of Computer Studies</option>
            <option value="CED">College of Education</option>
          </select>
          <Button type="submit">Save</Button>
        </form>
      </DialogContent>
    </Dialog>
  )
}

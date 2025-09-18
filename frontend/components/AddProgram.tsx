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
      <DialogContent className="glass2 sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle className="text-white">Add Program</DialogTitle>
          <DialogDescription>
            Fill in the details below to add a new Program.
          </DialogDescription>
        </DialogHeader>
        <form className="flex flex-col gap-4">
          <input
            type="text"
            placeholder="Program Name"
            className="border border-gray-400 rounded-lg px-4 py-2 flex-1 bg-transparent text-white placeholder-gray-400 focus:border-white focus:outline-none"
          />
          <input
            type="text"
            placeholder="Program Code"
            className="border border-gray-400 rounded-lg px-4 py-2 flex-1 bg-transparent text-white placeholder-gray-400 focus:border-white focus:outline-none"
          />
          <select className="border border-gray-400 rounded-lg px-4 py-2 flex-1 bg-transparent focus:border-white focus:outline-none text-gray-400 invalid:text-gray-400 valid:text-white"
              defaultValue=""required>
            <option value="" disabled hidden className="bg-gray-900 text-white">Select College</option>
            <option value="CCS" className="bg-gray-900 text-white">College of Computer Studies</option>
            <option value="CED" className="bg-gray-900 text-white">College of Education</option>
          </select>
          <Button variant="blue" type="submit">Save</Button>
        </form>
      </DialogContent>
    </Dialog>
  )
}

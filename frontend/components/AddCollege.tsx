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

export default function AddCollegeDialog() {
  return (
    <Dialog>
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
        <form className="flex flex-col gap-4">
          <input
            type="text"
            placeholder="College Name"
            className="border border-gray-400 rounded-lg px-4 py-2 flex-1 bg-transparent text-white placeholder-gray-400 focus:border-white focus:outline-none"
          />
          <input
            type="text"
            placeholder="College Code"
            className="border border-gray-400 rounded-lg px-4 py-2 flex-1 bg-transparent text-white placeholder-gray-400 focus:border-white focus:outline-none"
          />
          <Button variant="blue" type="submit">Save</Button>
        </form>
      </DialogContent>
    </Dialog>
  )
}

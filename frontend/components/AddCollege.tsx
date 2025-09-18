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
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Add College</DialogTitle>
          <DialogDescription>
            Fill in the details below to add a new College.
          </DialogDescription>
        </DialogHeader>
        <form className="flex flex-col gap-4">
          <input
            type="text"
            placeholder="College Name"
            className="border rounded-lg px-4 py-2"
          />
          <input
            type="text"
            placeholder="College Code"
            className="border rounded-lg px-4 py-2"
          />
          <Button type="submit">Save</Button>
        </form>
      </DialogContent>
    </Dialog>
  )
}

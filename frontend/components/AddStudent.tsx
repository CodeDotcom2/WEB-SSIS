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

export default function AddStudentDialog() {
  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant="blue" size="lg">Add Student</Button>
      </DialogTrigger>

      <DialogContent className="sm:max-w-[600px]">
        <DialogHeader>
          <DialogTitle>Add Student</DialogTitle>
          <DialogDescription>
            Fill in the details below to add a new student.
          </DialogDescription>
        </DialogHeader>

        <form className="flex flex-col gap-4">

          <div className="flex gap-4">
            <input
              type="text"
              placeholder="Last Name"
              className="border rounded-lg px-4 py-2 flex-1"
            />
            <input
              type="text"
              placeholder="First Name"
              className="border rounded-lg px-4 py-2 flex-1"
            />
          </div>

          <input
            type="text"
            placeholder="ID Number"
            className="border rounded-lg px-4 py-2 w-full"
          />

          <div className="flex gap-4">
            <select className="border rounded-lg px-4 py-2 flex-1">
              <option value="">Select Gender</option>
              <option value="Male">Male</option>
              <option value="Female">Female</option>
            </select>

            <select className="border rounded-lg px-4 py-2 flex-1">
              <option value="">Select Year Level</option>
              <option value="1st Year">1st Year</option>
              <option value="2nd Year">2nd Year</option>
              <option value="3rd Year">3rd Year</option>
              <option value="4th Year">4th Year</option>
            </select>
          </div>

          <div className="flex gap-4">
            <select className="border rounded-lg px-4 py-2 flex-1">
              <option value="">Select College</option>
              <option value="CCS">College of Computer Studies</option>
              <option value="CED">College of Education</option>
            </select>

            <select className="border rounded-lg px-4 py-2 flex-1">
              <option value="">Select Program</option>
              <option value="BSCS">BSCS</option>
              <option value="BSIT">BSIT</option>
              <option value="BSA">BSA</option>
            </select>
          </div>

          <Button type="submit" className="self-end">Save</Button>
        </form>
      </DialogContent>
    </Dialog>
  )
}



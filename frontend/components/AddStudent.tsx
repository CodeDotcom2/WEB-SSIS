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

      <DialogContent className="glass2 sm:max-w-[600px]">
        <DialogHeader>
          <DialogTitle className="text-white">Add Student</DialogTitle>
          <DialogDescription>
            Fill in the details below to add a new student.
          </DialogDescription>
        </DialogHeader>

        <form className="flex flex-col gap-4">

          <div className="flex gap-4">
            <input
              type="text"
              placeholder="Last Name"
              className="border border-gray-400 rounded-lg px-4 py-2 flex-1 bg-transparent text-white placeholder-gray-400 focus:border-white focus:outline-none"
            />
            <input
              type="text"
              placeholder="First Name"
              className="border border-gray-400 rounded-lg px-4 py-2 flex-1 bg-transparent text-white placeholder-gray-400 focus:border-white focus:outline-none"
            />
          </div>

          <input
            type="text"
            placeholder="ID Number"
            className="border border-gray-400 rounded-lg px-4 py-2 flex-1 bg-transparent text-white placeholder-gray-400 focus:border-white focus:outline-none"
          />

          <div className="bg-transparent flex gap-4">
            <select
              className="border border-gray-400 rounded-lg px-4 py-2 flex-1 bg-transparent focus:border-white focus:outline-none text-gray-400 invalid:text-gray-400 valid:text-white"
              defaultValue=""
              required
            >
              <option value="" disabled hidden className="bg-gray-900 text-white">Select Gender</option>
              <option value="Male" className="bg-gray-900 text-white">Male</option>
              <option value="Female" className="bg-gray-900 text-white">Female</option>
            </select>

            <select
              className="border border-gray-400 rounded-lg px-4 py-2 flex-1 bg-transparent focus:border-white focus:outline-none text-gray-400 invalid:text-gray-400 valid:text-white"
              defaultValue=""required>
              <option value="" disabled hidden className="bg-gray-900 text-white">Select Year Level</option>
              <option value="1st Year" className="bg-gray-900 text-white">1st Year</option>
              <option value="2nd Year" className="bg-gray-900 text-white">2nd Year</option>
              <option value="3rd Year" className="bg-gray-900 text-white">3rd Year</option>
              <option value="4th Year" className="bg-gray-900 text-white">4th Year</option>
            </select>
          </div>

          <div className="flex gap-4">
            <select className="border border-gray-400 rounded-lg px-4 py-2 flex-1 bg-transparent focus:border-white focus:outline-none text-gray-400 invalid:text-gray-400 valid:text-white"
              defaultValue=""required>
              <option value="" disabled hidden className="bg-gray-900 text-white">Select College</option>
              <option value="CCS" className="bg-gray-900 text-white">College of Computer Studies</option>
              <option value="CED" className="bg-gray-900 text-white">College of Education</option>
            </select>

            <select className="border border-gray-400 rounded-lg px-4 py-2 flex-1 bg-transparent focus:border-white focus:outline-none text-gray-400 invalid:text-gray-400 valid:text-white"
              defaultValue=""required>
              <option value="" disabled hidden className="bg-gray-900 text-white">Select Program</option>
              <option value="BSCS" className="bg-gray-900 text-white">BSCS</option>
              <option value="BSIT" className="bg-gray-900 text-white">BSIT</option>
              <option value="BSA" className="bg-gray-900 text-white">BSA</option>
            </select>
          </div>

          <Button variant="blue" type="submit" className="self-end">Save</Button>
        </form>
      </DialogContent>
    </Dialog>
  )
}



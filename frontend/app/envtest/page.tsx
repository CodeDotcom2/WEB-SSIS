"use client"

import { useEffect, useState } from "react"

export default function EnvTestPage() {
  const [students, setStudents] = useState<string[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function fetchStudents() {
      try {
        const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/students`)
        const data = await res.json()
        setStudents(data.students)  // expecting Flask to return { "students": [...] }
      } catch (error) {
        console.error("Error fetching students:", error)
      } finally {
        setLoading(false)
      }
    }

    fetchStudents()
  }, [])

  return (
    <div style={{ padding: "2rem" }}>
      <h1 style={{ fontSize: "1.5rem", fontWeight: "bold" }}>Env Test</h1>
      <p style={{ marginTop: "1rem" }}>
        Backend URL:{" "}
        <span style={{ color: "blue" }}>
          {process.env.NEXT_PUBLIC_API_URL}
        </span>
      </p>

      <div style={{ marginTop: "2rem" }}>
        <h2 style={{ fontSize: "1.25rem", fontWeight: "bold" }}>Students</h2>
        {loading ? (
          <p>Loading...</p>
        ) : (
          <ul>
            {students.map((s, i) => (
              <li key={i}>{s}</li>
            ))}
          </ul>
        )}
      </div>
    </div>
  )
}

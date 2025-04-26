

"use client"

import { useEffect, useState } from "react"

export function CountdownTimer({ daysLeft }: { daysLeft: number }) {
  const [time, setTime] = useState(calculateTimeLeft())

  function calculateTimeLeft() {
    const endTime = new Date()
    endTime.setDate(endTime.getDate() + daysLeft)
    endTime.setHours(0, 0, 0, 0)

    const now = new Date()
    const diff = endTime.getTime() - now.getTime()

    if (diff <= 0) return "00:00:00:00"

    const totalSeconds = Math.floor(diff / 1000)
    const days = String(Math.floor(totalSeconds / (3600 * 24))).padStart(2, "0")
    const hours = String(Math.floor((totalSeconds % (3600 * 24)) / 3600)).padStart(2, "0")
    const minutes = String(Math.floor((totalSeconds % 3600) / 60)).padStart(2, "0")
    const seconds = String(totalSeconds % 60).padStart(2, "0")

    return `${days}:${hours}:${minutes}:${seconds}`
  }

  useEffect(() => {
    const timer = setInterval(() => {
      setTime(calculateTimeLeft())
    }, 1000)

    return () => clearInterval(timer)
  }, [])

  return (
    <div className="text-sm font-mono text-muted-foreground">
      ⏰ Time Left: <span className="font-semibold text-foreground">{time}</span>
    </div>
  )
}

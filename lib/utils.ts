import { type ClassValue, clsx } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function formatDate(date: Date | string): string {
  const d = typeof date === 'string' ? new Date(date) : date
  return new Intl.DateTimeFormat('pt-BR', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric'
  }).format(d)
}

export function formatTime(time: string): string {
  return time.substring(0, 5) // HH:mm
}

export function formatDateTime(date: string, time: string): string {
  const dateObj = new Date(date)
  return `${formatDate(dateObj)} às ${formatTime(time)}`
}

export function isPastDate(date: string, time: string): boolean {
  const dateTime = new Date(`${date}T${time}`)
  return dateTime < new Date()
}


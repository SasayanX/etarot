"use client"

type GrowthEventProperties = Record<string, string | number | boolean | null | undefined>

declare global {
  interface Window {
    dataLayer?: Array<Record<string, unknown>>
  }
}

export function trackGrowthEvent(eventName: string, properties: GrowthEventProperties = {}) {
  if (typeof window === "undefined") return

  const payload = {
    event: eventName,
    ...properties,
    timestamp: new Date().toISOString(),
  }

  window.dataLayer?.push(payload)
  console.log("[growth-event]", payload)
}

export function incrementGrowthCounter(key: string) {
  if (typeof window === "undefined") return 0

  const currentValue = Number.parseInt(localStorage.getItem(key) || "0", 10) || 0
  const nextValue = currentValue + 1
  localStorage.setItem(key, nextValue.toString())
  return nextValue
}

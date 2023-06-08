import React from "react"
// import '@/styles/globals.css'
import type { GlobalProvider } from "@ladle/react"

export const Provider: GlobalProvider = ({ children }) => (
  <div className="min-h-screen bg-slate-50">{children}</div>
)

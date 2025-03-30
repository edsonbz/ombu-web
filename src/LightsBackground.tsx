// src/components/ui/LightsBackground.tsx
import { ReactNode } from "react"
import "@/pages/Login/LoginView.css" // Donde están tus estilos .light .x1 .x2 ...

export default function LightsBackground({ children }: { children: ReactNode }) {
  return (
    <>
      <div className="light x1" />
      <div className="light x2" />
      <div className="light x3" />
      <div className="light x4" />
      <div className="light x5" />
      <div className="light x6" />
      <div className="light x7" />
      <div className="light x8" />
      <div className="light x9" />
      {children}
    </>
  )
}

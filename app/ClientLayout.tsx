"use client"

import type React from "react"
import { Suspense } from "react"
import { useSearchParams } from 'next/navigation'
import { useEffect, useState } from "react"

function ClientLayoutContent({
  children,
}: {
  children: React.ReactNode
}) {
  const searchParams = useSearchParams()
  const [fromTetelPontocom, setFromTetelPontocom] = useState(false)

  useEffect(() => {
    const origem = searchParams.get("origem")
    if (origem === "tetelpontocom") {
      setFromTetelPontocom(true)
    }
  }, [searchParams])

  useEffect(() => {
    if (!(window as any).fbq) return
    const fbq = (window as any).fbq

    // PageView ao carregar
    fbq("track", "PageView")
    console.log("✅ Pixel: PageView registrado (Bolos Caseiros)")

    // Lead (clique nos botões principais)
    const ctas = document.querySelectorAll("a, button")
    ctas.forEach((el) => {
      el.addEventListener("click", () => {
        const label =
          el.getAttribute("aria-label") ||
          el.textContent?.trim() ||
          "Lead-Desconhecido"
        fbq("trackCustom", "LeadClick", { label })
        console.log(`🎯 Lead registrado: ${label}`)
      })
    })

    // Simulação de intenção de compra
    const start = Date.now()
    const timer = setInterval(() => {
      const timeSpent = Math.floor((Date.now() - start) / 1000)
      if (timeSpent === 30) {
        fbq("trackCustom", "EngajamentoProduto", { segundos: 30 })
        console.log("🕒 Engajamento inicial detectado (30s)")
      }
    }, 5000)

    return () => clearInterval(timer)
  }, [])

  return (
    <div className="antialiased bg-[#FFF8F3] text-gray-900 font-[Inter,sans-serif] min-h-screen flex flex-col">
      {fromTetelPontocom && (
        <header className="w-full bg-[#FFF8F3] backdrop-blur sticky top-0 z-50 border-b border-black/5">
          <div className="w-full px-4 sm:px-6 py-3 flex items-center justify-center">
            <div className="flex items-center space-x-2">
              <img
                src="https://hebbkx1anhila5yf.public.blob.vercel-storage.com/Log_Tetelpontocom-wmLNs1o1yMQuoQekkSKWwB0thoOL6D.png"
                alt="TetelPontocom"
                className="w-7 h-7 rounded-sm"
              />
              <span className="text-[15px] font-semibold tracking-tight text-gray-900">TetelPontocom</span>
            </div>
          </div>
        </header>
      )}

      {/* CONTEÚDO PRINCIPAL */}
      <main className="flex-1">{children}</main>

      {fromTetelPontocom && (
        <div className="py-12 text-center">
          <a
            href="https://tetelpontocom.tetel.online"
            className="inline-flex items-center justify-center bg-black text-white px-6 py-3 rounded-full text-sm font-medium hover:opacity-80 transition"
          >
            Voltar à TetelPontocom →
          </a>
        </div>
      )}
    </div>
  )
}

export default function ClientLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <Suspense
      fallback={
        <div className="antialiased bg-[#FFF8F3] text-gray-900 font-[Inter,sans-serif] min-h-screen flex flex-col">
          {children}
        </div>
      }
    >
      <ClientLayoutContent>{children}</ClientLayoutContent>
    </Suspense>
  )
}

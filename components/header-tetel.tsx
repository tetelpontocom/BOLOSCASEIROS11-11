"use client"
import Image from "next/image"

export default function HeaderTetel() {
  return (
    <header className="w-full bg-[#FFF8F5] flex flex-col items-center justify-center py-3 shadow-sm">
      <div className="flex items-center space-x-2">
        <Image
          src="https://hebbkx1anhila5yf.public.blob.vercel-storage.com/Log_Tetelpontocom-wmLNs1o1yMQuoQekkSKWwB0thoOL6D.png"
          alt="TetelPontocom Logo"
          width={28}
          height={28}
          className="rounded-sm"
        />
        <span className="text-[15px] font-semibold text-gray-800 tracking-tight">TetelPontocom</span>
      </div>
    </header>
  )
}

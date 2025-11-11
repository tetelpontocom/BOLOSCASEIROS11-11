"use client"
import type React from "react"
import { useEffect, useMemo, useState, useCallback } from "react"

/* ----------------------------- Helpers base ------------------------------ */
const useUTM = () => {
  const [utm, setUtm] = useState<Record<string, string>>({})
  useEffect(() => {
    try {
      const params = new URLSearchParams(window.location.search)
      const keys = ["utm_source", "utm_medium", "utm_campaign", "utm_content", "utm_term"]
      const obj: Record<string, string> = {}
      keys.forEach((k) => {
        const v = params.get(k)
        if (v) obj[k] = v
      })
      setUtm(obj)
    } catch {}
  }, [])
  return utm
}

const useMetaPixel = (pixelId: string, product: { name: string; category: string; price?: number }) => {
  const track = useCallback((event: string, payload?: Record<string, any>) => {
    try {
      if ((window as any)?.fbq) {
        ;(window as any).fbq("track", event, payload || {})
      }
    } catch (error) {
      console.error("[v0] Facebook Pixel track error:", error)
    }
  }, [])

  useEffect(() => {
    try {
      if ((window as any).fbq && (window as any)._fbq_initialized) {
        console.log("[v0] Facebook Pixel already initialized")
        return
      }

      if (!(window as any).fbq) {
        !((f: any, b: any, e: any, v: any, n?: any, t?: any, s?: any) => {
          if (f.fbq) return
          n = f.fbq = (...args: any[]) => {
            n.callMethod ? n.callMethod.apply(n, args) : n.queue.push(args)
          }
          if (!f._fbq) f._fbq = n
          n.push = n
          n.loaded = !0
          n.version = "2.0"
          n.queue = []
          t = b.createElement(e)
          t.async = !0
          t.src = v
          t.onerror = () => {
            console.error("[v0] Failed to load Facebook Pixel script")
          }
          t.onload = () => {
            console.log("[v0] Facebook Pixel script loaded successfully")
          }
          s = b.getElementsByTagName(e)[0]
          s.parentNode.insertBefore(t, s)
        })(window, document, "script", "https://connect.facebook.net/en_US/fbevents.js")
      }
      ;(window as any)._fbq_initialized = true
      ;(window as any).fbq("init", pixelId)
      ;(window as any).fbq("track", "PageView")
      ;(window as any).fbq("track", "ViewContent", {
        content_name: product.name,
        content_category: product.category,
        content_type: "product",
        value: product.price || 0,
        currency: "BRL",
      })
      console.log("[v0] Facebook Pixel initialized successfully")
    } catch (error) {
      console.error("[v0] Facebook Pixel initialization error:", error)
    }
  }, [pixelId, product])

  return { track }
}

/* ----------------------------- UI Primitivos ----------------------------- */
type CTAProps = {
  href: string
  label: string
  variant?: "primary" | "secondary" | "ghost"
  onClick?: () => void
  "data-track"?: string
}
const CTA: React.FC<CTAProps> = ({ href, label, variant = "primary", onClick, ...rest }) => {
  const base =
    "inline-flex items-center justify-center rounded-2xl px-6 py-3 text-base font-semibold transition-transform duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2"
  const styles =
    variant === "primary"
      ? "bg-black text-white hover:scale-[1.02] focus:ring-black/60"
      : variant === "secondary"
        ? "bg-white text-black hover:scale-[1.02] focus:ring-white/60"
        : "bg-transparent text-white/80 hover:text-white focus:ring-white/30"
  return (
    <a href={href} onClick={onClick} className={`${base} ${styles}`} aria-label={label} {...rest}>
      {label}
    </a>
  )
}

/* --------------------------------- Hero --------------------------------- */
const Hero: React.FC<{
  title: string
  subtitle: string
  description: string
  imageDesktop: string
  imageMobile?: string
  onCTAClick?: () => void
  ctaHref: string
}> = ({ title, subtitle, description, imageDesktop, imageMobile, onCTAClick, ctaHref }) => {
  return (
    <section className="relative isolate overflow-hidden bg-[#fff7f2]">
      <div className="mx-auto max-w-7xl px-4 py-16 sm:py-20 grid grid-cols-1 lg:grid-cols-2 gap-10 items-center">
        <div>
          <span className="inline-flex items-center gap-2 text-xs font-medium text-black/70">
            <span className="inline-block h-2 w-2 rounded-full bg-amber-500" /> by TetelPontocom
          </span>
          <h1 className="mt-3 text-4xl sm:text-5xl font-extrabold text-black leading-tight">{title}</h1>
          <p className="mt-2 text-lg text-black/80 font-medium">{subtitle}</p>
          <p className="mt-4 text-black/70 text-base max-w-lg">{description}</p>

          <div className="mt-6 flex flex-wrap items-center gap-3">
            <a
              href={ctaHref}
              onClick={onCTAClick}
              className="rounded-2xl bg-black text-white px-6 py-3 font-semibold hover:scale-[1.03] transition-transform duration-200"
            >
              Quero começar agora
            </a>
            <a
              href="#oferta"
              className="rounded-2xl border border-black/30 px-6 py-3 font-medium text-black/80 hover:scale-[1.03] transition-transform duration-200"
            >
              Ver detalhes do kit
            </a>
          </div>

          <p className="mt-6 text-sm text-black/60">
            📈 Mais de <strong>1.200 alunas</strong> já aplicaram essas receitas e aumentaram suas vendas.
          </p>
        </div>

        {/* Hero Image */}
        <div className="relative w-full rounded-2xl overflow-hidden shadow-2xl">
          <picture>
            {imageMobile && <source media="(max-width: 640px)" srcSet={imageMobile} />}
            <img
              src={imageDesktop || "/placeholder.svg"}
              alt="Bolos Caseiros Lucrativos - TetelPontocom"
              className="w-full h-full object-cover"
              loading="eager"
              decoding="async"
            />
          </picture>
        </div>
      </div>

      {/* Mockups abaixo do hero */}
      <div className="mx-auto max-w-5xl px-4 pb-10">
        <div className="flex flex-wrap justify-center items-center gap-6">
          <div className="flex flex-col items-center">
            <img
              src="/images/bolos/mockup-pdf-bolos-caseiros.png"
              alt="PDF Ilustrado"
              className="h-20 sm:h-24 object-contain"
            />
            <span className="mt-2 text-sm font-medium text-black">PDF Ilustrado</span>
          </div>
          <div className="flex flex-col items-center">
            <img
              src="/images/bolos/mockup-video-bolos-caseiros.png"
              alt="Vídeo-Aulas"
              className="h-20 sm:h-24 object-contain"
            />
            <span className="mt-2 text-sm font-medium text-black">Vídeo-Aulas</span>
          </div>
          <div className="flex flex-col items-center">
            <img
              src="/images/bolos/mockup-planilha-bolos-caseiros.png"
              alt="Planilha de Custos"
              className="h-20 sm:h-24 object-contain"
            />
            <span className="mt-2 text-sm font-medium text-black">Planilha de Custos</span>
          </div>
        </div>
      </div>
    </section>
  )
}

/* ------------------------------- Seções ---------------------------------- */
const Section: React.FC<{ title?: string; children: React.ReactNode; id?: string }> = ({ title, children, id }) => (
  <section id={id} className="mx-auto max-w-6xl px-4 py-10">
    {title && <h2 className="text-2xl font-semibold text-black">{title}</h2>}
    <div className="mt-4 text-black/90">{children}</div>
  </section>
)

const FeatureCard: React.FC<{ title: string; desc: string }> = ({ title, desc }) => (
  <div className="rounded-2xl border border-black/10 bg-white p-5 shadow-sm">
    <h3 className="font-semibold">{title}</h3>
    <p className="mt-1 text-sm text-black/70">{desc}</p>
  </div>
)

/* --------------------------------- Page ---------------------------------- */
const Page: React.FC = () => {
  const pixelId = "1305167264321996"
  const product = useMemo(() => ({ name: "PLR — Bolos Caseiros", category: "PLR Culinária", price: 27 }), [])
  const utm = useUTM()
  const { track } = useMetaPixel(pixelId, product)

  const handleCheckout = useCallback(() => {
    try {
      track("InitiateCheckout", {
        content_name: product.name,
        value: product.price,
        currency: "BRL",
        ...utm,
      })
    } catch (error) {
      console.error("[v0] Checkout tracking error:", error)
    }
  }, [track, product, utm])

  const handleLead = useCallback(() => {
    try {
      track("Lead", { content_name: product.name, ...utm })
    } catch (error) {
      console.error("[v0] Lead tracking error:", error)
    }
  }, [track, product, utm])

  const checkoutHref = useMemo(() => {
    const base = "https://chk.eduzz.com/Q9NDEKXK01"
    const params = new URLSearchParams(utm as any)
    const qs = params.toString()
    return qs ? `${base}&${qs}` : base
  }, [utm])

  return (
    <div className="min-h-screen bg-white text-black">
      {/* HERO HÍBRIDA */}
      <section className="relative isolate overflow-hidden bg-[#fff6f0] py-16 sm:py-20">
        {/* Fundo fluido (efeito calda gourmet) */}
        <div
          className="absolute inset-0 bg-[radial-gradient(circle_at_30%_30%,rgba(255,180,150,0.25),transparent_70%),radial-gradient(circle_at_70%_70%,rgba(255,210,190,0.2),transparent_70%)] blur-3xl"
          aria-hidden="true"
        ></div>

        <div className="relative z-10 mx-auto max-w-6xl px-4 flex flex-col items-center text-center">
          {/* Hero principal */}
          <div className="w-full max-w-4xl mb-8">
            <picture>
              <source
                media="(max-width: 768px)"
                srcSet="https://hebbkx1anhila5yf.public.blob.vercel-storage.com/hero-bolos-caseiros-lucrativos-mobile-I3IwRqMWEDGNbiRpau4SaVxoGMxgpd.jpg"
              />
              <img
                src="https://hebbkx1anhila5yf.public.blob.vercel-storage.com/hero-bolos-caseiros-lucrativos-desktop-6GOVzUrAOWFcEwWGoLB7WqPEVSL2Sl.jpg"
                alt="Bolos Caseiros Lucrativos - Kit Completo TetelPontocom"
                className="w-full rounded-2xl shadow-xl object-cover"
                loading="eager"
                decoding="async"
              />
            </picture>
          </div>

          {/* Título e descrição */}
          <h1 className="text-4xl sm:text-5xl font-extrabold text-gray-900 leading-tight">Bolos Caseiros Lucrativos</h1>
          <p className="mt-2 text-xl font-medium text-amber-700">Simples, bonitos e que vendem</p>
          <p className="mt-4 text-gray-700 text-base sm:text-lg max-w-2xl">
            Transforme receitas simples em renda real. Kit completo com vídeo-aulas, PDF ilustrado e planilha de custos
            para lucrar hoje mesmo.
          </p>

          {/* Mockups */}
          <div className="mt-10 flex flex-wrap justify-center gap-8">
            <div className="flex flex-col items-center w-32">
              <img
                src="https://hebbkx1anhila5yf.public.blob.vercel-storage.com/mockup-pdf-bolos-caseiros-nphnxVcQBM4rH4FhVRW1rAigMmEH9Q.png"
                alt="PDF Ilustrado com Receitas"
                className="rounded-md shadow-md h-28 object-contain"
                loading="lazy"
                decoding="async"
              />
              <p className="font-medium mt-2 text-sm">PDF Ilustrado</p>
            </div>
            <div className="flex flex-col items-center w-32">
              <img
                src="https://hebbkx1anhila5yf.public.blob.vercel-storage.com/mockup-video-bolos-caseiros-ApdHcUoQojlMahSNpTa1fn7kVEiZs6.png"
                alt="Vídeo-Aulas em Formato Prático"
                className="rounded-md shadow-md h-28 object-contain"
                loading="lazy"
                decoding="async"
              />
              <p className="font-medium mt-2 text-sm">Vídeo-Aulas</p>
            </div>
            <div className="flex flex-col items-center w-32">
              <img
                src="https://hebbkx1anhila5yf.public.blob.vercel-storage.com/mockup-planilha-bolos-caseiros-VoVO42dccZxl513uiGdU1lijd8nFwJ.png"
                alt="Planilha de Custos para Precificação"
                className="rounded-md shadow-md h-28 object-contain"
                loading="lazy"
                decoding="async"
              />
              <p className="font-medium mt-2 text-sm">Planilha de Custos</p>
            </div>
          </div>

          {/* CTAs */}
          <div className="mt-10 flex flex-wrap justify-center gap-4">
            <a
              href={checkoutHref}
              onClick={handleCheckout}
              className="bg-black text-white px-6 py-3 rounded-2xl font-semibold hover:scale-[1.03] transition-transform duration-200"
            >
              Quero começar agora
            </a>
            <a
              href="#oferta"
              className="border border-black/30 px-6 py-3 rounded-2xl font-medium text-black/80 hover:scale-[1.03] transition-transform duration-200"
            >
              Ver tudo que está incluso
            </a>
          </div>

          {/* Selo técnico */}
          <p className="mt-8 text-sm text-black/60">
            Parte do Ecossistema <strong>TetelPontocom</strong> — compatível com o padrão{" "}
            <strong>V0 Free Safe Mode</strong>.
          </p>
        </div>
      </section>

      {/* ========================= OFERTA ========================= */}
      <section id="oferta" className="py-16 bg-white text-center" data-scope="features">
        <h2 className="text-2xl sm:text-3xl font-bold mb-6 text-gray-900">O que vem no Kit Completo</h2>
        <div className="max-w-3xl mx-auto text-gray-700 text-lg space-y-3 text-left feature-list">
          <div className="feature-item">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth={2}
              stroke="currentColor"
            >
              <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 12.75l6 6 9-13.5" />
            </svg>
            <span>Receitas testadas com ingredientes simples e acessíveis</span>
          </div>

          <div className="feature-item">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth={2}
              stroke="currentColor"
            >
              <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 12.75l6 6 9-13.5" />
            </svg>
            <span>PDF ilustrado com instruções passo a passo e medidas exatas</span>
          </div>

          <div className="feature-item">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth={2}
              stroke="currentColor"
            >
              <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 12.75l6 6 9-13.5" />
            </svg>
            <span>Vídeo-aulas curtas e práticas para acelerar o aprendizado</span>
          </div>

          <div className="feature-item">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth={2}
              stroke="currentColor"
            >
              <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 12.75l6 6 9-13.5" />
            </svg>
            <span>Planilha de custos para precificar e lucrar com clareza</span>
          </div>

          <div className="feature-item">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth={2}
              stroke="currentColor"
            >
              <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 12.75l6 6 9-13.5" />
            </svg>
            <span>Estratégia de apresentação e fotografia com celular</span>
          </div>
        </div>

        <div className="mt-10">
          <a
            href={checkoutHref}
            onClick={handleCheckout}
            className="bg-amber-600 hover:bg-amber-700 text-white font-semibold px-8 py-4 rounded-2xl shadow-lg transition-transform hover:scale-[1.02]"
          >
            Quero garantir meu acesso agora
          </a>
        </div>
      </section>

      {/* ========================= POR QUE FUNCIONA ========================= */}
      <section className="py-14 bg-[#fff6f0] text-center">
        <h2 className="text-2xl font-bold text-gray-900 mb-4">Por que funciona</h2>
        <p className="text-gray-700 max-w-2xl mx-auto leading-relaxed">
          Porque foi criado para quem quer resultados reais, sem enrolação. Tudo foi testado, ajustado e otimizado para
          gerar retorno rápido e sustentável — no seu ritmo.
        </p>
        <p className="text-sm text-gray-500 mt-4">
          Parte do Ecossistema <strong>TetelPontocom</strong> — compatível com o padrão{" "}
          <strong>V0 Free Safe Mode</strong>.
        </p>
      </section>

      {/* ========================= RODAPÉ ========================= */}
      <footer className="bg-[#fff6f0] border-t border-gray-200 py-10 text-center text-gray-700">
        <div className="max-w-5xl mx-auto px-4 space-y-4">
          <div className="flex flex-col items-center space-y-2">
            <span className="font-semibold text-lg">TetelPontocom</span>
            <p className="text-sm text-gray-500">Ecossistema de projetos digitais — propósito, fluidez e resultado.</p>
          </div>

          <div className="flex flex-wrap justify-center gap-4 text-sm text-gray-600 mt-4">
            <a href="https://pravoce.tetel.online" className="hover:text-black transition">
              PraVocê
            </a>
            <a href="https://teteldigital.tetel.online" className="hover:text-black transition">
              TetelDigital
            </a>
            <a href="https://autoridadedigital.tetel.online" className="hover:text-black transition">
              Autoridade Digital
            </a>
            <a href="https://minhaia.tetel.online" className="hover:text-black transition">
              Minha IA
            </a>
          </div>

          <div className="border-t border-gray-200 my-6"></div>

          <div className="text-xs text-gray-500 space-y-1">
            <p>Pagamento seguro pela Eduzz · 7 dias de garantia</p>
            <p>
              © {new Date().getFullYear()} Todos os direitos reservados — <strong>TetelPontocom</strong>
            </p>
            <p>
              Compatível com o padrão <strong>V0 Free Safe Mode</strong> ·{" "}
              <span className="italic">feito com inteligência e propósito</span>
            </p>
          </div>
        </div>
      </footer>

      {/* Fallback noscript */}
      <noscript>
        <img
          height="1"
          width="1"
          style={{ display: "none" }}
          src={`https://www.facebook.com/tr?id=${pixelId}&ev=PageView&noscript=1`}
          alt=""
        />
      </noscript>
    </div>
  )
}

export default Page

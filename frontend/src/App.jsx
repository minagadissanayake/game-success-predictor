import { useState, useEffect, useRef } from "react"
import HeroSection from "./components/HeroSection"
import PredictorModal from "./components/PredictorModel"

function useInView(threshold = 0.15) {
  const ref = useRef(null)
  const [inView, setInView] = useState(false)
  useEffect(() => {
    const obs = new IntersectionObserver(([e]) => {
      if (e.isIntersecting) setInView(true)
    }, { threshold })
    if (ref.current) obs.observe(ref.current)
    return () => obs.disconnect()
  }, [])
  return [ref, inView]
}

export { useInView }

function TiltCard({ children, delay = 0, inView }) {
  const cardRef = useRef(null)
  const [tilt, setTilt] = useState({ x: 0, y: 0 })
  const [hovered, setHovered] = useState(false)

  const handleMouseMove = (e) => {
    const rect = cardRef.current.getBoundingClientRect()
    const x = ((e.clientX - rect.left) / rect.width - 0.5) * 16
    const y = ((e.clientY - rect.top) / rect.height - 0.5) * -16
    setTilt({ x, y })
  }

  return (
    <div
      ref={cardRef}
      onMouseMove={handleMouseMove}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => { setHovered(false); setTilt({ x: 0, y: 0 }) }}
      style={{
        opacity: inView ? 1 : 0,
        transform: inView
          ? `perspective(600px) rotateX(${tilt.y}deg) rotateY(${tilt.x}deg) translateY(${hovered ? -6 : 0}px)`
          : "translateY(24px)",
        transition: `opacity 0.6s ease ${delay}s, transform ${hovered ? "0.1s" : "0.6s"} ease ${hovered ? "0s" : delay + "s"}`,
        position: "relative",
        background: hovered ? "rgba(30,39,64,0.85)" : "rgba(20,28,50,0.6)",
        border: `1px solid ${hovered ? "rgba(245,158,11,0.35)" : "rgba(245,158,11,0.1)"}`,
        borderRadius: "16px", padding: "28px 24px",
        backdropFilter: "blur(16px)",
        boxShadow: hovered
          ? "0 20px 60px rgba(0,0,0,0.5), 0 0 30px rgba(245,158,11,0.1), inset 0 1px 0 rgba(255,255,255,0.08)"
          : "0 4px 20px rgba(0,0,0,0.3), inset 0 1px 0 rgba(255,255,255,0.03)",
        cursor: "default", willChange: "transform",
      }}
    >
      <div style={{ position: "absolute", top: 0, left: 0, right: 0, height: "1px", background: `linear-gradient(90deg, transparent, rgba(245,158,11,${hovered ? 0.6 : 0.15}), transparent)`, borderRadius: "16px 16px 0 0", transition: "all 0.3s" }} />
      {hovered && <div style={{ position: "absolute", inset: 0, borderRadius: "16px", background: "radial-gradient(ellipse at 50% 0%, rgba(245,158,11,0.06), transparent 70%)", pointerEvents: "none" }} />}
      {children}
    </div>
  )
}

function HowItWorks() {
  const [ref, inView] = useInView(0.1)
  const steps = [
    { num: "01", title: "Feature Engineering", desc: "Genre, platform count, release year, engagement signals, and publisher tier extracted from 474k+ RAWG games." },
    { num: "02", title: "XGBoost Training", desc: "Gradient boosted trees trained on 4,733 Metacritic-scored games with 80/20 stratified split." },
    { num: "03", title: "SHAP Explainability", desc: "TreeExplainer surfaces the exact contribution of each feature to the model's prediction." },
    { num: "04", title: "Instant Prediction", desc: "FastAPI serves results in milliseconds. React renders your probability, verdict, and factor breakdown." },
  ]

  return (
    <div id="model" ref={ref} style={{ position: "relative", zIndex: 1, maxWidth: "1000px", margin: "0 auto", padding: "80px 24px" }}>
      <div style={{ opacity: inView ? 1 : 0, transform: inView ? "none" : "translateY(16px)", transition: "all 0.6s ease", marginBottom: "48px" }}>
        <div style={{ fontSize: "0.68rem", color: "#F59E0B", letterSpacing: "0.15em", textTransform: "uppercase", marginBottom: "12px", fontFamily: "'Geist', sans-serif" }}>Under the hood</div>
        <h2 style={{ fontFamily: "'Space Grotesk', sans-serif", fontSize: "clamp(1.8rem, 3vw, 2.5rem)", fontWeight: 700, color: "#F1F5F9", margin: 0 }}>
          How the model works
        </h2>
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(210px, 1fr))", gap: "16px", position: "relative", zIndex: 1 }}>
        {steps.map((s, i) => (
          <TiltCard key={i} delay={i * 0.1} inView={inView}>
            <div style={{ marginBottom: "20px" }}>
              <div style={{ fontFamily: "'Space Grotesk', sans-serif", fontSize: "2.2rem", fontWeight: 700, background: "linear-gradient(135deg, rgba(245,158,11,0.3), rgba(245,158,11,0.1))", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent", lineHeight: 1 }}>{s.num}</div>
            </div>
            <div style={{ fontFamily: "'Space Grotesk', sans-serif", fontSize: "1rem", fontWeight: 600, color: "#F1F5F9", marginBottom: "10px" }}>{s.title}</div>
            <div style={{ fontSize: "0.82rem", color: "#64748B", lineHeight: 1.65, fontFamily: "'Geist', sans-serif" }}>{s.desc}</div>
            {i < steps.length - 1 && (
              <div style={{ position: "absolute", right: "-9px", top: "50px", width: "17px", height: "17px", borderRadius: "50%", background: "#0A0E1A", border: "1px solid rgba(245,158,11,0.3)", display: "flex", alignItems: "center", justifyContent: "center", zIndex: 2 }}>
                <div style={{ width: "5px", height: "5px", borderRadius: "50%", background: "#F59E0B" }} />
              </div>
            )}
          </TiltCard>
        ))}
      </div>

      <div style={{ display: "flex", gap: "12px", flexWrap: "wrap", justifyContent: "center", marginTop: "48px", opacity: inView ? 1 : 0, transition: "opacity 0.8s ease 0.5s" }}>
        {["4,733 Games Trained", "70% Accuracy", "0.76 AUC-ROC", "9 Features", "SHAP Explainability"].map((pill, i) => (
          <div key={i} style={{ background: "rgba(245,158,11,0.07)", border: "1px solid rgba(245,158,11,0.18)", borderRadius: "999px", padding: "7px 16px", fontSize: "0.72rem", color: "#94A3B8", fontFamily: "'Geist', sans-serif", letterSpacing: "0.04em", backdropFilter: "blur(8px)", boxShadow: "inset 0 1px 0 rgba(255,255,255,0.05)" }}>
            {pill}
          </div>
        ))}
      </div>
    </div>
  )
}

function TechStack() {
  const [ref, inView] = useInView(0.1)
  const stack = [
    { layer: "ML Model", tech: "XGBoost", detail: "200 estimators, max depth 6" },
    { layer: "Explainability", tech: "SHAP", detail: "TreeExplainer, exact Shapley values" },
    { layer: "Data", tech: "RAWG / Kaggle", detail: "474k games, 4,733 scored" },
    { layer: "Backend", tech: "FastAPI", detail: "Deployed on Render" },
    { layer: "Frontend", tech: "React + Vite", detail: "Deployed on Vercel" },
    { layer: "Styling", tech: "Tailwind CSS", detail: "Custom glass design system" },
  ]

  return (
    <div id="stack" ref={ref} style={{ position: "relative", zIndex: 1, maxWidth: "1000px", margin: "0 auto", padding: "40px 24px 80px" }}>
      <div style={{ opacity: inView ? 1 : 0, transform: inView ? "none" : "translateY(16px)", transition: "all 0.6s ease", marginBottom: "40px" }}>
        <div style={{ fontSize: "0.68rem", color: "#F59E0B", letterSpacing: "0.15em", textTransform: "uppercase", marginBottom: "12px", fontFamily: "'Geist', sans-serif" }}>Built with</div>
        <h2 style={{ fontFamily: "'Space Grotesk', sans-serif", fontSize: "clamp(1.8rem, 3vw, 2.5rem)", fontWeight: 700, color: "#F1F5F9", margin: 0 }}>Tech Stack</h2>
      </div>
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))", gap: "12px" }}>
        {stack.map((s, i) => (
          <div key={i} style={{
            opacity: inView ? 1 : 0,
            transform: inView ? "none" : "translateY(16px)",
            transition: `opacity 0.5s ease ${i * 0.08}s, transform 0.5s ease ${i * 0.08}s`,
            display: "flex", alignItems: "center", gap: "16px",
            background: "rgba(20,28,50,0.5)", border: "1px solid rgba(245,158,11,0.1)",
            borderRadius: "12px", padding: "16px 20px", backdropFilter: "blur(12px)",
          }}>
            <div style={{ width: "3px", height: "36px", background: "linear-gradient(to bottom, #F59E0B, rgba(245,158,11,0.2))", borderRadius: "2px", flexShrink: 0 }} />
            <div>
              <div style={{ fontSize: "0.65rem", color: "#475569", textTransform: "uppercase", letterSpacing: "0.1em", fontFamily: "'Geist', sans-serif", marginBottom: "3px" }}>{s.layer}</div>
              <div style={{ fontFamily: "'Space Grotesk', sans-serif", fontWeight: 600, color: "#F1F5F9", fontSize: "0.95rem" }}>{s.tech}</div>
              <div style={{ fontSize: "0.72rem", color: "#334155", fontFamily: "'Geist', sans-serif", marginTop: "2px" }}>{s.detail}</div>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

export default function App() {
  const [modalOpen, setModalOpen] = useState(false)
  const [statsRef, statsInView] = useInView()

  // Expose openModal globally so HeroSection can call it
  useEffect(() => {
    window.__openPredictorModal = () => setModalOpen(true)
    return () => { delete window.__openPredictorModal }
  }, [])

  return (
    <div style={{ background: "#0A0E1A", minHeight: "100vh", fontFamily: "'Geist', sans-serif", overflowX: "hidden" }}>
      <div style={{ position: "fixed", inset: 0, pointerEvents: "none", zIndex: 0, overflow: "hidden" }}>
        <div style={{ position: "absolute", top: "-20%", left: "-10%", width: "600px", height: "600px", borderRadius: "50%", background: "radial-gradient(circle, rgba(245,158,11,0.05) 0%, transparent 70%)", animation: "orb 8s ease-in-out infinite" }} />
        <div style={{ position: "absolute", bottom: "-20%", right: "-10%", width: "500px", height: "500px", borderRadius: "50%", background: "radial-gradient(circle, rgba(251,146,60,0.04) 0%, transparent 70%)", animation: "orb 10s ease-in-out infinite reverse" }} />
      </div>

      <style>{`
        @keyframes orb { 0%,100%{transform:scale(1);opacity:1} 50%{transform:scale(1.1);opacity:0.7} }
        .fade-up{opacity:0;transform:translateY(32px);transition:opacity 0.7s ease,transform 0.7s ease}
        .fade-up.visible{opacity:1;transform:translateY(0)}
        .fade-up.d1{transition-delay:0.1s}.fade-up.d2{transition-delay:0.2s}
        .fade-up.d3{transition-delay:0.3s}.fade-up.d4{transition-delay:0.4s}
        ::-webkit-scrollbar{width:4px}
        ::-webkit-scrollbar-track{background:#0A0E1A}
        ::-webkit-scrollbar-thumb{background:#F59E0B;border-radius:2px}
      `}</style>

      <HeroSection onOpenModal={() => setModalOpen(true)} />

      {/* Stats bar */}
      <div id="predict" ref={statsRef} style={{ position: "relative", zIndex: 1, borderTop: "1px solid rgba(245,158,11,0.12)", borderBottom: "1px solid rgba(245,158,11,0.12)", background: "rgba(20,28,50,0.6)", backdropFilter: "blur(16px)" }}>
        <div style={{ maxWidth: "1000px", margin: "0 auto", padding: "32px 24px", display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: "24px" }}>
          {[
            { value: "4,733", label: "Games Analyzed" },
            { value: "70%", label: "Model Accuracy" },
            { value: "0.76", label: "AUC-ROC Score" },
            { value: "9", label: "Features Engineered" },
          ].map((s, i) => (
            <div key={i} className={`fade-up d${i + 1} ${statsInView ? "visible" : ""}`} style={{ textAlign: "center" }}>
              <div style={{ fontFamily: "'Space Grotesk', sans-serif", fontSize: "2.2rem", fontWeight: 700, color: "#F59E0B", lineHeight: 1 }}>{s.value}</div>
              <div style={{ fontSize: "0.72rem", color: "#475569", marginTop: "6px", textTransform: "uppercase", letterSpacing: "0.1em", fontFamily: "'Geist', sans-serif" }}>{s.label}</div>
            </div>
          ))}
        </div>
      </div>

      <HowItWorks />
      <TechStack />

      <footer style={{ borderTop: "1px solid rgba(245,158,11,0.08)", padding: "32px 24px", textAlign: "center", position: "relative", zIndex: 1 }}>
        <div style={{ fontFamily: "'Space Grotesk', sans-serif", fontSize: "1rem", fontWeight: 600, color: "#F59E0B", marginBottom: "8px", letterSpacing: "0.05em" }}>GAME SUCCESS PREDICTOR</div>
        <div style={{ fontSize: "0.72rem", color: "#334155", fontFamily: "'Geist', sans-serif" }}>Built with XGBoost · SHAP · FastAPI · React · Trained on 4,733 games</div>
      </footer>

      <PredictorModal open={modalOpen} onClose={() => setModalOpen(false)} />
    </div>
  )
}
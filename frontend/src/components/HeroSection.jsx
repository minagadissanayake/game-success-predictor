import { useState, useEffect } from "react"
import SmokeBackground from "./SmokeBackground"
import { Typewriter } from "./Typewriter"
import { ContainerScroll } from "./ContainerScroll"
import GlassButton from "./GlassButton"
import { GooeyText } from "./GooeyText"

// Nav links — Predict removed, only Model and Stack remain
const NAV_LINKS = [
    { label: "Model", id: "model" },
    { label: "Stack", id: "stack" },
]

export default function HeroSection({ onOpenModal }) {
    const [loaded, setLoaded] = useState(false)

    useEffect(() => {
        setTimeout(() => setLoaded(true), 100)
    }, [])

    const scrollTo = (id) => {
        document.getElementById(id)?.scrollIntoView({ behavior: "smooth", block: "start" })
    }

    return (
        <>
            <div style={{ position: "relative", height: "100vh", display: "flex", alignItems: "center", justifyContent: "center", overflow: "hidden" }}>
                <div style={{ position: "absolute", inset: 0, zIndex: 0 }}>
                    <SmokeBackground smokeColor="#F59E0B" />
                </div>
                <div style={{ position: "absolute", inset: 0, zIndex: 1, background: "linear-gradient(to bottom, rgba(10,14,26,0.5) 0%, rgba(10,14,26,0.25) 40%, rgba(10,14,26,0.8) 80%, #0A0E1A 100%)" }} />

                {/* Nav — no Predict link */}
                <nav style={{ position: "absolute", top: 0, left: 0, right: 0, zIndex: 10, padding: "24px 40px", display: "flex", alignItems: "center", justifyContent: "space-between" }}>
                    <div style={{ fontFamily: "'Space Grotesk', sans-serif", fontSize: "1rem", fontWeight: 700, color: "#F59E0B", letterSpacing: "0.1em" }}>GSP</div>
                    <div style={{ display: "flex", gap: "10px" }}>
                        {NAV_LINKS.map(l => (
                            <GlassButton key={l.label} sm pill onClick={() => scrollTo(l.id)}>
                                {l.label}
                            </GlassButton>
                        ))}
                    </div>
                </nav>

                {/* Hero content */}
                <div style={{ position: "relative", zIndex: 2, textAlign: "center", padding: "0 24px", maxWidth: "900px", width: "100%" }}>


                    {/* GooeyText headline — morphs between key phrases */}
                    <div style={{
                        opacity: loaded ? 1 : 0,
                        transition: "opacity 0.8s ease 0.3s",
                        marginBottom: "24px",
                    }}>
                        <GooeyText
                            texts={[
                                "WILL YOUR GAME",
                                "SUCCEED?",
                                "FIND OUT NOW",
                                "ML POWERED",
                                "XGBOOST + SHAP",
                            ]}
                            morphTime={1.2}
                            cooldownTime={2.5}
                            style={{ height: "clamp(80px, 12vw, 130px)" }}
                            textStyle={{
                                fontFamily: "'Space Grotesk', sans-serif",
                                fontWeight: 700,
                                fontSize: "clamp(2.8rem, 7vw, 5.5rem)",
                                lineHeight: 1,
                                color: "#F1F5F9",
                                textShadow: "0 2px 40px rgba(0,0,0,0.9)",
                                whiteSpace: "nowrap",
                            }}
                        />
                    </div>

                    {/* Amber accent line */}
                    <div style={{
                        width: "60px", height: "3px", margin: "0 auto 24px",
                        background: "linear-gradient(90deg, #F59E0B, #FB923C)",
                        borderRadius: "2px",
                        boxShadow: "0 0 12px rgba(245,158,11,0.5)",
                        opacity: loaded ? 1 : 0, transition: "opacity 0.8s ease 0.5s",
                    }} />

                    {/* Typewriter subtext */}
                    <div style={{
                        fontSize: "clamp(0.85rem, 2vw, 1.05rem)", color: "#94A3B8",
                        maxWidth: "560px", margin: "0 auto 40px", lineHeight: 1.7,
                        minHeight: "2.2em", textShadow: "0 1px 10px rgba(0,0,0,0.9)",
                        fontFamily: "'Geist', sans-serif",
                        opacity: loaded ? 1 : 0, transition: "opacity 0.8s ease 0.6s",
                    }}>
                        {loaded && (
                            <Typewriter
                                text={[
                                    "Trained on 4,733 Metacritic-scored games.",
                                    "XGBoost · 70% accuracy · 0.76 AUC-ROC.",
                                    "SHAP explains every prediction.",
                                    "FastAPI backend · React frontend.",
                                    "Enter your game details and find out.",
                                ]}
                                speed={45} deleteSpeed={20} delay={2200} loop={true}
                                style={{ color: "#94A3B8", fontFamily: "'Geist', sans-serif" }}
                                cursor="|"
                            />
                        )}
                    </div>

                    {/* CTA buttons */}
                    <div style={{ display: "flex", gap: "16px", justifyContent: "center", flexWrap: "wrap", opacity: loaded ? 1 : 0, transition: "opacity 0.8s ease 0.8s" }}>
                        <GlassButton amber onClick={onOpenModal}>
                            Try the Model
                        </GlassButton>
                        <GlassButton outline pill href="https://game-success-predictor.onrender.com/docs" target="_blank" rel="noreferrer">
                            API Docs
                        </GlassButton>
                    </div>

                    {/* Scroll indicator */}
                    <div style={{
                        position: "absolute", bottom: "-90px", left: "50%", transform: "translateX(-50%)",
                        display: "flex", flexDirection: "column", alignItems: "center", gap: "8px",
                        opacity: loaded ? 0.6 : 0, transition: "opacity 1s ease 1.4s",
                    }}>
                        <div style={{ fontSize: "0.62rem", color: "#64748B", letterSpacing: "0.15em", textTransform: "uppercase", fontFamily: "'Geist', sans-serif" }}>Scroll</div>
                        <div style={{ width: "1px", height: "40px", background: "linear-gradient(to bottom, #F59E0B, transparent)" }} />
                    </div>
                </div>
            </div>

            {/* Container scroll preview section */}
            <div style={{ background: "#0A0E1A", position: "relative", zIndex: 1 }}>
                <ContainerScroll
                    titleComponent={
                        <div style={{ marginBottom: "32px" }}>
                            <GlassButton pill sm style={{ marginBottom: "16px" }}>Live Demo</GlassButton>
                            <h2 style={{ fontFamily: "'Space Grotesk', sans-serif", fontSize: "clamp(1.8rem, 4vw, 3.5rem)", fontWeight: 700, color: "#F1F5F9", margin: "12px 0", lineHeight: 1.1 }}>
                                See it in action
                            </h2>
                            <p style={{ color: "#64748B", fontSize: "0.95rem", maxWidth: "480px", margin: "0 auto", fontFamily: "'Geist', sans-serif" }}>
                                Answer a few questions about your game and get an instant ML-powered success prediction.
                            </p>
                        </div>
                    }
                >
                    <div style={{ height: "100%", display: "flex", alignItems: "center", justifyContent: "center", padding: "24px", background: "#0A0E1A", overflowY: "auto" }}>
                        <div style={{ width: "100%", maxWidth: "480px" }}>
                            <div style={{ textAlign: "center", marginBottom: "28px" }}>
                                <div style={{ fontFamily: "'Space Grotesk', sans-serif", fontSize: "1.4rem", fontWeight: 700, color: "#F59E0B", marginBottom: "4px" }}>Game Success Predictor</div>
                                <div style={{ fontSize: "0.75rem", color: "#475569", fontFamily: "'Geist', sans-serif" }}>Step-by-step ML prediction</div>
                            </div>

                            {/* Mock step UI */}
                            <div style={{ background: "rgba(12,18,38,0.9)", border: "1px solid rgba(245,158,11,0.15)", borderRadius: "20px", padding: "32px", position: "relative", overflow: "hidden" }}>
                                <div style={{ position: "absolute", top: 0, left: 0, right: 0, height: "1px", background: "linear-gradient(90deg, transparent, rgba(245,158,11,0.5), transparent)" }} />
                                <div style={{ display: "flex", gap: "5px", marginBottom: "24px" }}>
                                    {Array(9).fill(0).map((_, i) => (
                                        <div key={i} style={{ height: "3px", flex: 1, borderRadius: "2px", background: i === 0 ? "#F59E0B" : "rgba(255,255,255,0.07)", boxShadow: i === 0 ? "0 0 8px rgba(245,158,11,0.6)" : "none" }} />
                                    ))}
                                </div>
                                <div style={{ fontSize: "0.65rem", color: "#475569", fontFamily: "'Geist', sans-serif", textTransform: "uppercase", letterSpacing: "0.1em", marginBottom: "8px" }}>Step 1 of 9</div>
                                <div style={{ fontFamily: "'Space Grotesk', sans-serif", fontSize: "1.3rem", fontWeight: 700, color: "#F1F5F9", marginBottom: "6px" }}>What is the primary genre?</div>
                                <div style={{ fontSize: "0.8rem", color: "#64748B", fontFamily: "'Geist', sans-serif", marginBottom: "20px" }}>Choose the genre that best describes your game.</div>
                                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: "8px", marginBottom: "20px" }}>
                                    {["Action", "Adventure", "RPG", "Strategy", "Shooter", "Puzzle"].map((g, i) => (
                                        <div key={g} style={{ padding: "10px", borderRadius: "8px", textAlign: "center", background: i === 0 ? "rgba(245,158,11,0.15)" : "rgba(20,28,50,0.6)", border: `1px solid ${i === 0 ? "rgba(245,158,11,0.6)" : "rgba(245,158,11,0.1)"}`, color: i === 0 ? "#F59E0B" : "#64748B", fontFamily: "'Space Grotesk', sans-serif", fontWeight: 600, fontSize: "0.78rem" }}>{g}</div>
                                    ))}
                                </div>
                                <div style={{ background: "linear-gradient(135deg, #F59E0B, #FB923C)", borderRadius: "10px", padding: "12px", textAlign: "center", fontFamily: "'Space Grotesk', sans-serif", fontWeight: 700, fontSize: "0.85rem", letterSpacing: "0.08em", color: "#0A0E1A", textTransform: "uppercase", boxShadow: "0 4px 16px rgba(245,158,11,0.25), inset 0 1px 0 rgba(255,255,255,0.2)", position: "relative", overflow: "hidden" }}>
                                    <div style={{ position: "absolute", top: 0, left: 0, right: 0, height: "45%", background: "linear-gradient(to bottom, rgba(255,255,255,0.18), transparent)" }} />
                                    Next →
                                </div>
                            </div>

                            <div style={{ textAlign: "center", marginTop: "16px" }}>
                                <GlassButton sm pill onClick={onOpenModal}>Launch Full Predictor →</GlassButton>
                            </div>
                        </div>
                    </div>
                </ContainerScroll>
            </div>

            <style>{`
        @keyframes livepulse { 0%,100%{opacity:1;transform:scale(1)} 50%{opacity:0.5;transform:scale(1.3)} }
      `}</style>
        </>
    )
}
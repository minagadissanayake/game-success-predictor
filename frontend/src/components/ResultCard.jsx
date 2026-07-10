import { useEffect, useRef, useState } from "react"

function GaugeChart({ probability, isSuccess }) {
    const canvasRef = useRef(null)
    const [displayed, setDisplayed] = useState(0)

    useEffect(() => {
        let start = null
        const duration = 1400
        const target = probability

        const animate = (ts) => {
            if (!start) start = ts
            const progress = Math.min((ts - start) / duration, 1)
            const eased = 1 - Math.pow(1 - progress, 3)
            setDisplayed(Math.round(eased * target))

            const canvas = canvasRef.current
            if (!canvas) return
            const ctx = canvas.getContext("2d")
            const w = canvas.width, h = canvas.height
            const cx = w / 2, cy = h * 0.72
            const radius = Math.min(w, h) * 0.38

            ctx.clearRect(0, 0, w, h)

            // Track segments (tick marks)
            const startAngle = Math.PI * 0.75
            const endAngle = Math.PI * 2.25
            const totalAngle = endAngle - startAngle
            const numTicks = 40

            for (let i = 0; i <= numTicks; i++) {
                const angle = startAngle + (i / numTicks) * totalAngle
                const filled = i / numTicks <= eased * (target / 100)
                const tickLen = i % 5 === 0 ? 10 : 5
                const outerR = radius + 4
                const innerR = outerR - tickLen

                ctx.beginPath()
                ctx.moveTo(cx + Math.cos(angle) * innerR, cy + Math.sin(angle) * innerR)
                ctx.lineTo(cx + Math.cos(angle) * outerR, cy + Math.sin(angle) * outerR)
                ctx.strokeStyle = filled
                    ? (isSuccess ? `rgba(245,158,11,${0.4 + 0.6 * (i / numTicks)})` : `rgba(239,68,68,${0.4 + 0.6 * (i / numTicks)})`)
                    : "rgba(255,255,255,0.07)"
                ctx.lineWidth = i % 5 === 0 ? 2.5 : 1.5
                ctx.lineCap = "round"
                ctx.stroke()
            }

            // Background arc
            ctx.beginPath()
            ctx.arc(cx, cy, radius, startAngle, endAngle)
            ctx.strokeStyle = "rgba(255,255,255,0.05)"
            ctx.lineWidth = 10
            ctx.lineCap = "round"
            ctx.stroke()

            // Filled arc
            const fillEnd = startAngle + totalAngle * eased * (target / 100)
            const grad = ctx.createLinearGradient(cx - radius, cy, cx + radius, cy)
            if (isSuccess) {
                grad.addColorStop(0, "#F59E0B")
                grad.addColorStop(1, "#FB923C")
            } else {
                grad.addColorStop(0, "#EF4444")
                grad.addColorStop(1, "#F97316")
            }
            ctx.beginPath()
            ctx.arc(cx, cy, radius, startAngle, fillEnd)
            ctx.strokeStyle = grad
            ctx.lineWidth = 10
            ctx.lineCap = "round"
            ctx.stroke()

            // Needle
            const needleAngle = startAngle + totalAngle * eased * (target / 100)
            const needleLen = radius - 16
            ctx.beginPath()
            ctx.moveTo(cx, cy)
            ctx.lineTo(cx + Math.cos(needleAngle) * needleLen, cy + Math.sin(needleAngle) * needleLen)
            ctx.strokeStyle = "#F1F5F9"
            ctx.lineWidth = 2
            ctx.lineCap = "round"
            ctx.stroke()

            // Center dot
            ctx.beginPath()
            ctx.arc(cx, cy, 6, 0, Math.PI * 2)
            ctx.fillStyle = "#F1F5F9"
            ctx.fill()

            // Glow under arc
            if (progress > 0.3) {
                const glowGrad = ctx.createRadialGradient(cx, cy, 0, cx, cy, radius)
                glowGrad.addColorStop(0, "transparent")
                glowGrad.addColorStop(0.7, "transparent")
                glowGrad.addColorStop(1, isSuccess ? "rgba(245,158,11,0.04)" : "rgba(239,68,68,0.04)")
                ctx.beginPath()
                ctx.arc(cx, cy, radius + 20, 0, Math.PI * 2)
                ctx.fillStyle = glowGrad
                ctx.fill()
            }

            if (progress < 1) requestAnimationFrame(animate)
        }

        requestAnimationFrame(animate)
    }, [probability, isSuccess])

    return (
        <div style={{ position: "relative", textAlign: "center" }}>
            <canvas ref={canvasRef} width={320} height={220} style={{ width: "100%", maxWidth: "320px" }} />
            <div style={{ position: "absolute", bottom: "28px", left: "50%", transform: "translateX(-50%)", textAlign: "center" }}>
                <div style={{
                    fontFamily: "'Space Grotesk', sans-serif", fontSize: "3.5rem", fontWeight: 700,
                    color: isSuccess ? "#F59E0B" : "#EF4444", lineHeight: 1,
                    textShadow: isSuccess ? "0 0 30px rgba(245,158,11,0.4)" : "0 0 30px rgba(239,68,68,0.4)"
                }}>
                    {displayed}<span style={{ fontSize: "1.5rem" }}>%</span>
                </div>
            </div>
        </div>
    )
}

export default function ResultCard({ result }) {
    const { success_probability, prediction, confidence, top_factors } = result
    const isSuccess = prediction === "Likely Successful"
    const [visible, setVisible] = useState(false)

    useEffect(() => {
        setTimeout(() => setVisible(true), 50)
    }, [result])

    const featureLabels = {
        ratings_count: "Ratings Count",
        reviews_count: "Reviews Count",
        genre_encoded: "Genre",
        release_year: "Release Year",
        added_status_owned: "Ownership Count",
        playtime: "Avg Playtime",
        platform_count: "Platform Count",
        genre_count: "Genre Breadth",
        is_major_publisher: "Major Publisher"
    }

    const maxImpact = Math.max(...top_factors.map(f => Math.abs(f.impact)))

    return (
        <div style={{
            opacity: visible ? 1 : 0,
            transform: visible ? "translateY(0)" : "translateY(24px)",
            transition: "opacity 0.6s ease, transform 0.6s ease",
        }}>
            {/* Main result card */}
            <div style={{
                background: "rgba(30,39,64,0.5)", backdropFilter: "blur(20px)",
                border: `1px solid ${isSuccess ? "rgba(245,158,11,0.25)" : "rgba(239,68,68,0.25)"}`,
                borderRadius: "20px", overflow: "hidden",
                boxShadow: isSuccess ? "0 0 60px rgba(245,158,11,0.08)" : "0 0 60px rgba(239,68,68,0.08)",
                marginBottom: "20px"
            }}>
                {/* Top accent line */}
                <div style={{
                    height: "3px",
                    background: isSuccess ? "linear-gradient(90deg, transparent, #F59E0B, #FB923C, transparent)" : "linear-gradient(90deg, transparent, #EF4444, #F97316, transparent)"
                }} />

                <div style={{ padding: "40px", display: "grid", gridTemplateColumns: "1fr 1fr", gap: "40px", alignItems: "center" }}>
                    {/* Left: Gauge */}
                    <div style={{ textAlign: "center" }}>
                        <GaugeChart probability={success_probability} isSuccess={isSuccess} />
                        <div style={{
                            display: "inline-flex", alignItems: "center", gap: "8px",
                            background: isSuccess ? "rgba(245,158,11,0.1)" : "rgba(239,68,68,0.1)",
                            border: `1px solid ${isSuccess ? "rgba(245,158,11,0.3)" : "rgba(239,68,68,0.3)"}`,
                            borderRadius: "20px", padding: "8px 20px", marginTop: "8px"
                        }}>
                            <div style={{ width: "6px", height: "6px", borderRadius: "50%", background: isSuccess ? "#F59E0B" : "#EF4444" }} />
                            <span style={{ fontFamily: "'Space Grotesk', sans-serif", fontWeight: 600, fontSize: "0.85rem", color: isSuccess ? "#F59E0B" : "#EF4444", letterSpacing: "0.05em" }}>
                                {prediction}
                            </span>
                        </div>
                        <div style={{ fontSize: "0.7rem", color: "#475569", marginTop: "8px", letterSpacing: "0.1em", textTransform: "uppercase" }}>
                            {confidence} Confidence
                        </div>
                    </div>

                    {/* Right: SHAP factors */}
                    <div>
                        <div style={{ fontSize: "0.65rem", color: "#475569", letterSpacing: "0.15em", textTransform: "uppercase", marginBottom: "20px" }}>
                            SHAP Factor Analysis
                        </div>
                        <div style={{ display: "flex", flexDirection: "column", gap: "14px" }}>
                            {top_factors.map((f, i) => {
                                const isPos = f.impact >= 0
                                const width = `${(Math.abs(f.impact) / maxImpact) * 100}%`
                                return (
                                    <div key={i} style={{
                                        opacity: visible ? 1 : 0,
                                        transform: visible ? "translateX(0)" : "translateX(20px)",
                                        transition: `opacity 0.5s ease ${0.1 + i * 0.08}s, transform 0.5s ease ${0.1 + i * 0.08}s`
                                    }}>
                                        <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "6px" }}>
                                            <span style={{ fontSize: "0.8rem", color: "#94A3B8" }}>{featureLabels[f.feature] || f.feature}</span>
                                            <span style={{ fontSize: "0.8rem", fontFamily: "'Space Grotesk', sans-serif", fontWeight: 600, color: isPos ? "#F59E0B" : "#EF4444" }}>
                                                {isPos ? "+" : ""}{f.impact.toFixed(3)}
                                            </span>
                                        </div>
                                        <div style={{ height: "4px", background: "rgba(255,255,255,0.05)", borderRadius: "2px", overflow: "hidden" }}>
                                            <div style={{
                                                height: "100%", borderRadius: "2px",
                                                background: isPos ? "linear-gradient(90deg, #F59E0B, #FB923C)" : "linear-gradient(90deg, #EF4444, #F97316)",
                                                width: visible ? width : "0%",
                                                transition: `width 0.8s ease ${0.2 + i * 0.1}s`,
                                                boxShadow: isPos ? "0 0 8px rgba(245,158,11,0.4)" : "0 0 8px rgba(239,68,68,0.4)"
                                            }} />
                                        </div>
                                    </div>
                                )
                            })}
                        </div>
                    </div>
                </div>
            </div>

            {/* Insight cards */}
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: "12px" }}>
                {[
                    { label: "Model", value: "XGBoost", sub: "200 estimators" },
                    { label: "Accuracy", value: "70%", sub: "on test set" },
                    { label: "AUC-ROC", value: "0.76", sub: "classifier score" },
                ].map((s, i) => (
                    <div key={i} style={{
                        background: "rgba(30,39,64,0.4)", border: "1px solid rgba(245,158,11,0.1)",
                        borderRadius: "12px", padding: "16px", textAlign: "center",
                        opacity: visible ? 1 : 0,
                        transition: `opacity 0.5s ease ${0.4 + i * 0.1}s`
                    }}>
                        <div style={{ fontSize: "0.6rem", color: "#475569", textTransform: "uppercase", letterSpacing: "0.1em", marginBottom: "6px" }}>{s.label}</div>
                        <div style={{ fontFamily: "'Space Grotesk', sans-serif", fontSize: "1.4rem", fontWeight: 700, color: "#F59E0B" }}>{s.value}</div>
                        <div style={{ fontSize: "0.65rem", color: "#334155", marginTop: "2px" }}>{s.sub}</div>
                    </div>
                ))}
            </div>
        </div>
    )
}
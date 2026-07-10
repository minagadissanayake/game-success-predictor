import { useState, useEffect } from "react"
import GlassButton from "./GlassButton"
import ResultCard from "./ResultCard"

const GENRES = ["Action", "Adventure", "RPG", "Strategy", "Shooter", "Simulation", "Sports", "Racing", "Puzzle", "Platformer", "Fighting", "Indie", "Casual", "Arcade"]

const STEPS = [
    {
        id: "primary_genre",
        question: "What is the primary genre?",
        sub: "Choose the genre that best describes your game.",
        type: "choice",
        options: GENRES,
    },
    {
        id: "genre_count",
        question: "How many genres does your game span?",
        sub: "Multi-genre games signal broader appeal.",
        type: "number",
        min: 1, max: 10, default: 2,
        hint: "e.g. 2",
    },
    {
        id: "platform_count",
        question: "How many platforms will it launch on?",
        sub: "More platforms = more reach.",
        type: "number",
        min: 1, max: 15, default: 3,
        hint: "e.g. 3",
    },
    {
        id: "publisher",
        question: "Who is the publisher?",
        sub: "Leave blank if self-published or unknown.",
        type: "text",
        hint: "e.g. Ubisoft, EA, or leave blank",
        optional: true,
    },
    {
        id: "release_year",
        question: "What year will it release?",
        sub: "Newer releases tend to score higher.",
        type: "number",
        min: 1980, max: 2030, default: 2024,
        hint: "e.g. 2024",
    },
    {
        id: "playtime",
        question: "What is the expected average playtime?",
        sub: "In hours. Longer playtime signals depth and engagement.",
        type: "number",
        min: 0, max: 1000, default: 10,
        hint: "e.g. 10",
    },
    {
        id: "ratings_count",
        question: "How many ratings do you expect?",
        sub: "Your projected audience size on platforms like RAWG or Steam.",
        type: "number",
        min: 0, default: 100,
        hint: "e.g. 500",
    },
    {
        id: "reviews_count",
        question: "How many written reviews do you expect?",
        sub: "Text reviews signal a highly engaged player base.",
        type: "number",
        min: 0, default: 20,
        hint: "e.g. 50",
    },
    {
        id: "added_status_owned",
        question: "How many players do you expect to own it?",
        sub: "Projected ownership count — your best estimate.",
        type: "number",
        min: 0, default: 50,
        hint: "e.g. 200",
    },
]

const PRESETS = [
    { label: "Indie Gem", values: { primary_genre: "Indie", genre_count: 2, platform_count: 2, publisher: "", release_year: 2023, playtime: 8, ratings_count: 80, reviews_count: 15, added_status_owned: 40 } },
    { label: "AAA Blockbuster", values: { primary_genre: "Action", genre_count: 3, platform_count: 5, publisher: "Ubisoft", release_year: 2024, playtime: 25, ratings_count: 2000, reviews_count: 300, added_status_owned: 5000 } },
    { label: "Niche RPG", values: { primary_genre: "RPG", genre_count: 2, platform_count: 2, publisher: "", release_year: 2022, playtime: 60, ratings_count: 200, reviews_count: 40, added_status_owned: 150 } },
]

const DEFAULT_FORM = {
    primary_genre: "Action", genre_count: 2, platform_count: 3,
    publisher: "", release_year: 2024, playtime: 10,
    ratings_count: 100, reviews_count: 20, added_status_owned: 50
}

export default function PredictorModal({ open, onClose }) {
    const [step, setStep] = useState(0)
    const [form, setForm] = useState({ ...DEFAULT_FORM })
    const [inputVal, setInputVal] = useState("")
    const [direction, setDirection] = useState(1) // 1 = forward, -1 = back
    const [animating, setAnimating] = useState(false)
    const [result, setResult] = useState(null)
    const [loading, setLoading] = useState(false)
    const [done, setDone] = useState(false)

    const current = STEPS[step]
    const progress = ((step) / STEPS.length) * 100

    // Sync inputVal when step changes
    useEffect(() => {
        if (!current) return
        const val = form[current.id]
        setInputVal(val === undefined || val === null ? (current.default ?? "") : val)
    }, [step, open])

    const goNext = (val) => {
        const value = val !== undefined ? val : inputVal
        const processed = current.type === "number" ? Number(value) || 0 : (value ?? "")
        setForm(f => ({ ...f, [current.id]: processed }))

        if (step < STEPS.length - 1) {
            setDirection(1)
            setAnimating(true)
            setTimeout(() => { setStep(s => s + 1); setAnimating(false) }, 200)
        } else {
            // Submit
            const finalForm = { ...form, [current.id]: processed }
            setForm(finalForm)
            handleSubmit(finalForm)
        }
    }

    const goBack = () => {
        if (step === 0) return
        setDirection(-1)
        setAnimating(true)
        setTimeout(() => { setStep(s => s - 1); setAnimating(false) }, 200)
    }

    const handleSubmit = async (finalForm) => {
        setLoading(true)
        setDone(true)
        try {
            const res = await fetch("https://game-success-predictor.onrender.com/api/predict", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(finalForm)
            })
            const data = await res.json()
            setResult(data)
        } catch (e) {
            console.error(e)
        } finally {
            setLoading(false)
        }
    }

    const handlePreset = (preset) => {
        setForm({ ...DEFAULT_FORM, ...preset.values })
        handleSubmit({ ...DEFAULT_FORM, ...preset.values })
    }

    const handleClose = () => {
        setStep(0)
        setForm({ ...DEFAULT_FORM })
        setResult(null)
        setDone(false)
        setLoading(false)
        onClose()
    }

    const handleKeyDown = (e) => {
        if (e.key === "Enter" && current?.type !== "choice") goNext()
        if (e.key === "Escape") handleClose()
    }

    if (!open) return null

    return (
        <div
            onClick={(e) => { if (e.target === e.currentTarget) handleClose() }}
            style={{
                position: "fixed", inset: 0, zIndex: 1000,
                background: "rgba(5,8,18,0.92)",
                backdropFilter: "blur(20px)",
                display: "flex", alignItems: "flex-start", justifyContent: "center",
                padding: "80px 24px 24px",
                overflowY: "auto",
                animation: "modalIn 0.3s ease",
            }}
        >
            <div style={{
                width: "100%", maxWidth: "640px",
                position: "relative",
                animation: "slideUp 0.35s ease",
            }}>

                {/* Close button */}
                <div style={{ position: "absolute", top: "-48px", right: 0 }}>
                    <GlassButton sm pill onClick={handleClose}>✕ Close</GlassButton>
                </div>

                {/* Progress bar */}
                {!done && (
                    <div style={{ marginBottom: "32px" }}>
                        <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "10px" }}>
                            <span style={{ fontSize: "0.68rem", color: "#475569", fontFamily: "'Geist', sans-serif", textTransform: "uppercase", letterSpacing: "0.1em" }}>
                                Step {step + 1} of {STEPS.length}
                            </span>
                            <span style={{ fontSize: "0.68rem", color: "#F59E0B", fontFamily: "'Geist', sans-serif" }}>
                                {Math.round(progress)}%
                            </span>
                        </div>
                        <div style={{ height: "3px", background: "rgba(255,255,255,0.06)", borderRadius: "2px", overflow: "hidden" }}>
                            <div style={{
                                height: "100%", borderRadius: "2px",
                                background: "linear-gradient(90deg, #F59E0B, #FB923C)",
                                width: `${progress}%`,
                                transition: "width 0.4s ease",
                                boxShadow: "0 0 10px rgba(245,158,11,0.5)"
                            }} />
                        </div>
                    </div>
                )}

                {/* Main card */}
                <div style={{
                    background: "rgba(12,18,38,0.9)",
                    border: "1px solid rgba(245,158,11,0.15)",
                    borderRadius: "24px",
                    padding: done ? "40px" : "48px",
                    backdropFilter: "blur(24px)",
                    boxShadow: "0 32px 80px rgba(0,0,0,0.6), 0 0 60px rgba(245,158,11,0.04), inset 0 1px 0 rgba(255,255,255,0.05)",
                    position: "relative", overflow: "hidden",
                }}>
                    {/* Top shimmer */}
                    <div style={{ position: "absolute", top: 0, left: 0, right: 0, height: "1px", background: "linear-gradient(90deg, transparent, rgba(245,158,11,0.5), transparent)" }} />

                    {/* RESULT STATE */}
                    {done ? (
                        <div>
                            {loading ? (
                                <div style={{ textAlign: "center", padding: "60px 0" }}>
                                    <div style={{
                                        width: "48px", height: "48px", margin: "0 auto 24px",
                                        border: "3px solid rgba(245,158,11,0.2)",
                                        borderTopColor: "#F59E0B",
                                        borderRadius: "50%", animation: "spin 0.9s linear infinite"
                                    }} />
                                    <div style={{ fontFamily: "'Space Grotesk', sans-serif", fontSize: "1.1rem", color: "#94A3B8" }}>Analyzing your game...</div>
                                    <div style={{ fontSize: "0.75rem", color: "#334155", marginTop: "8px", fontFamily: "'Geist', sans-serif" }}>Running XGBoost + SHAP</div>
                                </div>
                            ) : result ? (
                                <div>
                                    <ResultCard result={result} />
                                    <div style={{ display: "flex", gap: "12px", marginTop: "24px", justifyContent: "center" }}>
                                        <GlassButton onClick={() => { setDone(false); setStep(0); setResult(null); setForm({ ...DEFAULT_FORM }) }}>
                                            ← Try Again
                                        </GlassButton>
                                        <GlassButton amber onClick={handleClose}>
                                            Done
                                        </GlassButton>
                                    </div>
                                </div>
                            ) : null}
                        </div>
                    ) : (
                        // QUESTION STATE
                        <div style={{
                            opacity: animating ? 0 : 1,
                            transform: animating ? `translateX(${direction * 30}px)` : "translateX(0)",
                            transition: "opacity 0.2s ease, transform 0.2s ease",
                        }}>
                            {/* Step indicator dots */}
                            <div style={{ display: "flex", gap: "6px", marginBottom: "32px" }}>
                                {STEPS.map((_, i) => (
                                    <div key={i} style={{
                                        height: "3px", flex: 1, borderRadius: "2px",
                                        background: i <= step ? "#F59E0B" : "rgba(255,255,255,0.07)",
                                        transition: "background 0.3s ease",
                                        boxShadow: i === step ? "0 0 8px rgba(245,158,11,0.6)" : "none"
                                    }} />
                                ))}
                            </div>

                            {/* Question */}
                            <div style={{ fontFamily: "'Space Grotesk', sans-serif", fontSize: "clamp(1.4rem, 3vw, 2rem)", fontWeight: 700, color: "#F1F5F9", marginBottom: "10px", lineHeight: 1.2 }}>
                                {current.question}
                            </div>
                            <div style={{ fontSize: "0.85rem", color: "#64748B", fontFamily: "'Geist', sans-serif", marginBottom: "36px", lineHeight: 1.6 }}>
                                {current.sub}
                            </div>

                            {/* Input */}
                            {current.type === "choice" ? (
                                <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(130px, 1fr))", gap: "10px", marginBottom: "32px" }}>
                                    {current.options.map(opt => (
                                        <button
                                            key={opt}
                                            onClick={() => goNext(opt)}
                                            style={{
                                                padding: "12px 16px",
                                                background: form.primary_genre === opt ? "rgba(245,158,11,0.15)" : "rgba(20,28,50,0.6)",
                                                border: `1px solid ${form.primary_genre === opt ? "rgba(245,158,11,0.6)" : "rgba(245,158,11,0.1)"}`,
                                                borderRadius: "10px",
                                                color: form.primary_genre === opt ? "#F59E0B" : "#94A3B8",
                                                fontFamily: "'Space Grotesk', sans-serif",
                                                fontWeight: 600, fontSize: "0.82rem",
                                                cursor: "pointer",
                                                backdropFilter: "blur(8px)",
                                                transition: "all 0.15s",
                                                textAlign: "left",
                                                boxShadow: form.primary_genre === opt ? "0 0 0 1px rgba(245,158,11,0.3), inset 0 1px 0 rgba(255,255,255,0.08)" : "inset 0 1px 0 rgba(255,255,255,0.03)",
                                            }}
                                            onMouseEnter={e => { e.currentTarget.style.borderColor = "rgba(245,158,11,0.4)"; e.currentTarget.style.color = "#F59E0B" }}
                                            onMouseLeave={e => {
                                                if (form.primary_genre !== opt) {
                                                    e.currentTarget.style.borderColor = "rgba(245,158,11,0.1)"
                                                    e.currentTarget.style.color = "#94A3B8"
                                                }
                                            }}
                                        >
                                            {opt}
                                        </button>
                                    ))}
                                </div>
                            ) : (
                                <div style={{ marginBottom: "32px" }}>
                                    <input
                                        autoFocus
                                        type={current.type}
                                        value={inputVal}
                                        placeholder={current.hint}
                                        min={current.min}
                                        max={current.max}
                                        onChange={e => setInputVal(e.target.value)}
                                        onKeyDown={handleKeyDown}
                                        style={{
                                            width: "100%", boxSizing: "border-box",
                                            background: "rgba(10,14,26,0.8)",
                                            border: "1px solid rgba(245,158,11,0.25)",
                                            borderRadius: "12px",
                                            padding: "18px 20px",
                                            color: "#F1F5F9",
                                            fontFamily: "'Space Grotesk', sans-serif",
                                            fontSize: "1.3rem", fontWeight: 600,
                                            outline: "none",
                                            backdropFilter: "blur(8px)",
                                            boxShadow: "inset 0 2px 6px rgba(0,0,0,0.3), 0 0 0 0 rgba(245,158,11,0)",
                                            transition: "border-color 0.2s, box-shadow 0.2s",
                                        }}
                                        onFocus={e => { e.target.style.borderColor = "rgba(245,158,11,0.6)"; e.target.style.boxShadow = "inset 0 2px 6px rgba(0,0,0,0.3), 0 0 0 4px rgba(245,158,11,0.08)" }}
                                        onBlur={e => { e.target.style.borderColor = "rgba(245,158,11,0.25)"; e.target.style.boxShadow = "inset 0 2px 6px rgba(0,0,0,0.3)" }}
                                    />
                                    {current.optional && (
                                        <div style={{ fontSize: "0.72rem", color: "#334155", marginTop: "8px", fontFamily: "'Geist', sans-serif" }}>
                                            Optional — press Enter or click Next to skip
                                        </div>
                                    )}
                                </div>
                            )}

                            {/* Navigation */}
                            {current.type !== "choice" && (
                                <div style={{ display: "flex", gap: "12px", alignItems: "center" }}>
                                    {step > 0 && (
                                        <GlassButton onClick={goBack} sm>← Back</GlassButton>
                                    )}
                                    <GlassButton amber onClick={() => goNext()} style={{ flex: 1 }}>
                                        {step === STEPS.length - 1 ? "Predict →" : "Next →"}
                                    </GlassButton>
                                </div>
                            )}

                            {step > 0 && current.type === "choice" && (
                                <div style={{ marginTop: "16px" }}>
                                    <GlassButton sm onClick={goBack}>← Back</GlassButton>
                                </div>
                            )}
                        </div>
                    )}
                </div>

                {/* Quick presets — shown on first step only */}
                {!done && step === 0 && (
                    <div style={{ marginTop: "20px", textAlign: "center" }}>
                        <div style={{ fontSize: "0.65rem", color: "#334155", textTransform: "uppercase", letterSpacing: "0.1em", marginBottom: "12px", fontFamily: "'Geist', sans-serif" }}>Or try a preset</div>
                        <div style={{ display: "flex", gap: "10px", justifyContent: "center", flexWrap: "wrap" }}>
                            {PRESETS.map(p => (
                                <GlassButton key={p.label} sm pill onClick={() => handlePreset(p)}>
                                    {p.label}
                                </GlassButton>
                            ))}
                        </div>
                    </div>
                )}
            </div>

            <style>{`
        @keyframes modalIn { from{opacity:0} to{opacity:1} }
        @keyframes slideUp { from{opacity:0;transform:translateY(24px)} to{opacity:1;transform:translateY(0)} }
        @keyframes spin { to{transform:rotate(360deg)} }
      `}</style>
        </div>
    )
}
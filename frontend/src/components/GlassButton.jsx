import { useState } from "react"

// Master glass button — used everywhere across the app
// Props:
//   amber     → filled amber gradient (primary CTA)
//   outline   → amber outline ghost style
//   pill      → fully rounded (default false = rounded-lg)
//   fullWidth → stretches to container width
//   sm        → smaller padding
//   disabled  → greyed out, no interaction
//   onClick, children, style

export default function GlassButton({
    children,
    onClick,
    disabled = false,
    amber = false,
    outline = false,
    pill = false,
    fullWidth = false,
    sm = false,
    href,
    target,
    rel,
    style = {},
}) {
    const [hovered, setHovered] = useState(false)
    const [pressed, setPressed] = useState(false)

    const radius = pill ? "999px" : "10px"
    const padding = sm ? "7px 16px" : amber ? "15px 32px" : "9px 20px"
    const fontSize = sm ? "0.72rem" : "0.88rem"

    // Background
    let bg
    if (amber) {
        if (disabled) bg = "rgba(245,158,11,0.2)"
        else if (pressed) bg = "linear-gradient(135deg, #d97706, #ea7c1a)"
        else if (hovered) bg = "linear-gradient(135deg, #FB923C, #F59E0B)"
        else bg = "linear-gradient(135deg, #F59E0B, #FB923C)"
    } else if (outline) {
        bg = hovered ? "rgba(245,158,11,0.12)" : "rgba(10,14,26,0.45)"
    } else {
        bg = hovered ? "rgba(245,158,11,0.13)" : "rgba(20,28,50,0.55)"
    }

    // Border ring color
    let ringColor
    if (amber) ringColor = disabled ? "rgba(245,158,11,0.2)" : hovered ? "#FB923C" : "#F59E0B"
    else if (outline) ringColor = hovered ? "rgba(245,158,11,0.7)" : "rgba(245,158,11,0.35)"
    else ringColor = hovered ? "rgba(245,158,11,0.4)" : "rgba(245,158,11,0.15)"

    // Text color
    let color
    if (amber) color = disabled ? "#64748B" : "#0A0E1A"
    else color = hovered ? "#F59E0B" : "#94A3B8"

    // Box shadow
    let shadow
    if (amber && !disabled) {
        shadow = hovered
            ? "0 8px 28px rgba(245,158,11,0.4), 0 2px 8px rgba(0,0,0,0.3), inset 0 1px 0 rgba(255,255,255,0.25)"
            : "0 4px 16px rgba(245,158,11,0.2), 0 2px 6px rgba(0,0,0,0.25), inset 0 1px 0 rgba(255,255,255,0.18)"
    } else {
        shadow = hovered
            ? "0 4px 20px rgba(0,0,0,0.4), inset 0 1px 0 rgba(255,255,255,0.07)"
            : "0 2px 8px rgba(0,0,0,0.25), inset 0 1px 0 rgba(255,255,255,0.04)"
    }

    const sharedStyle = {
        position: "relative",
        display: fullWidth ? "block" : "inline-flex",
        alignItems: "center",
        justifyContent: "center",
        gap: "8px",
        width: fullWidth ? "100%" : "auto",
        padding,
        background: bg,
        border: `1px solid ${ringColor}`,
        borderRadius: radius,
        cursor: disabled ? "not-allowed" : "pointer",
        fontFamily: "'Space Grotesk', 'Geist', sans-serif",
        fontWeight: amber ? 700 : 600,
        fontSize,
        letterSpacing: amber ? "0.1em" : "0.04em",
        textTransform: "uppercase",
        color,
        backdropFilter: "blur(14px)",
        WebkitBackdropFilter: "blur(14px)",
        textDecoration: "none",
        boxShadow: shadow,
        transform: pressed && !disabled ? "translateY(1px) scale(0.99)" : hovered && !disabled ? "translateY(-2px)" : "none",
        transition: "background 0.2s, border-color 0.2s, color 0.2s, box-shadow 0.25s, transform 0.15s",
        overflow: "hidden",
        ...style,
    }

    const inner = (
        <>
            {/* Top glass sheen */}
            <div style={{
                position: "absolute", top: 0, left: 0, right: 0,
                height: "45%",
                background: amber
                    ? "linear-gradient(to bottom, rgba(255,255,255,0.18), transparent)"
                    : "linear-gradient(to bottom, rgba(255,255,255,0.07), transparent)",
                borderRadius: `${radius} ${radius} 0 0`,
                pointerEvents: "none",
                transition: "opacity 0.2s",
                opacity: hovered ? 1 : 0.7,
            }} />
            {/* Side edge highlights */}
            <div style={{
                position: "absolute", top: "15%", bottom: "15%", left: 0, width: "1px",
                background: "linear-gradient(to bottom, transparent, rgba(255,255,255,0.08), transparent)",
                pointerEvents: "none"
            }} />
            <div style={{
                position: "absolute", top: "15%", bottom: "15%", right: 0, width: "1px",
                background: "linear-gradient(to bottom, transparent, rgba(255,255,255,0.04), transparent)",
                pointerEvents: "none"
            }} />
            {/* Content */}
            <span style={{ position: "relative", display: "flex", alignItems: "center", gap: "8px" }}>
                {children}
            </span>
            {/* Drop shadow layer below */}
            <div style={{
                position: "absolute", inset: "6px -3px -8px",
                background: amber ? "rgba(245,158,11,0.25)" : "rgba(0,0,0,0.2)",
                borderRadius: radius,
                filter: "blur(10px)",
                zIndex: -1,
                opacity: hovered ? 0.9 : 0.4,
                transition: "opacity 0.3s",
                pointerEvents: "none",
            }} />
        </>
    )

    const events = {
        onMouseEnter: () => !disabled && setHovered(true),
        onMouseLeave: () => { setHovered(false); setPressed(false) },
        onMouseDown: () => !disabled && setPressed(true),
        onMouseUp: () => setPressed(false),
    }

    if (href) {
        return (
            <a href={href} target={target} rel={rel} style={sharedStyle} {...events}>
                {inner}
            </a>
        )
    }

    return (
        <button onClick={onClick} disabled={disabled} style={sharedStyle} {...events}>
            {inner}
        </button>
    )
}
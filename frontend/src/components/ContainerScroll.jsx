import { useRef, useState, useEffect } from "react"
import { useScroll, useTransform, motion } from "framer-motion"

export function ContainerScroll({ titleComponent, children }) {
    const containerRef = useRef(null)
    const { scrollYProgress } = useScroll({ target: containerRef })
    const [isMobile, setIsMobile] = useState(false)

    useEffect(() => {
        const check = () => setIsMobile(window.innerWidth <= 768)
        check()
        window.addEventListener("resize", check)
        return () => window.removeEventListener("resize", check)
    }, [])

    const scaleDimensions = isMobile ? [0.7, 0.9] : [1.05, 1]
    const rotate = useTransform(scrollYProgress, [0, 1], [20, 0])
    const scale = useTransform(scrollYProgress, [0, 1], scaleDimensions)
    const translate = useTransform(scrollYProgress, [0, 1], [0, -100])

    return (
        <div
            ref={containerRef}
            style={{
                height: isMobile ? "60rem" : "80rem",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                position: "relative",
                padding: isMobile ? "8px" : "80px",
            }}
        >
            <div style={{ paddingTop: isMobile ? "40px" : "160px", paddingBottom: isMobile ? "40px" : "160px", width: "100%", position: "relative", perspective: "1000px" }}>
                <motion.div style={{ translateY: translate, textAlign: "center", maxWidth: "64rem", margin: "0 auto" }}>
                    {titleComponent}
                </motion.div>
                <motion.div
                    style={{
                        rotateX: rotate,
                        scale,
                        marginTop: "-48px",
                        maxWidth: "64rem",
                        margin: "-48px auto 0",
                        height: isMobile ? "30rem" : "40rem",
                        width: "100%",
                        border: "4px solid #2D3748",
                        padding: isMobile ? "8px" : "24px",
                        background: "#111827",
                        borderRadius: "30px",
                        boxShadow: "0 0 #0000004d, 0 9px 20px #0000004a, 0 37px 37px #00000042, 0 84px 50px #00000026, 0 149px 60px #0000000a, 0 233px 65px #00000003",
                    }}
                >
                    <div style={{ height: "100%", width: "100%", overflow: "hidden", borderRadius: "16px", background: "#0A0E1A" }}>
                        {children}
                    </div>
                </motion.div>
            </div>
        </div>
    )
}
import { useEffect, useState } from "react"

export function Typewriter({
    text,
    speed = 100,
    cursor = "|",
    loop = false,
    deleteSpeed = 50,
    delay = 1500,
    style = {},
}) {
    const [displayText, setDisplayText] = useState("")
    const [currentIndex, setCurrentIndex] = useState(0)
    const [isDeleting, setIsDeleting] = useState(false)
    const [textArrayIndex, setTextArrayIndex] = useState(0)

    const textArray = Array.isArray(text) ? text : [text]
    const currentText = textArray[textArrayIndex] || ""

    useEffect(() => {
        if (!currentText) return

        const timeout = setTimeout(() => {
            if (!isDeleting) {
                if (currentIndex < currentText.length) {
                    setDisplayText(prev => prev + currentText[currentIndex])
                    setCurrentIndex(prev => prev + 1)
                } else if (loop) {
                    setTimeout(() => setIsDeleting(true), delay)
                }
            } else {
                if (displayText.length > 0) {
                    setDisplayText(prev => prev.slice(0, -1))
                } else {
                    setIsDeleting(false)
                    setCurrentIndex(0)
                    setTextArrayIndex(prev => (prev + 1) % textArray.length)
                }
            }
        }, isDeleting ? deleteSpeed : speed)

        return () => clearTimeout(timeout)
    }, [currentIndex, isDeleting, currentText, loop, speed, deleteSpeed, delay, displayText, text])

    return (
        <span style={style}>
            {displayText}
            <span style={{ animation: "twpulse 1s step-end infinite" }}>{cursor}</span>
            <style>{`@keyframes twpulse { 0%,100%{opacity:1} 50%{opacity:0} }`}</style>
        </span>
    )
}
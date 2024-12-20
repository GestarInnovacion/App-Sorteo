import { useRef } from 'react'
import { motion, useScroll, useTransform } from 'framer-motion'

export const AuroraBorealis = () => {
    const ref = useRef(null)
    const { scrollYProgress } = useScroll({
        target: ref,
        offset: ["start start", "end start"]
    })

    const y1 = useTransform(scrollYProgress, [0, 1], ["0%", "50%"])
    const y2 = useTransform(scrollYProgress, [0, 1], ["0%", "30%"])
    const y3 = useTransform(scrollYProgress, [0, 1], ["0%", "20%"])

    return (
        <div ref={ref} className="fixed inset-0 overflow-hidden bg-black">
            <div className="absolute inset-0 bg-gradient-to-b from-blue-900 via-purple-900 to-black" />
            <motion.div
                className="absolute inset-0 opacity-50"
                style={{
                    background: 'linear-gradient(45deg, #00ff00, #0000ff, #ff00ff)',
                    y: y1
                }}
            />
            <motion.div
                className="absolute inset-0 opacity-40"
                style={{
                    background: 'linear-gradient(135deg, #ff00ff, #00ffff, #ffff00)',
                    y: y2
                }}
            />
            <motion.div
                className="absolute inset-0 opacity-30"
                style={{
                    background: 'linear-gradient(225deg, #ff0000, #00ff00, #0000ff)',
                    y: y3
                }}
            />
        </div>
    )
}


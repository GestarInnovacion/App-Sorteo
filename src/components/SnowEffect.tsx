import { useEffect, useState } from 'react'
import { motion } from 'framer-motion'

const Snowflake = ({ delay }: { delay: number }) => {
    const [xPosition, setXPosition] = useState(Math.random() * 100)
    const size = Math.random() * 4 + 4

    useEffect(() => {
        const interval = setInterval(() => {
            setXPosition(Math.random() * 100)
        }, 5000)
        return () => clearInterval(interval)
    }, [])

    return (
        <motion.div
            className="absolute text-white/40"
            initial={{ top: "-5%", left: `${xPosition}%` }}
            animate={{
                top: "105%",
                left: [
                    `${xPosition}%`,
                    `${xPosition + (Math.random() * 10 - 5)}%`,
                    `${xPosition + (Math.random() * 10 - 5)}%`,
                    `${xPosition}%`
                ],
                rotate: [0, 180, 360],
            }}
            transition={{
                duration: 15 + Math.random() * 10,
                repeat: Infinity,
                ease: "linear"
            }}
            style={{ fontSize: `${size}px` }}
        >
            ❄
        </motion.div>
    )
}

export const SnowEffect = () => {
    return (
        <div className="fixed inset-0 overflow-hidden pointer-events-none">
            {[...Array(50)].map((_, i) => (
                <Snowflake key={i} delay={Math.random() * 10} />
            ))}
        </div>
    )
}


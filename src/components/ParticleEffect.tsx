import { useEffect, useRef } from 'react'
import { motion } from 'framer-motion'

const Particle = ({ delay }: { delay: number }) => {
    const randomX = Math.random() * 100
    const randomY = Math.random() * 100
    const size = Math.random() * 3 + 1

    return (
        <motion.div
            className="absolute rounded-full bg-white"
            style={{
                width: size,
                height: size,
                x: `${randomX}%`,
                y: `${randomY}%`,
            }}
            animate={{
                opacity: [0, 1, 0],
                scale: [0, 1, 0],
            }}
            transition={{
                duration: 5,
                delay,
                repeat: Infinity,
                ease: "easeInOut",
            }}
        />
    )
}

export const ParticleEffect = () => {
    const particlesRef = useRef<HTMLDivElement>(null)

    useEffect(() => {
        const handleMouseMove = (e: MouseEvent) => {
            if (particlesRef.current) {
                const { clientX, clientY } = e
                const { left, top, width, height } = particlesRef.current.getBoundingClientRect()
                const x = (clientX - left) / width
                const y = (clientY - top) / height
                particlesRef.current.style.setProperty('--mouse-x', x.toString())
                particlesRef.current.style.setProperty('--mouse-y', y.toString())
            }
        }

        window.addEventListener('mousemove', handleMouseMove)
        return () => window.removeEventListener('mousemove', handleMouseMove)
    }, [])

    return (
        <div
            ref={particlesRef}
            className="fixed inset-0 pointer-events-none"
            style={{
                filter: 'url(#glow)',
                '--mouse-x': '0.5',
                '--mouse-y': '0.5',
            } as React.CSSProperties}
        >
            {[...Array(50)].map((_, i) => (
                <Particle key={i} delay={Math.random() * 5} />
            ))}
            <svg width="0" height="0">
                <filter id="glow">
                    <feGaussianBlur stdDeviation="3.5" result="coloredBlur" />
                    <feMerge>
                        <feMergeNode in="coloredBlur" />
                        <feMergeNode in="SourceGraphic" />
                    </feMerge>
                </filter>
            </svg>
            <div
                className="absolute inset-0 bg-gradient-radial from-transparent to-transparent"
                style={{
                    background: `radial-gradient(circle at calc(var(--mouse-x) * 100%) calc(var(--mouse-y) * 100%), rgba(255,255,255,0.1) 0%, transparent 50%)`,
                }}
            />
        </div>
    )
}


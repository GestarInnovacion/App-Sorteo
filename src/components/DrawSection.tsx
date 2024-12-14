import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Card, CardContent } from '@/components/ui/card'
import { toast } from '@/hooks/use-toast'
import confetti from 'canvas-confetti'
import { Star } from 'lucide-react'

interface Prize {
    id: number
    name: string
    range_start: number
    range_end: number
    sorteado: boolean
}

interface DrawSectionProps {
    prizes: Prize[]
    onSelectPrize: (prize: Prize) => void
}

export function DrawSection({ prizes, onSelectPrize }: DrawSectionProps) {
    const [, setSelectedPrize] = useState<Prize | null>(null)
    // Eliminar estas líneas
    // const [countdown, setCountdown] = useState<number | null>(null)

    // useEffect(() => {
    //     if (countdown !== null && countdown > 0) {
    //         const timer = setTimeout(() => setCountdown(countdown - 1), 1000)
    //         return () => clearTimeout(timer)
    //     } else if (countdown === 0) {
    //         handleDrawComplete()
    //     }
    // }, [countdown])

    const handleSelectPrize = (prize: Prize) => {
        setSelectedPrize(prize)
        playSound('start')
        onSelectPrize(prize)
        confetti({
            particleCount: 100,
            spread: 70,
            origin: { y: 0.6 }
        })
        playSound('win')
        toast({
            title: "¡Sorteo Realizado!",
            description: `Se ha sorteado el premio: ${prize.name}`,
            variant: "success",
        })
        setSelectedPrize(null)
    }

    // Eliminar la función handleDrawComplete ya que ya no es necesaria.
    // const handleDrawComplete = () => {
    //     if (selectedPrize) {
    //         onSelectPrize(selectedPrize)
    //         confetti({
    //             particleCount: 100,
    //             spread: 70,
    //             origin: { y: 0.6 }
    //         })
    //         playSound('win')
    //         toast({
    //             title: "¡Sorteo Realizado!",
    //             description: `Se ha sorteado el premio: ${selectedPrize.name}`,
    //             variant: "success",
    //         })
    //     }
    //     setSelectedPrize(null)
    // }

    const playSound = (type: 'start' | 'win') => {
        const audio = new Audio(type === 'start' ? '/sounds/countdown.mp3' : '/sounds/winner.mp3')
        audio.play()
    }

    return (
        <div className="space-y-12">
            <div className="relative mb-16">
                <div className="absolute inset-0 bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 opacity-50 filter blur-xl rounded-full"></div>
                <motion.h2
                    className="text-6xl font-extrabold text-center py-8 px-8 relative z-10"
                    initial={{ opacity: 0, y: -20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5 }}
                >
                    <span className="font-serif italic text-transparent bg-clip-text bg-gradient-to-r from-teal-300 to-blue-500 shadow-lg">
                        ¡Realizar Sorteo Espectacular!
                    </span>
                    <motion.span
                        className="absolute left-0 top-1/2 transform -translate-y-1/2 -translate-x-1/2"
                        animate={{ rotate: 360 }}
                        transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
                    >
                        <Star className="text-blue-300 w-16 h-16" />
                    </motion.span>
                    <motion.span
                        className="absolute right-0 top-1/2 transform -translate-y-1/2 translate-x-1/2"
                        animate={{ rotate: -360 }}
                        transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
                    >
                        <Star className="text-blue-300 w-16 h-16" />
                    </motion.span>
                </motion.h2>
            </div>

            <div className="relative">
                <div className="absolute inset-0 bg-gradient-to-r from-blue-400 via-purple-500 to-pink-500 opacity-30 blur-3xl" />
                <div className="relative z-10 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
                    <AnimatePresence>
                        {prizes.filter(p => !p.sorteado).map((prize) => (
                            <motion.div
                                key={prize.id}
                                initial={{ opacity: 0, scale: 0.8 }}
                                animate={{ opacity: 1, scale: 1 }}
                                exit={{ opacity: 0, scale: 0.8 }}
                                whileHover={{ scale: 1.05 }}
                                whileTap={{ scale: 0.95 }}
                            >
                                <Card
                                    className="relative overflow-hidden bg-white/10 backdrop-blur-md border-white/20 cursor-pointer transition-all duration-300 hover:shadow-lg hover:shadow-blue-500/20"
                                    onClick={() => handleSelectPrize(prize)}
                                >
                                    <div className="absolute inset-0 overflow-hidden">
                                        {[...Array(5)].map((_, i) => (
                                            <motion.div
                                                key={i}
                                                className="absolute text-white/10"
                                                initial={{
                                                    top: `${Math.random() * 100}%`,
                                                    left: `${Math.random() * 100}%`,
                                                    scale: Math.random() * 0.5 + 0.5,
                                                }}
                                                animate={{
                                                    top: `${Math.random() * 100}%`,
                                                    left: `${Math.random() * 100}%`,
                                                    scale: Math.random() * 0.5 + 0.5,
                                                    rotate: 360,
                                                }}
                                                transition={{
                                                    duration: Math.random() * 20 + 10,
                                                    repeat: Infinity,
                                                    ease: "linear",
                                                }}
                                            >
                                                <Star className="w-6 h-6" />
                                            </motion.div>
                                        ))}
                                    </div>
                                    <CardContent className="p-6 flex items-center justify-center">
                                        <h3 className="text-xl font-semibold text-white text-center">{prize.name}</h3>
                                    </CardContent>
                                </Card>
                            </motion.div>
                        ))}
                    </AnimatePresence>
                </div>
            </div>

            {/* Eliminar todo este bloque */}
            {/* <AnimatePresence>
                {countdown !== null && (
                    <motion.div
                        initial={{ opacity: 0, scale: 0.5 }}
                        animate={{ opacity: 1, scale: 1 }}
                        exit={{ opacity: 0, scale: 0.5 }}
                        className="fixed inset-0 flex items-center justify-center bg-black/50 backdrop-blur-sm z-50"
                    >
                        <motion.div
                            className="text-9xl font-bold text-white"
                            initial={{ scale: 2 }}
                            animate={{ scale: 1 }}
                            transition={{ duration: 0.5 }}
                        >
                            {countdown}
                        </motion.div>
                    </motion.div>
                )}
            </AnimatePresence> */}
        </div>
    )
}


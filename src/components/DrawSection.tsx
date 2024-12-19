import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Card, CardContent } from '@/components/ui/card'
import { Star } from 'lucide-react'
import { Prize } from '../types'

interface DrawSectionProps {
    prizes: Prize[]
    onSelectPrize: (prize: Prize) => void
}

export function DrawSection({ prizes, onSelectPrize }: DrawSectionProps) {
    const [, setSelectedPrize] = useState<Prize | null>(null)

    const handleSelectPrize = (prize: Prize) => {
        setSelectedPrize(prize)
        onSelectPrize(prize)
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
                        {prizes.map((prize) => (
                            <motion.div
                                key={prize.id_prize}
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
        </div>
    )
}


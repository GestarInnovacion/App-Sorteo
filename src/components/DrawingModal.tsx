import { motion } from 'framer-motion'
import { Dialog, DialogContent, DialogTitle } from '@/components/ui/dialog'
import confetti from 'canvas-confetti'
import { useEffect, useState } from 'react'
import { Gift, Star } from 'lucide-react'

interface DrawingModalProps {
    isOpen: boolean
    onOpenChange: (open: boolean) => void
}

export function DrawingModal({ isOpen, onOpenChange }: DrawingModalProps) {
    const [currentNumber, setCurrentNumber] = useState(0)

    useEffect(() => {
        if (isOpen) {
            const interval = setInterval(() => {
                setCurrentNumber(Math.floor(Math.random() * 1000))
                confetti({
                    particleCount: 50,
                    spread: 70,
                    origin: { y: 0.6 }
                });
            }, 100);

            return () => clearInterval(interval);
        }
    }, [isOpen]);

    return (
        <Dialog open={isOpen} onOpenChange={onOpenChange}>
            <DialogContent className="bg-transparent border-none p-0 overflow-visible max-w-2xl">
                <DialogTitle className="sr-only">Sorteando</DialogTitle>
                <motion.div
                    initial={{ scale: 0.8, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    exit={{ scale: 0.8, opacity: 0 }}
                    className="relative bg-gradient-to-br from-purple-600 to-pink-500 rounded-3xl p-8 overflow-hidden shadow-2xl"
                >
                    <div className="absolute inset-0 bg-[url('/sparkles.svg')] opacity-20 animate-pulse"></div>
                    <motion.div
                        initial={{ y: -20, opacity: 0 }}
                        animate={{ y: 0, opacity: 1 }}
                        transition={{ delay: 0.2 }}
                        className="text-center"
                    >
                        <Gift className="w-20 h-20 mx-auto mb-4 text-yellow-300" />
                        <h2 className="text-4xl font-bold text-white mb-6">¡Sorteando!</h2>
                    </motion.div>
                    <motion.div
                        key={currentNumber}
                        initial={{ y: 50, opacity: 0 }}
                        animate={{ y: 0, opacity: 1 }}
                        exit={{ y: -50, opacity: 0 }}
                        transition={{ type: "spring", stiffness: 300, damping: 20 }}
                        className="text-8xl font-bold text-center text-white mb-6 font-mono"
                    >
                        {currentNumber.toString().padStart(3, '0')}
                    </motion.div>
                    <motion.p
                        animate={{ opacity: [0.5, 1, 0.5] }}
                        transition={{ duration: 1.5, repeat: Infinity }}
                        className="text-2xl text-yellow-200 text-center font-semibold"
                    >
                        Seleccionando ganador...
                    </motion.p>
                    <div className="absolute inset-0 pointer-events-none">
                        {[...Array(20)].map((_, i) => (
                            <motion.div
                                key={i}
                                className="absolute"
                                initial={{
                                    top: `${Math.random() * 100}%`,
                                    left: `${Math.random() * 100}%`,
                                    scale: Math.random() * 0.5 + 0.5,
                                }}
                                animate={{
                                    top: `${Math.random() * 100}%`,
                                    left: `${Math.random() * 100}%`,
                                    rotate: 360,
                                    scale: Math.random() * 0.5 + 0.5,
                                }}
                                transition={{
                                    duration: Math.random() * 20 + 10,
                                    repeat: Infinity,
                                    ease: "linear",
                                }}
                            >
                                <Star className="text-yellow-200 w-4 h-4" />
                            </motion.div>
                        ))}
                    </div>
                </motion.div>
            </DialogContent>
        </Dialog>
    )
}

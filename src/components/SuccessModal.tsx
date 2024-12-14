import { useEffect, useState } from 'react'
import { Dialog, DialogContent } from '@/components/ui/dialog'
import confetti from 'canvas-confetti'
import { motion, AnimatePresence } from 'framer-motion'

interface SuccessModalProps {
    open: boolean
    onOpenChange: (open: boolean) => void
    participantName: string
    participantNumber: string
}

export function SuccessModal({ open, onOpenChange, participantName, participantNumber }: SuccessModalProps) {
    const [showTicket, setShowTicket] = useState(false)

    useEffect(() => {
        if (open) {
            confetti({
                particleCount: 100,
                spread: 70,
                origin: { y: 0.6 }
            })
            setTimeout(() => setShowTicket(true), 1000)
        } else {
            setShowTicket(false)
        }
    }, [open])

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="bg-gradient-to-br from-green-500 to-blue-600 border-none text-white max-w-md">
                <motion.div
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className="p-6 text-center"
                >
                    <motion.div
                        initial={{ scale: 0 }}
                        animate={{ scale: 1 }}
                        transition={{ delay: 0.2, type: "spring" }}
                        className="text-6xl mb-4"
                    >
                        🎉
                    </motion.div>
                    <h2 className="text-3xl font-bold mb-4">¡Felicitaciones!</h2>
                    <p className="text-xl mb-6">
                        {participantName}, has sido registrado exitosamente en el sorteo.
                    </p>
                    <AnimatePresence>
                        {showTicket && (
                            <motion.div
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                exit={{ opacity: 0, y: -20 }}
                                className="bg-white/20 rounded-lg p-6 mb-6"
                            >
                                <h3 className="text-2xl font-semibold mb-2">Tu Boleto</h3>
                                <p className="text-4xl font-bold mb-2">{participantNumber}</p>
                                <p className="text-sm opacity-80">Guarda este número</p>
                            </motion.div>
                        )}
                    </AnimatePresence>
                    <p className="text-lg mb-4">
                        Estás participando por increíbles premios.
                    </p>
                    <motion.p
                        className="text-sm opacity-90"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ delay: 1.5 }}
                    >
                        ¡Mucha suerte! Te notificaremos si resultas ganador.
                    </motion.p>
                </motion.div>
            </DialogContent>
        </Dialog>
    )
}


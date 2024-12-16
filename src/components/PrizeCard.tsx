import { motion } from 'framer-motion'
import { Card, CardContent } from '@/components/ui/card'
import { Flame, Star } from 'lucide-react'
import { Prize } from '../types';

// interface Prize {
//   id_prize: number;
//   name: string;
//   range_start: number;
//   range_end: number;
//   sorteado: boolean;
// }

interface PrizeCardProps {
    prize: Prize
    onClick: () => void
}

export function PrizeCard({ prize, onClick }: PrizeCardProps) {
    // Calcular la intensidad del verde basado en el rango final
    const maxRange = 1000 // Asumimos un rango máximo de 1000
    const intensity = Math.min((prize.range_end / maxRange) * 100, 100)

    return (
        <motion.div
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
        >
            <Card
                className="cursor-pointer transition-all duration-300 hover:shadow-lg hover:shadow-white/20 rounded-2xl overflow-hidden relative bg-white/10 backdrop-blur-md border border-white/20"
                onClick={onClick}
            >
                <CardContent className="p-6 flex flex-col items-center justify-center h-full">
                    <Flame className="h-10 w-10 text-white mb-4 relative z-10" />
                    <h3 className="text-2xl font-bold mb-2 text-center text-white relative z-10">{prize.name}</h3>

                    {/* Estrellas animadas */}
                    {[...Array(5)].map((_, i) => (
                        <motion.div
                            key={i}
                            className="absolute text-white/20"
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
                            <Star className="h-4 w-4" />
                        </motion.div>
                    ))}
                </CardContent>
            </Card>
        </motion.div>
    )
}


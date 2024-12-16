import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { Label } from '@/components/ui/label'
import { Gift, PlusCircle } from 'lucide-react'
import { Prize } from '../types';

//interface Prize {
//  id_prize: number;
//  name: string;
//  range_start: number;
//  range_end: number;
//  sorteado: boolean;
//}

interface AddPrizeModalProps {
    isOpen: boolean
    onOpenChange: (open: boolean) => void
    onAddPrize: (prize: Omit<Prize, 'id_prize' | 'sorteado'>) => void;
}

export function AddPrizeModal({ isOpen, onOpenChange, onAddPrize }: AddPrizeModalProps) {
    const [newPrize, setNewPrize] = useState({ name: '', range_start: '', range_end: '' })

    const handleAddPrize = () => {
        onAddPrize({
            name: newPrize.name,
            range_start: parseInt(newPrize.range_start),
            range_end: parseInt(newPrize.range_end)
        })
        setNewPrize({ name: '', range_start: '', range_end: '' })
        onOpenChange(false)
    }

    return (
        <AnimatePresence>
            {isOpen && (
                <Dialog open={isOpen} onOpenChange={onOpenChange}>
                    <DialogContent className="bg-gradient-to-br from-teal-700 to-blue-900 text-white sm:max-w-[425px] rounded-3xl border-2 border-white/20 shadow-xl">
                        <DialogHeader>
                            <DialogTitle className="text-3xl font-bold text-center flex items-center justify-center">
                                <Gift className="mr-2 h-8 w-8" />
                                Agregar Premio
                            </DialogTitle>
                        </DialogHeader>
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: -20 }}
                            transition={{ duration: 0.3 }}
                            className="grid gap-6 py-4"
                        >
                            <div className="space-y-2">
                                <Label htmlFor="name" className="text-lg font-semibold">
                                    Nombre del Premio
                                </Label>
                                <Input
                                    id="name"
                                    value={newPrize.name}
                                    onChange={(e) => setNewPrize({ ...newPrize, name: e.target.value })}
                                    className="bg-white/10 border-white/20 text-white placeholder-white/50 rounded-xl"
                                    placeholder="Ej: Televisor 4K"
                                />
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="range_start" className="text-lg font-semibold">
                                    Rango Inicial
                                </Label>
                                <Input
                                    id="range_start"
                                    type="number"
                                    value={newPrize.range_start}
                                    onChange={(e) => setNewPrize({ ...newPrize, range_start: e.target.value })}
                                    className="bg-white/10 border-white/20 text-white placeholder-white/50 rounded-xl"
                                    placeholder="Ej: 1"
                                />
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="range_end" className="text-lg font-semibold">
                                    Rango Final
                                </Label>
                                <Input
                                    id="range_end"
                                    type="number"
                                    value={newPrize.range_end}
                                    onChange={(e) => setNewPrize({ ...newPrize, range_end: e.target.value })}
                                    className="bg-white/10 border-white/20 text-white placeholder-white/50 rounded-xl"
                                    placeholder="Ej: 100"
                                />
                            </div>
                        </motion.div>
                        <motion.div
                            initial={{ opacity: 0, scale: 0.8 }}
                            animate={{ opacity: 1, scale: 1 }}
                            exit={{ opacity: 0, scale: 0.8 }}
                            transition={{ duration: 0.3 }}
                        >
                            <Button onClick={handleAddPrize} className="w-full bg-gradient-to-r from-green-400 to-blue-500 hover:from-green-500 hover:to-blue-600 text-white transition-colors duration-200 rounded-xl">
                                <PlusCircle className="mr-2 h-5 w-5" />
                                Agregar Premio
                            </Button>
                        </motion.div>
                    </DialogContent>
                </Dialog>
            )}
        </AnimatePresence>
    )
}


import { useState } from 'react'
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog"
import { motion } from 'framer-motion'
import { AlertTriangle } from 'lucide-react'

interface ResetWarningModalProps {
    isOpen: boolean
    onOpenChange: (open: boolean) => void
    onConfirmReset: (keyword: string) => void
}

export function ResetWarningModal({ isOpen, onOpenChange, onConfirmReset }: ResetWarningModalProps) {
    const [keyword, setKeyword] = useState('')

    const handleConfirm = () => {
        onConfirmReset(keyword)
        setKeyword('')
    }

    return (
        <Dialog open={isOpen} onOpenChange={onOpenChange}>
            <DialogContent className="sm:max-w-[425px] w-[95vw] max-w-[95vw] sm:w-full bg-gradient-to-br from-red-600 to-pink-700 text-white rounded-3xl border-2 border-white/20 shadow-xl overflow-hidden p-0">
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -20 }}
                    transition={{ duration: 0.3 }}
                    className="p-6"
                >
                    <DialogHeader className="space-y-4">
                        <div className="mx-auto bg-red-500 rounded-full p-3 w-16 h-16 flex items-center justify-center">
                            <AlertTriangle className="w-10 h-10 text-white" />
                        </div>
                        <DialogTitle className="text-2xl font-bold text-center">Advertencia: Reinicio Total</DialogTitle>
                        <DialogDescription className="text-white/90 text-center">
                            Esta acción eliminará todos los premios, participantes y ganadores. Este proceso es irreversible.
                        </DialogDescription>
                    </DialogHeader>
                    <div className="mt-6 space-y-4">
                        <Input
                            id="keyword"
                            className="w-full bg-white/10 border-white/20 text-white placeholder-white/50 rounded-xl py-6 px-4 text-lg"
                            placeholder='Ingrese la palabra "Reiniciar"'
                            value={keyword}
                            onChange={(e) => setKeyword(e.target.value)}
                        />
                        <p className="text-sm text-white/70 text-center">
                            Para confirmar, escriba "Reiniciar" en el campo de arriba.
                        </p>
                    </div>
                    <DialogFooter className="mt-8 flex flex-col sm:flex-row gap-4">
                        <Button
                            type="button"
                            variant="secondary"
                            onClick={() => onOpenChange(false)}
                            className="w-full sm:w-1/2 bg-white/20 hover:bg-white/30 text-white rounded-xl py-6 text-lg font-semibold transition-all duration-200"
                        >
                            Cancelar
                        </Button>
                        <Button
                            type="button"
                            variant="destructive"
                            onClick={handleConfirm}
                            className="w-full sm:w-1/2 bg-red-600 hover:bg-red-700 text-white rounded-xl py-6 text-lg font-semibold transition-all duration-200"
                            disabled={keyword !== "Reiniciar"}
                        >
                            Confirmar Reinicio
                        </Button>
                    </DialogFooter>
                </motion.div>
            </DialogContent>
        </Dialog>
    )
}


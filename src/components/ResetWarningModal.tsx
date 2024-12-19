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
            <DialogContent className="sm:max-w-[425px] bg-gradient-to-br from-teal-700 to-blue-900 text-white rounded-3xl border-2 border-white/20 shadow-xl">
                <DialogHeader>
                    <DialogTitle>Advertencia: Reinicio Total</DialogTitle>
                    <DialogDescription className="text-white/80">
                        Esta acción eliminará todos los premios, participantes y ganadores. Este proceso es irreversible.
                    </DialogDescription>
                </DialogHeader>
                <div className="grid gap-4 py-4">
                    <div className="grid grid-cols-4 items-center gap-4">
                        <Input
                            id="keyword"
                            className="col-span-4 bg-white/10 border-white/20 text-white placeholder-white/50"
                            placeholder='Ingrese la palabra clave "REINICIAR_TODO"'
                            value={keyword}
                            onChange={(e) => setKeyword(e.target.value)}
                        />
                    </div>
                </div>
                <DialogFooter>
                    <Button type="button" variant="secondary" onClick={() => onOpenChange(false)} className="bg-white/30 hover:bg-white/40 text-white">
                        Cancelar
                    </Button>
                    <Button type="button" variant="destructive" onClick={handleConfirm} className="bg-red-600 hover:bg-red-700 text-white">
                        Confirmar Reinicio
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    )
}


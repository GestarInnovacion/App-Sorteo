import { Dialog, DialogContent } from '@/components/ui/dialog'
import { motion } from 'framer-motion'

interface ErrorModalProps {
    open: boolean
    onOpenChange: (open: boolean) => void
    existingParticipant: {
        cedula: string
        number: string
        name: string
    } | null
    field: 'cedula' | 'number' | 'name'
}

export function ErrorModal({ open, onOpenChange, existingParticipant, field }: ErrorModalProps) {
    if (!existingParticipant) return null

    const fieldNames = {
        cedula: 'cédula',
        number: 'número de sorteo',
        name: 'nombre'
    }

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="bg-gradient-to-br from-red-500 to-purple-600 border-none text-white">
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
                        ⚠️
                    </motion.div>
                    <h2 className="text-2xl font-bold mb-4">Participante Existente</h2>
                    <p className="text-lg mb-4">
                        Ya existe un registro con {fieldNames[field] === 'cédula' ? 'esta' : 'este'} {fieldNames[field]}
                    </p>
                    <div className="bg-white/10 rounded-lg p-4 text-left">
                        <p className="mb-2"><strong>Cédula:</strong> {existingParticipant.cedula}</p>
                        <p className="mb-2"><strong>Número de Sorteo:</strong> {existingParticipant.number}</p>
                        <p><strong>Nombre:</strong> {existingParticipant.name}</p>
                    </div>
                    <p className="text-sm opacity-90 mt-4">
                        No es posible registrarse más de una vez en el sorteo.
                    </p>
                </motion.div>
            </DialogContent>
        </Dialog>
    )
}


import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { motion, AnimatePresence } from 'framer-motion'
import { Card, CardContent } from '@/components/ui/card'
import { Prize, Participant } from '../types'
import { Gift, User, CheckCircle, XCircle, Trophy } from 'lucide-react'

interface StatisticsDetailModalProps {
    isOpen: boolean
    onOpenChange: (open: boolean) => void
    title: string
    items: (Prize | Participant)[]
    type: 'prizes' | 'participants'
}

export function StatisticsDetailModal({ isOpen, onOpenChange, title, items, type }: StatisticsDetailModalProps) {
    return (
        <AnimatePresence>
            {isOpen && (
                <Dialog open={isOpen} onOpenChange={onOpenChange}>
                    <DialogContent className="sm:max-w-[700px] w-[95vw] max-w-[95vw] sm:w-full bg-gradient-to-br from-teal-700 to-blue-900 text-white rounded-3xl border-2 border-white/20 shadow-xl overflow-hidden">
                        <DialogHeader>
                            <DialogTitle className="text-3xl font-bold text-center text-white mb-6">{title}</DialogTitle>
                        </DialogHeader>
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: -20 }}
                            transition={{ duration: 0.3 }}
                            className="max-h-[60vh] overflow-y-auto pr-2"
                        >
                            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
                                {items.map((item, index) => (
                                    <motion.div
                                        key={index}
                                        initial={{ opacity: 0, scale: 0.8 }}
                                        animate={{ opacity: 1, scale: 1 }}
                                        transition={{ duration: 0.3, delay: index * 0.05 }}
                                    >
                                        <Card className="bg-white/10 border-white/20 overflow-hidden rounded-2xl h-full">
                                            <CardContent className="p-4">
                                                {type === 'prizes' ? (
                                                    <PrizeCard prize={item as Prize} />
                                                ) : (
                                                    <ParticipantCard participant={item as Participant} />
                                                )}
                                            </CardContent>
                                        </Card>
                                    </motion.div>
                                ))}
                            </div>
                        </motion.div>
                    </DialogContent>
                </Dialog>
            )}
        </AnimatePresence>
    )
}

function PrizeCard({ prize }: { prize: Prize }) {
    return (
        <div className="flex flex-col h-full justify-between space-y-2">
            <div className="flex items-center space-x-2 mb-2">
                <Gift className="h-5 w-5 text-purple-300" />
                <h3 className="text-lg font-semibold text-white truncate">{prize.name}</h3>
            </div>
            <p className="text-sm text-white/80">Rango: {prize.range_start.toString().padStart(3, '0')} - {prize.range_end.toString().padStart(3, '0')}</p>
            <div className="mt-2">
                <span className={`px-2 py-1 rounded-full text-xs ${prize.sorteado ? 'bg-yellow-500 text-yellow-900' : 'bg-green-500 text-green-900'}`}>
                    {prize.sorteado ? 'Sorteado' : 'Disponible'}
                </span>
            </div>
        </div>
    )
}

function ParticipantCard({ participant }: { participant: Participant }) {
    const getStatusInfo = () => {
        if (participant.ticket_number && participant.active) {
            return { label: 'Asistente', color: 'bg-green-500 text-white', icon: CheckCircle }
        } else if (participant.ticket_number && !participant.active) {
            return { label: 'Ganador', color: 'bg-yellow-500 text-yellow-900', icon: Trophy }
        } else if (!participant.ticket_number && !participant.active) {
            return { label: 'No Asistente', color: 'bg-red-500 text-white', icon: XCircle }
        } else {
            return { label: 'Registrado', color: 'bg-blue-500 text-white', icon: User }
        }
    }

    const statusInfo = getStatusInfo()
    const StatusIcon = statusInfo.icon

    return (
        <div className="flex flex-col h-full justify-between space-y-2">
            <div className="flex items-center space-x-2 mb-2">
                <User className="h-5 w-5 text-blue-300" />
                <h3 className="text-lg font-semibold text-white truncate">{participant.name}</h3>
            </div>
            <p className="text-sm text-white/80">Cédula: {participant.cedula}</p>
            {participant.ticket_number && (
                <p className="text-sm text-white/80">Número de sorteo: {participant.ticket_number}</p>
            )}
            <div className="mt-2">
                <span className={`px-2 py-1 rounded-full text-xs flex items-center ${statusInfo.color}`}>
                    <StatusIcon className="h-3 w-3 mr-1" />
                    {statusInfo.label}
                </span>
            </div>
        </div>
    )
}


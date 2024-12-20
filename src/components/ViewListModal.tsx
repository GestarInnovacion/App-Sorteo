import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { Card, CardContent } from '@/components/ui/card'
import { ScrollArea } from '@/components/ui/scroll-area'
import { Gift, Users, Trash2, Search, CheckCircle, XCircle, AlertTriangle, User, CreditCard, Ticket, Hash, DollarSign } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip'
import { Input } from '@/components/ui/input'
import { Prize, Participant, PrizeOrParticipant } from '../types'

interface ViewListModalProps {
    isOpen: boolean
    onOpenChange: (open: boolean) => void
    items: PrizeOrParticipant[]
    type: 'prizes' | 'participants'
    onDelete: (id: number) => void
}

export function ViewListModal({ isOpen, onOpenChange, items = [], type, onDelete }: ViewListModalProps) {
    const [searchQuery, setSearchQuery] = useState('')
    const [filteredItems, setFilteredItems] = useState<PrizeOrParticipant[]>(items)

    useEffect(() => {
        const filtered = items.filter((item) => {
            if (type === 'prizes' && 'name' in item) {
                const prize = item as Prize;
                return (
                    prize.name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
                    `${prize.range_start}-${prize.range_end}`.includes(searchQuery)
                );
            } else if (type === 'participants' && 'name' in item) {
                const participant = item as Participant;
                return (
                    participant.name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
                    participant.cedula?.includes(searchQuery) ||
                    participant.ticket_number?.includes(searchQuery)
                );
            }
            return false;
        });
        setFilteredItems(filtered)
    }, [searchQuery, items, type])

    return (
        <AnimatePresence>
            {isOpen && (
                <Dialog open={isOpen} onOpenChange={onOpenChange}>
                    <DialogContent className="bg-gradient-to-br from-teal-700 to-blue-900 text-white sm:max-w-[90vw] rounded-3xl border-2 border-white/20 shadow-xl">
                        <DialogHeader>
                            <DialogTitle className="text-3xl font-bold text-center flex items-center justify-center text-white">
                                {type === 'prizes' ? (
                                    <>
                                        <Gift className="mr-2 h-8 w-8" />
                                        Lista de Premios
                                    </>
                                ) : (
                                    <>
                                        <Users className="mr-2 h-8 w-8" />
                                        Lista de Participantes
                                    </>
                                )}
                            </DialogTitle>
                        </DialogHeader>
                        <div className="flex items-center space-x-2 mb-4">
                            <Search className="text-white/60" />
                            <Input
                                type="text"
                                placeholder={type === 'prizes' ? "Buscar por nombre o rango..." : "Buscar por nombre, cédula o número de sorteo..."}
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                                className="flex-grow bg-white/10 border-white/20 text-white placeholder-white/50 rounded-xl"
                            />
                        </div>
                        <ScrollArea className="h-[70vh] rounded-md">
                            <motion.div
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                exit={{ opacity: 0, y: -20 }}
                                transition={{ duration: 0.3 }}
                                className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 p-4"
                            >
                                {filteredItems.map((item, index) => (
                                    <motion.div
                                        key={index}
                                        initial={{ opacity: 0, scale: 0.8 }}
                                        animate={{ opacity: 1, scale: 1 }}
                                        transition={{ duration: 0.3, delay: index * 0.05 }}
                                    >
                                        <Card className="bg-white/10 border-white/20 overflow-hidden rounded-2xl h-auto">
                                            <CardContent className="p-4 h-full">
                                                {type === 'prizes' ? (
                                                    <PrizeItem
                                                        prize={item as Prize}
                                                        onDelete={onDelete}
                                                    />
                                                ) : (
                                                    <ParticipantItem
                                                        participant={item as Participant}
                                                        onDelete={onDelete}
                                                    />
                                                )}
                                            </CardContent>
                                        </Card>
                                    </motion.div>
                                ))}
                            </motion.div>
                        </ScrollArea>
                    </DialogContent>
                </Dialog>
            )}
        </AnimatePresence>
    )
}

function PrizeItem({ prize, onDelete }: { prize: Prize; onDelete: (id: number) => void }) {
    return (
        <div className="flex flex-col h-full justify-between space-y-2">
            <div className="space-y-2">
                <div className="flex items-center space-x-2">
                    <Gift className="h-5 w-5 text-purple-300" />
                    <h3 className="text-lg font-semibold text-white truncate">{prize.name || 'Unnamed Prize'}</h3>
                </div>
                <div className="flex items-center space-x-2">
                    <Hash className="h-4 w-4 text-blue-300" />
                    <p className="text-sm text-white/80">Rango: {prize.range_start} - {prize.range_end}</p>
                </div>
            </div>
            <div className="flex justify-between space-x-2">
                <span className={`px-2 py-1 rounded-full text-xs flex items-center flex-1 justify-center ${prize.sorteado ? 'bg-yellow-500 text-yellow-900' : 'bg-green-500 text-green-900'}`}>
                    {prize.sorteado ? (
                        <>
                            <CheckCircle className="h-3 w-3 mr-1" />
                            Sorteado
                        </>
                    ) : (
                        <>
                            <DollarSign className="h-3 w-3 mr-1" />
                            Disponible
                        </>
                    )}
                </span>
            </div>
            <div className="flex justify-end">
                <TooltipProvider>
                    <Tooltip>
                        <TooltipTrigger asChild>
                            <Button
                                size="sm"
                                variant="ghost"
                                onClick={() => !prize.sorteado && prize.id_prize && onDelete(prize.id_prize)}
                                className={`text-white rounded-full p-1 ${prize.sorteado ? 'opacity-50 cursor-not-allowed' : 'hover:bg-white/20'}`}
                                disabled={prize.sorteado}
                            >
                                <Trash2 className="h-4 w-4" />
                            </Button>
                        </TooltipTrigger>
                        {prize.sorteado && (
                            <TooltipContent>
                                <p>No se puede eliminar un premio ya sorteado</p>
                            </TooltipContent>
                        )}
                    </Tooltip>
                </TooltipProvider>
            </div>
        </div>
    )
}

function ParticipantItem({ participant, onDelete }: { participant: Participant; onDelete: (id: number) => void }) {
    const getStatusInfo = () => {
        if (!participant.active) {
            return {
                activeLabel: 'Inactivo',
                asistenciaLabel: 'Ausente',
                activeColor: 'bg-red-500 text-white',
                asistenciaColor: 'bg-red-500 text-white',
                icon: XCircle
            }
        } else if (!participant.asistencia) {
            return {
                activeLabel: 'Activo',
                asistenciaLabel: 'Inactivo',
                activeColor: 'bg-green-500 text-white',
                asistenciaColor: 'bg-yellow-500 text-yellow-900',
                icon: AlertTriangle
            }
        } else {
            return {
                activeLabel: 'Activo',
                asistenciaLabel: 'Activo',
                activeColor: 'bg-green-500 text-white',
                asistenciaColor: 'bg-green-500 text-white',
                icon: CheckCircle
            }
        }
    }

    const statusInfo = getStatusInfo()
    const StatusIcon = statusInfo.icon

    return (
        <div className="flex flex-col h-full justify-between space-y-2">
            <div className="space-y-2">
                <div className="flex items-center space-x-2">
                    <User className="h-5 w-5 text-blue-300" />
                    <h3 className="text-lg font-semibold text-white truncate">{participant.name || 'Unnamed Participant'}</h3>
                </div>
                <div className="flex items-center space-x-2">
                    <CreditCard className="h-4 w-4 text-green-300" />
                    <p className="text-sm text-white/80 truncate">{participant.cedula || 'No ID'}</p>
                </div>
                <div className="flex items-center space-x-2">
                    <Ticket className="h-4 w-4 text-yellow-300" />
                    <p className="text-sm text-white/80">{participant.ticket_number || 'No ticket'}</p>
                </div>
            </div>
            <div className="flex justify-between space-x-2">
                <span className={`px-2 py-1 rounded-full text-xs flex items-center flex-1 justify-center ${statusInfo.activeColor}`}>
                    <StatusIcon className="h-3 w-3 mr-1" />
                    Estado: {statusInfo.activeLabel}
                </span>
                <span className={`px-2 py-1 rounded-full text-xs flex items-center flex-1 justify-center ${statusInfo.asistenciaColor}`}>
                    <StatusIcon className="h-3 w-3 mr-1" />
                    Asistencia: {statusInfo.asistenciaLabel}
                </span>
            </div>
            <div className="flex justify-end">
                <TooltipProvider>
                    <Tooltip>
                        <TooltipTrigger asChild>
                            <Button
                                size="sm"
                                variant="ghost"
                                onClick={() => participant.active && onDelete(participant.id_participant)}
                                className={`text-white rounded-full p-1 ${!participant.active ? 'opacity-50 cursor-not-allowed' : 'hover:bg-white/20'}`}
                                disabled={!participant.active}
                            >
                                <Trash2 className="h-4 w-4" />
                            </Button>
                        </TooltipTrigger>
                        {!participant.active && (
                            <TooltipContent>
                                <p>No se puede eliminar un participante inactivo</p>
                            </TooltipContent>
                        )}
                    </Tooltip>
                </TooltipProvider>
            </div>
        </div>
    )
}


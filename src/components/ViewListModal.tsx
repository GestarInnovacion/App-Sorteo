import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { Card, CardContent } from '@/components/ui/card'
import { ScrollArea } from '@/components/ui/scroll-area'
import { Gift, Users, Trash2, Search } from 'lucide-react'
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

export function ViewListModal({ isOpen, onOpenChange, items, type, onDelete }: ViewListModalProps) {
    const [searchQuery, setSearchQuery] = useState('')
    const [filteredItems, setFilteredItems] = useState(items)

    useEffect(() => {
        const filtered = items.filter((item) => {
            if (type === 'prizes') {
                const prize = item as Prize
                return (
                    prize.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                    `${prize.range_start}-${prize.range_end}`.includes(searchQuery)
                )
            } else {
                const participant = item as Participant
                return (
                    participant.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                    participant.cedula.includes(searchQuery)
                )
            }
        })
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
                                placeholder={type === 'prizes' ? "Buscar por nombre o rango..." : "Buscar por nombre o cédula..."}
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
                                        <Card className="bg-white/10 border-white/20 overflow-hidden rounded-2xl h-32">
                                            <CardContent className="p-2 h-full">
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
        <div className="flex flex-col h-full justify-between py-1">
            <div>
                <h3 className="text-base font-semibold text-white truncate mb-1">{prize.name}</h3>
                <p className="text-xs text-white/80">Rango: {prize.range_start} - {prize.range_end}</p>
            </div>
            <div className="flex justify-between items-center">
                <span className={`px-1.5 py-0.5 rounded-full text-[10px] ${prize.sorteado ? 'bg-yellow-500 text-yellow-900' : 'bg-green-500 text-green-900'}`}>
                    {prize.sorteado ? 'Sorteado' : 'Disponible'}
                </span>
                <TooltipProvider>
                    <Tooltip>
                        <TooltipTrigger asChild>
                            <span>
                                <Button
                                    size="sm"
                                    variant="ghost"
                                    onClick={() => !prize.sorteado && prize.id_prize && onDelete(prize.id_prize)}
                                    className={`text-white rounded-full p-1 ${prize.sorteado ? 'opacity-50 cursor-not-allowed' : 'hover:bg-white/20'}`}
                                    disabled={prize.sorteado}
                                >
                                    <Trash2 className="h-3 w-3" />
                                </Button>
                            </span>
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
    return (
        <div className="flex flex-col h-full justify-between py-1">
            <div>
                <h3 className="text-base font-semibold text-white truncate mb-1">{participant.name}</h3>
                <p className="text-xs text-white/80 truncate">Cédula: {participant.cedula}</p>
                <p className="text-xs text-white/80">Número: {participant.ticket_number}</p>
            </div>
            <div className="flex justify-between items-center">
                <span className={`px-1.5 py-0.5 rounded-full text-[10px] ${participant.active ? 'bg-green-500 text-green-900' : 'bg-red-500 text-red-900'}`}>
                    {participant.active ? 'Activo' : 'Inactivo'}
                </span>
                <TooltipProvider>
                    <Tooltip>
                        <TooltipTrigger asChild>
                            <span>
                                <Button
                                    size="sm"
                                    variant="ghost"
                                    onClick={() => participant.active && onDelete(participant.id_participant)}
                                    className={`text-white rounded-full p-1 ${!participant.active ? 'opacity-50 cursor-not-allowed' : 'hover:bg-white/20'}`}
                                    disabled={!participant.active}
                                >
                                    <Trash2 className="h-3 w-3" />
                                </Button>
                            </span>
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


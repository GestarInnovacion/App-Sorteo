import { useState, useEffect } from 'react'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog'
import { Input } from '@/components/ui/input'
import { motion, AnimatePresence } from 'framer-motion'
import { Search, Ticket, User, CreditCard } from 'lucide-react'
import { Participant } from '../types'

interface LookupModalProps {
    isOpen: boolean
    onOpenChange: (open: boolean) => void
}

export function LookupModal({ isOpen, onOpenChange }: LookupModalProps) {
    const [searchTerm, setSearchTerm] = useState('')
    const [suggestions, setSuggestions] = useState<Participant[]>([])
    const [selectedParticipant, setSelectedParticipant] = useState<Participant | null>(null)
    const [participants, setParticipants] = useState<Participant[]>([])

    useEffect(() => {
        const storedParticipants = JSON.parse(localStorage.getItem('participants') || '[]') as Participant[]
        setParticipants(storedParticipants)
    }, [])

    useEffect(() => {
        if (searchTerm.length > 2) {
            const filteredParticipants = participants.filter(p =>
                p.cedula.includes(searchTerm) || p.name.toLowerCase().includes(searchTerm.toLowerCase())
            )
            setSuggestions(filteredParticipants.slice(0, 5))
        } else {
            setSuggestions([])
        }
    }, [searchTerm, participants])

    const handleSelectParticipant = (participant: Participant) => {
        setSelectedParticipant(participant)
        setSearchTerm('')
        setSuggestions([])
    }

    return (
        <Dialog open={isOpen} onOpenChange={onOpenChange}>
            <DialogContent
                className="bg-gradient-to-br from-green-600 to-blue-900 border-none text-white sm:max-w-[425px] rounded-3xl overflow-hidden"
                description="Busca un participante por número de cédula o nombre para ver su número de sorteo"
            >
                <DialogHeader>
                    <DialogTitle className="text-3xl font-bold text-center mb-6">Buscar Número de Sorteo</DialogTitle>
                    <DialogDescription className="text-white/80 text-center">
                        Busca un participante por número de cédula o nombre para ver su número de sorteo
                    </DialogDescription>
                </DialogHeader>
                <div className="relative">
                    <Input
                        placeholder="Ingrese número de cédula o nombre"
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="bg-white/10 border-white/20 text-white placeholder:text-white/50 rounded-full py-6 pl-12 pr-4 text-lg"
                    />
                    <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-white/50 h-6 w-6" />
                </div>
                <AnimatePresence>
                    {suggestions.length > 0 && (
                        <motion.div
                            initial={{ opacity: 0, y: -10 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: -10 }}
                            className="mt-4 bg-white/10 rounded-2xl overflow-hidden"
                        >
                            {suggestions.map((participant) => (
                                <motion.div
                                    key={participant.id_participant}
                                    whileHover={{ backgroundColor: 'rgba(255, 255, 255, 0.2)' }}
                                    className="p-3 cursor-pointer transition-colors duration-200"
                                    onClick={() => handleSelectParticipant(participant)}
                                >
                                    <p className="text-white font-semibold">{participant.name}</p>
                                    <p className="text-white/70 text-sm">CC: {participant.cedula}</p>
                                </motion.div>
                            ))}
                        </motion.div>
                    )}
                </AnimatePresence>
                <AnimatePresence>
                    {selectedParticipant && (
                        <motion.div
                            initial={{ opacity: 0, scale: 0.9 }}
                            animate={{ opacity: 1, scale: 1 }}
                            exit={{ opacity: 0, scale: 0.9 }}
                            className="mt-6 bg-white/20 backdrop-blur-md rounded-3xl overflow-hidden"
                        >
                            <div className="p-6 space-y-4">
                                <div className="flex items-center space-x-4">
                                    <div className="bg-white/30 p-3 rounded-full">
                                        <User className="h-8 w-8 text-white" />
                                    </div>
                                    <div>
                                        <h3 className="text-2xl font-bold">{selectedParticipant.name}</h3>
                                        <p className="text-white/70">Participante</p>
                                    </div>
                                </div>
                                <div className="flex items-center space-x-4">
                                    <div className="bg-white/30 p-3 rounded-full">
                                        <CreditCard className="h-6 w-6 text-white" />
                                    </div>
                                    <p className="text-xl"><span className="font-semibold">CC:</span> {selectedParticipant.cedula}</p>
                                </div>
                                <div className="flex items-center space-x-4">
                                    <div className="bg-white/30 p-3 rounded-full">
                                        <Ticket className="h-6 w-6 text-white" />
                                    </div>
                                    <p className="text-3xl font-bold">{selectedParticipant.ticket_number}</p>
                                </div>
                            </div>
                            <div className="bg-gradient-to-r from-yellow-400 to-orange-500 p-4 text-center">
                                <p className="text-lg font-semibold">Número de Sorteo</p>
                            </div>
                        </motion.div>
                    )}
                </AnimatePresence>
                {!selectedParticipant && (
                    <p className="text-center text-white/70 mt-4">
                        Ingrese el número de cédula o nombre para buscar un participante
                    </p>
                )}
            </DialogContent>
        </Dialog>
    )
}


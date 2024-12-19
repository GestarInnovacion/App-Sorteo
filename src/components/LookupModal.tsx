import { useState, useEffect } from 'react'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog'
import { Input } from '@/components/ui/input'
import { motion, AnimatePresence } from 'framer-motion'
import { Search, Ticket, User, CreditCard } from 'lucide-react'
import { Participant } from '../types'
import { request } from '@/services/index'
import { URL_PARTICIPANT } from '@/constants/index'

interface LookupModalProps {
    isOpen: boolean
    onOpenChange: (open: boolean) => void
}

export function LookupModal({ isOpen, onOpenChange }: LookupModalProps) {
    const [searchTerm, setSearchTerm] = useState('')
    const [selectedParticipant, setSelectedParticipant] = useState<Participant | null>(null)
    const [participants, setParticipants] = useState<Participant[]>([])
    const [error, setError] = useState<string | null>(null)

    useEffect(() => {
        const fetchParticipants = async () => {
            try {
                const response = await request(URL_PARTICIPANT, 'GET')
                if (response.status_code === 200) {
                    setParticipants(response.data)
                }
            } catch (error) {
                console.error('Error fetching participants:', error)
            }
        }

        if (isOpen) {
            fetchParticipants()
        }
    }, [isOpen])

    useEffect(() => {
        if (searchTerm.length > 0) {
            const foundParticipant = participants.find(p => p.cedula === searchTerm)
            if (foundParticipant) {
                setSelectedParticipant(foundParticipant)
                setError(null)
            } else {
                setSelectedParticipant(null)
                setError('No se encontró ningún participante con ese número de cédula.')
            }
        } else {
            setSelectedParticipant(null)
            setError(null)
        }
    }, [searchTerm, participants])

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const value = e.target.value.replace(/\D/g, '') // Solo permite números
        setSearchTerm(value)
    }

    return (
        <Dialog open={isOpen} onOpenChange={onOpenChange}>
            <DialogContent
                className="bg-gradient-to-br from-purple-900 to-blue-900 border-none text-white sm:max-w-[425px] rounded-3xl overflow-hidden"
            >
                <DialogHeader>
                    <DialogTitle className="text-3xl font-bold text-center mb-6">Buscar Número de Sorteo</DialogTitle>
                    <DialogDescription className="text-white/80 text-center">
                        Ingrese el número de cédula completo para buscar su número de sorteo
                    </DialogDescription>
                </DialogHeader>
                <div className="relative mb-4">
                    <Input
                        placeholder="Ingrese número de cédula completo"
                        value={searchTerm}
                        onChange={handleInputChange}
                        className="bg-white/10 border-white/20 text-white placeholder:text-white/50 rounded-full py-6 pl-12 pr-4 text-lg"
                    />
                    <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-white/50 h-6 w-6" />
                </div>
                <AnimatePresence>
                    {selectedParticipant && (
                        <motion.div
                            initial={{ opacity: 0, scale: 0.9 }}
                            animate={{ opacity: 1, scale: 1 }}
                            exit={{ opacity: 0, scale: 0.9 }}
                            className="mt-6 bg-white/10 backdrop-blur-md rounded-3xl overflow-hidden"
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
                            <div className="bg-gradient-to-r from-blue-500 to-purple-500 p-4 text-center">
                                <p className="text-lg font-semibold">Número de Sorteo</p>
                            </div>
                        </motion.div>
                    )}
                </AnimatePresence>
                {error && (
                    <p className="text-center text-red-400 mt-4">
                        {error}
                    </p>
                )}
                {!selectedParticipant && !error && searchTerm.length > 0 && (
                    <p className="text-center text-white/70 mt-4">
                        Buscando...
                    </p>
                )}
                {!selectedParticipant && !error && searchTerm.length === 0 && (
                    <p className="text-center text-white/70 mt-4">
                        Ingrese el número de cédula completo para buscar
                    </p>
                )}
            </DialogContent>
        </Dialog>
    )
}


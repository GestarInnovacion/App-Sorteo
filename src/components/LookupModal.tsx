import { useState } from 'react'
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { motion, AnimatePresence } from 'framer-motion'
import { Search, Ticket } from 'lucide-react'

interface LookupModalProps {
    isOpen: boolean
    onOpenChange: (open: boolean) => void
}

export function LookupModal({ isOpen, onOpenChange }: LookupModalProps) {
    const [searchTerm, setSearchTerm] = useState('')
    const [searchResult, setSearchResult] = useState<{ number: string; name: string } | null>(null)
    const [isSearching, setIsSearching] = useState(false)

    const handleSearch = () => {
        setIsSearching(true)
        setTimeout(() => {
            const participants = JSON.parse(localStorage.getItem('participants') || '[]')
            const found = participants.find((p: any) =>
                p.cedula === searchTerm || p.name.toLowerCase() === searchTerm.toLowerCase()
            )
            setSearchResult(found ? { number: found.number, name: found.name } : null)
            setIsSearching(false)
        }, 1000) // Simulating a delay for the search
    }

    return (
        <Dialog open={isOpen} onOpenChange={onOpenChange}>
            <DialogContent className="bg-gradient-to-br from-blue-600 to-red-500 border-none text-white sm:max-w-[425px]">
                <DialogHeader>
                    <DialogTitle className="text-2xl font-bold text-center">Buscar Número de Sorteo</DialogTitle>
                </DialogHeader>
                <div className="mt-4">
                    <Input
                        placeholder="Ingrese su cédula o nombre completo"
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="bg-white/10 border-white/20 text-white placeholder:text-white/50"
                    />
                    <Button
                        onClick={handleSearch}
                        className="w-full mt-4 bg-white text-blue-600 hover:bg-white/90 transition-colors duration-200"
                        disabled={isSearching}
                    >
                        {isSearching ? 'Buscando...' : 'Buscar'}
                        <Search className="ml-2 h-4 w-4" />
                    </Button>
                </div>
                <AnimatePresence>
                    {searchResult && (
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: -20 }}
                            className="mt-6 p-4 bg-white/20 backdrop-blur-md rounded-lg"
                        >
                            <h3 className="text-xl font-semibold mb-2">Resultado:</h3>
                            <p className="mb-2"><strong>Nombre:</strong> {searchResult.name}</p>
                            <p className="text-2xl font-bold flex items-center">
                                <Ticket className="mr-2 h-6 w-6" />
                                Número de Sorteo: {searchResult.number}
                            </p>
                        </motion.div>
                    )}
                    {searchResult === null && searchTerm && !isSearching && (
                        <motion.p
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            className="mt-4 text-center text-red-200"
                        >
                            No se encontró ningún participante con esa información.
                        </motion.p>
                    )}
                </AnimatePresence>
            </DialogContent>
        </Dialog>
    )
}


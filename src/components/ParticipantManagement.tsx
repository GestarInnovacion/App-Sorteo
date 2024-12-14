import { useState, useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from '@/components/ui/table'
import { useToast } from '@/hooks/use-toast'

interface Participant {
    id: number
    cedula: string
    number: string
    name: string
    active: boolean
}

const ParticipantManagement = () => {
    const [participants, setParticipants] = useState<Participant[]>([])
    const [newParticipant, setNewParticipant] = useState({ cedula: '', number: '', name: '' })
    const { toast } = useToast()

    useEffect(() => {
        const storedParticipants = JSON.parse(localStorage.getItem('participants') || '[]')
        setParticipants(storedParticipants)
    }, [])

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setNewParticipant({ ...newParticipant, [e.target.name]: e.target.value })
    }

    const handleAddParticipant = () => {
        const participant: Participant = {
            id: participants.length + 1,
            ...newParticipant,
            active: true
        }
        const updatedParticipants = [...participants, participant]
        setParticipants(updatedParticipants)
        localStorage.setItem('participants', JSON.stringify(updatedParticipants))
        setNewParticipant({ cedula: '', number: '', name: '' })
        toast({
            title: "Participante añadido",
            description: "El participante ha sido agregado exitosamente.",
        })
    }

    const handleDeleteParticipant = (id: number) => {
        const updatedParticipants = participants.filter(participant => participant.id !== id)
        setParticipants(updatedParticipants)
        localStorage.setItem('participants', JSON.stringify(updatedParticipants))
        toast({
            title: "Participante eliminado",
            description: "El participante ha sido eliminado exitosamente.",
        })
    }

    const handleDeleteAll = () => {
        setParticipants([])
        localStorage.setItem('participants', JSON.stringify([]))
        toast({
            title: "Participantes eliminados",
            description: "Todos los participantes han sido eliminados.",
        })
    }

    const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0]
        if (file) {
            const reader = new FileReader()
            reader.onload = (event) => {
                const csv = event.target?.result
                if (typeof csv === 'string') {
                    const lines = csv.split('\n')
                    const newParticipants: Participant[] = lines.slice(1).map((line, index) => {
                        const [cedula, number, name] = line.split(',')
                        return {
                            id: participants.length + index + 1,
                            cedula: cedula.trim(),
                            number: number.trim(),
                            name: name.trim(),
                            active: true
                        }
                    })
                    const updatedParticipants = [...participants, ...newParticipants]
                    setParticipants(updatedParticipants)
                    localStorage.setItem('participants', JSON.stringify(updatedParticipants))
                    toast({
                        title: "Archivo cargado",
                        description: "El archivo CSV ha sido procesado exitosamente.",
                    })
                }
            }
            reader.readAsText(file)
        }
    }

    const activeParticipants = participants.filter(p => p.active).length
    const inactiveParticipants = participants.length - activeParticipants

    return (
        <div className="space-y-8 bg-white p-8 rounded-lg shadow-xl">
            <h2 className="text-3xl font-bold text-center mb-6 text-purple-800">Gestión de Participantes Afortunados</h2>
            <div className="grid grid-cols-4 gap-4">
                <div className="space-y-2">
                    <Label htmlFor="cedula" className="text-lg">Cédula</Label>
                    <Input id="cedula" name="cedula" value={newParticipant.cedula} onChange={handleInputChange} className="border-2 border-purple-300 focus:border-purple-500" />
                </div>
                <div className="space-y-2">
                    <Label htmlFor="number" className="text-lg">Número de Teléfono</Label>
                    <Input id="number" name="number" value={newParticipant.number} onChange={handleInputChange} className="border-2 border-purple-300 focus:border-purple-500" />
                </div>
                <div className="space-y-2">
                    <Label htmlFor="name" className="text-lg">Nombre Completo</Label>
                    <Input id="name" name="name" value={newParticipant.name} onChange={handleInputChange} className="border-2 border-purple-300 focus:border-purple-500" />
                </div>
                <div className="flex items-end">
                    <Button onClick={handleAddParticipant} className="w-full bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 text-white font-bold py-2 px-4 rounded-full transition-all duration-200 transform hover:scale-105">
                        Agregar Participante
                    </Button>
                </div>
            </div>
            <div>
                <Input type="file" accept=".csv" onChange={handleFileUpload} className="mb-2" />
                <p className="text-sm text-gray-500 mt-2">Cargar participantes desde archivo CSV</p>
            </div>
            <div className="flex justify-between items-center">
                <div>
                    <p className="text-lg">Participantes activos: <span className="font-bold text-green-600">{activeParticipants}</span></p>
                    <p className="text-lg">Participantes inactivos: <span className="font-bold text-red-600">{inactiveParticipants}</span></p>
                </div>
                <Button variant="destructive" onClick={handleDeleteAll} className="bg-red-500 hover:bg-red-600 text-white font-bold py-2 px-4 rounded-full transition-all duration-200 transform hover:scale-105">
                    Eliminar Todos
                </Button>
            </div>
            <Table>
                <TableHeader>
                    <TableRow>
                        <TableHead>ID</TableHead>
                        <TableHead>Cédula</TableHead>
                        <TableHead>Número</TableHead>
                        <TableHead>Nombre</TableHead>
                        <TableHead>Activo</TableHead>
                        <TableHead>Acciones</TableHead>
                    </TableRow>
                </TableHeader>
                <TableBody>
                    {participants.map((participant) => (
                        <TableRow key={participant.id}>
                            <TableCell>{participant.id}</TableCell>
                            <TableCell>{participant.cedula}</TableCell>
                            <TableCell>{participant.number}</TableCell>
                            <TableCell>{participant.name}</TableCell>
                            <TableCell>{participant.active ? 'Sí' : 'No'}</TableCell>
                            <TableCell>
                                <Button variant="destructive" onClick={() => handleDeleteParticipant(participant.id)} className="bg-red-500 hover:bg-red-600 text-white font-bold py-1 px-2 rounded-full transition-all duration-200 transform hover:scale-105">
                                    Eliminar
                                </Button>
                            </TableCell>
                        </TableRow>
                    ))}
                </TableBody>
            </Table>
        </div>
    )
}

export default ParticipantManagement


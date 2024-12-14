import { useState, useEffect } from 'react'
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from '@/components/ui/table'

interface Winner {
    id: number
    participantName: string
    prizeName: string
    drawDate: string
}

const WinnerManagement = () => {
    const [winners, setWinners] = useState<Winner[]>([])

    useEffect(() => {
        const storedWinners = JSON.parse(localStorage.getItem('winners') || '[]')
        setWinners(storedWinners)
    }, [])

    return (
        <div className="space-y-8 bg-white p-8 rounded-lg shadow-xl">
            <h2 className="text-3xl font-bold text-center mb-6 text-yellow-600">¡Nuestros Afortunados Ganadores!</h2>
            {winners.length === 0 ? (
                <p className="text-center text-xl text-gray-600">Aún no hay ganadores. ¡Realiza un sorteo para ver resultados aquí!</p>
            ) : (
                <Table>
                    <TableHeader>
                        <TableRow>
                            <TableHead>ID</TableHead>
                            <TableHead>Nombre del Ganador</TableHead>
                            <TableHead>Premio</TableHead>
                            <TableHead>Fecha del Sorteo</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {winners.map((winner) => (
                            <TableRow key={winner.id} className="hover:bg-yellow-100 transition-colors duration-200">
                                <TableCell>{winner.id}</TableCell>
                                <TableCell className="font-semibold">{winner.participantName}</TableCell>
                                <TableCell>{winner.prizeName}</TableCell>
                                <TableCell>{winner.drawDate}</TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            )}
        </div>
    )
}

export default WinnerManagement


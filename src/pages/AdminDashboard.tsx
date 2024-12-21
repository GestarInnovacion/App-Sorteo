'use client'

import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Button } from '@/components/ui/button'
import { useNavigate } from 'react-router-dom'
import { Home, LogOut, Gift, Users, Trophy, Plus, Upload, List, Trash2, RefreshCw, X, Menu } from 'lucide-react'
import { useToast } from '@/hooks/use-toast'
import { AddPrizeModal } from '@/components/AddPrizeModal'
import UploadCSVModal from '@/components/UploadCSVModal'
import { UploadParticipantsCSVModal } from '@/components/UploadParticipantsCSVModal'
import { ViewListModal } from '@/components/ViewListModal'
import { Card, CardContent } from '@/components/ui/card'
import { DrawingModal } from '@/components/DrawingModal'
import { WinnerModal } from '@/components/WinnerModal'
import { DrawSection } from '@/components/DrawSection'
import { Prize, Participant, Winner } from '../types'
import { ResetWarningModal } from '@/components/ResetWarningModal'
import MinimalistLoader from '@/components/MinimalistLoader'
import { AddParticipantModal } from '@/components/AddParticipantModal'
import { StatisticsDetailModal } from '@/components/StatisticsDetailModal'

import { request } from '@/services/index'
import { URL_PARTICIPANT, URL_PRIZE, URL_WINNER, URL_PRIZE_BULK, URL_WINNER_FULL, URL_WINNER_FILTER, URL_PARTICIPANTS_BULK } from '@/constants/index'

const AdminDashboard = () => {
    const [prizes, setPrizes] = useState<Prize[]>([])
    const [participants, setParticipants] = useState<Participant[]>([])
    const [winners, setWinners] = useState<Winner[]>([])
    const [showAddPrizeModal, setShowAddPrizeModal] = useState(false)
    const [showUploadCSVModal, setShowUploadCSVModal] = useState(false)
    const [showUploadParticipantsCSVModal, setShowUploadParticipantsCSVModal] = useState(false)
    const [showPrizeListModal, setShowPrizeListModal] = useState(false)
    const [showParticipantListModal, setShowParticipantListModal] = useState(false)
    const [showDrawingModal, setShowDrawingModal] = useState(false)
    const [showWinnerModal, setShowWinnerModal] = useState(false)
    const [currentWinner, setCurrentWinner] = useState<Winner | null>(null)
    const [isLeftPanelVisible, setIsLeftPanelVisible] = useState(true)
    const [showResetWarningModal, setShowResetWarningModal] = useState(false)
    const [showAddParticipantModal, setShowAddParticipantModal] = useState(false)
    const navigate = useNavigate()
    const { toast } = useToast()

    const [loading, setLoading] = useState(true)
    const [error, setError] = useState(false)
    const [isMobile, setIsMobile] = useState(false);
    const [showStatisticsModal, setShowStatisticsModal] = useState(false)
    const [statisticsModalTitle, setStatisticsModalTitle] = useState('')
    const [statisticsModalItems, setStatisticsModalItems] = useState<(Prize | Participant)[]>([])
    const [statisticsModalType, setStatisticsModalType] = useState<'prizes' | 'participants'>('prizes')

    useEffect(() => {
        const loadData = async () => {
            try {
                const responseParticipants = await request(URL_PARTICIPANT, 'GET')
                if (responseParticipants.status_code === 200) {
                    setParticipants(responseParticipants.data)
                } else {
                    navigate('/')
                    return
                }

                const responsePrize = await request(URL_PRIZE, 'GET')
                if (responsePrize.status_code === 200) {
                    setPrizes(responsePrize.data)
                } else {
                    navigate('/')
                    return
                }

                const responseWinners = await request(URL_WINNER, 'GET')
                if (responseWinners.status_code === 200) {
                    setWinners(responseWinners.data)
                } else {
                    navigate('/')
                    return
                }
            } catch (err) {
                console.error('Error al cargar los datos:', err)
                setError(true)
                navigate('/')
            } finally {
                setLoading(false)
            }
        }

        loadData()
    }, [navigate])

    useEffect(() => {
        const checkMobile = () => {
            setIsMobile(window.innerWidth < 1024);
        };
        checkMobile();
        window.addEventListener('resize', checkMobile);
        return () => window.removeEventListener('resize', checkMobile);
    }, []);

    if (loading) {
        return (
            <MinimalistLoader
                text="Cargando"
                color="#3b82f6"
                blur={10}
            />
        )
    }

    if (error) {
        return <div>Error al cargar los datos. Redirigiendo...</div>
    }

    const handleAddPrize = async (newPrize: Omit<Prize, 'id_prize' | 'sorteado'>) => {
        const prize: Prize = {
            ...newPrize,
            id_prize: 0, // This will be replaced by the backend
            sorteado: false
        }

        const responsePrize = await request(URL_PRIZE, "POST", prize)

        if (responsePrize.status_code === 200) {
            const updatedPrizes = [...prizes, responsePrize.data]
            setPrizes(updatedPrizes)
            toast({
                variant: "success",
                title: "Premio añadido",
                description: "El premio ha sido agregado exitosamente.",
            })
        }
    }

    const handleUploadCSV = async (newPrizes: { name: string; range_start: string; range_end: string; }[]) => {
        const result = await request(URL_PRIZE_BULK, "POST", { "prizes": newPrizes })

        if (result.status_code === 200) {
            const updatedPrizes = [...prizes, ...result.data]
            setPrizes(updatedPrizes)

            toast({
                variant: "success",
                title: "CSV cargado",
                description: `Se han agregado ${newPrizes.length} premios exitosamente.`,
            })
        }
    }

    const handleUploadParticipantsCSV = async (file: File) => {
        const reader = new FileReader();

        reader.onload = async (e) => {
            const text = e.target?.result as string;
            const rows = text.split('\n').filter(row => row.trim() !== '');

            // Filtrar participantes con campos vacíos (name, cedula o ticket_number)
            const newParticipants: Omit<Participant, 'id_participant'>[] = rows.map((row) => {
                const [name, cedula] = row.split(';').map(field => field.trim());

                // Validar si alguno de los campos está vacío
                if (name && cedula) {
                    return {
                        name,
                        cedula,
                        active: false
                    };
                }
                return null;
            }).filter(participant => participant !== null);

            const result = await request(URL_PARTICIPANTS_BULK, "POST", { "participants": newParticipants });


            if (result.status_code === 200) {
                const updatedParticipants = [...participants, ...result.data]
                setParticipants(updatedParticipants)

                toast({
                    variant: "success",
                    title: "CSV cargado",
                    description: `Se han agregado ${newParticipants.length} participantes exitosamente.`,
                })
            } else {
                toast({
                    variant: "destructive",
                    title: "Error",
                    description: "Hubo un problema al cargar los participantes. Por favor, inténtelo de nuevo.",
                })
            }
        }
        reader.readAsText(file)
    }

    const handleDeletePrize = async (prizeId: number) => {
        const response = await request(URL_PRIZE, "DELETE", { id_prize: prizeId })
        if (response.status_code === 200) {
            const updatedPrizes = prizes.filter(prize => prize.id_prize !== prizeId)
            setPrizes(updatedPrizes)
            toast({
                variant: "success",
                title: "Premio eliminado",
                description: "El premio ha sido eliminado exitosamente.",
            })
        } else {
            toast({
                variant: "destructive",
                title: "Error",
                description: "No se pudo eliminar el premio. Por favor, inténtelo de nuevo.",
            })
        }
    }

    const handleDeleteParticipant = async (participantId: number) => {
        const response = await request(URL_PARTICIPANT, "DELETE", { id_participant: participantId })
        if (response.status_code === 200) {
            const updatedParticipants = participants.filter(participant => participant.id_participant !== participantId)
            setParticipants(updatedParticipants)
            toast({
                variant: "success",
                title: "Participante eliminado",
                description: "El participante ha sido eliminado exitosamente.",
            })
        } else {
            toast({
                variant: "destructive",
                title: "Error",
                description: "No se pudo eliminar el participante. Por favor, inténtelo de nuevo.",
            })
        }
    }

    const handleSelectPrize = async (prize: Prize) => {
        const availableParticipants = participants.filter(p =>
            p.active && parseInt(p.ticket_number ? p.ticket_number : "") >= prize.range_start && parseInt(p.ticket_number ? p.ticket_number : "") <= prize.range_end
        )

        if (availableParticipants.length === 0) {
            toast({
                title: "No se puede realizar el sorteo",
                description: `No hay participantes elegibles en el rango ${prize.range_start} - ${prize.range_end} para el premio "${prize.name}".`,
                variant: "destructive",
            })
            return
        }

        setShowDrawingModal(true)

        setTimeout(async () => {
            setShowDrawingModal(false)

            const randomParticipantIndex = Math.floor(Math.random() * availableParticipants.length)
            const selectedParticipant = availableParticipants[randomParticipantIndex]

            const responseWinner = await request(URL_WINNER, 'POST', {
                'id_prize': prize.id_prize,
                'id_participant': selectedParticipant.id_participant,
                'drawdate': new Date().toISOString(),
            })

            if (responseWinner.status_code === 200) {
                const newWinner: Winner = {
                    ...responseWinner.data,
                    participant_name: selectedParticipant.name,
                    ticket_number: selectedParticipant.ticket_number,
                    prize_name: prize.name
                }
                setCurrentWinner(newWinner)
                setShowWinnerModal(true)

                const updatedWinners = [...winners, newWinner]
                setWinners(updatedWinners)

                const requestUpdatePrizes = await request(URL_PRIZE, "PUT", { 'id_prize': prize.id_prize, 'sorteado': true })
                const requestUpdateParticipants = await request(URL_PARTICIPANT, "PUT", { 'id_participant': selectedParticipant.id_participant, 'active': false })

                if (requestUpdatePrizes.status_code === 200 && requestUpdateParticipants.status_code === 200) {
                    const updatedPrizes = prizes.map(p =>
                        p.id_prize === prize.id_prize ? { ...p, sorteado: true } : p
                    )
                    setPrizes(updatedPrizes)

                    const updatedParticipants = participants.map(p =>
                        p.id_participant === selectedParticipant.id_participant ? { ...p, active: false } : p
                    )
                    setParticipants(updatedParticipants)

                    toast({
                        title: "¡Sorteo realizado!",
                        description: `${selectedParticipant.name} ha ganado ${prize.name}`,
                        variant: "success",
                    })
                } else {
                    toast({
                        title: "Error",
                        description: "Hubo un problema al actualizar el premio o el participante.",
                        variant: "destructive",
                    })
                }
            } else {
                toast({
                    title: "Error",
                    description: "Hubo un problema al registrar el ganador.",
                    variant: "destructive",
                })
            }
        }, 5000)
    }

    const handleNextPrize = () => {
        setShowWinnerModal(false)
        const nextPrize = prizes.find(p => !p.sorteado)
        if (nextPrize) {
            handleSelectPrize(nextPrize)
        } else {
            toast({
                variant: "default",
                title: "Sorteo finalizado",
                description: "Todos los premios han sido sorteados.",
            })
        }
    }

    const handleClearWinners = async () => {
        const responseResetWinners = await request(URL_WINNER_FULL, "DELETE")

        if (responseResetWinners.status_code === 200) {
            const restoredPrizes = prizes.map(prize => ({ ...prize, sorteado: false }))
            setPrizes(restoredPrizes)

            const restoredParticipants = participants.map(participant => ({ ...participant, active: true }))
            setParticipants(restoredParticipants)

            setWinners([])

            toast({
                variant: "success",
                title: "Historial de ganadores vaciado",
                description: "Se han restaurado los premios y participantes a su estado original.",
            })
        } else {
            toast({
                variant: "destructive",
                title: "Error",
                description: "No se pudo vaciar el historial de ganadores. Por favor, inténtelo de nuevo.",
            })
        }
    }

    const handleDeleteWinner = async (winnerId: number) => {
        const winnerToDelete = winners.find(w => w.id_winner === winnerId)
        if (!winnerToDelete) return

        const responseDeleteWinner = await request(URL_WINNER_FILTER, "DELETE", {
            "id_winner": winnerId,
            "id_participant": winnerToDelete.id_participant,
            "id_prize": winnerToDelete.id_prize
        })

        if (responseDeleteWinner.status_code === 200) {
            const updatedWinners = winners.filter(w => w.id_winner !== winnerId)
            setWinners(updatedWinners)

            const updatedPrizes = prizes.map(prize =>
                prize.id_prize === winnerToDelete.id_prize ? { ...prize, sorteado: false } : prize
            )
            setPrizes(updatedPrizes)

            const updatedParticipants = participants.map(participant =>
                participant.id_participant === winnerToDelete.id_participant ? { ...participant, active: true } : participant
            )
            setParticipants(updatedParticipants)

            toast({
                variant: "success",
                title: "Ganador eliminado",
                description: "Se ha eliminado el ganador y restaurado el premio y participante asociados.",
            })
        } else {
            toast({
                variant: "destructive",
                title: "Error",
                description: "No se pudo eliminar el ganador. Por favor, inténtelo de nuevo.",
            })
        }
    }

    const toggleLeftPanel = () => {
        setIsLeftPanelVisible(!isLeftPanelVisible)
    }

    const handleTotalReset = async (keyword: string) => {
        if (keyword === 'REINICIAR_TODO') {
            const responseDeleteWinners = await request(URL_WINNER, "DELETE", { all: true })
            const responseDeletePrizes = await request(URL_PRIZE, "DELETE", { all: true })
            const responseDeleteParticipants = await request(URL_PARTICIPANT, "DELETE", { all: true })

            if (responseDeleteWinners.status_code === 200 && responseDeletePrizes.status_code === 200 && responseDeleteParticipants.status_code === 200) {
                setWinners([])
                setPrizes([])
                setParticipants([])

                setShowResetWarningModal(false)

                toast({
                    variant: "success",
                    title: "Reinicio completo",
                    description: "Todos los datos han sido eliminados exitosamente.",
                })
            } else {
                toast({
                    variant: "destructive",
                    title: "Error",
                    description: "No se pudo realizar el reinicio completo. Por favor, inténtelo de nuevo.",
                })
            }
        } else {
            toast({
                variant: "destructive",
                title: "Palabra clave incorrecta",
                description: 'La palabra clave correcta es "REINICIAR_TODO".',
            })
        }
    }

    const handleAddParticipant = async (newParticipant: { name: string; cedula: string; ticket_number?: string }) => {
        const participant = {
            ...newParticipant,
            active: true
        }

        try {
            const responseParticipant = await request(URL_PARTICIPANT, "POST", participant);

            if (responseParticipant.status_code === 200) {
                const updatedParticipants = [...participants, responseParticipant.data]
                setParticipants(updatedParticipants)
                toast({
                    variant: "success",
                    title: "Participante añadido",
                    description: "El participante ha sido agregado exitosamente.",
                })
                return { success: true, message: "Participante agregado con éxito" }
            } else {
                const errorMessage = responseParticipant.error ? "Error al agregar el participante" : "No se pudo agregar el participante. Por favor, inténtelo de nuevo."
                toast({
                    variant: "destructive",
                    title: "Error",
                    description: errorMessage,
                })
                return { success: false, message: errorMessage }
            }
        } catch (error) {
            console.error("Error al agregar participante:", error)
            toast({
                variant: "destructive",
                title: "Error",
                description: "Ocurrió un error inesperado. Por favor, inténtelo de nuevo.",
            })
            return { success: false, message: "Error inesperado al agregar el participante" }
        }
    }

    const openStatisticsModal = (title: string, items: (Prize | Participant)[], type: 'prizes' | 'participants') => {
        setStatisticsModalTitle(title)
        setStatisticsModalItems(items)
        setStatisticsModalType(type)
        setShowStatisticsModal(true)
    }

    return (
        <div className="min-h-screen relative overflow-hidden">
            {/* Fondo dinámico */}
            <div className="absolute inset-0 bg-gradient-to-br from-teal-600 to-blue-800 animate-gradient-x">
                <div className="absolute inset-0">
                    {[...Array(100)].map((_, i) => (
                        <div
                            key={i}
                            className="absolute h-1 w-1 bg-white rounded-full animate-twinkle"
                            style={{
                                top: `${Math.random() * 100}%`,
                                left: `${Math.random() * 100}%`,
                                animationDelay: `${Math.random() * 5}s`,
                            }}
                        />
                    ))}
                </div>
            </div>

            <div className="relative z-10">
                <header className="bg-white/10 backdrop-blur-lg border-b border-white/20">
                    <div className="container mx-auto px-4 py-4 flex justify-between items-center">
                        <div className="flex items-center space-x-4">
                            <img src="/forza-logo.png" alt="Forza Logo" className="h-6 sm:h-8" />
                            <img src="/gestar-logo.png" alt="Gestar Logo" className="h-6 sm:h-8" />
                        </div>
                        <div className="flex items-center space-x-2 sm:space-x-4">
                            {isMobile && (
                                <Button
                                    variant="ghost"
                                    onClick={toggleLeftPanel}
                                    className="text-white hover:bg-white/10 rounded-full"
                                    title={isLeftPanelVisible ? "Ocultar panel" : "Mostrar panel"}
                                >
                                    {isLeftPanelVisible ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
                                </Button>
                            )}
                            <Button
                                variant="ghost"
                                onClick={() => navigate('/')}
                                className="text-white hover:bg-white/10 rounded-full"
                            >
                                <Home className="h-5 w-5" />
                                <span className="hidden sm:inline ml-2">Inicio</span>
                            </Button>
                            <Button
                                variant="ghost"
                                onClick={() => navigate('/')}
                                className="text-white hover:bg-white/10 rounded-full"
                            >
                                <LogOut className="h-5 w-5" />
                                <span className="hidden sm:inline ml-2">Salir</span>
                            </Button>
                            <Button
                                variant="ghost"
                                onClick={() => setShowResetWarningModal(true)}
                                className="text-white hover:bg-white/10 rounded-full"
                                title="Reiniciar todo"
                            >
                                <RefreshCw className="h-5 w-5" />
                            </Button>
                        </div>
                    </div>
                </header>

                <main className="container mx-auto px-4 sm:px-6 py-8 sm:py-12">
                    <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
                        {/* Left Sidebar */}
                        <AnimatePresence>
                            {(isLeftPanelVisible || !isMobile) && (
                                <motion.div
                                    initial={{ opacity: 0, x: -300 }}
                                    animate={{ opacity: 1, x: 0 }}
                                    exit={{ opacity: 0, x: -300 }}
                                    transition={{ duration: 0.3 }}
                                    className="lg:col-span-3 space-y-8"
                                >
                                    {/* Prize Management */}
                                    <motion.div
                                        initial={{ opacity: 0, y: 20 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        className="rounded-xl bg-white/10 backdrop-blur-lg border border-white/20 p-6"
                                    >
                                        <h2 className="text-xl font-semibold text-white mb-4 flex items-center">
                                            <Gift className="mr-2 h-5 w-5" />
                                            Gestión de Premios
                                        </h2>
                                        <div className="space-y-4">
                                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                                <Button onClick={() => setShowAddPrizeModal(true)} className="w-full bg-white/10 hover:bg-white/20 text-white rounded-full transition-all duration-300 hover:scale-105">
                                                    <Plus className="mr-2 h-5 w-5" />
                                                    Agregar
                                                </Button>
                                                <Button onClick={() => setShowUploadCSVModal(true)} className="w-full bg-white/10 hover:bg-white/20 text-white rounded-full transition-all duration-300 hover:scale-105 flex items-center justify-center h-10">
                                                    <Upload className="h-4 w-4 mr-1.5 shrink-0" />
                                                    Cg CSV
                                                </Button>
                                                <Button onClick={() => {
                                                    setShowPrizeListModal(true)
                                                    toast({
                                                        variant: "default",
                                                        title: "Lista de premios",
                                                        description: "Mostrando todos los premios disponibles.",
                                                    })
                                                }} className="w-full bg-white/10 hover:bg-white/20 text-white rounded-full transition-all duration-300 hover:scale-105">
                                                    <List className="mr-2 h-5 w-5" />
                                                    Ver Lista
                                                </Button>
                                            </div>
                                            <div className="border border-white/20 rounded-2xl p-4 mt-4">
                                                <h3 className="text-lg font-semibold text-white mb-2">Estadísticas de Premios</h3>
                                                <div className="grid grid-cols-2 gap-4">
                                                    <div className="text-center cursor-pointer" onClick={() => openStatisticsModal('Premios Disponibles', prizes.filter(p => !p.sorteado), 'prizes')}>
                                                        <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-white/10 backdrop-blur-sm mb-2">
                                                            <p className="text-2xl font-bold text-white">{prizes.filter(p => !p.sorteado).length}</p>
                                                        </div>
                                                        <p className="text-xs text-white/80">Premios disponibles</p>
                                                    </div>
                                                    <div className="text-center cursor-pointer" onClick={() => openStatisticsModal('Total de Premios', prizes, 'prizes')}>
                                                        <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-white/10 backdrop-blur-sm mb-2">
                                                            <p className="text-2xl font-bold text-white">{prizes.length}</p>
                                                        </div>
                                                        <p className="text-xs text-white/80">Total de premios</p>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </motion.div>

                                    {/* Participant Management */}
                                    <motion.div
                                        initial={{ opacity: 0, y: 20 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        transition={{ delay: 0.1 }}
                                        className="rounded-xl bg-white/10 backdrop-blur-lg border border-white/20 p-6"
                                    >
                                        <h2 className="text-xl font-semibold text-white mb-4 flex items-center">
                                            <Users className="mr-2 h-5 w-5" />
                                            Gestión de Participantes
                                        </h2>
                                        <div className="space-y-4">
                                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                                <Button onClick={() => setShowAddParticipantModal(true)} className="w-full bg-white/10 hover:bg-white/20 text-white rounded-full transition-all duration-300 hover:scale-105">
                                                    <Plus className="mr-2 h-5 w-5" />
                                                    Agregar
                                                </Button>
                                                <Button onClick={() => setShowUploadParticipantsCSVModal(true)} className="w-full bg-white/10 hover:bg-white/20 text-white rounded-full transition-all duration-300 hover:scale-105">
                                                    <Upload className="mr-2 h-5 w-5" />
                                                    Cargar CSV
                                                </Button>
                                                <Button onClick={() => {
                                                    setShowParticipantListModal(true)
                                                    toast({
                                                        variant: "default",
                                                        title: "Lista de participantes",
                                                        description: "Mostrando todos los participantes registrados.",
                                                    })
                                                }} className="w-full bg-white/10 hover:bg-white/20 text-white rounded-full transition-all duration-300 hover:scale-105">
                                                    <List className="mr-2 h-5 w-5" />
                                                    Ver Lista
                                                </Button>
                                            </div>
                                            <div className="border border-white/20 rounded-2xl p-4 mt-4">
                                                <h3 className="text-lg font-semibold text-white mb-2">Estadísticas de Participantes</h3>
                                                <div className="grid grid-cols-2 gap-4">
                                                    <div className="text-center cursor-pointer" onClick={() => openStatisticsModal('Total de Participantes', participants, 'participants')}>
                                                        <div className="inline-flex items-center justify-center w-14 h-14 rounded-full bg-white/10 backdrop-blur-sm mb-2">
                                                            <p className="text-xl font-bold text-white">{participants.length}</p>
                                                        </div>
                                                        <p className="text-xs text-white/80">Total</p>
                                                    </div>
                                                    <div className="text-center cursor-pointer" onClick={() => openStatisticsModal('Participantes Asistentes', participants.filter(p => p.ticket_number && p.active), 'participants')}>
                                                        <div className="inline-flex items-center justify-center w-14 h-14 rounded-full bg-white/10 backdrop-blur-sm mb-2">
                                                            <p className="text-xl font-bold text-white">{participants.filter(p => p.ticket_number && p.active).length}</p>
                                                        </div>
                                                        <p className="text-xs text-white/80">Asistentes</p>
                                                    </div>
                                                    <div className="text-center cursor-pointer" onClick={() => openStatisticsModal('Participantes Ganadores', participants.filter(p => p.ticket_number && !p.active), 'participants')}>
                                                        <div className="inline-flex items-center justify-center w-14 h-14 rounded-full bg-white/10 backdrop-blur-sm mb-2">
                                                            <p className="text-xl font-bold text-white">{participants.filter(p => p.ticket_number && !p.active).length}</p>
                                                        </div>
                                                        <p className="text-xs text-white/80">Ganadores</p>
                                                    </div>
                                                    <div className="text-center cursor-pointer" onClick={() => openStatisticsModal('Participantes No Asistentes', participants.filter(p => !p.ticket_number && !p.active), 'participants')}>
                                                        <div className="inline-flex items-center justify-center w-14 h-14 rounded-full bg-white/10 backdrop-blur-sm mb-2">
                                                            <p className="text-xl font-bold text-white">{participants.filter(p => !p.ticket_number && !p.active).length}</p>
                                                        </div>
                                                        <p className="text-xs text-white/80">No Asistentes</p>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </motion.div>
                                </motion.div>
                            )}
                        </AnimatePresence>

                        {/* Main Content */}
                        <motion.div
                            initial={{ opacity: 0, scale: 0.95 }}
                            animate={{ opacity: 1, scale: 1 }}
                            transition={{ delay: 0.2 }}
                            className="lg:col-span-6 rounded-xl bg-white/10 backdrop-blur-lg border border-white/20 p-4 sm:p-8 flex flex-col items-center justify-center min-h-[400px] sm:min-h-[600px] overflow-y-auto"
                        >
                            <DrawSection
                                prizes={prizes.filter(p => !p.sorteado)}
                                participants={participants}
                                onSelectPrize={handleSelectPrize}
                            />
                        </motion.div>

                        {/* Right Sidebar */}
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.3 }}
                            className="lg:col-span-3 rounded-xl bg-white/10 backdrop-blur-lg border border-white/20 p-4 sm:p-6 overflow-y-auto max-h-[400px] sm:max-h-[600px]"
                        >
                            <h2 className="text-xl font-semibold text-white mb-4 flex items-center justify-between">
                                <div className="flex items-center">
                                    <Trophy className="mr-2 h-5 w-5" />
                                    Historial de Ganadores
                                </div>
                                <Button
                                    variant="destructive"
                                    size="sm"
                                    className="bg-red-600 hover:bg-red-700 text-white rounded-full transition-all duration-300 hover:scale-105"
                                    onClick={handleClearWinners}
                                >
                                    <Trash2 className="h-4 w-4 mr-2" />
                                    Vaciar
                                </Button>
                            </h2>
                            {winners.length === 0 ? (
                                <p className="text-white/80 text-center">
                                    No hay ganadores registrados
                                </p>
                            ) : (
                                <div className="space-y-4">
                                    {winners.map((winner) => (
                                        <Card key={winner.id_winner} className="bg-white/5 border-white/10 rounded-2xl overflow-hidden">
                                            <CardContent className="p-4 flex justify-between items-start">
                                                <div>
                                                    <p className="font-semibold text-white text-lg">{winner.participant_name}</p>
                                                    <p className="text-white/80 text-sm mt-1">Premio: {winner.prize_name}</p>
                                                    <p className="text-white/60 text-xs mt-1">Fecha: {winner.drawDate}</p>
                                                </div>
                                                <Button
                                                    variant="ghost"
                                                    size="sm"
                                                    onClick={() => handleDeleteWinner(winner.id_winner ? winner.id_winner : 0)}
                                                    className="text-red-400 hover:text-red-300 hover:bg-red-400/10"
                                                >
                                                    <Trash2 className="h-4 w-4" />
                                                </Button>
                                            </CardContent>
                                        </Card>
                                    ))}
                                </div>
                            )}
                        </motion.div>
                    </div>
                </main>
            </div>

            <AddPrizeModal
                isOpen={showAddPrizeModal}
                onOpenChange={setShowAddPrizeModal}
                onAddSuccess={handleAddPrize}
            />

            <UploadCSVModal
                isOpen={showUploadCSVModal}
                onOpenChange={setShowUploadCSVModal}
                onUploadCSV={handleUploadCSV}
            />

            <UploadParticipantsCSVModal
                isOpen={showUploadParticipantsCSVModal}
                onOpenChange={setShowUploadParticipantsCSVModal}
                onUploadSuccess={handleUploadParticipantsCSV}
            />

            <ViewListModal
                isOpen={showPrizeListModal}
                onOpenChange={setShowPrizeListModal}
                items={prizes}
                type="prizes"
                onDelete={handleDeletePrize}
            />

            <ViewListModal
                isOpen={showParticipantListModal}
                onOpenChange={setShowParticipantListModal}
                items={participants}
                type="participants"
                onDelete={handleDeleteParticipant}
            />

            <DrawingModal
                isOpen={showDrawingModal}
                onOpenChange={setShowDrawingModal}
            />

            <WinnerModal
                isOpen={showWinnerModal}
                onOpenChange={setShowWinnerModal}
                winner={currentWinner}
                onNextPrize={handleNextPrize}
            />
            <ResetWarningModal
                isOpen={showResetWarningModal}
                onOpenChange={setShowResetWarningModal}
                onConfirmReset={handleTotalReset}
            />
            <AddParticipantModal
                isOpen={showAddParticipantModal}
                onOpenChange={setShowAddParticipantModal}
                onAddParticipant={handleAddParticipant}
                existingParticipants={participants}
            />
            <StatisticsDetailModal
                isOpen={showStatisticsModal}
                onOpenChange={setShowStatisticsModal}
                title={statisticsModalTitle}
                items={statisticsModalItems}
                type={statisticsModalType}
            />
        </div>
    )
}

export default AdminDashboard


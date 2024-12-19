import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Button } from '@/components/ui/button'
import { useNavigate } from 'react-router-dom'
import { Home, LogOut, Gift, Users, Trophy, Plus, Upload, List, Trash2, ChevronLeft, ChevronRight, RefreshCw } from 'lucide-react'
import { useToast } from '@/hooks/use-toast'
import { AddPrizeModal } from '@/components/AddPrizeModal'
import { UploadCSVModal } from '@/components/UploadCSVModal'
import { ViewListModal } from '@/components/ViewListModal'
import { EditPrizeModal } from '@/components/EditPrizeModal'
import { Card, CardContent } from '@/components/ui/card'
import { DrawingModal } from '@/components/DrawingModal'
import { WinnerModal } from '@/components/WinnerModal'
import { DrawSection } from '@/components/DrawSection'
import { Prize, Participant, Winner } from '../types'
import { ResetWarningModal } from '@/components/ResetWarningModal'

import { request } from '@/services/index'
import { URL_PARTICIPANT, URL_PRIZE, URL_WINNER } from '@/hooks/constants/index'

const AdminDashboard = () => {
    const [prizes, setPrizes] = useState<Prize[]>([])
    const [participants, setParticipants] = useState<Participant[]>([])
    const [winners, setWinners] = useState<Winner[]>([])
    const [showAddPrizeModal, setShowAddPrizeModal] = useState(false)
    const [showUploadCSVModal, setShowUploadCSVModal] = useState(false)
    const [showPrizeListModal, setShowPrizeListModal] = useState(false)
    const [showParticipantListModal, setShowParticipantListModal] = useState(false)
    const [showEditPrizeModal, setShowEditPrizeModal] = useState(false)
    const [selectedPrize, setSelectedPrize] = useState<Prize | null>(null)
    const [showDrawingModal, setShowDrawingModal] = useState(false)
    const [showWinnerModal, setShowWinnerModal] = useState(false)
    const [currentWinner, setCurrentWinner] = useState<Winner | null>(null)
    const [isLeftPanelVisible, setIsLeftPanelVisible] = useState(true)
    const [showResetWarningModal, setShowResetWarningModal] = useState(false)
    const navigate = useNavigate()
    const { toast } = useToast()

    useEffect(() => {
        const loadData = async () => {
            const responseParticipants = await request(URL_PARTICIPANT, "GET");
            if (responseParticipants.status_code === 200) {
                setParticipants(responseParticipants.data);
            }

            const responsePrize = await request(URL_PRIZE, "GET");
            if (responsePrize.status_code === 200) {
                setPrizes(responsePrize.data);
            }

            const responseWinners = await request(URL_WINNER, "GET");
            if (responseWinners.status_code === 200) {
                setWinners(responseWinners.data);
            }
        };

        loadData();
    }, []);

    const handleAddPrize = async (newPrize: Omit<Prize, 'id_prize' | 'sorteado'>) => {
        const prize: Prize = {
            ...newPrize,
            sorteado: false
        }

        const responsePrize = await request(URL_PRIZE, "POST", prize);

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

    const handleUploadCSV = (file: File) => {
        const reader = new FileReader()
        reader.onload = (e) => {
            const text = e.target?.result as string
            const rows = text.split('\n').filter(row => row.trim() !== '')
            const newPrizes: Prize[] = rows.map((row, index) => {
                const [name, range_start, range_end] = row.split(';').map(field => field.trim())
                return {
                    id_prize: prizes.length + index + 1,
                    name,
                    range_start: parseInt(range_start),
                    range_end: parseInt(range_end),
                    sorteado: false
                }
            })
            const updatedPrizes = [...prizes, ...newPrizes]
            setPrizes(updatedPrizes)
            localStorage.setItem('prizes', JSON.stringify(updatedPrizes))
            toast({
                variant: "success",
                title: "CSV cargado",
                description: `Se han agregado ${newPrizes.length} premios exitosamente.`,
            })
        }
        reader.readAsText(file)
    }

    const handleDeletePrize = async (prizeId: number) => {
        const response = await request(URL_PRIZE, "DELETE", { id_prize: prizeId });
        if (response.status_code === 200) {
            const updatedPrizes = prizes.filter(prize => prize.id_prize !== prizeId);
            setPrizes(updatedPrizes);
            toast({
                variant: "success",
                title: "Premio eliminado",
                description: "El premio ha sido eliminado exitosamente.",
            });
        } else {
            toast({
                variant: "destructive",
                title: "Error",
                description: "No se pudo eliminar el premio. Por favor, inténtelo de nuevo.",
            });
        }
    };

    const handleDeleteParticipant = async (participantId: number) => {
        const response = await request(URL_PARTICIPANT, "DELETE", { id_participant: participantId });
        if (response.status_code === 200) {
            const updatedParticipants = participants.filter(participant => participant.id_participant !== participantId);
            setParticipants(updatedParticipants);
            toast({
                variant: "success",
                title: "Participante eliminado",
                description: "El participante ha sido eliminado exitosamente.",
            });
        } else {
            toast({
                variant: "destructive",
                title: "Error",
                description: "No se pudo eliminar el participante. Por favor, inténtelo de nuevo.",
            });
        }
    };

    const handleSelectPrize = async (prize: Prize) => {
        const availableParticipants = participants.filter(p =>
            p.active && parseInt(p.ticket_number) >= prize.range_start && parseInt(p.ticket_number) <= prize.range_end
        );

        if (availableParticipants.length === 0) {
            toast({
                title: "No se puede realizar el sorteo",
                description: `No hay participantes disponibles en el rango ${prize.range_start} - ${prize.range_end} para el premio "${prize.name}".`,
                variant: "destructive",
            });
            return;
        }

        setSelectedPrize(prize);
        setShowDrawingModal(true);

        setTimeout(async () => {
            setShowDrawingModal(false);

            const randomParticipantIndex = Math.floor(Math.random() * availableParticipants.length);
            const selectedParticipant = availableParticipants[randomParticipantIndex];

            const responseWinner = await request(URL_WINNER, 'POST', {
                'id_prize': prize.id_prize,
                'id_participant': selectedParticipant.id_participant,
                'drawdate': new Date().toISOString(),
            });

            if (responseWinner.status_code === 200) {
                const newWinner: Winner = {
                    ...responseWinner.data,
                    participant_name: selectedParticipant.name,
                    ticket_number: selectedParticipant.ticket_number,
                    prize_name: prize.name
                };
                setCurrentWinner(newWinner);
                setShowWinnerModal(true);

                const updatedWinners = [...winners, newWinner];
                setWinners(updatedWinners);

                const requestUpdatePrizes = await request(URL_PRIZE, "PUT", { 'id_prize': prize.id_prize, 'sorteado': true });
                const requestUpdateParticipants = await request(URL_PARTICIPANT, "PUT", { 'id_participant': selectedParticipant.id_participant, 'active': false });

                if (requestUpdatePrizes.status_code === 200 && requestUpdateParticipants.status_code === 200) {
                    const updatedPrizes = prizes.map(p =>
                        p.id_prize === prize.id_prize ? { ...p, sorteado: true } : p
                    );
                    setPrizes(updatedPrizes);

                    const updatedParticipants = participants.map(p =>
                        p.id_participant === selectedParticipant.id_participant ? { ...p, active: false } : p
                    );
                    setParticipants(updatedParticipants);

                    toast({
                        title: "¡Sorteo realizado!",
                        description: `${selectedParticipant.name} ha ganado ${prize.name}`,
                        variant: "success",
                    });
                } else {
                    toast({
                        title: "Error",
                        description: "Hubo un problema al actualizar el premio o el participante.",
                        variant: "destructive",
                    });
                }
            } else {
                toast({
                    title: "Error",
                    description: "Hubo un problema al registrar el ganador.",
                    variant: "destructive",
                });
            }
        }, 5000);
    };

    const handleSaveEditedPrize = async (editedPrize: Prize) => {
        const response = await request(URL_PRIZE, "PUT", editedPrize);
        if (response.status_code === 200) {
            const updatedPrizes = prizes.map(prize =>
                prize.id_prize === editedPrize.id_prize ? editedPrize : prize
            )
            setPrizes(updatedPrizes)
            toast({
                variant: "success",
                title: "Premio actualizado",
                description: "El premio ha sido actualizado exitosamente.",
            })
        } else {
            toast({
                variant: "destructive",
                title: "Error",
                description: "No se pudo actualizar el premio. Por favor, inténtelo de nuevo.",
            });
        }
    }

    const handleNextPrize = () => {
        setShowWinnerModal(false);
        const nextPrize = prizes.find(p => !p.sorteado);
        if (nextPrize) {
            handleSelectPrize(nextPrize);
        } else {
            toast({
                variant: "default",
                title: "Sorteo finalizado",
                description: "Todos los premios han sido sorteados.",
            });
        }
    };

    const handleClearWinners = async () => {
        const responseResetWinners = await request(URL_WINNER, "DELETE", { all: true });
        const responseResetPrizes = await request(URL_PRIZE, "PUT", { all: true, sorteado: false });
        const responseResetParticipants = await request(URL_PARTICIPANT, "PUT", { all: true, active: true });

        if (responseResetWinners.status_code === 200 && responseResetPrizes.status_code === 200 && responseResetParticipants.status_code === 200) {
            const restoredPrizes = prizes.map(prize => ({ ...prize, sorteado: false }));
            setPrizes(restoredPrizes);

            const restoredParticipants = participants.map(participant => ({ ...participant, active: true }));
            setParticipants(restoredParticipants);

            setWinners([]);

            toast({
                variant: "success",
                title: "Historial de ganadores vaciado",
                description: "Se han restaurado los premios y participantes a su estado original.",
            });
        } else {
            toast({
                variant: "destructive",
                title: "Error",
                description: "No se pudo vaciar el historial de ganadores. Por favor, inténtelo de nuevo.",
            });
        }
    };

    const handleDeleteWinner = async (winnerId: number) => {
        const winnerToDelete = winners.find(w => w.id_winner === winnerId);
        if (!winnerToDelete) return;

        const responseDeleteWinner = await request(URL_WINNER, "DELETE", { id_winner: winnerId });
        const responseUpdatePrize = await request(URL_PRIZE, "PUT", { id_prize: winnerToDelete.id_prize, sorteado: false });
        const responseUpdateParticipant = await request(URL_PARTICIPANT, "PUT", { id_participant: winnerToDelete.id_participant, active: true });

        if (responseDeleteWinner.status_code === 200 && responseUpdatePrize.status_code === 200 && responseUpdateParticipant.status_code === 200) {
            const updatedWinners = winners.filter(w => w.id_winner !== winnerId);
            setWinners(updatedWinners);

            const updatedPrizes = prizes.map(prize =>
                prize.id_prize === winnerToDelete.id_prize ? { ...prize, sorteado: false } : prize
            );
            setPrizes(updatedPrizes);

            const updatedParticipants = participants.map(participant =>
                participant.id_participant === winnerToDelete.id_participant ? { ...participant, active: true } : participant
            );
            setParticipants(updatedParticipants);

            toast({
                variant: "success",
                title: "Ganador eliminado",
                description: "Se ha eliminado el ganador y restaurado el premio y participante asociados.",
            });
        } else {
            toast({
                variant: "destructive",
                title: "Error",
                description: "No se pudo eliminar el ganador. Por favor, inténtelo de nuevo.",
            });
        }
    };

    const toggleLeftPanel = () => {
        setIsLeftPanelVisible(!isLeftPanelVisible);
    };

    const handleTotalReset = async (keyword: string) => {
        if (keyword === 'REINICIAR_TODO') {
            const responseDeleteWinners = await request(URL_WINNER, "DELETE", { all: true });
            const responseDeletePrizes = await request(URL_PRIZE, "DELETE", { all: true });
            const responseDeleteParticipants = await request(URL_PARTICIPANT, "DELETE", { all: true });

            if (responseDeleteWinners.status_code === 200 && responseDeletePrizes.status_code === 200 && responseDeleteParticipants.status_code === 200) {
                setWinners([]);
                setPrizes([]);
                setParticipants([]);

                setShowResetWarningModal(false);

                toast({
                    variant: "success",
                    title: "Reinicio completo",
                    description: "Todos los datos han sido eliminados exitosamente.",
                });
            } else {
                toast({
                    variant: "destructive",
                    title: "Error",
                    description: "No se pudo realizar el reinicio completo. Por favor, inténtelo de nuevo.",
                });
            }
        } else {
            toast({
                variant: "destructive",
                title: "Palabra clave incorrecta",
                description: 'La palabra clave correcta es "REINICIAR_TODO".',
            });
        }
    };

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
                            <img src="/forza-logo.png" alt="Forza Logo" className="h-8" />
                            <img src="/gestar-logo.png" alt="Gestar Logo" className="h-8" />
                        </div>
                        <div className="flex items-center space-x-4">
                            <Button
                                variant="ghost"
                                onClick={toggleLeftPanel}
                                className="text-white hover:bg-white/10 rounded-full"
                                title={isLeftPanelVisible ? "Ocultar panel" : "Mostrar panel"}
                            >
                                {isLeftPanelVisible ? <ChevronLeft className="h-5 w-5" /> : <ChevronRight className="h-5 w-5" />}
                            </Button>
                            <Button
                                variant="ghost"
                                onClick={() => navigate('/')}
                                className="text-white hover:bg-white/10 rounded-full"
                            >
                                <Home className="mr-2 h-5 w-5" />
                                Inicio
                            </Button>
                            <Button
                                variant="ghost"
                                onClick={() => navigate('/')}
                                className="text-white hover:bg-white/10 rounded-full"
                            >
                                <LogOut className="mr-2 h-5 w-5" />
                                Salir
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

                <main className="container mx-auto px-6 py-12">
                    <div className="grid grid-cols-12 gap-8">
                        {/* Left Sidebar */}
                        <AnimatePresence>
                            {isLeftPanelVisible && (
                                <motion.div
                                    initial={{ opacity: 0, x: -300 }}
                                    animate={{ opacity: 1, x: 0 }}
                                    exit={{ opacity: 0, x: -300 }}
                                    transition={{ duration: 0.3 }}
                                    className="col-span-3 space-y-8"
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
                                            <div className="grid grid-cols-2 gap-4">
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
                                                    <div className="text-center">
                                                        <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-white/10 backdrop-blur-sm mb-2">
                                                            <p className="text-2xl font-bold text-white">{prizes.filter(p => !p.sorteado).length}</p>
                                                        </div>
                                                        <p className="text-xs text-white/80">Premios disponibles</p>
                                                    </div>
                                                    <div className="text-center">
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
                                            <div className="grid grid-cols-2 gap-4">
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
                                                    <div className="text-center">
                                                        <div className="inline-flex items-center justify-center w-14 h-14 rounded-full bg-white/10 backdrop-blur-sm mb-2">
                                                            <p className="text-xl font-bold text-white">{participants.length}</p>
                                                        </div>
                                                        <p className="text-xs text-white/80">Total</p>
                                                    </div>
                                                    <div className="text-center">
                                                        <div className="inline-flex items-center justify-center w-14 h-14 rounded-full bg-white/10 backdrop-blur-sm mb-2">
                                                            <p className="text-xl font-bold text-white">{participants.filter(p => p.active).length}</p>
                                                        </div>
                                                        <p className="text-xs text-white/80">Activos</p>
                                                    </div>
                                                </div>
                                                <div className="text-center mt-4">
                                                    <div className="inline-flex items-center justify-center w-14 h-14 rounded-full bg-white/10 backdrop-blur-sm mb-2">
                                                        <p className="text-xl font-bold text-white">{participants.filter(p => !p.active).length}</p>
                                                    </div>
                                                    <p className="text-xs text-white/80">Inactivos</p>
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
                            className={`${isLeftPanelVisible ? 'col-span-6' : 'col-span-9'} rounded-xl bg-white/10 backdrop-blur-lg border border-white/20 p-8 flex flex-col items-center justify-center min-h-[600px] overflow-y-auto`}
                        >
                            <DrawSection
                                prizes={prizes.filter(p => !p.sorteado)}
                                onSelectPrize={handleSelectPrize}
                            />
                        </motion.div>

                        {/* Right Sidebar */}
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.3 }}
                            className="col-span-3 rounded-xl bg-white/10 backdrop-blur-lg border border-white/20 p-6 overflow-y-auto max-h-[600px]"
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
                                                    onClick={() => handleDeleteWinner(winner.id_winner)}
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
                onAddPrize={handleAddPrize}
            />

            <UploadCSVModal
                isOpen={showUploadCSVModal}
                onOpenChange={setShowUploadCSVModal}
                onUploadCSV={handleUploadCSV}
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
        </div>
    )
}

export default AdminDashboard


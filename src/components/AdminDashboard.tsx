import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import PrizeManagement from './PrizeManagement'
import ParticipantManagement from './ParticipantManagement'
import WinnerManagement from './WinnerManagement'
import DrawSystem from './DrawSystem'

const AdminDashboard = () => {
    return (
        <div className="min-h-screen bg-gradient-to-br from-indigo-600 to-purple-500 p-8">
            <h1 className="text-5xl font-bold text-white mb-8 text-center">Panel de Administración del Sorteo</h1>
            <Tabs defaultValue="prizes" className="w-full">
                <TabsList className="grid w-full grid-cols-4 mb-8">
                    <TabsTrigger value="prizes" className="text-lg font-semibold">Gestión de Premios</TabsTrigger>
                    <TabsTrigger value="participants" className="text-lg font-semibold">Gestión de Participantes</TabsTrigger>
                    <TabsTrigger value="winners" className="text-lg font-semibold">Gestión de Ganadores</TabsTrigger>
                    <TabsTrigger value="draw" className="text-lg font-semibold">Realizar Sorteo</TabsTrigger>
                </TabsList>
                <TabsContent value="prizes">
                    <PrizeManagement />
                </TabsContent>
                <TabsContent value="participants">
                    <ParticipantManagement />
                </TabsContent>
                <TabsContent value="winners">
                    <WinnerManagement />
                </TabsContent>
                <TabsContent value="draw">
                    <DrawSystem />
                </TabsContent>
            </Tabs>
        </div>
    )
}

export default AdminDashboard


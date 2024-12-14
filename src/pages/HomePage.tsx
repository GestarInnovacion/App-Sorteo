import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { useNavigate } from 'react-router-dom'
import { useToast } from '@/hooks/use-toast'
import { User2, Lock, Home } from 'lucide-react'

const HomePage = () => {
    const [showLogin, setShowLogin] = useState(false)
    const [username, setUsername] = useState('')
    const [password, setPassword] = useState('')
    const navigate = useNavigate()
    const { toast } = useToast()

    const handleLogin = (e: React.FormEvent) => {
        e.preventDefault()
        if (username === 'admin' && password === 'sorteofiesta2024') {
            navigate('/admin')
            toast({
                title: "¡Bienvenido, Administrador!",
                description: "Has iniciado sesión exitosamente.",
            })
        } else {
            toast({
                title: "Error de autenticación",
                description: "Usuario o contraseña incorrectos.",
                variant: "destructive",
            })
        }
    }

    return (
        <div className="min-h-screen bg-[#1a237e] bg-[radial-gradient(ellipse_80%_80%_at_50%_-20%,rgba(120,119,198,0.3),rgba(255,255,255,0))]">
            <div className="absolute inset-0 overflow-hidden">
                {[...Array(100)].map((_, i) => (
                    <div
                        key={i}
                        className="absolute h-[1px] w-[1px] bg-white rounded-full"
                        style={{
                            top: `${Math.random() * 100}%`,
                            left: `${Math.random() * 100}%`,
                            opacity: Math.random(),
                            animation: `twinkle ${Math.random() * 5 + 3}s linear infinite`
                        }}
                    />
                ))}
            </div>

            <div className="relative z-10 flex min-h-screen items-center justify-center p-4">
                <motion.div
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ duration: 0.5 }}
                    className="w-full max-w-md"
                >
                    <div className="mb-8 flex justify-center space-x-4">
                        <img src="/forza-logo.png" alt="Forza Logo" className="h-12" />
                        <img src="/gestar-logo.png" alt="Gestar Logo" className="h-12" />
                    </div>

                    <div className="rounded-2xl bg-white/10 backdrop-blur-lg border border-white/20 p-8 shadow-2xl">
                        <h1 className="text-4xl font-bold text-center text-white mb-2">
                            Sorteo Nuevo Hundred
                        </h1>
                        <p className="text-center text-white/80 mb-8">
                            Seleccione su rol para continuar
                        </p>

                        <AnimatePresence mode="wait">
                            {!showLogin ? (
                                <motion.div
                                    key="buttons"
                                    initial={{ opacity: 0, y: 20 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    exit={{ opacity: 0, y: -20 }}
                                    className="space-y-4"
                                >
                                    <Button
                                        onClick={() => navigate('/participant')}
                                        className="w-full bg-blue-500 hover:bg-blue-600 text-white py-6 text-lg rounded-xl transition-all duration-200 transform hover:scale-105"
                                    >
                                        <User2 className="mr-2 h-5 w-5" />
                                        Participante
                                    </Button>
                                    <Button
                                        onClick={() => setShowLogin(true)}
                                        variant="outline"
                                        className="w-full border-white/20 text-white hover:bg-white/10 py-6 text-lg rounded-xl transition-all duration-200 transform hover:scale-105"
                                    >
                                        <Lock className="mr-2 h-5 w-5" />
                                        Administrador
                                    </Button>
                                </motion.div>
                            ) : (
                                <motion.form
                                    key="login"
                                    initial={{ opacity: 0, y: 20 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    exit={{ opacity: 0, y: -20 }}
                                    onSubmit={handleLogin}
                                    className="space-y-4"
                                >
                                    <div className="space-y-2">
                                        <Input
                                            type="text"
                                            placeholder="Usuario"
                                            value={username}
                                            onChange={(e) => setUsername(e.target.value)}
                                            className="bg-white/10 border-white/20 text-white placeholder:text-white/50 rounded-xl py-6"
                                        />
                                    </div>
                                    <div className="space-y-2">
                                        <Input
                                            type="password"
                                            placeholder="Contraseña"
                                            value={password}
                                            onChange={(e) => setPassword(e.target.value)}
                                            className="bg-white/10 border-white/20 text-white placeholder:text-white/50 rounded-xl py-6"
                                        />
                                    </div>
                                    <Button
                                        type="submit"
                                        className="w-full bg-blue-500 hover:bg-blue-600 text-white py-6 text-lg rounded-xl transition-all duration-200 transform hover:scale-105"
                                    >
                                        Iniciar sesión
                                    </Button>
                                    <Button
                                        type="button"
                                        variant="ghost"
                                        onClick={() => setShowLogin(false)}
                                        className="w-full text-white hover:bg-white/10 py-6 text-lg rounded-xl transition-all duration-200"
                                    >
                                        <Home className="mr-2 h-5 w-5" />
                                        Volver al inicio
                                    </Button>
                                </motion.form>
                            )}
                        </AnimatePresence>
                    </div>
                </motion.div>
            </div>
        </div>
    )
}

export default HomePage


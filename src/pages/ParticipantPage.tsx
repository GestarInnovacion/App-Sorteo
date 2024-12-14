import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { useToast } from '@/hooks/use-toast'
import { Home, ArrowRight, Search } from 'lucide-react'
import { useNavigate } from 'react-router-dom'
import { SuccessModal } from '@/components/SuccessModal'
import { ErrorModal } from '@/components/ErrorModal'
import { LookupModal } from '@/components/LookupModal'

interface FormData {
    cedula: string
    number: string
    name: string
}

const ParticipantPage = () => {
    const [step, setStep] = useState(1)
    const [formData, setFormData] = useState<FormData>({
        cedula: '',
        number: '',
        name: '',
    })
    const [showSuccessModal, setShowSuccessModal] = useState(false)
    const [showErrorModal, setShowErrorModal] = useState(false)
    const [showLookupModal, setShowLookupModal] = useState(false)
    const [existingParticipant, setExistingParticipant] = useState<FormData | null>(null)
    const [errorField, setErrorField] = useState<'cedula' | 'number' | 'name'>('cedula')
    const { toast } = useToast()
    const navigate = useNavigate()

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setFormData({ ...formData, [e.target.name]: e.target.value })
    }

    const checkExistingParticipant = (field: 'cedula' | 'number' | 'name', value: string) => {
        const participants = JSON.parse(localStorage.getItem('participants') || '[]')
        return participants.find((p: any) => p[field] === value)
    }

    const handleNext = () => {
        if (step === 1 && !formData.cedula) {
            toast({
                title: "Campo requerido",
                description: "Por favor ingrese su número de cédula",
                variant: "destructive",
            })
            return
        }

        if (step === 1) {
            const existing = checkExistingParticipant('cedula', formData.cedula)
            if (existing) {
                setExistingParticipant(existing)
                setErrorField('cedula')
                setShowErrorModal(true)
                return
            }
        }

        if (step === 2 && !formData.number) {
            toast({
                title: "Campo requerido",
                description: "Por favor ingrese su número de sorteo",
                variant: "destructive",
            })
            return
        }
        if (step === 2) {
            const existing = checkExistingParticipant('number', formData.number)
            if (existing) {
                setExistingParticipant(existing)
                setErrorField('number')
                setShowErrorModal(true)
                return
            }
        }
        if (step === 3 && !formData.name) {
            toast({
                title: "Campo requerido",
                description: "Por favor ingrese su nombre completo",
                variant: "destructive",
            })
            return
        }
        if (step === 3) {
            const existing = checkExistingParticipant('name', formData.name)
            if (existing) {
                setExistingParticipant(existing)
                setErrorField('name')
                setShowErrorModal(true)
                return
            }

            const participants = JSON.parse(localStorage.getItem('participants') || '[]')
            const newParticipant = {
                id: participants.length + 1,
                ...formData,
                active: true
            }
            participants.push(newParticipant)
            localStorage.setItem('participants', JSON.stringify(participants))
            setShowSuccessModal(true)
        } else {
            setStep(step + 1)
        }
    }

    const renderStep = () => {
        switch (step) {
            case 1:
                return (
                    <motion.div
                        key="step1"
                        initial={{ opacity: 0, x: 50 }}
                        animate={{ opacity: 1, x: 0 }}
                        exit={{ opacity: 0, x: -50 }}
                        className="space-y-4"
                    >
                        <h2 className="text-3xl font-bold text-white text-center mb-8">
                            Ingresa tu Cédula
                        </h2>
                        <Input
                            name="cedula"
                            value={formData.cedula}
                            onChange={handleChange}
                            placeholder="Ingrese su número de cédula"
                            className="bg-white/10 border-white/20 text-white placeholder:text-white/50 rounded-xl py-6 text-lg"
                        />
                    </motion.div>
                )
            case 2:
                return (
                    <motion.div
                        key="step2"
                        initial={{ opacity: 0, x: 50 }}
                        animate={{ opacity: 1, x: 0 }}
                        exit={{ opacity: 0, x: -50 }}
                        className="space-y-4"
                    >
                        <h2 className="text-3xl font-bold text-white text-center mb-8">
                            Ingresa tu Número de Sorteo
                        </h2>
                        <Input
                            name="number"
                            value={formData.number}
                            onChange={handleChange}
                            placeholder="Ingrese su número de sorteo"
                            className="bg-white/10 border-white/20 text-white placeholder:text-white/50 rounded-xl py-6 text-lg"
                        />
                    </motion.div>
                )
            case 3:
                return (
                    <motion.div
                        key="step3"
                        initial={{ opacity: 0, x: 50 }}
                        animate={{ opacity: 1, x: 0 }}
                        exit={{ opacity: 0, x: -50 }}
                        className="space-y-4"
                    >
                        <h2 className="text-3xl font-bold text-white text-center mb-8">
                            Ingresa tu Nombre Completo
                        </h2>
                        <Input
                            name="name"
                            value={formData.name}
                            onChange={handleChange}
                            placeholder="Ingrese su nombre completo"
                            className="bg-white/10 border-white/20 text-white placeholder:text-white/50 rounded-xl py-6 text-lg"
                        />
                    </motion.div>
                )
        }
    }

    return (
        <div className="min-h-screen bg-gradient-to-br from-teal-600 to-blue-800">
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

            <div className="relative z-10 flex min-h-screen flex-col items-center justify-center p-4">
                <div className="mb-8 flex justify-center space-x-4">
                    <img src="/forza-logo.png" alt="Forza Logo" className="h-12" />
                    <img src="/gestar-logo.png" alt="Gestar Logo" className="h-12" />
                </div>

                <motion.div
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className="w-full max-w-md"
                >
                    <div className="rounded-2xl bg-white/10 backdrop-blur-lg border border-white/20 p-8 shadow-2xl">
                        <h1 className="text-4xl font-bold text-center text-white mb-2">
                            Únete al Sorteo
                        </h1>
                        <div className="flex justify-center space-x-2 mb-8">
                            {[1, 2, 3].map((i) => (
                                <div
                                    key={i}
                                    className={`h-2 w-2 rounded-full transition-colors duration-200 ${i === step ? 'bg-white' : 'bg-white/30'
                                        }`}
                                />
                            ))}
                        </div>

                        <AnimatePresence mode="wait">
                            {renderStep()}
                        </AnimatePresence>

                        <div className="mt-8 flex justify-between items-center">
                            <Button
                                variant="ghost"
                                onClick={() => navigate('/')}
                                className="text-white hover:bg-white/10"
                            >
                                <Home className="mr-2 h-5 w-5" />
                                Inicio
                            </Button>
                            <Button
                                variant="ghost"
                                onClick={() => setShowLookupModal(true)}
                                className="text-white hover:bg-white/10"
                            >
                                <Search className="mr-2 h-5 w-5" />
                                Buscar Número
                            </Button>
                            <Button
                                onClick={handleNext}
                                className="bg-gradient-to-r from-green-400 to-blue-500 hover:from-green-500 hover:to-blue-600 text-white"
                            >
                                {step === 3 ? 'Finalizar' : 'Siguiente'}
                                <ArrowRight className="ml-2 h-5 w-5" />
                            </Button>
                        </div>
                    </div>
                </motion.div>
            </div>

            <SuccessModal
                open={showSuccessModal}
                onOpenChange={(open) => {
                    setShowSuccessModal(open)
                    if (!open) {
                        navigate('/')
                    }
                }}
                participantName={formData.name}
                participantNumber={formData.number}
            />

            <ErrorModal
                open={showErrorModal}
                onOpenChange={setShowErrorModal}
                existingParticipant={existingParticipant}
                field={errorField}
            />

            <LookupModal
                isOpen={showLookupModal}
                onOpenChange={setShowLookupModal}
            />
        </div>
    )
}

export default ParticipantPage


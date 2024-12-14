import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { cn } from "@/lib/utils"
import { AlertCircle, CheckCircle2, XCircle, Info, X, Star } from 'lucide-react'

interface CoolToastProps {
    message: string
    type?: 'success' | 'error' | 'warning' | 'info'
    duration?: number
    onClose?: () => void
}

const icons = {
    success: CheckCircle2,
    error: XCircle,
    warning: AlertCircle,
    info: Info,
}

export function CoolToast({ message, type = 'info', duration = 5000, onClose }: CoolToastProps) {
    const [isVisible, setIsVisible] = useState(true)

    useEffect(() => {
        const timer = setTimeout(() => {
            setIsVisible(false)
        }, duration)

        return () => clearTimeout(timer)
    }, [duration])

    const handleClose = () => {
        setIsVisible(false)
        if (onClose) onClose()
    }

    const Icon = icons[type]

    return (
        <AnimatePresence>
            {isVisible && (
                <motion.div
                    initial={{ opacity: 0, y: 50, scale: 0.3 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.5, transition: { duration: 0.2 } }}
                    className="fixed bottom-4 right-4 z-[9999]"
                >
                    <div className={cn(
                        "px-6 py-4 rounded-full shadow-lg backdrop-blur-md", // Updated padding
                        "bg-gradient-to-r",
                        {
                            'from-green-400 to-blue-500': type === 'success',
                            'from-red-400 to-pink-500': type === 'error',
                            'from-yellow-400 to-orange-500': type === 'warning',
                            'from-blue-400 to-indigo-500': type === 'info',
                        }
                    )}>
                        <div className="flex items-center space-x-4">
                            <motion.div
                                initial={{ rotate: 0 }}
                                animate={{ rotate: 360 }}
                                transition={{ duration: 0.5 }}
                            >
                                {Icon && <Icon className="w-6 h-6 text-white" />}
                            </motion.div>
                            <span className="text-white font-medium">{message}</span>
                            <motion.button
                                whileHover={{ scale: 1.1 }}
                                whileTap={{ scale: 0.9 }}
                                onClick={handleClose}
                                className="text-white hover:text-gray-200 transition-colors ml-2"
                            >
                                <X className="w-5 h-5" />
                            </motion.button>
                        </div>
                        <div className="absolute inset-x-0 bottom-0 h-1 overflow-hidden rounded-full"> {/* Replaced loading bar */}
                            <motion.div
                                className="h-full bg-white bg-opacity-30"
                                initial={{ width: '100%' }}
                                animate={{ width: '0%' }}
                                transition={{ duration: duration / 1000, ease: 'linear' }}
                                style={{
                                    borderBottomLeftRadius: '9999px',
                                    borderBottomRightRadius: '9999px',
                                }}
                            />
                        </div>
                        <div className="absolute -top-1 -right-1">
                            <motion.div
                                initial={{ rotate: 0 }}
                                animate={{ rotate: 360 }}
                                transition={{ duration: 2, repeat: Infinity, ease: 'linear' }}
                            >
                                <Star className="w-6 h-6 text-yellow-300" />
                            </motion.div>
                        </div>
                    </div>
                </motion.div>
            )}
        </AnimatePresence>
    )
}


import React from 'react'
import { Toast, ToastProps } from "@/components/ui/toast"
import { cn } from "@/lib/utils"
import { AlertCircle, CheckCircle2, XCircle, Info, X } from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'

interface CustomToastProps extends Omit<ToastProps, "title" | "description" | "variant"> {
    variant?: "default" | "destructive" | "success" | "warning"
    title?: React.ReactNode
    description?: React.ReactNode
}

export function CustomToast({
    className,
    variant = "default",
    title,
    description,
    ...props
}: CustomToastProps) {
    const IconComponent = {
        default: Info,
        success: CheckCircle2,
        warning: AlertCircle,
        destructive: XCircle,
    }[variant]

    const colors = {
        default: "from-blue-500 to-blue-600",
        success: "from-green-500 to-green-600",
        warning: "from-yellow-500 to-yellow-600",
        destructive: "from-red-600 to-red-700",
    }

    return (
        <AnimatePresence>
            <Toast
                className={cn(
                    "overflow-hidden rounded-lg shadow-lg",
                    className
                )}
                {...props}
            >
                <motion.div
                    initial={{ opacity: 0, y: 50, scale: 0.3 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.5, transition: { duration: 0.2 } }}
                    className={cn(
                        "flex items-center p-4 bg-gradient-to-r text-white",
                        colors[variant]
                    )}
                >
                    <motion.div
                        initial={{ scale: 0 }}
                        animate={{ scale: 1 }}
                        transition={{ type: "spring", stiffness: 500, damping: 20 }}
                        className="flex-shrink-0 w-10 h-10 flex items-center justify-center bg-white rounded-full"
                    >
                        <IconComponent className={cn("h-6 w-6", {
                            "text-blue-500": variant === "default",
                            "text-green-500": variant === "success",
                            "text-red-500": variant === "destructive",
                            "text-yellow-500": variant === "warning",
                        })} />
                    </motion.div>
                    <div className="ml-4 flex-grow">
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.1 }}
                            className="font-semibold text-lg"
                        >
                            {title}
                        </motion.div>
                        {description && (
                            <motion.div
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: 0.2 }}
                                className="text-sm opacity-90 mt-1"
                            >
                                {description}
                            </motion.div>
                        )}
                    </div>
                    {props.onOpenChange && (
                        <motion.button
                            whileHover={{ scale: 1.1 }}
                            whileTap={{ scale: 0.9 }}
                            onClick={() => props.onOpenChange?.(false)}
                            className="ml-4 p-1 rounded-full hover:bg-white/20 transition-colors"
                        >
                            <X className="h-5 w-5" />
                        </motion.button>
                    )}
                </motion.div>
            </Toast>
        </AnimatePresence>
    )
}


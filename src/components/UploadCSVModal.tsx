import { useState, useCallback } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { Label } from '@/components/ui/label'
import { Upload, FileUp, File, X, Check, AlertCircle } from 'lucide-react'
import { useDropzone } from 'react-dropzone'

interface UploadCSVModalProps {
    isOpen: boolean
    onOpenChange: (open: boolean) => void
    onUploadCSV: (file: File) => void
}

export function UploadCSVModal({ isOpen, onOpenChange, onUploadCSV }: UploadCSVModalProps) {
    const [file, setFile] = useState<File | null>(null)
    const [error, setError] = useState<string | null>(null)

    const onDrop = useCallback((acceptedFiles: File[]) => {
        const selectedFile = acceptedFiles[0]
        if (selectedFile?.type !== 'text/csv' && !selectedFile?.name.endsWith('.csv')) {
            setError('Por favor, seleccione un archivo CSV válido')
            return
        }
        setFile(selectedFile)
        setError(null)
    }, [])

    const { getRootProps, getInputProps, isDragActive } = useDropzone({
        onDrop,
        accept: {
            'text/csv': ['.csv']
        },
        maxFiles: 1
    })

    const handleUpload = () => {
        if (file) {
            onUploadCSV(file)
            setFile(null)
            setError(null)
            onOpenChange(false)
        }
    }

    return (
        <AnimatePresence>
            {isOpen && (
                <Dialog open={isOpen} onOpenChange={onOpenChange}>
                    <DialogContent className="bg-gradient-to-br from-teal-700 to-blue-900 text-white sm:max-w-[425px] rounded-3xl border-2 border-white/20 shadow-xl">
                        <DialogHeader>
                            <DialogTitle className="text-3xl font-bold text-center flex items-center justify-center">
                                <Upload className="mr-2 h-8 w-8" />
                                Cargar Premios CSV
                            </DialogTitle>
                        </DialogHeader>
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: -20 }}
                            transition={{ duration: 0.3 }}
                            className="grid gap-6 py-4"
                        >
                            <div className="space-y-4">
                                <div
                                    {...getRootProps()}
                                    className={`
                    border-2 border-dashed rounded-2xl p-8 text-center cursor-pointer
                    transition-colors duration-200 space-y-4
                    ${isDragActive
                                            ? 'border-green-400 bg-green-400/10'
                                            : 'border-white/20 hover:border-white/40 hover:bg-white/5'
                                        }
                  `}
                                >
                                    <input {...getInputProps()} />
                                    <div className="flex flex-col items-center gap-2">
                                        <File className="h-12 w-12 text-green-400" />
                                        {isDragActive ? (
                                            <p className="text-lg font-medium">Suelta el archivo aquí</p>
                                        ) : (
                                            <>
                                                <p className="text-lg font-medium">
                                                    Arrastra y suelta tu archivo CSV aquí
                                                </p>
                                                <p className="text-sm text-white/60">
                                                    o haz clic para seleccionar
                                                </p>
                                            </>
                                        )}
                                    </div>
                                </div>

                                {error && (
                                    <motion.div
                                        initial={{ opacity: 0, y: -10 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        className="flex items-center gap-2 text-red-400 bg-red-400/10 p-3 rounded-lg"
                                    >
                                        <AlertCircle className="h-5 w-5" />
                                        <p className="text-sm">{error}</p>
                                    </motion.div>
                                )}

                                {file && !error && (
                                    <motion.div
                                        initial={{ opacity: 0, y: -10 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        className="flex items-center justify-between bg-white/10 p-3 rounded-lg"
                                    >
                                        <div className="flex items-center gap-2">
                                            <Check className="h-5 w-5 text-green-400" />
                                            <span className="text-sm truncate max-w-[200px]">
                                                {file.name}
                                            </span>
                                        </div>
                                        <Button
                                            variant="ghost"
                                            size="sm"
                                            onClick={(e) => {
                                                e.stopPropagation()
                                                setFile(null)
                                            }}
                                            className="text-white hover:text-red-400 hover:bg-red-400/10"
                                        >
                                            <X className="h-4 w-4" />
                                        </Button>
                                    </motion.div>
                                )}
                            </div>

                            <div className="bg-white/10 p-4 rounded-lg space-y-2">
                                <h3 className="font-semibold flex items-center gap-2">
                                    <AlertCircle className="h-5 w-5 text-yellow-400" />
                                    Formato Requerido
                                </h3>
                                <p className="text-sm text-white/80">
                                    El archivo CSV debe contener los campos separados por punto y coma (;):
                                </p>
                                <code className="block bg-black/20 p-2 rounded text-xs text-white/90">
                                    PREMIO 1;0;50
                                    PREMIO 2;0;100
                                </code>
                            </div>

                            <motion.div
                                initial={{ opacity: 0, scale: 0.8 }}
                                animate={{ opacity: 1, scale: 1 }}
                                exit={{ opacity: 0, scale: 0.8 }}
                                transition={{ duration: 0.3 }}
                            >
                                <Button
                                    onClick={handleUpload}
                                    disabled={!file || !!error}
                                    className="w-full bg-gradient-to-r from-green-400 to-blue-500 hover:from-green-500 hover:to-blue-600 text-white transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed rounded-xl"
                                >
                                    <FileUp className="mr-2 h-5 w-5" />
                                    Cargar Premios
                                </Button>
                            </motion.div>
                        </motion.div>
                    </DialogContent>
                </Dialog>
            )}
        </AnimatePresence>
    )
}


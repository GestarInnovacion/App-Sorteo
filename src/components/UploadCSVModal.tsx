import { AlertCircle } from 'lucide-react';
import { useToast } from "@/hooks/use-toast";
import { Prize } from "@/types/index";
import { useCallback, useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";

interface Props {
    isOpen: boolean;
    onOpenChange: (open: boolean) => void;
    onUploadCSV: (newPrizes: { name: string; range_start: string; range_end: string; }[]) => void;
}

const validateCSVContent = (content: string): { isValid: boolean; error: string | null } => {
    const rows = content.split('\n').filter(row => row.trim() !== '')

    for (let i = 0; i < rows.length; i++) {
        const [name, range_start, range_end] = rows[i].split(';').map(field => field.trim())

        // Verificar que todos los campos estén presentes
        if (!name || !range_start || !range_end) {
            return { isValid: false, error: `Fila ${i + 1}: Faltan campos. Asegúrese de incluir nombre, rango inicial y rango final.` }
        }

        // Verificar que los rangos sean cadenas de 3 dígitos
        if (!/^\d{3}$/.test(range_start) || !/^\d{3}$/.test(range_end)) {
            return { isValid: false, error: `Fila ${i + 1}: Los rangos deben ser números de 3 dígitos (ej: 001, 022, 100).` }
        }

        const start = parseInt(range_start)
        const end = parseInt(range_end)

        // Verificar que el rango esté entre 001 y 500
        if (start < 1 || end > 500) {
            return { isValid: false, error: `Fila ${i + 1}: Los rangos deben estar entre 001 y 500.` }
        }

        // Verificar que el número mínimo no sea mayor que el máximo
        if (start > end) {
            return { isValid: false, error: `Fila ${i + 1}: El rango inicial no puede ser mayor que el rango final.` }
        }
    }

    return { isValid: true, error: null }
}

const UploadCSVModal = ({ isOpen, onOpenChange, onUploadCSV }: Props) => {
    const { toast } = useToast();
    const [file, setFile] = useState<File | null>(null);
    const [error, setError] = useState<string | null>(null);
    const onDrop = useCallback((acceptedFiles: File[]) => {
        const selectedFile = acceptedFiles[0]
        if (selectedFile?.type !== 'text/csv' && !selectedFile?.name.endsWith('.csv')) {
            setError('Por favor, seleccione un archivo CSV válido')
            return
        }

        const reader = new FileReader()
        reader.onload = (e) => {
            const text = e.target?.result as string
            const { isValid, error } = validateCSVContent(text)

            if (isValid) {
                setFile(selectedFile)
                setError(null)
            } else {
                setError(error || 'El archivo contiene datos inválidos.')
            }
        }
        reader.readAsText(selectedFile)
    }, [setFile, setError])

    const handleUpload = () => {
        if (file) {
            const reader = new FileReader()
            reader.onload = async (e) => {
                const text = e.target?.result as string
                const { isValid, error } = validateCSVContent(text)

                if (isValid) {
                    const rows = text.split('\n').filter(row => row.trim() !== '')
                    const newPrizes = rows.map((row) => {
                        const [name, range_start, range_end] = row.split(';').map(field => field.trim())
                        return {
                            name,
                            range_start,
                            range_end,
                        }
                    })

                    try {
                        await onUploadCSV(newPrizes)
                        setFile(null)
                        setError(null)
                        onOpenChange(false)
                        toast({
                            title: "Éxito",
                            description: `Se han cargado ${newPrizes.length} premios correctamente.`,
                        })
                    } catch (error) {
                        console.error('Error al cargar los premios:', error)
                        setError('Hubo un problema al cargar los premios. Por favor, inténtelo de nuevo.')
                        toast({
                            title: "Error",
                            description: "No se pudieron cargar los premios. Por favor, inténtelo de nuevo.",
                            variant: "destructive",
                        })
                    }
                } else {
                    setError(error || 'El archivo contiene datos inválidos.')
                }
            }
            reader.readAsText(file)
        } else {
            setError('Por favor, seleccione un archivo antes de cargar.')
        }
    }

    return (
        <Dialog open={isOpen} onOpenChange={onOpenChange}>
            <DialogContent className="sm:max-w-[425px] bg-gradient-to-br from-indigo-500 to-purple-600 text-white rounded-3xl border-2 border-white/20 shadow-xl">
                <DialogHeader>
                    <DialogTitle className="text-3xl font-bold text-center bg-clip-text text-transparent bg-gradient-to-r from-pink-500 to-yellow-500">
                        Cargar Premios CSV
                    </DialogTitle>
                </DialogHeader>
                <div className="space-y-4">
                    <div className="bg-white/10 p-4 rounded-lg space-y-2">
                        <h3 className="font-semibold flex items-center gap-2">
                            <AlertCircle className="h-5 w-5 text-yellow-400" />
                            Formato Requerido
                        </h3>
                        <p className="text-sm text-white/80">
                            El archivo CSV debe contener los campos separados por punto y coma (;):
                        </p>
                        <code className="block bg-black/20 p-2 rounded text-xs text-white/90">
                            PREMIO 1;001;050
                            PREMIO 2;030;100
                        </code>
                        <p className="text-sm text-white/80">
                            Los rangos deben ser números de 3 dígitos entre 001 y 500. Los rangos pueden superponerse.
                        </p>
                    </div>
                    <input
                        type="file"
                        accept=".csv"
                        onChange={(e) => onDrop(e.target.files ? [e.target.files[0]] : [])}
                        className="block w-full text-sm text-white/70
              file:mr-4 file:py-2 file:px-4
              file:rounded-full file:border-0
              file:text-sm file:font-semibold
              file:bg-violet-50 file:text-violet-700
              hover:file:bg-violet-100"
                    />
                    <button
                        onClick={handleUpload}
                        className="w-full bg-gradient-to-r from-violet-500 to-fuchsia-500 text-white font-bold py-2 px-4 rounded-lg hover:from-violet-600 hover:to-fuchsia-600 transition-all duration-200"
                        disabled={!file}
                    >
                        Cargar CSV
                    </button>
                    {error && (
                        <p className="text-red-500 text-sm mt-2">{error}</p>
                    )}
                </div>
            </DialogContent>
        </Dialog>
    )
}

export default UploadCSVModal;


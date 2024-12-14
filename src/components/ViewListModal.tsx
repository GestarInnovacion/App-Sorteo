import { motion, AnimatePresence } from 'framer-motion'
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { Card, CardContent } from '@/components/ui/card'
import { ScrollArea } from '@/components/ui/scroll-area'
import { Gift, Users, Trash2, Edit } from 'lucide-react'
import { Button } from '@/components/ui/button'

interface ViewListModalProps {
    isOpen: boolean
    onOpenChange: (open: boolean) => void
    items: any[]
    type: 'prizes' | 'participants'
    onDelete: (id: number) => void
    onEdit?: (item: any) => void
}

export function ViewListModal({ isOpen, onOpenChange, items, type, onDelete, onEdit }: ViewListModalProps) {
    return (
        <AnimatePresence>
            {isOpen && (
                <Dialog open={isOpen} onOpenChange={onOpenChange}>
                    <DialogContent className="bg-gradient-to-br from-teal-700 to-blue-900 text-white sm:max-w-[90vw] rounded-3xl border-2 border-white/20 shadow-xl">
                        <DialogHeader>
                            <DialogTitle className="text-3xl font-bold text-center flex items-center justify-center text-white">
                                {type === 'prizes' ? (
                                    <>
                                        <Gift className="mr-2 h-8 w-8" />
                                        Lista de Premios
                                    </>
                                ) : (
                                    <>
                                        <Users className="mr-2 h-8 w-8" />
                                        Lista de Participantes
                                    </>
                                )}
                            </DialogTitle>
                        </DialogHeader>
                        <ScrollArea className="h-[70vh] rounded-md">
                            <motion.div
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                exit={{ opacity: 0, y: -20 }}
                                transition={{ duration: 0.3 }}
                                className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 p-4"
                            >
                                {items.map((item, index) => (
                                    <motion.div
                                        key={index}
                                        initial={{ opacity: 0, scale: 0.8 }}
                                        animate={{ opacity: 1, scale: 1 }}
                                        transition={{ duration: 0.3, delay: index * 0.05 }}
                                    >
                                        <Card className="bg-white/10 border-white/20 overflow-hidden rounded-2xl">
                                            <CardContent className="p-4">
                                                {type === 'prizes' ? (
                                                    <div className="flex flex-col h-full">
                                                        <div>
                                                            <h3 className="text-lg font-semibold text-white">{item.name}</h3>
                                                            <p className="text-sm text-white/80">Rango: {item.range_start} - {item.range_end}</p>
                                                        </div>
                                                        <div className="flex justify-between items-center mt-4">
                                                            <span className={`px-2 py-1 rounded-full text-xs ${item.sorteado ? 'bg-yellow-500 text-yellow-900' : 'bg-green-500 text-green-900'}`}>
                                                                {item.sorteado ? 'Sorteado' : 'Disponible'}
                                                            </span>
                                                            <div className="flex space-x-2">
                                                                <Button
                                                                    size="sm"
                                                                    variant="ghost"
                                                                    onClick={() => onEdit && onEdit(item)}
                                                                    className="text-white hover:bg-white/20 rounded-full"
                                                                >
                                                                    <Edit className="h-4 w-4" />
                                                                </Button>
                                                                <Button
                                                                    size="sm"
                                                                    variant="ghost"
                                                                    onClick={() => onDelete(item.id)}
                                                                    className="text-white hover:bg-white/20 rounded-full"
                                                                >
                                                                    <Trash2 className="h-4 w-4" />
                                                                </Button>
                                                            </div>
                                                        </div>
                                                    </div>
                                                ) : (
                                                    <div className="flex flex-col h-full">
                                                        <div>
                                                            <h3 className="text-lg font-semibold text-white">{item.name}</h3>
                                                            <p className="text-sm text-white/80">Cédula: {item.cedula}</p>
                                                            <p className="text-sm text-white/80">Número: {item.number}</p>
                                                        </div>
                                                        <div className="flex justify-between items-center mt-4">
                                                            <span className={`px-2 py-1 rounded-full text-xs ${item.active ? 'bg-green-500 text-green-900' : 'bg-red-500 text-red-900'}`}>
                                                                {item.active ? 'Activo' : 'Inactivo'}
                                                            </span>
                                                            <Button
                                                                size="sm"
                                                                variant="ghost"
                                                                onClick={() => onDelete(item.id)}
                                                                className="text-white hover:bg-white/20 rounded-full"
                                                            >
                                                                <Trash2 className="h-4 w-4" />
                                                            </Button>
                                                        </div>
                                                    </div>
                                                )}
                                            </CardContent>
                                        </Card>
                                    </motion.div>
                                ))}
                            </motion.div>
                        </ScrollArea>
                    </DialogContent>
                </Dialog>
            )}
        </AnimatePresence>
    )
}


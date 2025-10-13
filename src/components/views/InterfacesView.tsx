import { useState } from 'react'
import { useInterfaces } from '@/hooks/useDatabase'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Plus, ShareNetwork, FunnelSimple, PencilSimple, Trash } from '@phosphor-icons/react'
import { toast } from 'sonner'
import { InterfaceFormSimple } from '@/components/forms/InterfaceFormSimple'

interface Interface {
    id: string
    sourceApp: string
    targetApp: string
    interfaceType: string
    frequency: string
    description?: string
}

export function InterfacesView() {
    const { interfaces, loading, error, deleteInterface, refetch } = useInterfaces() 
    const [filter, setFilter] = useState<string>('')
    const [showForm, setShowForm] = useState(false)
    const [editingInterface, setEditingInterface] = useState<Interface | undefined>()

    const handleAddInterface = () => {
        setEditingInterface(undefined)
        setShowForm(true)
    }

    const handleEditInterface = (interfaceItem: Interface) => {
        setEditingInterface(interfaceItem)
        setShowForm(true)
    }

    const handleDeleteInterface = async (id: string) => {
        if (confirm('Tem certeza que deseja excluir esta interface?')) {
            try {
                await deleteInterface(id)
                toast.success('Interface removida com sucesso')
            } catch (error) {
                toast.error('Erro ao deletar interface')
                console.error('Erro ao deletar interface:', error)
            }
        }
    }

    const handleFormSuccess = () => {
        refetch()
        setShowForm(false)
        setEditingInterface(undefined)
    }

    const handleCancelForm = () => {
        setShowForm(false)
        setEditingInterface(undefined)
    }

    const filteredInterfaces = (interfaces || []).filter(iface =>
        iface.sourceApp.toLowerCase().includes(filter.toLowerCase()) ||
        iface.targetApp.toLowerCase().includes(filter.toLowerCase()) ||
        (iface.description?.toLowerCase().includes(filter.toLowerCase()))
    )

    const getTypeColor = (interfaceType: string) => {
        switch (interfaceType) {
            case 'API_REST': return 'bg-blue-500/10 text-blue-700 border-blue-500/20'
            case 'API_SOAP': return 'bg-purple-500/10 text-purple-700 border-purple-500/20'
            case 'ARQUIVO_BATCH': return 'bg-green-500/10 text-green-700 border-green-500/20'
            case 'MENSAGERIA': return 'bg-orange-500/10 text-orange-700 border-orange-500/20'
            case 'BANCO_DADOS': return 'bg-red-500/10 text-red-700 border-red-500/20'
            case 'WEBHOOK': return 'bg-indigo-500/10 text-indigo-700 border-indigo-500/20'
            default: return 'bg-gray-500/10 text-gray-700 border-gray-500/20'
        }
    }

    const getFrequencyColor = (frequency: string) => {
        switch (frequency) {
            case 'TEMPO_REAL': return 'bg-red-500/10 text-red-700 border-red-500/20'
            case 'HORARIO': return 'bg-yellow-500/10 text-yellow-700 border-yellow-500/20'
            case 'DIARIO': return 'bg-blue-500/10 text-blue-700 border-blue-500/20' 
            case 'SEMANAL': return 'bg-green-500/10 text-green-700 border-green-500/20'
            case 'MENSAL': return 'bg-purple-500/10 text-purple-700 border-purple-500/20'
            case 'SOB_DEMANDA': return 'bg-orange-500/10 text-orange-700 border-orange-500/20'
            default: return 'bg-gray-500/10 text-gray-700 border-gray-500/20'
        }
    }

    if (loading) {
        return (
            <div className="flex items-center justify-center h-64">
                <div className="text-lg">Carregando interfaces...</div>
            </div>
        )
    }

    if (error) {
        return (
            <div className="flex items-center justify-center h-64">
                <div className="text-lg text-red-600">Erro ao carregar interfaces: {error}</div>
            </div>
        )
    }

    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-3xl font-bold text-foreground mb-2">Interfaces de Sistema</h1>
                    <p className="text-muted-foreground">Gerencie integrações e fluxos de dados entre aplicações</p>
                </div>
                <Button onClick={handleAddInterface} className="gap-2">
                    <Plus size={16} />
                    Adicionar Interface
                </Button>
            </div>

            <div className="flex items-center gap-4">
                <div className="relative flex-1 max-w-sm">
                    <FunnelSimple size={16} className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground" />
                    <input
                        type="text"
                        placeholder="Filtrar interfaces..."
                        className="w-full pl-9 pr-4 py-2 border border-border rounded-lg bg-background focus:outline-none focus:ring-2 focus:ring-ring"
                        value={filter}
                        onChange={(e) => setFilter(e.target.value)}
                    />
                </div>
                <div className="text-sm text-muted-foreground">
                    {filteredInterfaces.length} de {(interfaces || []).length} interfaces
                </div>
            </div>

            {filteredInterfaces.length === 0 && (interfaces || []).length === 0 ? (
                <div className="text-center py-16">
                    <ShareNetwork size={64} className="mx-auto mb-4 text-muted-foreground opacity-50" />
                    <h3 className="text-lg font-medium text-foreground mb-2">Nenhuma interface ainda</h3>
                    <p className="text-muted-foreground mb-6">Comece mapeando integrações de sistema e fluxos de dados.</p>
                    <Button onClick={handleAddInterface} className="gap-2">
                        <Plus size={16} />
                        Adicionar Sua Primeira Interface
                    </Button>
                </div>
            ) : filteredInterfaces.length === 0 ? (
                <div className="text-center py-16">
                    <FunnelSimple size={64} className="mx-auto mb-4 text-muted-foreground opacity-50" />
                    <h3 className="text-lg font-medium text-foreground mb-2">Nenhuma interface encontrada</h3>
                    <p className="text-muted-foreground">Tente ajustar seus critérios de busca.</p>
                </div>
            ) : (
                <div className="space-y-4">
                    {filteredInterfaces.map((iface) => (
                        <Card key={iface.id} className="hover:shadow-md transition-shadow">
                            <CardContent className="p-6">
                                <div className="flex items-center justify-between">
                                    <div className="flex items-center gap-4">
                                        <div className="flex items-center gap-2">
                                            <div className="font-medium">{iface.sourceApp}</div>
                                            <div className="text-muted-foreground">→</div>
                                            <div className="font-medium">{iface.targetApp}</div>
                                        </div>
                                    </div>
                                    
                                    <div className="flex items-center gap-2">
                                        <Badge className={getTypeColor(iface.interfaceType)}>
                                            {iface.interfaceType.replace('_', ' ')}
                                        </Badge>
                                        <Badge className={getFrequencyColor(iface.frequency)}>
                                            {iface.frequency.replace('_', ' ')}
                                        </Badge>
                                        <div className="flex gap-1">
                                            <Button
                                                variant="ghost"
                                                size="sm"
                                                onClick={() => handleEditInterface(iface)}
                                            >
                                                <PencilSimple size={14} />
                                            </Button>
                                            <Button
                                                variant="ghost"
                                                size="sm"
                                                onClick={() => handleDeleteInterface(iface.id)}
                                                className="text-destructive hover:text-destructive"
                                            >
                                                <Trash size={14} />
                                            </Button>
                                        </div>
                                    </div>
                                </div>
                                
                                {iface.description && (
                                    <p className="text-sm text-muted-foreground mt-2">
                                        {iface.description}
                                    </p>
                                )}
                            </CardContent>
                        </Card>
                    ))}
                </div>
            )}

            {(interfaces || []).length > 0 && (
                <Card>
                    <CardHeader>
                        <CardTitle>Estatísticas de Interface</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                            <div className="text-center">
                                <div className="text-2xl font-bold text-foreground">{(interfaces || []).length}</div>
                                <div className="text-sm text-muted-foreground">Total de Interfaces</div>
                            </div>
                            <div className="text-center">
                                <div className="text-2xl font-bold text-foreground">
                                    {(interfaces || []).filter(i => i.interfaceType === 'API_REST').length}
                                </div>
                                <div className="text-sm text-muted-foreground">APIs REST</div>
                            </div>
                            <div className="text-center">
                                <div className="text-2xl font-bold text-foreground">
                                    {(interfaces || []).filter(i => i.frequency === 'TEMPO_REAL').length}
                                </div>
                                <div className="text-sm text-muted-foreground">Tempo Real</div>
                            </div>
                            <div className="text-center">
                                <div className="text-2xl font-bold text-foreground">
                                    {new Set([...(interfaces || []).map(i => i.sourceApp), ...(interfaces || []).map(i => i.targetApp)]).size}
                                </div>
                                <div className="text-sm text-muted-foreground">Apps Conectadas</div>
                            </div>
                        </div>
                    </CardContent>
                </Card>
            )}

            <InterfaceFormSimple
                interface={editingInterface}
                isOpen={showForm}
                onClose={handleCancelForm}
                onSuccess={handleFormSuccess}
            />
        </div>
    )
}
import { useState } from 'react'
import { useCapabilities } from '@/hooks/useDatabase'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Progress } from '@/components/ui/progress'
import { Plus, Buildings, FunnelSimple, Pencil, Trash } from '@phosphor-icons/react'
import { CapabilityForm } from '@/components/forms/CapabilityForm'
import { toast } from 'sonner'

interface Capability {
    id: string
    name: string
    description?: string
    criticality: string
    coverageScore: number
    parentId?: string
}

export function CapabilitiesView() {
    const { capabilities, loading, error, refetch, deleteCapability } = useCapabilities()
    const [isFormOpen, setIsFormOpen] = useState(false)
    const [editingCapability, setEditingCapability] = useState<Capability | undefined>()
    const [filter, setFilter] = useState<string>('')

    const handleAddCapability = () => {
        setEditingCapability(undefined)
        setIsFormOpen(true)
    }

    const handleEditCapability = (capability: Capability) => {
        setEditingCapability(capability)
        setIsFormOpen(true)
    }

    const handleDeleteCapability = async (capability: Capability) => {
        if (confirm(`Tem certeza que deseja excluir a capacidade "${capability.name}"?`)) {
            try {
                await deleteCapability(capability.id)
                toast.success('Capacidade excluída com sucesso')
            } catch (error) {
                toast.error('Erro ao excluir capacidade')
                console.error('Erro ao excluir capacidade:', error)
            }
        }
    }

    const handleFormSuccess = () => {
        refetch()
    }

    const filteredCapabilities = (capabilities || []).filter(cap =>
        cap.name.toLowerCase().includes(filter.toLowerCase()) ||
        (cap.description?.toLowerCase().includes(filter.toLowerCase()))
    )

    const getCriticalityColor = (criticality: string) => {
        switch (criticality) {
            case 'CRÍTICA': return 'bg-red-500/10 text-red-700 border-red-500/20'
            case 'ALTA': return 'bg-orange-500/10 text-orange-700 border-orange-500/20'
            case 'MÉDIA': return 'bg-yellow-500/10 text-yellow-700 border-yellow-500/20'
            default: return 'bg-green-500/10 text-green-700 border-green-500/20'
        }
    }

    if (loading) {
        return (
            <div className="flex items-center justify-center h-64">
                <div className="text-lg">Carregando capacidades...</div>
            </div>
        )
    }

    if (error) {
        return (
            <div className="flex items-center justify-center h-64">
                <div className="text-lg text-red-600">Erro ao carregar capacidades: {error}</div>
            </div>
        )
    }

    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-3xl font-bold text-foreground mb-2">Capacidades de Negócio</h1>
                    <p className="text-muted-foreground">Mapeie e gerencie as capacidades de negócio da sua organização</p>
                </div>
                <Button onClick={handleAddCapability} className="gap-2">
                    <Plus size={16} />
                    Adicionar Capacidade
                </Button>
            </div>

            <div className="flex items-center gap-4">
                <div className="relative flex-1 max-w-sm">
                    <FunnelSimple size={16} className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground" />
                    <input
                        type="text"
                        placeholder="Filtrar capacidades..."
                        className="w-full pl-9 pr-4 py-2 border border-border rounded-lg bg-background focus:outline-none focus:ring-2 focus:ring-ring"
                        value={filter}
                        onChange={(e) => setFilter(e.target.value)}
                    />
                </div>
                <div className="text-sm text-muted-foreground">
                    {filteredCapabilities.length} de {(capabilities || []).length} capacidades
                </div>
            </div>

            {filteredCapabilities.length === 0 && (capabilities || []).length === 0 ? (
                <div className="text-center py-16">
                    <Buildings size={64} className="mx-auto mb-4 text-muted-foreground opacity-50" />
                    <h3 className="text-lg font-medium text-foreground mb-2">Nenhuma capacidade ainda</h3>
                    <p className="text-muted-foreground mb-6">Comece mapeando suas capacidades de negócio para entender a estrutura organizacional.</p>
                    <Button onClick={handleAddCapability} className="gap-2">
                        <Plus size={16} />
                        Adicionar Sua Primeira Capacidade
                    </Button>
                </div>
            ) : filteredCapabilities.length === 0 ? (
                <div className="text-center py-16">
                    <FunnelSimple size={64} className="mx-auto mb-4 text-muted-foreground opacity-50" />
                    <h3 className="text-lg font-medium text-foreground mb-2">Nenhuma capacidade encontrada</h3>
                    <p className="text-muted-foreground">Tente ajustar seus critérios de busca.</p>
                </div>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {filteredCapabilities.map((capability) => (
                        <Card key={capability.id} className="hover:shadow-md transition-shadow">
                            <CardHeader className="pb-3">
                                <div className="flex items-start justify-between">
                                    <CardTitle className="text-lg">{capability.name}</CardTitle>
                                    <div className="flex items-center gap-2">
                                        <Badge className={getCriticalityColor(capability.criticality)}>
                                            {capability.criticality}
                                        </Badge>
                                        <div className="flex gap-1">
                                            <Button
                                                variant="ghost"
                                                size="sm"
                                                onClick={() => handleEditCapability(capability)}
                                            >
                                                <Pencil size={14} />
                                            </Button>
                                            <Button
                                                variant="ghost"
                                                size="sm"
                                                onClick={() => handleDeleteCapability(capability)}
                                            >
                                                <Trash size={14} />
                                            </Button>
                                        </div>
                                    </div>
                                </div>
                                {capability.description && (
                                    <p className="text-sm text-muted-foreground line-clamp-2">
                                        {capability.description}
                                    </p>
                                )}
                            </CardHeader>
                            <CardContent className="space-y-4">
                                <div className="space-y-2">
                                    <div className="flex items-center justify-between">
                                        <span className="text-sm font-medium">Pontuação de Cobertura</span>
                                        <span className="text-sm text-muted-foreground">{capability.coverageScore}%</span>
                                    </div>
                                    <Progress value={capability.coverageScore} />
                                </div>
                                
                                {capability.parentId && (
                                    <div className="flex items-center justify-between text-sm text-muted-foreground">
                                        <span>Capacidade Pai</span>
                                        <span>{(capabilities || []).find(c => c.id === capability.parentId)?.name || 'N/A'}</span>
                                    </div>
                                )}
                            </CardContent>
                        </Card>
                    ))}
                </div>
            )}

            <CapabilityForm
                capability={editingCapability}
                isOpen={isFormOpen}
                onClose={() => setIsFormOpen(false)}
                onSuccess={handleFormSuccess}
            />
        </div>
    )
}
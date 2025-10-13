import { useState } from 'react'
import { useTechnologies } from '@/hooks/useDatabase'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Progress } from '@/components/ui/progress'
import { Plus, Gear, FunnelSimple, PencilSimple, Trash } from '@phosphor-icons/react'
import { TechnologyFormNew } from '../forms/TechnologyFormNew'
import { toast } from 'sonner'

interface Technology {
    id: string
    name: string
    description?: string
    category?: string
    maturityLevel?: string
    adoptionScore: number
    strategicFit?: string
}

export function TechnologiesView() {
    const { technologies, loading, error, deleteTechnology, refetch } = useTechnologies()
    const [showForm, setShowForm] = useState(false)
    const [editingTechnology, setEditingTechnology] = useState<Technology | undefined>()
    const [filter, setFilter] = useState<string>('')

    const handleAddTechnology = () => {
        setEditingTechnology(undefined)
        setShowForm(true)
    }

    const handleEditTechnology = (technology: Technology) => {
        setEditingTechnology(technology)
        setShowForm(true)
    }

    const handleDeleteTechnology = async (id: string) => {
        if (confirm('Tem certeza que deseja excluir esta tecnologia?')) {
            try {
                await deleteTechnology(id)
                toast.success('Tecnologia removida com sucesso')
            } catch (error) {
                toast.error('Erro ao deletar tecnologia')
                console.error('Erro ao deletar tecnologia:', error)
            }
        }
    }

    const handleFormSuccess = () => {
        refetch()
        setShowForm(false)
        setEditingTechnology(undefined)
    }

    const handleCancelForm = () => {
        setShowForm(false)
        setEditingTechnology(undefined)
    }

    const filteredTechnologies = (technologies || []).filter(tech =>
        tech.name.toLowerCase().includes(filter.toLowerCase()) ||
        (tech.description?.toLowerCase().includes(filter.toLowerCase())) ||
        (tech.category?.toLowerCase().includes(filter.toLowerCase()))
    )

    const getCategoryColor = (category?: string) => {
        switch (category) {
            case 'Database': return 'bg-blue-500/10 text-blue-700 border-blue-500/20'
            case 'Frontend': return 'bg-green-500/10 text-green-700 border-green-500/20'
            case 'Backend': return 'bg-purple-500/10 text-purple-700 border-purple-500/20'
            case 'Infrastructure': return 'bg-orange-500/10 text-orange-700 border-orange-500/20'
            case 'DevOps': return 'bg-yellow-500/10 text-yellow-700 border-yellow-500/20'
            case 'Security': return 'bg-red-500/10 text-red-700 border-red-500/20'
            case 'Analytics': return 'bg-indigo-500/10 text-indigo-700 border-indigo-500/20'
            case 'Integration': return 'bg-teal-500/10 text-teal-700 border-teal-500/20'
            default: return 'bg-gray-500/10 text-gray-700 border-gray-500/20'
        }
    }

    const getMaturityColor = (maturityLevel?: string) => {
        switch (maturityLevel) {
            case 'EXPERIMENTAL': return 'bg-red-100 text-red-800'
            case 'EMERGING': return 'bg-yellow-100 text-yellow-800'
            case 'MAINSTREAM': return 'bg-green-100 text-green-800'
            case 'LEGACY': return 'bg-gray-100 text-gray-800'
            default: return 'bg-gray-100 text-gray-800'
        }
    }

    const getStrategicFitLabel = (strategicFit?: string) => {
        switch (strategicFit) {
            case 'MUITO_RUIM': return 'Muito Ruim'
            case 'RUIM': return 'Ruim'
            case 'ADEQUADO': return 'Adequado'
            case 'BOM': return 'Bom'
            case 'EXCELENTE': return 'Excelente'
            default: return 'N/A'
        }
    }

    const getMaturityLabel = (maturityLevel?: string) => {
        switch (maturityLevel) {
            case 'EXPERIMENTAL': return 'Experimental'
            case 'EMERGING': return 'Emergente'
            case 'MAINSTREAM': return 'Mainstream'
            case 'LEGACY': return 'Legacy'
            default: return 'N/A'
        }
    }

    if (loading) {
        return (
            <div className="flex items-center justify-center h-64">
                <div className="text-lg">Carregando tecnologias...</div>
            </div>
        )
    }

    if (error) {
        return (
            <div className="flex items-center justify-center h-64">
                <div className="text-lg text-red-600">Erro ao carregar tecnologias: {error}</div>
            </div>
        )
    }

    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-3xl font-bold text-foreground mb-2">Tecnologias</h1>
                    <p className="text-muted-foreground">Gerencie o stack tecnológico e infraestrutura da sua organização</p>
                </div>
                <Button onClick={handleAddTechnology} className="gap-2">
                    <Plus size={16} />
                    Adicionar Tecnologia
                </Button>
            </div>

            <div className="flex items-center gap-4">
                <div className="relative flex-1 max-w-sm">
                    <FunnelSimple size={16} className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground" />
                    <input
                        type="text"
                        placeholder="Filtrar tecnologias..."
                        className="w-full pl-9 pr-4 py-2 border border-border rounded-lg bg-background focus:outline-none focus:ring-2 focus:ring-ring"
                        value={filter}
                        onChange={(e) => setFilter(e.target.value)}
                    />
                </div>
                <div className="text-sm text-muted-foreground">
                    {filteredTechnologies.length} de {(technologies || []).length} tecnologias
                </div>
            </div>

            {filteredTechnologies.length === 0 && (technologies || []).length === 0 ? (
                <div className="text-center py-16">
                    <Gear size={64} className="mx-auto mb-4 text-muted-foreground opacity-50" />
                    <h3 className="text-lg font-medium text-foreground mb-2">Nenhuma tecnologia ainda</h3>
                    <p className="text-muted-foreground mb-6">Comece catalogando seu stack tecnológico para melhor visibilidade.</p>
                    <Button onClick={handleAddTechnology} className="gap-2">
                        <Plus size={16} />
                        Adicionar Sua Primeira Tecnologia
                    </Button>
                </div>
            ) : filteredTechnologies.length === 0 ? (
                <div className="text-center py-16">
                    <FunnelSimple size={64} className="mx-auto mb-4 text-muted-foreground opacity-50" />
                    <h3 className="text-lg font-medium text-foreground mb-2">Nenhuma tecnologia encontrada</h3>
                    <p className="text-muted-foreground">Tente ajustar seus critérios de busca.</p>
                </div>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {filteredTechnologies.map((technology) => (
                        <Card key={technology.id} className="hover:shadow-md transition-shadow">
                            <CardHeader className="pb-3">
                                <div className="flex items-start justify-between">
                                    <div className="flex-1">
                                        <CardTitle className="text-lg">{technology.name}</CardTitle>
                                        {technology.category && (
                                            <Badge className={getCategoryColor(technology.category)} variant="outline">
                                                {technology.category}
                                            </Badge>
                                        )}
                                    </div>
                                    <div className="flex items-center gap-2">
                                        <div className="flex gap-1">
                                            <Button
                                                variant="ghost"
                                                size="sm"
                                                onClick={() => handleEditTechnology(technology)}
                                            >
                                                <PencilSimple size={14} />
                                            </Button>
                                            <Button
                                                variant="ghost"
                                                size="sm"
                                                onClick={() => handleDeleteTechnology(technology.id)}
                                                className="text-destructive hover:text-destructive"
                                            >
                                                <Trash size={14} />
                                            </Button>
                                        </div>
                                    </div>
                                </div>
                                {technology.description && (
                                    <p className="text-sm text-muted-foreground line-clamp-2 mt-2">
                                        {technology.description}
                                    </p>
                                )}
                            </CardHeader>
                            <CardContent className="space-y-4">
                                <div className="space-y-2">
                                    <div className="flex items-center justify-between">
                                        <span className="text-sm font-medium">Pontuação de Adoção</span>
                                        <span className="text-sm text-muted-foreground">{technology.adoptionScore}%</span>
                                    </div>
                                    <Progress value={technology.adoptionScore} />
                                </div>
                                
                                <div className="grid grid-cols-2 gap-4 text-sm">
                                    <div>
                                        <span className="font-medium text-muted-foreground">Maturidade:</span>
                                        <div className="mt-1">
                                            <Badge className={getMaturityColor(technology.maturityLevel)} variant="secondary">
                                                {getMaturityLabel(technology.maturityLevel)}
                                            </Badge>
                                        </div>
                                    </div>
                                    <div>
                                        <span className="font-medium text-muted-foreground">Adequação:</span>
                                        <p className="text-foreground">{getStrategicFitLabel(technology.strategicFit)}</p>
                                    </div>
                                </div>
                            </CardContent>
                        </Card>
                    ))}
                </div>
            )}

            <TechnologyFormNew
                technology={editingTechnology}
                isOpen={showForm}
                onClose={handleCancelForm}
                onSuccess={handleFormSuccess}
            />
        </div>
    )
}
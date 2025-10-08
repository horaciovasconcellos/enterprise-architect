import { useState } from 'react'
import { useKV } from '@github/spark/hooks'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Progress } from '@/components/ui/progress'
import { Plus, Gear, FunnelSimple, PencilSimple, Trash } from '@phosphor-icons/react'
import { TechnologyForm } from '../forms/TechnologyForm'

interface Technology {
    id: string
    name: string
    description?: string
    category: string
    healthScore: number
    version?: string
    vendor?: string
    licenseType?: string
    supportLevel?: string
    deploymentType?: string
}

export function TechnologiesView() {
    const [technologies, setTechnologies] = useKV<Technology[]>('technologies', [])
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

    const handleDeleteTechnology = (id: string) => {
        if (confirm('Tem certeza que deseja excluir esta tecnologia?')) {
            setTechnologies((current) => (current || []).filter(tech => tech.id !== id))
        }
    }

    const handleSubmitTechnology = (technologyData: Omit<Technology, 'id'>) => {
        if (editingTechnology) {
            // Update existing technology
            setTechnologies((current) => 
                (current || []).map(tech => 
                    tech.id === editingTechnology.id 
                        ? { ...technologyData, id: editingTechnology.id }
                        : tech
                )
            )
        } else {
            // Create new technology
            const newTechnology: Technology = {
                ...technologyData,
                id: Date.now().toString()
            }
            setTechnologies((current) => [...(current || []), newTechnology])
        }
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
        tech.category.toLowerCase().includes(filter.toLowerCase())
    )

    const getCategoryColor = (category: string) => {
        switch (category) {
            case 'INFRAESTRUTURA': return 'bg-blue-500/10 text-blue-700 border-blue-500/20'
            case 'BANCO DE DADOS': return 'bg-green-500/10 text-green-700 border-green-500/20'
            case 'PLATAFORMA': return 'bg-purple-500/10 text-purple-700 border-purple-500/20'
            case 'MIDDLEWARE': return 'bg-orange-500/10 text-orange-700 border-orange-500/20'
            case 'APLICAÇÃO': return 'bg-yellow-500/10 text-yellow-700 border-yellow-500/20'
            default: return 'bg-gray-500/10 text-gray-700 border-gray-500/20'
        }
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
                                        <div className="flex items-center gap-2 mt-1">
                                            {technology.version && (
                                                <span className="text-sm text-muted-foreground">v{technology.version}</span>
                                            )}
                                            {technology.vendor && (
                                                <span className="text-sm text-muted-foreground">• {technology.vendor}</span>
                                            )}
                                        </div>
                                    </div>
                                    <div className="flex items-center gap-2">
                                        <Badge className={getCategoryColor(technology.category)}>
                                            {technology.category}
                                        </Badge>
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
                                        <span className="text-sm font-medium">Pontuação de Saúde</span>
                                        <span className="text-sm text-muted-foreground">{technology.healthScore}%</span>
                                    </div>
                                    <Progress value={technology.healthScore} />
                                </div>
                                
                                <div className="grid grid-cols-2 gap-4 text-sm">
                                    {technology.licenseType && (
                                        <div>
                                            <span className="font-medium text-muted-foreground">Licença:</span>
                                            <p className="text-foreground">{technology.licenseType}</p>
                                        </div>
                                    )}
                                    {technology.supportLevel && (
                                        <div>
                                            <span className="font-medium text-muted-foreground">Suporte:</span>
                                            <p className="text-foreground">{technology.supportLevel}</p>
                                        </div>
                                    )}
                                    {technology.deploymentType && (
                                        <div>
                                            <span className="font-medium text-muted-foreground">Deploy:</span>
                                            <p className="text-foreground">{technology.deploymentType}</p>
                                        </div>
                                    )}
                                    <div>
                                        <span className="font-medium text-muted-foreground">Aplicações:</span>
                                        <p className="text-foreground">{Math.floor(Math.random() * 8) + 1} usando</p>
                                    </div>
                                </div>
                            </CardContent>
                        </Card>
                    ))}
                </div>
            )}

            {showForm && (
                <TechnologyForm
                    technology={editingTechnology}
                    onSubmit={handleSubmitTechnology}
                    onCancel={handleCancelForm}
                />
            )}
        </div>
    )
}
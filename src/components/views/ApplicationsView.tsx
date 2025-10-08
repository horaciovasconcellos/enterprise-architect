import { useState } from 'react'
import { useApplications } from '@/hooks/useDatabase'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Progress } from '@/components/ui/progress'
import { ApplicationForm } from '@/components/forms/ApplicationForm'
import { Plus, Cube, FunnelSimple } from '@phosphor-icons/react'

interface Application {
    id: string
    name: string
    description?: string
    lifecyclePhase: string
    criticality: string
    hostingType?: string
    healthScore: number
    technicalFit?: string
    functionalFit?: string
    estimatedCost?: number
    currency?: string
    relatedCapabilities?: string[]
    relatedProcesses?: string[]
    relatedTechnologies?: string[]
    relatedApplications?: string[]
}

export function ApplicationsView() {
    const { applications, loading, error, createApplication, updateApplication, deleteApplication } = useApplications()
    const [showForm, setShowForm] = useState(false)
    const [editingApp, setEditingApp] = useState<Application | null>(null)
    const [filter, setFilter] = useState<string>('')

    const handleSaveApplication = async (appData: Omit<Application, 'id'>) => {
        try {
            if (editingApp) {
                await updateApplication(editingApp.id, appData)
            } else {
                await createApplication(appData)
            }
            setShowForm(false)
            setEditingApp(null)
        } catch (error) {
            console.error('Erro ao salvar aplicação:', error)
            // Aqui você pode adicionar uma notificação de erro se quiser
        }
    }

    const handleEditApplication = (app: Application) => {
        setEditingApp(app)
        setShowForm(true)
    }

    const filteredApplications = (applications || []).filter(app =>
        app.name.toLowerCase().includes(filter.toLowerCase()) ||
        (app.description?.toLowerCase().includes(filter.toLowerCase()))
    )

    const getLifecycleBadgeColor = (phase: string) => {
        switch (phase) {
            case 'PRODUCAO': return 'bg-green-500/10 text-green-700 border-green-500/20'
            case 'MANUTENCAO': return 'bg-yellow-500/10 text-yellow-700 border-yellow-500/20'
            case 'DESATIVACAO': return 'bg-red-500/10 text-red-700 border-red-500/20'
            case 'DESENVOLVIMENTO': return 'bg-blue-500/10 text-blue-700 border-blue-500/20'
            case 'PLANEJAMENTO': return 'bg-purple-500/10 text-purple-700 border-purple-500/20'
            case 'APOSENTADO': return 'bg-gray-500/10 text-gray-700 border-gray-500/20'
            default: return 'bg-gray-500/10 text-gray-700 border-gray-500/20'
        }
    }

    const getCriticalityColor = (criticality: string) => {
        switch (criticality) {
            case 'CRITICA': return 'bg-red-500/10 text-red-700 border-red-500/20'
            case 'ALTA': return 'bg-orange-500/10 text-orange-700 border-orange-500/20'
            case 'MEDIA': return 'bg-yellow-500/10 text-yellow-700 border-yellow-500/20'
            case 'BAIXA': return 'bg-green-500/10 text-green-700 border-green-500/20'
            default: return 'bg-green-500/10 text-green-700 border-green-500/20'
        }
    }

    const getLifecycleDisplayName = (phase: string) => {
        switch (phase) {
            case 'PRODUCAO': return 'Produção'
            case 'MANUTENCAO': return 'Manutenção'
            case 'DESATIVACAO': return 'Desativação'
            case 'DESENVOLVIMENTO': return 'Desenvolvimento'
            case 'PLANEJAMENTO': return 'Planejamento'
            case 'APOSENTADO': return 'Aposentado'
            default: return phase
        }
    }

    const getCriticalityDisplayName = (criticality: string) => {
        switch (criticality) {
            case 'CRITICA': return 'Crítica'
            case 'ALTA': return 'Alta'
            case 'MEDIA': return 'Média'
            case 'BAIXA': return 'Baixa'
            default: return criticality
        }
    }

    if (showForm) {
        return (
            <ApplicationForm
                application={editingApp}
                onSave={handleSaveApplication}
                onCancel={() => {
                    setShowForm(false)
                    setEditingApp(null)
                }}
            />
        )
    }

    if (loading) {
        return (
            <div className="flex items-center justify-center h-64">
                <div className="text-lg">Carregando aplicações...</div>
            </div>
        )
    }

    if (error) {
        return (
            <div className="flex items-center justify-center h-64">
                <div className="text-lg text-red-600">Erro ao carregar aplicações: {error}</div>
            </div>
        )
    }

    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-3xl font-bold text-foreground mb-2">Portfólio de Aplicações</h1>
                    <p className="text-muted-foreground">Gerencie o inventário e ciclo de vida das aplicações empresariais</p>
                </div>
                <Button onClick={() => setShowForm(true)} className="gap-2">
                    <Plus size={16} />
                    Adicionar Aplicação
                </Button>
            </div>

            <div className="flex items-center gap-4">
                <div className="relative flex-1 max-w-sm">
                    <FunnelSimple size={16} className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground" />
                    <input
                        type="text"
                        placeholder="Filtrar aplicações..."
                        className="w-full pl-9 pr-4 py-2 border border-border rounded-lg bg-background focus:outline-none focus:ring-2 focus:ring-ring"
                        value={filter}
                        onChange={(e) => setFilter(e.target.value)}
                    />
                </div>
                <div className="text-sm text-muted-foreground">
                    {filteredApplications.length} de {(applications || []).length} aplicações
                </div>
            </div>

            {filteredApplications.length === 0 && (applications || []).length === 0 ? (
                <div className="text-center py-16">
                    <Cube size={64} className="mx-auto mb-4 text-muted-foreground opacity-50" />
                    <h3 className="text-lg font-medium text-foreground mb-2">Nenhuma aplicação ainda</h3>
                    <p className="text-muted-foreground mb-6">Comece construindo seu portfólio de aplicações adicionando sua primeira aplicação.</p>
                    <Button onClick={() => setShowForm(true)} className="gap-2">
                        <Plus size={16} />
                        Adicionar Sua Primeira Aplicação
                    </Button>
                </div>
            ) : filteredApplications.length === 0 ? (
                <div className="text-center py-16">
                    <FunnelSimple size={64} className="mx-auto mb-4 text-muted-foreground opacity-50" />
                    <h3 className="text-lg font-medium text-foreground mb-2">Nenhuma aplicação encontrada</h3>
                    <p className="text-muted-foreground">Tente ajustar seus critérios de busca.</p>
                </div>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {filteredApplications.map((app) => (
                        <Card key={app.id} className="hover:shadow-md transition-shadow cursor-pointer" onClick={() => handleEditApplication(app)}>
                            <CardHeader className="pb-3">
                                <div className="flex items-start justify-between">
                                    <CardTitle className="text-lg">{app.name}</CardTitle>
                                    <div className="flex gap-1">
                                        <Badge className={getLifecycleBadgeColor(app.lifecyclePhase)}>
                                            {getLifecycleDisplayName(app.lifecyclePhase)}
                                        </Badge>
                                    </div>
                                </div>
                                {app.description && (
                                    <p className="text-sm text-muted-foreground line-clamp-2">
                                        {app.description}
                                    </p>
                                )}
                            </CardHeader>
                            <CardContent className="space-y-4">
                                <div className="flex items-center justify-between">
                                    <span className="text-sm font-medium">Criticidade</span>
                                    <Badge className={getCriticalityColor(app.criticality)}>
                                        {getCriticalityDisplayName(app.criticality)}
                                    </Badge>
                                </div>
                                
                                <div className="space-y-2">
                                    <div className="flex items-center justify-between">
                                        <span className="text-sm font-medium">Pontuação de Saúde</span>
                                        <span className="text-sm text-muted-foreground">{app.healthScore}%</span>
                                    </div>
                                    <Progress value={app.healthScore} />
                                </div>

                                {app.hostingType && (
                                    <div className="flex items-center justify-between">
                                        <span className="text-sm text-muted-foreground">Hospedagem</span>
                                        <span className="text-sm">{app.hostingType}</span>
                                    </div>
                                )}

                                {app.estimatedCost && (
                                    <div className="flex items-center justify-between">
                                        <span className="text-sm text-muted-foreground">Custo Est.</span>
                                        <span className="text-sm font-medium">
                                            {new Intl.NumberFormat('pt-BR', {
                                                style: 'currency',
                                                currency: app.currency || 'BRL'
                                            }).format(app.estimatedCost)}
                                        </span>
                                    </div>
                                )}
                            </CardContent>
                        </Card>
                    ))}
                </div>
            )}
        </div>
    )
}
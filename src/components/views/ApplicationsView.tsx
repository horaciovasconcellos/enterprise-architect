import { useState } from 'react'
import { useKV } from '@github/spark/hooks'
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
}

export function ApplicationsView() {
    const [applications, setApplications] = useKV<Application[]>('applications', [])
    const [showForm, setShowForm] = useState(false)
    const [editingApp, setEditingApp] = useState<Application | null>(null)
    const [filter, setFilter] = useState<string>('')

    const handleSaveApplication = (appData: Omit<Application, 'id'>) => {
        if (editingApp) {
            setApplications((current) =>
                (current || []).map((app) =>
                    app.id === editingApp.id ? { ...appData, id: editingApp.id } : app
                )
            )
        } else {
            const newApp: Application = {
                ...appData,
                id: Date.now().toString()
            }
            setApplications((current) => [...(current || []), newApp])
        }
        setShowForm(false)
        setEditingApp(null)
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
            case 'PRODUCTION': return 'bg-green-500/10 text-green-700 border-green-500/20'
            case 'MAINTENANCE': return 'bg-yellow-500/10 text-yellow-700 border-yellow-500/20'
            case 'SUNSET': return 'bg-red-500/10 text-red-700 border-red-500/20'
            case 'DEVELOPMENT': return 'bg-blue-500/10 text-blue-700 border-blue-500/20'
            default: return 'bg-gray-500/10 text-gray-700 border-gray-500/20'
        }
    }

    const getCriticalityColor = (criticality: string) => {
        switch (criticality) {
            case 'CRITICAL': return 'bg-red-500/10 text-red-700 border-red-500/20'
            case 'HIGH': return 'bg-orange-500/10 text-orange-700 border-orange-500/20'
            case 'MEDIUM': return 'bg-yellow-500/10 text-yellow-700 border-yellow-500/20'
            default: return 'bg-green-500/10 text-green-700 border-green-500/20'
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

    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-3xl font-bold text-foreground mb-2">Application Portfolio</h1>
                    <p className="text-muted-foreground">Manage your enterprise application inventory and lifecycle</p>
                </div>
                <Button onClick={() => setShowForm(true)} className="gap-2">
                    <Plus size={16} />
                    Add Application
                </Button>
            </div>

            <div className="flex items-center gap-4">
                <div className="relative flex-1 max-w-sm">
                    <FunnelSimple size={16} className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground" />
                    <input
                        type="text"
                        placeholder="Filter applications..."
                        className="w-full pl-9 pr-4 py-2 border border-border rounded-lg bg-background focus:outline-none focus:ring-2 focus:ring-ring"
                        value={filter}
                        onChange={(e) => setFilter(e.target.value)}
                    />
                </div>
                <div className="text-sm text-muted-foreground">
                    {filteredApplications.length} of {(applications || []).length} applications
                </div>
            </div>

            {filteredApplications.length === 0 && (applications || []).length === 0 ? (
                <div className="text-center py-16">
                    <Cube size={64} className="mx-auto mb-4 text-muted-foreground opacity-50" />
                    <h3 className="text-lg font-medium text-foreground mb-2">No applications yet</h3>
                    <p className="text-muted-foreground mb-6">Start building your application portfolio by adding your first application.</p>
                    <Button onClick={() => setShowForm(true)} className="gap-2">
                        <Plus size={16} />
                        Add Your First Application
                    </Button>
                </div>
            ) : filteredApplications.length === 0 ? (
                <div className="text-center py-16">
                    <FunnelSimple size={64} className="mx-auto mb-4 text-muted-foreground opacity-50" />
                    <h3 className="text-lg font-medium text-foreground mb-2">No matching applications</h3>
                    <p className="text-muted-foreground">Try adjusting your search criteria.</p>
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
                                            {app.lifecyclePhase}
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
                                    <span className="text-sm font-medium">Criticality</span>
                                    <Badge className={getCriticalityColor(app.criticality)}>
                                        {app.criticality}
                                    </Badge>
                                </div>
                                
                                <div className="space-y-2">
                                    <div className="flex items-center justify-between">
                                        <span className="text-sm font-medium">Health Score</span>
                                        <span className="text-sm text-muted-foreground">{app.healthScore}%</span>
                                    </div>
                                    <Progress value={app.healthScore} />
                                </div>

                                {app.hostingType && (
                                    <div className="flex items-center justify-between">
                                        <span className="text-sm text-muted-foreground">Hosting</span>
                                        <span className="text-sm">{app.hostingType}</span>
                                    </div>
                                )}

                                {app.estimatedCost && (
                                    <div className="flex items-center justify-between">
                                        <span className="text-sm text-muted-foreground">Est. Cost</span>
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
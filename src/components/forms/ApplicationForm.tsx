import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { ArrowLeft, FloppyDisk } from '@phosphor-icons/react'

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

interface ApplicationFormProps {
    application?: Application | null
    onSave: (data: Omit<Application, 'id'>) => void
    onCancel: () => void
}

export function ApplicationForm({ application, onSave, onCancel }: ApplicationFormProps) {
    const [formData, setFormData] = useState({
        name: application?.name || '',
        description: application?.description || '',
        lifecyclePhase: application?.lifecyclePhase || 'PRODUÇÃO',
        criticality: application?.criticality || 'MÉDIA',
        hostingType: application?.hostingType || '',
        healthScore: application?.healthScore || 85,
        technicalFit: application?.technicalFit || '',
        functionalFit: application?.functionalFit || '',
        estimatedCost: application?.estimatedCost || undefined,
        currency: application?.currency || 'BRL'
    })

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault()
        onSave(formData)
    }

    const updateField = (field: string, value: any) => {
        setFormData(prev => ({ ...prev, [field]: value }))
    }

    return (
        <div className="space-y-6">
            <div className="flex items-center gap-4">
                <Button variant="ghost" size="sm" onClick={onCancel}>
                    <ArrowLeft size={16} />
                </Button>
                <div>
                    <h1 className="text-3xl font-bold text-foreground">
                        {application ? 'Editar Aplicação' : 'Nova Aplicação'}
                    </h1>
                    <p className="text-muted-foreground">
                        {application ? 'Atualize detalhes e metadados da aplicação' : 'Adicione uma nova aplicação ao seu portfólio'}
                    </p>
                </div>
            </div>

            <form onSubmit={handleSubmit}>
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                    <div className="lg:col-span-2 space-y-6">
                        <Card>
                            <CardHeader>
                                <CardTitle>Informações Básicas</CardTitle>
                            </CardHeader>
                            <CardContent className="space-y-4">
                                <div>
                                    <Label htmlFor="name">Nome da Aplicação</Label>
                                    <Input
                                        id="name"
                                        value={formData.name}
                                        onChange={(e) => updateField('name', e.target.value)}
                                        placeholder="e.g. Customer Management System"
                                        required
                                    />
                                </div>
                                
                                <div>
                                    <Label htmlFor="description">Description</Label>
                                    <Textarea
                                        id="description"
                                        value={formData.description}
                                        onChange={(e) => updateField('description', e.target.value)}
                                        placeholder="Brief description of the application's purpose and functionality..."
                                        rows={3}
                                    />
                                </div>
                            </CardContent>
                        </Card>

                        <Card>
                            <CardHeader>
                                <CardTitle>Classification</CardTitle>
                            </CardHeader>
                            <CardContent className="space-y-4">
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    <div>
                                        <Label htmlFor="lifecycle">Lifecycle Phase</Label>
                                        <Select value={formData.lifecyclePhase} onValueChange={(value) => updateField('lifecyclePhase', value)}>
                                            <SelectTrigger>
                                                <SelectValue />
                                            </SelectTrigger>
                                            <SelectContent>
                                                <SelectItem value="PLANNING">Planning</SelectItem>
                                                <SelectItem value="DEVELOPMENT">Development</SelectItem>
                                                <SelectItem value="PRODUCTION">Production</SelectItem>
                                                <SelectItem value="MAINTENANCE">Maintenance</SelectItem>
                                                <SelectItem value="SUNSET">Sunset</SelectItem>
                                                <SelectItem value="RETIRED">Retired</SelectItem>
                                            </SelectContent>
                                        </Select>
                                    </div>

                                    <div>
                                        <Label htmlFor="criticality">Business Criticality</Label>
                                        <Select value={formData.criticality} onValueChange={(value) => updateField('criticality', value)}>
                                            <SelectTrigger>
                                                <SelectValue />
                                            </SelectTrigger>
                                            <SelectContent>
                                                <SelectItem value="LOW">Low</SelectItem>
                                                <SelectItem value="MEDIUM">Medium</SelectItem>
                                                <SelectItem value="HIGH">High</SelectItem>
                                                <SelectItem value="CRITICAL">Critical</SelectItem>
                                            </SelectContent>
                                        </Select>
                                    </div>
                                </div>

                                <div>
                                    <Label htmlFor="hostingType">Hosting Type</Label>
                                    <Select value={formData.hostingType} onValueChange={(value) => updateField('hostingType', value)}>
                                        <SelectTrigger>
                                            <SelectValue placeholder="Select hosting type" />
                                        </SelectTrigger>
                                        <SelectContent>
                                            <SelectItem value="ON_PREMISE">On-Premise</SelectItem>
                                            <SelectItem value="PRIVATE_CLOUD">Private Cloud</SelectItem>
                                            <SelectItem value="PUBLIC_CLOUD">Public Cloud</SelectItem>
                                            <SelectItem value="HYBRID">Hybrid</SelectItem>
                                            <SelectItem value="SAAS">SaaS</SelectItem>
                                        </SelectContent>
                                    </Select>
                                </div>
                            </CardContent>
                        </Card>

                        <Card>
                            <CardHeader>
                                <CardTitle>Financial Information</CardTitle>
                            </CardHeader>
                            <CardContent className="space-y-4">
                                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                                    <div className="md:col-span-2">
                                        <Label htmlFor="cost">Estimated Annual Cost</Label>
                                        <Input
                                            id="cost"
                                            type="number"
                                            value={formData.estimatedCost || ''}
                                            onChange={(e) => updateField('estimatedCost', e.target.value ? Number(e.target.value) : undefined)}
                                            placeholder="100000"
                                        />
                                    </div>
                                    <div>
                                        <Label htmlFor="currency">Currency</Label>
                                        <Select value={formData.currency} onValueChange={(value) => updateField('currency', value)}>
                                            <SelectTrigger>
                                                <SelectValue />
                                            </SelectTrigger>
                                            <SelectContent>
                                                <SelectItem value="BRL">BRL</SelectItem>
                                                <SelectItem value="USD">USD</SelectItem>
                                                <SelectItem value="EUR">EUR</SelectItem>
                                            </SelectContent>
                                        </Select>
                                    </div>
                                </div>
                            </CardContent>
                        </Card>
                    </div>

                    <div className="space-y-6">
                        <Card>
                            <CardHeader>
                                <CardTitle>Health Metrics</CardTitle>
                            </CardHeader>
                            <CardContent className="space-y-4">
                                <div>
                                    <Label htmlFor="healthScore">Health Score (%)</Label>
                                    <Input
                                        id="healthScore"
                                        type="number"
                                        min="0"
                                        max="100"
                                        value={formData.healthScore}
                                        onChange={(e) => updateField('healthScore', Number(e.target.value))}
                                    />
                                    <p className="text-xs text-muted-foreground mt-1">
                                        Overall application health (0-100%)
                                    </p>
                                </div>

                                <div>
                                    <Label htmlFor="technicalFit">Technical Fit</Label>
                                    <Select value={formData.technicalFit} onValueChange={(value) => updateField('technicalFit', value)}>
                                        <SelectTrigger>
                                            <SelectValue placeholder="Select fit level" />
                                        </SelectTrigger>
                                        <SelectContent>
                                            <SelectItem value="VERY_POOR">Very Poor</SelectItem>
                                            <SelectItem value="POOR">Poor</SelectItem>
                                            <SelectItem value="ADEQUATE">Adequate</SelectItem>
                                            <SelectItem value="GOOD">Good</SelectItem>
                                            <SelectItem value="EXCELLENT">Excellent</SelectItem>
                                        </SelectContent>
                                    </Select>
                                </div>

                                <div>
                                    <Label htmlFor="functionalFit">Functional Fit</Label>
                                    <Select value={formData.functionalFit} onValueChange={(value) => updateField('functionalFit', value)}>
                                        <SelectTrigger>
                                            <SelectValue placeholder="Select fit level" />
                                        </SelectTrigger>
                                        <SelectContent>
                                            <SelectItem value="VERY_POOR">Very Poor</SelectItem>
                                            <SelectItem value="POOR">Poor</SelectItem>
                                            <SelectItem value="ADEQUATE">Adequate</SelectItem>
                                            <SelectItem value="GOOD">Good</SelectItem>
                                            <SelectItem value="EXCELLENT">Excellent</SelectItem>
                                        </SelectContent>
                                    </Select>
                                </div>
                            </CardContent>
                        </Card>

                        <div className="flex flex-col gap-2">
                            <Button type="submit" className="gap-2">
                                <FloppyDisk size={16} />
                                {application ? 'Update Application' : 'Create Application'}
                            </Button>
                            <Button type="button" variant="outline" onClick={onCancel}>
                                Cancel
                            </Button>
                        </div>
                    </div>
                </div>
            </form>
        </div>
    )
}
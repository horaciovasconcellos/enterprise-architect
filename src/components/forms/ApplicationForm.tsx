import { useState } from 'react'
import { useApplications, useCapabilities, useProcesses, useTechnologies } from '@/hooks/useDatabase'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { ArrowLeft, FloppyDisk, X, Plus } from '@phosphor-icons/react'

interface Application {
    id: string
    name: string
    description?: string
    repositoryUrl?: string
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

interface BusinessCapability {
    id: string
    name: string
}

interface Process {
    id: string
    name: string
}

interface Technology {
    id: string
    name: string
}

interface ApplicationFormProps {
    application?: Application | null
    onSave: (data: Omit<Application, 'id'>) => void
    onCancel: () => void
}

export function ApplicationForm({ application, onSave, onCancel }: ApplicationFormProps) {
    const { capabilities } = useCapabilities()
    const { processes } = useProcesses()
    const { technologies } = useTechnologies()
    const { applications } = useApplications()
    
    const [formData, setFormData] = useState({
        name: application?.name || '',
        description: application?.description || '',
        repositoryUrl: application?.repositoryUrl || '',
        lifecyclePhase: application?.lifecyclePhase || 'PRODUCAO',
        criticality: application?.criticality || 'MEDIA',
        hostingType: application?.hostingType || '',
        healthScore: application?.healthScore || 85,
        technicalFit: application?.technicalFit || '',
        functionalFit: application?.functionalFit || '',
        estimatedCost: application?.estimatedCost || undefined,
        currency: application?.currency || 'BRL',
        relatedCapabilities: application?.relatedCapabilities || [],
        relatedProcesses: application?.relatedProcesses || [],
        relatedTechnologies: application?.relatedTechnologies || [],
        relatedApplications: application?.relatedApplications || []
    })

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault()
        onSave(formData)
    }

    const updateField = (field: string, value: any) => {
        setFormData(prev => ({ ...prev, [field]: value }))
    }

    const addRelatedItem = (field: string, itemId: string) => {
        setFormData(prev => ({
            ...prev,
            [field]: [...(prev[field as keyof typeof prev] as string[]), itemId]
        }))
    }

    const removeRelatedItem = (field: string, itemId: string) => {
        setFormData(prev => ({
            ...prev,
            [field]: (prev[field as keyof typeof prev] as string[]).filter(id => id !== itemId)
        }))
    }

    // Filter out current application from related applications
    const availableApplications = (applications || []).filter(app => app.id !== application?.id)

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
                                        placeholder="ex: Sistema de Gestão de Clientes"
                                        required
                                    />
                                </div>
                                
                                <div>
                                    <Label htmlFor="description">Descrição</Label>
                                    <Textarea
                                        id="description"
                                        value={formData.description}
                                        onChange={(e) => updateField('description', e.target.value)}
                                        placeholder="Breve descrição do propósito e funcionalidade da aplicação..."
                                        rows={3}
                                    />
                                </div>

                                <div>
                                    <Label htmlFor="repositoryUrl">URL do Repositório</Label>
                                    <Input
                                        id="repositoryUrl"
                                        value={formData.repositoryUrl || ''}
                                        onChange={(e) => updateField('repositoryUrl', e.target.value)}
                                        placeholder="ex: https://github.com/empresa/sistema-crm"
                                        type="url"
                                    />
                                    <p className="text-xs text-muted-foreground mt-1">
                                        Link para o repositório no GitHub, Azure DevOps ou outro sistema de controle de versão
                                    </p>
                                </div>
                            </CardContent>
                        </Card>

                        <Card>
                            <CardHeader>
                                <CardTitle>Classificação</CardTitle>
                            </CardHeader>
                            <CardContent className="space-y-4">
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    <div>
                                        <Label htmlFor="lifecycle">Fase do Ciclo de Vida</Label>
                                        <Select value={formData.lifecyclePhase} onValueChange={(value) => updateField('lifecyclePhase', value)}>
                                            <SelectTrigger>
                                                <SelectValue />
                                            </SelectTrigger>
                                            <SelectContent>
                                                <SelectItem value="PLANEJAMENTO">Planejamento</SelectItem>
                                                <SelectItem value="DESENVOLVIMENTO">Desenvolvimento</SelectItem>
                                                <SelectItem value="PRODUCAO">Produção</SelectItem>
                                                <SelectItem value="MANUTENCAO">Manutenção</SelectItem>
                                                <SelectItem value="DESATIVACAO">Desativação</SelectItem>
                                                <SelectItem value="APOSENTADO">Aposentado</SelectItem>
                                            </SelectContent>
                                        </Select>
                                    </div>

                                    <div>
                                        <Label htmlFor="criticality">Criticidade de Negócio</Label>
                                        <Select value={formData.criticality} onValueChange={(value) => updateField('criticality', value)}>
                                            <SelectTrigger>
                                                <SelectValue />
                                            </SelectTrigger>
                                            <SelectContent>
                                                <SelectItem value="BAIXA">Baixa</SelectItem>
                                                <SelectItem value="MEDIA">Média</SelectItem>
                                                <SelectItem value="ALTA">Alta</SelectItem>
                                                <SelectItem value="CRITICA">Crítica</SelectItem>
                                            </SelectContent>
                                        </Select>
                                    </div>
                                </div>

                                <div>
                                    <Label htmlFor="hostingType">Tipo de Hospedagem</Label>
                                    <Select value={formData.hostingType} onValueChange={(value) => updateField('hostingType', value)}>
                                        <SelectTrigger>
                                            <SelectValue placeholder="Selecione o tipo de hospedagem" />
                                        </SelectTrigger>
                                        <SelectContent>
                                            <SelectItem value="ON_PREMISE">On-Premise</SelectItem>
                                            <SelectItem value="NUVEM_PRIVADA">Nuvem Privada</SelectItem>
                                            <SelectItem value="NUVEM_PUBLICA">Nuvem Pública</SelectItem>
                                            <SelectItem value="HIBRIDO">Híbrido</SelectItem>
                                            <SelectItem value="SAAS">SaaS</SelectItem>
                                        </SelectContent>
                                    </Select>
                                </div>
                            </CardContent>
                        </Card>

                        <Card>
                            <CardHeader>
                                <CardTitle>Informações Financeiras</CardTitle>
                            </CardHeader>
                            <CardContent className="space-y-4">
                                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                                    <div className="md:col-span-2">
                                        <Label htmlFor="cost">Custo Anual Estimado</Label>
                                        <Input
                                            id="cost"
                                            type="number"
                                            value={formData.estimatedCost || ''}
                                            onChange={(e) => updateField('estimatedCost', e.target.value ? Number(e.target.value) : undefined)}
                                            placeholder="100000"
                                        />
                                    </div>
                                    <div>
                                        <Label htmlFor="currency">Moeda</Label>
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

                        <Card>
                            <CardHeader>
                                <CardTitle>Relacionamentos</CardTitle>
                            </CardHeader>
                            <CardContent className="space-y-6">
                                {/* Related Capabilities */}
                                <div>
                                    <Label>Capacidades Relacionadas</Label>
                                    <div className="mt-2">
                                        <Select onValueChange={(value) => {
                                            if (!formData.relatedCapabilities.includes(value)) {
                                                addRelatedItem('relatedCapabilities', value)
                                            }
                                        }}>
                                            <SelectTrigger>
                                                <SelectValue placeholder="Selecionar capacidade..." />
                                            </SelectTrigger>
                                            <SelectContent>
                                                {(capabilities || [])
                                                    .filter(cap => !formData.relatedCapabilities.includes(cap.id))
                                                    .map(cap => (
                                                    <SelectItem key={cap.id} value={cap.id}>
                                                        {cap.name}
                                                    </SelectItem>
                                                ))}
                                            </SelectContent>
                                        </Select>
                                        <div className="flex flex-wrap gap-2 mt-2">
                                            {formData.relatedCapabilities.map(capId => {
                                                const cap = (capabilities || []).find(c => c.id === capId)
                                                return cap ? (
                                                    <Badge key={capId} variant="secondary" className="gap-1">
                                                        {cap.name}
                                                        <X 
                                                            size={12} 
                                                            className="cursor-pointer hover:text-destructive"
                                                            onClick={() => removeRelatedItem('relatedCapabilities', capId)}
                                                        />
                                                    </Badge>
                                                ) : null
                                            })}
                                        </div>
                                    </div>
                                </div>

                                {/* Related Processes */}
                                <div>
                                    <Label>Processos Relacionados</Label>
                                    <div className="mt-2">
                                        <Select onValueChange={(value) => {
                                            if (!formData.relatedProcesses.includes(value)) {
                                                addRelatedItem('relatedProcesses', value)
                                            }
                                        }}>
                                            <SelectTrigger>
                                                <SelectValue placeholder="Selecionar processo..." />
                                            </SelectTrigger>
                                            <SelectContent>
                                                {(processes || [])
                                                    .filter(proc => !formData.relatedProcesses.includes(proc.id))
                                                    .map(proc => (
                                                    <SelectItem key={proc.id} value={proc.id}>
                                                        {proc.name}
                                                    </SelectItem>
                                                ))}
                                            </SelectContent>
                                        </Select>
                                        <div className="flex flex-wrap gap-2 mt-2">
                                            {formData.relatedProcesses.map(procId => {
                                                const proc = (processes || []).find(p => p.id === procId)
                                                return proc ? (
                                                    <Badge key={procId} variant="secondary" className="gap-1">
                                                        {proc.name}
                                                        <X 
                                                            size={12} 
                                                            className="cursor-pointer hover:text-destructive"
                                                            onClick={() => removeRelatedItem('relatedProcesses', procId)}
                                                        />
                                                    </Badge>
                                                ) : null
                                            })}
                                        </div>
                                    </div>
                                </div>

                                {/* Related Technologies */}
                                <div>
                                    <Label>Tecnologias Relacionadas</Label>
                                    <div className="mt-2">
                                        <Select onValueChange={(value) => {
                                            if (!formData.relatedTechnologies.includes(value)) {
                                                addRelatedItem('relatedTechnologies', value)
                                            }
                                        }}>
                                            <SelectTrigger>
                                                <SelectValue placeholder="Selecionar tecnologia..." />
                                            </SelectTrigger>
                                            <SelectContent>
                                                {(technologies || [])
                                                    .filter(tech => !formData.relatedTechnologies.includes(tech.id))
                                                    .map(tech => (
                                                    <SelectItem key={tech.id} value={tech.id}>
                                                        {tech.name}
                                                    </SelectItem>
                                                ))}
                                            </SelectContent>
                                        </Select>
                                        <div className="flex flex-wrap gap-2 mt-2">
                                            {formData.relatedTechnologies.map(techId => {
                                                const tech = (technologies || []).find(t => t.id === techId)
                                                return tech ? (
                                                    <Badge key={techId} variant="secondary" className="gap-1">
                                                        {tech.name}
                                                        <X 
                                                            size={12} 
                                                            className="cursor-pointer hover:text-destructive"
                                                            onClick={() => removeRelatedItem('relatedTechnologies', techId)}
                                                        />
                                                    </Badge>
                                                ) : null
                                            })}
                                        </div>
                                    </div>
                                </div>

                                {/* Related Applications */}
                                <div>
                                    <Label>Aplicações Relacionadas</Label>
                                    <div className="mt-2">
                                        <Select onValueChange={(value) => {
                                            if (!formData.relatedApplications.includes(value)) {
                                                addRelatedItem('relatedApplications', value)
                                            }
                                        }}>
                                            <SelectTrigger>
                                                <SelectValue placeholder="Selecionar aplicação..." />
                                            </SelectTrigger>
                                            <SelectContent>
                                                {availableApplications
                                                    .filter(app => !formData.relatedApplications.includes(app.id))
                                                    .map(app => (
                                                    <SelectItem key={app.id} value={app.id}>
                                                        {app.name}
                                                    </SelectItem>
                                                ))}
                                            </SelectContent>
                                        </Select>
                                        <div className="flex flex-wrap gap-2 mt-2">
                                            {formData.relatedApplications.map(appId => {
                                                const app = availableApplications.find(a => a.id === appId)
                                                return app ? (
                                                    <Badge key={appId} variant="secondary" className="gap-1">
                                                        {app.name}
                                                        <X 
                                                            size={12} 
                                                            className="cursor-pointer hover:text-destructive"
                                                            onClick={() => removeRelatedItem('relatedApplications', appId)}
                                                        />
                                                    </Badge>
                                                ) : null
                                            })}
                                        </div>
                                    </div>
                                </div>
                            </CardContent>
                        </Card>
                    </div>

                    <div className="space-y-6">
                        <Card>
                            <CardHeader>
                                <CardTitle>Métricas de Saúde</CardTitle>
                            </CardHeader>
                            <CardContent className="space-y-4">
                                <div>
                                    <Label htmlFor="healthScore">Pontuação de Saúde (%)</Label>
                                    <Input
                                        id="healthScore"
                                        type="number"
                                        min="0"
                                        max="100"
                                        value={formData.healthScore}
                                        onChange={(e) => updateField('healthScore', Number(e.target.value))}
                                    />
                                    <p className="text-xs text-muted-foreground mt-1">
                                        Saúde geral da aplicação (0-100%)
                                    </p>
                                </div>

                                <div>
                                    <Label htmlFor="technicalFit">Adequação Técnica</Label>
                                    <Select value={formData.technicalFit} onValueChange={(value) => updateField('technicalFit', value)}>
                                        <SelectTrigger>
                                            <SelectValue placeholder="Selecione o nível de adequação" />
                                        </SelectTrigger>
                                        <SelectContent>
                                            <SelectItem value="MUITO_RUIM">Muito Ruim</SelectItem>
                                            <SelectItem value="RUIM">Ruim</SelectItem>
                                            <SelectItem value="ADEQUADO">Adequado</SelectItem>
                                            <SelectItem value="BOM">Bom</SelectItem>
                                            <SelectItem value="EXCELENTE">Excelente</SelectItem>
                                        </SelectContent>
                                    </Select>
                                </div>

                                <div>
                                    <Label htmlFor="functionalFit">Adequação Funcional</Label>
                                    <Select value={formData.functionalFit} onValueChange={(value) => updateField('functionalFit', value)}>
                                        <SelectTrigger>
                                            <SelectValue placeholder="Selecione o nível de adequação" />
                                        </SelectTrigger>
                                        <SelectContent>
                                            <SelectItem value="MUITO_RUIM">Muito Ruim</SelectItem>
                                            <SelectItem value="RUIM">Ruim</SelectItem>
                                            <SelectItem value="ADEQUADO">Adequado</SelectItem>
                                            <SelectItem value="BOM">Bom</SelectItem>
                                            <SelectItem value="EXCELENTE">Excelente</SelectItem>
                                        </SelectContent>
                                    </Select>
                                </div>
                            </CardContent>
                        </Card>

                        <div className="flex flex-col gap-2">
                            <Button type="submit" className="gap-2">
                                <FloppyDisk size={16} />
                                {application ? 'Atualizar Aplicação' : 'Criar Aplicação'}
                            </Button>
                            <Button type="button" variant="outline" onClick={onCancel}>
                                Cancelar
                            </Button>
                        </div>
                    </div>
                </div>
            </form>
        </div>
    )
}
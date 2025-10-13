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

interface Contract {
    contractNumber: string
    contractCost: number
    contractStartDate: string
    contractEndDate: string
}

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
    contracts?: Contract[]
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
        contracts: application?.contracts || [],
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

    const addContract = () => {
        setFormData(prev => ({
            ...prev,
            contracts: [...prev.contracts, {
                contractNumber: '',
                contractCost: 0,
                contractStartDate: '',
                contractEndDate: ''
            }]
        }))
    }

    const updateContract = (index: number, field: keyof Contract, value: string | number) => {
        setFormData(prev => ({
            ...prev,
            contracts: prev.contracts.map((contract, i) => 
                i === index ? { ...contract, [field]: value } : contract
            )
        }))
    }

    const removeContract = (index: number) => {
        setFormData(prev => ({
            ...prev,
            contracts: prev.contracts.filter((_, i) => i !== index)
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
                            <CardContent>
                                <div className="overflow-x-auto">
                                    <table className="w-full">
                                        <thead>
                                            <tr className="border-b">
                                                <th className="text-left py-3 px-4 font-medium text-muted-foreground">Atributo</th>
                                                <th className="text-left py-3 px-4 font-medium text-muted-foreground">Valor</th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            <tr className="border-b hover:bg-muted/50">
                                                <td className="py-3 px-4 font-medium">Fase do Ciclo de Vida</td>
                                                <td className="py-3 px-4">
                                                    <Select value={formData.lifecyclePhase} onValueChange={(value) => updateField('lifecyclePhase', value)}>
                                                        <SelectTrigger className="w-full">
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
                                                </td>
                                            </tr>
                                            <tr className="border-b hover:bg-muted/50">
                                                <td className="py-3 px-4 font-medium">Criticidade de Negócio</td>
                                                <td className="py-3 px-4">
                                                    <Select value={formData.criticality} onValueChange={(value) => updateField('criticality', value)}>
                                                        <SelectTrigger className="w-full">
                                                            <SelectValue />
                                                        </SelectTrigger>
                                                        <SelectContent>
                                                            <SelectItem value="BAIXA">Baixa</SelectItem>
                                                            <SelectItem value="MEDIA">Média</SelectItem>
                                                            <SelectItem value="ALTA">Alta</SelectItem>
                                                            <SelectItem value="CRITICA">Crítica</SelectItem>
                                                        </SelectContent>
                                                    </Select>
                                                </td>
                                            </tr>
                                            <tr className="hover:bg-muted/50">
                                                <td className="py-3 px-4 font-medium">Tipo de Hospedagem</td>
                                                <td className="py-3 px-4">
                                                    <Select value={formData.hostingType} onValueChange={(value) => updateField('hostingType', value)}>
                                                        <SelectTrigger className="w-full">
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
                                                </td>
                                            </tr>
                                        </tbody>
                                    </table>
                                </div>
                            </CardContent>
                        </Card>

                        <Card>
                            <CardHeader>
                                <CardTitle>Informações Financeiras</CardTitle>
                            </CardHeader>
                            <CardContent className="space-y-6">
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

                                <div className="space-y-3">
                                    <div className="flex items-center justify-between">
                                        <Label>Contratos</Label>
                                        <Button type="button" variant="outline" size="sm" onClick={addContract} className="gap-2">
                                            <Plus size={16} />
                                            Adicionar Contrato
                                        </Button>
                                    </div>
                                    
                                    {formData.contracts.length === 0 ? (
                                        <p className="text-sm text-muted-foreground italic py-4 text-center border rounded-lg">
                                            Nenhum contrato cadastrado. Clique em "Adicionar Contrato" para incluir um novo.
                                        </p>
                                    ) : (
                                        <div className="overflow-x-auto border rounded-lg">
                                            <table className="w-full">
                                                <thead>
                                                    <tr className="border-b bg-muted/50">
                                                        <th className="text-left py-3 px-4 font-medium text-sm">Número do Contrato</th>
                                                        <th className="text-left py-3 px-4 font-medium text-sm">Custo do Contrato</th>
                                                        <th className="text-left py-3 px-4 font-medium text-sm">Data de Início</th>
                                                        <th className="text-left py-3 px-4 font-medium text-sm">Data de Término</th>
                                                        <th className="text-center py-3 px-4 font-medium text-sm w-20">Ações</th>
                                                    </tr>
                                                </thead>
                                                <tbody>
                                                    {formData.contracts.map((contract, index) => (
                                                        <tr key={index} className="border-b last:border-0 hover:bg-muted/30">
                                                            <td className="py-2 px-4">
                                                                <Input
                                                                    value={contract.contractNumber}
                                                                    onChange={(e) => updateContract(index, 'contractNumber', e.target.value)}
                                                                    placeholder="Ex: CTR-2024-001"
                                                                    className="h-9"
                                                                />
                                                            </td>
                                                            <td className="py-2 px-4">
                                                                <Input
                                                                    type="number"
                                                                    value={contract.contractCost}
                                                                    onChange={(e) => updateContract(index, 'contractCost', Number(e.target.value))}
                                                                    placeholder="0.00"
                                                                    className="h-9"
                                                                />
                                                            </td>
                                                            <td className="py-2 px-4">
                                                                <Input
                                                                    type="date"
                                                                    value={contract.contractStartDate}
                                                                    onChange={(e) => updateContract(index, 'contractStartDate', e.target.value)}
                                                                    className="h-9"
                                                                />
                                                            </td>
                                                            <td className="py-2 px-4">
                                                                <Input
                                                                    type="date"
                                                                    value={contract.contractEndDate}
                                                                    onChange={(e) => updateContract(index, 'contractEndDate', e.target.value)}
                                                                    className="h-9"
                                                                />
                                                            </td>
                                                            <td className="py-2 px-4 text-center">
                                                                <Button
                                                                    type="button"
                                                                    variant="ghost"
                                                                    size="sm"
                                                                    onClick={() => removeContract(index)}
                                                                    className="text-destructive hover:text-destructive h-9 w-9 p-0"
                                                                >
                                                                    <X size={16} />
                                                                </Button>
                                                            </td>
                                                        </tr>
                                                    ))}
                                                </tbody>
                                            </table>
                                        </div>
                                    )}
                                </div>
                            </CardContent>
                        </Card>

                        <Card>
                            <CardHeader>
                                <CardTitle>Relacionamentos</CardTitle>
                            </CardHeader>
                            <CardContent className="space-y-6">
                                {/* Capacidades */}
                                <div className="space-y-3">
                                    <div className="flex items-center justify-between">
                                        <Label className="text-base font-semibold">Capacidades</Label>
                                    </div>
                                    
                                    {formData.relatedCapabilities.length === 0 ? (
                                        <div className="text-center py-4 border rounded-lg bg-muted/30">
                                            <p className="text-sm text-muted-foreground italic">
                                                Nenhuma capacidade relacionada
                                            </p>
                                        </div>
                                    ) : (
                                        <div className="overflow-x-auto border rounded-lg">
                                            <table className="w-full">
                                                <thead>
                                                    <tr className="border-b bg-muted/50">
                                                        <th className="text-left py-3 px-4 font-medium text-sm">Nome da Capacidade</th>
                                                        <th className="text-center py-3 px-4 font-medium text-sm w-20">Ações</th>
                                                    </tr>
                                                </thead>
                                                <tbody>
                                                    {formData.relatedCapabilities.map((capId) => {
                                                        const cap = (capabilities || []).find(c => c.id === capId)
                                                        return cap ? (
                                                            <tr key={capId} className="border-b last:border-0 hover:bg-muted/30">
                                                                <td className="py-3 px-4">{cap.name}</td>
                                                                <td className="py-3 px-4 text-center">
                                                                    <Button
                                                                        type="button"
                                                                        variant="ghost"
                                                                        size="sm"
                                                                        onClick={() => removeRelatedItem('relatedCapabilities', capId)}
                                                                        className="text-destructive hover:text-destructive h-9 w-9 p-0"
                                                                    >
                                                                        <X size={16} />
                                                                    </Button>
                                                                </td>
                                                            </tr>
                                                        ) : null
                                                    })}
                                                </tbody>
                                            </table>
                                        </div>
                                    )}
                                    
                                    <Select onValueChange={(value) => {
                                        if (!formData.relatedCapabilities.includes(value)) {
                                            addRelatedItem('relatedCapabilities', value)
                                        }
                                    }}>
                                        <SelectTrigger className="w-full">
                                            <SelectValue placeholder="+ Adicionar capacidade" />
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
                                </div>

                                {/* Processos */}
                                <div className="space-y-3">
                                    <div className="flex items-center justify-between">
                                        <Label className="text-base font-semibold">Processos</Label>
                                    </div>
                                    
                                    {formData.relatedProcesses.length === 0 ? (
                                        <div className="text-center py-4 border rounded-lg bg-muted/30">
                                            <p className="text-sm text-muted-foreground italic">
                                                Nenhum processo relacionado
                                            </p>
                                        </div>
                                    ) : (
                                        <div className="overflow-x-auto border rounded-lg">
                                            <table className="w-full">
                                                <thead>
                                                    <tr className="border-b bg-muted/50">
                                                        <th className="text-left py-3 px-4 font-medium text-sm">Nome do Processo</th>
                                                        <th className="text-center py-3 px-4 font-medium text-sm w-20">Ações</th>
                                                    </tr>
                                                </thead>
                                                <tbody>
                                                    {formData.relatedProcesses.map((procId) => {
                                                        const proc = (processes || []).find(p => p.id === procId)
                                                        return proc ? (
                                                            <tr key={procId} className="border-b last:border-0 hover:bg-muted/30">
                                                                <td className="py-3 px-4">{proc.name}</td>
                                                                <td className="py-3 px-4 text-center">
                                                                    <Button
                                                                        type="button"
                                                                        variant="ghost"
                                                                        size="sm"
                                                                        onClick={() => removeRelatedItem('relatedProcesses', procId)}
                                                                        className="text-destructive hover:text-destructive h-9 w-9 p-0"
                                                                    >
                                                                        <X size={16} />
                                                                    </Button>
                                                                </td>
                                                            </tr>
                                                        ) : null
                                                    })}
                                                </tbody>
                                            </table>
                                        </div>
                                    )}
                                    
                                    <Select onValueChange={(value) => {
                                        if (!formData.relatedProcesses.includes(value)) {
                                            addRelatedItem('relatedProcesses', value)
                                        }
                                    }}>
                                        <SelectTrigger className="w-full">
                                            <SelectValue placeholder="+ Adicionar processo" />
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
                                </div>

                                {/* Tecnologias */}
                                <div className="space-y-3">
                                    <div className="flex items-center justify-between">
                                        <Label className="text-base font-semibold">Tecnologias</Label>
                                    </div>
                                    
                                    {formData.relatedTechnologies.length === 0 ? (
                                        <div className="text-center py-4 border rounded-lg bg-muted/30">
                                            <p className="text-sm text-muted-foreground italic">
                                                Nenhuma tecnologia relacionada
                                            </p>
                                        </div>
                                    ) : (
                                        <div className="overflow-x-auto border rounded-lg">
                                            <table className="w-full">
                                                <thead>
                                                    <tr className="border-b bg-muted/50">
                                                        <th className="text-left py-3 px-4 font-medium text-sm">Nome da Tecnologia</th>
                                                        <th className="text-center py-3 px-4 font-medium text-sm w-20">Ações</th>
                                                    </tr>
                                                </thead>
                                                <tbody>
                                                    {formData.relatedTechnologies.map((techId) => {
                                                        const tech = (technologies || []).find(t => t.id === techId)
                                                        return tech ? (
                                                            <tr key={techId} className="border-b last:border-0 hover:bg-muted/30">
                                                                <td className="py-3 px-4">
                                                                    {tech.name}
                                                                    <span className="text-muted-foreground"> - {tech.version || 'Todas'}</span>
                                                                </td>
                                                                <td className="py-3 px-4 text-center">
                                                                    <Button
                                                                        type="button"
                                                                        variant="ghost"
                                                                        size="sm"
                                                                        onClick={() => removeRelatedItem('relatedTechnologies', techId)}
                                                                        className="text-destructive hover:text-destructive h-9 w-9 p-0"
                                                                    >
                                                                        <X size={16} />
                                                                    </Button>
                                                                </td>
                                                            </tr>
                                                        ) : null
                                                    })}
                                                </tbody>
                                            </table>
                                        </div>
                                    )}
                                    
                                    <Select onValueChange={(value) => {
                                        if (!formData.relatedTechnologies.includes(value)) {
                                            addRelatedItem('relatedTechnologies', value)
                                        }
                                    }}>
                                        <SelectTrigger className="w-full">
                                            <SelectValue placeholder="+ Adicionar tecnologia" />
                                        </SelectTrigger>
                                        <SelectContent>
                                            {(technologies || [])
                                                .filter(tech => !formData.relatedTechnologies.includes(tech.id))
                                                .map(tech => (
                                                <SelectItem key={tech.id} value={tech.id}>
                                                    {tech.name} - {tech.version || 'Todas'}
                                                </SelectItem>
                                            ))}
                                        </SelectContent>
                                    </Select>
                                </div>

                                {/* Aplicações Relacionadas */}
                                <div className="space-y-3">
                                    <div className="flex items-center justify-between">
                                        <Label className="text-base font-semibold">Aplicações Relacionadas</Label>
                                    </div>
                                    
                                    {formData.relatedApplications.length === 0 ? (
                                        <div className="text-center py-4 border rounded-lg bg-muted/30">
                                            <p className="text-sm text-muted-foreground italic">
                                                Nenhuma aplicação relacionada
                                            </p>
                                        </div>
                                    ) : (
                                        <div className="overflow-x-auto border rounded-lg">
                                            <table className="w-full">
                                                <thead>
                                                    <tr className="border-b bg-muted/50">
                                                        <th className="text-left py-3 px-4 font-medium text-sm">Nome da Aplicação</th>
                                                        <th className="text-center py-3 px-4 font-medium text-sm w-20">Ações</th>
                                                    </tr>
                                                </thead>
                                                <tbody>
                                                    {formData.relatedApplications.map((appId) => {
                                                        const app = availableApplications.find(a => a.id === appId)
                                                        return app ? (
                                                            <tr key={appId} className="border-b last:border-0 hover:bg-muted/30">
                                                                <td className="py-3 px-4">{app.name}</td>
                                                                <td className="py-3 px-4 text-center">
                                                                    <Button
                                                                        type="button"
                                                                        variant="ghost"
                                                                        size="sm"
                                                                        onClick={() => removeRelatedItem('relatedApplications', appId)}
                                                                        className="text-destructive hover:text-destructive h-9 w-9 p-0"
                                                                    >
                                                                        <X size={16} />
                                                                    </Button>
                                                                </td>
                                                            </tr>
                                                        ) : null
                                                    })}
                                                </tbody>
                                            </table>
                                        </div>
                                    )}
                                    
                                    <Select onValueChange={(value) => {
                                        if (!formData.relatedApplications.includes(value)) {
                                            addRelatedItem('relatedApplications', value)
                                        }
                                    }}>
                                        <SelectTrigger className="w-full">
                                            <SelectValue placeholder="+ Adicionar aplicação" />
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
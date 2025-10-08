import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Slider } from '@/components/ui/slider'
import { X } from '@phosphor-icons/react'

interface Process {
    id: string
    name: string
    description?: string
    maturityLevel: string
    automationScore: number
    categoryId?: string
    supportingApps: number
    owner?: string
    frequency?: string
    duration?: string
    complexity?: string
    norma?: string
    itemNorma?: string
}

interface ProcessFormProps {
    onSubmit: (process: Omit<Process, 'id'>) => void
    onCancel: () => void
    process?: Process
}

const maturityLevels = [
    'INICIAL',
    'REPETÍVEL', 
    'DEFINIDO',
    'GERENCIADO',
    'OTIMIZADO'
]

const frequencies = [
    'Contínuo',
    'Diário',
    'Semanal',
    'Mensal',
    'Trimestral',
    'Anual',
    'Ad-hoc'
]

const complexityLevels = [
    'Baixa',
    'Média',
    'Alta',
    'Muito Alta'
]

export function ProcessForm({ onSubmit, onCancel, process }: ProcessFormProps) {
    const [formData, setFormData] = useState({
        name: process?.name || '',
        description: process?.description || '',
        maturityLevel: process?.maturityLevel || '',
        automationScore: process?.automationScore || 50,
        categoryId: process?.categoryId || '',
        supportingApps: process?.supportingApps || 0,
        owner: process?.owner || '',
        frequency: process?.frequency || '',
        duration: process?.duration || '',
        complexity: process?.complexity || '',
        norma: process?.norma || '',
        itemNorma: process?.itemNorma || ''
    })

    const [errors, setErrors] = useState<Record<string, string>>({})

    const validateForm = () => {
        const newErrors: Record<string, string> = {}

        if (!formData.name.trim()) {
            newErrors.name = 'Nome é obrigatório'
        }

        if (!formData.maturityLevel) {
            newErrors.maturityLevel = 'Nível de maturidade é obrigatório'
        }

        if (formData.automationScore < 0 || formData.automationScore > 100) {
            newErrors.automationScore = 'Pontuação deve estar entre 0 e 100'
        }

        if (formData.supportingApps < 0) {
            newErrors.supportingApps = 'Número de aplicações deve ser positivo'
        }

        setErrors(newErrors)
        return Object.keys(newErrors).length === 0
    }

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault()
        
        if (validateForm()) {
            onSubmit({
                name: formData.name.trim(),
                description: formData.description.trim() || undefined,
                maturityLevel: formData.maturityLevel,
                automationScore: formData.automationScore,
                categoryId: formData.categoryId.trim() || undefined,
                supportingApps: formData.supportingApps,
                owner: formData.owner.trim() || undefined,
                frequency: formData.frequency || undefined,
                duration: formData.duration.trim() || undefined,
                complexity: formData.complexity || undefined,
                norma: formData.norma.trim() || undefined,
                itemNorma: formData.itemNorma.trim() || undefined
            })
        }
    }

    const handleInputChange = (field: string, value: string | number) => {
        setFormData(prev => ({ ...prev, [field]: value }))
        // Clear error when user starts typing
        if (errors[field]) {
            setErrors(prev => ({ ...prev, [field]: '' }))
        }
    }

    return (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
            <Card className="w-full max-w-2xl max-h-[90vh] overflow-y-auto">
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-4">
                    <CardTitle>
                        {process ? 'Editar Processo' : 'Novo Processo'}
                    </CardTitle>
                    <Button variant="ghost" size="sm" onClick={onCancel}>
                        <X size={16} />
                    </Button>
                </CardHeader>
                <CardContent>
                    <form onSubmit={handleSubmit} className="space-y-6">
                        <div className="space-y-2">
                            <Label htmlFor="name">Nome do Processo *</Label>
                            <Input
                                id="name"
                                value={formData.name}
                                onChange={(e) => handleInputChange('name', e.target.value)}
                                placeholder="Ex: Processamento de Pedidos, Onboarding de Funcionários"
                                className={errors.name ? 'border-destructive' : ''}
                            />
                            {errors.name && (
                                <p className="text-sm text-destructive">{errors.name}</p>
                            )}
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="description">Descrição</Label>
                            <Textarea
                                id="description"
                                value={formData.description}
                                onChange={(e) => handleInputChange('description', e.target.value)}
                                placeholder="Descreva o objetivo e etapas principais do processo..."
                                className="min-h-[100px]"
                            />
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div className="space-y-2">
                                <Label htmlFor="maturityLevel">Nível de Maturidade *</Label>
                                <Select 
                                    value={formData.maturityLevel} 
                                    onValueChange={(value) => handleInputChange('maturityLevel', value)}
                                >
                                    <SelectTrigger className={errors.maturityLevel ? 'border-destructive' : ''}>
                                        <SelectValue placeholder="Selecione o nível" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        {maturityLevels.map((level) => (
                                            <SelectItem key={level} value={level}>
                                                {level}
                                            </SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>
                                {errors.maturityLevel && (
                                    <p className="text-sm text-destructive">{errors.maturityLevel}</p>
                                )}
                            </div>

                            <div className="space-y-2">
                                <Label htmlFor="owner">Responsável</Label>
                                <Input
                                    id="owner"
                                    value={formData.owner}
                                    onChange={(e) => handleInputChange('owner', e.target.value)}
                                    placeholder="Ex: Departamento de Vendas, João Silva"
                                />
                            </div>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                            <div className="space-y-2">
                                <Label htmlFor="frequency">Frequência</Label>
                                <Select 
                                    value={formData.frequency} 
                                    onValueChange={(value) => handleInputChange('frequency', value)}
                                >
                                    <SelectTrigger>
                                        <SelectValue placeholder="Selecione a frequência" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        {frequencies.map((freq) => (
                                            <SelectItem key={freq} value={freq}>
                                                {freq}
                                            </SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>
                            </div>

                            <div className="space-y-2">
                                <Label htmlFor="duration">Duração Média</Label>
                                <Input
                                    id="duration"
                                    value={formData.duration}
                                    onChange={(e) => handleInputChange('duration', e.target.value)}
                                    placeholder="Ex: 2 horas, 3 dias"
                                />
                            </div>

                            <div className="space-y-2">
                                <Label htmlFor="complexity">Complexidade</Label>
                                <Select 
                                    value={formData.complexity} 
                                    onValueChange={(value) => handleInputChange('complexity', value)}
                                >
                                    <SelectTrigger>
                                        <SelectValue placeholder="Selecione a complexidade" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        {complexityLevels.map((level) => (
                                            <SelectItem key={level} value={level}>
                                                {level}
                                            </SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>
                            </div>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div className="space-y-3">
                                <Label>Pontuação de Automação: {formData.automationScore}%</Label>
                                <Slider
                                    value={[formData.automationScore]}
                                    onValueChange={(value) => handleInputChange('automationScore', value[0])}
                                    max={100}
                                    min={0}
                                    step={5}
                                    className="w-full"
                                />
                                <div className="flex justify-between text-xs text-muted-foreground">
                                    <span>Manual (0%)</span>
                                    <span>Parcial (50%)</span>
                                    <span>Automático (100%)</span>
                                </div>
                                {errors.automationScore && (
                                    <p className="text-sm text-destructive">{errors.automationScore}</p>
                                )}
                            </div>

                            <div className="space-y-2">
                                <Label htmlFor="supportingApps">Aplicações de Suporte</Label>
                                <Input
                                    id="supportingApps"
                                    type="number"
                                    min="0"
                                    value={formData.supportingApps}
                                    onChange={(e) => handleInputChange('supportingApps', parseInt(e.target.value) || 0)}
                                    placeholder="0"
                                    className={errors.supportingApps ? 'border-destructive' : ''}
                                />
                                <p className="text-xs text-muted-foreground">
                                    Número de aplicações que suportam este processo
                                </p>
                                {errors.supportingApps && (
                                    <p className="text-sm text-destructive">{errors.supportingApps}</p>
                                )}
                            </div>
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="categoryId">Categoria/Área</Label>
                            <Input
                                id="categoryId"
                                value={formData.categoryId}
                                onChange={(e) => handleInputChange('categoryId', e.target.value)}
                                placeholder="Ex: Vendas, RH, Financeiro, Operações"
                            />
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div className="space-y-2">
                                <Label htmlFor="norma">Norma</Label>
                                <Input
                                    id="norma"
                                    value={formData.norma}
                                    onChange={(e) => handleInputChange('norma', e.target.value)}
                                    placeholder="Ex: ISO 9001, LGPD, SOX"
                                />
                            </div>

                            <div className="space-y-2">
                                <Label htmlFor="itemNorma">Item da Norma</Label>
                                <Input
                                    id="itemNorma"
                                    value={formData.itemNorma}
                                    onChange={(e) => handleInputChange('itemNorma', e.target.value)}
                                    placeholder="Ex: 4.1, 7.2.1, Artigo 5º"
                                />
                            </div>
                        </div>

                        <div className="flex justify-end gap-3 pt-4">
                            <Button type="button" variant="outline" onClick={onCancel}>
                                Cancelar
                            </Button>
                            <Button type="submit">
                                {process ? 'Atualizar Processo' : 'Criar Processo'}
                            </Button>
                        </div>
                    </form>
                </CardContent>
            </Card>
        </div>
    )
}
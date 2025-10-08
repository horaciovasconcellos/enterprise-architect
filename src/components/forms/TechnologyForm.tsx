import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Slider } from '@/components/ui/slider'
import { X } from '@phosphor-icons/react'

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

interface TechnologyFormProps {
    onSubmit: (technology: Omit<Technology, 'id'>) => void
    onCancel: () => void
    technology?: Technology
}

const categories = [
    'INFRAESTRUTURA',
    'BANCO DE DADOS',
    'PLATAFORMA',
    'MIDDLEWARE',
    'APLICAÇÃO',
    'SEGURANÇA',
    'MONITORAMENTO',
    'DESENVOLVIMENTO',
    'INTEGRAÇÃO',
    'ANÁLISE'
]

const licenseTypes = [
    'Código Aberto',
    'Comercial',
    'Freemium',
    'Assinatura',
    'Perpetua',
    'Personalizada'
]

const supportLevels = [
    'Básico',
    'Padrão',
    'Premium',
    'Enterprise',
    'Comunidade',
    'Sem Suporte'
]

const deploymentTypes = [
    'On-Premise',
    'Cloud',
    'Híbrido',
    'SaaS',
    'PaaS',
    'IaaS'
]

export function TechnologyForm({ onSubmit, onCancel, technology }: TechnologyFormProps) {
    const [formData, setFormData] = useState({
        name: technology?.name || '',
        description: technology?.description || '',
        category: technology?.category || '',
        healthScore: technology?.healthScore || 85,
        version: technology?.version || '',
        vendor: technology?.vendor || '',
        licenseType: technology?.licenseType || '',
        supportLevel: technology?.supportLevel || '',
        deploymentType: technology?.deploymentType || ''
    })

    const [errors, setErrors] = useState<Record<string, string>>({})

    const validateForm = () => {
        const newErrors: Record<string, string> = {}

        if (!formData.name.trim()) {
            newErrors.name = 'Nome é obrigatório'
        }

        if (!formData.category) {
            newErrors.category = 'Categoria é obrigatória'
        }

        if (formData.healthScore < 0 || formData.healthScore > 100) {
            newErrors.healthScore = 'Pontuação deve estar entre 0 e 100'
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
                category: formData.category,
                healthScore: formData.healthScore,
                version: formData.version.trim() || undefined,
                vendor: formData.vendor.trim() || undefined,
                licenseType: formData.licenseType || undefined,
                supportLevel: formData.supportLevel || undefined,
                deploymentType: formData.deploymentType || undefined
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
                        {technology ? 'Editar Tecnologia' : 'Nova Tecnologia'}
                    </CardTitle>
                    <Button variant="ghost" size="sm" onClick={onCancel}>
                        <X size={16} />
                    </Button>
                </CardHeader>
                <CardContent>
                    <form onSubmit={handleSubmit} className="space-y-6">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div className="space-y-2">
                                <Label htmlFor="name">Nome da Tecnologia *</Label>
                                <Input
                                    id="name"
                                    value={formData.name}
                                    onChange={(e) => handleInputChange('name', e.target.value)}
                                    placeholder="Ex: PostgreSQL, AWS Lambda, React"
                                    className={errors.name ? 'border-destructive' : ''}
                                />
                                {errors.name && (
                                    <p className="text-sm text-destructive">{errors.name}</p>
                                )}
                            </div>

                            <div className="space-y-2">
                                <Label htmlFor="category">Categoria *</Label>
                                <Select 
                                    value={formData.category} 
                                    onValueChange={(value) => handleInputChange('category', value)}
                                >
                                    <SelectTrigger className={errors.category ? 'border-destructive' : ''}>
                                        <SelectValue placeholder="Selecione uma categoria" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        {categories.map((category) => (
                                            <SelectItem key={category} value={category}>
                                                {category}
                                            </SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>
                                {errors.category && (
                                    <p className="text-sm text-destructive">{errors.category}</p>
                                )}
                            </div>
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="description">Descrição</Label>
                            <Textarea
                                id="description"
                                value={formData.description}
                                onChange={(e) => handleInputChange('description', e.target.value)}
                                placeholder="Descreva o propósito e características da tecnologia..."
                                className="min-h-[100px]"
                            />
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div className="space-y-2">
                                <Label htmlFor="version">Versão</Label>
                                <Input
                                    id="version"
                                    value={formData.version}
                                    onChange={(e) => handleInputChange('version', e.target.value)}
                                    placeholder="Ex: 14.2, 2.1.0, latest"
                                />
                            </div>

                            <div className="space-y-2">
                                <Label htmlFor="vendor">Fornecedor</Label>
                                <Input
                                    id="vendor"
                                    value={formData.vendor}
                                    onChange={(e) => handleInputChange('vendor', e.target.value)}
                                    placeholder="Ex: Microsoft, Oracle, Open Source"
                                />
                            </div>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                            <div className="space-y-2">
                                <Label htmlFor="licenseType">Tipo de Licença</Label>
                                <Select 
                                    value={formData.licenseType} 
                                    onValueChange={(value) => handleInputChange('licenseType', value)}
                                >
                                    <SelectTrigger>
                                        <SelectValue placeholder="Selecione o tipo" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        {licenseTypes.map((type) => (
                                            <SelectItem key={type} value={type}>
                                                {type}
                                            </SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>
                            </div>

                            <div className="space-y-2">
                                <Label htmlFor="supportLevel">Nível de Suporte</Label>
                                <Select 
                                    value={formData.supportLevel} 
                                    onValueChange={(value) => handleInputChange('supportLevel', value)}
                                >
                                    <SelectTrigger>
                                        <SelectValue placeholder="Selecione o nível" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        {supportLevels.map((level) => (
                                            <SelectItem key={level} value={level}>
                                                {level}
                                            </SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>
                            </div>

                            <div className="space-y-2">
                                <Label htmlFor="deploymentType">Tipo de Deploy</Label>
                                <Select 
                                    value={formData.deploymentType} 
                                    onValueChange={(value) => handleInputChange('deploymentType', value)}
                                >
                                    <SelectTrigger>
                                        <SelectValue placeholder="Selecione o tipo" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        {deploymentTypes.map((type) => (
                                            <SelectItem key={type} value={type}>
                                                {type}
                                            </SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>
                            </div>
                        </div>

                        <div className="space-y-3">
                            <Label>Pontuação de Saúde: {formData.healthScore}%</Label>
                            <Slider
                                value={[formData.healthScore]}
                                onValueChange={(value) => handleInputChange('healthScore', value[0])}
                                max={100}
                                min={0}
                                step={5}
                                className="w-full"
                            />
                            <div className="flex justify-between text-xs text-muted-foreground">
                                <span>Crítico (0%)</span>
                                <span>Ruim (25%)</span>
                                <span>Bom (75%)</span>
                                <span>Excelente (100%)</span>
                            </div>
                            {errors.healthScore && (
                                <p className="text-sm text-destructive">{errors.healthScore}</p>
                            )}
                        </div>

                        <div className="flex justify-end gap-3 pt-4">
                            <Button type="button" variant="outline" onClick={onCancel}>
                                Cancelar
                            </Button>
                            <Button type="submit">
                                {technology ? 'Atualizar Tecnologia' : 'Criar Tecnologia'}
                            </Button>
                        </div>
                    </form>
                </CardContent>
            </Card>
        </div>
    )
}
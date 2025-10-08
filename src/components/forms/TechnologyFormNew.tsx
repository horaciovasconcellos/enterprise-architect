import { useState, useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { toast } from 'sonner'

const API_BASE_URL = 'http://localhost:3001/api'

interface Technology {
    id: string
    name: string
    description?: string
    category?: string
    maturityLevel?: string
    adoptionScore: number
    strategicFit?: string
}

interface TechnologyFormProps {
    technology?: Technology
    isOpen: boolean
    onClose: () => void
    onSuccess: () => void
}

export function TechnologyFormNew({ technology, isOpen, onClose, onSuccess }: TechnologyFormProps) {
    const [formData, setFormData] = useState({
        name: technology?.name || '',
        description: technology?.description || '',
        category: technology?.category || '',
        maturityLevel: technology?.maturityLevel || 'MAINSTREAM',
        adoptionScore: technology?.adoptionScore || 0,
        strategicFit: technology?.strategicFit || 'ADEQUADO'
    })

    // Resetar o formulário quando a tecnologia mudar
    useEffect(() => {
        if (technology) {
            setFormData({
                name: technology.name || '',
                description: technology.description || '',
                category: technology.category || '',
                maturityLevel: technology.maturityLevel || 'MAINSTREAM',
                adoptionScore: technology.adoptionScore || 0,
                strategicFit: technology.strategicFit || 'ADEQUADO'
            })
        } else {
            setFormData({
                name: '',
                description: '',
                category: '',
                maturityLevel: 'MAINSTREAM',
                adoptionScore: 0,
                strategicFit: 'ADEQUADO'
            })
        }
    }, [technology, isOpen])

    const categoryOptions = [
        { value: 'Database', label: 'Banco de Dados' },
        { value: 'Frontend', label: 'Frontend' },
        { value: 'Backend', label: 'Backend' },
        { value: 'Infrastructure', label: 'Infraestrutura' },
        { value: 'DevOps', label: 'DevOps' },
        { value: 'Security', label: 'Segurança' },
        { value: 'Analytics', label: 'Analytics' },
        { value: 'Integration', label: 'Integração' }
    ]

    const maturityLevelOptions = [
        { value: 'EXPERIMENTAL', label: 'Experimental' },
        { value: 'EMERGING', label: 'Emergente' },
        { value: 'MAINSTREAM', label: 'Mainstream' },
        { value: 'LEGACY', label: 'Legacy' }
    ]

    const strategicFitOptions = [
        { value: 'MUITO_RUIM', label: 'Muito Ruim' },
        { value: 'RUIM', label: 'Ruim' },
        { value: 'ADEQUADO', label: 'Adequado' },
        { value: 'BOM', label: 'Bom' },
        { value: 'EXCELENTE', label: 'Excelente' }
    ]

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        
        if (!formData.name.trim()) {
            toast.error('Nome da tecnologia é obrigatório')
            return
        }

        try {
            const technologyData = {
                name: formData.name.trim(),
                description: formData.description.trim() || undefined,
                category: formData.category || undefined,
                maturityLevel: formData.maturityLevel,
                adoptionScore: formData.adoptionScore,
                strategicFit: formData.strategicFit
            }

            let response
            if (technology) {
                response = await fetch(`${API_BASE_URL}/technologies/${technology.id}`, {
                    method: 'PUT',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify(technologyData),
                })
            } else {
                response = await fetch(`${API_BASE_URL}/technologies`, {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify(technologyData),
                })
            }

            if (!response.ok) {
                throw new Error(technology ? 'Erro ao atualizar tecnologia' : 'Erro ao criar tecnologia')
            }

            toast.success(technology ? 'Tecnologia atualizada com sucesso' : 'Tecnologia criada com sucesso')
            onSuccess()
            onClose()
        } catch (error) {
            toast.error(technology ? 'Erro ao atualizar tecnologia' : 'Erro ao criar tecnologia')
            console.error('Erro no formulário de tecnologia:', error)
        }
    }

    const handleInputChange = (field: string, value: any) => {
        setFormData(prev => ({ ...prev, [field]: value }))
    }

    return (
        <Dialog open={isOpen} onOpenChange={onClose}>
            <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
                <DialogHeader>
                    <DialogTitle>
                        {technology ? 'Editar Tecnologia' : 'Nova Tecnologia'}
                    </DialogTitle>
                </DialogHeader>
                
                <form onSubmit={handleSubmit} className="space-y-6">
                    <div className="space-y-4">
                        <div className="space-y-2">
                            <Label htmlFor="name">Nome da Tecnologia *</Label>
                            <Input
                                id="name"
                                value={formData.name}
                                onChange={(e) => handleInputChange('name', e.target.value)}
                                placeholder="Ex: PostgreSQL, React, AWS Lambda"
                                required
                            />
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="description">Descrição</Label>
                            <Textarea
                                id="description"
                                value={formData.description}
                                onChange={(e) => handleInputChange('description', e.target.value)}
                                placeholder="Descreva o propósito e características da tecnologia..."
                                rows={3}
                            />
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div className="space-y-2">
                                <Label htmlFor="category">Categoria</Label>
                                <Select value={formData.category} onValueChange={(value) => handleInputChange('category', value)}>
                                    <SelectTrigger>
                                        <SelectValue placeholder="Selecione uma categoria" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        {categoryOptions.map((option) => (
                                            <SelectItem key={option.value} value={option.value}>
                                                {option.label}
                                            </SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>
                            </div>

                            <div className="space-y-2">
                                <Label htmlFor="maturityLevel">Nível de Maturidade</Label>
                                <Select value={formData.maturityLevel} onValueChange={(value) => handleInputChange('maturityLevel', value)}>
                                    <SelectTrigger>
                                        <SelectValue />
                                    </SelectTrigger>
                                    <SelectContent>
                                        {maturityLevelOptions.map((option) => (
                                            <SelectItem key={option.value} value={option.value}>
                                                {option.label}
                                            </SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>
                            </div>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div className="space-y-2">
                                <Label htmlFor="adoptionScore">Pontuação de Adoção (0-100)</Label>
                                <Input
                                    id="adoptionScore"
                                    type="number"
                                    min="0"
                                    max="100"
                                    value={formData.adoptionScore}
                                    onChange={(e) => handleInputChange('adoptionScore', parseInt(e.target.value) || 0)}
                                    placeholder="0-100"
                                />
                            </div>

                            <div className="space-y-2">
                                <Label htmlFor="strategicFit">Adequação Estratégica</Label>
                                <Select value={formData.strategicFit} onValueChange={(value) => handleInputChange('strategicFit', value)}>
                                    <SelectTrigger>
                                        <SelectValue />
                                    </SelectTrigger>
                                    <SelectContent>
                                        {strategicFitOptions.map((option) => (
                                            <SelectItem key={option.value} value={option.value}>
                                                {option.label}
                                            </SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>
                            </div>
                        </div>
                    </div>

                    <div className="flex gap-3 pt-4">
                        <Button type="submit" className="flex-1">
                            {technology ? 'Atualizar' : 'Criar'} Tecnologia
                        </Button>
                        <Button type="button" variant="outline" onClick={onClose}>
                            Cancelar
                        </Button>
                    </div>
                </form>
            </DialogContent>
        </Dialog>
    )
}
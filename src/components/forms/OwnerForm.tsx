import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { toast } from 'sonner'
import { useOwners } from '@/hooks/useDatabase'

export interface Owner {
    id: string
    matricula: string
    nome: string
    area: string
    createdAt?: string
    updatedAt?: string
}

interface OwnerFormProps {
    owner?: Owner
    onSubmit?: (owner: Owner) => void
    onCancel?: () => void
}

export function OwnerForm({ owner, onSubmit, onCancel }: OwnerFormProps) {
    const { owners, createOwner, updateOwner } = useOwners()
    const [formData, setFormData] = useState({
        matricula: owner?.matricula || '',
        nome: owner?.nome || '',
        area: owner?.area || ''
    })

    const areas = [
        'Tecnologia da Informação',
        'Recursos Humanos',
        'Financeiro',
        'Marketing',
        'Vendas',
        'Operações',
        'Jurídico',
        'Compliance',
        'Estratégia',
        'Produto'
    ]

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        
        if (!formData.matricula || !formData.nome || !formData.area) {
            toast.error('Todos os campos são obrigatórios')
            return
        }

        // Check for duplicate matricula
        const existingOwner = owners?.find(o => o.matricula === formData.matricula && o.id !== owner?.id)
        if (existingOwner) {
            toast.error('Já existe um proprietário com esta matrícula')
            return
        }

        try {
            const ownerData = {
                matricula: formData.matricula,
                nome: formData.nome,
                area: formData.area
            }

            let result: Owner
            if (owner) {
                // Update existing
                result = await updateOwner(owner.id, ownerData)
                toast.success('Proprietário atualizado com sucesso')
            } else {
                // Add new
                result = await createOwner(ownerData)
                toast.success('Proprietário criado com sucesso')
            }

            onSubmit?.(result)
        } catch (error) {
            toast.error(owner ? 'Erro ao atualizar proprietário' : 'Erro ao criar proprietário')
            console.error('Erro no formulário de proprietário:', error)
        }
    }

    const handleInputChange = (field: string, value: string) => {
        setFormData(prev => ({ ...prev, [field]: value }))
    }

    return (
        <Card className="w-full max-w-2xl mx-auto">
            <CardHeader>
                <CardTitle className="text-xl font-semibold">
                    {owner ? 'Editar Proprietário' : 'Novo Proprietário'}
                </CardTitle>
            </CardHeader>
            <CardContent>
                <form onSubmit={handleSubmit} className="space-y-6">
                    <div className="space-y-2">
                        <Label htmlFor="matricula">Matrícula *</Label>
                        <Input
                            id="matricula"
                            value={formData.matricula}
                            onChange={(e) => handleInputChange('matricula', e.target.value)}
                            placeholder="Ex: 12345"
                            required
                        />
                    </div>

                    <div className="space-y-2">
                        <Label htmlFor="nome">Nome Completo *</Label>
                        <Input
                            id="nome"
                            value={formData.nome}
                            onChange={(e) => handleInputChange('nome', e.target.value)}
                            placeholder="Ex: João Silva"
                            required
                        />
                    </div>

                    <div className="space-y-2">
                        <Label htmlFor="area">Área *</Label>
                        <Select value={formData.area} onValueChange={(value) => handleInputChange('area', value)}>
                            <SelectTrigger>
                                <SelectValue placeholder="Selecione uma área" />
                            </SelectTrigger>
                            <SelectContent>
                                {areas.map(area => (
                                    <SelectItem key={area} value={area}>
                                        {area}
                                    </SelectItem>
                                ))}
                            </SelectContent>
                        </Select>
                    </div>

                    <div className="flex gap-3 pt-4">
                        <Button type="submit" className="flex-1">
                            {owner ? 'Atualizar' : 'Criar'} Proprietário
                        </Button>
                        {onCancel && (
                            <Button type="button" variant="outline" onClick={onCancel}>
                                Cancelar
                            </Button>
                        )}
                    </div>
                </form>
            </CardContent>
        </Card>
    )
}
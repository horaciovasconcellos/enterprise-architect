import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { toast } from 'sonner'
import { useCapabilities } from '@/hooks/useDatabase'

interface Capability {
    id: string
    name: string
    description?: string
    criticality: string
    coverageScore: number
    parentId?: string
}

interface CapabilityFormProps {
    capability?: Capability
    isOpen: boolean
    onClose: () => void
    onSuccess: () => void
}

export function CapabilityForm({ capability, isOpen, onClose, onSuccess }: CapabilityFormProps) {
    const { capabilities, createCapability, updateCapability } = useCapabilities()
    const [formData, setFormData] = useState({
        name: capability?.name || '',
        description: capability?.description || '',
        criticality: capability?.criticality || 'MÉDIA',
        coverageScore: capability?.coverageScore || 0,
        parentId: capability?.parentId || ''
    })

    const criticalityOptions = [
        { value: 'BAIXA', label: 'Baixa' },
        { value: 'MÉDIA', label: 'Média' },
        { value: 'ALTA', label: 'Alta' },
        { value: 'CRÍTICA', label: 'Crítica' }
    ]

    // Filter possible parents (exclude self if editing)
    const possibleParents = (capabilities || []).filter(cap => 
        cap.id !== capability?.id
    )

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        
        if (!formData.name.trim()) {
            toast.error('Nome da capacidade é obrigatório')
            return
        }

        try {
            const capabilityData = {
                name: formData.name.trim(),
                description: formData.description.trim() || undefined,
                criticality: formData.criticality,
                coverageScore: formData.coverageScore,
                parentId: formData.parentId || undefined
            }

            if (capability) {
                await updateCapability(capability.id, capabilityData)
                toast.success('Capacidade atualizada com sucesso')
            } else {
                await createCapability(capabilityData)
                toast.success('Capacidade criada com sucesso')
            }

            onSuccess()
            onClose()
        } catch (error) {
            toast.error(capability ? 'Erro ao atualizar capacidade' : 'Erro ao criar capacidade')
            console.error('Erro no formulário de capacidade:', error)
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
                        {capability ? 'Editar Capacidade' : 'Nova Capacidade de Negócio'}
                    </DialogTitle>
                </DialogHeader>
                
                <form onSubmit={handleSubmit} className="space-y-6">
                    <div className="space-y-4">
                        <div className="space-y-2">
                            <Label htmlFor="name">Nome da Capacidade *</Label>
                            <Input
                                id="name"
                                value={formData.name}
                                onChange={(e) => handleInputChange('name', e.target.value)}
                                placeholder="Ex: Gestão de Relacionamento com Cliente"
                                required
                            />
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="description">Descrição</Label>
                            <Textarea
                                id="description"
                                value={formData.description}
                                onChange={(e) => handleInputChange('description', e.target.value)}
                                placeholder="Descreva o que esta capacidade permite à organização fazer..."
                                rows={3}
                            />
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div className="space-y-2">
                                <Label htmlFor="criticality">Criticidade</Label>
                                <Select value={formData.criticality} onValueChange={(value) => handleInputChange('criticality', value)}>
                                    <SelectTrigger>
                                        <SelectValue />
                                    </SelectTrigger>
                                    <SelectContent>
                                        {criticalityOptions.map((option) => (
                                            <SelectItem key={option.value} value={option.value}>
                                                {option.label}
                                            </SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>
                            </div>

                            <div className="space-y-2">
                                <Label htmlFor="coverageScore">Pontuação de Cobertura (%)</Label>
                                <Input
                                    id="coverageScore"
                                    type="number"
                                    min="0"
                                    max="100"
                                    value={formData.coverageScore}
                                    onChange={(e) => handleInputChange('coverageScore', parseInt(e.target.value) || 0)}
                                    placeholder="0-100"
                                />
                            </div>
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="parentId">Capacidade Pai (Opcional)</Label>
                            <Select value={formData.parentId} onValueChange={(value) => handleInputChange('parentId', value === 'none' ? '' : value)}>
                                <SelectTrigger>
                                    <SelectValue placeholder="Selecione uma capacidade pai" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="none">Nenhuma (Nível Superior)</SelectItem>
                                    {possibleParents.map((parent) => (
                                        <SelectItem key={parent.id} value={parent.id}>
                                            {parent.name}
                                        </SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                        </div>
                    </div>

                    <div className="flex gap-3 pt-4">
                        <Button type="submit" className="flex-1">
                            {capability ? 'Atualizar' : 'Criar'} Capacidade
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
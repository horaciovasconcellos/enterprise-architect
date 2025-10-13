import { useState, useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { toast } from 'sonner'
import { useApplications } from '@/hooks/useDatabase'

const API_BASE_URL = 'http://localhost:3001/api'

interface Interface {
    id: string
    sourceApp: string
    targetApp: string
    interfaceType: string
    frequency: string
    description?: string
}

interface InterfaceFormProps {
    interface?: Interface
    isOpen: boolean
    onClose: () => void
    onSuccess: () => void
}

export function InterfaceFormSimple({ interface: interfaceData, isOpen, onClose, onSuccess }: InterfaceFormProps) {
    const { applications } = useApplications()
    const [formData, setFormData] = useState({
        sourceApp: '',
        targetApp: '',
        interfaceType: 'API_REST',
        frequency: 'DIARIO',
        description: ''
    })

    // Resetar o formulário quando a interface mudar
    useEffect(() => {
        if (interfaceData) {
            setFormData({
                sourceApp: interfaceData.sourceApp || '',
                targetApp: interfaceData.targetApp || '',
                interfaceType: interfaceData.interfaceType || 'API_REST',
                frequency: interfaceData.frequency || 'DIARIO',
                description: interfaceData.description || ''
            })
        } else {
            setFormData({
                sourceApp: '',
                targetApp: '',
                interfaceType: 'API_REST',
                frequency: 'DIARIO',
                description: ''
            })
        }
    }, [interfaceData, isOpen])

    const interfaceTypeOptions = [
        { value: 'API_REST', label: 'API REST' },
        { value: 'API_SOAP', label: 'API SOAP' },
        { value: 'ARQUIVO_BATCH', label: 'Arquivo Batch' },
        { value: 'MENSAGERIA', label: 'Mensageria' },
        { value: 'BANCO_DADOS', label: 'Banco de Dados' },
        { value: 'WEBHOOK', label: 'Webhook' }
    ]

    const frequencyOptions = [
        { value: 'TEMPO_REAL', label: 'Tempo Real' },
        { value: 'HORARIO', label: 'Horário' },
        { value: 'DIARIO', label: 'Diário' },
        { value: 'SEMANAL', label: 'Semanal' },
        { value: 'MENSAL', label: 'Mensal' },
        { value: 'SOB_DEMANDA', label: 'Sob Demanda' }
    ]

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        
        if (!formData.sourceApp.trim() || !formData.targetApp.trim()) {
            toast.error('Aplicação de origem e destino são obrigatórias')
            return
        }

        try {
            const interfacePayload = {
                sourceApp: formData.sourceApp.trim(),
                targetApp: formData.targetApp.trim(),
                interfaceType: formData.interfaceType,
                frequency: formData.frequency,
                description: formData.description.trim() || undefined
            }

            let response
            if (interfaceData) {
                response = await fetch(`${API_BASE_URL}/interfaces/${interfaceData.id}`, {
                    method: 'PUT',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify(interfacePayload),
                })
            } else {
                response = await fetch(`${API_BASE_URL}/interfaces`, {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify(interfacePayload),
                })
            }

            if (!response.ok) {
                throw new Error(interfaceData ? 'Erro ao atualizar interface' : 'Erro ao criar interface')
            }

            toast.success(interfaceData ? 'Interface atualizada com sucesso' : 'Interface criada com sucesso')
            onSuccess()
            onClose()
        } catch (error) {
            toast.error(interfaceData ? 'Erro ao atualizar interface' : 'Erro ao criar interface')
            console.error('Erro no formulário de interface:', error)
        }
    }

    const handleInputChange = (field: string, value: any) => {
        setFormData(prev => ({ ...prev, [field]: value }))
    }

    return (
        <Dialog open={isOpen} onOpenChange={onClose}>
            <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
                <DialogHeader>
                    <DialogTitle>
                        {interfaceData ? 'Editar Interface' : 'Nova Interface de Sistema'}
                    </DialogTitle>
                </DialogHeader>
                
                <form onSubmit={handleSubmit} className="space-y-6">
                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                        <div className="lg:col-span-2 space-y-6">
                            <Card>
                                <CardHeader>
                                    <CardTitle>Informações Básicas</CardTitle>
                                </CardHeader>
                                <CardContent className="space-y-4">
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                        <div className="space-y-2">
                                            <Label htmlFor="sourceApp">Aplicação de Origem *</Label>
                                            <Select value={formData.sourceApp} onValueChange={(value) => handleInputChange('sourceApp', value)} required>
                                                <SelectTrigger>
                                                    <SelectValue placeholder="Selecione a aplicação de origem" />
                                                </SelectTrigger>
                                                <SelectContent>
                                                    {(applications || []).map((app) => (
                                                        <SelectItem key={app.id} value={app.name}>
                                                            {app.name}
                                                        </SelectItem>
                                                    ))}
                                                    <SelectItem value="Sistema Externo">Sistema Externo</SelectItem>
                                                    <SelectItem value="Processo Manual">Processo Manual</SelectItem>
                                                </SelectContent>
                                            </Select>
                                        </div>

                                        <div className="space-y-2">
                                            <Label htmlFor="targetApp">Aplicação de Destino *</Label>
                                            <Select value={formData.targetApp} onValueChange={(value) => handleInputChange('targetApp', value)} required>
                                                <SelectTrigger>
                                                    <SelectValue placeholder="Selecione a aplicação de destino" />
                                                </SelectTrigger>
                                                <SelectContent>
                                                    {(applications || []).map((app) => (
                                                        <SelectItem key={app.id} value={app.name}>
                                                            {app.name}
                                                        </SelectItem>
                                                    ))}
                                                    <SelectItem value="Sistema Externo">Sistema Externo</SelectItem>
                                                    <SelectItem value="Processo Manual">Processo Manual</SelectItem>
                                                </SelectContent>
                                            </Select>
                                        </div>
                                    </div>

                                    <div className="space-y-2">
                                        <Label htmlFor="description">Descrição</Label>
                                        <Textarea
                                            id="description"
                                            value={formData.description}
                                            onChange={(e) => handleInputChange('description', e.target.value)}
                                            placeholder="Descreva o propósito e funcionamento da interface..."
                                            rows={3}
                                        />
                                    </div>
                                </CardContent>
                            </Card>

                            <Card>
                                <CardHeader>
                                    <CardTitle>Configurações Técnicas</CardTitle>
                                </CardHeader>
                                <CardContent className="space-y-4">
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                        <div className="space-y-2">
                                            <Label htmlFor="interfaceType">Tipo de Interface</Label>
                                            <Select value={formData.interfaceType} onValueChange={(value) => handleInputChange('interfaceType', value)}>
                                                <SelectTrigger>
                                                    <SelectValue />
                                                </SelectTrigger>
                                                <SelectContent>
                                                    {interfaceTypeOptions.map((option) => (
                                                        <SelectItem key={option.value} value={option.value}>
                                                            {option.label}
                                                        </SelectItem>
                                                    ))}
                                                </SelectContent>
                                            </Select>
                                        </div>

                                        <div className="space-y-2">
                                            <Label htmlFor="frequency">Frequência de Execução</Label>
                                            <Select value={formData.frequency} onValueChange={(value) => handleInputChange('frequency', value)}>
                                                <SelectTrigger>
                                                    <SelectValue />
                                                </SelectTrigger>
                                                <SelectContent>
                                                    {frequencyOptions.map((option) => (
                                                        <SelectItem key={option.value} value={option.value}>
                                                            {option.label}
                                                        </SelectItem>
                                                    ))}
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
                                    <CardTitle>Resumo da Interface</CardTitle>
                                </CardHeader>
                                <CardContent className="space-y-3 text-sm">
                                    <div className="flex justify-between">
                                        <span className="text-muted-foreground">Origem</span>
                                        <span className="font-medium">{formData.sourceApp || 'Não selecionada'}</span>
                                    </div>
                                    <div className="flex justify-between">
                                        <span className="text-muted-foreground">Destino</span>
                                        <span className="font-medium">{formData.targetApp || 'Não selecionada'}</span>
                                    </div>
                                    <div className="flex justify-between">
                                        <span className="text-muted-foreground">Tipo</span>
                                        <span className="font-medium">
                                            {interfaceTypeOptions.find(opt => opt.value === formData.interfaceType)?.label}
                                        </span>
                                    </div>
                                    <div className="flex justify-between">
                                        <span className="text-muted-foreground">Frequência</span>
                                        <span className="font-medium">
                                            {frequencyOptions.find(opt => opt.value === formData.frequency)?.label}
                                        </span>
                                    </div>
                                </CardContent>
                            </Card>

                            <div className="flex flex-col gap-2">
                                <Button type="submit" className="gap-2">
                                    {interfaceData ? 'Atualizar' : 'Criar'} Interface
                                </Button>
                                <Button type="button" variant="outline" onClick={onClose}>
                                    Cancelar
                                </Button>
                            </div>
                        </div>
                    </div>
                </form>
            </DialogContent>
        </Dialog>
    )
}
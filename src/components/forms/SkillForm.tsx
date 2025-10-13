import { useState } from 'react'
import { useOwners, useTechnologies } from '@/hooks/useDatabase'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { ArrowLeft, FloppyDisk, X, Plus } from '@phosphor-icons/react'

interface SkillTechnology {
    technologyId: string
    proficiencyLevel: number
    startDate: string
    endDate: string
}

interface SkillDeveloper {
    ownerId: string
    proficiencyLevel: number
    certificationDate: string
    notes: string
}

interface Skill {
    id: string
    name: string
    code: string
    description?: string
    guidanceNotes?: string
    levelDescription?: string
    technologies?: SkillTechnology[]
    developers?: SkillDeveloper[]
}

interface SkillFormProps {
    skill?: Skill | null
    onSave: (data: Omit<Skill, 'id'>) => void
    onCancel: () => void
}

const proficiencyLevels = [
    { value: 0, label: '0 - Sem conhecimento do assunto' },
    { value: 1, label: '1 - Conhecimento superficial do assunto' },
    { value: 2, label: '2 - Conhecimento fundamentado do assunto' },
    { value: 3, label: '3 - Conhecimento dos elementos e suas relações' },
    { value: 4, label: '4 - Conhecimento argumentativo, crítico e conclusivo' },
    { value: 5, label: '5 - Conhecimento amplo e profundo sobre o assunto' }
]

export function SkillForm({ skill, onSave, onCancel }: SkillFormProps) {
    const { owners } = useOwners()
    const { technologies } = useTechnologies()
    
    const [formData, setFormData] = useState({
        name: skill?.name || '',
        code: skill?.code || '',
        description: skill?.description || '',
        guidanceNotes: skill?.guidanceNotes || '',
        levelDescription: skill?.levelDescription || 'Nível 0: Sem conhecimento\nNível 1: Conhecimento superficial\nNível 2: Conhecimento fundamentado\nNível 3: Conhecimento relacional\nNível 4: Conhecimento crítico\nNível 5: Conhecimento amplo e profundo',
        technologies: skill?.technologies || [],
        developers: skill?.developers || []
    })

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault()
        console.log('📤 Enviando dados do formulário:', {
            ...formData,
            technologiesCount: formData.technologies.length,
            developersCount: formData.developers.length
        })
        onSave(formData)
    }

    const updateField = (field: string, value: any) => {
        setFormData(prev => ({ ...prev, [field]: value }))
    }

    // Tecnologias
    const addTechnology = () => {
        setFormData(prev => ({
            ...prev,
            technologies: [...prev.technologies, {
                technologyId: '',
                proficiencyLevel: 0,
                startDate: '',
                endDate: ''
            }]
        }))
    }

    const updateTechnology = (index: number, field: keyof SkillTechnology, value: string | number) => {
        setFormData(prev => ({
            ...prev,
            technologies: prev.technologies.map((tech, i) => 
                i === index ? { ...tech, [field]: value } : tech
            )
        }))
    }

    const removeTechnology = (index: number) => {
        setFormData(prev => ({
            ...prev,
            technologies: prev.technologies.filter((_, i) => i !== index)
        }))
    }

    // Desenvolvedores
    const addDeveloper = () => {
        setFormData(prev => ({
            ...prev,
            developers: [...prev.developers, {
                ownerId: '',
                proficiencyLevel: 0,
                certificationDate: '',
                notes: ''
            }]
        }))
    }

    const updateDeveloper = (index: number, field: keyof SkillDeveloper, value: string | number) => {
        setFormData(prev => ({
            ...prev,
            developers: prev.developers.map((dev, i) => 
                i === index ? { ...dev, [field]: value } : dev
            )
        }))
    }

    const removeDeveloper = (index: number) => {
        setFormData(prev => ({
            ...prev,
            developers: prev.developers.filter((_, i) => i !== index)
        }))
    }

    return (
        <div className="space-y-6">
            <div className="flex items-center gap-4">
                <Button variant="ghost" size="sm" onClick={onCancel}>
                    <ArrowLeft size={16} />
                </Button>
                <div>
                    <h1 className="text-3xl font-bold text-foreground">
                        {skill ? 'Editar Habilidade' : 'Nova Habilidade'}
                    </h1>
                    <p className="text-muted-foreground">
                        {skill ? 'Atualize as informações da habilidade' : 'Adicione uma nova habilidade ao sistema'}
                    </p>
                </div>
            </div>

            <form onSubmit={handleSubmit}>
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                    <div className="lg:col-span-2 space-y-6">
                        {/* Informações Básicas */}
                        <Card>
                            <CardHeader>
                                <CardTitle>Informações Básicas</CardTitle>
                            </CardHeader>
                            <CardContent className="space-y-4">
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    <div>
                                        <Label htmlFor="name">Nome da Habilidade *</Label>
                                        <Input
                                            id="name"
                                            value={formData.name}
                                            onChange={(e) => updateField('name', e.target.value)}
                                            placeholder="ex: Desenvolvimento Backend"
                                            required
                                        />
                                    </div>
                                    
                                    <div>
                                        <Label htmlFor="code">Código da Habilidade *</Label>
                                        <Input
                                            id="code"
                                            value={formData.code}
                                            onChange={(e) => updateField('code', e.target.value)}
                                            placeholder="ex: DEV-BACK-001"
                                            required
                                        />
                                    </div>
                                </div>

                                <div>
                                    <Label htmlFor="description">Descrição da Habilidade</Label>
                                    <Textarea
                                        id="description"
                                        value={formData.description}
                                        onChange={(e) => updateField('description', e.target.value)}
                                        placeholder="Descreva o objetivo e contexto desta habilidade..."
                                        rows={3}
                                    />
                                </div>

                                <div>
                                    <Label htmlFor="guidanceNotes">Notas de Orientação</Label>
                                    <Textarea
                                        id="guidanceNotes"
                                        value={formData.guidanceNotes}
                                        onChange={(e) => updateField('guidanceNotes', e.target.value)}
                                        placeholder="Orientações sobre como desenvolver ou avaliar esta habilidade..."
                                        rows={3}
                                    />
                                </div>

                                <div>
                                    <Label htmlFor="levelDescription">Descrição dos Níveis</Label>
                                    <Textarea
                                        id="levelDescription"
                                        value={formData.levelDescription}
                                        onChange={(e) => updateField('levelDescription', e.target.value)}
                                        placeholder="Descreva o que significa cada nível de proficiência..."
                                        rows={6}
                                    />
                                    <p className="text-xs text-muted-foreground mt-1">
                                        Descreva os critérios para cada nível de 0 a 5
                                    </p>
                                </div>
                            </CardContent>
                        </Card>

                        {/* Tecnologias Associadas */}
                        <Card>
                            <CardHeader>
                                <CardTitle>Tecnologias Associadas</CardTitle>
                            </CardHeader>
                            <CardContent className="space-y-3">
                                <div className="flex items-center justify-between">
                                    <Label>Tecnologias</Label>
                                    <Button type="button" variant="outline" size="sm" onClick={addTechnology} className="gap-2">
                                        <Plus size={16} />
                                        Adicionar Tecnologia
                                    </Button>
                                </div>
                                
                                {formData.technologies.length === 0 ? (
                                    <div className="text-center py-4 border rounded-lg bg-muted/30">
                                        <p className="text-sm text-muted-foreground italic">
                                            Nenhuma tecnologia associada. Clique em "Adicionar Tecnologia" para incluir.
                                        </p>
                                    </div>
                                ) : (
                                    <div className="overflow-x-auto border rounded-lg">
                                        <table className="w-full">
                                            <thead>
                                                <tr className="border-b bg-muted/50">
                                                    <th className="text-left py-3 px-4 font-medium text-sm">Tecnologia</th>
                                                    <th className="text-left py-3 px-4 font-medium text-sm">Nível</th>
                                                    <th className="text-left py-3 px-4 font-medium text-sm">Data Início</th>
                                                    <th className="text-left py-3 px-4 font-medium text-sm">Data Término</th>
                                                    <th className="text-center py-3 px-4 font-medium text-sm w-20">Ações</th>
                                                </tr>
                                            </thead>
                                            <tbody>
                                                {formData.technologies.map((tech, index) => (
                                                    <tr key={index} className="border-b last:border-0 hover:bg-muted/30">
                                                        <td className="py-2 px-4">
                                                            <Select 
                                                                value={tech.technologyId} 
                                                                onValueChange={(value) => updateTechnology(index, 'technologyId', value)}
                                                            >
                                                                <SelectTrigger className="h-9">
                                                                    <SelectValue placeholder="Selecione..." />
                                                                </SelectTrigger>
                                                                <SelectContent>
                                                                    {(technologies || []).map(t => (
                                                                        <SelectItem key={t.id} value={t.id}>
                                                                            {t.name}{t.version ? ` - ${t.version}` : ' - Todas'}
                                                                        </SelectItem>
                                                                    ))}
                                                                </SelectContent>
                                                            </Select>
                                                        </td>
                                                        <td className="py-2 px-4">
                                                            <Select 
                                                                value={tech.proficiencyLevel.toString()} 
                                                                onValueChange={(value) => updateTechnology(index, 'proficiencyLevel', Number(value))}
                                                            >
                                                                <SelectTrigger className="h-9">
                                                                    <SelectValue />
                                                                </SelectTrigger>
                                                                <SelectContent>
                                                                    {proficiencyLevels.map(level => (
                                                                        <SelectItem key={level.value} value={level.value.toString()}>
                                                                            {level.label}
                                                                        </SelectItem>
                                                                    ))}
                                                                </SelectContent>
                                                            </Select>
                                                        </td>
                                                        <td className="py-2 px-4">
                                                            <Input
                                                                type="date"
                                                                value={tech.startDate}
                                                                onChange={(e) => updateTechnology(index, 'startDate', e.target.value)}
                                                                className="h-9"
                                                            />
                                                        </td>
                                                        <td className="py-2 px-4">
                                                            <Input
                                                                type="date"
                                                                value={tech.endDate}
                                                                onChange={(e) => updateTechnology(index, 'endDate', e.target.value)}
                                                                className="h-9"
                                                            />
                                                        </td>
                                                        <td className="py-2 px-4 text-center">
                                                            <Button
                                                                type="button"
                                                                variant="ghost"
                                                                size="sm"
                                                                onClick={() => removeTechnology(index)}
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
                            </CardContent>
                        </Card>

                        {/* Desenvolvedores Associados */}
                        <Card>
                            <CardHeader>
                                <CardTitle>Desenvolvedores Associados</CardTitle>
                            </CardHeader>
                            <CardContent className="space-y-3">
                                <div className="flex items-center justify-between">
                                    <Label>Desenvolvedores</Label>
                                    <Button type="button" variant="outline" size="sm" onClick={addDeveloper} className="gap-2">
                                        <Plus size={16} />
                                        Adicionar Desenvolvedor
                                    </Button>
                                </div>
                                
                                {formData.developers.length === 0 ? (
                                    <div className="text-center py-4 border rounded-lg bg-muted/30">
                                        <p className="text-sm text-muted-foreground italic">
                                            Nenhum desenvolvedor associado. Clique em "Adicionar Desenvolvedor" para incluir.
                                        </p>
                                    </div>
                                ) : (
                                    <div className="overflow-x-auto border rounded-lg">
                                        <table className="w-full">
                                            <thead>
                                                <tr className="border-b bg-muted/50">
                                                    <th className="text-left py-3 px-4 font-medium text-sm">Desenvolvedor</th>
                                                    <th className="text-left py-3 px-4 font-medium text-sm">Nível</th>
                                                    <th className="text-left py-3 px-4 font-medium text-sm">Data Certificação</th>
                                                    <th className="text-left py-3 px-4 font-medium text-sm">Notas</th>
                                                    <th className="text-center py-3 px-4 font-medium text-sm w-20">Ações</th>
                                                </tr>
                                            </thead>
                                            <tbody>
                                                {formData.developers.map((dev, index) => (
                                                    <tr key={index} className="border-b last:border-0 hover:bg-muted/30">
                                                        <td className="py-2 px-4">
                                                            <Select 
                                                                value={dev.ownerId} 
                                                                onValueChange={(value) => updateDeveloper(index, 'ownerId', value)}
                                                            >
                                                                <SelectTrigger className="h-9">
                                                                    <SelectValue placeholder="Selecione..." />
                                                                </SelectTrigger>
                                                                <SelectContent>
                                                                    {(owners || []).map(owner => (
                                                                        <SelectItem key={owner.id} value={owner.id}>
                                                                            {owner.nome} - {owner.area}
                                                                        </SelectItem>
                                                                    ))}
                                                                </SelectContent>
                                                            </Select>
                                                        </td>
                                                        <td className="py-2 px-4">
                                                            <Select 
                                                                value={dev.proficiencyLevel.toString()} 
                                                                onValueChange={(value) => updateDeveloper(index, 'proficiencyLevel', Number(value))}
                                                            >
                                                                <SelectTrigger className="h-9">
                                                                    <SelectValue />
                                                                </SelectTrigger>
                                                                <SelectContent>
                                                                    {proficiencyLevels.map(level => (
                                                                        <SelectItem key={level.value} value={level.value.toString()}>
                                                                            {level.label}
                                                                        </SelectItem>
                                                                    ))}
                                                                </SelectContent>
                                                            </Select>
                                                        </td>
                                                        <td className="py-2 px-4">
                                                            <Input
                                                                type="date"
                                                                value={dev.certificationDate}
                                                                onChange={(e) => updateDeveloper(index, 'certificationDate', e.target.value)}
                                                                className="h-9"
                                                            />
                                                        </td>
                                                        <td className="py-2 px-4">
                                                            <Input
                                                                value={dev.notes}
                                                                onChange={(e) => updateDeveloper(index, 'notes', e.target.value)}
                                                                placeholder="Observações..."
                                                                className="h-9"
                                                            />
                                                        </td>
                                                        <td className="py-2 px-4 text-center">
                                                            <Button
                                                                type="button"
                                                                variant="ghost"
                                                                size="sm"
                                                                onClick={() => removeDeveloper(index)}
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
                            </CardContent>
                        </Card>
                    </div>

                    {/* Sidebar */}
                    <div className="space-y-6">
                        <Card>
                            <CardHeader>
                                <CardTitle>Níveis de Proficiência</CardTitle>
                            </CardHeader>
                            <CardContent className="space-y-2">
                                {proficiencyLevels.map(level => (
                                    <div key={level.value} className="text-sm">
                                        <span className="font-semibold">{level.value}:</span> {level.label.split(' - ')[1]}
                                    </div>
                                ))}
                            </CardContent>
                        </Card>

                        <div className="flex flex-col gap-2">
                            <Button type="submit" className="gap-2">
                                <FloppyDisk size={16} />
                                {skill ? 'Atualizar Habilidade' : 'Criar Habilidade'}
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

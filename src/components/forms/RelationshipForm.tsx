import { useState } from 'react'
import { useKV } from '@github/spark/hooks'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Label } from '@/components/ui/label'
import { toast } from 'sonner'
import { Link, UserCheck, Code } from '@phosphor-icons/react'
import type { Owner } from './OwnerForm'

interface Application {
    id: string
    name: string
}

interface Relationship {
    id: string
    type: 'owner' | 'developer'
    ownerId: string
    applicationId: string
    createdAt: string
}

interface RelationshipFormProps {
    onSuccess?: () => void
}

export function RelationshipForm({ onSuccess }: RelationshipFormProps) {
    const [owners] = useKV<Owner[]>('owners', [])
    const [applications] = useKV<Application[]>('applications', [])
    const [relationships, setRelationships] = useKV<Relationship[]>('relationships', [])
    
    const [selectedOwner, setSelectedOwner] = useState('')
    const [selectedApplication, setSelectedApplication] = useState('')
    const [relationshipType, setRelationshipType] = useState<'owner' | 'developer'>('owner')

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault()
        
        if (!selectedOwner || !selectedApplication) {
            toast.error('Selecione um proprietário e uma aplicação')
            return
        }

        // Check if relationship already exists
        const existingRelationship = (relationships || []).find(r => 
            r.ownerId === selectedOwner && 
            r.applicationId === selectedApplication && 
            r.type === relationshipType
        )

        if (existingRelationship) {
            toast.error('Esta associação já existe')
            return
        }

        const newRelationship: Relationship = {
            id: `rel-${Date.now()}`,
            type: relationshipType,
            ownerId: selectedOwner,
            applicationId: selectedApplication,
            createdAt: new Date().toISOString()
        }

        setRelationships(currentRels => [...(currentRels || []), newRelationship])
        
        const owner = (owners || []).find(o => o.id === selectedOwner)
        const app = (applications || []).find(a => a.id === selectedApplication)
        const typeLabel = relationshipType === 'owner' ? 'proprietário' : 'desenvolvedor'
        
        toast.success(`Associação criada: ${owner?.nome} como ${typeLabel} de ${app?.name}`)
        
        // Reset form
        setSelectedOwner('')
        setSelectedApplication('')
        setRelationshipType('owner')
        
        onSuccess?.()
    }

    return (
        <Card className="w-full max-w-2xl mx-auto">
            <CardHeader>
                <CardTitle className="flex items-center gap-2">
                    <Link size={20} />
                    Nova Associação
                </CardTitle>
            </CardHeader>
            <CardContent>
                <form onSubmit={handleSubmit} className="space-y-6">
                    <div className="space-y-2">
                        <Label>Tipo de Associação</Label>
                        <Select value={relationshipType} onValueChange={(value: 'owner' | 'developer') => setRelationshipType(value)}>
                            <SelectTrigger>
                                <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="owner">
                                    <div className="flex items-center gap-2">
                                        <UserCheck size={16} />
                                        Proprietário (Dono)
                                    </div>
                                </SelectItem>
                                <SelectItem value="developer">
                                    <div className="flex items-center gap-2">
                                        <Code size={16} />
                                        Desenvolvedor
                                    </div>
                                </SelectItem>
                            </SelectContent>
                        </Select>
                    </div>

                    <div className="space-y-2">
                        <Label>Pessoa</Label>
                        <Select value={selectedOwner} onValueChange={setSelectedOwner}>
                            <SelectTrigger>
                                <SelectValue placeholder="Selecione uma pessoa" />
                            </SelectTrigger>
                            <SelectContent>
                                {(owners || []).map(owner => (
                                    <SelectItem key={owner.id} value={owner.id}>
                                        {owner.nome} (Mat: {owner.matricula}) - {owner.area}
                                    </SelectItem>
                                ))}
                            </SelectContent>
                        </Select>
                        {(owners || []).length === 0 && (
                            <p className="text-sm text-muted-foreground">
                                Nenhum proprietário cadastrado. Cadastre pessoas primeiro.
                            </p>
                        )}
                    </div>

                    <div className="space-y-2">
                        <Label>Aplicação</Label>
                        <Select value={selectedApplication} onValueChange={setSelectedApplication}>
                            <SelectTrigger>
                                <SelectValue placeholder="Selecione uma aplicação" />
                            </SelectTrigger>
                            <SelectContent>
                                {(applications || []).map(app => (
                                    <SelectItem key={app.id} value={app.id}>
                                        {app.name}
                                    </SelectItem>
                                ))}
                            </SelectContent>
                        </Select>
                        {(applications || []).length === 0 && (
                            <p className="text-sm text-muted-foreground">
                                Nenhuma aplicação cadastrada. Cadastre aplicações primeiro.
                            </p>
                        )}
                    </div>

                    <Button 
                        type="submit" 
                        className="w-full"
                        disabled={(owners || []).length === 0 || (applications || []).length === 0}
                    >
                        <Link size={16} className="mr-2" />
                        Criar Associação
                    </Button>
                </form>
            </CardContent>
        </Card>
    )
}
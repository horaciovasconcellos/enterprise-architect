import { useState, useEffect } from 'react'
import { useOwners, useApplications, useRelationships } from '@/hooks/useDatabase'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Label } from '@/components/ui/label'
import { toast } from 'sonner'
import { Link, UserCheck, Code, Info, TestTube } from '@phosphor-icons/react'
import type { Owner } from './OwnerForm'

interface Application {
    id: string
    name: string
    description?: string
    lifecyclePhase?: string
    criticality?: string
    healthScore?: number
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
    const { owners, createOwner, refetch: refetchOwners } = useOwners()
    const { applications, createApplication, refetch: refetchApplications } = useApplications()
    const { relationships, createRelationship, refetch: refetchRelationships } = useRelationships()
    
    const [selectedOwner, setSelectedOwner] = useState('')
    const [selectedApplication, setSelectedApplication] = useState('')
    const [relationshipType, setRelationshipType] = useState<'owner' | 'developer'>('owner')
    
    // Debug information
    const [debugInfo, setDebugInfo] = useState({
        ownersCount: 0,
        applicationsCount: 0,
        relationshipsCount: 0
    })
    
    useEffect(() => {
        setDebugInfo({
            ownersCount: (owners || []).length,
            applicationsCount: (applications || []).length,
            relationshipsCount: (relationships || []).length
        })
    }, [owners, applications, relationships])
    
    const createTestData = async () => {
        try {
            let shouldRefetchOwners = false
            let shouldRefetchApplications = false
            
            // Create test owner if none exist
            if ((owners || []).length === 0) {
                const testOwnerData = {
                    matricula: '12345',
                    nome: 'João Silva (Teste)',
                    area: 'Tecnologia da Informação'
                }
                await createOwner(testOwnerData)
                shouldRefetchOwners = true
                toast.success('Proprietário de teste criado')
            }
            
            // Create test application if none exist
            if ((applications || []).length === 0) {
                const testAppData = {
                    name: 'Sistema de Teste',
                    description: 'Aplicação criada para teste de associações',
                    lifecyclePhase: 'PRODUCAO',
                    criticality: 'MEDIA',
                    hostingType: 'ON_PREMISE',
                    healthScore: 85,
                    technicalFit: 'ADEQUADO',
                    functionalFit: 'ADEQUADO'
                }
                await createApplication(testAppData)
                shouldRefetchApplications = true
                toast.success('Aplicação de teste criada')
            }
            
            // Refresh data if anything was created
            if (shouldRefetchOwners) {
                refetchOwners()
            }
            if (shouldRefetchApplications) {
                refetchApplications()
            }
        } catch (error) {
            toast.error('Erro ao criar dados de teste')
            console.error('Erro ao criar dados de teste:', error)
        }
    }

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        
        if (!selectedOwner || !selectedApplication) {
            toast.error('Selecione um proprietário e uma aplicação')
            return
        }

        try {
            const relationshipData = {
                ownerId: selectedOwner,
                applicationId: selectedApplication,
                relationshipType: relationshipType
            }

            await createRelationship(relationshipData)
            
            const owner = (owners || []).find(o => o.id === selectedOwner)
            const app = (applications || []).find(a => a.id === selectedApplication)
            const typeLabel = relationshipType === 'owner' ? 'proprietário' : 'desenvolvedor'
            
            toast.success(`Associação criada: ${owner?.nome} como ${typeLabel} de ${app?.name}`)
            
            // Reset form
            setSelectedOwner('')
            setSelectedApplication('')
            setRelationshipType('owner')
            
            // Refresh relationships list
            refetchRelationships()
            
            onSuccess?.()
        } catch (error) {
            if (error instanceof Error && error.message === 'Relacionamento já existe') {
                toast.error('Esta associação já existe')
            } else {
                toast.error('Erro ao criar associação')
                console.error('Erro ao criar relacionamento:', error)
            }
        }
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
                {/* Debug Information */}
                <div className="mb-6 p-3 bg-muted rounded-lg">
                    <div className="flex items-center gap-2 mb-2">
                        <Info size={16} className="text-muted-foreground" />
                        <span className="text-sm font-medium">Status dos Dados</span>
                    </div>
                    <div className="grid grid-cols-3 gap-4 text-sm">
                        <div>
                            <span className="text-muted-foreground">Pessoas: </span>
                            <span className="font-medium">{debugInfo.ownersCount}</span>
                        </div>
                        <div>
                            <span className="text-muted-foreground">Aplicações: </span>
                            <span className="font-medium">{debugInfo.applicationsCount}</span>
                        </div>
                        <div>
                            <span className="text-muted-foreground">Associações: </span>
                            <span className="font-medium">{debugInfo.relationshipsCount}</span>
                        </div>
                    </div>
                </div>

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
                                {(owners || []).length > 0 ? (
                                    (owners || []).map(owner => (
                                        <SelectItem key={owner.id} value={owner.id}>
                                            {owner.nome} (Mat: {owner.matricula}) - {owner.area}
                                        </SelectItem>
                                    ))
                                ) : (
                                    <SelectItem value="no-owners" disabled>
                                        Nenhum proprietário encontrado
                                    </SelectItem>
                                )}
                            </SelectContent>
                        </Select>
                        {(owners || []).length === 0 && (
                            <div className="p-3 bg-yellow-50 border border-yellow-200 rounded-md">
                                <p className="text-sm text-yellow-800">
                                    <strong>Atenção:</strong> Nenhum proprietário cadastrado. 
                                    Vá para a aba "Proprietários" e cadastre pessoas primeiro.
                                </p>
                            </div>
                        )}
                    </div>

                    <div className="space-y-2">
                        <Label>Aplicação</Label>
                        <Select value={selectedApplication} onValueChange={setSelectedApplication}>
                            <SelectTrigger>
                                <SelectValue placeholder="Selecione uma aplicação" />
                            </SelectTrigger>
                            <SelectContent>
                                {(applications || []).length > 0 ? (
                                    (applications || []).map(app => (
                                        <SelectItem key={app.id} value={app.id}>
                                            <div className="flex flex-col">
                                                <span>{app.name}</span>
                                                {app.description && (
                                                    <span className="text-xs text-muted-foreground">
                                                        {app.description.length > 50 
                                                            ? `${app.description.substring(0, 50)}...` 
                                                            : app.description
                                                        }
                                                    </span>
                                                )}
                                            </div>
                                        </SelectItem>
                                    ))
                                ) : (
                                    <SelectItem value="no-applications" disabled>
                                        Nenhuma aplicação encontrada
                                    </SelectItem>
                                )}
                            </SelectContent>
                        </Select>
                        {(applications || []).length === 0 && (
                            <div className="p-3 bg-yellow-50 border border-yellow-200 rounded-md">
                                <p className="text-sm text-yellow-800">
                                    <strong>Atenção:</strong> Nenhuma aplicação cadastrada. 
                                    Vá para "Portfólio de Aplicações" e cadastre aplicações primeiro.
                                </p>
                            </div>
                        )}
                    </div>

                    <div className="flex gap-2">
                        <Button 
                            type="submit" 
                            className="flex-1"
                            disabled={(owners || []).length === 0 || (applications || []).length === 0}
                        >
                            <Link size={16} className="mr-2" />
                            Criar Associação
                        </Button>
                        
                        <Button 
                            type="button" 
                            variant="outline"
                            onClick={createTestData}
                        >
                            <TestTube size={16} className="mr-2" />
                            Dados Teste
                        </Button>
                        
                        <Button 
                            type="button" 
                            variant="outline"
                            onClick={() => {
                                console.log('Debug - Owners:', owners)
                                console.log('Debug - Applications:', applications)
                                console.log('Debug - Relationships:', relationships)
                                toast.info(`Dados: ${(owners || []).length} pessoas, ${(applications || []).length} apps, ${(relationships || []).length} associações`)
                            }}
                        >
                            Debug
                        </Button>
                    </div>
                </form>
            </CardContent>
        </Card>
    )
}
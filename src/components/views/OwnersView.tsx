import { useState } from 'react'
import { useKV } from '@github/spark/hooks'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Dialog, DialogContent, DialogTrigger } from '@/components/ui/dialog'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { OwnerForm, type Owner } from '@/components/forms/OwnerForm'
import { RelationshipForm } from '@/components/forms/RelationshipForm'
import { Plus, Pencil, Trash, User, UserCheck, Code, Link } from '@phosphor-icons/react'
import { toast } from 'sonner'

interface Relationship {
    id: string
    type: 'owner' | 'developer'
    ownerId: string
    applicationId: string
    createdAt: string
}

interface Application {
    id: string
    name: string
    businessOwner?: string
    technicalOwner?: string
}

export function OwnersView() {
    const [owners, setOwners] = useKV<Owner[]>('owners', [])
    const [relationships, setRelationships] = useKV<Relationship[]>('relationships', [])
    const [applications] = useKV<Application[]>('applications', [])
    const [isFormOpen, setIsFormOpen] = useState(false)
    const [isRelationshipFormOpen, setIsRelationshipFormOpen] = useState(false)
    const [editingOwner, setEditingOwner] = useState<Owner | undefined>()

    const handleSubmit = (owner: Owner) => {
        setIsFormOpen(false)
        setEditingOwner(undefined)
    }

    const handleEdit = (owner: Owner) => {
        setEditingOwner(owner)
        setIsFormOpen(true)
    }

    const handleDelete = (ownerId: string) => {
        if (confirm('Tem certeza que deseja excluir este proprietário?')) {
            setOwners(currentOwners => (currentOwners || []).filter(o => o.id !== ownerId))
            // Remove related relationships
            setRelationships(currentRels => (currentRels || []).filter(r => r.ownerId !== ownerId))
            toast.success('Proprietário excluído com sucesso')
        }
    }

    const getOwnerRelationships = (ownerId: string) => {
        const ownerRels = (relationships || []).filter(r => r.ownerId === ownerId)
        return ownerRels.map(rel => {
            const app = (applications || []).find(a => a.id === rel.applicationId)
            return {
                ...rel,
                applicationName: app?.name || 'Aplicação não encontrada'
            }
        })
    }

    const getRelationshipsByType = (type: 'owner' | 'developer') => {
        return (relationships || []).filter(r => r.type === type).map(rel => {
            const owner = (owners || []).find(o => o.id === rel.ownerId)
            const app = (applications || []).find(a => a.id === rel.applicationId)
            return {
                ...rel,
                ownerName: owner?.nome || 'Proprietário não encontrado',
                ownerMatricula: owner?.matricula || '',
                applicationName: app?.name || 'Aplicação não encontrada'
            }
        })
    }

    const ownerRelationships = getRelationshipsByType('owner')
    const developerRelationships = getRelationshipsByType('developer')

    return (
        <div className="space-y-6">
            <div className="flex justify-between items-center">
                <div>
                    <h1 className="text-3xl font-bold text-foreground mb-2">Proprietários & Relacionamentos</h1>
                    <p className="text-muted-foreground">Gerencie os proprietários e desenvolvedores das aplicações</p>
                </div>
                <div className="flex gap-2">
                    <Dialog open={isRelationshipFormOpen} onOpenChange={setIsRelationshipFormOpen}>
                        <DialogTrigger asChild>
                            <Button variant="outline">
                                <Link size={16} className="mr-2" />
                                Nova Associação
                            </Button>
                        </DialogTrigger>
                        <DialogContent className="max-w-2xl">
                            <RelationshipForm onSuccess={() => setIsRelationshipFormOpen(false)} />
                        </DialogContent>
                    </Dialog>
                    
                    <Dialog open={isFormOpen} onOpenChange={setIsFormOpen}>
                        <DialogTrigger asChild>
                            <Button onClick={() => setEditingOwner(undefined)}>
                                <Plus size={16} className="mr-2" />
                                Novo Proprietário
                            </Button>
                        </DialogTrigger>
                        <DialogContent className="max-w-2xl">
                            <OwnerForm 
                                owner={editingOwner} 
                                onSubmit={handleSubmit}
                                onCancel={() => setIsFormOpen(false)}
                            />
                        </DialogContent>
                    </Dialog>
                </div>
            </div>

            <Tabs defaultValue="owners" className="w-full">
                <TabsList className="grid w-full grid-cols-3">
                    <TabsTrigger value="owners">Proprietários</TabsTrigger>
                    <TabsTrigger value="relationships">Relacionamentos</TabsTrigger>
                    <TabsTrigger value="summary">Resumo</TabsTrigger>
                </TabsList>

                <TabsContent value="owners" className="space-y-6 mt-6">
                    {/* Owners List */}
                    <Card>
                        <CardHeader>
                            <CardTitle className="flex items-center gap-2">
                                <User size={20} />
                                Proprietários Cadastrados ({(owners || []).length})
                            </CardTitle>
                        </CardHeader>
                        <CardContent>
                            {(owners || []).length === 0 ? (
                                <div className="text-center py-8 text-muted-foreground">
                                    <User size={48} className="mx-auto mb-4 opacity-50" />
                                    <p>Nenhum proprietário cadastrado ainda</p>
                                    <p className="text-sm">Comece adicionando seu primeiro proprietário</p>
                                </div>
                            ) : (
                                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                                    {(owners || []).map((owner) => {
                                        const ownerRels = getOwnerRelationships(owner.id)
                                        return (
                                            <Card key={owner.id} className="border-2">
                                                <CardHeader className="pb-3">
                                                    <div className="flex justify-between items-start">
                                                        <div>
                                                            <h3 className="font-semibold">{owner.nome}</h3>
                                                            <p className="text-sm text-muted-foreground">Mat: {owner.matricula}</p>
                                                        </div>
                                                        <div className="flex gap-1">
                                                            <Button
                                                                variant="ghost"
                                                                size="sm"
                                                                onClick={() => handleEdit(owner)}
                                                            >
                                                                <Pencil size={14} />
                                                            </Button>
                                                            <Button
                                                                variant="ghost"
                                                                size="sm"
                                                                onClick={() => handleDelete(owner.id)}
                                                            >
                                                                <Trash size={14} />
                                                            </Button>
                                                        </div>
                                                    </div>
                                                </CardHeader>
                                                <CardContent>
                                                    <Badge variant="outline" className="mb-3">
                                                        {owner.area}
                                                    </Badge>
                                                    <div className="text-sm">
                                                        <p className="text-muted-foreground">
                                                            {ownerRels.length} aplicação(ões) associada(s)
                                                        </p>
                                                        {ownerRels.slice(0, 2).map(rel => (
                                                            <div key={rel.id} className="mt-1 text-xs">
                                                                <Badge variant="secondary" className="mr-1">
                                                                    {rel.type === 'owner' ? 'Dono' : 'Dev'}
                                                                </Badge>
                                                                {rel.applicationName}
                                                            </div>
                                                        ))}
                                                        {ownerRels.length > 2 && (
                                                            <p className="text-xs text-muted-foreground mt-1">
                                                                +{ownerRels.length - 2} mais...
                                                            </p>
                                                        )}
                                                    </div>
                                                </CardContent>
                                            </Card>
                                        )
                                    })}
                                </div>
                            )}
                        </CardContent>
                    </Card>
                </TabsContent>

                <TabsContent value="relationships" className="space-y-6 mt-6">
                    {/* Debug Information */}
                    <Card className="bg-muted/50">
                        <CardHeader className="pb-3">
                            <CardTitle className="text-lg flex items-center gap-2">
                                <Link size={18} />
                                Status dos Dados
                            </CardTitle>
                        </CardHeader>
                        <CardContent>
                            <div className="grid grid-cols-1 md:grid-cols-4 gap-4 text-sm">
                                <div className="text-center">
                                    <div className="text-2xl font-bold text-primary">{(owners || []).length}</div>
                                    <div className="text-muted-foreground">Pessoas</div>
                                </div>
                                <div className="text-center">
                                    <div className="text-2xl font-bold text-primary">{(applications || []).length}</div>
                                    <div className="text-muted-foreground">Aplicações</div>
                                </div>
                                <div className="text-center">
                                    <div className="text-2xl font-bold text-accent">{ownerRelationships.length}</div>
                                    <div className="text-muted-foreground">Proprietários</div>
                                </div>
                                <div className="text-center">
                                    <div className="text-2xl font-bold text-accent">{developerRelationships.length}</div>
                                    <div className="text-muted-foreground">Desenvolvedores</div>
                                </div>
                            </div>
                            {((owners || []).length === 0 || (applications || []).length === 0) && (
                                <div className="mt-4 p-3 bg-yellow-50 border border-yellow-200 rounded-md">
                                    <p className="text-sm text-yellow-800">
                                        <strong>Para criar associações:</strong>
                                        {(owners || []).length === 0 && " Cadastre pessoas na aba 'Proprietários'."}
                                        {(applications || []).length === 0 && " Cadastre aplicações em 'Portfólio de Aplicações'."}
                                    </p>
                                </div>
                            )}
                        </CardContent>
                    </Card>

                    {/* Relationships Section */}
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                        {/* Owners Relationships */}
                        <Card>
                            <CardHeader>
                                <CardTitle className="flex items-center gap-2">
                                    <UserCheck size={20} />
                                    Donos das Aplicações ({ownerRelationships.length})
                                </CardTitle>
                            </CardHeader>
                            <CardContent>
                                {ownerRelationships.length === 0 ? (
                                    <div className="text-center py-8 text-muted-foreground">
                                        <UserCheck size={32} className="mx-auto mb-2 opacity-50" />
                                        <p className="text-sm">Nenhuma associação de proprietário ainda</p>
                                    </div>
                                ) : (
                                    <div className="space-y-3">
                                        {ownerRelationships.map((rel) => (
                                            <div key={rel.id} className="flex items-center justify-between p-3 rounded-lg border">
                                                <div>
                                                    <div className="font-medium">{rel.ownerName}</div>
                                                    <div className="text-sm text-muted-foreground">
                                                        Mat: {rel.ownerMatricula}
                                                    </div>
                                                </div>
                                                <div className="text-right">
                                                    <div className="text-sm font-medium">{rel.applicationName}</div>
                                                    <Badge variant="default" className="text-xs">
                                                        Proprietário
                                                    </Badge>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                )}
                            </CardContent>
                        </Card>

                        {/* Developers Relationships */}
                        <Card>
                            <CardHeader>
                                <CardTitle className="flex items-center gap-2">
                                    <Code size={20} />
                                    Desenvolvedores ({developerRelationships.length})
                                </CardTitle>
                            </CardHeader>
                            <CardContent>
                                {developerRelationships.length === 0 ? (
                                    <div className="text-center py-8 text-muted-foreground">
                                        <Code size={32} className="mx-auto mb-2 opacity-50" />
                                        <p className="text-sm">Nenhuma associação de desenvolvedor ainda</p>
                                    </div>
                                ) : (
                                    <div className="space-y-3">
                                        {developerRelationships.map((rel) => (
                                            <div key={rel.id} className="flex items-center justify-between p-3 rounded-lg border">
                                                <div>
                                                    <div className="font-medium">{rel.ownerName}</div>
                                                    <div className="text-sm text-muted-foreground">
                                                        Mat: {rel.ownerMatricula}
                                                    </div>
                                                </div>
                                                <div className="text-right">
                                                    <div className="text-sm font-medium">{rel.applicationName}</div>
                                                    <Badge variant="secondary" className="text-xs">
                                                        Desenvolvedor
                                                    </Badge>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                )}
                            </CardContent>
                        </Card>
                    </div>
                </TabsContent>

                <TabsContent value="summary" className="space-y-6 mt-6">
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                        <Card>
                            <CardHeader>
                                <CardTitle className="text-lg">Estatísticas</CardTitle>
                            </CardHeader>
                            <CardContent className="space-y-4">
                                <div className="flex justify-between">
                                    <span>Total de pessoas:</span>
                                    <Badge variant="outline">{(owners || []).length}</Badge>
                                </div>
                                <div className="flex justify-between">
                                    <span>Total de associações:</span>
                                    <Badge variant="outline">{(relationships || []).length}</Badge>
                                </div>
                                <div className="flex justify-between">
                                    <span>Proprietários:</span>
                                    <Badge variant="default">{ownerRelationships.length}</Badge>
                                </div>
                                <div className="flex justify-between">
                                    <span>Desenvolvedores:</span>
                                    <Badge variant="secondary">{developerRelationships.length}</Badge>
                                </div>
                            </CardContent>
                        </Card>

                        <Card>
                            <CardHeader>
                                <CardTitle className="text-lg">Áreas</CardTitle>
                            </CardHeader>
                            <CardContent>
                                {(owners || []).length === 0 ? (
                                    <p className="text-muted-foreground text-sm">Nenhum dado disponível</p>
                                ) : (
                                    <div className="space-y-2">
                                        {Object.entries(
                                            (owners || []).reduce((acc, owner) => {
                                                acc[owner.area] = (acc[owner.area] || 0) + 1
                                                return acc
                                            }, {} as Record<string, number>)
                                        ).map(([area, count]) => (
                                            <div key={area} className="flex justify-between items-center">
                                                <span className="text-sm">{area}</span>
                                                <Badge variant="outline">{count}</Badge>
                                            </div>
                                        ))}
                                    </div>
                                )}
                            </CardContent>
                        </Card>

                        <Card>
                            <CardHeader>
                                <CardTitle className="text-lg">Status</CardTitle>
                            </CardHeader>
                            <CardContent className="space-y-4">
                                <div className="text-sm text-muted-foreground">
                                    <p>Sistema operacional</p>
                                    <p className="mt-2">
                                        {(applications || []).length > 0 && (owners || []).length > 0 
                                            ? "Pronto para criar associações"
                                            : "Configure proprietários e aplicações primeiro"
                                        }
                                    </p>
                                </div>
                            </CardContent>
                        </Card>
                    </div>
                </TabsContent>
            </Tabs>
        </div>
    )
}
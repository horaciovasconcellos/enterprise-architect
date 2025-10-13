import { useState } from 'react'
import { useSkills } from '@/hooks/useDatabase'
import { SkillForm } from '@/components/forms/SkillForm'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Plus, Pencil, Trash, Code, Users, Cpu } from '@phosphor-icons/react'
import { toast } from 'sonner'

export function SkillsView() {
  const { skills, loading, error, createSkill, updateSkill, deleteSkill } = useSkills()
  const [selectedSkill, setSelectedSkill] = useState<any | null>(null)
  const [isCreating, setIsCreating] = useState(false)
  const [isEditing, setIsEditing] = useState(false)

  const handleCreate = async (skillData: any) => {
    try {
      await createSkill(skillData)
      setIsCreating(false)
      toast.success('Habilidade criada com sucesso!')
    } catch (error) {
      console.error('Erro ao criar habilidade:', error)
      toast.error('Erro ao criar habilidade')
    }
  }

  const handleUpdate = async (skillData: any) => {
    if (!selectedSkill) return
    
    try {
      await updateSkill(selectedSkill.id, skillData)
      setIsEditing(false)
      setSelectedSkill(null)
      toast.success('Habilidade atualizada com sucesso!')
    } catch (error) {
      console.error('Erro ao atualizar habilidade:', error)
      toast.error('Erro ao atualizar habilidade')
    }
  }

  const handleDelete = async (id: string, name: string) => {
    if (!confirm(`Tem certeza que deseja excluir a habilidade "${name}"?`)) {
      return
    }

    try {
      await deleteSkill(id)
      toast.success('Habilidade excluída com sucesso!')
    } catch (error) {
      console.error('Erro ao excluir habilidade:', error)
      toast.error('Erro ao excluir habilidade')
    }
  }

  const handleEdit = (skill: any) => {
    setSelectedSkill(skill)
    setIsEditing(true)
  }

  const handleCancel = () => {
    setIsCreating(false)
    setIsEditing(false)
    setSelectedSkill(null)
  }

  if (isCreating || isEditing) {
    return (
      <SkillForm
        skill={isEditing ? selectedSkill : null}
        onSave={isEditing ? handleUpdate : handleCreate}
        onCancel={handleCancel}
      />
    )
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center h-96">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-muted-foreground">Carregando habilidades...</p>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="flex items-center justify-center h-96">
        <div className="text-center">
          <p className="text-destructive mb-4">Erro ao carregar habilidades</p>
          <p className="text-sm text-muted-foreground">{error}</p>
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Habilidades</h1>
          <p className="text-muted-foreground">
            Gerencie habilidades técnicas e associe desenvolvedores e tecnologias
          </p>
        </div>
        <Button onClick={() => setIsCreating(true)} className="gap-2">
          <Plus size={16} weight="bold" />
          Nova Habilidade
        </Button>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Total de Habilidades</CardTitle>
            <Code className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{skills?.length || 0}</div>
            <p className="text-xs text-muted-foreground">
              Habilidades cadastradas
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Tecnologias Associadas</CardTitle>
            <Cpu className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {skills?.reduce((acc, skill) => acc + (skill.technologies?.length || 0), 0) || 0}
            </div>
            <p className="text-xs text-muted-foreground">
              Relações skill-tecnologia
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Desenvolvedores</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {skills?.reduce((acc, skill) => acc + (skill.developers?.length || 0), 0) || 0}
            </div>
            <p className="text-xs text-muted-foreground">
              Relações skill-desenvolvedor
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Skills Grid */}
      {skills && skills.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {skills.map((skill) => (
            <Card key={skill.id} className="hover:shadow-lg transition-shadow">
              <CardHeader>
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <CardTitle className="text-lg">{skill.name}</CardTitle>
                    <Badge variant="secondary" className="mt-2">
                      {skill.code}
                    </Badge>
                  </div>
                  <div className="flex gap-1">
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => handleEdit(skill)}
                      className="h-8 w-8 p-0"
                    >
                      <Pencil size={16} />
                    </Button>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => handleDelete(skill.id, skill.name)}
                      className="h-8 w-8 p-0 text-destructive hover:text-destructive"
                    >
                      <Trash size={16} />
                    </Button>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                {skill.description && (
                  <p className="text-sm text-muted-foreground line-clamp-2">
                    {skill.description}
                  </p>
                )}

                <div className="space-y-2">
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-muted-foreground flex items-center gap-2">
                      <Cpu size={16} />
                      Tecnologias
                    </span>
                    <span className="font-semibold">
                      {skill.technologies?.length || 0}
                    </span>
                  </div>

                  <div className="flex items-center justify-between text-sm">
                    <span className="text-muted-foreground flex items-center gap-2">
                      <Users size={16} />
                      Desenvolvedores
                    </span>
                    <span className="font-semibold">
                      {skill.developers?.length || 0}
                    </span>
                  </div>
                </div>

                {skill.guidanceNotes && (
                  <div className="pt-3 border-t">
                    <p className="text-xs text-muted-foreground italic line-clamp-2">
                      "{skill.guidanceNotes}"
                    </p>
                  </div>
                )}
              </CardContent>
            </Card>
          ))}
        </div>
      ) : (
        <Card>
          <CardContent className="flex flex-col items-center justify-center py-16">
            <Code size={64} className="text-muted-foreground mb-4" />
            <h3 className="text-lg font-semibold mb-2">Nenhuma habilidade cadastrada</h3>
            <p className="text-muted-foreground mb-6 text-center max-w-md">
              Comece criando sua primeira habilidade para gerenciar competências técnicas da equipe
            </p>
            <Button onClick={() => setIsCreating(true)} className="gap-2">
              <Plus size={16} weight="bold" />
              Criar Primeira Habilidade
            </Button>
          </CardContent>
        </Card>
      )}
    </div>
  )
}

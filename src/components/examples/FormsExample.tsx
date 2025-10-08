import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { ProcessForm } from '@/components/forms/ProcessForm'
import { TechnologyForm } from '@/components/forms/TechnologyForm'
import { Plus } from '@phosphor-icons/react'

export function FormsExample() {
    const [activeForm, setActiveForm] = useState<string | null>(null)

    const handleSubmit = (formType: string, data: any) => {
        console.log(`Salvando ${formType}:`, data)
        setActiveForm(null)
        // Aqui você normalmente salvaria no armazenamento de dados
    }

    const renderForm = () => {
        switch (activeForm) {
            case 'process':
                return (
                    <ProcessForm
                        onSubmit={(data) => handleSubmit('Processo', data)}
                        onCancel={() => setActiveForm(null)}
                    />
                )
            case 'technology':
                return (
                    <TechnologyForm
                        onSubmit={(data) => handleSubmit('Tecnologia', data)}
                        onCancel={() => setActiveForm(null)}
                    />
                )
            default:
                return null
        }
    }

    if (activeForm) {
        return renderForm()
    }

    return (
        <div className="space-y-6">
            <div>
                <h1 className="text-3xl font-bold text-foreground">Sistema de Formulários</h1>
                <p className="text-muted-foreground">
                    Formulários abrangentes para componentes de Arquitetura Empresarial
                </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <Card className="cursor-pointer hover:shadow-md transition-shadow" onClick={() => setActiveForm('process')}>
                    <CardHeader className="pb-3">
                        <CardTitle className="text-lg flex items-center gap-2">
                            <Plus size={20} className="text-primary" />
                            Processo de Negócio
                        </CardTitle>
                    </CardHeader>
                    <CardContent>
                        <p className="text-sm text-muted-foreground">
                            Documente processos de negócio com métricas de desempenho e níveis de automação
                        </p>
                    </CardContent>
                </Card>

                <Card className="cursor-pointer hover:shadow-md transition-shadow" onClick={() => setActiveForm('technology')}>
                    <CardHeader className="pb-3">
                        <CardTitle className="text-lg flex items-center gap-2">
                            <Plus size={20} className="text-primary" />
                            Tecnologia
                        </CardTitle>
                    </CardHeader>
                    <CardContent>
                        <p className="text-sm text-muted-foreground">
                            Catalogue tecnologias com avaliação abrangente e gerenciamento de ciclo de vida
                        </p>
                    </CardContent>
                </Card>
            </div>

            <Card>
                <CardHeader>
                    <CardTitle>Recursos dos Formulários</CardTitle>
                </CardHeader>
                <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                        <h4 className="font-semibold mb-3">Recursos Comuns</h4>
                        <ul className="space-y-2 text-sm text-muted-foreground">
                            <li>• Layouts de campos padronizados e validação</li>
                            <li>• Gerenciamento abrangente de relacionamentos</li>
                            <li>• Capacidades de avaliação e pontuação</li>
                            <li>• Guias de referência rápida e texto de ajuda</li>
                            <li>• Design responsivo para todos os tamanhos de tela</li>
                        </ul>
                    </div>
                    <div>
                        <h4 className="font-semibold mb-3">Categorias de Dados</h4>
                        <ul className="space-y-2 text-sm text-muted-foreground">
                            <li>• Informações básicas e metadados</li>
                            <li>• Classificação e categorização</li>
                            <li>• Relacionamentos e dependências</li>
                            <li>• Métricas de desempenho e KPIs</li>
                            <li>• Dados de conformidade e governança</li>
                            <li>• Tags e rótulos personalizados</li>
                        </ul>
                    </div>
                </CardContent>
            </Card>
        </div>
    )
}
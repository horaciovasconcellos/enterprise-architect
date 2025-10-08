import { useState } from 'react'
import { useKV } from '@github/spark/hooks'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Progress } from '@/components/ui/progress'
import { Plus, Gear, FunnelSimple } from '@phosphor-icons/react'

interface Technology {
    id: string
    name: string
    description?: string
    category: string
    healthScore: number
    version?: string
}

export function TechnologiesView() {
    const [technologies, setTechnologies] = useKV<Technology[]>('technologies', [])
    const [showForm, setShowForm] = useState(false)
    const [filter, setFilter] = useState<string>('')

    const handleAddTechnology = () => {
        const name = prompt('Technology Name:')
        if (name) {
            const newTechnology: Technology = {
                id: Date.now().toString(),
                name,
                category: 'INFRASTRUCTURE',
                healthScore: Math.floor(Math.random() * 100),
                version: '1.0.0'
            }
            setTechnologies((current) => [...(current || []), newTechnology])
        }
    }

    const filteredTechnologies = (technologies || []).filter(tech =>
        tech.name.toLowerCase().includes(filter.toLowerCase()) ||
        (tech.description?.toLowerCase().includes(filter.toLowerCase())) ||
        tech.category.toLowerCase().includes(filter.toLowerCase())
    )

    const getCategoryColor = (category: string) => {
        switch (category) {
            case 'INFRASTRUCTURE': return 'bg-blue-500/10 text-blue-700 border-blue-500/20'
            case 'DATABASE': return 'bg-green-500/10 text-green-700 border-green-500/20'
            case 'PLATFORM': return 'bg-purple-500/10 text-purple-700 border-purple-500/20'
            case 'MIDDLEWARE': return 'bg-orange-500/10 text-orange-700 border-orange-500/20'
            case 'APPLICATION': return 'bg-yellow-500/10 text-yellow-700 border-yellow-500/20'
            default: return 'bg-gray-500/10 text-gray-700 border-gray-500/20'
        }
    }

    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-3xl font-bold text-foreground mb-2">Technologies</h1>
                    <p className="text-muted-foreground">Manage your organization's technology stack and infrastructure</p>
                </div>
                <Button onClick={handleAddTechnology} className="gap-2">
                    <Plus size={16} />
                    Add Technology
                </Button>
            </div>

            <div className="flex items-center gap-4">
                <div className="relative flex-1 max-w-sm">
                    <FunnelSimple size={16} className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground" />
                    <input
                        type="text"
                        placeholder="Filter technologies..."
                        className="w-full pl-9 pr-4 py-2 border border-border rounded-lg bg-background focus:outline-none focus:ring-2 focus:ring-ring"
                        value={filter}
                        onChange={(e) => setFilter(e.target.value)}
                    />
                </div>
                <div className="text-sm text-muted-foreground">
                    {filteredTechnologies.length} of {(technologies || []).length} technologies
                </div>
            </div>

            {filteredTechnologies.length === 0 && (technologies || []).length === 0 ? (
                <div className="text-center py-16">
                    <Gear size={64} className="mx-auto mb-4 text-muted-foreground opacity-50" />
                    <h3 className="text-lg font-medium text-foreground mb-2">No technologies yet</h3>
                    <p className="text-muted-foreground mb-6">Start cataloging your technology stack for better visibility.</p>
                    <Button onClick={handleAddTechnology} className="gap-2">
                        <Plus size={16} />
                        Add Your First Technology
                    </Button>
                </div>
            ) : filteredTechnologies.length === 0 ? (
                <div className="text-center py-16">
                    <FunnelSimple size={64} className="mx-auto mb-4 text-muted-foreground opacity-50" />
                    <h3 className="text-lg font-medium text-foreground mb-2">No matching technologies</h3>
                    <p className="text-muted-foreground">Try adjusting your search criteria.</p>
                </div>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {filteredTechnologies.map((technology) => (
                        <Card key={technology.id} className="hover:shadow-md transition-shadow">
                            <CardHeader className="pb-3">
                                <div className="flex items-start justify-between">
                                    <div>
                                        <CardTitle className="text-lg">{technology.name}</CardTitle>
                                        {technology.version && (
                                            <p className="text-sm text-muted-foreground">v{technology.version}</p>
                                        )}
                                    </div>
                                    <Badge className={getCategoryColor(technology.category)}>
                                        {technology.category}
                                    </Badge>
                                </div>
                                {technology.description && (
                                    <p className="text-sm text-muted-foreground line-clamp-2">
                                        {technology.description}
                                    </p>
                                )}
                            </CardHeader>
                            <CardContent className="space-y-4">
                                <div className="space-y-2">
                                    <div className="flex items-center justify-between">
                                        <span className="text-sm font-medium">Health Score</span>
                                        <span className="text-sm text-muted-foreground">{technology.healthScore}%</span>
                                    </div>
                                    <Progress value={technology.healthScore} />
                                </div>
                                
                                <div className="flex items-center justify-between text-sm text-muted-foreground">
                                    <span>Applications</span>
                                    <span>{Math.floor(Math.random() * 8) + 1} using</span>
                                </div>
                            </CardContent>
                        </Card>
                    ))}
                </div>
            )}
        </div>
    )
}
import { useState } from 'react'
import { useKV } from '@github/spark/hooks'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Progress } from '@/components/ui/progress'
import { Plus, Buildings, FunnelSimple } from '@phosphor-icons/react'

interface Capability {
    id: string
    name: string
    description?: string
    criticality: string
    coverageScore: number
    parentId?: string
}

export function CapabilitiesView() {
    const [capabilities, setCapabilities] = useKV<Capability[]>('capabilities', [])
    const [showForm, setShowForm] = useState(false)
    const [filter, setFilter] = useState<string>('')

    const handleAddCapability = () => {
        const name = prompt('Capability Name:')
        if (name) {
            const newCapability: Capability = {
                id: Date.now().toString(),
                name,
                criticality: 'MEDIUM',
                coverageScore: Math.floor(Math.random() * 100)
            }
            setCapabilities((current) => [...(current || []), newCapability])
        }
    }

    const filteredCapabilities = (capabilities || []).filter(cap =>
        cap.name.toLowerCase().includes(filter.toLowerCase()) ||
        (cap.description?.toLowerCase().includes(filter.toLowerCase()))
    )

    const getCriticalityColor = (criticality: string) => {
        switch (criticality) {
            case 'CRITICAL': return 'bg-red-500/10 text-red-700 border-red-500/20'
            case 'HIGH': return 'bg-orange-500/10 text-orange-700 border-orange-500/20'
            case 'MEDIUM': return 'bg-yellow-500/10 text-yellow-700 border-yellow-500/20'
            default: return 'bg-green-500/10 text-green-700 border-green-500/20'
        }
    }

    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-3xl font-bold text-foreground mb-2">Business Capabilities</h1>
                    <p className="text-muted-foreground">Map and manage your organization's business capabilities</p>
                </div>
                <Button onClick={handleAddCapability} className="gap-2">
                    <Plus size={16} />
                    Add Capability
                </Button>
            </div>

            <div className="flex items-center gap-4">
                <div className="relative flex-1 max-w-sm">
                    <FunnelSimple size={16} className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground" />
                    <input
                        type="text"
                        placeholder="Filter capabilities..."
                        className="w-full pl-9 pr-4 py-2 border border-border rounded-lg bg-background focus:outline-none focus:ring-2 focus:ring-ring"
                        value={filter}
                        onChange={(e) => setFilter(e.target.value)}
                    />
                </div>
                <div className="text-sm text-muted-foreground">
                    {filteredCapabilities.length} of {(capabilities || []).length} capabilities
                </div>
            </div>

            {filteredCapabilities.length === 0 && (capabilities || []).length === 0 ? (
                <div className="text-center py-16">
                    <Buildings size={64} className="mx-auto mb-4 text-muted-foreground opacity-50" />
                    <h3 className="text-lg font-medium text-foreground mb-2">No capabilities yet</h3>
                    <p className="text-muted-foreground mb-6">Start mapping your business capabilities to understand organizational structure.</p>
                    <Button onClick={handleAddCapability} className="gap-2">
                        <Plus size={16} />
                        Add Your First Capability
                    </Button>
                </div>
            ) : filteredCapabilities.length === 0 ? (
                <div className="text-center py-16">
                    <FunnelSimple size={64} className="mx-auto mb-4 text-muted-foreground opacity-50" />
                    <h3 className="text-lg font-medium text-foreground mb-2">No matching capabilities</h3>
                    <p className="text-muted-foreground">Try adjusting your search criteria.</p>
                </div>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {filteredCapabilities.map((capability) => (
                        <Card key={capability.id} className="hover:shadow-md transition-shadow">
                            <CardHeader className="pb-3">
                                <div className="flex items-start justify-between">
                                    <CardTitle className="text-lg">{capability.name}</CardTitle>
                                    <Badge className={getCriticalityColor(capability.criticality)}>
                                        {capability.criticality}
                                    </Badge>
                                </div>
                                {capability.description && (
                                    <p className="text-sm text-muted-foreground line-clamp-2">
                                        {capability.description}
                                    </p>
                                )}
                            </CardHeader>
                            <CardContent className="space-y-4">
                                <div className="space-y-2">
                                    <div className="flex items-center justify-between">
                                        <span className="text-sm font-medium">Coverage Score</span>
                                        <span className="text-sm text-muted-foreground">{capability.coverageScore}%</span>
                                    </div>
                                    <Progress value={capability.coverageScore} />
                                </div>
                                
                                <div className="flex items-center justify-between text-sm text-muted-foreground">
                                    <span>Applications</span>
                                    <span>{Math.floor(Math.random() * 5) + 1} linked</span>
                                </div>
                            </CardContent>
                        </Card>
                    ))}
                </div>
            )}
        </div>
    )
}
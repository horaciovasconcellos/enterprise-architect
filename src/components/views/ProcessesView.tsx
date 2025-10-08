import { useState } from 'react'
import { useKV } from '@github/spark/hooks'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Progress } from '@/components/ui/progress'
import { Plus, FlowArrow, FunnelSimple } from '@phosphor-icons/react'

interface Process {
    id: string
    name: string
    description?: string
    maturityLevel: string
    automationScore: number
    categoryId?: string
}

export function ProcessesView() {
    const [processes, setProcesses] = useKV<Process[]>('processes', [])
    const [showForm, setShowForm] = useState(false)
    const [filter, setFilter] = useState<string>('')

    const handleAddProcess = () => {
        const name = prompt('Process Name:')
        if (name) {
            const newProcess: Process = {
                id: Date.now().toString(),
                name,
                maturityLevel: 'DEFINED',
                automationScore: Math.floor(Math.random() * 100)
            }
            setProcesses((current) => [...(current || []), newProcess])
        }
    }

    const filteredProcesses = (processes || []).filter(proc =>
        proc.name.toLowerCase().includes(filter.toLowerCase()) ||
        (proc.description?.toLowerCase().includes(filter.toLowerCase()))
    )

    const getMaturityColor = (maturity: string) => {
        switch (maturity) {
            case 'OPTIMIZED': return 'bg-green-500/10 text-green-700 border-green-500/20'
            case 'MANAGED': return 'bg-blue-500/10 text-blue-700 border-blue-500/20'
            case 'DEFINED': return 'bg-yellow-500/10 text-yellow-700 border-yellow-500/20'
            case 'REPEATABLE': return 'bg-orange-500/10 text-orange-700 border-orange-500/20'
            default: return 'bg-red-500/10 text-red-700 border-red-500/20'
        }
    }

    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-3xl font-bold text-foreground mb-2">Business Processes</h1>
                    <p className="text-muted-foreground">Map and manage your organization's business processes</p>
                </div>
                <Button onClick={handleAddProcess} className="gap-2">
                    <Plus size={16} />
                    Add Process
                </Button>
            </div>

            <div className="flex items-center gap-4">
                <div className="relative flex-1 max-w-sm">
                    <FunnelSimple size={16} className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground" />
                    <input
                        type="text"
                        placeholder="Filter processes..."
                        className="w-full pl-9 pr-4 py-2 border border-border rounded-lg bg-background focus:outline-none focus:ring-2 focus:ring-ring"
                        value={filter}
                        onChange={(e) => setFilter(e.target.value)}
                    />
                </div>
                <div className="text-sm text-muted-foreground">
                    {filteredProcesses.length} of {(processes || []).length} processes
                </div>
            </div>

            {filteredProcesses.length === 0 && (processes || []).length === 0 ? (
                <div className="text-center py-16">
                    <FlowArrow size={64} className="mx-auto mb-4 text-muted-foreground opacity-50" />
                    <h3 className="text-lg font-medium text-foreground mb-2">No processes yet</h3>
                    <p className="text-muted-foreground mb-6">Start mapping your business processes to optimize operations.</p>
                    <Button onClick={handleAddProcess} className="gap-2">
                        <Plus size={16} />
                        Add Your First Process
                    </Button>
                </div>
            ) : filteredProcesses.length === 0 ? (
                <div className="text-center py-16">
                    <FunnelSimple size={64} className="mx-auto mb-4 text-muted-foreground opacity-50" />
                    <h3 className="text-lg font-medium text-foreground mb-2">No matching processes</h3>
                    <p className="text-muted-foreground">Try adjusting your search criteria.</p>
                </div>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {filteredProcesses.map((process) => (
                        <Card key={process.id} className="hover:shadow-md transition-shadow">
                            <CardHeader className="pb-3">
                                <div className="flex items-start justify-between">
                                    <CardTitle className="text-lg">{process.name}</CardTitle>
                                    <Badge className={getMaturityColor(process.maturityLevel)}>
                                        {process.maturityLevel}
                                    </Badge>
                                </div>
                                {process.description && (
                                    <p className="text-sm text-muted-foreground line-clamp-2">
                                        {process.description}
                                    </p>
                                )}
                            </CardHeader>
                            <CardContent className="space-y-4">
                                <div className="space-y-2">
                                    <div className="flex items-center justify-between">
                                        <span className="text-sm font-medium">Automation Score</span>
                                        <span className="text-sm text-muted-foreground">{process.automationScore}%</span>
                                    </div>
                                    <Progress value={process.automationScore} />
                                </div>
                                
                                <div className="flex items-center justify-between text-sm text-muted-foreground">
                                    <span>Applications</span>
                                    <span>{Math.floor(Math.random() * 3) + 1} supporting</span>
                                </div>
                            </CardContent>
                        </Card>
                    ))}
                </div>
            )}
        </div>
    )
}
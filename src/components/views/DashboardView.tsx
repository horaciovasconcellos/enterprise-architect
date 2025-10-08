import { useKV } from '@github/spark/hooks'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Progress } from '@/components/ui/progress'
import { Cube, Buildings, ShareNetwork, Warning } from '@phosphor-icons/react'

interface Application {
    id: string
    name: string
    lifecyclePhase: string
    criticality: string
    healthScore: number
}

interface Capability {
    id: string
    name: string
    criticality: string
    coverageScore: number
}

interface Interface {
    id: string
    sourceApp: string
    targetApp: string
    type: string
}

export function DashboardView() {
    const [applications] = useKV<Application[]>('applications', [])
    const [capabilities] = useKV<Capability[]>('capabilities', [])
    const [interfaces] = useKV<Interface[]>('interfaces', [])

    const criticalApps = (applications || []).filter(app => app.criticality === 'CRITICAL').length
    const totalApps = (applications || []).length
    const avgHealthScore = totalApps > 0 ? (applications || []).reduce((sum, app) => sum + (app.healthScore || 0), 0) / totalApps : 0

    const criticalCapabilities = (capabilities || []).filter(cap => cap.criticality === 'CRITICAL').length
    const avgCoverageScore = (capabilities || []).length > 0 ? (capabilities || []).reduce((sum, cap) => sum + (cap.coverageScore || 0), 0) / (capabilities || []).length : 0

    const totalInterfaces = (interfaces || []).length

    const getLifecycleBadgeColor = (phase: string) => {
        switch (phase) {
            case 'PRODUCTION': return 'bg-green-500/10 text-green-700 border-green-500/20'
            case 'MAINTENANCE': return 'bg-yellow-500/10 text-yellow-700 border-yellow-500/20'
            case 'SUNSET': return 'bg-red-500/10 text-red-700 border-red-500/20'
            default: return 'bg-blue-500/10 text-blue-700 border-blue-500/20'
        }
    }

    return (
        <div className="space-y-6">
            <div>
                <h1 className="text-3xl font-bold text-foreground mb-2">Enterprise Architecture Dashboard</h1>
                <p className="text-muted-foreground">Overview of your application portfolio, capabilities, and integrations</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Total Applications</CardTitle>
                        <Cube size={16} className="text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">{totalApps}</div>
                        <p className="text-xs text-muted-foreground">
                            {criticalApps} critical systems
                        </p>
                    </CardContent>
                </Card>

                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Business Capabilities</CardTitle>
                        <Buildings size={16} className="text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">{(capabilities || []).length}</div>
                        <p className="text-xs text-muted-foreground">
                            {criticalCapabilities} critical capabilities
                        </p>
                    </CardContent>
                </Card>

                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">System Interfaces</CardTitle>
                        <ShareNetwork size={16} className="text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">{totalInterfaces}</div>
                        <p className="text-xs text-muted-foreground">
                            Integration points
                        </p>
                    </CardContent>
                </Card>

                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Avg Health Score</CardTitle>
                        <Warning size={16} className="text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">{Math.round(avgHealthScore)}%</div>
                        <Progress value={avgHealthScore} className="mt-2" />
                    </CardContent>
                </Card>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <Card>
                    <CardHeader>
                        <CardTitle>Recent Applications</CardTitle>
                    </CardHeader>
                    <CardContent>
                        {(applications || []).length === 0 ? (
                            <div className="text-center py-8 text-muted-foreground">
                                <Cube size={48} className="mx-auto mb-4 opacity-50" />
                                <p>No applications registered yet</p>
                                <p className="text-sm">Start by adding your first application</p>
                            </div>
                        ) : (
                            <div className="space-y-3">
                                {(applications || []).slice(0, 5).map((app) => (
                                    <div key={app.id} className="flex items-center justify-between p-3 rounded-lg border">
                                        <div>
                                            <div className="font-medium">{app.name}</div>
                                            <div className="text-sm text-muted-foreground">
                                                Health: {app.healthScore || 0}%
                                            </div>
                                        </div>
                                        <div className="flex items-center gap-2">
                                            <Badge className={getLifecycleBadgeColor(app.lifecyclePhase)}>
                                                {app.lifecyclePhase}
                                            </Badge>
                                            <Badge variant="outline">
                                                {app.criticality}
                                            </Badge>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        )}
                    </CardContent>
                </Card>

                <Card>
                    <CardHeader>
                        <CardTitle>Capability Coverage</CardTitle>
                    </CardHeader>
                    <CardContent>
                        {(capabilities || []).length === 0 ? (
                            <div className="text-center py-8 text-muted-foreground">
                                <Buildings size={48} className="mx-auto mb-4 opacity-50" />
                                <p>No capabilities defined yet</p>
                                <p className="text-sm">Map your business capabilities first</p>
                            </div>
                        ) : (
                            <div className="space-y-4">
                                <div className="flex justify-between items-center">
                                    <span className="text-sm font-medium">Average Coverage</span>
                                    <span className="text-sm text-muted-foreground">{Math.round(avgCoverageScore)}%</span>
                                </div>
                                <Progress value={avgCoverageScore} />
                                
                                <div className="space-y-3">
                                    {(capabilities || []).slice(0, 4).map((cap) => (
                                        <div key={cap.id} className="flex items-center justify-between">
                                            <div className="text-sm">{cap.name}</div>
                                            <div className="flex items-center gap-2">
                                                <Progress value={cap.coverageScore || 0} className="w-20 h-2" />
                                                <span className="text-xs text-muted-foreground w-8">
                                                    {cap.coverageScore || 0}%
                                                </span>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        )}
                    </CardContent>
                </Card>
            </div>
        </div>
    )
}
import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Slider } from '@/components/ui/slider'
import { ArrowLeft, FloppyDisk } from '@phosphor-icons/react'
import { TagInput, TAG_SUGGESTIONS } from './components/TagInput'

interface Process {
    id: string
    name: string
    description?: string
    type: string
    category: string
    owner?: string
    maturityLevel: string
    automationLevel: string
    frequency: string
    criticality: string
    riskLevel: string
    compliance: string[]
    performanceMetrics: {
        cycleTime?: number
        cost?: number
        quality?: number
        satisfaction?: number
    }
    inputs: string[]
    outputs: string[]
    enabledBy: string[]
    supports: string[]
    tags: string[]
}

interface ProcessFormProps {
    process?: Process | null
    onSave: (data: Omit<Process, 'id'>) => void
    onCancel: () => void
}

export function ProcessForm({ process, onSave, onCancel }: ProcessFormProps) {
    const [formData, setFormData] = useState({
        name: process?.name || '',
        description: process?.description || '',
        type: process?.type || 'CORE',
        category: process?.category || '',
        owner: process?.owner || '',
        maturityLevel: process?.maturityLevel || 'DEFINED',
        automationLevel: process?.automationLevel || 'MANUAL',
        frequency: process?.frequency || 'DAILY',
        criticality: process?.criticality || 'MEDIUM',
        riskLevel: process?.riskLevel || 'MEDIUM',
        compliance: process?.compliance || [],
        performanceMetrics: {
            cycleTime: process?.performanceMetrics?.cycleTime || 0,
            cost: process?.performanceMetrics?.cost || 0,
            quality: process?.performanceMetrics?.quality || 85,
            satisfaction: process?.performanceMetrics?.satisfaction || 85
        },
        inputs: process?.inputs || [],
        outputs: process?.outputs || [],
        enabledBy: process?.enabledBy || [],
        supports: process?.supports || [],
        tags: process?.tags || []
    })

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault()
        onSave(formData)
    }

    const updateField = (field: string, value: any) => {
        setFormData(prev => ({ ...prev, [field]: value }))
    }

    const updateMetric = (metric: string, value: number) => {
        setFormData(prev => ({
            ...prev,
            performanceMetrics: {
                ...prev.performanceMetrics,
                [metric]: value
            }
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
                        {process ? 'Edit Process' : 'New Process'}
                    </h1>
                    <p className="text-muted-foreground">
                        {process ? 'Update process definition and metrics' : 'Define a new business process'}
                    </p>
                </div>
            </div>

            <form onSubmit={handleSubmit}>
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                    <div className="lg:col-span-2 space-y-6">
                        <Card>
                            <CardHeader>
                                <CardTitle>Basic Information</CardTitle>
                            </CardHeader>
                            <CardContent className="space-y-4">
                                <div>
                                    <Label htmlFor="name">Process Name</Label>
                                    <Input
                                        id="name"
                                        value={formData.name}
                                        onChange={(e) => updateField('name', e.target.value)}
                                        placeholder="e.g. Customer Onboarding"
                                        required
                                    />
                                </div>
                                
                                <div>
                                    <Label htmlFor="description">Description</Label>
                                    <Textarea
                                        id="description"
                                        value={formData.description}
                                        onChange={(e) => updateField('description', e.target.value)}
                                        placeholder="Describe the purpose and key activities of this process..."
                                        rows={3}
                                    />
                                </div>

                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    <div>
                                        <Label htmlFor="type">Process Type</Label>
                                        <Select value={formData.type} onValueChange={(value) => updateField('type', value)}>
                                            <SelectTrigger>
                                                <SelectValue />
                                            </SelectTrigger>
                                            <SelectContent>
                                                <SelectItem value="CORE">Core Process</SelectItem>
                                                <SelectItem value="SUPPORT">Support Process</SelectItem>
                                                <SelectItem value="MANAGEMENT">Management Process</SelectItem>
                                                <SelectItem value="GOVERNANCE">Governance Process</SelectItem>
                                            </SelectContent>
                                        </Select>
                                    </div>

                                    <div>
                                        <Label htmlFor="category">Category</Label>
                                        <Input
                                            id="category"
                                            value={formData.category}
                                            onChange={(e) => updateField('category', e.target.value)}
                                            placeholder="e.g. Sales, Finance, HR"
                                        />
                                    </div>
                                </div>

                                <div>
                                    <Label htmlFor="owner">Process Owner</Label>
                                    <Input
                                        id="owner"
                                        value={formData.owner}
                                        onChange={(e) => updateField('owner', e.target.value)}
                                        placeholder="e.g. Sales Director"
                                    />
                                </div>
                            </CardContent>
                        </Card>

                        <Card>
                            <CardHeader>
                                <CardTitle>Process Characteristics</CardTitle>
                            </CardHeader>
                            <CardContent className="space-y-4">
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    <div>
                                        <Label htmlFor="maturity">Maturity Level</Label>
                                        <Select value={formData.maturityLevel} onValueChange={(value) => updateField('maturityLevel', value)}>
                                            <SelectTrigger>
                                                <SelectValue />
                                            </SelectTrigger>
                                            <SelectContent>
                                                <SelectItem value="INITIAL">Initial (Ad-hoc)</SelectItem>
                                                <SelectItem value="DEFINED">Defined</SelectItem>
                                                <SelectItem value="STANDARDIZED">Standardized</SelectItem>
                                                <SelectItem value="MANAGED">Managed</SelectItem>
                                                <SelectItem value="OPTIMIZED">Optimized</SelectItem>
                                            </SelectContent>
                                        </Select>
                                    </div>

                                    <div>
                                        <Label htmlFor="automation">Automation Level</Label>
                                        <Select value={formData.automationLevel} onValueChange={(value) => updateField('automationLevel', value)}>
                                            <SelectTrigger>
                                                <SelectValue />
                                            </SelectTrigger>
                                            <SelectContent>
                                                <SelectItem value="MANUAL">Manual</SelectItem>
                                                <SelectItem value="SEMI_AUTOMATED">Semi-Automated</SelectItem>
                                                <SelectItem value="AUTOMATED">Automated</SelectItem>
                                                <SelectItem value="INTELLIGENT">Intelligent/AI</SelectItem>
                                            </SelectContent>
                                        </Select>
                                    </div>
                                </div>

                                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                                    <div>
                                        <Label htmlFor="frequency">Execution Frequency</Label>
                                        <Select value={formData.frequency} onValueChange={(value) => updateField('frequency', value)}>
                                            <SelectTrigger>
                                                <SelectValue />
                                            </SelectTrigger>
                                            <SelectContent>
                                                <SelectItem value="REAL_TIME">Real-time</SelectItem>
                                                <SelectItem value="HOURLY">Hourly</SelectItem>
                                                <SelectItem value="DAILY">Daily</SelectItem>
                                                <SelectItem value="WEEKLY">Weekly</SelectItem>
                                                <SelectItem value="MONTHLY">Monthly</SelectItem>
                                                <SelectItem value="QUARTERLY">Quarterly</SelectItem>
                                                <SelectItem value="ANNUALLY">Annually</SelectItem>
                                                <SelectItem value="ON_DEMAND">On-Demand</SelectItem>
                                            </SelectContent>
                                        </Select>
                                    </div>

                                    <div>
                                        <Label htmlFor="criticality">Business Criticality</Label>
                                        <Select value={formData.criticality} onValueChange={(value) => updateField('criticality', value)}>
                                            <SelectTrigger>
                                                <SelectValue />
                                            </SelectTrigger>
                                            <SelectContent>
                                                <SelectItem value="LOW">Low</SelectItem>
                                                <SelectItem value="MEDIUM">Medium</SelectItem>
                                                <SelectItem value="HIGH">High</SelectItem>
                                                <SelectItem value="CRITICAL">Critical</SelectItem>
                                            </SelectContent>
                                        </Select>
                                    </div>

                                    <div>
                                        <Label htmlFor="risk">Risk Level</Label>
                                        <Select value={formData.riskLevel} onValueChange={(value) => updateField('riskLevel', value)}>
                                            <SelectTrigger>
                                                <SelectValue />
                                            </SelectTrigger>
                                            <SelectContent>
                                                <SelectItem value="LOW">Low</SelectItem>
                                                <SelectItem value="MEDIUM">Medium</SelectItem>
                                                <SelectItem value="HIGH">High</SelectItem>
                                                <SelectItem value="CRITICAL">Critical</SelectItem>
                                            </SelectContent>
                                        </Select>
                                    </div>
                                </div>
                            </CardContent>
                        </Card>

                        <Card>
                            <CardHeader>
                                <CardTitle>Performance Metrics</CardTitle>
                            </CardHeader>
                            <CardContent className="space-y-6">
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    <div>
                                        <Label htmlFor="cycleTime">Cycle Time (hours)</Label>
                                        <Input
                                            id="cycleTime"
                                            type="number"
                                            min="0"
                                            step="0.1"
                                            value={formData.performanceMetrics.cycleTime || ''}
                                            onChange={(e) => updateMetric('cycleTime', Number(e.target.value))}
                                            placeholder="24"
                                        />
                                        <p className="text-xs text-muted-foreground mt-1">
                                            Average time from start to completion
                                        </p>
                                    </div>

                                    <div>
                                        <Label htmlFor="cost">Process Cost (per execution)</Label>
                                        <Input
                                            id="cost"
                                            type="number"
                                            min="0"
                                            step="0.01"
                                            value={formData.performanceMetrics.cost || ''}
                                            onChange={(e) => updateMetric('cost', Number(e.target.value))}
                                            placeholder="150.00"
                                        />
                                        <p className="text-xs text-muted-foreground mt-1">
                                            Average cost per process execution
                                        </p>
                                    </div>
                                </div>

                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    <div>
                                        <Label>Quality Score: {formData.performanceMetrics.quality}%</Label>
                                        <Slider
                                            value={[formData.performanceMetrics.quality || 85]}
                                            onValueChange={(value) => updateMetric('quality', value[0])}
                                            max={100}
                                            step={1}
                                            className="mt-2"
                                        />
                                        <p className="text-xs text-muted-foreground mt-1">
                                            Process quality and accuracy
                                        </p>
                                    </div>

                                    <div>
                                        <Label>Customer Satisfaction: {formData.performanceMetrics.satisfaction}%</Label>
                                        <Slider
                                            value={[formData.performanceMetrics.satisfaction || 85]}
                                            onValueChange={(value) => updateMetric('satisfaction', value[0])}
                                            max={100}
                                            step={1}
                                            className="mt-2"
                                        />
                                        <p className="text-xs text-muted-foreground mt-1">
                                            User/customer satisfaction score
                                        </p>
                                    </div>
                                </div>
                            </CardContent>
                        </Card>

                        <Card>
                            <CardHeader>
                                <CardTitle>Process Flow & Relationships</CardTitle>
                            </CardHeader>
                            <CardContent className="space-y-4">
                                <div>
                                    <Label>Process Inputs</Label>
                                    <TagInput
                                        tags={formData.inputs}
                                        onChange={(inputs) => updateField('inputs', inputs)}
                                        placeholder="Add process inputs (e.g. customer-data, application-form)"
                                        suggestions={TAG_SUGGESTIONS.process}
                                    />
                                </div>

                                <div>
                                    <Label>Process Outputs</Label>
                                    <TagInput
                                        tags={formData.outputs}
                                        onChange={(outputs) => updateField('outputs', outputs)}
                                        placeholder="Add process outputs (e.g. approval-decision, account-created)"
                                        suggestions={TAG_SUGGESTIONS.process}
                                    />
                                </div>

                                <div>
                                    <Label>Enabled By (Technologies/Applications)</Label>
                                    <TagInput
                                        tags={formData.enabledBy}
                                        onChange={(enabledBy) => updateField('enabledBy', enabledBy)}
                                        placeholder="Add enabling technologies or applications"
                                    />
                                </div>

                                <div>
                                    <Label>Supports (Business Capabilities)</Label>
                                    <TagInput
                                        tags={formData.supports}
                                        onChange={(supports) => updateField('supports', supports)}
                                        placeholder="Add business capabilities this process supports"
                                    />
                                </div>

                                <div>
                                    <Label>Compliance Requirements</Label>
                                    <TagInput
                                        tags={formData.compliance}
                                        onChange={(compliance) => updateField('compliance', compliance)}
                                        placeholder="Add compliance frameworks (e.g. GDPR, SOX, LGPD)"
                                    />
                                </div>

                                <div>
                                    <Label>Tags</Label>
                                    <TagInput
                                        tags={formData.tags}
                                        onChange={(tags) => updateField('tags', tags)}
                                        placeholder="Add descriptive tags"
                                        suggestions={TAG_SUGGESTIONS.process}
                                    />
                                </div>
                            </CardContent>
                        </Card>
                    </div>

                    <div className="space-y-6">
                        <Card>
                            <CardHeader>
                                <CardTitle>Quick Reference</CardTitle>
                            </CardHeader>
                            <CardContent className="space-y-4 text-sm">
                                <div>
                                    <h4 className="font-medium mb-2">Process Types</h4>
                                    <ul className="space-y-1 text-muted-foreground">
                                        <li><strong>Core:</strong> Value-creating processes</li>
                                        <li><strong>Support:</strong> Enable core processes</li>
                                        <li><strong>Management:</strong> Planning & control</li>
                                        <li><strong>Governance:</strong> Risk & compliance</li>
                                    </ul>
                                </div>
                                <div>
                                    <h4 className="font-medium mb-2">Automation Levels</h4>
                                    <ul className="space-y-1 text-muted-foreground">
                                        <li><strong>Manual:</strong> Human-performed</li>
                                        <li><strong>Semi:</strong> Partial automation</li>
                                        <li><strong>Automated:</strong> Fully automated</li>
                                        <li><strong>Intelligent:</strong> AI-driven</li>
                                    </ul>
                                </div>
                            </CardContent>
                        </Card>

                        <div className="flex flex-col gap-2">
                            <Button type="submit" className="gap-2">
                                <FloppyDisk size={16} />
                                {process ? 'Update Process' : 'Create Process'}
                            </Button>
                            <Button type="button" variant="outline" onClick={onCancel}>
                                Cancel
                            </Button>
                        </div>
                    </div>
                </div>
            </form>
        </div>
    )
}
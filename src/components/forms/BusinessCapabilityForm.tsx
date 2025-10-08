import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { ArrowLeft, FloppyDisk } from '@phosphor-icons/react'
import { TagInput } from './components/TagInput'

interface BusinessCapability {
    id: string
    name: string
    description?: string
    level: number
    parentId?: string
    maturityLevel: string
    businessImportance: string
    investmentPriority: string
    riskLevel: string
    owner?: string
    tags: string[]
    supportingProcesses?: string[]
    enabledBy?: string[]
}

interface BusinessCapabilityFormProps {
    capability?: BusinessCapability | null
    onSave: (data: Omit<BusinessCapability, 'id'>) => void
    onCancel: () => void
    availableCapabilities?: BusinessCapability[]
}

export function BusinessCapabilityForm({ capability, onSave, onCancel, availableCapabilities = [] }: BusinessCapabilityFormProps) {
    const [formData, setFormData] = useState({
        name: capability?.name || '',
        description: capability?.description || '',
        level: capability?.level || 1,
        parentId: capability?.parentId || '',
        maturityLevel: capability?.maturityLevel || 'DEFINED',
        businessImportance: capability?.businessImportance || 'MEDIUM',
        investmentPriority: capability?.investmentPriority || 'MEDIUM',
        riskLevel: capability?.riskLevel || 'MEDIUM',
        owner: capability?.owner || '',
        tags: capability?.tags || [],
        supportingProcesses: capability?.supportingProcesses || [],
        enabledBy: capability?.enabledBy || []
    })

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault()
        onSave(formData)
    }

    const updateField = (field: string, value: any) => {
        setFormData(prev => ({ ...prev, [field]: value }))
    }

    // Filter parent capabilities (only those at lower levels)
    const possibleParents = availableCapabilities.filter(cap => 
        cap.level < formData.level && cap.id !== capability?.id
    )

    return (
        <div className="space-y-6">
            <div className="flex items-center gap-4">
                <Button variant="ghost" size="sm" onClick={onCancel}>
                    <ArrowLeft size={16} />
                </Button>
                <div>
                    <h1 className="text-3xl font-bold text-foreground">
                        {capability ? 'Edit Business Capability' : 'New Business Capability'}
                    </h1>
                    <p className="text-muted-foreground">
                        {capability ? 'Update capability definition and attributes' : 'Define a new business capability'}
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
                                    <Label htmlFor="name">Capability Name</Label>
                                    <Input
                                        id="name"
                                        value={formData.name}
                                        onChange={(e) => updateField('name', e.target.value)}
                                        placeholder="e.g. Customer Relationship Management"
                                        required
                                    />
                                </div>
                                
                                <div>
                                    <Label htmlFor="description">Description</Label>
                                    <Textarea
                                        id="description"
                                        value={formData.description}
                                        onChange={(e) => updateField('description', e.target.value)}
                                        placeholder="Describe what this capability enables the organization to do..."
                                        rows={3}
                                    />
                                </div>

                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    <div>
                                        <Label htmlFor="level">Capability Level</Label>
                                        <Select value={formData.level.toString()} onValueChange={(value) => updateField('level', Number(value))}>
                                            <SelectTrigger>
                                                <SelectValue />
                                            </SelectTrigger>
                                            <SelectContent>
                                                <SelectItem value="1">Level 1 (Strategic)</SelectItem>
                                                <SelectItem value="2">Level 2 (Tactical)</SelectItem>
                                                <SelectItem value="3">Level 3 (Operational)</SelectItem>
                                                <SelectItem value="4">Level 4 (Detailed)</SelectItem>
                                            </SelectContent>
                                        </Select>
                                    </div>

                                    <div>
                                        <Label htmlFor="parent">Parent Capability</Label>
                                        <Select value={formData.parentId} onValueChange={(value) => updateField('parentId', value)}>
                                            <SelectTrigger>
                                                <SelectValue placeholder="Select parent capability" />
                                            </SelectTrigger>
                                            <SelectContent>
                                                <SelectItem value="">None (Top Level)</SelectItem>
                                                {possibleParents.map((parent) => (
                                                    <SelectItem key={parent.id} value={parent.id}>
                                                        {parent.name}
                                                    </SelectItem>
                                                ))}
                                            </SelectContent>
                                        </Select>
                                    </div>
                                </div>

                                <div>
                                    <Label htmlFor="owner">Business Owner</Label>
                                    <Input
                                        id="owner"
                                        value={formData.owner}
                                        onChange={(e) => updateField('owner', e.target.value)}
                                        placeholder="e.g. Customer Experience Director"
                                    />
                                </div>
                            </CardContent>
                        </Card>

                        <Card>
                            <CardHeader>
                                <CardTitle>Assessment</CardTitle>
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
                                        <Label htmlFor="importance">Business Importance</Label>
                                        <Select value={formData.businessImportance} onValueChange={(value) => updateField('businessImportance', value)}>
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

                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    <div>
                                        <Label htmlFor="investment">Investment Priority</Label>
                                        <Select value={formData.investmentPriority} onValueChange={(value) => updateField('investmentPriority', value)}>
                                            <SelectTrigger>
                                                <SelectValue />
                                            </SelectTrigger>
                                            <SelectContent>
                                                <SelectItem value="LOW">Low</SelectItem>
                                                <SelectItem value="MEDIUM">Medium</SelectItem>
                                                <SelectItem value="HIGH">High</SelectItem>
                                                <SelectItem value="URGENT">Urgent</SelectItem>
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
                                <CardTitle>Relationships & Tags</CardTitle>
                            </CardHeader>
                            <CardContent className="space-y-4">
                                <div>
                                    <Label>Tags</Label>
                                    <TagInput
                                        tags={formData.tags}
                                        onChange={(tags) => updateField('tags', tags)}
                                        placeholder="Add tags (e.g. customer-facing, core-process, digital)"
                                    />
                                </div>

                                <div>
                                    <Label>Supporting Processes</Label>
                                    <TagInput
                                        tags={formData.supportingProcesses}
                                        onChange={(processes) => updateField('supportingProcesses', processes)}
                                        placeholder="Add process names that support this capability"
                                    />
                                </div>

                                <div>
                                    <Label>Enabled By (Technologies/Applications)</Label>
                                    <TagInput
                                        tags={formData.enabledBy}
                                        onChange={(enablers) => updateField('enabledBy', enablers)}
                                        placeholder="Add technologies or applications that enable this capability"
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
                                    <h4 className="font-medium mb-2">Maturity Levels</h4>
                                    <ul className="space-y-1 text-muted-foreground">
                                        <li><strong>Initial:</strong> Ad-hoc, reactive</li>
                                        <li><strong>Defined:</strong> Documented processes</li>
                                        <li><strong>Standardized:</strong> Consistent execution</li>
                                        <li><strong>Managed:</strong> Measured and controlled</li>
                                        <li><strong>Optimized:</strong> Continuously improved</li>
                                    </ul>
                                </div>
                                <div>
                                    <h4 className="font-medium mb-2">Capability Levels</h4>
                                    <ul className="space-y-1 text-muted-foreground">
                                        <li><strong>L1:</strong> Strategic capabilities</li>
                                        <li><strong>L2:</strong> Tactical capabilities</li>
                                        <li><strong>L3:</strong> Operational capabilities</li>
                                        <li><strong>L4:</strong> Detailed sub-capabilities</li>
                                    </ul>
                                </div>
                            </CardContent>
                        </Card>

                        <div className="flex flex-col gap-2">
                            <Button type="submit" className="gap-2">
                                <FloppyDisk size={16} />
                                {capability ? 'Update Capability' : 'Create Capability'}
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
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

interface Technology {
    id: string
    name: string
    description?: string
    category: string
    type: string
    vendor?: string
    version?: string
    licenseModel: string
    deploymentModel: string
    lifecyclePhase: string
    supportLevel: string
    securityRating: number
    performanceRating: number
    scalabilityRating: number
    maintainabilityRating: number
    costEffectivenessRating: number
    technicalDebt: number
    endOfLifeDate?: string
    lastAssessmentDate?: string
    compliance: string[]
    capabilities: string[]
    integrationPoints: string[]
    dependencies: string[]
    tags: string[]
}

interface TechnologyFormProps {
    technology?: Technology | null
    onSave: (data: Omit<Technology, 'id'>) => void
    onCancel: () => void
}

export function TechnologyForm({ technology, onSave, onCancel }: TechnologyFormProps) {
    const [formData, setFormData] = useState({
        name: technology?.name || '',
        description: technology?.description || '',
        category: technology?.category || 'APPLICATION',
        type: technology?.type || 'COMMERCIAL',
        vendor: technology?.vendor || '',
        version: technology?.version || '',
        licenseModel: technology?.licenseModel || 'COMMERCIAL',
        deploymentModel: technology?.deploymentModel || 'ON_PREMISE',
        lifecyclePhase: technology?.lifecyclePhase || 'PRODUCTION',
        supportLevel: technology?.supportLevel || 'VENDOR',
        securityRating: technology?.securityRating || 75,
        performanceRating: technology?.performanceRating || 75,
        scalabilityRating: technology?.scalabilityRating || 75,
        maintainabilityRating: technology?.maintainabilityRating || 75,
        costEffectivenessRating: technology?.costEffectivenessRating || 75,
        technicalDebt: technology?.technicalDebt || 25,
        endOfLifeDate: technology?.endOfLifeDate || '',
        lastAssessmentDate: technology?.lastAssessmentDate || new Date().toISOString().split('T')[0],
        compliance: technology?.compliance || [],
        capabilities: technology?.capabilities || [],
        integrationPoints: technology?.integrationPoints || [],
        dependencies: technology?.dependencies || [],
        tags: technology?.tags || []
    })

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault()
        onSave(formData)
    }

    const updateField = (field: string, value: any) => {
        setFormData(prev => ({ ...prev, [field]: value }))
    }

    return (
        <div className="space-y-6">
            <div className="flex items-center gap-4">
                <Button variant="ghost" size="sm" onClick={onCancel}>
                    <ArrowLeft size={16} />
                </Button>
                <div>
                    <h1 className="text-3xl font-bold text-foreground">
                        {technology ? 'Edit Technology' : 'New Technology'}
                    </h1>
                    <p className="text-muted-foreground">
                        {technology ? 'Update technology definition and assessment' : 'Add a new technology to your inventory'}
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
                                    <Label htmlFor="name">Technology Name</Label>
                                    <Input
                                        id="name"
                                        value={formData.name}
                                        onChange={(e) => updateField('name', e.target.value)}
                                        placeholder="e.g. Oracle Database, Microsoft SQL Server"
                                        required
                                    />
                                </div>
                                
                                <div>
                                    <Label htmlFor="description">Description</Label>
                                    <Textarea
                                        id="description"
                                        value={formData.description}
                                        onChange={(e) => updateField('description', e.target.value)}
                                        placeholder="Describe the technology's purpose and key features..."
                                        rows={3}
                                    />
                                </div>

                                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                                    <div>
                                        <Label htmlFor="vendor">Vendor</Label>
                                        <Input
                                            id="vendor"
                                            value={formData.vendor}
                                            onChange={(e) => updateField('vendor', e.target.value)}
                                            placeholder="e.g. Microsoft, Oracle"
                                        />
                                    </div>

                                    <div>
                                        <Label htmlFor="version">Version</Label>
                                        <Input
                                            id="version"
                                            value={formData.version}
                                            onChange={(e) => updateField('version', e.target.value)}
                                            placeholder="e.g. 19c, 2022"
                                        />
                                    </div>

                                    <div>
                                        <Label htmlFor="category">Category</Label>
                                        <Select value={formData.category} onValueChange={(value) => updateField('category', value)}>
                                            <SelectTrigger>
                                                <SelectValue />
                                            </SelectTrigger>
                                            <SelectContent>
                                                <SelectItem value="APPLICATION">Application</SelectItem>
                                                <SelectItem value="DATABASE">Database</SelectItem>
                                                <SelectItem value="MIDDLEWARE">Middleware</SelectItem>
                                                <SelectItem value="INFRASTRUCTURE">Infrastructure</SelectItem>
                                                <SelectItem value="PLATFORM">Platform</SelectItem>
                                                <SelectItem value="INTEGRATION">Integration</SelectItem>
                                                <SelectItem value="SECURITY">Security</SelectItem>
                                                <SelectItem value="ANALYTICS">Analytics</SelectItem>
                                                <SelectItem value="DEVELOPMENT">Development</SelectItem>
                                            </SelectContent>
                                        </Select>
                                    </div>
                                </div>

                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    <div>
                                        <Label htmlFor="type">Type</Label>
                                        <Select value={formData.type} onValueChange={(value) => updateField('type', value)}>
                                            <SelectTrigger>
                                                <SelectValue />
                                            </SelectTrigger>
                                            <SelectContent>
                                                <SelectItem value="COMMERCIAL">Commercial</SelectItem>
                                                <SelectItem value="OPEN_SOURCE">Open Source</SelectItem>
                                                <SelectItem value="PROPRIETARY">Proprietary</SelectItem>
                                                <SelectItem value="CUSTOM">Custom Developed</SelectItem>
                                                <SelectItem value="CLOUD_NATIVE">Cloud Native</SelectItem>
                                            </SelectContent>
                                        </Select>
                                    </div>

                                    <div>
                                        <Label htmlFor="license">License Model</Label>
                                        <Select value={formData.licenseModel} onValueChange={(value) => updateField('licenseModel', value)}>
                                            <SelectTrigger>
                                                <SelectValue />
                                            </SelectTrigger>
                                            <SelectContent>
                                                <SelectItem value="COMMERCIAL">Commercial License</SelectItem>
                                                <SelectItem value="SUBSCRIPTION">Subscription</SelectItem>
                                                <SelectItem value="OPEN_SOURCE">Open Source</SelectItem>
                                                <SelectItem value="FREEMIUM">Freemium</SelectItem>
                                                <SelectItem value="PERPETUAL">Perpetual License</SelectItem>
                                                <SelectItem value="USAGE_BASED">Usage-Based</SelectItem>
                                            </SelectContent>
                                        </Select>
                                    </div>
                                </div>
                            </CardContent>
                        </Card>

                        <Card>
                            <CardHeader>
                                <CardTitle>Deployment & Lifecycle</CardTitle>
                            </CardHeader>
                            <CardContent className="space-y-4">
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    <div>
                                        <Label htmlFor="deployment">Deployment Model</Label>
                                        <Select value={formData.deploymentModel} onValueChange={(value) => updateField('deploymentModel', value)}>
                                            <SelectTrigger>
                                                <SelectValue />
                                            </SelectTrigger>
                                            <SelectContent>
                                                <SelectItem value="ON_PREMISE">On-Premise</SelectItem>
                                                <SelectItem value="PRIVATE_CLOUD">Private Cloud</SelectItem>
                                                <SelectItem value="PUBLIC_CLOUD">Public Cloud</SelectItem>
                                                <SelectItem value="HYBRID">Hybrid</SelectItem>
                                                <SelectItem value="SAAS">Software as a Service</SelectItem>
                                                <SelectItem value="PAAS">Platform as a Service</SelectItem>
                                                <SelectItem value="IAAS">Infrastructure as a Service</SelectItem>
                                            </SelectContent>
                                        </Select>
                                    </div>

                                    <div>
                                        <Label htmlFor="lifecycle">Lifecycle Phase</Label>
                                        <Select value={formData.lifecyclePhase} onValueChange={(value) => updateField('lifecyclePhase', value)}>
                                            <SelectTrigger>
                                                <SelectValue />
                                            </SelectTrigger>
                                            <SelectContent>
                                                <SelectItem value="EVALUATION">Evaluation</SelectItem>
                                                <SelectItem value="PILOT">Pilot</SelectItem>
                                                <SelectItem value="PRODUCTION">Production</SelectItem>
                                                <SelectItem value="MAINTENANCE">Maintenance</SelectItem>
                                                <SelectItem value="SUNSET">Sunset</SelectItem>
                                                <SelectItem value="RETIRED">Retired</SelectItem>
                                            </SelectContent>
                                        </Select>
                                    </div>
                                </div>

                                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                                    <div>
                                        <Label htmlFor="support">Support Level</Label>
                                        <Select value={formData.supportLevel} onValueChange={(value) => updateField('supportLevel', value)}>
                                            <SelectTrigger>
                                                <SelectValue />
                                            </SelectTrigger>
                                            <SelectContent>
                                                <SelectItem value="VENDOR">Vendor Support</SelectItem>
                                                <SelectItem value="INTERNAL">Internal Support</SelectItem>
                                                <SelectItem value="COMMUNITY">Community Support</SelectItem>
                                                <SelectItem value="PARTNER">Partner Support</SelectItem>
                                                <SelectItem value="NONE">No Support</SelectItem>
                                            </SelectContent>
                                        </Select>
                                    </div>

                                    <div>
                                        <Label htmlFor="eol">End of Life Date</Label>
                                        <Input
                                            id="eol"
                                            type="date"
                                            value={formData.endOfLifeDate}
                                            onChange={(e) => updateField('endOfLifeDate', e.target.value)}
                                        />
                                    </div>

                                    <div>
                                        <Label htmlFor="assessment">Last Assessment</Label>
                                        <Input
                                            id="assessment"
                                            type="date"
                                            value={formData.lastAssessmentDate}
                                            onChange={(e) => updateField('lastAssessmentDate', e.target.value)}
                                        />
                                    </div>
                                </div>
                            </CardContent>
                        </Card>

                        <Card>
                            <CardHeader>
                                <CardTitle>Technology Assessment</CardTitle>
                            </CardHeader>
                            <CardContent className="space-y-6">
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    <div>
                                        <Label>Security Rating: {formData.securityRating}%</Label>
                                        <Slider
                                            value={[formData.securityRating]}
                                            onValueChange={(value) => updateField('securityRating', value[0])}
                                            max={100}
                                            step={5}
                                            className="mt-2"
                                        />
                                        <p className="text-xs text-muted-foreground mt-1">
                                            Security posture and vulnerability management
                                        </p>
                                    </div>

                                    <div>
                                        <Label>Performance Rating: {formData.performanceRating}%</Label>
                                        <Slider
                                            value={[formData.performanceRating]}
                                            onValueChange={(value) => updateField('performanceRating', value[0])}
                                            max={100}
                                            step={5}
                                            className="mt-2"
                                        />
                                        <p className="text-xs text-muted-foreground mt-1">
                                            Speed, throughput, and response times
                                        </p>
                                    </div>
                                </div>

                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    <div>
                                        <Label>Scalability Rating: {formData.scalabilityRating}%</Label>
                                        <Slider
                                            value={[formData.scalabilityRating]}
                                            onValueChange={(value) => updateField('scalabilityRating', value[0])}
                                            max={100}
                                            step={5}
                                            className="mt-2"
                                        />
                                        <p className="text-xs text-muted-foreground mt-1">
                                            Ability to handle growth and load
                                        </p>
                                    </div>

                                    <div>
                                        <Label>Maintainability: {formData.maintainabilityRating}%</Label>
                                        <Slider
                                            value={[formData.maintainabilityRating]}
                                            onValueChange={(value) => updateField('maintainabilityRating', value[0])}
                                            max={100}
                                            step={5}
                                            className="mt-2"
                                        />
                                        <p className="text-xs text-muted-foreground mt-1">
                                            Ease of maintenance and updates
                                        </p>
                                    </div>
                                </div>

                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    <div>
                                        <Label>Cost Effectiveness: {formData.costEffectivenessRating}%</Label>
                                        <Slider
                                            value={[formData.costEffectivenessRating]}
                                            onValueChange={(value) => updateField('costEffectivenessRating', value[0])}
                                            max={100}
                                            step={5}
                                            className="mt-2"
                                        />
                                        <p className="text-xs text-muted-foreground mt-1">
                                            Value for money and TCO considerations
                                        </p>
                                    </div>

                                    <div>
                                        <Label>Technical Debt: {formData.technicalDebt}%</Label>
                                        <Slider
                                            value={[formData.technicalDebt]}
                                            onValueChange={(value) => updateField('technicalDebt', value[0])}
                                            max={100}
                                            step={5}
                                            className="mt-2"
                                        />
                                        <p className="text-xs text-muted-foreground mt-1">
                                            Accumulated technical debt and modernization needs
                                        </p>
                                    </div>
                                </div>
                            </CardContent>
                        </Card>

                        <Card>
                            <CardHeader>
                                <CardTitle>Relationships & Compliance</CardTitle>
                            </CardHeader>
                            <CardContent className="space-y-4">
                                <div>
                                    <Label>Capabilities Provided</Label>
                                    <TagInput
                                        tags={formData.capabilities}
                                        onChange={(capabilities) => updateField('capabilities', capabilities)}
                                        placeholder="Add technical capabilities this technology provides"
                                        suggestions={TAG_SUGGESTIONS.technology}
                                    />
                                </div>

                                <div>
                                    <Label>Integration Points</Label>
                                    <TagInput
                                        tags={formData.integrationPoints}
                                        onChange={(integrations) => updateField('integrationPoints', integrations)}
                                        placeholder="Add systems or technologies this integrates with"
                                    />
                                </div>

                                <div>
                                    <Label>Dependencies</Label>
                                    <TagInput
                                        tags={formData.dependencies}
                                        onChange={(dependencies) => updateField('dependencies', dependencies)}
                                        placeholder="Add technologies this depends on"
                                    />
                                </div>

                                <div>
                                    <Label>Compliance Standards</Label>
                                    <TagInput
                                        tags={formData.compliance}
                                        onChange={(compliance) => updateField('compliance', compliance)}
                                        placeholder="Add compliance standards (e.g. ISO27001, GDPR, SOC2)"
                                    />
                                </div>

                                <div>
                                    <Label>Tags</Label>
                                    <TagInput
                                        tags={formData.tags}
                                        onChange={(tags) => updateField('tags', tags)}
                                        placeholder="Add descriptive tags"
                                        suggestions={TAG_SUGGESTIONS.technology}
                                    />
                                </div>
                            </CardContent>
                        </Card>
                    </div>

                    <div className="space-y-6">
                        <Card>
                            <CardHeader>
                                <CardTitle>Assessment Summary</CardTitle>
                            </CardHeader>
                            <CardContent className="space-y-4">
                                <div className="space-y-3">
                                    <div className="flex justify-between items-center">
                                        <span className="text-sm font-medium">Overall Health</span>
                                        <span className={`text-sm font-semibold ${
                                            ((formData.securityRating + formData.performanceRating + formData.scalabilityRating + formData.maintainabilityRating + formData.costEffectivenessRating) / 5) >= 80 
                                                ? 'text-green-600' 
                                                : ((formData.securityRating + formData.performanceRating + formData.scalabilityRating + formData.maintainabilityRating + formData.costEffectivenessRating) / 5) >= 60 
                                                ? 'text-yellow-600' 
                                                : 'text-red-600'
                                        }`}>
                                            {Math.round((formData.securityRating + formData.performanceRating + formData.scalabilityRating + formData.maintainabilityRating + formData.costEffectivenessRating) / 5)}%
                                        </span>
                                    </div>
                                    <div className="h-2 bg-muted rounded-full overflow-hidden">
                                        <div 
                                            className={`h-full rounded-full transition-all ${
                                                ((formData.securityRating + formData.performanceRating + formData.scalabilityRating + formData.maintainabilityRating + formData.costEffectivenessRating) / 5) >= 80 
                                                    ? 'bg-green-500' 
                                                    : ((formData.securityRating + formData.performanceRating + formData.scalabilityRating + formData.maintainabilityRating + formData.costEffectivenessRating) / 5) >= 60 
                                                    ? 'bg-yellow-500' 
                                                    : 'bg-red-500'
                                            }`}
                                            style={{ width: `${(formData.securityRating + formData.performanceRating + formData.scalabilityRating + formData.maintainabilityRating + formData.costEffectivenessRating) / 5}%` }}
                                        />
                                    </div>
                                </div>

                                <div className="pt-4 space-y-2 text-sm">
                                    <div className="flex justify-between">
                                        <span className="text-muted-foreground">Security</span>
                                        <span>{formData.securityRating}%</span>
                                    </div>
                                    <div className="flex justify-between">
                                        <span className="text-muted-foreground">Performance</span>
                                        <span>{formData.performanceRating}%</span>
                                    </div>
                                    <div className="flex justify-between">
                                        <span className="text-muted-foreground">Scalability</span>
                                        <span>{formData.scalabilityRating}%</span>
                                    </div>
                                    <div className="flex justify-between">
                                        <span className="text-muted-foreground">Maintainability</span>
                                        <span>{formData.maintainabilityRating}%</span>
                                    </div>
                                    <div className="flex justify-between">
                                        <span className="text-muted-foreground">Cost Effectiveness</span>
                                        <span>{formData.costEffectivenessRating}%</span>
                                    </div>
                                    <div className="flex justify-between border-t pt-2">
                                        <span className="text-muted-foreground">Technical Debt</span>
                                        <span className={formData.technicalDebt > 70 ? 'text-red-600' : formData.technicalDebt > 40 ? 'text-yellow-600' : 'text-green-600'}>
                                            {formData.technicalDebt}%
                                        </span>
                                    </div>
                                </div>
                            </CardContent>
                        </Card>

                        <Card>
                            <CardHeader>
                                <CardTitle>Quick Reference</CardTitle>
                            </CardHeader>
                            <CardContent className="space-y-4 text-sm">
                                <div>
                                    <h4 className="font-medium mb-2">Assessment Guidelines</h4>
                                    <ul className="space-y-1 text-muted-foreground">
                                        <li><strong>80-100%:</strong> Excellent condition</li>
                                        <li><strong>60-79%:</strong> Good, minor issues</li>
                                        <li><strong>40-59%:</strong> Needs attention</li>
                                        <li><strong>0-39%:</strong> Critical issues</li>
                                    </ul>
                                </div>
                            </CardContent>
                        </Card>

                        <div className="flex flex-col gap-2">
                            <Button type="submit" className="gap-2">
                                <FloppyDisk size={16} />
                                {technology ? 'Update Technology' : 'Create Technology'}
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
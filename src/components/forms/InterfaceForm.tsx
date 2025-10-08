import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Slider } from '@/components/ui/slider'
import { Switch } from '@/components/ui/switch'
import { ArrowLeft, FloppyDisk } from '@phosphor-icons/react'
import { TagInput, TAG_SUGGESTIONS } from './components/TagInput'

interface Interface {
    id: string
    name: string
    description?: string
    type: string
    protocol: string
    direction: string
    frequency: string
    volume: string
    criticality: string
    sourceSystem: string
    targetSystem: string
    dataFormat: string
    authenticationType: string
    encryptionLevel: string
    monitoringLevel: string
    availability: number
    performance: number
    reliability: number
    security: number
    isRealTime: boolean
    isBidirectional: boolean
    errorHandling: string
    backupStrategy: string
    lastTested?: string
    nextReview?: string
    dataElements: string[]
    businessRules: string[]
    errorScenarios: string[]
    dependencies: string[]
    tags: string[]
}

interface InterfaceFormProps {
    interfaceData?: Interface | null
    onSave: (data: Omit<Interface, 'id'>) => void
    onCancel: () => void
    availableSystems?: string[]
}

export function InterfaceForm({ interfaceData, onSave, onCancel, availableSystems = [] }: InterfaceFormProps) {
    const [formData, setFormData] = useState({
        name: interfaceData?.name || '',
        description: interfaceData?.description || '',
        type: interfaceData?.type || 'API',
        protocol: interfaceData?.protocol || 'REST',
        direction: interfaceData?.direction || 'OUTBOUND',
        frequency: interfaceData?.frequency || 'REAL_TIME',
        volume: interfaceData?.volume || 'MEDIUM',
        criticality: interfaceData?.criticality || 'MEDIUM',
        sourceSystem: interfaceData?.sourceSystem || '',
        targetSystem: interfaceData?.targetSystem || '',
        dataFormat: interfaceData?.dataFormat || 'JSON',
        authenticationType: interfaceData?.authenticationType || 'API_KEY',
        encryptionLevel: interfaceData?.encryptionLevel || 'TLS',
        monitoringLevel: interfaceData?.monitoringLevel || 'STANDARD',
        availability: interfaceData?.availability || 99,
        performance: interfaceData?.performance || 85,
        reliability: interfaceData?.reliability || 90,
        security: interfaceData?.security || 85,
        isRealTime: interfaceData?.isRealTime || false,
        isBidirectional: interfaceData?.isBidirectional || false,
        errorHandling: interfaceData?.errorHandling || 'RETRY',
        backupStrategy: interfaceData?.backupStrategy || 'QUEUE',
        lastTested: interfaceData?.lastTested || '',
        nextReview: interfaceData?.nextReview || '',
        dataElements: interfaceData?.dataElements || [],
        businessRules: interfaceData?.businessRules || [],
        errorScenarios: interfaceData?.errorScenarios || [],
        dependencies: interfaceData?.dependencies || [],
        tags: interfaceData?.tags || []
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
                        {interfaceData ? 'Edit Interface' : 'New Interface'}
                    </h1>
                    <p className="text-muted-foreground">
                        {interfaceData ? 'Update interface definition and configuration' : 'Define a new system interface'}
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
                                    <Label htmlFor="name">Interface Name</Label>
                                    <Input
                                        id="name"
                                        value={formData.name}
                                        onChange={(e) => updateField('name', e.target.value)}
                                        placeholder="e.g. CRM-ERP Customer Sync, Payment Gateway API"
                                        required
                                    />
                                </div>
                                
                                <div>
                                    <Label htmlFor="description">Description</Label>
                                    <Textarea
                                        id="description"
                                        value={formData.description}
                                        onChange={(e) => updateField('description', e.target.value)}
                                        placeholder="Describe the interface purpose and data flow..."
                                        rows={3}
                                    />
                                </div>

                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    <div>
                                        <Label htmlFor="sourceSystem">Source System</Label>
                                        <Select value={formData.sourceSystem} onValueChange={(value) => updateField('sourceSystem', value)}>
                                            <SelectTrigger>
                                                <SelectValue placeholder="Select source system" />
                                            </SelectTrigger>
                                            <SelectContent>
                                                {availableSystems.map((system) => (
                                                    <SelectItem key={system} value={system}>
                                                        {system}
                                                    </SelectItem>
                                                ))}
                                                <SelectItem value="EXTERNAL">External System</SelectItem>
                                                <SelectItem value="MANUAL">Manual Process</SelectItem>
                                            </SelectContent>
                                        </Select>
                                    </div>

                                    <div>
                                        <Label htmlFor="targetSystem">Target System</Label>
                                        <Select value={formData.targetSystem} onValueChange={(value) => updateField('targetSystem', value)}>
                                            <SelectTrigger>
                                                <SelectValue placeholder="Select target system" />
                                            </SelectTrigger>
                                            <SelectContent>
                                                {availableSystems.map((system) => (
                                                    <SelectItem key={system} value={system}>
                                                        {system}
                                                    </SelectItem>
                                                ))}
                                                <SelectItem value="EXTERNAL">External System</SelectItem>
                                                <SelectItem value="MANUAL">Manual Process</SelectItem>
                                            </SelectContent>
                                        </Select>
                                    </div>
                                </div>
                            </CardContent>
                        </Card>

                        <Card>
                            <CardHeader>
                                <CardTitle>Technical Configuration</CardTitle>
                            </CardHeader>
                            <CardContent className="space-y-4">
                                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                                    <div>
                                        <Label htmlFor="type">Interface Type</Label>
                                        <Select value={formData.type} onValueChange={(value) => updateField('type', value)}>
                                            <SelectTrigger>
                                                <SelectValue />
                                            </SelectTrigger>
                                            <SelectContent>
                                                <SelectItem value="API">API</SelectItem>
                                                <SelectItem value="DATABASE">Database</SelectItem>
                                                <SelectItem value="FILE">File Transfer</SelectItem>
                                                <SelectItem value="MESSAGE_QUEUE">Message Queue</SelectItem>
                                                <SelectItem value="WEB_SERVICE">Web Service</SelectItem>
                                                <SelectItem value="BATCH">Batch Process</SelectItem>
                                                <SelectItem value="STREAM">Data Stream</SelectItem>
                                                <SelectItem value="UI">User Interface</SelectItem>
                                            </SelectContent>
                                        </Select>
                                    </div>

                                    <div>
                                        <Label htmlFor="protocol">Protocol</Label>
                                        <Select value={formData.protocol} onValueChange={(value) => updateField('protocol', value)}>
                                            <SelectTrigger>
                                                <SelectValue />
                                            </SelectTrigger>
                                            <SelectContent>
                                                <SelectItem value="REST">REST</SelectItem>
                                                <SelectItem value="SOAP">SOAP</SelectItem>
                                                <SelectItem value="GRAPHQL">GraphQL</SelectItem>
                                                <SelectItem value="HTTP">HTTP</SelectItem>
                                                <SelectItem value="HTTPS">HTTPS</SelectItem>
                                                <SelectItem value="FTP">FTP</SelectItem>
                                                <SelectItem value="SFTP">SFTP</SelectItem>
                                                <SelectItem value="MQTT">MQTT</SelectItem>
                                                <SelectItem value="WEBSOCKET">WebSocket</SelectItem>
                                                <SelectItem value="TCP">TCP</SelectItem>
                                                <SelectItem value="UDP">UDP</SelectItem>
                                            </SelectContent>
                                        </Select>
                                    </div>

                                    <div>
                                        <Label htmlFor="dataFormat">Data Format</Label>
                                        <Select value={formData.dataFormat} onValueChange={(value) => updateField('dataFormat', value)}>
                                            <SelectTrigger>
                                                <SelectValue />
                                            </SelectTrigger>
                                            <SelectContent>
                                                <SelectItem value="JSON">JSON</SelectItem>
                                                <SelectItem value="XML">XML</SelectItem>
                                                <SelectItem value="CSV">CSV</SelectItem>
                                                <SelectItem value="AVRO">Avro</SelectItem>
                                                <SelectItem value="PARQUET">Parquet</SelectItem>
                                                <SelectItem value="BINARY">Binary</SelectItem>
                                                <SelectItem value="TEXT">Plain Text</SelectItem>
                                                <SelectItem value="EDI">EDI</SelectItem>
                                            </SelectContent>
                                        </Select>
                                    </div>
                                </div>

                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    <div>
                                        <Label htmlFor="direction">Direction</Label>
                                        <Select value={formData.direction} onValueChange={(value) => updateField('direction', value)}>
                                            <SelectTrigger>
                                                <SelectValue />
                                            </SelectTrigger>
                                            <SelectContent>
                                                <SelectItem value="INBOUND">Inbound</SelectItem>
                                                <SelectItem value="OUTBOUND">Outbound</SelectItem>
                                                <SelectItem value="BIDIRECTIONAL">Bidirectional</SelectItem>
                                            </SelectContent>
                                        </Select>
                                    </div>

                                    <div>
                                        <Label htmlFor="frequency">Execution Frequency</Label>
                                        <Select value={formData.frequency} onValueChange={(value) => updateField('frequency', value)}>
                                            <SelectTrigger>
                                                <SelectValue />
                                            </SelectTrigger>
                                            <SelectContent>
                                                <SelectItem value="REAL_TIME">Real-time</SelectItem>
                                                <SelectItem value="EVERY_MINUTE">Every Minute</SelectItem>
                                                <SelectItem value="EVERY_5_MIN">Every 5 Minutes</SelectItem>
                                                <SelectItem value="HOURLY">Hourly</SelectItem>
                                                <SelectItem value="DAILY">Daily</SelectItem>
                                                <SelectItem value="WEEKLY">Weekly</SelectItem>
                                                <SelectItem value="ON_DEMAND">On-Demand</SelectItem>
                                                <SelectItem value="EVENT_DRIVEN">Event-Driven</SelectItem>
                                            </SelectContent>
                                        </Select>
                                    </div>
                                </div>

                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    <div className="flex items-center space-x-2">
                                        <Switch
                                            id="realtime"
                                            checked={formData.isRealTime}
                                            onCheckedChange={(checked) => updateField('isRealTime', checked)}
                                        />
                                        <Label htmlFor="realtime">Real-time Interface</Label>
                                    </div>

                                    <div className="flex items-center space-x-2">
                                        <Switch
                                            id="bidirectional"
                                            checked={formData.isBidirectional}
                                            onCheckedChange={(checked) => updateField('isBidirectional', checked)}
                                        />
                                        <Label htmlFor="bidirectional">Bidirectional</Label>
                                    </div>
                                </div>
                            </CardContent>
                        </Card>

                        <Card>
                            <CardHeader>
                                <CardTitle>Security & Quality</CardTitle>
                            </CardHeader>
                            <CardContent className="space-y-4">
                                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                                    <div>
                                        <Label htmlFor="auth">Authentication</Label>
                                        <Select value={formData.authenticationType} onValueChange={(value) => updateField('authenticationType', value)}>
                                            <SelectTrigger>
                                                <SelectValue />
                                            </SelectTrigger>
                                            <SelectContent>
                                                <SelectItem value="API_KEY">API Key</SelectItem>
                                                <SelectItem value="OAUTH2">OAuth 2.0</SelectItem>
                                                <SelectItem value="JWT">JWT Token</SelectItem>
                                                <SelectItem value="BASIC_AUTH">Basic Auth</SelectItem>
                                                <SelectItem value="CERTIFICATE">Certificate</SelectItem>
                                                <SelectItem value="LDAP">LDAP</SelectItem>
                                                <SelectItem value="NONE">None</SelectItem>
                                            </SelectContent>
                                        </Select>
                                    </div>

                                    <div>
                                        <Label htmlFor="encryption">Encryption Level</Label>
                                        <Select value={formData.encryptionLevel} onValueChange={(value) => updateField('encryptionLevel', value)}>
                                            <SelectTrigger>
                                                <SelectValue />
                                            </SelectTrigger>
                                            <SelectContent>
                                                <SelectItem value="NONE">None</SelectItem>
                                                <SelectItem value="TLS">TLS/SSL</SelectItem>
                                                <SelectItem value="AES256">AES-256</SelectItem>
                                                <SelectItem value="RSA">RSA</SelectItem>
                                                <SelectItem value="END_TO_END">End-to-End</SelectItem>
                                            </SelectContent>
                                        </Select>
                                    </div>

                                    <div>
                                        <Label htmlFor="monitoring">Monitoring Level</Label>
                                        <Select value={formData.monitoringLevel} onValueChange={(value) => updateField('monitoringLevel', value)}>
                                            <SelectTrigger>
                                                <SelectValue />
                                            </SelectTrigger>
                                            <SelectContent>
                                                <SelectItem value="NONE">None</SelectItem>
                                                <SelectItem value="BASIC">Basic</SelectItem>
                                                <SelectItem value="STANDARD">Standard</SelectItem>
                                                <SelectItem value="COMPREHENSIVE">Comprehensive</SelectItem>
                                            </SelectContent>
                                        </Select>
                                    </div>
                                </div>

                                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                                    <div>
                                        <Label htmlFor="volume">Data Volume</Label>
                                        <Select value={formData.volume} onValueChange={(value) => updateField('volume', value)}>
                                            <SelectTrigger>
                                                <SelectValue />
                                            </SelectTrigger>
                                            <SelectContent>
                                                <SelectItem value="LOW">Low (&lt;1MB)</SelectItem>
                                                <SelectItem value="MEDIUM">Medium (1-100MB)</SelectItem>
                                                <SelectItem value="HIGH">High (100MB-1GB)</SelectItem>
                                                <SelectItem value="VERY_HIGH">Very High (&gt;1GB)</SelectItem>
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
                                        <Label htmlFor="errorHandling">Error Handling</Label>
                                        <Select value={formData.errorHandling} onValueChange={(value) => updateField('errorHandling', value)}>
                                            <SelectTrigger>
                                                <SelectValue />
                                            </SelectTrigger>
                                            <SelectContent>
                                                <SelectItem value="RETRY">Retry Logic</SelectItem>
                                                <SelectItem value="CIRCUIT_BREAKER">Circuit Breaker</SelectItem>
                                                <SelectItem value="FALLBACK">Fallback</SelectItem>
                                                <SelectItem value="MANUAL">Manual Handling</SelectItem>
                                                <SelectItem value="IGNORE">Ignore Errors</SelectItem>
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
                                        <Label>Availability: {formData.availability}%</Label>
                                        <Slider
                                            value={[formData.availability]}
                                            onValueChange={(value) => updateField('availability', value[0])}
                                            min={90}
                                            max={100}
                                            step={0.1}
                                            className="mt-2"
                                        />
                                        <p className="text-xs text-muted-foreground mt-1">
                                            Interface uptime and availability
                                        </p>
                                    </div>

                                    <div>
                                        <Label>Performance Score: {formData.performance}%</Label>
                                        <Slider
                                            value={[formData.performance]}
                                            onValueChange={(value) => updateField('performance', value[0])}
                                            max={100}
                                            step={5}
                                            className="mt-2"
                                        />
                                        <p className="text-xs text-muted-foreground mt-1">
                                            Response time and throughput performance
                                        </p>
                                    </div>
                                </div>

                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    <div>
                                        <Label>Reliability Score: {formData.reliability}%</Label>
                                        <Slider
                                            value={[formData.reliability]}
                                            onValueChange={(value) => updateField('reliability', value[0])}
                                            max={100}
                                            step={5}
                                            className="mt-2"
                                        />
                                        <p className="text-xs text-muted-foreground mt-1">
                                            Data integrity and error rates
                                        </p>
                                    </div>

                                    <div>
                                        <Label>Security Score: {formData.security}%</Label>
                                        <Slider
                                            value={[formData.security]}
                                            onValueChange={(value) => updateField('security', value[0])}
                                            max={100}
                                            step={5}
                                            className="mt-2"
                                        />
                                        <p className="text-xs text-muted-foreground mt-1">
                                            Security posture and vulnerability status
                                        </p>
                                    </div>
                                </div>

                                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                                    <div>
                                        <Label htmlFor="backup">Backup Strategy</Label>
                                        <Select value={formData.backupStrategy} onValueChange={(value) => updateField('backupStrategy', value)}>
                                            <SelectTrigger>
                                                <SelectValue />
                                            </SelectTrigger>
                                            <SelectContent>
                                                <SelectItem value="NONE">None</SelectItem>
                                                <SelectItem value="QUEUE">Message Queue</SelectItem>
                                                <SelectItem value="DATABASE">Database Backup</SelectItem>
                                                <SelectItem value="FILE_SYSTEM">File System</SelectItem>
                                                <SelectItem value="CLOUD_STORAGE">Cloud Storage</SelectItem>
                                            </SelectContent>
                                        </Select>
                                    </div>

                                    <div>
                                        <Label htmlFor="lastTested">Last Tested</Label>
                                        <Input
                                            id="lastTested"
                                            type="date"
                                            value={formData.lastTested}
                                            onChange={(e) => updateField('lastTested', e.target.value)}
                                        />
                                    </div>

                                    <div>
                                        <Label htmlFor="nextReview">Next Review</Label>
                                        <Input
                                            id="nextReview"
                                            type="date"
                                            value={formData.nextReview}
                                            onChange={(e) => updateField('nextReview', e.target.value)}
                                        />
                                    </div>
                                </div>
                            </CardContent>
                        </Card>

                        <Card>
                            <CardHeader>
                                <CardTitle>Data & Business Rules</CardTitle>
                            </CardHeader>
                            <CardContent className="space-y-4">
                                <div>
                                    <Label>Data Elements</Label>
                                    <TagInput
                                        tags={formData.dataElements}
                                        onChange={(elements) => updateField('dataElements', elements)}
                                        placeholder="Add data elements transmitted (e.g. customer-id, order-details)"
                                    />
                                </div>

                                <div>
                                    <Label>Business Rules</Label>
                                    <TagInput
                                        tags={formData.businessRules}
                                        onChange={(rules) => updateField('businessRules', rules)}
                                        placeholder="Add business rules and validation logic"
                                    />
                                </div>

                                <div>
                                    <Label>Error Scenarios</Label>
                                    <TagInput
                                        tags={formData.errorScenarios}
                                        onChange={(scenarios) => updateField('errorScenarios', scenarios)}
                                        placeholder="Add potential error scenarios and handling"
                                    />
                                </div>

                                <div>
                                    <Label>Dependencies</Label>
                                    <TagInput
                                        tags={formData.dependencies}
                                        onChange={(dependencies) => updateField('dependencies', dependencies)}
                                        placeholder="Add interface dependencies and prerequisites"
                                    />
                                </div>

                                <div>
                                    <Label>Tags</Label>
                                    <TagInput
                                        tags={formData.tags}
                                        onChange={(tags) => updateField('tags', tags)}
                                        placeholder="Add descriptive tags"
                                        suggestions={TAG_SUGGESTIONS.interface}
                                    />
                                </div>
                            </CardContent>
                        </Card>
                    </div>

                    <div className="space-y-6">
                        <Card>
                            <CardHeader>
                                <CardTitle>Interface Health</CardTitle>
                            </CardHeader>
                            <CardContent className="space-y-4">
                                <div className="space-y-3">
                                    <div className="flex justify-between items-center">
                                        <span className="text-sm font-medium">Overall Health</span>
                                        <span className={`text-sm font-semibold ${
                                            ((formData.availability + formData.performance + formData.reliability + formData.security) / 4) >= 90 
                                                ? 'text-green-600' 
                                                : ((formData.availability + formData.performance + formData.reliability + formData.security) / 4) >= 75 
                                                ? 'text-yellow-600' 
                                                : 'text-red-600'
                                        }`}>
                                            {Math.round((formData.availability + formData.performance + formData.reliability + formData.security) / 4)}%
                                        </span>
                                    </div>
                                    <div className="h-2 bg-muted rounded-full overflow-hidden">
                                        <div 
                                            className={`h-full rounded-full transition-all ${
                                                ((formData.availability + formData.performance + formData.reliability + formData.security) / 4) >= 90 
                                                    ? 'bg-green-500' 
                                                    : ((formData.availability + formData.performance + formData.reliability + formData.security) / 4) >= 75 
                                                    ? 'bg-yellow-500' 
                                                    : 'bg-red-500'
                                            }`}
                                            style={{ width: `${(formData.availability + formData.performance + formData.reliability + formData.security) / 4}%` }}
                                        />
                                    </div>
                                </div>

                                <div className="pt-4 space-y-2 text-sm">
                                    <div className="flex justify-between">
                                        <span className="text-muted-foreground">Availability</span>
                                        <span>{formData.availability}%</span>
                                    </div>
                                    <div className="flex justify-between">
                                        <span className="text-muted-foreground">Performance</span>
                                        <span>{formData.performance}%</span>
                                    </div>
                                    <div className="flex justify-between">
                                        <span className="text-muted-foreground">Reliability</span>
                                        <span>{formData.reliability}%</span>
                                    </div>
                                    <div className="flex justify-between">
                                        <span className="text-muted-foreground">Security</span>
                                        <span>{formData.security}%</span>
                                    </div>
                                </div>
                            </CardContent>
                        </Card>

                        <Card>
                            <CardHeader>
                                <CardTitle>Interface Characteristics</CardTitle>
                            </CardHeader>
                            <CardContent className="space-y-3 text-sm">
                                <div className="flex justify-between">
                                    <span className="text-muted-foreground">Type</span>
                                    <span className="font-medium">{formData.type}</span>
                                </div>
                                <div className="flex justify-between">
                                    <span className="text-muted-foreground">Protocol</span>
                                    <span className="font-medium">{formData.protocol}</span>
                                </div>
                                <div className="flex justify-between">
                                    <span className="text-muted-foreground">Format</span>
                                    <span className="font-medium">{formData.dataFormat}</span>
                                </div>
                                <div className="flex justify-between">
                                    <span className="text-muted-foreground">Frequency</span>
                                    <span className="font-medium">{formData.frequency}</span>
                                </div>
                                <div className="flex justify-between">
                                    <span className="text-muted-foreground">Volume</span>
                                    <span className="font-medium">{formData.volume}</span>
                                </div>
                                <div className="flex justify-between">
                                    <span className="text-muted-foreground">Criticality</span>
                                    <span className={`font-medium ${
                                        formData.criticality === 'CRITICAL' ? 'text-red-600' :
                                        formData.criticality === 'HIGH' ? 'text-orange-600' :
                                        formData.criticality === 'MEDIUM' ? 'text-yellow-600' :
                                        'text-green-600'
                                    }`}>
                                        {formData.criticality}
                                    </span>
                                </div>
                                {formData.isRealTime && (
                                    <div className="flex justify-between">
                                        <span className="text-muted-foreground">Real-time</span>
                                        <span className="text-blue-600 font-medium">Yes</span>
                                    </div>
                                )}
                                {formData.isBidirectional && (
                                    <div className="flex justify-between">
                                        <span className="text-muted-foreground">Bidirectional</span>
                                        <span className="text-purple-600 font-medium">Yes</span>
                                    </div>
                                )}
                            </CardContent>
                        </Card>

                        <div className="flex flex-col gap-2">
                            <Button type="submit" className="gap-2">
                                <FloppyDisk size={16} />
                                {interfaceData ? 'Update Interface' : 'Create Interface'}
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
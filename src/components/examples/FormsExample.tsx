import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import {
    BusinessCapabilityForm,
    ProcessForm,
    TechnologyForm,
    InterfaceForm,
    StatusBadge,
    CriticalityBadge,
    MaturityBadge,
    TechTypeBadge,
    ProcessTypeBadge,
    AutomationBadge,
    CategoryBadge,
    HealthScoreBadge,
    TagBadge
} from '@/components/forms'
import { Plus } from '@phosphor-icons/react'

export function FormsExample() {
    const [activeForm, setActiveForm] = useState<string | null>(null)

    const handleSave = (formType: string, data: any) => {
        console.log(`Saving ${formType}:`, data)
        setActiveForm(null)
        // Here you would typically save to your data store
    }

    const renderForm = () => {
        switch (activeForm) {
            case 'capability':
                return (
                    <BusinessCapabilityForm
                        onSave={(data) => handleSave('Business Capability', data)}
                        onCancel={() => setActiveForm(null)}
                    />
                )
            case 'process':
                return (
                    <ProcessForm
                        onSave={(data) => handleSave('Process', data)}
                        onCancel={() => setActiveForm(null)}
                    />
                )
            case 'technology':
                return (
                    <TechnologyForm
                        onSave={(data) => handleSave('Technology', data)}
                        onCancel={() => setActiveForm(null)}
                    />
                )
            case 'interface':
                return (
                    <InterfaceForm
                        onSave={(data) => handleSave('Interface', data)}
                        onCancel={() => setActiveForm(null)}
                        availableSystems={['CRM System', 'ERP System', 'Payment Gateway', 'Analytics Platform']}
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
                <h1 className="text-3xl font-bold text-foreground">Forms & Badge System</h1>
                <p className="text-muted-foreground">
                    Comprehensive forms for Enterprise Architecture components with standardized tagging system
                </p>
            </div>

            <Tabs defaultValue="forms" className="space-y-6">
                <TabsList className="grid grid-cols-2 w-full max-w-md">
                    <TabsTrigger value="forms">Forms</TabsTrigger>
                    <TabsTrigger value="badges">Badge System</TabsTrigger>
                </TabsList>

                <TabsContent value="forms" className="space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                        <Card className="cursor-pointer hover:shadow-md transition-shadow" onClick={() => setActiveForm('capability')}>
                            <CardHeader className="pb-3">
                                <CardTitle className="text-lg flex items-center gap-2">
                                    <Plus size={20} className="text-primary" />
                                    Business Capability
                                </CardTitle>
                            </CardHeader>
                            <CardContent>
                                <p className="text-sm text-muted-foreground">
                                    Define business capabilities with maturity levels, ownership, and relationships
                                </p>
                                <div className="mt-3 flex flex-wrap gap-1">
                                    <StatusBadge value="PRODUCTION" />
                                    <MaturityBadge value="MANAGED" />
                                </div>
                            </CardContent>
                        </Card>

                        <Card className="cursor-pointer hover:shadow-md transition-shadow" onClick={() => setActiveForm('process')}>
                            <CardHeader className="pb-3">
                                <CardTitle className="text-lg flex items-center gap-2">
                                    <Plus size={20} className="text-primary" />
                                    Process
                                </CardTitle>
                            </CardHeader>
                            <CardContent>
                                <p className="text-sm text-muted-foreground">
                                    Document business processes with performance metrics and automation levels
                                </p>
                                <div className="mt-3 flex flex-wrap gap-1">
                                    <ProcessTypeBadge value="CORE" />
                                    <AutomationBadge value="AUTOMATED" />
                                </div>
                            </CardContent>
                        </Card>

                        <Card className="cursor-pointer hover:shadow-md transition-shadow" onClick={() => setActiveForm('technology')}>
                            <CardHeader className="pb-3">
                                <CardTitle className="text-lg flex items-center gap-2">
                                    <Plus size={20} className="text-primary" />
                                    Technology
                                </CardTitle>
                            </CardHeader>
                            <CardContent>
                                <p className="text-sm text-muted-foreground">
                                    Catalog technologies with comprehensive assessment and lifecycle management
                                </p>
                                <div className="mt-3 flex flex-wrap gap-1">
                                    <TechTypeBadge value="COMMERCIAL" />
                                    <CategoryBadge value="APPLICATION" />
                                </div>
                            </CardContent>
                        </Card>

                        <Card className="cursor-pointer hover:shadow-md transition-shadow" onClick={() => setActiveForm('interface')}>
                            <CardHeader className="pb-3">
                                <CardTitle className="text-lg flex items-center gap-2">
                                    <Plus size={20} className="text-primary" />
                                    Interface
                                </CardTitle>
                            </CardHeader>
                            <CardContent>
                                <p className="text-sm text-muted-foreground">
                                    Define system interfaces with technical specifications and performance metrics
                                </p>
                                <div className="mt-3 flex flex-wrap gap-1">
                                    <TagBadge tag="API" />
                                    <CriticalityBadge value="HIGH" />
                                </div>
                            </CardContent>
                        </Card>
                    </div>

                    <Card>
                        <CardHeader>
                            <CardTitle>Form Features</CardTitle>
                        </CardHeader>
                        <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div>
                                <h4 className="font-semibold mb-3">Common Features</h4>
                                <ul className="space-y-2 text-sm text-muted-foreground">
                                    <li>• Standardized field layouts and validation</li>
                                    <li>• Interactive tag input with suggestions</li>
                                    <li>• Comprehensive relationship management</li>
                                    <li>• Assessment and scoring capabilities</li>
                                    <li>• Quick reference guides and help text</li>
                                    <li>• Responsive design for all screen sizes</li>
                                </ul>
                            </div>
                            <div>
                                <h4 className="font-semibold mb-3">Data Categories</h4>
                                <ul className="space-y-2 text-sm text-muted-foreground">
                                    <li>• Basic information and metadata</li>
                                    <li>• Classification and categorization</li>
                                    <li>• Relationships and dependencies</li>
                                    <li>• Performance metrics and KPIs</li>
                                    <li>• Compliance and governance data</li>
                                    <li>• Custom tags and labels</li>
                                </ul>
                            </div>
                        </CardContent>
                    </Card>
                </TabsContent>

                <TabsContent value="badges" className="space-y-6">
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                        <Card>
                            <CardHeader>
                                <CardTitle>Status & Lifecycle Badges</CardTitle>
                            </CardHeader>
                            <CardContent className="space-y-4">
                                <div>
                                    <h4 className="font-medium mb-2">Lifecycle Phases</h4>
                                    <div className="flex flex-wrap gap-2">
                                        <StatusBadge value="PLANNING" />
                                        <StatusBadge value="DEVELOPMENT" />
                                        <StatusBadge value="PRODUCTION" />
                                        <StatusBadge value="MAINTENANCE" />
                                        <StatusBadge value="SUNSET" />
                                        <StatusBadge value="RETIRED" />
                                    </div>
                                </div>
                                <div>
                                    <h4 className="font-medium mb-2">Criticality Levels</h4>
                                    <div className="flex flex-wrap gap-2">
                                        <CriticalityBadge value="LOW" />
                                        <CriticalityBadge value="MEDIUM" />
                                        <CriticalityBadge value="HIGH" />
                                        <CriticalityBadge value="CRITICAL" />
                                    </div>
                                </div>
                                <div>
                                    <h4 className="font-medium mb-2">Maturity Levels</h4>
                                    <div className="flex flex-wrap gap-2">
                                        <MaturityBadge value="INITIAL" />
                                        <MaturityBadge value="DEFINED" />
                                        <MaturityBadge value="STANDARDIZED" />
                                        <MaturityBadge value="MANAGED" />
                                        <MaturityBadge value="OPTIMIZED" />
                                    </div>
                                </div>
                            </CardContent>
                        </Card>

                        <Card>
                            <CardHeader>
                                <CardTitle>Technology & Process Badges</CardTitle>
                            </CardHeader>
                            <CardContent className="space-y-4">
                                <div>
                                    <h4 className="font-medium mb-2">Technology Types</h4>
                                    <div className="flex flex-wrap gap-2">
                                        <TechTypeBadge value="COMMERCIAL" />
                                        <TechTypeBadge value="OPEN_SOURCE" />
                                        <TechTypeBadge value="PROPRIETARY" />
                                        <TechTypeBadge value="CUSTOM" />
                                        <TechTypeBadge value="CLOUD_NATIVE" />
                                    </div>
                                </div>
                                <div>
                                    <h4 className="font-medium mb-2">Process Types</h4>
                                    <div className="flex flex-wrap gap-2">
                                        <ProcessTypeBadge value="CORE" />
                                        <ProcessTypeBadge value="SUPPORT" />
                                        <ProcessTypeBadge value="MANAGEMENT" />
                                        <ProcessTypeBadge value="GOVERNANCE" />
                                    </div>
                                </div>
                                <div>
                                    <h4 className="font-medium mb-2">Automation Levels</h4>
                                    <div className="flex flex-wrap gap-2">
                                        <AutomationBadge value="MANUAL" />
                                        <AutomationBadge value="SEMI_AUTOMATED" />
                                        <AutomationBadge value="AUTOMATED" />
                                        <AutomationBadge value="INTELLIGENT" />
                                    </div>
                                </div>
                            </CardContent>
                        </Card>

                        <Card>
                            <CardHeader>
                                <CardTitle>Categories & Performance</CardTitle>
                            </CardHeader>
                            <CardContent className="space-y-4">
                                <div>
                                    <h4 className="font-medium mb-2">Technology Categories</h4>
                                    <div className="flex flex-wrap gap-2">
                                        <CategoryBadge value="APPLICATION" />
                                        <CategoryBadge value="DATABASE" />
                                        <CategoryBadge value="MIDDLEWARE" />
                                        <CategoryBadge value="INFRASTRUCTURE" />
                                        <CategoryBadge value="PLATFORM" />
                                        <CategoryBadge value="INTEGRATION" />
                                        <CategoryBadge value="SECURITY" />
                                        <CategoryBadge value="ANALYTICS" />
                                    </div>
                                </div>
                                <div>
                                    <h4 className="font-medium mb-2">Health Scores</h4>
                                    <div className="flex flex-wrap gap-2">
                                        <HealthScoreBadge score={95} />
                                        <HealthScoreBadge score={85} />
                                        <HealthScoreBadge score={75} />
                                        <HealthScoreBadge score={65} />
                                        <HealthScoreBadge score={45} />
                                    </div>
                                </div>
                            </CardContent>
                        </Card>

                        <Card>
                            <CardHeader>
                                <CardTitle>Custom Tags</CardTitle>
                            </CardHeader>
                            <CardContent className="space-y-4">
                                <div>
                                    <h4 className="font-medium mb-2">Example Tags</h4>
                                    <div className="flex flex-wrap gap-2">
                                        <TagBadge tag="customer-facing" />
                                        <TagBadge tag="core-process" />
                                        <TagBadge tag="legacy" />
                                        <TagBadge tag="cloud-native" />
                                        <TagBadge tag="api" />
                                        <TagBadge tag="real-time" />
                                        <TagBadge tag="regulated" />
                                        <TagBadge tag="mission-critical" />
                                    </div>
                                </div>
                                <div>
                                    <h4 className="font-medium mb-2">Features</h4>
                                    <ul className="space-y-1 text-sm text-muted-foreground">
                                        <li>• Consistent color coding across all badge types</li>
                                        <li>• Semantic meaning through visual design</li>
                                        <li>• Support for custom tags and labels</li>
                                        <li>• Accessibility-friendly contrast ratios</li>
                                        <li>• Hover states and interactive capabilities</li>
                                    </ul>
                                </div>
                            </CardContent>
                        </Card>
                    </div>
                </TabsContent>
            </Tabs>
        </div>
    )
}
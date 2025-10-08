# Enterprise Architecture Forms & Badge System

This directory contains comprehensive forms for managing Enterprise Architecture components along with a standardized badge/tag system for consistent visual representation.

## Forms Overview

### Available Forms

1. **BusinessCapabilityForm** - Define and manage business capabilities
2. **ProcessForm** - Document business processes with performance metrics
3. **TechnologyForm** - Catalog and assess technologies
4. **InterfaceForm** - Define system interfaces and integrations
5. **ApplicationForm** - Manage application portfolio (existing)

### Common Features

All forms share these standardized features:

- **Consistent Layout**: Three-column responsive layout with main content, sidebar, and actions
- **Comprehensive Validation**: Required field validation with helpful error messages
- **Tag Input System**: Interactive tag management with autocomplete suggestions
- **Performance Metrics**: Slider-based assessment tools for ratings and scores
- **Relationship Management**: Define connections between different architectural components
- **Quick Reference**: Context-aware help panels with guidelines and best practices
- **Responsive Design**: Optimized for desktop, tablet, and mobile devices

### Form Structure

Each form follows this consistent structure:

```tsx
interface FormProps {
    item?: Item | null          // Existing item for editing (optional)
    onSave: (data: Omit<Item, 'id'>) => void  // Save callback
    onCancel: () => void        // Cancel callback
    // Additional props specific to the form
}
```

## Badge System

### StandardBadge Component

The `StandardBadge` component provides consistent visual representation for different types of categorical data:

```tsx
import { StatusBadge, CriticalityBadge, MaturityBadge } from '@/components/forms'

// Usage examples
<StatusBadge value="PRODUCTION" />
<CriticalityBadge value="HIGH" />
<MaturityBadge value="OPTIMIZED" />
```

### Available Badge Types

1. **Status Badges** - Lifecycle phases (Planning, Development, Production, etc.)
2. **Criticality Badges** - Business importance levels (Low, Medium, High, Critical)
3. **Maturity Badges** - Process/capability maturity (Initial, Defined, Standardized, etc.)
4. **Technology Type Badges** - Commercial, Open Source, Proprietary, Custom, etc.
5. **Process Type Badges** - Core, Support, Management, Governance
6. **Automation Badges** - Manual, Semi-automated, Automated, Intelligent
7. **Category Badges** - Application, Database, Middleware, Infrastructure, etc.
8. **Performance Badges** - Excellent, Good, Adequate, Poor, Very Poor
9. **Health Score Badges** - Dynamic color coding based on numerical scores
10. **Tag Badges** - Generic tags with optional remove functionality

### Color Coding System

The badge system uses a consistent color palette:

- **Green**: Positive states (Production, Good performance, Low risk)
- **Blue**: Neutral/informational states (Planning, Standard processes)
- **Yellow**: Caution states (Medium criticality, Needs attention)
- **Orange**: Warning states (High risk, Poor performance)
- **Red**: Critical states (Critical issues, Very poor performance)
- **Purple**: Special categories (Proprietary, Management processes)
- **Gray**: Inactive/retired states

## Tag Input System

### TagInput Component

Interactive tag management with autocomplete suggestions:

```tsx
import { TagInput, TAG_SUGGESTIONS } from '@/components/forms'

<TagInput
    tags={formData.tags}
    onChange={(tags) => updateField('tags', tags)}
    placeholder="Add tags..."
    suggestions={TAG_SUGGESTIONS.businessCapability}
    maxTags={10}
/>
```

### Predefined Tag Suggestions

The system includes predefined tag suggestions for different domains:

- **businessCapability**: customer-facing, core-process, digital, strategic, etc.
- **technology**: legacy, modern, cloud-native, microservices, api, etc.
- **process**: manual, automated, critical, customer-facing, regulated, etc.
- **interface**: api, real-time, synchronous, rest, websocket, etc.

## Usage Examples

### Basic Form Usage

```tsx
import { BusinessCapabilityForm } from '@/components/forms'

function MyComponent() {
    const [showForm, setShowForm] = useState(false)
    
    const handleSave = (data) => {
        // Save the capability data
        console.log('Saving capability:', data)
        setShowForm(false)
    }
    
    if (showForm) {
        return (
            <BusinessCapabilityForm
                onSave={handleSave}
                onCancel={() => setShowForm(false)}
                availableCapabilities={existingCapabilities}
            />
        )
    }
    
    return (
        <Button onClick={() => setShowForm(true)}>
            Add New Capability
        </Button>
    )
}
```

### Badge Usage in Lists

```tsx
import { StatusBadge, CriticalityBadge } from '@/components/forms'

function CapabilityList({ capabilities }) {
    return (
        <div className="space-y-2">
            {capabilities.map(capability => (
                <div key={capability.id} className="flex items-center gap-2">
                    <span>{capability.name}</span>
                    <StatusBadge value={capability.lifecyclePhase} />
                    <CriticalityBadge value={capability.businessImportance} />
                </div>
            ))}
        </div>
    )
}
```

## Data Models

### Business Capability

```typescript
interface BusinessCapability {
    id: string
    name: string
    description?: string
    level: number                    // 1-4 (Strategic to Detailed)
    parentId?: string               // Reference to parent capability
    maturityLevel: string           // INITIAL | DEFINED | STANDARDIZED | MANAGED | OPTIMIZED
    businessImportance: string      // LOW | MEDIUM | HIGH | CRITICAL
    investmentPriority: string      // LOW | MEDIUM | HIGH | URGENT
    riskLevel: string              // LOW | MEDIUM | HIGH | CRITICAL
    owner?: string
    tags: string[]
    supportingProcesses?: string[]
    enabledBy?: string[]           // Technologies/applications
}
```

### Process

```typescript
interface Process {
    id: string
    name: string
    description?: string
    type: string                   // CORE | SUPPORT | MANAGEMENT | GOVERNANCE
    category: string
    owner?: string
    maturityLevel: string
    automationLevel: string        // MANUAL | SEMI_AUTOMATED | AUTOMATED | INTELLIGENT
    frequency: string              // REAL_TIME | HOURLY | DAILY | etc.
    criticality: string
    riskLevel: string
    compliance: string[]
    performanceMetrics: {
        cycleTime?: number         // hours
        cost?: number             // per execution
        quality?: number          // percentage
        satisfaction?: number     // percentage
    }
    inputs: string[]
    outputs: string[]
    enabledBy: string[]           // Technologies
    supports: string[]            // Business capabilities
    tags: string[]
}
```

### Technology

```typescript
interface Technology {
    id: string
    name: string
    description?: string
    category: string              // APPLICATION | DATABASE | MIDDLEWARE | etc.
    type: string                 // COMMERCIAL | OPEN_SOURCE | PROPRIETARY | etc.
    vendor?: string
    version?: string
    licenseModel: string         // COMMERCIAL | SUBSCRIPTION | OPEN_SOURCE | etc.
    deploymentModel: string      // ON_PREMISE | PRIVATE_CLOUD | PUBLIC_CLOUD | etc.
    lifecyclePhase: string
    supportLevel: string         // VENDOR | INTERNAL | COMMUNITY | etc.
    
    // Assessment scores (0-100)
    securityRating: number
    performanceRating: number
    scalabilityRating: number
    maintainabilityRating: number
    costEffectivenessRating: number
    technicalDebt: number
    
    endOfLifeDate?: string
    lastAssessmentDate?: string
    compliance: string[]
    capabilities: string[]        // Technical capabilities provided
    integrationPoints: string[]
    dependencies: string[]
    tags: string[]
}
```

### Interface

```typescript
interface Interface {
    id: string
    name: string
    description?: string
    type: string                 // API | DATABASE | FILE | MESSAGE_QUEUE | etc.
    protocol: string             // REST | SOAP | HTTP | FTP | etc.
    direction: string            // INBOUND | OUTBOUND | BIDIRECTIONAL
    frequency: string
    volume: string               // LOW | MEDIUM | HIGH | VERY_HIGH
    criticality: string
    sourceSystem: string
    targetSystem: string
    dataFormat: string           // JSON | XML | CSV | etc.
    authenticationType: string   // API_KEY | OAUTH2 | JWT | etc.
    encryptionLevel: string      // NONE | TLS | AES256 | etc.
    monitoringLevel: string      // NONE | BASIC | STANDARD | COMPREHENSIVE
    
    // Performance metrics (0-100, except availability which is 90-100)
    availability: number
    performance: number
    reliability: number
    security: number
    
    isRealTime: boolean
    isBidirectional: boolean
    errorHandling: string        // RETRY | CIRCUIT_BREAKER | FALLBACK | etc.
    backupStrategy: string       // NONE | QUEUE | DATABASE | etc.
    
    lastTested?: string
    nextReview?: string
    dataElements: string[]       // Data fields transmitted
    businessRules: string[]
    errorScenarios: string[]
    dependencies: string[]
    tags: string[]
}
```

## Best Practices

### Form Development

1. **Consistent Field Names**: Use standardized field names across forms
2. **Validation Messages**: Provide clear, actionable validation messages
3. **Help Text**: Include contextual help for complex fields
4. **Progressive Disclosure**: Group related fields into logical sections
5. **Mobile Optimization**: Ensure forms work on all device sizes

### Badge Usage

1. **Semantic Consistency**: Use the same badge type for the same data across the application
2. **Color Meaning**: Maintain consistent color meanings (green = good, red = critical)
3. **Accessibility**: Ensure sufficient color contrast for all badge variants
4. **Hover States**: Provide additional context through hover text when needed

### Tag Management

1. **Suggestion Lists**: Maintain curated suggestion lists for each domain
2. **Normalization**: Implement tag normalization to prevent duplicates
3. **Categorization**: Use prefixes or namespaces for different tag categories
4. **Cleanup**: Regularly review and clean up unused tags

## Extending the System

### Adding New Forms

1. Create a new form component following the established pattern
2. Add the form to the exports in `index.ts`
3. Update the example component to include the new form
4. Add appropriate badge types if needed

### Adding New Badge Types

1. Add the new badge variant to `BADGE_VARIANTS` in `StandardBadge.tsx`
2. Create a specialized badge component if needed
3. Export the new badge from `index.ts`
4. Update the documentation and examples

### Customizing Tag Suggestions

Add new suggestion categories to `TAG_SUGGESTIONS` in `TagInput.tsx`:

```typescript
export const TAG_SUGGESTIONS = {
    // ... existing suggestions
    newDomain: [
        'suggestion1',
        'suggestion2',
        // ... more suggestions
    ]
}
```
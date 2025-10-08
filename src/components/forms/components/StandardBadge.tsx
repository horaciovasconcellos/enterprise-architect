import { Badge } from '@/components/ui/badge'
import { cn } from '@/lib/utils'

// Standardized color schemes for different types of badges
export const BADGE_VARIANTS = {
    // Lifecycle/Status badges
    status: {
        PLANNING: { variant: 'secondary' as const, className: 'bg-blue-100 text-blue-800 border-blue-200' },
        DEVELOPMENT: { variant: 'secondary' as const, className: 'bg-orange-100 text-orange-800 border-orange-200' },
        PRODUCTION: { variant: 'secondary' as const, className: 'bg-green-100 text-green-800 border-green-200' },
        MAINTENANCE: { variant: 'secondary' as const, className: 'bg-yellow-100 text-yellow-800 border-yellow-200' },
        SUNSET: { variant: 'secondary' as const, className: 'bg-red-100 text-red-800 border-red-200' },
        RETIRED: { variant: 'secondary' as const, className: 'bg-gray-100 text-gray-800 border-gray-200' },
        EVALUATION: { variant: 'secondary' as const, className: 'bg-purple-100 text-purple-800 border-purple-200' },
        PILOT: { variant: 'secondary' as const, className: 'bg-indigo-100 text-indigo-800 border-indigo-200' }
    },

    // Criticality/Priority badges
    criticality: {
        LOW: { variant: 'secondary' as const, className: 'bg-green-100 text-green-800 border-green-200' },
        MEDIUM: { variant: 'secondary' as const, className: 'bg-yellow-100 text-yellow-800 border-yellow-200' },
        HIGH: { variant: 'secondary' as const, className: 'bg-orange-100 text-orange-800 border-orange-200' },
        CRITICAL: { variant: 'destructive' as const, className: 'bg-red-100 text-red-800 border-red-200' },
        URGENT: { variant: 'destructive' as const, className: 'bg-red-100 text-red-800 border-red-200' }
    },

    // Maturity level badges
    maturity: {
        INITIAL: { variant: 'secondary' as const, className: 'bg-red-100 text-red-800 border-red-200' },
        DEFINED: { variant: 'secondary' as const, className: 'bg-orange-100 text-orange-800 border-orange-200' },
        STANDARDIZED: { variant: 'secondary' as const, className: 'bg-yellow-100 text-yellow-800 border-yellow-200' },
        MANAGED: { variant: 'secondary' as const, className: 'bg-blue-100 text-blue-800 border-blue-200' },
        OPTIMIZED: { variant: 'secondary' as const, className: 'bg-green-100 text-green-800 border-green-200' }
    },

    // Technology type badges
    techType: {
        COMMERCIAL: { variant: 'secondary' as const, className: 'bg-blue-100 text-blue-800 border-blue-200' },
        OPEN_SOURCE: { variant: 'secondary' as const, className: 'bg-green-100 text-green-800 border-green-200' },
        PROPRIETARY: { variant: 'secondary' as const, className: 'bg-purple-100 text-purple-800 border-purple-200' },
        CUSTOM: { variant: 'secondary' as const, className: 'bg-orange-100 text-orange-800 border-orange-200' },
        CLOUD_NATIVE: { variant: 'secondary' as const, className: 'bg-cyan-100 text-cyan-800 border-cyan-200' }
    },

    // Process type badges
    processType: {
        CORE: { variant: 'default' as const, className: 'bg-primary/10 text-primary border-primary/20' },
        SUPPORT: { variant: 'secondary' as const, className: 'bg-blue-100 text-blue-800 border-blue-200' },
        MANAGEMENT: { variant: 'secondary' as const, className: 'bg-purple-100 text-purple-800 border-purple-200' },
        GOVERNANCE: { variant: 'secondary' as const, className: 'bg-indigo-100 text-indigo-800 border-indigo-200' }
    },

    // Automation level badges
    automation: {
        MANUAL: { variant: 'secondary' as const, className: 'bg-red-100 text-red-800 border-red-200' },
        SEMI_AUTOMATED: { variant: 'secondary' as const, className: 'bg-yellow-100 text-yellow-800 border-yellow-200' },
        AUTOMATED: { variant: 'secondary' as const, className: 'bg-green-100 text-green-800 border-green-200' },
        INTELLIGENT: { variant: 'secondary' as const, className: 'bg-cyan-100 text-cyan-800 border-cyan-200' }
    },

    // Generic category badges - neutral colors
    category: {
        APPLICATION: { variant: 'secondary' as const, className: 'bg-blue-100 text-blue-800 border-blue-200' },
        DATABASE: { variant: 'secondary' as const, className: 'bg-green-100 text-green-800 border-green-200' },
        MIDDLEWARE: { variant: 'secondary' as const, className: 'bg-purple-100 text-purple-800 border-purple-200' },
        INFRASTRUCTURE: { variant: 'secondary' as const, className: 'bg-gray-100 text-gray-800 border-gray-200' },
        PLATFORM: { variant: 'secondary' as const, className: 'bg-orange-100 text-orange-800 border-orange-200' },
        INTEGRATION: { variant: 'secondary' as const, className: 'bg-yellow-100 text-yellow-800 border-yellow-200' },
        SECURITY: { variant: 'secondary' as const, className: 'bg-red-100 text-red-800 border-red-200' },
        ANALYTICS: { variant: 'secondary' as const, className: 'bg-indigo-100 text-indigo-800 border-indigo-200' }
    },

    // Performance rating badges
    performance: {
        EXCELLENT: { variant: 'secondary' as const, className: 'bg-green-100 text-green-800 border-green-200' },
        GOOD: { variant: 'secondary' as const, className: 'bg-blue-100 text-blue-800 border-blue-200' },
        ADEQUATE: { variant: 'secondary' as const, className: 'bg-yellow-100 text-yellow-800 border-yellow-200' },
        POOR: { variant: 'secondary' as const, className: 'bg-orange-100 text-orange-800 border-orange-200' },
        VERY_POOR: { variant: 'secondary' as const, className: 'bg-red-100 text-red-800 border-red-200' }
    }
}

interface StandardBadgeProps {
    type: keyof typeof BADGE_VARIANTS
    value: string
    children?: React.ReactNode
    className?: string
    showIcon?: boolean
}

export function StandardBadge({ type, value, children, className, showIcon = false }: StandardBadgeProps) {
    const badgeVariants = BADGE_VARIANTS[type] as Record<string, { variant: any; className: string }>
    const badgeConfig = badgeVariants?.[value]
    
    if (!badgeConfig) {
        // Fallback to default badge for unknown values
        return (
            <Badge variant="outline" className={cn('text-xs', className)}>
                {children || formatDisplayValue(value)}
            </Badge>
        )
    }

    return (
        <Badge 
            variant={badgeConfig.variant}
            className={cn(badgeConfig.className, 'text-xs font-medium', className)}
        >
            {children || formatDisplayValue(value)}
        </Badge>
    )
}

// Utility function to format display values
function formatDisplayValue(value: string): string {
    return value
        .split('_')
        .map(word => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
        .join(' ')
}

// Specialized badge components for common use cases
export function StatusBadge({ value, className }: { value: string; className?: string }) {
    return <StandardBadge type="status" value={value} className={className} />
}

export function CriticalityBadge({ value, className }: { value: string; className?: string }) {
    return <StandardBadge type="criticality" value={value} className={className} />
}

export function MaturityBadge({ value, className }: { value: string; className?: string }) {
    return <StandardBadge type="maturity" value={value} className={className} />
}

export function TechTypeBadge({ value, className }: { value: string; className?: string }) {
    return <StandardBadge type="techType" value={value} className={className} />
}

export function ProcessTypeBadge({ value, className }: { value: string; className?: string }) {
    return <StandardBadge type="processType" value={value} className={className} />
}

export function AutomationBadge({ value, className }: { value: string; className?: string }) {
    return <StandardBadge type="automation" value={value} className={className} />
}

export function CategoryBadge({ value, className }: { value: string; className?: string }) {
    return <StandardBadge type="category" value={value} className={className} />
}

export function PerformanceBadge({ value, className }: { value: string; className?: string }) {
    return <StandardBadge type="performance" value={value} className={className} />
}

// Health score badge with dynamic colors based on score
export function HealthScoreBadge({ score, className }: { score: number; className?: string }) {
    const getScoreConfig = (score: number) => {
        if (score >= 90) return { className: 'bg-green-100 text-green-800 border-green-200', label: 'Excellent' }
        if (score >= 80) return { className: 'bg-blue-100 text-blue-800 border-blue-200', label: 'Good' }
        if (score >= 70) return { className: 'bg-yellow-100 text-yellow-800 border-yellow-200', label: 'Fair' }
        if (score >= 60) return { className: 'bg-orange-100 text-orange-800 border-orange-200', label: 'Poor' }
        return { className: 'bg-red-100 text-red-800 border-red-200', label: 'Critical' }
    }

    const config = getScoreConfig(score)
    
    return (
        <Badge variant="secondary" className={cn(config.className, 'text-xs font-medium', className)}>
            {score}% {config.label}
        </Badge>
    )
}

// Generic tag badge for user-defined tags
export function TagBadge({ tag, onRemove, className }: { 
    tag: string; 
    onRemove?: () => void; 
    className?: string;
}) {
    return (
        <Badge 
            variant="outline" 
            className={cn(
                'text-xs bg-muted/50 hover:bg-muted transition-colors',
                onRemove && 'pr-1',
                className
            )}
        >
            <span>{tag}</span>
            {onRemove && (
                <button
                    onClick={onRemove}
                    className="ml-1 h-3 w-3 rounded-full hover:bg-destructive hover:text-destructive-foreground flex items-center justify-center"
                    type="button"
                >
                    ×
                </button>
            )}
        </Badge>
    )
}
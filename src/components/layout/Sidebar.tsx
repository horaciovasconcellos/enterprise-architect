import { cn } from '@/lib/utils'
import { Buildings, ShareNetwork, Cube, House, List } from '@phosphor-icons/react'

type ViewType = 'dashboard' | 'applications' | 'capabilities' | 'interfaces'

interface SidebarProps {
    open: boolean
    onToggle: () => void
    activeView: ViewType
    onViewChange: (view: ViewType) => void
}

export function Sidebar({ open, onToggle, activeView, onViewChange }: SidebarProps) {
    const menuItems = [
        {
            id: 'dashboard' as ViewType,
            label: 'Dashboard',
            icon: House,
            description: 'Overview & Insights'
        },
        {
            id: 'applications' as ViewType,
            label: 'Applications',
            icon: Cube,
            description: 'Portfolio Management'
        },
        {
            id: 'capabilities' as ViewType,
            label: 'Capabilities',
            icon: Buildings,
            description: 'Business Mapping'
        },
        {
            id: 'interfaces' as ViewType,
            label: 'Interfaces',
            icon: ShareNetwork,
            description: 'Integration Analysis'
        }
    ]

    return (
        <div
            className={cn(
                "fixed left-0 top-0 h-full bg-card border-r border-border transition-all duration-300 z-40",
                open ? "w-64" : "w-16"
            )}
        >
            <div className="p-4">
                <div className="flex items-center gap-3 mb-8">
                    <button
                        onClick={onToggle}
                        className="p-2 rounded-lg hover:bg-muted transition-colors"
                    >
                        <List size={20} className="text-foreground" />
                    </button>
                    {open && (
                        <div>
                            <h1 className="font-bold text-lg text-foreground">60pportunities</h1>
                            <p className="text-sm text-muted-foreground">Enterprise Architecture</p>
                        </div>
                    )}
                </div>

                <nav className="space-y-2">
                    {menuItems.map((item) => {
                        const Icon = item.icon
                        const isActive = activeView === item.id
                        
                        return (
                            <button
                                key={item.id}
                                onClick={() => onViewChange(item.id)}
                                className={cn(
                                    "w-full flex items-center gap-3 p-3 rounded-lg transition-all duration-200",
                                    "hover:bg-muted/50",
                                    isActive && "bg-primary text-primary-foreground shadow-sm",
                                    !open && "justify-center"
                                )}
                            >
                                <Icon 
                                    size={20} 
                                    className={cn(
                                        "shrink-0",
                                        isActive ? "text-primary-foreground" : "text-muted-foreground"
                                    )} 
                                />
                                {open && (
                                    <div className="text-left min-w-0">
                                        <div className={cn(
                                            "font-medium text-sm",
                                            isActive ? "text-primary-foreground" : "text-foreground"
                                        )}>
                                            {item.label}
                                        </div>
                                        <div className={cn(
                                            "text-xs",
                                            isActive ? "text-primary-foreground/80" : "text-muted-foreground"
                                        )}>
                                            {item.description}
                                        </div>
                                    </div>
                                )}
                            </button>
                        )
                    })}
                </nav>
            </div>
        </div>
    )
}
import { Bell, MagnifyingGlass, User } from '@phosphor-icons/react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'

interface HeaderProps {
    onMenuClick: () => void
}

export function Header({ onMenuClick }: HeaderProps) {
    return (
        <header className="h-16 bg-card border-b border-border px-6 flex items-center justify-between">
            <div className="flex items-center gap-4 flex-1">
                <div className="relative max-w-md flex-1">
                    <MagnifyingGlass 
                        size={16} 
                        className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground" 
                    />
                    <Input
                        placeholder="Search applications, capabilities, interfaces..."
                        className="pl-9 bg-background"
                    />
                </div>
            </div>

            <div className="flex items-center gap-2">
                <Button variant="ghost" size="sm" className="relative">
                    <Bell size={18} />
                    <span className="absolute -top-1 -right-1 h-2 w-2 bg-accent rounded-full" />
                </Button>
                
                <Button variant="ghost" size="sm">
                    <User size={18} />
                </Button>
            </div>
        </header>
    )
}
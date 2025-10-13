import { useState } from 'react'
import { Sidebar } from './components/layout/Sidebar'
import { Header } from './components/layout/Header'
import { ApplicationsView } from './components/views/ApplicationsView'
import { CapabilitiesView } from './components/views/CapabilitiesView'
import { InterfacesView } from './components/views/InterfacesView'
import { ProcessesView } from './components/views/ProcessesView'
import { TechnologiesView } from './components/views/TechnologiesView'
import { DashboardView } from './components/views/DashboardView'
import { OwnersView } from './components/views/OwnersView'
import { SkillsView } from './components/views/SkillsView'

type ViewType = 'dashboard' | 'applications' | 'capabilities' | 'interfaces' | 'processes' | 'technologies' | 'owners' | 'skills'

function App() {
    const [activeView, setActiveView] = useState<ViewType>('dashboard')
    const [sidebarOpen, setSidebarOpen] = useState(true)

    const renderView = () => {
        switch (activeView) {
            case 'applications':
                return <ApplicationsView />
            case 'capabilities':
                return <CapabilitiesView />
            case 'processes':
                return <ProcessesView />
            case 'technologies':
                return <TechnologiesView />
            case 'interfaces':
                return <InterfacesView />
            case 'owners':
                return <OwnersView />
            case 'skills':
                return <SkillsView />
            default:
                return <DashboardView />
        }
    }

    return (
        <div className="min-h-screen bg-background">
            <Sidebar 
                open={sidebarOpen}
                onToggle={() => setSidebarOpen(!sidebarOpen)}
                activeView={activeView}
                onViewChange={setActiveView}
            />
            <div className={`transition-all duration-300 ${sidebarOpen ? 'ml-64' : 'ml-16'}`}>
                <Header onMenuClick={() => setSidebarOpen(!sidebarOpen)} />
                <main className="p-6">
                    {renderView()}
                </main>
            </div>
        </div>
    )
}

export default App
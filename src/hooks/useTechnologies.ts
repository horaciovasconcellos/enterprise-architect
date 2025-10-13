import { useState, useEffect } from 'react'
import { useKV } from '@github/spark/hooks'

export interface Technology {
    id: string
    name: string
    version?: string
    category: string
    vendor?: string
    description?: string
    createdAt: string
    updatedAt: string
}

export function useTechnologies() {
    const [technologies, setTechnologies] = useKV<Technology[]>('technologies', [])
    const [initialized, setInitialized] = useState(false)

    // Initialize with sample data if empty
    useEffect(() => {
        if (!initialized && (technologies?.length === 0 || !technologies)) {
            const sampleTechnologies: Technology[] = [
                {
                    id: '1',
                    name: 'React',
                    version: '18.x',
                    category: 'Frontend Framework',
                    vendor: 'Meta',
                    description: 'Biblioteca JavaScript para construir interfaces de usuário',
                    createdAt: new Date().toISOString(),
                    updatedAt: new Date().toISOString()
                },
                {
                    id: '2',
                    name: 'TypeScript',
                    version: '5.x',
                    category: 'Programming Language',
                    vendor: 'Microsoft',
                    description: 'Linguagem de programação que adiciona tipagem estática ao JavaScript',
                    createdAt: new Date().toISOString(),
                    updatedAt: new Date().toISOString()
                },
                {
                    id: '3',
                    name: 'Node.js',
                    version: '20.x',
                    category: 'Runtime',
                    vendor: 'Node.js Foundation',
                    description: 'Runtime JavaScript para servidor',
                    createdAt: new Date().toISOString(),
                    updatedAt: new Date().toISOString()
                },
                {
                    id: '4',
                    name: 'PostgreSQL',
                    version: '15.x',
                    category: 'Database',
                    vendor: 'PostgreSQL Global Development Group',
                    description: 'Sistema de banco de dados relacional',
                    createdAt: new Date().toISOString(),
                    updatedAt: new Date().toISOString()
                }
            ]
            
            setTechnologies(sampleTechnologies)
            setInitialized(true)
        }
    }, [technologies, initialized, setTechnologies])

    const createTechnology = async (techData: Omit<Technology, 'id' | 'createdAt' | 'updatedAt'>) => {
        const newTechnology: Technology = {
            ...techData,
            id: crypto.randomUUID(),
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString()
        }

        setTechnologies(currentTechs => [...(currentTechs || []), newTechnology])
        return newTechnology
    }

    const updateTechnology = async (id: string, techData: Partial<Technology>) => {
        setTechnologies(currentTechs => 
            (currentTechs || []).map(tech => 
                tech.id === id 
                    ? { 
                        ...tech, 
                        ...techData, 
                        updatedAt: new Date().toISOString() 
                    }
                    : tech
            )
        )
    }

    const deleteTechnology = async (id: string) => {
        setTechnologies(currentTechs => (currentTechs || []).filter(tech => tech.id !== id))
    }

    return {
        technologies: technologies || [],
        createTechnology,
        updateTechnology,
        deleteTechnology
    }
}
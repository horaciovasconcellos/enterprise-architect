import { useState, useEffect } from 'react'
import { useKV } from '@github/spark/hooks'

export interface Owner {
    id: string
    matricula: string
    nome: string
    area: string
    createdAt: string
    updatedAt: string
}

export function useOwners() {
    const [owners, setOwners] = useKV<Owner[]>('owners', [])
    const [initialized, setInitialized] = useState(false)

    // Initialize with sample data if empty
    useEffect(() => {
        if (!initialized && (owners?.length === 0 || !owners)) {
            const sampleOwners: Owner[] = [
                {
                    id: '1',
                    matricula: '12345',
                    nome: 'João Silva',
                    area: 'Desenvolvimento Frontend',
                    createdAt: new Date().toISOString(),
                    updatedAt: new Date().toISOString()
                },
                {
                    id: '2',
                    matricula: '12346',
                    nome: 'Maria Santos',
                    area: 'Desenvolvimento Backend',
                    createdAt: new Date().toISOString(),
                    updatedAt: new Date().toISOString()
                },
                {
                    id: '3',
                    matricula: '12347',
                    nome: 'Pedro Costa',
                    area: 'DevOps',
                    createdAt: new Date().toISOString(),
                    updatedAt: new Date().toISOString()
                },
                {
                    id: '4',
                    matricula: '12348',
                    nome: 'Ana Oliveira',
                    area: 'Arquitetura de Dados',
                    createdAt: new Date().toISOString(),
                    updatedAt: new Date().toISOString()
                }
            ]
            
            setOwners(sampleOwners)
            setInitialized(true)
        }
    }, [owners, initialized, setOwners])

    const createOwner = async (ownerData: Omit<Owner, 'id' | 'createdAt' | 'updatedAt'>) => {
        const newOwner: Owner = {
            ...ownerData,
            id: crypto.randomUUID(),
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString()
        }

        setOwners(currentOwners => [...(currentOwners || []), newOwner])
        return newOwner
    }

    const updateOwner = async (id: string, ownerData: Partial<Owner>) => {
        setOwners(currentOwners => 
            (currentOwners || []).map(owner => 
                owner.id === id 
                    ? { 
                        ...owner, 
                        ...ownerData, 
                        updatedAt: new Date().toISOString() 
                    }
                    : owner
            )
        )
    }

    const deleteOwner = async (id: string) => {
        setOwners(currentOwners => (currentOwners || []).filter(owner => owner.id !== id))
    }

    return {
        owners: owners || [],
        createOwner,
        updateOwner,
        deleteOwner
    }
}
import { useState, useEffect } from 'react'
import { useKV } from '@github/spark/hooks'

export interface SkillTechnology {
    technologyId: string
    proficiencyLevel: number
    startDate: string
    endDate: string
}

export interface SkillDeveloper {
    ownerId: string
    proficiencyLevel: number
    certificationDate: string
    notes: string
}

export interface Skill {
    id: string
    name: string
    code: string
    description?: string
    guidanceNotes?: string
    levelDescription?: string
    technologies: SkillTechnology[]
    developers: SkillDeveloper[]
    createdAt: string
    updatedAt: string
}

export function useSkills() {
    const [skills, setSkills] = useKV<Skill[]>('skills', [])
    const [loading, setLoading] = useState(false)
    const [error, setError] = useState<string | null>(null)

    const createSkill = async (skillData: Omit<Skill, 'id' | 'createdAt' | 'updatedAt'>) => {
        try {
            setLoading(true)
            setError(null)

            const newSkill: Skill = {
                ...skillData,
                id: crypto.randomUUID(),
                technologies: skillData.technologies || [],
                developers: skillData.developers || [],
                createdAt: new Date().toISOString(),
                updatedAt: new Date().toISOString()
            }

            setSkills(currentSkills => [...(currentSkills || []), newSkill])
            return newSkill
        } catch (err) {
            const errorMessage = err instanceof Error ? err.message : 'Erro ao criar habilidade'
            setError(errorMessage)
            throw err
        } finally {
            setLoading(false)
        }
    }

    const updateSkill = async (id: string, skillData: Partial<Skill>) => {
        try {
            setLoading(true)
            setError(null)

            setSkills(currentSkills => 
                (currentSkills || []).map(skill => 
                    skill.id === id 
                        ? { 
                            ...skill, 
                            ...skillData, 
                            updatedAt: new Date().toISOString() 
                        }
                        : skill
                )
            )
        } catch (err) {
            const errorMessage = err instanceof Error ? err.message : 'Erro ao atualizar habilidade'
            setError(errorMessage)
            throw err
        } finally {
            setLoading(false)
        }
    }

    const deleteSkill = async (id: string) => {
        try {
            setLoading(true)
            setError(null)

            setSkills(currentSkills => (currentSkills || []).filter(skill => skill.id !== id))
        } catch (err) {
            const errorMessage = err instanceof Error ? err.message : 'Erro ao excluir habilidade'
            setError(errorMessage)
            throw err
        } finally {
            setLoading(false)
        }
    }

    const getSkillById = (id: string): Skill | undefined => {
        return (skills || []).find(skill => skill.id === id)
    }

    return {
        skills,
        loading,
        error,
        createSkill,
        updateSkill,
        deleteSkill,
        getSkillById
    }
}
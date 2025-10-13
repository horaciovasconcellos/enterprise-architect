import { useState, useEffect } from 'react'

const API_BASE_URL = 'http://localhost:3001/api'

// Hook genérico para fazer requisições à API
export function useApi<T>(endpoint: string, initialData: T) {
  const [data, setData] = useState<T>(initialData)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const fetchData = async () => {
    try {
      setLoading(true)
      setError(null)
      const response = await fetch(`${API_BASE_URL}${endpoint}`)
      
      if (!response.ok) {
        throw new Error(`Erro ${response.status}: ${response.statusText}`)
      }
      
      const result = await response.json()
      setData(result)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erro desconhecido')
      console.error('Erro na API:', err)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchData()
  }, [endpoint])

  const refetch = () => {
    fetchData()
  }

  return { data, loading, error, refetch, setData }
}

// Hook para aplicações
export function useApplications() {
  const { data, loading, error, refetch, setData } = useApi<any[]>('/applications', [])

  const createApplication = async (applicationData: any) => {
    try {
      const response = await fetch(`${API_BASE_URL}/applications`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(applicationData),
      })

      if (!response.ok) {
        throw new Error('Erro ao criar aplicação')
      }

      const newApplication = await response.json()
      setData((current: any[]) => [...current, newApplication])
      return newApplication
    } catch (error) {
      console.error('Erro ao criar aplicação:', error)
      throw error
    }
  }

  const updateApplication = async (id: string, applicationData: any) => {
    try {
      const response = await fetch(`${API_BASE_URL}/applications/${id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(applicationData),
      })

      if (!response.ok) {
        throw new Error('Erro ao atualizar aplicação')
      }

      const updatedApplication = await response.json()
      setData((current: any[]) => 
        current.map(app => app.id === id ? updatedApplication : app)
      )
      return updatedApplication
    } catch (error) {
      console.error('Erro ao atualizar aplicação:', error)
      throw error
    }
  }

  const deleteApplication = async (id: string) => {
    try {
      const response = await fetch(`${API_BASE_URL}/applications/${id}`, {
        method: 'DELETE',
      })

      if (!response.ok) {
        throw new Error('Erro ao deletar aplicação')
      }

      setData((current: any[]) => current.filter(app => app.id !== id))
    } catch (error) {
      console.error('Erro ao deletar aplicação:', error)
      throw error
    }
  }

  return {
    applications: data,
    loading,
    error,
    refetch,
    createApplication,
    updateApplication,
    deleteApplication
  }
}

// Hook para capacidades
export function useCapabilities() {
  const { data, loading, error, refetch, setData } = useApi<any[]>('/capabilities', [])

  const createCapability = async (capabilityData: any) => {
    try {
      const response = await fetch(`${API_BASE_URL}/capabilities`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(capabilityData),
      })

      if (!response.ok) {
        throw new Error('Erro ao criar capacidade')
      }

      const newCapability = await response.json()
      setData((current: any[]) => [...current, newCapability])
      return newCapability
    } catch (error) {
      console.error('Erro ao criar capacidade:', error)
      throw error
    }
  }

  const updateCapability = async (id: string, capabilityData: any) => {
    try {
      const response = await fetch(`${API_BASE_URL}/capabilities/${id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(capabilityData),
      })

      if (!response.ok) {
        throw new Error('Erro ao atualizar capacidade')
      }

      const updatedCapability = await response.json()
      setData((current: any[]) => 
        current.map(cap => cap.id === id ? updatedCapability : cap)
      )
      return updatedCapability
    } catch (error) {
      console.error('Erro ao atualizar capacidade:', error)
      throw error
    }
  }

  const deleteCapability = async (id: string) => {
    try {
      const response = await fetch(`${API_BASE_URL}/capabilities/${id}`, {
        method: 'DELETE',
      })

      if (!response.ok) {
        throw new Error('Erro ao deletar capacidade')
      }

      setData((current: any[]) => current.filter(cap => cap.id !== id))
    } catch (error) {
      console.error('Erro ao deletar capacidade:', error)
      throw error
    }
  }

  return {
    capabilities: data,
    loading,
    error,
    refetch,
    createCapability,
    updateCapability,
    deleteCapability
  }
}

// Hook para tecnologias
export function useTechnologies() {
  const { data, loading, error, refetch, setData } = useApi<any[]>('/technologies', [])

  const createTechnology = async (technologyData: any) => {
    try {
      const response = await fetch(`${API_BASE_URL}/technologies`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(technologyData),
      })

      if (!response.ok) {
        throw new Error('Erro ao criar tecnologia')
      }

      const newTechnology = await response.json()
      setData((current: any[]) => [...current, newTechnology])
      return newTechnology
    } catch (error) {
      console.error('Erro ao criar tecnologia:', error)
      throw error
    }
  }

  const updateTechnology = async (id: string, technologyData: any) => {
    try {
      const response = await fetch(`${API_BASE_URL}/technologies/${id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(technologyData),
      })

      if (!response.ok) {
        throw new Error('Erro ao atualizar tecnologia')
      }

      const updatedTechnology = await response.json()
      setData((current: any[]) => 
        current.map(tech => tech.id === id ? updatedTechnology : tech)
      )
      return updatedTechnology
    } catch (error) {
      console.error('Erro ao atualizar tecnologia:', error)
      throw error
    }
  }

  const deleteTechnology = async (id: string) => {
    try {
      const response = await fetch(`${API_BASE_URL}/technologies/${id}`, {
        method: 'DELETE',
      })

      if (!response.ok) {
        throw new Error('Erro ao deletar tecnologia')
      }

      setData((current: any[]) => current.filter(tech => tech.id !== id))
    } catch (error) {
      console.error('Erro ao deletar tecnologia:', error)
      throw error
    }
  }

  return {
    technologies: data,
    loading,
    error,
    refetch,
    createTechnology,
    updateTechnology,
    deleteTechnology
  }
}

// Hook para proprietários
export function useOwners() {
  const { data, loading, error, refetch, setData } = useApi<any[]>('/owners', [])

  const createOwner = async (ownerData: any) => {
    try {
      const response = await fetch(`${API_BASE_URL}/owners`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(ownerData),
      })

      if (!response.ok) {
        throw new Error('Erro ao criar proprietário')
      }

      const newOwner = await response.json()
      setData((current: any[]) => [...current, newOwner])
      return newOwner
    } catch (error) {
      console.error('Erro ao criar proprietário:', error)
      throw error
    }
  }

  const updateOwner = async (id: string, ownerData: any) => {
    try {
      const response = await fetch(`${API_BASE_URL}/owners/${id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(ownerData),
      })

      if (!response.ok) {
        throw new Error('Erro ao atualizar proprietário')
      }

      const updatedOwner = await response.json()
      setData((current: any[]) => 
        current.map(owner => owner.id === id ? updatedOwner : owner)
      )
      return updatedOwner
    } catch (error) {
      console.error('Erro ao atualizar proprietário:', error)
      throw error
    }
  }

  const deleteOwner = async (id: string) => {
    try {
      const response = await fetch(`${API_BASE_URL}/owners/${id}`, {
        method: 'DELETE',
      })

      if (!response.ok) {
        throw new Error('Erro ao deletar proprietário')
      }

      setData((current: any[]) => current.filter(owner => owner.id !== id))
    } catch (error) {
      console.error('Erro ao deletar proprietário:', error)
      throw error
    }
  }

  return {
    owners: data,
    loading,
    error,
    refetch,
    createOwner,
    updateOwner,
    deleteOwner
  }
}

// Hook para processos
export function useProcesses() {
  const { data, loading, error, refetch, setData } = useApi<any[]>('/processes', [])

  const createProcess = async (processData: any) => {
    try {
      const response = await fetch(`${API_BASE_URL}/processes`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(processData),
      })

      if (!response.ok) {
        throw new Error('Erro ao criar processo')
      }

      const newProcess = await response.json()
      setData((current: any[]) => [...current, newProcess])
      return newProcess
    } catch (error) {
      console.error('Erro ao criar processo:', error)
      throw error
    }
  }

  const updateProcess = async (id: string, processData: any) => {
    try {
      const response = await fetch(`${API_BASE_URL}/processes/${id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(processData),
      })

      if (!response.ok) {
        throw new Error('Erro ao atualizar processo')
      }

      const updatedProcess = await response.json()
      setData((current: any[]) => 
        current.map(proc => proc.id === id ? updatedProcess : proc)
      )
      return updatedProcess
    } catch (error) {
      console.error('Erro ao atualizar processo:', error)
      throw error
    }
  }

  const deleteProcess = async (id: string) => {
    try {
      const response = await fetch(`${API_BASE_URL}/processes/${id}`, {
        method: 'DELETE',
      })

      if (!response.ok) {
        throw new Error('Erro ao deletar processo')
      }

      setData((current: any[]) => current.filter(proc => proc.id !== id))
    } catch (error) {
      console.error('Erro ao deletar processo:', error)
      throw error
    }
  }

  return {
    processes: data,
    loading,
    error,
    refetch,
    createProcess,
    updateProcess,
    deleteProcess
  }
}

// Hook para interfaces
export function useInterfaces() {
  const { data, loading, error, refetch, setData } = useApi<any[]>('/interfaces', [])

  const createInterface = async (interfaceData: any) => {
    try {
      const response = await fetch(`${API_BASE_URL}/interfaces`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(interfaceData),
      })

      if (!response.ok) {
        throw new Error('Erro ao criar interface')
      }

      const newInterface = await response.json()
      setData((current: any[]) => [...current, newInterface])
      return newInterface
    } catch (error) {
      console.error('Erro ao criar interface:', error)
      throw error
    }
  }

  const updateInterface = async (id: string, interfaceData: any) => {
    try {
      const response = await fetch(`${API_BASE_URL}/interfaces/${id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(interfaceData),
      })

      if (!response.ok) {
        throw new Error('Erro ao atualizar interface')
      }

      const updatedInterface = await response.json()
      setData((current: any[]) => 
        current.map(intf => intf.id === id ? updatedInterface : intf)
      )
      return updatedInterface
    } catch (error) {
      console.error('Erro ao atualizar interface:', error)
      throw error
    }
  }

  const deleteInterface = async (id: string) => {
    try {
      const response = await fetch(`${API_BASE_URL}/interfaces/${id}`, {
        method: 'DELETE',
      })

      if (!response.ok) {
        throw new Error('Erro ao deletar interface')
      }

      setData((current: any[]) => current.filter(intf => intf.id !== id))
    } catch (error) {
      console.error('Erro ao deletar interface:', error)
      throw error
    }
  }

  return {
    interfaces: data,
    loading,
    error,
    refetch,
    createInterface,
    updateInterface,
    deleteInterface
  }
}

// Hook para relacionamentos
export function useRelationships() {
  const { data, loading, error, refetch, setData } = useApi<any[]>('/relationships', [])

  const createRelationship = async (relationshipData: any) => {
    try {
      const response = await fetch(`${API_BASE_URL}/relationships`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(relationshipData),
      })

      if (!response.ok) {
        if (response.status === 409) {
          throw new Error('Relacionamento já existe')
        }
        throw new Error('Erro ao criar relacionamento')
      }

      const newRelationship = await response.json()
      setData((current: any[]) => [...current, newRelationship])
      return newRelationship
    } catch (error) {
      console.error('Erro ao criar relacionamento:', error)
      throw error
    }
  }

  const deleteRelationship = async (ownerId: string, applicationId: string, relationshipType: string) => {
    try {
      const response = await fetch(`${API_BASE_URL}/relationships/${ownerId}/${applicationId}/${relationshipType}`, {
        method: 'DELETE',
      })

      if (!response.ok) {
        throw new Error('Erro ao deletar relacionamento')
      }

      setData((current: any[]) => 
        current.filter(rel => 
          !(rel.ownerId === ownerId && rel.applicationId === applicationId && rel.relationshipType === relationshipType)
        )
      )
    } catch (error) {
      console.error('Erro ao deletar relacionamento:', error)
      throw error
    }
  }

  return {
    relationships: data,
    loading,
    error,
    refetch,
    createRelationship,
    deleteRelationship
  }
}

// Hook para habilidades (skills)
export function useSkills() {
  const { data, loading, error, refetch, setData } = useApi<any[]>('/skills', [])

  const createSkill = async (skillData: any) => {
    try {
      console.log('🚀 useDatabase.createSkill - Dados que serão enviados:', {
        ...skillData,
        technologiesCount: skillData.technologies?.length || 0,
        developersCount: skillData.developers?.length || 0,
        technologiesData: skillData.technologies,
        developersData: skillData.developers
      })

      const response = await fetch(`${API_BASE_URL}/skills`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(skillData),
      })

      console.log('📡 useDatabase.createSkill - Response status:', response.status)

      if (!response.ok) {
        const errorText = await response.text()
        console.error('❌ useDatabase.createSkill - Erro na resposta:', errorText)
        throw new Error('Erro ao criar habilidade')
      }

      const newSkill = await response.json()
      console.log('✅ useDatabase.createSkill - Skill criada:', newSkill.id)
      setData((current: any[]) => [...current, newSkill])
      return newSkill
    } catch (error) {
      console.error('❌ useDatabase.createSkill - Erro:', error)
      throw error
    }
  }

  const updateSkill = async (id: string, skillData: any) => {
    try {
      console.log('🚀 useDatabase.updateSkill - Dados que serão enviados:', {
        id,
        ...skillData,
        technologiesCount: skillData.technologies?.length || 0,
        developersCount: skillData.developers?.length || 0
      })

      const response = await fetch(`${API_BASE_URL}/skills/${id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(skillData),
      })

      console.log('📡 useDatabase.updateSkill - Response status:', response.status)

      if (!response.ok) {
        const errorText = await response.text()
        console.error('❌ useDatabase.updateSkill - Erro na resposta:', errorText)
        throw new Error('Erro ao atualizar habilidade')
      }

      const updatedSkill = await response.json()
      console.log('✅ useDatabase.updateSkill - Skill atualizada:', updatedSkill.id)
      setData((current: any[]) => 
        current.map(skill => skill.id === id ? updatedSkill : skill)
      )
      return updatedSkill
    } catch (error) {
      console.error('Erro ao atualizar habilidade:', error)
      throw error
    }
  }

  const deleteSkill = async (id: string) => {
    try {
      const response = await fetch(`${API_BASE_URL}/skills/${id}`, {
        method: 'DELETE',
      })

      if (!response.ok) {
        throw new Error('Erro ao deletar habilidade')
      }

      setData((current: any[]) => current.filter(skill => skill.id !== id))
    } catch (error) {
      console.error('Erro ao deletar habilidade:', error)
      throw error
    }
  }

  return {
    skills: data,
    loading,
    error,
    refetch,
    createSkill,
    updateSkill,
    deleteSkill
  }
}
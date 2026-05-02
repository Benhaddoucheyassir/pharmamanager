import { useState, useEffect } from 'react'
import { getMedicaments, createMedicament, deleteMedicament } from '../api/medicaments'

export function useMedicaments() {
  const [medicaments, setMedicaments] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  const fetchMedicaments = async () => {
    try {
      setLoading(true)
      const response = await getMedicaments()
      setMedicaments(response.data)
    } catch (err) {
      setError('Failed to load medicaments')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => { fetchMedicaments() }, [])

  const addMedicament = async (data) => {
    const response = await createMedicament(data)
    setMedicaments(prev => [...prev, response.data])
    return response.data
  }

  const removeMedicament = async (id) => {
    await deleteMedicament(id)
    setMedicaments(prev => prev.filter(m => m.id !== id))
  }

  return { medicaments, loading, error, addMedicament, removeMedicament, refetch: fetchMedicaments }
}
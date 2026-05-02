import { useState, useEffect } from 'react'
import { getCategories, createCategory, deleteCategory } from '../api/categories'

export function useCategories() {
  const [categories, setCategories] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  const fetchCategories = async () => {
    try {
      setLoading(true)
      const response = await getCategories()
      setCategories(response.data)
    } catch (err) {
      setError('Failed to load categories')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => { fetchCategories() }, [])

  const addCategory = async (data) => {
    const response = await createCategory(data)
    setCategories(prev => [...prev, response.data])
    return response.data
  }

  const removeCategory = async (id) => {
    await deleteCategory(id)
    setCategories(prev => prev.filter(c => c.id !== id))
  }

  return { categories, loading, error, addCategory, removeCategory, refetch: fetchCategories }
}
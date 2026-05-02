import { useState, useEffect } from 'react'
import { getSales, createSale, cancelSale } from '../api/sales'

export function useSales() {
  const [sales, setSales] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  const fetchSales = async () => {
    try {
      setLoading(true)
      const response = await getSales()
      setSales(response.data)
    } catch (err) {
      setError('Failed to load sales')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => { fetchSales() }, [])

  const addSale = async (data) => {
    const response = await createSale(data)
    setSales(prev => [response.data, ...prev])
    return response.data
  }

  const cancel = async (id) => {
    const response = await cancelSale(id)
    setSales(prev => prev.map(s => s.id === id ? response.data : s))
  }

  return { sales, loading, error, addSale, cancel, refetch: fetchSales }
}
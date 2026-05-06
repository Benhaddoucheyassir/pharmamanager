import { useState, useEffect } from 'react'
import { getSales, createSale, cancelSale } from '../api/sales'
import { toast } from 'sonner'

export interface Sale {
  id: number;
  medicament_name: string;
  quantite: number;
  prix_total: number;
  date_vente: string;
  is_cancelled: boolean;
}

export function useSales() {
  const [sales, setSales] = useState<Sale[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);

  const fetchSales = async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await getSales();
      setSales(response.data);
    } catch (err: any) {
      const errorMessage = err?.response?.data?.detail || err?.message || 'Failed to load sales';
      setError(errorMessage);
      toast.error(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchSales() }, []);

  const addSale = async (data: { medicament: number; quantite: number }) => {
    setIsSubmitting(true);
    try {
      const response = await createSale(data);
      setSales(prev => [response.data, ...prev]);
      toast.success('Sale recorded successfully');
      return response.data;
    } catch (err: any) {
      const errorMessage = err?.response?.data?.detail || err?.message || 'Failed to save sale. Check stock levels.';
      setError(errorMessage);
      toast.error(errorMessage);
      throw err;
    } finally {
      setIsSubmitting(false);
    }
  };

  const cancel = async (id: number) => {
    setIsSubmitting(true);
    try {
      const response = await cancelSale(id);
      setSales(prev => prev.map(s => s.id === id ? response.data : s));
      toast.success('Sale cancelled successfully');
    } catch (err: any) {
      const errorMessage = err?.response?.data?.detail || err?.message || 'Failed to cancel sale';
      setError(errorMessage);
      toast.error(errorMessage);
      throw err;
    } finally {
      setIsSubmitting(false);
    }
  };

  return { sales, loading, error, isSubmitting, addSale, cancel, refetch: fetchSales };
}
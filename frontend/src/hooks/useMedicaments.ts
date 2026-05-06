import { useState, useEffect } from 'react'
import { getMedicaments, createMedicament, deleteMedicament } from '../api/medicaments'
import { toast } from 'sonner'

export interface Medicament {
  id: number;
  nom: string;
  prix_vente: number;
  stock: number;
  categorie_name?: string;
  description?: string;
}

export function useMedicaments() {
  const [medicaments, setMedicaments] = useState<Medicament[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);

  const fetchMedicaments = async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await getMedicaments();
      setMedicaments(response.data);
    } catch (err: any) {
      const errorMessage = err?.response?.data?.detail || err?.message || 'Failed to load medicaments';
      setError(errorMessage);
      toast.error(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchMedicaments() }, []);

  const addMedicament = async (data: Medicament) => {
    setIsSubmitting(true);
    try {
      const response = await createMedicament(data);
      setMedicaments(prev => [...prev, response.data]);
      toast.success('Medicament added successfully');
      return response.data;
    } catch (err: any) {
      const errorMessage = err?.response?.data?.detail || err?.message || 'Failed to add medicament';
      setError(errorMessage);
      toast.error(errorMessage);
      throw err;
    } finally {
      setIsSubmitting(false);
    }
  };

  const removeMedicament = async (id: number) => {
    setIsSubmitting(true);
    try {
      await deleteMedicament(id);
      setMedicaments(prev => prev.filter(m => m.id !== id));
      toast.success('Medicament deleted successfully');
    } catch (err: any) {
      const errorMessage = err?.response?.data?.detail || err?.message || 'Failed to delete medicament';
      setError(errorMessage);
      toast.error(errorMessage);
      throw err;
    } finally {
      setIsSubmitting(false);
    }
  };

  return { medicaments, loading, error, isSubmitting, addMedicament, removeMedicament, refetch: fetchMedicaments };
}
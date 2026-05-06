import { useState, useEffect } from 'react'
import { getCategories, createCategory, deleteCategory } from '../api/categories'
import { toast } from 'sonner'

// Define the shape of your Category
export interface Category {
  id: number;
  nom: string;
  description?: string;
}

export function useCategories() {
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);

  const fetchCategories = async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await getCategories();
      setCategories(response.data);
    } catch (err: any) {
      const errorMessage = err?.response?.data?.detail || err?.message || 'Failed to load categories';
      setError(errorMessage);
      toast.error(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchCategories() }, []);

  const addCategory = async (data: Partial<Category>) => {
    setIsSubmitting(true);
    try {
      const response = await createCategory(data);
      setCategories(prev => [...prev, response.data]);
      toast.success('Category added successfully');
      return response.data;
    } catch (err: any) {
      const errorMessage = err?.response?.data?.detail || err?.message || 'Failed to add category';
      setError(errorMessage);
      toast.error(errorMessage);
      throw err;
    } finally {
      setIsSubmitting(false);
    }
  };

  const removeCategory = async (id: number) => {
    setIsSubmitting(true);
    try {
      await deleteCategory(id);
      setCategories(prev => prev.filter(c => c.id !== id));
      toast.success('Category deleted successfully');
    } catch (err: any) {
      const errorMessage = err?.response?.data?.detail || err?.message || 'Failed to delete category';
      setError(errorMessage);
      toast.error(errorMessage);
      throw err;
    } finally {
      setIsSubmitting(false);
    }
  };

  return { categories, loading, error, isSubmitting, addCategory, removeCategory, refetch: fetchCategories };
}
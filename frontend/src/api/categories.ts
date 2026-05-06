import client from './client'

// Add types to the arguments
export const getCategories = () => client.get('/categories/')
export const getCategory = (id: number) => client.get(`/categories/${id}/`)
export const createCategory = (data: any) => client.post('/categories/', data)
export const updateCategory = (id: number, data: any) => client.patch(`/categories/${id}/`, data)
export const deleteCategory = (id: number) => client.delete(`/categories/${id}/`)
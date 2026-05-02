import client from './client'

export const getSales = () => client.get('/sales/')
export const createSale = (data) => client.post('/sales/', data)
export const cancelSale = (id) => client.post(`/sales/${id}/cancel/`)
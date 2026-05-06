import client from './client'

export const getSales = () => client.get('/sales/')
export const createSale = (data : any) => client.post('/sales/', data)
export const cancelSale = (id : number) => client.post(`/sales/${id}/cancel/`)
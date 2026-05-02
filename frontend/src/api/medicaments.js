import client from './client'

export const getMedicaments = () => client.get('/medicaments/')
export const getMedicament = (id) => client.get(`/medicaments/${id}/`)
export const getLowStock = () => client.get('/medicaments/low-stock/')
export const createMedicament = (data) => client.post('/medicaments/', data)
export const updateMedicament = (id, data) => client.patch(`/medicaments/${id}/`, data)
export const deleteMedicament = (id) => client.delete(`/medicaments/${id}/`)
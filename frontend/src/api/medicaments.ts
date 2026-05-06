import client from './client'

export const getMedicaments = () => client.get('/medicaments/')
export const getMedicament = (id : number) => client.get(`/medicaments/${id}/`)
export const getLowStock = () => client.get('/medicaments/low-stock/')
export const createMedicament = (data : any) => client.post('/medicaments/', data)
export const updateMedicament = (id : number, data : any) => client.patch(`/medicaments/${id}/`, data)
export const deleteMedicament = (id : number) => client.delete(`/medicaments/${id}/`)
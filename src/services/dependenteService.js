import { apiRequest } from "./api";
import { mapBackendToFrontendDependente, mapFrontendToBackendDependente } from "../utils/dependenteMapper";

export const dependenteService = {
  async getAll() {
    const data = await apiRequest('/dependentes')
    return Array.isArray(data) ? data.map(mapBackendToFrontendDependente) : []
  },

  async getBySocioId(socioId) {
    // try query param
    try {
      const data = await apiRequest(`/dependentes?socio_id=${socioId}`)
      return Array.isArray(data) ? data.map(mapBackendToFrontendDependente) : []
    } catch (err) {
      // fallback to nested route
      const data = await apiRequest(`/socios/${socioId}/dependentes`)
      return Array.isArray(data) ? data.map(mapBackendToFrontendDependente) : []
    }
  },

  async create(dep) {
    const payload = mapFrontendToBackendDependente(dep)
    // remove id if null
    if (payload.id == null) delete payload.id
    return apiRequest('/dependentes', {
      method: 'POST',
      body: JSON.stringify(payload),
    })
  },

  async update(id, dep) {
    const payload = mapFrontendToBackendDependente(dep)
    // ensure id not duplicated in body if backend doesn't expect it
    if (payload.id == null) delete payload.id
    return apiRequest(`/dependentes/${id}`, {
      method: 'PUT',
      body: JSON.stringify(payload),
    })
  },

  async delete(id) {
    return apiRequest(`/dependentes/${id}`, {
      method: 'DELETE',
    })
  }
}

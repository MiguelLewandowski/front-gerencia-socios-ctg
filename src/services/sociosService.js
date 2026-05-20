import { api } from './api'

export function getSocios() {
  return api.getSocios()
}

export function getSocioById(id) {
  return api.getSocioById(id)
}

export function createSocio(socioData) {
  return api.createSocio(socioData)
}

export function updateSocio(id, socioData) {
  return api.updateSocio(id, socioData)
}

export function deleteSocio(id) {
  return api.deleteSocio(id)
}

import apiClient from './apiClient'

const productService = {
  // Vendor endpoints
  getAvailableProducts() {
    return apiClient.get('/products/available')
  },

  getLockedProducts() {
    return apiClient.get('/products/locked')
  },

  lockProduct(productId) {
    return apiClient.post(`/products/${productId}/lock`)
  },

  unlockProduct(productId) {
    return apiClient.post(`/products/${productId}/unlock`)
  },

  // Trader endpoints
  getTraderProducts() {
    return apiClient.get('/products/trader')
  },

  createTraderProduct(data) {
    return apiClient.post('/products/trader', data)
  },

  updateTraderProduct(id, data) {
    return apiClient.put(`/products/trader/${id}`, data)
  },

  deleteTraderProduct(id) {
    return apiClient.delete(`/products/trader/${id}`)
  },
}

export default productService

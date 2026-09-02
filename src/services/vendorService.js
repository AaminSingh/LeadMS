import apiClient from './apiClient'

const vendorService = {
  getProfile() {
    return apiClient.get('/vendor/profile')
  },

  updateProfile(data) {
    return apiClient.put('/vendor/profile', {
      marginPercentage: data.marginPercentage,
      installationPrice: data.installationPrice,
      miscCharges: data.miscCharges,
    })
  },
}

export default vendorService

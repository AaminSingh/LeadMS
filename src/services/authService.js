import apiClient from './apiClient'
import useAuthStore from '../store/useAuthStore'

const authService = {
  register(data) {
    return apiClient.post('/auth/register', data)
  },

  login(credentials) {
    return apiClient.post('/auth/login', credentials)
  },

  logout() {
    const refreshToken = useAuthStore.getState().refreshToken
    return apiClient.post('/auth/logout', { refreshToken })
  },

  resetPassword(data) {
    return apiClient.post('/auth/reset-password', data)
  },

  resendConfirmation(email) {
    return apiClient.post('/auth/resend-confirmation', { email })
  },
}

export default authService

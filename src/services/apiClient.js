import axios from 'axios'
import useAuthStore from '../store/useAuthStore'

const apiClient = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL || 'https://leadms.onrender.com/api',
  headers: {
    'Content-Type': 'application/json',
  },
});
// Attach Bearer token to every outgoing request if available
apiClient.interceptors.request.use(
  (config) => {
    const accessToken = useAuthStore.getState().accessToken

    if (accessToken) {
      config.headers.Authorization = `Bearer ${accessToken}`
    }

    return config
  },
  (error) => Promise.reject(error)
)

// Handle 401 responses by attempting a silent token refresh
apiClient.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config

    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true

      const refreshToken = useAuthStore.getState().refreshToken

      if (refreshToken) {
        try {
          // Use plain axios to avoid interceptor loops
          const { data } = await axios.post(
            `${import.meta.env.VITE_API_BASE_URL}/auth/refresh-token`,
            { refreshToken }
          )

          const { user, refreshToken: currentRefreshToken } =
            useAuthStore.getState()

          useAuthStore.getState().setCredentials({
            user,
            accessToken: data.accessToken,
            refreshToken: currentRefreshToken,
          })

          originalRequest.headers.Authorization = `Bearer ${data.accessToken}`
          return apiClient(originalRequest)
        } catch (refreshError) {
          useAuthStore.getState().logout()
          return Promise.reject(refreshError)
        }
      }

      useAuthStore.getState().logout()
    }

    return Promise.reject(error)
  }
)

export default apiClient

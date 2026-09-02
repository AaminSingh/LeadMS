import apiClient from './apiClient'

const adminService = {
  getAnalytics() {
    return apiClient.get('/admin/analytics')
  },
  getUsers() {
    return apiClient.get('/admin/users')
  },
  getLeads() {
    return apiClient.get('/admin/leads')
  },
}

export default adminService

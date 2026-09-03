import apiClient from './apiClient'

const leadService = {
  getLeads() {
    return apiClient.get('/leads')
  },

  createLead(data) {
    const name = data.customerName || data.clientName
    const email = data.customerEmail || data.email
    const phone = data.customerPhone || data.phone

    return apiClient.post('/leads', {
      customerName: name,
      clientName: name,
      customerEmail: email,
      email: email,
      customerPhone: phone,
      phone: phone,
      requirement: data.requirement,
    })
  },

  updateLead(id, data) {
    const name = data.customerName || data.clientName
    const email = data.customerEmail || data.email
    const phone = data.customerPhone || data.phone

    return apiClient.put(`/leads/${id}`, {
      customerName: name,
      clientName: name,
      customerEmail: email,
      email: email,
      customerPhone: phone,
      phone: phone,
      requirement: data.requirement,
    })
  },

  deleteLead(id) {
    return apiClient.delete(`/leads/${id}`)
  },

  assignLead(leadId, teamMemberId) {
    return apiClient.put(`/leads/${leadId}/assign`, { teamMemberId })
  },

  updateLeadStatus(leadId, status) {
    return apiClient.put(`/leads/${leadId}/status`, { status })
  },

  quoteLead(leadId, quoteData) {
    return apiClient.post(`/leads/${leadId}/quote`, quoteData)
  },
}

export default leadService

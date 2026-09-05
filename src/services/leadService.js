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
    const payload = {}
    const name = data.customerName !== undefined ? data.customerName : data.clientName
    if (name !== undefined) {
      payload.customerName = name
      payload.clientName = name
    }
    const email = data.customerEmail !== undefined ? data.customerEmail : data.email
    if (email !== undefined) {
      payload.customerEmail = email
      payload.email = email
    }
    const phone = data.customerPhone !== undefined ? data.customerPhone : data.phone
    if (phone !== undefined) {
      payload.customerPhone = phone
      payload.phone = phone
    }
    if (data.requirement !== undefined) {
      payload.requirement = data.requirement
    }
    if (data.status !== undefined) {
      payload.status = data.status
    }

    return apiClient.put('/leads/' + id, payload)
  },

  deleteLead(id) {
    return apiClient.delete('/leads/' + id)
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

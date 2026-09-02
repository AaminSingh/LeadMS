import { useEffect, useState, useCallback } from 'react'
import { Plus, FileText, RefreshCw } from 'lucide-react'
import leadService from '../services/leadService'
import Badge from '../components/common/Badge'
import LeadFormModal from '../components/leads/LeadFormModal'
import QuoteBuilderModal from '../components/leads/QuoteBuilderModal'

function LeadsPage() {
  const [leads, setLeads] = useState([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)
  const [isModalOpen, setIsModalOpen] = useState(false)

  // Quote builder modal state
  const [quoteLeadItem, setQuoteLeadItem] = useState(null)

  const fetchLeads = useCallback(async () => {
    try {
      setLoading(true)
      setError(null)
      const res = await leadService.getLeads()
      setLeads(res.data?.leads || res.data || [])
    } catch (err) {
      console.error('Failed to fetch leads:', err)
      setError(err.response?.data?.message || 'Failed to load leads.')
      setLeads([])
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    fetchLeads()
  }, [fetchLeads])

  const handleOpenQuoteModal = (lead) => {
    setQuoteLeadItem(lead)
  }

  const handleCloseQuoteModal = () => {
    setQuoteLeadItem(null)
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Lead Pipeline</h1>
          <p className="text-sm text-gray-500">
            Manage client inquiries, assignments, and quotations.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={fetchLeads}
            disabled={loading}
            className="inline-flex items-center gap-2 rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm font-medium text-gray-700 transition-colors hover:bg-gray-50 disabled:opacity-50 cursor-pointer"
            title="Refresh Leads"
          >
            <RefreshCw size={16} className={loading ? 'animate-spin' : ''} />
            Refresh
          </button>

          <button
            onClick={() => setIsModalOpen(true)}
            className="inline-flex items-center gap-2 rounded-lg bg-blue-600 px-4 py-2 text-sm font-semibold text-white transition-colors hover:bg-blue-700 cursor-pointer"
          >
            <Plus size={18} />
            New Lead
          </button>
        </div>
      </div>

      {/* Error alert */}
      {error && (
        <div className="rounded-lg bg-red-50 p-4 text-sm text-red-600">
          {error}
        </div>
      )}

      {/* Table */}
      <div className="overflow-hidden rounded-xl border border-gray-200 bg-white shadow-sm">
        {loading && leads.length === 0 ? (
          <div className="p-8 space-y-3">
            {[1, 2, 3].map((n) => (
              <div key={n} className="h-12 w-full animate-pulse bg-gray-100 rounded-lg" />
            ))}
          </div>
        ) : leads.length === 0 ? (
          <div className="p-12 text-center">
            <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-xl bg-blue-50 text-blue-600 mb-3">
              <FileText size={24} />
            </div>
            <h3 className="text-base font-semibold text-gray-900">No Leads in Pipeline</h3>
            <p className="text-xs text-gray-500 max-w-sm mx-auto mt-1 mb-4">
              You haven't captured any client inquiries yet. Create your first lead to generate automated proposals!
            </p>
            <button
              onClick={() => setIsModalOpen(true)}
              className="inline-flex items-center gap-1.5 rounded-lg bg-blue-600 px-4 py-2 text-xs font-semibold text-white hover:bg-blue-700 cursor-pointer"
            >
              <Plus size={14} /> Add First Lead
            </button>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm">
              <thead className="border-b border-gray-200 bg-gray-50 text-xs font-semibold uppercase tracking-wider text-gray-500">
                <tr>
                  <th className="px-6 py-3.5">Client Name</th>
                  <th className="px-6 py-3.5">Contact</th>
                  <th className="px-6 py-3.5">Requirement</th>
                  <th className="px-6 py-3.5">Status</th>
                  <th className="px-6 py-3.5 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {leads.map((lead) => {
                  const leadId = lead._id || lead.id
                  const name = lead.clientName || lead.customerName || 'N/A'
                  const email = lead.email || lead.customerEmail || ''
                  const phone = lead.phone || lead.customerPhone || ''

                  return (
                    <tr
                      key={leadId}
                      className="transition-colors hover:bg-gray-50/80"
                    >
                      <td className="px-6 py-4 font-semibold text-gray-900">
                        {name}
                      </td>

                      <td className="px-6 py-4">
                        <div className="text-gray-900">{email}</div>
                        <div className="text-xs text-gray-500">{phone}</div>
                      </td>

                      <td className="px-6 py-4 max-w-xs text-gray-600">
                        <p className="line-clamp-2">
                          {lead.requirement || 'N/A'}
                        </p>
                      </td>

                      <td className="px-6 py-4">
                        <Badge status={lead.status} />
                      </td>

                      <td className="px-6 py-4 text-right">
                        <button
                          onClick={() => handleOpenQuoteModal(lead)}
                          className="inline-flex items-center gap-1.5 rounded-lg border border-purple-200 bg-purple-50 px-3 py-1.5 text-xs font-semibold text-purple-700 transition-colors hover:bg-purple-100 cursor-pointer"
                        >
                          <FileText size={14} />
                          Generate Quote
                        </button>
                      </td>
                    </tr>
                  )
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* New Lead Modal */}
      <LeadFormModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSuccess={fetchLeads}
      />

      {/* Quote Builder Modal */}
      <QuoteBuilderModal
        lead={quoteLeadItem}
        isOpen={Boolean(quoteLeadItem)}
        onClose={handleCloseQuoteModal}
        onSuccess={fetchLeads}
      />
    </div>
  )
}

export default LeadsPage

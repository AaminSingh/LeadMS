import { useEffect, useState, useCallback } from 'react'
import { Plus, FileText, RefreshCw, Pencil, Trash2, Check, ChevronDown } from 'lucide-react'
import toast from 'react-hot-toast'
import leadService from '../services/leadService'
import Badge from '../components/common/Badge'
import LeadFormModal from '../components/leads/LeadFormModal'
import QuoteBuilderModal from '../components/leads/QuoteBuilderModal'

const STATUS_OPTIONS = [
  { value: 'new', label: 'New', dotColor: 'bg-cyan-500' },
  { value: 'contacted', label: 'Contacted', dotColor: 'bg-amber-500' },
  { value: 'quoted', label: 'Quoted', dotColor: 'bg-purple-500' },
  { value: 'accepted', label: 'Accepted', dotColor: 'bg-emerald-500' },
  { value: 'rejected', label: 'Rejected', dotColor: 'bg-rose-500' },
]

function LeadsPage() {
  const [leads, setLeads] = useState([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [editingLead, setEditingLead] = useState(null)
  const [deletingId, setDeletingId] = useState(null)
  const [updatingStatusId, setUpdatingStatusId] = useState(null)
  const [openStatusMenuId, setOpenStatusMenuId] = useState(null)

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

  const handleOpenCreateModal = () => {
    setEditingLead(null)
    setIsModalOpen(true)
  }

  const handleOpenEditModal = (lead) => {
    setEditingLead(lead)
    setIsModalOpen(true)
  }

  const handleCloseModal = () => {
    setIsModalOpen(false)
    setEditingLead(null)
  }

  const handleDeleteLead = async (lead) => {
    const leadId = lead._id || lead.id
    const name = lead.clientName || lead.customerName || 'this lead'
    if (!window.confirm(`Are you sure you want to delete "${name}"? This action cannot be undone.`)) {
      return
    }

    try {
      setDeletingId(leadId)
      await leadService.deleteLead(leadId)
      toast.success('Lead deleted successfully!')
      await fetchLeads()
    } catch (err) {
      console.error('Failed to delete lead:', err)
      toast.error(err.response?.data?.message || 'Failed to delete lead.')
    } finally {
      setDeletingId(null)
    }
  }

  const handleOpenQuoteModal = (lead) => {
    setQuoteLeadItem(lead)
  }

  const handleCloseQuoteModal = () => {
    setQuoteLeadItem(null)
  }

  // Close status dropdown menu when clicking outside
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (!e.target.closest('[data-status-dropdown]')) {
        setOpenStatusMenuId(null)
      }
    }
    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  // Interactive status change handler
  const handleStatusChange = async (lead, newStatus) => {
    const leadId = lead._id || lead.id
    if (!leadId || lead.status === newStatus) return

    const prevStatus = lead.status
    const name = lead.clientName || lead.customerName || 'Lead'
    const statusLabel =
      newStatus.charAt(0).toUpperCase() + newStatus.slice(1)

    // 1. Instant local state update for snappy UI feedback
    setLeads((prevLeads) =>
      prevLeads.map((item) =>
        (item._id || item.id) === leadId ? { ...item, status: newStatus } : item
      )
    )
    setUpdatingStatusId(leadId)
    setOpenStatusMenuId(null)

    // 2. Call existing API endpoint via leadService.updateLead(id, { status })
    try {
      const res = await leadService.updateLead(leadId, { status: newStatus })
      toast.success(`Marked "${name}" as ${statusLabel}!`)

      // Sync with response data if returned
      if (res?.data) {
        setLeads((prevLeads) =>
          prevLeads.map((item) =>
            (item._id || item.id) === leadId
              ? { ...item, ...res.data, status: res.data.status || newStatus }
              : item
          )
        )
      }
    } catch (err) {
      console.error('Failed to update lead status:', err)
      // Rollback to previous status on failure
      setLeads((prevLeads) =>
        prevLeads.map((item) =>
          (item._id || item.id) === leadId ? { ...item, status: prevStatus } : item
        )
      )
      toast.error(err.response?.data?.message || 'Failed to update lead status.')
    } finally {
      setUpdatingStatusId(null)
    }
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
            onClick={handleOpenCreateModal}
            className="btn-theme-gradient inline-flex items-center gap-2 rounded-xl px-4 py-2 text-sm font-semibold shadow-xs cursor-pointer"
          >
            <Plus size={18} />
            New Lead
          </button>
        </div>
      </div>

      {/* Error alert */}
      {error && (
        <div className="rounded-xl bg-red-50 p-4 text-sm text-red-600 border border-red-100">
          {error}
        </div>
      )}

      {/* Table */}
      <div className="overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-xs">
        {loading && leads.length === 0 ? (
          <div className="p-8 space-y-3">
            {[1, 2, 3].map((n) => (
              <div key={n} className="h-12 w-full animate-pulse bg-gray-100 rounded-lg" />
            ))}
          </div>
        ) : leads.length === 0 ? (
          <div className="p-12 text-center">
            <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-xl bg-theme-subtle text-theme mb-3 border border-theme">
              <FileText size={24} />
            </div>
            <h3 className="text-base font-semibold text-gray-900">No Leads in Pipeline</h3>
            <p className="text-xs text-gray-500 max-w-sm mx-auto mt-1 mb-4">
              You haven't captured any client inquiries yet. Create your first lead to generate automated proposals!
            </p>
            <button
              onClick={handleOpenCreateModal}
              className="btn-theme-gradient inline-flex items-center gap-1.5 rounded-xl px-4 py-2 text-xs font-semibold shadow-xs cursor-pointer"
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
                        <div className="relative inline-block text-left" data-status-dropdown>
                          <button
                            type="button"
                            onClick={() =>
                              setOpenStatusMenuId(openStatusMenuId === leadId ? null : leadId)
                            }
                            disabled={updatingStatusId === leadId}
                            className="group inline-flex items-center gap-1.5 rounded-full transition-all focus:outline-hidden cursor-pointer disabled:opacity-60"
                            title="Click to change status"
                          >
                            <Badge status={lead.status} />
                            <span className="inline-flex h-5 w-5 items-center justify-center rounded-full bg-gray-100 text-gray-500 transition-colors group-hover:bg-gray-200 group-hover:text-gray-700">
                              {updatingStatusId === leadId ? (
                                <RefreshCw size={11} className="animate-spin text-gray-600" />
                              ) : (
                                <ChevronDown
                                  size={11}
                                  className={`transition-transform duration-150 ${
                                    openStatusMenuId === leadId ? 'rotate-180 text-gray-700' : ''
                                  }`}
                                />
                              )}
                            </span>
                          </button>

                          {/* Dropdown Menu for Status */}
                          {openStatusMenuId === leadId && (
                            <div className="absolute left-0 z-30 mt-1.5 w-44 origin-top-left rounded-xl border border-gray-200 bg-white p-1.5 shadow-lg ring-1 ring-black/5">
                              <div className="px-2.5 py-1 text-[10px] font-bold uppercase tracking-wider text-gray-400">
                                Change Status
                              </div>
                              <div className="space-y-0.5">
                                {STATUS_OPTIONS.map((opt) => {
                                  const isCurrent =
                                    String(lead.status).toLowerCase() === opt.value
                                  return (
                                    <button
                                      key={opt.value}
                                      type="button"
                                      onClick={() => handleStatusChange(lead, opt.value)}
                                      disabled={isCurrent || updatingStatusId === leadId}
                                      className={`flex w-full items-center justify-between gap-2 rounded-lg px-2.5 py-1.5 text-xs font-medium transition-colors cursor-pointer ${
                                        isCurrent
                                          ? 'bg-gray-100 text-gray-900 font-semibold cursor-default'
                                          : 'text-gray-700 hover:bg-gray-50'
                                      }`}
                                    >
                                      <div className="flex items-center gap-2">
                                        <span
                                          className={`inline-block h-2 w-2 rounded-full ${opt.dotColor}`}
                                        />
                                        <span>{opt.label}</span>
                                      </div>
                                      {isCurrent && <Check size={12} className="text-gray-600" />}
                                    </button>
                                  )
                                })}
                              </div>
                            </div>
                          )}
                        </div>

                        {lead.quote?.finalTotal ? (
                          <div className="mt-1 text-xs font-bold text-gray-900">
                            ₹{Number(lead.quote.finalTotal).toLocaleString('en-IN')}
                          </div>
                        ) : null}
                      </td>

                      <td className="px-6 py-4 text-right">
                        <div className="inline-flex items-center justify-end gap-2">
                          <button
                            onClick={() => handleOpenQuoteModal(lead)}
                            className="inline-flex items-center gap-1.5 rounded-lg border border-purple-200 bg-purple-50 px-2.5 py-1.5 text-xs font-semibold text-purple-700 transition-colors hover:bg-purple-100 cursor-pointer"
                            title={lead.quote?.finalTotal ? 'Edit Quote' : 'Generate Quote'}
                          >
                            <FileText size={13} />
                            {lead.quote?.finalTotal ? 'Edit Quote' : 'Generate Quote'}
                          </button>
                          <button
                            onClick={() => handleOpenEditModal(lead)}
                            className="inline-flex items-center gap-1 rounded-lg border border-gray-300 bg-white px-2.5 py-1.5 text-xs font-medium text-gray-700 transition-colors hover:bg-gray-50 cursor-pointer"
                            title="Edit Lead"
                          >
                            <Pencil size={13} />
                            Edit
                          </button>
                          <button
                            onClick={() => handleDeleteLead(lead)}
                            disabled={deletingId === leadId}
                            className="inline-flex items-center gap-1 rounded-lg border border-red-200 bg-white px-2.5 py-1.5 text-xs font-medium text-red-600 transition-colors hover:bg-red-50 disabled:opacity-50 cursor-pointer"
                            title="Delete Lead"
                          >
                            <Trash2 size={13} />
                            {deletingId === leadId ? 'Deleting...' : 'Delete'}
                          </button>
                        </div>
                      </td>
                    </tr>
                  )
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Lead Form Modal (Create / Edit) */}
      <LeadFormModal
        isOpen={isModalOpen}
        onClose={handleCloseModal}
        onSuccess={fetchLeads}
        leadToEdit={editingLead}
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

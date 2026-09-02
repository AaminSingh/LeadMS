import { useEffect, useState, useMemo } from 'react'
import { X, Plus, Trash2, Calculator, CheckCircle } from 'lucide-react'
import toast from 'react-hot-toast'
import productService from '../../services/productService'
import vendorService from '../../services/vendorService'
import leadService from '../../services/leadService'
import { calculateQuote } from '../../utils/calculator'

function QuoteBuilderModal({ lead, isOpen, onClose, onSuccess }) {
  const [lockedProducts, setLockedProducts] = useState([])
  const [vendorProfile, setVendorProfile] = useState({})
  const [loading, setLoading] = useState(false)
  const [submitting, setSubmitting] = useState(false)
  const [apiError, setApiError] = useState(null)

  // Selected product items: array of { productId, quantity }
  const [items, setItems] = useState([{ productId: '', quantity: 1 }])

  useEffect(() => {
    if (isOpen) {
      setLoading(true)
      setApiError(null)
      setItems([{ productId: '', quantity: 1 }])

      Promise.all([
        productService.getLockedProducts(),
        vendorService.getProfile(),
      ])
        .then(([productsRes, profileRes]) => {
          setLockedProducts(productsRes.data?.products ?? productsRes.data ?? [])
          setVendorProfile(profileRes.data || {})
        })
        .catch((err) => {
          console.error('Failed to load quote builder data:', err)
          setApiError('Failed to load catalog or vendor profile data.')
        })
        .finally(() => setLoading(false))
    }
  }, [isOpen])

  // Map items to calculateQuote input [{ basePrice, quantity }]
  const quoteItems = useMemo(() => {
    return items.map((item) => {
      const prod = lockedProducts.find(
        (p) => (p._id || p.id) === item.productId
      )
      return {
        basePrice: prod ? Number(prod.basePrice || 0) : 0,
        quantity: Number(item.quantity || 1),
      }
    })
  }, [items, lockedProducts])

  // Live quotation calculations
  const totals = useMemo(() => {
    return calculateQuote(quoteItems, vendorProfile)
  }, [quoteItems, vendorProfile])

  if (!isOpen || !lead) return null

  const addItemRow = () => {
    setItems((prev) => [...prev, { productId: '', quantity: 1 }])
  }

  const removeItemRow = (index) => {
    if (items.length <= 1) return
    setItems((prev) => prev.filter((_, i) => i !== index))
  }

  const updateItem = (index, field, value) => {
    setItems((prev) =>
      prev.map((item, i) => (i === index ? { ...item, [field]: value } : item))
    )
  }

  const handleSubmitQuote = async (e) => {
    e.preventDefault()

    // Validate that at least one valid product is selected
    const validItems = items.filter((item) => item.productId)
    if (validItems.length === 0) {
      setApiError('Please select at least one product for the quotation.')
      return
    }

    const leadId = lead._id || lead.id

    try {
      setSubmitting(true)
      setApiError(null)

      const quotePayload = {
        products: validItems.map((item) => ({
          productId: item.productId,
          quantity: Number(item.quantity || 1),
        })),
      }

      await leadService.quoteLead(leadId, quotePayload)
      toast.success('Quotation generated successfully!')

      if (onSuccess) {
        onSuccess()
      }
      onClose()
    } catch (err) {
      console.error('Quote submission error:', err)
      setApiError(
        err.response?.data?.message ||
        'Failed to generate quote. Please verify product availability and profile settings.'
      )
    } finally {
      setSubmitting(false)
    }
  }

  const clientDisplayName =
    lead.clientName || lead.customerName || 'Client'

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
      <div className="w-full max-w-2xl max-h-[90vh] overflow-y-auto rounded-2xl bg-white p-6 shadow-xl">
        {/* Header */}
        <div className="mb-4 flex items-center justify-between border-b border-gray-100 pb-4">
          <div>
            <h2 className="text-xl font-bold text-gray-900 flex items-center gap-2">
              <Calculator className="text-purple-600" size={22} />
              Generate Quote for {clientDisplayName}
            </h2>
            <p className="text-xs text-gray-500 mt-0.5">
              Requirement: {lead.requirement || 'Standard Inquiry'}
            </p>
          </div>
          <button
            onClick={onClose}
            className="rounded-lg p-1 text-gray-400 hover:bg-gray-100 hover:text-gray-600 transition-colors cursor-pointer"
          >
            <X size={20} />
          </button>
        </div>

        {apiError && (
          <div className="mb-4 rounded-lg bg-red-50 p-3 text-sm text-red-600">
            {apiError}
          </div>
        )}

        {loading ? (
          <p className="py-8 text-center text-sm text-gray-500">
            Loading catalog & pricing profile...
          </p>
        ) : (
          <form onSubmit={handleSubmitQuote} className="space-y-6">
            {/* Product selection rows */}
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <label className="text-sm font-semibold text-gray-900">
                  Select Products
                </label>
                <button
                  type="button"
                  onClick={addItemRow}
                  className="inline-flex items-center gap-1 text-xs font-semibold text-blue-600 hover:text-blue-700 cursor-pointer"
                >
                  <Plus size={14} /> Add Product
                </button>
              </div>

              {items.map((item, index) => (
                <div key={index} className="flex items-center gap-3">
                  <select
                    value={item.productId}
                    onChange={(e) =>
                      updateItem(index, 'productId', e.target.value)
                    }
                    className="flex-1 rounded-lg border border-gray-300 px-3 py-2 text-sm text-gray-900 outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20"
                    required
                  >
                    <option value="">Select locked product...</option>
                    {lockedProducts.map((p) => {
                      const pid = p._id || p.id
                      return (
                        <option key={pid} value={pid}>
                          {p.name} — ${p.basePrice} ({p.category})
                        </option>
                      )
                    })}
                  </select>

                  <div className="w-24">
                    <input
                      type="number"
                      min="1"
                      value={item.quantity}
                      onChange={(e) =>
                        updateItem(index, 'quantity', e.target.value)
                      }
                      className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm text-gray-900 outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20"
                      placeholder="Qty"
                      required
                    />
                  </div>

                  {items.length > 1 && (
                    <button
                      type="button"
                      onClick={() => removeItemRow(index)}
                      className="rounded-lg p-2 text-red-400 hover:bg-red-50 hover:text-red-600 transition-colors cursor-pointer"
                    >
                      <Trash2 size={16} />
                    </button>
                  )}
                </div>
              ))}
            </div>

            {/* Live Calculation Summary Card */}
            <div className="rounded-xl bg-gray-50 p-4 border border-gray-200 space-y-2 text-sm">
              <h4 className="font-semibold text-gray-900 mb-2">
                Quotation Pricing Breakdown
              </h4>

              <div className="flex justify-between text-gray-600">
                <span>Base Products Total:</span>
                <span className="font-medium text-gray-900">
                  ${totals.baseTotal.toFixed(2)}
                </span>
              </div>

              <div className="flex justify-between text-gray-600">
                <span>
                  Margin ({vendorProfile.marginPercentage || 0}%):
                </span>
                <span className="font-medium text-gray-900">
                  +${totals.marginAmount.toFixed(2)}
                </span>
              </div>

              <div className="flex justify-between text-gray-600">
                <span>Installation Price:</span>
                <span className="font-medium text-gray-900">
                  +${totals.installationPrice.toFixed(2)}
                </span>
              </div>

              <div className="flex justify-between text-gray-600">
                <span>Misc Charges:</span>
                <span className="font-medium text-gray-900">
                  +${totals.miscCharges.toFixed(2)}
                </span>
              </div>

              <div className="border-t border-gray-200 pt-2 flex justify-between font-bold text-base text-gray-900">
                <span>Final Quotation Total:</span>
                <span className="text-purple-600">
                  ${totals.finalTotal.toFixed(2)}
                </span>
              </div>
            </div>

            {/* Actions */}
            <div className="flex justify-end gap-3 pt-2">
              <button
                type="button"
                onClick={onClose}
                className="rounded-lg border border-gray-300 px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50 cursor-pointer"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={submitting}
                className="inline-flex items-center gap-2 rounded-lg bg-purple-600 px-5 py-2 text-sm font-semibold text-white transition-colors hover:bg-purple-700 disabled:opacity-50 cursor-pointer"
              >
                <CheckCircle size={16} />
                {submitting ? 'Generating Quote...' : 'Confirm & Generate Quote'}
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  )
}

export default QuoteBuilderModal

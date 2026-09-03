import { useState, useEffect } from 'react'
import { useForm } from 'react-hook-form'
import { X } from 'lucide-react'
import toast from 'react-hot-toast'
import leadService from '../../services/leadService'

const COUNTRY_CODES = [
  { code: '+91', country: 'India', flag: '🇮🇳', digits: 10, placeholder: '9876543210' },
  { code: '+1', country: 'USA/Canada', flag: '🇺🇸', digits: 10, placeholder: '2025550199' },
  { code: '+44', country: 'United Kingdom', flag: '🇬🇧', digits: 10, placeholder: '7911123456' },
  { code: '+971', country: 'UAE', flag: '🇦🇪', digits: 9, placeholder: '501234567' },
  { code: '+65', country: 'Singapore', flag: '🇸🇬', digits: 8, placeholder: '81234567' },
  { code: '+61', country: 'Australia', flag: '🇦🇺', digits: 9, placeholder: '412345678' },
  { code: '+49', country: 'Germany', flag: '🇩🇪', digits: 10, placeholder: '1512345678' },
  { code: '+33', country: 'France', flag: '🇫🇷', digits: 9, placeholder: '612345678' },
  { code: '+81', country: 'Japan', flag: '🇯🇵', digits: 10, placeholder: '9012345678' },
  { code: '+86', country: 'China', flag: '🇨🇳', digits: 11, placeholder: '13800138000' },
  { code: '+966', country: 'Saudi Arabia', flag: '🇸🇦', digits: 9, placeholder: '501234567' },
]

/**
 * Extracts country code and local number from a stored phone string
 */
function parsePhone(rawPhone) {
  if (!rawPhone) return { code: '+91', number: '' }
  const clean = String(rawPhone).trim()

  const matched = COUNTRY_CODES.find((c) => clean.startsWith(c.code))
  if (matched) {
    return {
      code: matched.code,
      number: clean.slice(matched.code.length).replace(/\D/g, ''),
    }
  }

  // If starts with +, match prefix or fallback
  if (clean.startsWith('+')) {
    const digitsOnly = clean.replace(/\D/g, '')
    return { code: '+91', number: digitsOnly }
  }

  return { code: '+91', number: clean.replace(/\D/g, '') }
}

function LeadFormModal({ isOpen, onClose, onSuccess, leadToEdit = null }) {
  const [submitting, setSubmitting] = useState(false)
  const [apiError, setApiError] = useState(null)
  const [selectedCountryCode, setSelectedCountryCode] = useState('+91')

  const {
    register,
    handleSubmit,
    reset,
    trigger,
    formState: { errors },
  } = useForm()

  const activeCountry =
    COUNTRY_CODES.find((c) => c.code === selectedCountryCode) || COUNTRY_CODES[0]

  useEffect(() => {
    if (isOpen) {
      if (leadToEdit) {
        const rawPhone = leadToEdit.phone || leadToEdit.customerPhone || ''
        const { code, number } = parsePhone(rawPhone)
        setSelectedCountryCode(code)

        reset({
          clientName: leadToEdit.clientName || leadToEdit.customerName || '',
          email: leadToEdit.email || leadToEdit.customerEmail || '',
          phoneNumber: number,
          requirement: leadToEdit.requirement || '',
        })
      } else {
        setSelectedCountryCode('+91')
        reset({
          clientName: '',
          email: '',
          phoneNumber: '',
          requirement: '',
        })
      }
    }
  }, [isOpen, leadToEdit, reset])

  if (!isOpen) return null

  const handleClose = () => {
    reset()
    setApiError(null)
    onClose()
  }

  const onSubmit = async (data) => {
    try {
      setSubmitting(true)
      setApiError(null)

      const cleanDigits = data.phoneNumber.trim().replace(/\D/g, '')
      const fullPhone = `${selectedCountryCode}${cleanDigits}`

      const payload = {
        clientName: data.clientName.trim(),
        customerName: data.clientName.trim(),
        email: data.email.trim(),
        customerEmail: data.email.trim(),
        phone: fullPhone,
        customerPhone: fullPhone,
        requirement: data.requirement.trim(),
      }

      if (leadToEdit) {
        const leadId = leadToEdit._id || leadToEdit.id
        await leadService.updateLead(leadId, payload)
        toast.success('Lead updated successfully!')
      } else {
        await leadService.createLead(payload)
        toast.success('Lead created successfully!')
      }

      reset()
      if (onSuccess) {
        onSuccess()
      }
      onClose()
    } catch (error) {
      setApiError(
        error.response?.data?.message ||
          (leadToEdit
            ? 'Failed to update lead. Please try again.'
            : 'Failed to create lead. Please try again.')
      )
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
      <div className="w-full max-w-lg rounded-2xl bg-white p-6 shadow-xl">
        <div className="mb-4 flex items-center justify-between">
          <h2 className="text-xl font-bold text-gray-900">
            {leadToEdit ? 'Edit Lead' : 'Create New Lead'}
          </h2>
          <button
            onClick={handleClose}
            className="rounded-lg p-1 text-gray-400 transition-colors hover:bg-gray-100 hover:text-gray-600 cursor-pointer"
          >
            <X size={20} />
          </button>
        </div>

        {apiError && (
          <div className="mb-4 rounded-lg bg-red-50 px-4 py-3 text-sm text-red-600">
            {apiError}
          </div>
        )}

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div>
            <label className="mb-1.5 block text-sm font-medium text-gray-700">
              Client Name <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              placeholder="e.g. Acme Solar Solutions / Rajiv Sharma"
              className={`w-full rounded-lg border px-4 py-2.5 text-sm text-gray-900 outline-none transition-colors placeholder:text-gray-400 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 ${
                errors.clientName ? 'border-red-400 bg-red-50/10' : 'border-gray-300'
              }`}
              {...register('clientName', { required: 'Client name is required' })}
            />
            {errors.clientName && (
              <p className="mt-1 text-xs text-red-500">
                {errors.clientName.message}
              </p>
            )}
          </div>

          <div>
            <label className="mb-1.5 block text-sm font-medium text-gray-700">
              Email Address <span className="text-red-500">*</span>
            </label>
            <input
              type="email"
              placeholder="client@example.com"
              className={`w-full rounded-lg border px-4 py-2.5 text-sm text-gray-900 outline-none transition-colors placeholder:text-gray-400 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 ${
                errors.email ? 'border-red-400 bg-red-50/10' : 'border-gray-300'
              }`}
              {...register('email', {
                required: 'Email is required',
                pattern: {
                  value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
                  message: 'Enter a valid email address',
                },
              })}
            />
            {errors.email && (
              <p className="mt-1 text-xs text-red-500">
                {errors.email.message}
              </p>
            )}
          </div>

          {/* Enhanced Phone Number with Country Code Dropdown */}
          <div>
            <label className="mb-1.5 block text-sm font-medium text-gray-700">
              Phone Number <span className="text-red-500">*</span>
            </label>
            <div className="flex gap-2">
              <div className="w-40 flex-shrink-0">
                <select
                  value={selectedCountryCode}
                  onChange={(e) => {
                    setSelectedCountryCode(e.target.value)
                    setTimeout(() => trigger('phoneNumber'), 50)
                  }}
                  className="w-full rounded-lg border border-gray-300 bg-gray-50 px-2.5 py-2.5 text-xs sm:text-sm font-medium text-gray-900 outline-none transition-colors hover:bg-gray-100 focus:border-blue-500 focus:bg-white focus:ring-2 focus:ring-blue-500/20 cursor-pointer"
                >
                  {COUNTRY_CODES.map((item) => (
                    <option key={item.code} value={item.code}>
                      {item.flag} {item.code} ({item.country})
                    </option>
                  ))}
                </select>
              </div>

              <div className="flex-1 relative">
                <input
                  type="tel"
                  maxLength={selectedCountryCode === '+91' ? 10 : activeCountry.digits + 2}
                  placeholder={`e.g. ${activeCountry.placeholder}`}
                  className={`w-full rounded-lg border px-4 py-2.5 text-sm text-gray-900 outline-none transition-colors placeholder:text-gray-400 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 ${
                    errors.phoneNumber ? 'border-red-400 bg-red-50/10' : 'border-gray-300'
                  }`}
                  {...register('phoneNumber', {
                    required: 'Phone number is required',
                    validate: (val) => {
                      if (!val) return 'Phone number is required'
                      const clean = val.replace(/\D/g, '')

                      if (selectedCountryCode === '+91') {
                        if (clean.length !== 10) {
                          return 'Indian (+91) mobile number must be exactly 10 digits'
                        }
                        if (!/^[6-9]/.test(clean)) {
                          return 'Indian mobile numbers must start with 6, 7, 8, or 9'
                        }
                      } else {
                        if (clean.length !== activeCountry.digits) {
                          return `${activeCountry.country} number must be exactly ${activeCountry.digits} digits`
                        }
                      }
                      return true
                    },
                  })}
                />
              </div>
            </div>

            {errors.phoneNumber ? (
              <p className="mt-1 text-xs text-red-500">
                {errors.phoneNumber.message}
              </p>
            ) : (
              <p className="mt-1 text-[11px] text-gray-500">
                {selectedCountryCode === '+91'
                  ? '🇮🇳 Enter 10-digit Indian mobile number (e.g. 9876543210)'
                  : `Enter ${activeCountry.digits}-digit phone number for ${activeCountry.country}`}
              </p>
            )}
          </div>

          <div>
            <label className="mb-1.5 block text-sm font-medium text-gray-700">
              Requirement Details <span className="text-red-500">*</span>
            </label>
            <textarea
              rows={3}
              placeholder="Describe commercial equipment specifications, desired capacity, or installation requirements..."
              className={`w-full rounded-lg border px-4 py-2.5 text-sm text-gray-900 outline-none transition-colors placeholder:text-gray-400 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 ${
                errors.requirement ? 'border-red-400 bg-red-50/10' : 'border-gray-300'
              }`}
              {...register('requirement', { required: 'Requirement details required' })}
            />
            {errors.requirement && (
              <p className="mt-1 text-xs text-red-500">
                {errors.requirement.message}
              </p>
            )}
          </div>

          <div className="flex justify-end gap-3 pt-2">
            <button
              type="button"
              onClick={handleClose}
              className="rounded-lg border border-gray-300 px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50 cursor-pointer"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={submitting}
              className="btn-theme-gradient rounded-xl px-5 py-2 text-sm font-bold shadow-xs transition-all disabled:opacity-50 cursor-pointer"
            >
              {submitting
                ? leadToEdit
                  ? 'Updating...'
                  : 'Creating...'
                : leadToEdit
                ? 'Update Lead'
                : 'Create Lead'}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}

export default LeadFormModal

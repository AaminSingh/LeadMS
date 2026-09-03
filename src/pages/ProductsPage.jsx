import { useEffect, useState, useCallback } from 'react'
import { useForm } from 'react-hook-form'
import {
  Save,
  Lock,
  Unlock,
  Plus,
  X,
  Pencil,
  Trash2,
  Boxes,
  PackageOpen,
  PackageCheck,
} from 'lucide-react'
import toast from 'react-hot-toast'
import useAuthStore from '../store/useAuthStore'
import vendorService from '../services/vendorService'
import productService from '../services/productService'

/* ───────────────────────── Vendor Pricing Profile ───────────────────────── */

function PricingProfile() {
  const [saving, setSaving] = useState(false)
  const [feedback, setFeedback] = useState(null)

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm()

  useEffect(() => {
    vendorService
      .getProfile()
      .then((res) => {
        const p = res.data
        reset({
          marginPercentage: p.marginPercentage ?? '',
          installationPrice: p.installationPrice ?? '',
          miscCharges: p.miscCharges ?? '',
        })
      })
      .catch(() => { })
  }, [reset])

  const onSubmit = async (data) => {
    try {
      setSaving(true)
      setFeedback(null)
      await vendorService.updateProfile({
        marginPercentage: Number(data.marginPercentage),
        installationPrice: Number(data.installationPrice),
        miscCharges: Number(data.miscCharges),
      })
      setFeedback({ type: 'success', message: 'Profile saved successfully!' })
      toast.success('Pricing profile saved successfully!')
    } catch (error) {
      const msg = error.response?.data?.message || 'Failed to save profile.'
      setFeedback({
        type: 'error',
        message: msg,
      })
      toast.error(msg)
    } finally {
      setSaving(false)
    }
  }

  return (
    <div className="rounded-xl border border-gray-200 bg-white p-6">
      <h2 className="mb-4 text-lg font-semibold text-gray-900">
        Quoting Pricing Profile
      </h2>

      {feedback && (
        <div
          className={`mb-4 rounded-lg px-4 py-3 text-sm ${feedback.type === 'success'
            ? 'bg-green-50 text-green-700'
            : 'bg-red-50 text-red-600'
            }`}
        >
          {feedback.message}
        </div>
      )}

      <form
        onSubmit={handleSubmit(onSubmit)}
        className="grid gap-4 sm:grid-cols-3"
      >
        <div>
          <label className="mb-1.5 block text-sm font-medium text-gray-700">
            Margin %
          </label>
          <input
            type="number"
            step="any"
            placeholder="e.g. 15"
            className={`w-full rounded-lg border px-4 py-2.5 text-sm text-gray-900 outline-none transition-colors placeholder:text-gray-400 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 ${errors.marginPercentage ? 'border-red-400' : 'border-gray-300'
              }`}
            {...register('marginPercentage', {
              required: 'Required',
              min: { value: 0, message: 'Must be ≥ 0' },
            })}
          />
          {errors.marginPercentage && (
            <p className="mt-1 text-xs text-red-500">
              {errors.marginPercentage.message}
            </p>
          )}
        </div>

        <div>
          <label className="mb-1.5 block text-sm font-medium text-gray-700">
            Fixed Installation Price (₹)
          </label>
          <input
            type="number"
            step="any"
            placeholder="e.g. 5000"
            className={`w-full rounded-lg border px-4 py-2.5 text-sm text-gray-900 outline-none transition-colors placeholder:text-gray-400 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 ${errors.installationPrice ? 'border-red-400' : 'border-gray-300'
              }`}
            {...register('installationPrice', {
              required: 'Required',
              min: { value: 0, message: 'Must be ≥ 0' },
            })}
          />
          {errors.installationPrice && (
            <p className="mt-1 text-xs text-red-500">
              {errors.installationPrice.message}
            </p>
          )}
        </div>

        <div>
          <label className="mb-1.5 block text-sm font-medium text-gray-700">
            Misc Charges (₹)
          </label>
          <input
            type="number"
            step="any"
            placeholder="e.g. 1500"
            className={`w-full rounded-lg border px-4 py-2.5 text-sm text-gray-900 outline-none transition-colors placeholder:text-gray-400 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 ${errors.miscCharges ? 'border-red-400' : 'border-gray-300'
              }`}
            {...register('miscCharges', {
              required: 'Required',
              min: { value: 0, message: 'Must be ≥ 0' },
            })}
          />
          {errors.miscCharges && (
            <p className="mt-1 text-xs text-red-500">
              {errors.miscCharges.message}
            </p>
          )}
        </div>

        <div className="sm:col-span-3">
          <button
            type="submit"
            disabled={saving}
            className="inline-flex items-center gap-2 rounded-lg bg-gradient-to-r from-cyan-600 to-teal-600 px-5 py-2.5 text-sm font-semibold text-white shadow-sm shadow-cyan-600/20 transition-all hover:from-cyan-500 hover:to-teal-500 disabled:cursor-not-allowed disabled:opacity-50 cursor-pointer"
          >
            <Save size={16} />
            {saving ? 'Saving...' : 'Save Profile'}
          </button>
        </div>
      </form>
    </div>
  )
}

/* ─────────────────────── Vendor Product Catalog ─────────────────────── */

function VendorCatalog() {
  const [activeTab, setActiveTab] = useState('available')
  const [availableProducts, setAvailableProducts] = useState([])
  const [lockedProducts, setLockedProducts] = useState([])
  const [loading, setLoading] = useState(false)
  const [actionLoading, setActionLoading] = useState(null)

  const fetchAvailableProducts = useCallback(async () => {
    try {
      const res = await productService.getAvailableProducts()
      // Directly check if res.data is an array or nested
      const data = Array.isArray(res.data) ? res.data : (res.data?.products || [])
      setAvailableProducts(data)
    } catch (error) {
      console.error('Failed to fetch available products:', error)
    }
  }, [])

  const fetchLockedProducts = useCallback(async () => {
    try {
      const res = await productService.getLockedProducts()
      // Directly check if res.data is an array or nested
      const data = Array.isArray(res.data) ? res.data : (res.data?.products || [])
      setLockedProducts(data)
    } catch (error) {
      console.error('Failed to fetch locked products:', error)
    }
  }, [])

  const fetchAllProducts = useCallback(async () => {
    setLoading(true)
    await Promise.all([fetchAvailableProducts(), fetchLockedProducts()])
    setLoading(false)
  }, [fetchAvailableProducts, fetchLockedProducts])

  useEffect(() => {
    fetchAllProducts()
  }, [fetchAllProducts])

  const handleLock = async (product) => {
    const productId = product._id || product.id
    if (!productId) return
    try {
      setActionLoading(productId)
      await productService.lockProduct(productId)
      await fetchAvailableProducts()
      await fetchLockedProducts()
      toast.success(`"${product.name}" locked to your sales catalog!`)
    } catch (error) {
      console.error('Lock error:', error.response?.data || error.message)
      toast.error(
        'Failed to lock product: ' +
        (error.response?.data?.message || 'Server error')
      )
    } finally {
      setActionLoading(null)
    }
  }

  const handleUnlock = async (product) => {
    const productId = product._id || product.id
    if (!productId) return
    try {
      setActionLoading(productId)
      await productService.unlockProduct(productId)
      await fetchAvailableProducts()
      await fetchLockedProducts()
      toast.success(`"${product.name}" unlocked from catalog`)
    } catch (error) {
      console.error('Unlock error:', error.response?.data || error.message)
      toast.error(
        'Failed to unlock product: ' +
        (error.response?.data?.message || 'Server error')
      )
    } finally {
      setActionLoading(null)
    }
  }

  const tabs = [
    { key: 'available', label: 'Available Supplier Products' },
    { key: 'locked', label: 'Locked Sales Catalog' },
  ]

  const products = activeTab === 'available' ? availableProducts : lockedProducts

  return (
    <div className="rounded-xl border border-gray-200 bg-white">
      {/* Tab bar */}
      <div className="flex border-b border-gray-200">
        {tabs.map((tab) => (
          <button
            key={tab.key}
            onClick={() => setActiveTab(tab.key)}
            className={`px-6 py-3 text-sm font-medium transition-colors cursor-pointer ${activeTab === tab.key
              ? 'border-b-2 border-cyan-600 text-cyan-700 font-bold'
              : 'text-gray-500 hover:text-gray-700'
              }`}
          >
            {tab.label}
            <span className="ml-2 rounded-full bg-gray-100 px-2 py-0.5 text-xs text-gray-600">
              {tab.key === 'available' ? availableProducts.length : lockedProducts.length}
            </span>
          </button>
        ))}
      </div>

      {/* Product list */}
      <div className="p-6">
        {loading ? (
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {[1, 2, 3].map((n) => (
              <div
                key={n}
                className="rounded-xl border border-gray-200 p-5 animate-pulse bg-gray-50/60 space-y-3"
              >
                <div className="h-5 bg-gray-200 rounded w-2/3" />
                <div className="h-3.5 bg-gray-200 rounded w-1/3" />
                <div className="h-10 bg-gray-200 rounded w-full" />
                <div className="h-8 bg-gray-200 rounded w-full mt-2" />
              </div>
            ))}
          </div>
        ) : products.length === 0 ? (
          <div className="rounded-xl border border-dashed border-gray-300 p-12 text-center bg-gray-50/50">
            {activeTab === 'available' ? (
              <>
                <PackageOpen className="mx-auto h-12 w-12 text-gray-300 mb-3" />
                <h4 className="text-base font-semibold text-gray-900">
                  No Supplier Products Available
                </h4>
                <p className="text-xs text-gray-500 max-w-sm mx-auto mt-1">
                  All active supplier products have been locked, or none have been published by traders yet.
                </p>
              </>
            ) : (
              <>
                <PackageCheck className="mx-auto h-12 w-12 text-cyan-600 mb-3" />
                <h4 className="text-base font-semibold text-gray-900">
                  Your Sales Catalog is Empty
                </h4>
                <p className="text-xs text-gray-500 max-w-sm mx-auto mt-1">
                  Switch to the "Available Supplier Products" tab and click "Lock to My Catalog" to start quoting!
                </p>
              </>
            )}
          </div>
        ) : (
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {products.map((product) => {
              const productId = product._id || product.id
              return (
                <div
                  key={productId}
                  className="rounded-lg border border-gray-200 p-4 transition-shadow hover:shadow-md"
                >
                  <h3 className="font-semibold text-gray-900">
                    {product.name}
                  </h3>
                  <p className="mt-1 text-xs text-gray-500">
                    {product.category}
                  </p>
                  <p className="mt-2 text-sm text-gray-600 line-clamp-2">
                    {product.description}
                  </p>
                  <p className="mt-3 text-lg font-bold text-gray-900">
                    ₹{Number(product.basePrice).toLocaleString('en-IN')}
                  </p>

                  {activeTab === 'available' ? (
                    <button
                      onClick={() => handleLock(product)}
                      disabled={actionLoading === productId}
                      className="mt-3 inline-flex w-full items-center justify-center gap-2 rounded-lg bg-gradient-to-r from-cyan-600 to-teal-600 px-4 py-2 text-sm font-medium text-white shadow-sm shadow-cyan-600/20 transition-all hover:from-cyan-500 hover:to-teal-500 disabled:opacity-50 cursor-pointer"
                    >
                      <Lock size={14} />
                      {actionLoading === productId
                        ? 'Locking...'
                        : 'Lock to My Catalog'}
                    </button>
                  ) : (
                    <button
                      onClick={() => handleUnlock(product)}
                      disabled={actionLoading === productId}
                      className="mt-3 inline-flex w-full items-center justify-center gap-2 rounded-lg border border-red-300 px-4 py-2 text-sm font-medium text-red-600 transition-colors hover:bg-red-50 disabled:opacity-50 cursor-pointer"
                    >
                      <Unlock size={14} />
                      {actionLoading === productId
                        ? 'Unlocking...'
                        : 'Unlock'}
                    </button>
                  )}
                </div>
              )
            })}
          </div>
        )}
      </div>
    </div>
  )
}

/* ─────────────────────── Trader Catalog ─────────────────────── */

function TraderCatalog() {
  const [products, setProducts] = useState([])
  const [loading, setLoading] = useState(false)
  const [showModal, setShowModal] = useState(false)
  const [submitting, setSubmitting] = useState(false)
  const [error, setError] = useState(null)
  const [editingProduct, setEditingProduct] = useState(null)
  const [deleteLoading, setDeleteLoading] = useState(null)

  const {
    register,
    handleSubmit,
    reset,
    setValue,
    formState: { errors },
  } = useForm()

  const fetchProducts = useCallback(async () => {
    try {
      setLoading(true)
      const res = await productService.getTraderProducts()
      setProducts(res.data?.products ?? res.data ?? [])
    } catch (err) {
      console.error('Failed to fetch trader products:', err)
      setProducts([])
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    fetchProducts()
  }, [fetchProducts])

  const openCreateModal = () => {
    setEditingProduct(null)
    reset({ name: '', basePrice: '', category: '', description: '' })
    setError(null)
    setShowModal(true)
  }

  const openEditModal = (product) => {
    setEditingProduct(product)
    setValue('name', product.name)
    setValue('basePrice', product.basePrice)
    setValue('category', product.category)
    setValue('description', product.description)
    setError(null)
    setShowModal(true)
  }

  const closeModal = () => {
    setShowModal(false)
    setEditingProduct(null)
    setError(null)
    reset({ name: '', basePrice: '', category: '', description: '' })
  }

  const onSubmitProduct = async (data) => {
    try {
      setSubmitting(true)
      setError(null)
      const payload = { ...data, basePrice: Number(data.basePrice) }

      if (editingProduct) {
        await productService.updateTraderProduct(
          editingProduct._id || editingProduct.id,
          payload
        )
      } else {
        await productService.createTraderProduct(payload)
      }

      closeModal()
      await fetchProducts()
      toast.success(
        editingProduct
          ? 'Product updated successfully!'
          : 'Product created successfully!'
      )
    } catch (err) {
      setError(
        err.response?.data?.message ||
        `Failed to ${editingProduct ? 'update' : 'create'} product.`
      )
    } finally {
      setSubmitting(false)
    }
  }

  const handleDelete = async (product) => {
    const id = product._id || product.id
    if (!window.confirm(`Delete "${product.name}"? This action cannot be undone.`)) {
      return
    }
    try {
      setDeleteLoading(id)
      await productService.deleteTraderProduct(id)
      await fetchProducts()
      toast.success(`"${product.name}" deleted`)
    } catch (err) {
      console.error('Delete failed:', err)
      toast.error('Failed to delete product')
    } finally {
      setDeleteLoading(null)
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-lg font-semibold text-gray-900">My Products</h2>
        <button
          onClick={openCreateModal}
          className="inline-flex items-center gap-2 rounded-lg bg-gradient-to-r from-cyan-600 to-teal-600 px-4 py-2.5 text-sm font-semibold text-white shadow-sm shadow-cyan-600/20 transition-all hover:from-cyan-500 hover:to-teal-500 cursor-pointer"
        >
          <Plus size={16} />
          Create Product
        </button>
      </div>

      {/* Product table */}
      <div className="overflow-hidden rounded-xl border border-gray-200 bg-white">
        {loading ? (
          <div className="p-8 text-center text-sm text-gray-500 animate-pulse">
            Loading trader inventory...
          </div>
        ) : products.length === 0 ? (
          <div className="p-12 text-center">
            <Boxes className="mx-auto h-12 w-12 text-gray-300 mb-3" />
            <h3 className="text-base font-semibold text-gray-900">No Products Listed</h3>
            <p className="text-xs text-gray-500 max-w-sm mx-auto mt-1 mb-4">
              You haven't listed any wholesale products yet. Add your first item to make it available to vendors!
            </p>
            <button
              onClick={openCreateModal}
              className="inline-flex items-center gap-1.5 rounded-lg bg-gradient-to-r from-cyan-600 to-teal-600 px-4 py-2 text-xs font-semibold text-white shadow-sm shadow-cyan-600/20 transition-all hover:from-cyan-500 hover:to-teal-500 cursor-pointer"
            >
              <Plus size={14} /> Create First Product
            </button>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm">
              <thead className="border-b border-gray-200 bg-gray-50">
                <tr>
                  <th className="px-6 py-3 font-medium text-gray-600">Name</th>
                  <th className="px-6 py-3 font-medium text-gray-600">
                    Category
                  </th>
                  <th className="px-6 py-3 font-medium text-gray-600">
                    Base Price
                  </th>
                  <th className="px-6 py-3 font-medium text-gray-600">
                    Description
                  </th>
                  <th className="px-6 py-3 font-medium text-gray-600 text-right">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {products.map((product) => {
                  const id = product._id || product.id
                  return (
                    <tr
                      key={id}
                      className="transition-colors hover:bg-gray-50"
                    >
                      <td className="px-6 py-4 font-medium text-gray-900">
                        {product.name}
                      </td>
                      <td className="px-6 py-4 text-gray-600">
                        {product.category}
                      </td>
                      <td className="px-6 py-4 font-semibold text-gray-900">
                        ₹{Number(product.basePrice).toLocaleString('en-IN')}
                      </td>
                      <td className="px-6 py-4 text-gray-500 max-w-xs truncate">
                        {product.description}
                      </td>
                      <td className="px-6 py-4 text-right">
                        <div className="inline-flex items-center gap-2">
                          <button
                            onClick={() => openEditModal(product)}
                            className="inline-flex items-center gap-1 rounded-lg border border-gray-300 px-2.5 py-1.5 text-xs font-medium text-gray-700 transition-colors hover:bg-gray-50 cursor-pointer"
                          >
                            <Pencil size={13} />
                            Edit
                          </button>
                          <button
                            onClick={() => handleDelete(product)}
                            disabled={deleteLoading === id}
                            className="inline-flex items-center gap-1 rounded-lg border border-red-200 px-2.5 py-1.5 text-xs font-medium text-red-600 transition-colors hover:bg-red-50 disabled:opacity-50 cursor-pointer"
                          >
                            <Trash2 size={13} />
                            {deleteLoading === id ? 'Deleting...' : 'Delete'}
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

      {/* Create / Edit Product Modal */}
      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
          <div className="w-full max-w-md rounded-2xl bg-white p-6 shadow-xl">
            <div className="mb-4 flex items-center justify-between">
              <h3 className="text-lg font-semibold text-gray-900">
                {editingProduct ? 'Edit Product' : 'Create New Product'}
              </h3>
              <button
                onClick={closeModal}
                className="rounded-lg p-1 text-gray-400 transition-colors hover:bg-gray-100 hover:text-gray-600 cursor-pointer"
              >
                <X size={20} />
              </button>
            </div>

            {error && (
              <div className="mb-4 rounded-lg bg-red-50 px-4 py-3 text-sm text-red-600">
                {error}
              </div>
            )}

            <form
              onSubmit={handleSubmit(onSubmitProduct)}
              className="space-y-4"
            >
              <div>
                <label className="mb-1.5 block text-sm font-medium text-gray-700">
                  Product Name
                </label>
                <input
                  type="text"
                  placeholder="e.g. Solar Panel 400W"
                  className={`w-full rounded-lg border px-4 py-2.5 text-sm text-gray-900 outline-none transition-colors placeholder:text-gray-400 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 ${errors.name ? 'border-red-400' : 'border-gray-300'
                    }`}
                  {...register('name', { required: 'Name is required' })}
                />
                {errors.name && (
                  <p className="mt-1 text-xs text-red-500">
                    {errors.name.message}
                  </p>
                )}
              </div>

              <div>
                <label className="mb-1.5 block text-sm font-medium text-gray-700">
                  Base Price (₹)
                </label>
                <input
                  type="number"
                  step="any"
                  placeholder="e.g. 25000"
                  className={`w-full rounded-lg border px-4 py-2.5 text-sm text-gray-900 outline-none transition-colors placeholder:text-gray-400 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 ${errors.basePrice ? 'border-red-400' : 'border-gray-300'
                    }`}
                  {...register('basePrice', {
                    required: 'Price is required',
                    min: { value: 0, message: 'Must be ≥ 0' },
                  })}
                />
                {errors.basePrice && (
                  <p className="mt-1 text-xs text-red-500">
                    {errors.basePrice.message}
                  </p>
                )}
              </div>

              <div>
                <label className="mb-1.5 block text-sm font-medium text-gray-700">
                  Category
                </label>
                <input
                  type="text"
                  placeholder="e.g. Solar Panels"
                  className={`w-full rounded-lg border px-4 py-2.5 text-sm text-gray-900 outline-none transition-colors placeholder:text-gray-400 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 ${errors.category ? 'border-red-400' : 'border-gray-300'
                    }`}
                  {...register('category', {
                    required: 'Category is required',
                  })}
                />
                {errors.category && (
                  <p className="mt-1 text-xs text-red-500">
                    {errors.category.message}
                  </p>
                )}
              </div>

              <div>
                <label className="mb-1.5 block text-sm font-medium text-gray-700">
                  Description
                </label>
                <textarea
                  rows={3}
                  placeholder="Brief product description..."
                  className={`w-full rounded-lg border px-4 py-2.5 text-sm text-gray-900 outline-none transition-colors placeholder:text-gray-400 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 ${errors.description ? 'border-red-400' : 'border-gray-300'
                    }`}
                  {...register('description', {
                    required: 'Description is required',
                  })}
                />
                {errors.description && (
                  <p className="mt-1 text-xs text-red-500">
                    {errors.description.message}
                  </p>
                )}
              </div>

              <button
                type="submit"
                disabled={submitting}
                className="w-full rounded-lg bg-gradient-to-r from-cyan-600 to-teal-600 px-4 py-2.5 text-sm font-semibold text-white shadow-sm shadow-cyan-600/20 transition-all hover:from-cyan-500 hover:to-teal-500 disabled:cursor-not-allowed disabled:opacity-50 cursor-pointer"
              >
                {submitting
                  ? editingProduct
                    ? 'Updating...'
                    : 'Creating...'
                  : editingProduct
                    ? 'Update Product'
                    : 'Create Product'}
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  )
}

/* ─────────────────────── Main Products Page ─────────────────────── */

function ProductsPage() {
  const user = useAuthStore((state) => state.user)

  if (user?.role === 'trader') {
    return (
      <div className="space-y-6">
        <h1 className="text-2xl font-bold text-gray-900">Trader Catalog</h1>
        <TraderCatalog />
      </div>
    )
  }

  // Default: vendor view
  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold text-gray-900">Products & Pricing</h1>
      <PricingProfile />
      <VendorCatalog />
    </div>
  )
}

export default ProductsPage

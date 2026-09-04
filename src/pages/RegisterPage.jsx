import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { Link } from 'react-router-dom'
import authService from '../services/authService'

const roles = [
  { value: 'trader', label: 'Trader' },
  { value: 'vendor', label: 'Vendor' },
]

function RegisterPage() {
  const [apiError, setApiError] = useState(null)
  const [successMessage, setSuccessMessage] = useState(null)

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm()

  const onSubmit = async (data) => {
    try {
      setApiError(null)
      setSuccessMessage(null)

      const nameParts = (data.name || '').trim().split(/\s+/)
      const payload = {
        ...data,
        role: (data.role || '').toLowerCase().trim(),
        firstName: nameParts[0] || '',
        lastName: nameParts.slice(1).join(' ') || '',
      }

      const res = await authService.register(payload)

      const successNotice =
        res.data?.message ||
        'Registration successful! Please check your email inbox to verify your account before logging in.'
      setSuccessMessage(successNotice)
    } catch (error) {
      console.error('Registration failed:', error)
      const message =
        error.response?.data?.message ||
        error.response?.data?.error ||
        error.message ||
        'Registration failed. Please check your network and try again.'
      setApiError(message)
    }
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-gray-50 px-4">
      <div className="w-full max-w-md space-y-8 rounded-2xl bg-white p-8 shadow-lg">
        <div className="text-center">
          <img
            src="/leadms_logo.jpg"
            alt="LeadMS"
            className="mx-auto h-14 w-14 rounded-2xl object-cover shadow-md border border-gray-200 mb-3"
          />
          <h1 className="text-3xl font-extrabold text-gray-900">
            Lead<span className="text-cyan-600">MS</span>
          </h1>
          <p className="mt-2 text-sm text-gray-500">Create your account</p>
        </div>

        {apiError && (
          <div className="rounded-lg bg-red-50 px-4 py-3 text-sm text-red-600">
            {apiError}
          </div>
        )}

        {successMessage && (
          <div className="rounded-lg bg-green-50 px-4 py-3 text-sm text-green-700">
            {successMessage}{' '}
            <Link
              to="/login"
              className="font-medium text-green-800 underline hover:text-green-900"
            >
              Go to Login
            </Link>
          </div>
        )}

        {!successMessage && (
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
            <div>
              <label
                htmlFor="name"
                className="mb-1.5 block text-sm font-medium text-gray-700"
              >
                Full Name
              </label>
              <input
                id="name"
                type="text"
                autoComplete="name"
                placeholder="John Doe"
                className={`w-full rounded-lg border px-4 py-2.5 text-sm text-gray-900 outline-none transition-colors placeholder:text-gray-400 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 ${
                  errors.name ? 'border-red-400' : 'border-gray-300'
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
              <label
                htmlFor="email"
                className="mb-1.5 block text-sm font-medium text-gray-700"
              >
                Email
              </label>
              <input
                id="email"
                type="email"
                autoComplete="email"
                placeholder="you@example.com"
                className={`w-full rounded-lg border px-4 py-2.5 text-sm text-gray-900 outline-none transition-colors placeholder:text-gray-400 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 ${
                  errors.email ? 'border-red-400' : 'border-gray-300'
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

            <div>
              <label
                htmlFor="password"
                className="mb-1.5 block text-sm font-medium text-gray-700"
              >
                Password
              </label>
              <input
                id="password"
                type="password"
                autoComplete="new-password"
                placeholder="••••••••"
                className={`w-full rounded-lg border px-4 py-2.5 text-sm text-gray-900 outline-none transition-colors placeholder:text-gray-400 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 ${
                  errors.password ? 'border-red-400' : 'border-gray-300'
                }`}
                {...register('password', {
                  required: 'Password is required',
                  minLength: {
                    value: 6,
                    message: 'Password must be at least 6 characters',
                  },
                })}
              />
              {errors.password && (
                <p className="mt-1 text-xs text-red-500">
                  {errors.password.message}
                </p>
              )}
            </div>

            <div>
              <label
                htmlFor="role"
                className="mb-1.5 block text-sm font-medium text-gray-700"
              >
                Role
              </label>
              <select
                id="role"
                className={`w-full rounded-lg border px-4 py-2.5 text-sm text-gray-900 outline-none transition-colors focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 ${
                  errors.role ? 'border-red-400' : 'border-gray-300'
                }`}
                {...register('role', { required: 'Please select a role' })}
              >
                <option value="">Select a role</option>
                {roles.map((r) => (
                  <option key={r.value} value={r.value}>
                    {r.label}
                  </option>
                ))}
              </select>
              {errors.role && (
                <p className="mt-1 text-xs text-red-500">
                  {errors.role.message}
                </p>
              )}
            </div>

            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full rounded-lg bg-gradient-to-r from-cyan-600 to-teal-600 px-4 py-2.5 text-sm font-semibold text-white shadow-md shadow-cyan-600/20 transition-all hover:from-cyan-500 hover:to-teal-500 disabled:cursor-not-allowed disabled:opacity-50 cursor-pointer"
            >
              {isSubmitting ? 'Creating account...' : 'Create Account'}
            </button>
          </form>
        )}

        <p className="text-center text-sm text-gray-500">
          Already have an account?{' '}
          <Link
            to="/login"
            className="font-semibold text-cyan-600 hover:text-cyan-500"
          >
            Sign in
          </Link>
        </p>
      </div>
    </div>
  )
}

export default RegisterPage

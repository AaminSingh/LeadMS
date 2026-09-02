import useAuthStore from '../store/useAuthStore'

function DashboardPage() {
  const user = useAuthStore((state) => state.user)

  return (
    <div>
      <h1 className="text-2xl font-bold text-gray-900">
        Welcome to the Dashboard
        {user?.name && (
          <span className="text-gray-500">, {user.name}</span>
        )}
      </h1>
    </div>
  )
}

export default DashboardPage

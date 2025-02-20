import { HomeIcon, ShoppingBagIcon, UsersIcon } from '@heroicons/react/24/outline'

const navigation = [
  { name: 'Dashboard', href: '#', icon: HomeIcon, id: 'dashboard' },
  { name: 'Bestellungen', href: '#', icon: ShoppingBagIcon, id: 'orders' },
  { name: 'Kunden', href: '#', icon: UsersIcon, id: 'customers' },
]

export default function AdminSidebar({ 
  activeTab, 
  setActiveTab 
}: { 
  activeTab: string
  setActiveTab: (tab: string) => void 
}) {
  return (
    <div className="hidden md:flex md:w-64 md:flex-col md:fixed md:inset-y-0">
      <div className="flex-1 flex flex-col min-h-0 bg-gray-800">
        <div className="flex-1 flex flex-col pt-5 pb-4 overflow-y-auto">
          <div className="flex items-center flex-shrink-0 px-4">
            <span className="text-white text-xl font-bold">Admin Dashboard</span>
          </div>
          <nav className="mt-5 flex-1 px-2 space-y-1">
            {navigation.map((item) => (
              <button
                key={item.name}
                onClick={() => setActiveTab(item.id)}
                className={`${
                  activeTab === item.id
                    ? 'bg-gray-900 text-white'
                    : 'text-gray-300 hover:bg-gray-700 hover:text-white'
                } group flex items-center px-2 py-2 text-sm font-medium rounded-md w-full`}
              >
                <item.icon
                  className="mr-3 flex-shrink-0 h-6 w-6"
                  aria-hidden="true"
                />
                {item.name}
              </button>
            ))}
          </nav>
        </div>
      </div>
    </div>
  )
} 
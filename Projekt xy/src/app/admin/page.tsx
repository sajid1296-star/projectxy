'use client'

import { useState } from 'react'
import AdminSidebar from '@/components/admin/Sidebar'
import OrdersOverview from '@/components/admin/OrdersOverview'
import CustomerManagement from '@/components/admin/CustomerManagement'
import { useAuth } from '@/contexts/AuthContext'

export default function AdminDashboard() {
  const [activeTab, setActiveTab] = useState('orders')
  const { user } = useAuth()

  // Überprüfe Admin-Berechtigung
  if (!user?.role?.type === 'admin') {
    return <div>Zugriff verweigert</div>
  }

  return (
    <div className="flex h-screen bg-gray-100">
      <AdminSidebar activeTab={activeTab} setActiveTab={setActiveTab} />
      
      <div className="flex-1 overflow-auto">
        <div className="py-6">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 md:px-8">
            {activeTab === 'orders' && <OrdersOverview />}
            {activeTab === 'customers' && <CustomerManagement />}
          </div>
        </div>
      </div>
    </div>
  )
} 
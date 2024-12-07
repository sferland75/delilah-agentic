'use client'

import { Button } from '@/components/ui/button'
import { useState } from 'react'

export default function Home() {
  const [clients, setClients] = useState([])
  const [loading, setLoading] = useState(false)

  return (
    <main className="flex min-h-screen flex-col items-center justify-between p-24">
      <div className="w-full max-w-5xl">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-2xl font-bold">Client Management</h1>
          <Button>
            Add New Client
          </Button>
        </div>

        <div className="bg-white rounded-lg shadow p-6">
          {loading ? (
            <div className="text-center py-4">Loading...</div>
          ) : clients.length === 0 ? (
            <div className="text-center py-4 text-gray-500">
              No clients yet. Add your first client to get started.
            </div>
          ) : (
            <div className="space-y-4">
              {/* Client list will go here */}
            </div>
          )}
        </div>
      </div>
    </main>
  )
}

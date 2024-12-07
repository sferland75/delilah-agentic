'use client'

export default function Home() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-between p-24">
      <div className="w-full max-w-5xl">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-2xl font-bold">Client Management</h1>
        </div>

        <div className="bg-white rounded-lg shadow p-6">
          <div className="text-center py-4 text-gray-500">
            No clients yet. Add your first client to get started.
          </div>
        </div>
      </div>
    </main>
  )
}

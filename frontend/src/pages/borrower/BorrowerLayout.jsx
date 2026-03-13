import { Suspense } from 'react'
import { Outlet } from 'react-router-dom'
import TopNavBar from './TopNavBar'
import { BorrowerProfileProvider } from './BorrowerProfileContext'

export default function BorrowerLayout() {
  return (
    <BorrowerProfileProvider>
      <div className="min-h-screen bg-gray-50">
        <TopNavBar />
        <main className="pt-14 flex flex-col min-h-screen">
          <div className="flex-1 w-full max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-8 py-6">
            <Suspense fallback={<div className="p-6 text-center text-gray-500">Loading…</div>}>
              <Outlet />
            </Suspense>
          </div>
        </main>
      </div>
    </BorrowerProfileProvider>
  )
}

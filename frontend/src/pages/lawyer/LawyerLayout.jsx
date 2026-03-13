import { Suspense } from 'react'
import { Outlet } from 'react-router-dom'
import { LawyerProfileProvider } from './LawyerProfileContext'
import LawyerTopNavBar from '../../components/layout/LawyerTopNavBar'

export default function LawyerLayout() {
  return (
    <LawyerProfileProvider>
      <div className="min-h-screen bg-gray-100">
        <LawyerTopNavBar />

        {/* Main content - full width, no sidebar */}
        <div className="flex flex-col min-h-screen">
          <main className="flex-1 mt-14 p-4 sm:p-6 lg:p-8 w-full overflow-x-auto">
            <div className="w-full max-w-[1440px] mx-auto">
              <Suspense fallback={<div className="p-6 text-center text-gray-500">Loading…</div>}>
                <Outlet />
              </Suspense>
            </div>
          </main>
        </div>
      </div>
    </LawyerProfileProvider>
  )
}

import { Suspense } from 'react'
import { Outlet } from 'react-router-dom'
import { LawyerProfileProvider, useLawyerProfile } from '../../context/LawyerProfileContext'
import Header from './components/Header'

function LawyerLayoutInner() {
  const { profile } = useLawyerProfile()
  return (
    <div className="flex min-h-screen bg-[#F5F6FA]">
      <div className="flex-1 flex flex-col overflow-hidden">
        <Header user={profile} />
        <main className="flex-1 p-4 md:p-6 overflow-y-auto">
          <Suspense fallback={<div className="p-6 text-center text-gray-500">Loading…</div>}>
            <Outlet />
          </Suspense>
        </main>
      </div>
    </div>
  )
}

export default function LawyerLayout() {
  return (
    <LawyerProfileProvider>
      <LawyerLayoutInner />
    </LawyerProfileProvider>
  )
}

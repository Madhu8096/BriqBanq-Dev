import { Outlet } from 'react-router-dom'
import TopNavBar from './TopNavBar'

export default function BorrowerLayout() {
  return (
    <div className="min-h-screen bg-gray-50">
      <TopNavBar />
      <main className="pt-14">
        <Outlet />
      </main>
    </div>
  )
}

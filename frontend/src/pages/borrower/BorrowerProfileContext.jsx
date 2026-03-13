import { createContext, useContext, useState } from 'react'

const defaultUser = { name: 'David Williams', role: 'Borrower', initials: 'DW' }
const defaultValue = { profile: null, setProfile: () => {}, user: defaultUser, setUser: () => {} }
export const BorrowerProfileContext = createContext(defaultValue)

export function useBorrowerProfile() {
  return useContext(BorrowerProfileContext)
}

export function BorrowerProfileProvider({ children }) {
  const [profile, setProfile] = useState(null)
  const [user, setUser] = useState(defaultUser)
  return (
    <BorrowerProfileContext.Provider value={{ profile, setProfile, user, setUser }}>
      {children}
    </BorrowerProfileContext.Provider>
  )
}

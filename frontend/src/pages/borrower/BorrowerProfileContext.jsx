import { createContext, useContext } from 'react'

export const BorrowerProfileContext = createContext({ profile: null, setProfile: () => {} })

export function useBorrowerProfile() {
  return useContext(BorrowerProfileContext)
}

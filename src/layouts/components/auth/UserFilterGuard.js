// ** React Imports
import { useEffect } from 'react'

// ** Next Import
import { useRouter } from 'next/router'

// ** Hooks Import
import { useSession } from 'next-auth/react'

const FilterGuard = props => {
  const { children } = props
  const {data: session, status} = useSession()
  const router = useRouter()


  useEffect(() => {
    if (!router.isReady) {
      return
    }
    if (status === 'authenticated' && session && (!session?.user?.firstname || !session?.user?.lastname)) {
      if (router.pathname === '/register') {
        return
      }
      router.replace('/register/')
    }
  }, [status, session, router])


  return <>{children}</>
}

export default FilterGuard

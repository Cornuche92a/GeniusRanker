// ** React Imports
import { useEffect } from 'react'

// ** Next Import
import { useRouter } from 'next/router'

// ** Hooks Import
import { useSession } from 'next-auth/react'

const GuestGuard = props => {
  const { children, fallback } = props
  const {data: session, status} = useSession()
  const router = useRouter()
  useEffect(() => {
    if (!router.isReady) {
      return
    }
    if (status === 'authenticated' && !router.query.returnUrl) {
      router.replace('/')
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [router.route, status])
  if (status === 'unauthenticated') {
    return <>{children}</>
  } else {
    return fallback
  }

}

export default GuestGuard

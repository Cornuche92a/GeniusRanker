// ** React Imports
import { useEffect } from 'react'

// ** Next Import
import { useRouter } from 'next/router'

// ** Hooks Import
import { useSession } from 'next-auth/react'

const AuthGuard = props => {

  const { children, fallback } = props
  const {data: status} = useSession()
  const router = useRouter()

  useEffect(
    () => {
      if (!router.isReady) {
        return
      }
      if (status === 'unauthenticated') {
        if (router.asPath !== '/') {
          router.replace({
            pathname: '/',
            query: { returnUrl: router.asPath }
          })
        } else {
          router.replace('/')
        }
      }
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [router.route, status]
  )
  if (status !== 'authenticated') {
    return fallback
  }

  return <>{children}</>
}

export default AuthGuard

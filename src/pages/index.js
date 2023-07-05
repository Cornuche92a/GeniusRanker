import { useSession } from "next-auth/react";
import { useRouter } from 'next/router'

const Home = () => {

  const router = new useRouter
  const {data: session} = useSession()

  if(session){
    router.replace('/dashboard')
  }

  return <>Home Page</>

}

Home.authGuard = false

export default Home

import { getServerSession } from 'next-auth/next'
import {authOptions} from "src/pages/api/auth/[...nextauth]";

function Dashboard (props) {
  const { session } = props

  return (
    <div>
      <h1>Dashboard de {session.user.firstname}</h1>
    </div>
  )

}

Dashboard.acl = {
  action: 'read',
  subject: 'dashboard'
}

export default Dashboard

export async function getServerSideProps (context) {
  const session = await getServerSession(context.req, context.res, authOptions)

  if (!session) {
    return {
      redirect: {
        destination: '/',
        permanent: false
      }
    }
  }

  return {
    props: { session }
  }
}

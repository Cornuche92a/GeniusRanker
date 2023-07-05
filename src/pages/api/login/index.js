// ** Fake user data
// ** Please remove below user data in production and verify user with Real Database
const users = [
  {
    id: 1,
    role: 'admin',
    password: 'admin',
    username: 'johndoe',
    fullName: 'John Doe',
    email: 'admin@materialize.com'
  },
  {
    id: 2,
    role: 'client',
    password: 'client',
    username: 'nathandoe',
    fullName: 'Nathan Doe',
    email: 'client@materialize.com'
  }
]

const handler = (req, res) => {
  const { email, password } = req.body

  const user = users.find(u => u.email === email && u.password === password)

  if (user) {
    return res.status(200).json(user)
  } else {
    return res.status(404).json({ message: 'Email or Password is invalid' })
  }
}

export default handler

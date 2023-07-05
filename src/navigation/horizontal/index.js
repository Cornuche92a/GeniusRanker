const navigation = () => [
  {
    title: 'Récapitulatif',
    action: 'manage',
    subject: 'admin-panel',
    path: '/home',
    auth: true,
    icon: 'mdi:home-outline',
  },
  {
    title: 'Dashboard',
    path: '/dashboard',
    action: 'read',
    subject: 'dashboard',
    auth: true,
    icon: 'mdi:home-outline',
  },
  {
    title: 'Accueil',
    path: '/',
    action: ['read'],
    subject: 'status',
    auth: false,
    icon: 'mdi:home-outline',
  },
  {
    title: 'Tarifs',
    path: '/pricing',
    action: 'read',
    subject: 'public',
    auth: false,
    icon: 'mdi:currency-eur',
  },
  {
    title: 'Documentation',
    path: process.env.DOCUMENTATION,
    action: 'read',
    subject: 'public',
    auth: false,
    icon: 'mdi:question-box-outline',
  },
  {
    title: 'Mon plan',
    path: '/dashboard/plan',
    action: 'read',
    subject: 'plan',
    auth: true,
    icon: 'mdi:currency-eur',
  },
  {
    title: 'Mes parrainages',
    path: '/referral',
    action: 'read',
    subject: 'dashboard',
    auth: true,
    icon: 'mdi:people-outline',
  },
  {
    title: 'État des services',
    path: '/status',
    action: ['read'],
    subject: 'status',
    auth: false,
    icon: 'mdi:alert-box-outline',
  },
  {
    title: 'Contactez-nous',
    path: '/contact',
    action: 'read',
    subject: 'dashboard',
    auth: true,
    icon: 'mdi:email-outline',
  },
  {
    title: 'F.A.Q',
    path: '/contact',
    action: 'read',
    subject: 'dashboard',
    auth: false,
    icon: 'mdi:question-box-outline',
  },
]

export default navigation
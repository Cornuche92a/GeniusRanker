const navigation = () => {
  return [
    {
      action: 'read',
      subject: 'acl-page',
      sectionTitle: 'Dashboard'
    },
    {
      title: 'Dashboard',
      action: 'read',
      subject: 'acl-page',
      icon: 'mdi:home-outline',
      badgeContent: 'new',
      badgeColor: 'error',
      path: '/dashboard'
    },
    {
      action: 'read',
      subject: 'acl-page',
      sectionTitle: 'My Services'
    },
    {
      title: 'Mon plan',
      action: 'read',
      subject: 'acl-page',
      icon: 'mdi:euro',
      path: '/dashboard/plan'
    },
    {
      title: 'Affiliation',
      action: 'read',
      subject: 'acl-page',
      icon: 'mdi:account-multiple-plus',
      path: '/dashboard/affiliation'
    },
    {
      action: 'read',
      subject: 'acl-page',
      sectionTitle: 'Général'
    },
    {
      title: 'États',
      action: 'read',
      subject: 'acl-page',
      icon: 'mdi:alert-box',
      path: '/dashboard/affiliation'
    },
    {
      title: 'Contact',
      action: 'read',
      subject: 'acl-page',
      icon: 'mdi:account-multiple-plus',
      path: '/dashboard/affiliation'
    },
    {
      title: 'F.A.Q',
      action: 'read',
      subject: 'acl-page',
      icon: 'mdi:frequently-asked-questions',
      path: '/dashboard/affiliation'
    }
  ]
}

export default navigation

export default {
  items: [
    {
      name: 'Dashboard',
      url: '/dashboard',
      icon: 'icon-speedometer',
    },
    {
      name: 'Roles & Permissions',
      url: '/roles',
      icon: 'icon-people',
      permission:'role-list'
    },
    {
      name: 'Transactions',
      url: '/transactions',
      icon: 'fa fa-dollar',
      permission:'transaction-list'
    },
    {
      name: 'Complains',
      url: '/complains',
      icon: 'fa fa-cubes',
      permission:'complaint-list'
    },
    {
      name: 'Users',
      url: '/users',
      icon: 'fa fa-user-o',
      permission:'user-list-all'
    }
    ,{
      name: 'Settings',
      url: '/settings',
      icon: 'icon-settings',
      permission:'setting-list'
    },
    {
      name: 'Logout',
      url: '/logout',
      icon: 'fa fa-sign-out'
    },
  ],
};

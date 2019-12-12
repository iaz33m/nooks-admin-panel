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
      name: 'Tags',
      url: '/tags',
      icon: 'fa fa-cubes',
      permission:'tag-list-all'
    },
    {
      name: 'Product Types',
      url: '/productTypes',
      icon: 'fa fa-sitemap',
      permission:'productType-list-all'
    }
    ,
    {
      name: 'Promotions',
      url: '/promos',
      icon: 'fa fa-gift',
      permission:'promo-list'
    },
    {
      name: 'Restaurants',
      url: '/restaurants',
      icon: 'fa fa-cutlery',
      permission:'restaurant-list'
    },
    {
      name: 'Medias',
      url: '/medias',
      icon: 'fa fa-camera',
      permission:'media-list'
    },
    {
      name: 'Orders',
      url: '/orders',
      icon: 'fa fa-shopping-cart',
      permission:'order-list'
    }
    ,
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

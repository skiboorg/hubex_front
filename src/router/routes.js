
const routes = [
  //service
  {
    path: '/service/history',
    component: () => import('layouts/ServiceLayout.vue'),
    children: [
      { path: '', component: () => import('pages/service/History.vue') }
    ]
  },
  {
    path: '/service/equipment',
    component: () => import('layouts/ServiceLayout.vue'),
    children: [
      { path: '', component: () => import('pages/service/equipment/Index.vue') }
    ]
  },

  {
    path: '/service/equipment/qr/:serial_number',
    component: () => import('layouts/Equipment.vue'),
    children: [
      { path: '', component: () => import('pages/service/equipment/EquipmentDetailQr.vue') }
    ]
  },
  {
    path: '/service/equipment/:serial_number',
    component: () => import('layouts/ServiceLayout.vue'),
    children: [
      { path: '', component: () => import('pages/service/equipment/EquipmentDetail.vue') }
    ]
  },
  {
    path: '/service/equipment/add',
    component: () => import('layouts/ServiceLayout.vue'),
    children: [
      { path: '', component: () => import('pages/service/equipment/Add.vue') }
    ]
  },
  {
    path: '/service/equipment/edit/:id',
    component: () => import('layouts/ServiceLayout.vue'),
    children: [
      { path: '', component: () => import('pages/service/equipment/Edit.vue') }
    ]
  },
  {
    path: '/service/equipment/models',
    component: () => import('layouts/ServiceLayout.vue'),
    children: [
      { path: '', component: () => import('pages/service/equipment/Models.vue') }
    ]
  },
  {
    path: '/service',
    component: () => import('layouts/ServiceLayout.vue'),
    children: [
      { path: '', component: () => import('pages/service/order/Index.vue') }
    ]
  },
  {
    path: '/service/order',
    component: () => import('layouts/ServiceLayout.vue'),
    children: [
      { path: '', component: () => import('pages/service/order/Index.vue') }
    ]
  },
  {
    path: '/service/order/add',
    component: () => import('layouts/ServiceLayout.vue'),
    children: [
      { path: '', component: () => import('pages/service/order/Add.vue') }
    ]
  },
  {
    path: '/service/order/:number',
    component: () => import('layouts/ServiceLayout.vue'),
    children: [
      { path: '', component: () => import('pages/service/order/OrderDetail.vue') }
    ]
  },
  {
    path: '/service/order/calendar',
    component: () => import('layouts/ServiceLayout.vue'),
    children: [
      { path: '', component: () => import('pages/service/order/Calendar.vue') }
    ]
  },
  {
    path: '/service/order/order_calendar',
    component: () => import('layouts/ServiceLayout.vue'),
    children: [
      { path: '', component: () => import('pages/service/order/OrderCalendar.vue') }
    ]
  },
  {
    path: '/service/order/edit/:number',
    component: () => import('layouts/ServiceLayout.vue'),
    children: [
      { path: '', component: () => import('pages/service/order/Edit.vue') }
    ]
  },
  {
    path: '/service/order/checklists',
    component: () => import('layouts/ServiceLayout.vue'),
    children: [
      { path: '', component: () => import('pages/service/order/Checklists.vue') }
    ]
  },
  {
    path: '/service/order/checklist/:id',
    component: () => import('layouts/ServiceLayout.vue'),
    children: [
      { path: '', component: () => import('pages/service/order/Checklist.vue') }
    ]
  },
  {
    path: '/service/objects',
    component: () => import('layouts/ServiceLayout.vue'),
    children: [
      { path: '', component: () => import('pages/service/object/Index.vue') }
    ]
  },
  {
    path: '/service/object/:number',
    component: () => import('layouts/ServiceLayout.vue'),
    children: [
      { path: '', component: () => import('pages/service/object/ObjectDetail.vue') }
    ]
  },{
    path: '/service/object/add',
    component: () => import('layouts/ServiceLayout.vue'),
    children: [
      { path: '', component: () => import('pages/service/object/Add.vue') }
    ]
  },
  {
    path: '/service/users',
    component: () => import('layouts/ServiceLayout.vue'),
    children: [
      { path: '', component: () => import('pages/service/user/Index.vue') }
    ]
  },
  {
    path: '/service/users/:uuid',
    component: () => import('layouts/ServiceLayout.vue'),
    children: [
      { path: '', component: () => import('pages/service/user/UserInfo.vue') }
    ]
  },
  {
    path: '/service/users/add',
    component: () => import('layouts/ServiceLayout.vue'),
    children: [
      { path: '', component: () => import('pages/service/user/Add.vue') }
    ]
  },
  {
    path: '/service/clients',
    component: () => import('layouts/ServiceLayout.vue'),
    children: [
      { path: '', component: () => import('pages/service/client/Index.vue') }
    ]
  },
  {
    path: '/service/clients/add',
    component: () => import('layouts/ServiceLayout.vue'),
    children: [
      { path: '', component: () => import('pages/service/client/Add.vue') }
    ]
  },

  {
    path: '/worker',
    component: () => import('layouts/Driver.vue'),
    children: [
      { path: '', component: () => import('pages/service/driver/Index.vue') }
    ]
  },{
    path: '/calendar',
    component: () => import('layouts/Driver.vue'),
    children: [
      { path: '', component: () => import('pages/service/driver/Calendar.vue') }
    ]
  },
  {
    path: '/worker/order/:number',
    component: () => import('layouts/Driver.vue'),
    children: [
      { path: '', component: () => import('pages/service/driver/Order.vue') }
    ]
  },

  //service



  {
    path: '/login',
    component: () => import('layouts/Auth.vue'),
    children: [
      { path: '', component: () => import('pages/Login.vue') }
    ]
  },
  {
    path: '/',
    component: () => import('layouts/Auth.vue'),
    children: [
      { path: '', component: () => import('pages/Login.vue') }
    ]
  },

  // Always leave this as last one,
  // but you can also remove it
  {
    path: '/:catchAll(.*)*',
    component: () => import('pages/ErrorNotFound.vue')
  }
]

export default routes

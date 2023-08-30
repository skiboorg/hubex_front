
const routes = [
  {
    path: '/equipment',
    component: () => import('layouts/MainLayout.vue'),
    children: [
      { path: '', component: () => import('pages/equipment/Index.vue') }
    ]
  },
  {
    path: '/test',
    component: () => import('layouts/Auth.vue'),
    children: [
      { path: '', component: () => import('pages/test.vue') }
    ]
  },
  {
    path: '/equipment/qr/:serial_number',
    component: () => import('layouts/Equipment.vue'),
    children: [
      { path: '', component: () => import('pages/equipment/EquipmentDetailQr.vue') }
    ]
  },
  {
    path: '/equipment/:serial_number',
    component: () => import('layouts/MainLayout.vue'),
    children: [
      { path: '', component: () => import('pages/equipment/EquipmentDetail.vue') }
    ]
  },
  {
    path: '/equipment/add',
    component: () => import('layouts/MainLayout.vue'),
    children: [
      { path: '', component: () => import('pages/equipment/Add.vue') }
    ]
  },
  {
    path: '/equipment/edit/:id',
    component: () => import('layouts/MainLayout.vue'),
    children: [
      { path: '', component: () => import('pages/equipment/Edit.vue') }
    ]
  },
  {
    path: '/equipment/models',
    component: () => import('layouts/MainLayout.vue'),
    children: [
      { path: '', component: () => import('pages/equipment/Models.vue') }
    ]
  },
  {
    path: '/',
    component: () => import('layouts/MainLayout.vue'),
    children: [
      { path: '', component: () => import('pages/order/Index.vue') }
    ]
  },
  {
    path: '/order',
    component: () => import('layouts/MainLayout.vue'),
    children: [
      { path: '', component: () => import('pages/order/Index.vue') }
    ]
  },
  {
    path: '/order/add',
    component: () => import('layouts/MainLayout.vue'),
    children: [
      { path: '', component: () => import('pages/order/Add.vue') }
    ]
  },
  {
    path: '/order/:number',
    component: () => import('layouts/MainLayout.vue'),
    children: [
      { path: '', component: () => import('pages/order/OrderDetail.vue') }
    ]
  },
  {
    path: '/order/calendar',
    component: () => import('layouts/MainLayout.vue'),
    children: [
      { path: '', component: () => import('pages/order/Calendar.vue') }
    ]
  },
  {
    path: '/order/order_calendar',
    component: () => import('layouts/MainLayout.vue'),
    children: [
      { path: '', component: () => import('pages/order/OrderCalendar.vue') }
    ]
  },
  {
    path: '/order/edit/:number',
    component: () => import('layouts/MainLayout.vue'),
    children: [
      { path: '', component: () => import('pages/order/Edit.vue') }
    ]
  },
  {
    path: '/order/checklists',
    component: () => import('layouts/MainLayout.vue'),
    children: [
      { path: '', component: () => import('pages/order/Checklists.vue') }
    ]
  },
  {
    path: '/order/checklist/:id',
    component: () => import('layouts/MainLayout.vue'),
    children: [
      { path: '', component: () => import('pages/order/Checklist.vue') }
    ]
  },
  {
    path: '/objects',
    component: () => import('layouts/MainLayout.vue'),
    children: [
      { path: '', component: () => import('pages/object/Index.vue') }
    ]
  },
  {
    path: '/object/:number',
    component: () => import('layouts/MainLayout.vue'),
    children: [
      { path: '', component: () => import('pages/object/ObjectDetail.vue') }
    ]
  },{
    path: '/object/add',
    component: () => import('layouts/MainLayout.vue'),
    children: [
      { path: '', component: () => import('pages/object/Add.vue') }
    ]
  },
  {
    path: '/users',
    component: () => import('layouts/MainLayout.vue'),
    children: [
      { path: '', component: () => import('pages/user/Index.vue') }
    ]
  },
  {
    path: '/users/:uuid',
    component: () => import('layouts/MainLayout.vue'),
    children: [
      { path: '', component: () => import('pages/user/UserInfo.vue') }
    ]
  },
  {
    path: '/users/add',
    component: () => import('layouts/MainLayout.vue'),
    children: [
      { path: '', component: () => import('pages/user/Add.vue') }
    ]
  },
  {
    path: '/clients',
    component: () => import('layouts/MainLayout.vue'),
    children: [
      { path: '', component: () => import('pages/client/Index.vue') }
    ]
  },
  {
    path: '/clients/add',
    component: () => import('layouts/MainLayout.vue'),
    children: [
      { path: '', component: () => import('pages/client/Add.vue') }
    ]
  },

  {
    path: '/worker',
    component: () => import('layouts/Driver.vue'),
    children: [
      { path: '', component: () => import('pages/driver/Index.vue') }
    ]
  },{
    path: '/calendar',
    component: () => import('layouts/Driver.vue'),
    children: [
      { path: '', component: () => import('pages/driver/Calendar.vue') }
    ]
  },
  {
    path: '/worker/order/:number',
    component: () => import('layouts/Driver.vue'),
    children: [
      { path: '', component: () => import('pages/driver/Order.vue') }
    ]
  },

  {
    path: '/login',
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


const routes = [
  {
    path: '/',
    component: () => import('layouts/MainLayout.vue'),
    children: [
      { path: '', component: () => import('pages/Equipment.vue') }
    ]
  },
  {
    path: '/equipment/qr/:serial_number',
    component: () => import('layouts/Equipment.vue'),
    children: [
      { path: '', component: () => import('pages/EquipmentDetailQr.vue') }
    ]
  },
  {
    path: '/equipment/:serial_number',
    component: () => import('layouts/MainLayout.vue'),
    children: [
      { path: '', component: () => import('pages/EquipmentDetail.vue') }
    ]
  },
  {
    path: '/orders',
    component: () => import('layouts/MainLayout.vue'),
    children: [
      { path: '', component: () => import('pages/Orders.vue') }
    ]
  },
  {
    path: '/order/:number',
    component: () => import('layouts/MainLayout.vue'),
    children: [
      { path: '', component: () => import('pages/OrderDetail.vue') }
    ]
  },
  {
    path: '/objects',
    component: () => import('layouts/MainLayout.vue'),
    children: [
      { path: '', component: () => import('pages/Objects.vue') }
    ]
  },
  {
    path: '/object/:number',
    component: () => import('layouts/MainLayout.vue'),
    children: [
      { path: '', component: () => import('pages/ObjectDetail.vue') }
    ]
  },

  {
    path: '/auth',
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

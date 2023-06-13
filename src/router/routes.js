
const routes = [
  {
    path: '/',
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
    path: '/orders',
    component: () => import('layouts/MainLayout.vue'),
    children: [
      { path: '', component: () => import('pages/order/Index.vue') }
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

<template>
  <q-layout view="lHh Lpr lFf">
    <q-page-container>
      <router-view />
    </q-page-container>
  </q-layout>
</template>
<script>
import { useAuthStore } from 'stores/auth'
export default {

  preFetch({store, redirect}) {
    const auth_store = useAuthStore(store)
    if (auth_store.loggedIn) {
      if (auth_store.user.is_driving) {
        redirect({path: '/worker'})
      }else {
        redirect({path: '/service/order'})
      }
    }

  },
}
</script>

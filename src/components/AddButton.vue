<template>
  <q-no-ssr>

    <q-btn v-if="is_enabled" color="primary" :icon="icon" :label="label"  unelevated no-caps class="q-py-md"/>
  </q-no-ssr>

</template>

<script setup>

import {useAuthStore} from "stores/auth";
const auth_store = useAuthStore()
const route = useRoute()
const props = defineProps(['label','icon'])
import {computed, onBeforeMount, ref} from "vue";
import {useRoute} from "vue-router";

const user = computed(()=>{
  return auth_store.user
})

const is_enabled = ref(false)

onBeforeMount(()=>{
  console.log(user.value.role.pages)

  let path = route.path
  console.log(user.value.role.pages.find(x=>path.includes(x.page.url)))

  try {
    is_enabled.value = user.value.role.pages.find(x=>path.includes(x.page.url)).permission.can_edit
  }catch (e) {
    console.log(e)
  }
})

</script>

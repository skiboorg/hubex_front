<template>
  <q-no-ssr>
    <q-btn v-if="is_enabled" color="primary" icon="add" :label="label"  unelevated no-caps class="q-py-md"/>
  </q-no-ssr>

</template>

<script setup>

import {useAuthStore} from "stores/auth";
const auth_store = useAuthStore()
const route = useRoute()
const props = defineProps(['label'])
import {computed, onBeforeMount, ref} from "vue";
import {useRoute} from "vue-router";

const user = computed(()=>{
  return auth_store.user
})

const is_enabled = ref(false)
console.log(route.path)
onBeforeMount(()=>{
  console.log(user.value.role.pages)
  try {
    is_enabled.value = user.value.role.pages.find(x=>x.page.url === route.path).permission.can_edit
  }catch (e) {
    console.log(e)
  }
})

</script>

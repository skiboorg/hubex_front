<template>
  <q-page padding>
    <div class="rounded-box small">

      <q-card flat class="bg-grey-3 rounded-box small q-mb-md" v-for="order in orders" :key="order.id"
              @click="$router.push(`/worker/order/${order.number}`)">
        <p class="text-bold q-mb-sm">Заявка №{{order.number}}</p>
        <p class="q-mb-sm">{{order.status.name}}</p>
        <p class="q-mb-none">{{order.object.address}}</p>
      </q-card>

    </div>
  </q-page>
</template>

<script setup>
import {onBeforeMount, ref} from "vue";
import {api} from "boot/axios";
import {useAuthStore} from "stores/auth"

const auth_store = useAuthStore()

const orders = ref([])

onBeforeMount(async ()=>{
  await getEquipment()
})
const getEquipment = async () => {
  const response = await api(`/api/data/order_by_worker/${auth_store.user.id}`)
  orders.value = response.data
}
</script>

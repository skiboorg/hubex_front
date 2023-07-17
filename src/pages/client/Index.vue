<template>
  <q-page >
    <div v-if="clients">
      <div  class="rounded-box q-mb-lg">
        <div class="page-search">
          <p class="no-margin title text-bold">Заказчики <span class="text-grey-6">{{clients.length}}</span></p>
          <q-space/>

          <q-btn @click="$router.push('/clients/add')" label="Добавить заказчика" icon="add" color="primary" unelevated no-caps/>
        </div>

      </div>
      <div class="rounded-box">

        <div class="row q-col-gutter-md">
          <div class="col-12 col-md-3" v-for="client in clients" :key="client.id">
            <ClientCard :client="client"/>
          </div>
        </div>

      </div>
    </div>


  </q-page>
</template>
<script setup>

import {onBeforeMount, ref} from "vue";
import {api} from "boot/axios";
import ClientCard from "components/ClientCard.vue";


const clients = ref(null)
onBeforeMount(async ()=>{
  await getClients()


})
const getClients = async () => {
  const response = await api(`/api/data/client`)
  clients.value = response.data
}
</script>

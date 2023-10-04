<template>
  <q-page>

    <div class="rounded-box small q-mb-sm">
      <div class="flex items-center justify-between">
        <p class="no-margin text-h6">Мои календарь</p>
      </div>
    </div>

    <div  class="rounded-box small full-height">
      <q-date
        class="full-width"
        flat
        @click = 'dateSelected'
        v-model="selected_date"
        :events="events"/>
    </div>
  </q-page>
  <q-dialog
    v-model="showOrders"
    persistent
    maximized
    full-width
    v-touch-swipe
    transition-show="slide-left"
    transition-hide="slide-right"
  >
    <q-card >
      <q-card-section class="row items-center q-pb-none">
        <div class="text-h6">Заявки на {{new Date(selected_date).toLocaleDateString()}}</div>
        <q-space />
        <q-btn icon="close" flat round dense v-close-popup />
      </q-card-section>
      <div class="q-pa-sm q-pt-none bg-grey-3 full-height">
        <div  class="rounded-box small q-mb-sm" v-for="order in orders.result" :key="order.id"
             @click="$router.push(`/worker/order/${order.order_data.order_number}`)">
          <div class="flex items-center justify-between">
            <p class="text-bold q-mb-none">{{order.title}}</p>
            <p class="text-bold q-mb-none">{{new Date(order.order_data.order_created).toLocaleDateString()}}</p>
          </div>
          <p class="text-bold q-mb-none text-h6 text-blue-7">{{order.order_data.object_number}}</p>
          <p class="q-mb-sm text-grey-6">{{order.order_data.object_address}} </p>
          <p class="q-mb-md text-grey-6">С/Н оборудования <span class="text-bold text-blue-7">{{order.order_data.equipment_sn}}</span> </p>
          <div class="flex items-center justify-between q-mb-md">
            <p class="status q-mb-none" :style="[{color:order.order_data.status_text_color},{background:order.order_data.status_bg_color}]">
              <span :style="{background:order.order_data.status_text_color}" class="status-dot"></span>
              {{order.order_data.status_name}}
            </p>
            <p class="q-mb-none text-bold ">{{order.order_data.stage_name}}</p>
          </div>
              <p class="no-margin">Назначен на {{new Date(order.date).toLocaleDateString()}}</p>
              <p class="no-margin">c {{order.start_time}} до {{order.end_time}}</p>
              <p class="no-margin">{{order.type?.name}}</p>
        </div>
      </div>
    </q-card>
  </q-dialog>
</template>

<script setup>
import {onBeforeMount, ref} from "vue";
import {api} from "boot/axios";
import {useAuthStore} from "stores/auth"

import FullCalendar from '@fullcalendar/vue3'
import dayGridPlugin from '@fullcalendar/daygrid'
import interactionPlugin from '@fullcalendar/interaction'
import timeGridPlugin from '@fullcalendar/timegrid'
const auth_store = useAuthStore()

const orders = ref([])
const events = ref([])
const is_loading = ref(false)
const showOrders = ref(false)
const selected_date = ref(null)

onBeforeMount(async ()=>{

  if (auth_store.user.work_time?.length>0){
    auth_store.user.work_time.forEach((el)=>{
      events.value.push(el.date.replaceAll('-','/'))
    })
  }

})
const dateSelected = async () => {
  is_loading.value = !is_loading.value
  orders.value = []
  console.log(selected_date.value)
  const response = await api(`/api/user/find_worker_time_for_calendar?user_id=${auth_store.user.id}&date=${selected_date.value}`)
  orders.value = response.data
  console.log(response.data)
  showOrders.value = true
  is_loading.value = !is_loading.value
}
</script>
<style lang="sass">
.fc-toolbar-title
  font-size: 14px !important
.fc
  height: 80vh
</style>

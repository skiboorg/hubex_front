<template>
  <q-page padding>
    <div class="rounded-box small q-mb-sm">
      <div class="flex items-center justify-between">
        <p class="no-margin text-h6">Мои заявки <span class="text-grey-6">{{orders?.length}}</span></p>
      </div>
    </div>

      <div v-if="!is_loading" class="rounded-box small q-mb-sm" v-for="order in orders" :key="order.id"
              @click="$router.push(`/worker/order/${order.number}`)">


            <div class="flex items-center justify-between">
              <p class="text-bold q-mb-none">Заявка №{{order.number}}</p>
              <p class="text-bold q-mb-none">{{new Date(order.date_created_at).toLocaleDateString()}}</p>
            </div>
            <p class="text-bold q-mb-none text-h6 text-blue-7">{{order.object.number}}</p>
            <p class="q-mb-md text-grey-6">{{order.object.address}} <span class="text-bold"> {{order.object.client?.is_panic ? '**' : ''}}</span></p>
            <div class="flex items-center justify-between q-mb-md">
              <p class="status q-mb-none" :style="[{color:order.status?.text_color},{background:order.status?.bg_color}]">
                <span :style="{background:order.status?.text_color}" class="status-dot"></span>
                {{order.status?.name}}
              </p>
              <p class="q-mb-none text-bold ">{{order.stage.name}}</p>
            </div>

            <div  class="" v-if="order.users.find(x=>x.login === auth_store.user.login).work_time.length>0">

              <div v-show="!item.is_hidden" class="bg-grey-3 q-pa-sm q-mb-sm" v-for="item in order.users.find(x=>x.login === auth_store.user.login).work_time">

                <p class="no-margin">Назначен на {{new Date(item.date).toLocaleDateString()}}</p>
                <p class="no-margin">c {{item.start_time}} до {{item.end_time}}</p>
                <p class="no-margin">{{item.type.name}}</p>
              </div>
            </div>
      </div>
    <div style="height: 100vh" class=" full-width relative-position" v-else>
      <q-inner-loading showing>
        <q-spinner-gears size="50px" color="primary" />
      </q-inner-loading>
    </div>


  </q-page>
</template>

<script setup>
import {onBeforeMount, ref} from "vue";
import {api} from "boot/axios";
import {useAuthStore} from "stores/auth"

import FullCalendar from '@fullcalendar/vue3'
import dayGridPlugin from '@fullcalendar/daygrid'
import interactionPlugin from '@fullcalendar/interaction'
import timeGridPlugin from '@fullcalendar/timegrid'
const handleDateClick = (arg) => {
  console.log('arg')
}
const handleSelect = (arg) => {
  console.log(arg)
}

const calendarOptions = ref({
  plugins: [ interactionPlugin, timeGridPlugin],
  initialView: 'timeGridWeek',
  weekends: true,
  locale: 'ru',
  firstDay:1,
  select: handleSelect,
  selectable:false,
  headerToolbar: {
    left: 'prev,next',
    center: 'title',
    right: 'timeGridWeek,timeGridDay'
  },
  slotMinTime: '09:00:00',
  slotMaxTime: '21:00:00',
  timeZone: 'Europe/Moscow',
  editable: false,

  eventClick: handleDateClick,
  events: [

  ]
})

const auth_store = useAuthStore()

const orders = ref([])
const is_loading = ref(false)

onBeforeMount(async ()=>{
  await getEquipment()
  calendarOptions.value.events = auth_store.user.work_time
})
const getEquipment = async () => {
  is_loading.value = !is_loading.value
  const response = await api(`/api/data/order_by_worker/${auth_store.user.id}`)
  orders.value = response.data
  is_loading.value = !is_loading.value
}
</script>

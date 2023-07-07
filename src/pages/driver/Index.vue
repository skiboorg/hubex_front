<template>
  <q-page padding>
<!--    <div class="rounded-box small">-->
<!--      <FullCalendar style="height: 70vh" :options='calendarOptions' />-->
<!--    </div>-->

    <div class="rounded-box small q-mb-sm">
      <div class="flex items-center justify-between">
        <p class="no-margin text-h6">Мои заявки <span class="text-grey-6">{{orders.length}}</span></p>
      </div>
    </div>

      <q-card flat class="rounded-box small q-mb-sm" v-for="order in orders" :key="order.id"
              @click="$router.push(`/worker/order/${order.number}`)">
        <div class="q-mb-sm flex items-center justify-between">
          <p class="text-bold q-mb-none">Заявка №{{order.number}}</p>
          <q-icon size="15px" name="arrow_forward"/>
        </div>

        <p class="q-mb-md text-grey-6">{{order.object.address}}</p>
        <p class="status q-mb-none" :style="[{color:order.status?.text_color},{background:order.status?.bg_color}]">{{order.status?.name}}</p>

      </q-card>


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

onBeforeMount(async ()=>{
  await getEquipment()
  calendarOptions.value.events = auth_store.user.work_time
})
const getEquipment = async () => {
  const response = await api(`/api/data/order_by_worker/${auth_store.user.id}`)
  orders.value = response.data
}
</script>

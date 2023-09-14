<template>
  <q-page >
    <div class="rounded-box q-mb-lg">
      <div class="page-search">
        <q-btn @click="$router.back()" label="Назад" class="btn-bg" icon="chevron_left" outline color="primary"  unelevated no-caps/>
        <p class="no-margin title text-bold">{{user.fio}} </p>
        <q-space/>


        <q-btn @click="userCalendarDialog = true" label="Открыть календарь" icon="calendar_month" color="primary" unelevated no-caps/>
      </div>
    </div>
    <div class="grid q-mb-lg">
      <q-card flat  >
        <q-card-section>
          <div class="flex items-center justify-between q-mb-lg">
            <p class="no-margin text-h5 text-bold text-dark">Информация о сотруднике</p>
            <div class="q-gutter-xs">
              <q-btn dense flat round>
                <svg width="16" height="4" viewBox="0 0 16 4" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <circle cx="2" cy="2" r="2" fill="#B8B9C5"/>
                  <circle cx="8" cy="2" r="2" fill="#B8B9C5"/>
                  <circle cx="14" cy="2" r="2" fill="#B8B9C5"/>
                </svg>
              </q-btn>
              <q-btn dense flat round>
                <svg width="28" height="28" viewBox="0 0 28 28" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M15 8C15 7.44772 14.5523 7 14 7C13.4477 7 13 7.44772 13 8L13 12C13 12.5523 12.5523 13 12 13H8C7.44771 13 7 13.4477 7 14C7 14.5523 7.44771 15 8 15H12C12.5523 15 13 15.4477 13 16V20C13 20.5523 13.4477 21 14 21C14.5523 21 15 20.5523 15 20V16C15 15.4477 15.4477 15 16 15H20C20.5523 15 21 14.5523 21 14C21 13.4477 20.5523 13 20 13H16C15.4477 13 15 12.5523 15 12L15 8Z" fill="#11173E"/>
                </svg>
              </q-btn>
            </div>
          </div>
          <div class="flex items-center q-mb-lg">
            <q-avatar size="128px" class="q-mr-md">
              <img v-if="user.avatar" :src="user.avatar">
              <img v-else src="https://placehold.co/300">
            </q-avatar>
            <div class="q-mr-xl">
              <p class="no-margin text-h6">{{user.fio}}</p>
              <p class="no-margin text-grey-6">{{user.role?.name}}</p>
            </div>
          </div>
          <div class="row bordered-box">
            <p class="col-6 text-grey text-weight-medium">Телефон: </p>
            <p class="col-6 text-dark text-weight-medium">{{user.phone}}</p>
            <p class="col-6 text-grey text-weight-medium">Почта: </p>
            <p class="col-6 text-dark text-weight-medium">{{user.email}}</p>
            <p class="col-6 text-grey text-weight-medium">Телеграм: </p>
            <p class="col-6 text-dark text-weight-medium">{{user.telega}}</p>
            <p class="col-6 text-grey text-weight-medium">График работы: </p>
            <p class="col-6 text-dark text-weight-medium">ee</p>
            <p class="col-12 text-grey text-weight-medium">Комментарий (виден только администратору) </p>
            <p class="col-12 text-dark text-weight-medium comment">ee</p>
          </div>
        </q-card-section>
      </q-card>
      <q-card flat  >
        <q-card-section>
          <div class="flex items-center justify-between q-mb-lg">
            <p class="no-margin text-h5 text-bold text-dark">Статистика сотрудника</p>
            <div class="q-gutter-xs">
              <q-btn dense flat round>
                <svg width="16" height="4" viewBox="0 0 16 4" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <circle cx="2" cy="2" r="2" fill="#B8B9C5"/>
                  <circle cx="8" cy="2" r="2" fill="#B8B9C5"/>
                  <circle cx="14" cy="2" r="2" fill="#B8B9C5"/>
                </svg>
              </q-btn>
              <q-btn dense flat round>
                <svg width="28" height="28" viewBox="0 0 28 28" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M15 8C15 7.44772 14.5523 7 14 7C13.4477 7 13 7.44772 13 8L13 12C13 12.5523 12.5523 13 12 13H8C7.44771 13 7 13.4477 7 14C7 14.5523 7.44771 15 8 15H12C12.5523 15 13 15.4477 13 16V20C13 20.5523 13.4477 21 14 21C14.5523 21 15 20.5523 15 20V16C15 15.4477 15.4477 15 16 15H20C20.5523 15 21 14.5523 21 14C21 13.4477 20.5523 13 20 13H16C15.4477 13 15 12.5523 15 12L15 8Z" fill="#11173E"/>
                </svg>
              </q-btn>
            </div>
          </div>
        </q-card-section>
      </q-card>
    </div>
    <q-card flat>
      <q-card-section>
        <div class="flex items-center justify-between q-mb-lg">
          <p class="no-margin text-h5 text-bold text-dark">Заявки</p>
          <q-checkbox v-model="showDone" label="Показывать завершенные"/>
        </div>
        <q-table
          flat
          :rows="showDone ? orders : orders.filter(x=>!x.is_done)"
          :columns="columns"
          row-key="name"
          table-header-class="table-header"
        >
          <template v-slot:header="props">
            <q-tr :props="props" class="bg-grey-2">

              <q-th
                v-for="col in props.cols"
                :key="col.name"
                :props="props"
              >
                <span class="text-bold"> {{ col.label }}</span>
              </q-th>
              <q-th auto-width />
            </q-tr>
          </template>
          <template v-slot:body="props">
            <q-tr :props="props">

              <q-td
                v-for="col in props.cols"
                :key="col.name"
                :props="props">
                <span v-if="col.name ==='status'" class="status" :style="[{color:col.value.text_color},{background:col.value.bg_color}]">
                  <span :style="{background:col.value.text_color}" class="status-dot"></span>
                  {{col.value.name}}
                </span>

                <span v-else-if="col.name ==='is_done'">
                <q-icon v-if="col.value" name="check_circle" size="20px" color="positive"/>
                  <!--                <q-icon v-else name="engineering" size="20px" color="grey-7"/>-->
              </span>
                <span v-else-if="col.name ==='is_critical'">
                <q-icon v-if="col.value" name="warning" size="20px" color="negative"/>
                  <!--                <q-icon v-else name="schedule" size="20px" color="grey-7"/>-->
              </span>
                <span v-else>{{ col.value }}</span>
              </q-td>

              <q-td auto-width>
                <q-btn flat round dense :to="`/service/order/${props.row.number}`">
                  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M5.46967 17.4702C5.17678 17.7631 5.17678 18.2379 5.46967 18.5308C5.76256 18.8237 6.23744 18.8237 6.53033 18.5308L5.46967 17.4702ZM6.53033 18.5308L18.5303 6.53082L17.4697 5.47016L5.46967 17.4702L6.53033 18.5308Z" fill="#131119"/>
                    <path d="M9 6.00049H18V15.0005" stroke="#131119" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
                  </svg>
                </q-btn>
              </q-td>
            </q-tr>
          </template>
        </q-table>
      </q-card-section>
    </q-card>
  </q-page>
  <q-dialog
    v-model="userCalendarDialog"
    persistent
    maximized
    transition-show="slide-up"
    transition-hide="slide-down"

  >
    <q-card>
      <q-bar>
        <p class="no-margin">Календарь сотрудника</p>
        <q-space />
        <q-btn dense flat icon="close" v-close-popup/>
      </q-bar>
      <q-card-section>
        <FullCalendar style="height: 70vh" :options='calendarOptions' />
      </q-card-section>
    </q-card>
  </q-dialog>

</template>
<script setup>
import {onBeforeMount, ref} from "vue";
import {useRoute} from "vue-router";
import {api} from "boot/axios";

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

const route = useRoute()
const orders = ref([])
const showDone = ref(false)
const userCalendarDialog = ref(false)

const columns = [
  { name: 'is_critical', align: 'center',  label: '', field: row => row.is_critical ,  sortable: true},
  { name: 'date_created_at', align: 'left',  label: 'Создана', field: row => new Date(row.date_created_at).toLocaleString() ,  sortable: true},
  { name: 'number', align: 'left',  label: 'Номер', field: 'number',  sortable: true},
  { name: 'object', align: 'left',  label: 'Объект', field: row => row.object.name ,  sortable: true},
  { name: 'status', align: 'left',  label: 'Статус', field: row => row.status ,  sortable: false},
  { name: 'is_done', align: 'center',  label: 'Завершена', field: row => row.is_done ,  sortable: true},
]

const user = ref({})

onBeforeMount(async ()=>{
  const response = await api(`/api/user/get_user/${route.params.uuid}`)
  user.value = response.data
  calendarOptions.value.events = user.value.work_time
  console.log(calendarOptions.value.events)
  await getOrders()
})

const getOrders = async () => {
  const response = await api(`/api/data/order_by_user/${user.value.id}`)
  orders.value = response.data
}

</script>

<template>
<q-page>
  <div class="container">
    <div class="row q-col-gutter-md">
      <div class="col-3">
        <q-date
          flat
          v-model="selected_date"
          @update:modelValue="dateSelected"
          class="full-width"
          :events="events"/>
      </div>
      <div class="col-9">
        <div v-if="!is_loading" class="rounded-box small q-mb-md cursor-pointer" v-for="order in orders.result" :key="order.id"
             @click="$router.push(`/order/${order.order_number}`)">

          <div class="flex items-center justify-between">
            <p class="text-bold q-mb-none">Заявка №{{order.order_number}}</p>
            <p class="text-bold q-mb-none">{{new Date(order.order_created).toLocaleDateString()}}</p>
          </div>
          <p class="text-bold q-mb-none text-h6 text-blue-7">{{order.object_number}}</p>
          <!--            <span class="text-bold"> {{order.object.client.is_panic ? '**' : ''}}</span>-->
          <p class="q-mb-md text-grey-6">{{order.object_address}} </p>
          <div class="flex items-center justify-between q-mb-md">
            <p class="status q-mb-none" :style="[{color:order.status_text_color},{background:order.status_bg_color}]">
              <span :style="{background:order.status_text_color}" class="status-dot"></span>
              {{order.status_name}}
            </p>
            <p class="q-mb-none text-bold ">{{order.stage_name}}</p>
          </div>




          <div class="bg-grey-3 q-pa-sm q-mb-sm" v-for="time in order.work_times">
            <p class="no-margin">{{time.user_role}} {{time.user_fio}}</p>
            <p class="no-margin">Назначен на {{new Date(time.date).toLocaleDateString()}}</p>
            <p class="no-margin">c {{time.start_time}} до {{time.end_time}}</p>
            <p class="no-margin">{{time.time_type}}</p>
          </div>

        </div>
        <div style="height: 100vh" class=" full-width relative-position" v-else>
          <q-inner-loading showing>
            <q-spinner-gears size="50px" color="primary" />
          </q-inner-loading>
        </div>
      </div>
    </div>


<!--    <pre>-->
<!--      {{orders.result}}-->
<!--    </pre>-->

  </div>

</q-page>
</template>
<script setup>
import {onBeforeMount, ref} from "vue";
import {api} from "boot/axios";

const selected_date = ref(null)
const events = ref([])
const orders = ref([])
const is_loading = ref(false)

onBeforeMount(async ()=>{
  const resp = await api.get(`/api/user/get_work_events`)
  events.value = resp.data.events
})

const dateSelected = async () => {
  is_loading.value = !is_loading.value
  const resp = await api.get(`/api/user/find_by_work_time?date=${selected_date.value.replaceAll('/','-')}`)
  orders.value = resp.data
  is_loading.value = !is_loading.value
}
</script>

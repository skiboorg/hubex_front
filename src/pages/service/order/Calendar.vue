<template>
  <q-page>
    <div class="container">
      <div class="row q-col-gutter-md">
        <div class="col-4">

          <div class="q-gutter-md q-mb-md">
            <q-btn v-for="(role_item,index) in roles"
                   :label="role_item.name"
                   :color="selected_role_index === index ? 'primary' : 'grey-5'"

                   no-caps unelevated
                   @click="user = null, selected_role_index=index, role=role_item"/>
          </div>

          <q-select  outlined v-model="user" class="q-mb-lg"  :options="users.filter(x=>x.role?.name === role?.name)"
                    @update:model-value="userSelected"
                    option-label="fio" label="Выберите пользователя"/>
          <q-date
            v-if="user"
            class="full-width"
            flat
            @click = 'dateSelected'
            v-model="selected_date"
            :events="events"/>
          {{selected_date}}
        </div>
        <div class="col-8">
          <div v-if="!is_loading" class="rounded-box small q-mb-sm" v-for="order in orders.result" :key="order.id"
               @click="$router.push(`/service/order/${order.order_data.order_number}`)">

            <div class="flex items-center justify-between">
              <p class="text-bold q-mb-none">Заявка №{{order.order_data.order_number}}</p>
              <p class="text-bold q-mb-none">{{new Date(order.order_data.order_created).toLocaleDateString()}}</p>
            </div>
            <p class="text-bold q-mb-none text-h6 text-blue-7">{{order.order_data.object_number}}</p>
<!--            <span class="text-bold"> {{order.object.client.is_panic ? '**' : ''}}</span>-->
            <p class="q-mb-md text-grey-6">{{order.order_data.object_address}} </p>
            <div class="flex items-center justify-between q-mb-md">
              <p class="status q-mb-none" :style="[{color:order.order_data.status_text_color},{background:order.order_data.status_bg_color}]">
                <span :style="{background:order.order_data.status_text_color}" class="status-dot"></span>
                {{order.order_data.status_name}}
              </p>
              <p class="q-mb-none text-bold ">{{order.order_data.stage_name}}</p>
            </div>

            <p class="text-bold text-blue-7">{{user?.fio}}</p>


              <div class="bg-grey-3 q-pa-sm q-mb-sm" >
                <p class="no-margin">Назначен на {{new Date(order.date).toLocaleDateString()}}</p>
                <p class="no-margin">c {{order.start_time}} до {{order.end_time}}</p>
                <p class="no-margin">{{order.type.name}}</p>
              </div>

          </div>
          <div style="height: 100vh" class=" full-width relative-position" v-else>
            <q-inner-loading showing>
              <q-spinner-gears size="50px" color="primary" />
            </q-inner-loading>
          </div>

        </div>
      </div>
    </div>
  </q-page>
</template>
<script setup>
import {onBeforeMount, ref} from "vue";
import {api} from "boot/axios";
const role = ref([])
const roles = ref([])
const user = ref(null)
const users = ref([])
const events = ref([])
const time_types = ref([])
const selected_date = ref(null)
const selected_role_index = ref(null)
const is_loading = ref(false)
const orders = ref([])
onBeforeMount(async ()=>{
  await getUsers()
})

const getUsers = async () => {
  const response1 = await api(`/api/user/all`)
  users.value = response1.data
  const response2 = await api(`/api/user/roles`)
  roles.value = response2.data
  const response3 = await api(`/api/user/time_types`)
  time_types.value = response3.data
}
const userSelected = () => {
  events.value = []
  if (user.value.work_time?.length>0){
    user.value.work_time.forEach((el)=>{
      events.value.push(el.date.replaceAll('-','/'))
    })
  }

}

const dateSelected = async () => {
  is_loading.value = !is_loading.value
  orders.value = []
  console.log(selected_date.value)
  const response = await api(`/api/user/find_worker_time_for_calendar?user_id=${user.value.id}&date=${selected_date.value}`)
  orders.value = response.data
  console.log(response.data)
  is_loading.value = !is_loading.value
}
</script>

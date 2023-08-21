<template>
  <q-page>
    <div class="container">
      <div class="row q-col-gutter-md">
        <div class="col-6">
          <q-select outlined v-model="role" class="q-mb-md"
                    @update:model-value="user=null"
                    :options="roles" option-label="name" label="Выберите роль"/>
        </div>
        <div class="col-6">
          <q-select outlined v-model="user" class="q-mb-lg"  :options="users.filter(x=>x.role?.name === role?.name)"
                    @update:model-value="userSelected"
                    option-label="fio" label="Выберите пользователя"/>
        </div>
      </div>


      <div class="row q-col-gutter-md" v-if="user">
        <div class="col-3">
          <q-date
            class="full-width"
            flat
            @update:modelValue = 'dateSelected'
            v-model="selected_date"
            :events="events"/>
        </div>
        <div class="col-9 ">
          <div v-if="!is_loading" class="rounded-box small q-mb-sm" v-for="order in orders" :key="order.id"
               @click="$router.push(`/order/${order.number}`)">

            <div class="flex items-center justify-between">
              <p class="text-bold q-mb-none">Заявка №{{order.number}}</p>
              <p class="text-bold q-mb-none">{{new Date(order.date_created_at).toLocaleDateString()}}</p>
            </div>
            <p class="text-bold q-mb-none text-h6 text-blue-7">{{order.object.number}}</p>
            <p class="q-mb-md text-grey-6">{{order.object.address}} <span class="text-bold"> {{order.object.client.is_panic ? '**' : ''}}</span></p>
            <div class="flex items-center justify-between q-mb-md">
              <p class="status q-mb-none" :style="[{color:order.status?.text_color},{background:order.status?.bg_color}]">
                <span :style="{background:order.status?.text_color}" class="status-dot"></span>
                {{order.status?.name}}
              </p>
              <p class="q-mb-none text-bold ">{{order.stage.name}}</p>
            </div>

            <p class="text-bold text-blue-7">{{user.fio}}</p>

            <div  class="" v-if="order.users.find(x=>x.login === user.login).work_time.length>0">

              <div class="bg-grey-3 q-pa-sm q-mb-sm" v-for="item in order.users.find(x=>x.login === user.login).work_time">
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
  const response = await api(`/api/data/order_by_worker_calendar/${user.value.id}`)
  orders.value = response.data
  console.log(response.data)
  is_loading.value = !is_loading.value
}
</script>

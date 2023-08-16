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
            flat
            v-model="selected_date"
            :events="events"/>
        </div>
        <div class="col-9">
          <div v-for="item in user.work_time.filter(x=>x.start.split('T')[0].replaceAll('-','/')===selected_date)" :key="item.id">
            <p>{{new Date(item.start).toLocaleDateString()}} {{item.title}} {{item.type?.name}} c {{new Date(item.start).toLocaleTimeString()}} до {{new Date(item.end).toLocaleTimeString()}}</p>
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
      events.value.push(el.start.split('T')[0].replaceAll('-','/'))
    })
  }

}
</script>

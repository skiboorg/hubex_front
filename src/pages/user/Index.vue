<template>
  <q-page >
    <div class="rounded-box q-mb-lg">
      <div class="page-search">
        <p class="no-margin title text-bold">Cотрудники <span class="text-grey-6">{{users.length}}</span></p>
    <q-space/>
        <q-btn unelevated class="btn-bg">
         <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
<path d="M9.5 14C11.1569 14 12.5 15.3431 12.5 17C12.5 18.6568 11.1569 20 9.5 20C7.84315 20 6.5 18.6568 6.5 17C6.5 15.3431 7.84315 14 9.5 14Z" fill="#ECECF0" stroke="#11173E" stroke-width="2"/>
<path d="M14.5 3.99998C12.8431 3.99998 11.5 5.34312 11.5 6.99998C11.5 8.65683 12.8431 9.99998 14.5 9.99998C16.1569 9.99998 17.5 8.65683 17.5 6.99998C17.5 5.34312 16.1569 3.99998 14.5 3.99998Z" fill="#ECECF0" stroke="#11173E" stroke-width="2"/>
<path opacity="0.21" d="M13 17L22 17" stroke="#11173E" stroke-width="2" stroke-linecap="round"/>
<path opacity="0.21" d="M11 7L2 6.9585" stroke="#11173E" stroke-width="2" stroke-linecap="round"/>
<path opacity="0.21" d="M2 17L6 17" stroke="#11173E" stroke-width="2" stroke-linecap="round"/>
<path opacity="0.21" d="M22 7L18 7" stroke="#11173E" stroke-width="2" stroke-linecap="round"/>
</svg>

        </q-btn>
        <q-btn @click="$router.push('/users/add')" label="Добавить сотрудника" icon="add" color="primary" unelevated no-caps/>
      </div>

    </div>
    <div class="rounded-box">
      <div class="q-mb-lg" v-for="role in roles" :key="role.id">
        <p class="title text-bold ">{{role.name}} <span class="text-grey-6">{{users.filter(x=>x.role.name === role.name).length}}</span></p>

        <div class="row q-col-gutter-md">
          <div class="col-12 col-md-3" v-for="user in users.filter(x=>x.role.name === role.name)" :key="user.id">
            <UserCard :user="user"  @click="$router.push(`/users/${user.uuid}`)"/>
          </div>
        </div>

      </div>

    </div>
  </q-page>
</template>
<script setup>

import {onBeforeMount, ref} from "vue";
import {api} from "boot/axios";
import UserCard from "components/UserCard.vue";
const roles = ref([])
const users = ref([])
onBeforeMount(async ()=>{
  await getUsers()
  const response = await api(`/api/user/roles`)
  roles.value = response.data

})
const getUsers = async () => {
  const response = await api(`/api/user/all`)
  users.value = response.data
}
</script>

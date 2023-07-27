<template>
  <q-page >
    <div class="rounded-box q-mb-lg">
      <div class="page-search">
        <p class="no-margin title text-bold">Cотрудники <span class="text-grey-6">{{users.length}}</span></p>
    <q-space/>


        <AddButton icon="add" label="Добавить сотрудника" @click="$router.push('/users/add')"/>
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
import AddButton from "components/AddButton.vue";
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

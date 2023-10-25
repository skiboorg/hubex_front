<template>
  <q-page >

    <div  class="rounded-box q-mb-lg">
      <div class="page-search">
        <p class="no-margin title text-bold">Заказчик <span class="text-grey-6"> {{client.name}}</span></p>
        <q-space/>

        <AddButton icon='edit' label="Редактировать" @click="$router.push(`/service/clients/edit/${client.id}`)"/>

      </div>

    </div>
    <div class="grid">
      <q-card flat  >
        <q-card-section>
          <div class="flex items-center justify-between q-mb-lg">
            <p class="no-margin text-h5 text-bold text-dark">Информация о заказчике</p>
          </div>
          <div class="row bordered-box q-mb-md">
            <p class="col-6 text-grey text-weight-medium">Название</p>
            <p class="col-6 text-dark text-weight-medium">{{client.name}}</p>

            <p class="col-6 text-grey text-weight-medium ">Дилер:</p>
            <p class="col-6 text-dark text-weight-medium ">{{client.dealer ? 'Да' : 'Нет'}}</p>
            <p class="col-6 text-grey text-weight-medium ">Капризный:</p>
            <p class="col-6 text-dark text-weight-medium ">{{client.is_panic ? 'Да' : 'Нет'}}</p>
            <p class="col-6 text-grey text-weight-medium ">Физ. лицо:</p>
            <p class="col-6 text-dark text-weight-medium ">{{client.fiz ? 'Да' : 'Нет'}}</p>


            <div class="col-12">
              <div class="separator"></div>
            </div>
            <p class="col-6 text-grey text-weight-medium q-mb-none">Комментарий:</p>
            <p class="col-6 text-dark text-weight-medium q-mb-none" >{{client.comment}}</p>

          </div>
          <div class="flex items-center justify-between q-mb-lg">
            <p class="no-margin text-h5 text-bold text-dark">Объекты</p>

          </div>
          <div class="row bordered-box q-mb-md" v-for="object in client.objects" :key="object.id">
            <p class="col-6 text-grey text-weight-medium">Номер</p>
            <p class="col-6 text-dark text-weight-medium">{{object.number}}</p>
            <p class="col-6 text-grey text-weight-medium q-mb-none">Адрес</p>
            <p class="col-6 text-dark text-weight-medium q-mb-none  cursor-pointer">
              <router-link class="table_link" :to="`/service/object/${object.id}`">{{object.address}}</router-link> </p>
          </div>

        </q-card-section>
      </q-card>
      <q-card flat  >
        <q-card-section>
          <div class="flex items-center justify-between q-mb-lg">
            <p class="no-margin text-h5 text-bold text-dark">Контакты</p>
          </div>
          <div class="row bordered-box q-mb-md" v-for="contact in client.contacts" :key="contact.id">
            <p class="col-6 text-grey text-weight-medium">Имя</p>
            <p class="col-6 text-dark text-weight-medium">{{contact.name}}</p>
            <p class="col-6 text-grey text-weight-medium">Телефон</p>
            <p class="col-6 text-dark text-weight-medium">{{contact.phone}}</p>
            <p class="col-6 text-grey text-weight-medium">Email</p>
            <p class="col-6 text-dark text-weight-medium">{{contact.email}}</p>
            <p class="col-6 text-grey text-weight-medium">КОММЕНТАРИЙ</p>
            <p class="col-6 text-dark text-weight-medium">{{contact.comment}}</p>
            <p class="col-6 text-grey text-weight-medium q-mb-none">Соц сети</p>
            <p class="col-6 text-dark text-weight-medium q-mb-none">{{contact.social}}</p>



          </div>

        </q-card-section>
      </q-card>
    </div>
  </q-page>
</template>
<script setup >
import AddButton from "components/AddButton.vue";
import {api} from "boot/axios";
import {useRoute, useRouter} from "vue-router";
import {onBeforeMount,  ref} from "vue";
const route = useRoute()
const router = useRouter()
const client = ref({})
const is_loading = ref(false)
onBeforeMount(async ()=>{
  await getClient()
})
const getClient = async () => {
  is_loading.value = !is_loading.value
  const response = await api(`/api/data/client/${route.params.id}`)
  client.value = response.data
  is_loading.value = !is_loading.value
}
</script>

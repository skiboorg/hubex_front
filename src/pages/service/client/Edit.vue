<template>
  <q-page>
    <div class="rounded-box q-mb-lg">
      <div class="page-search">
        <q-btn @click="$router.back()" label="Назад"  icon="arrow_back" color="primary" outline unelevated no-caps/>
        <p class="no-margin title text-bold col-grow">Добавление заказчика</p>

      </div>
    </div>
    <div class="rounded-box">
      <q-form @submit="formSubmit" class="row q-col-gutter-md">
        <div class="col-12 ">

          <q-input outlined v-model="client.name"  label="ФИО\Название"
                   lazy-rules
                   :rules="[ val => val !== null && val !== ''  || 'Это обязательное поле']"
          />

          <q-input outlined v-model="client.comment" type="textarea"  label="Комментарий"/>
          <q-toggle v-model="client.fiz" label="Физ. лицо"/>
          <q-toggle v-model="client.dealer" label="Дилер"/>
          <q-toggle v-model="client.is_panic" label="Капризный"/>
        </div>


        <div class="col-12">
          <q-btn label="Добавить контакт" class="q-mb-md" no-caps unelevated outline color="primary" rounded @click="contactAction('add',null)"/>
          <div class="row q-col-gutter-md q-mb-md" v-for="(contact,index) in client_contacts" :key="index">
            <div class="col-6">
              <q-input dense outlined v-model="client_contacts[index].name" label="Имя*"
                       lazy-rules
                       :rules="[ val => val !== null && val !== ''  || 'Это обязательное поле']"
              />
              <q-input dense outlined v-model="client_contacts[index].phone" label="Телефон*"
                       lazy-rules
                       :rules="[ val => val !== null && val !== ''  || 'Это обязательное поле']"
              />
              <q-input dense outlined v-model="client_contacts[index].comment" type="textarea"  label="Комментарий"/>
            </div>
            <div class="col-6">
              <q-input dense outlined v-model="client_contacts[index].email" class="q-mb-md"  label="Email"/>
              <q-input dense outlined v-model="client_contacts[index].social" class="q-mb-md" type="textarea"  label="Соц сети"/>
              <q-btn label="Удалить" no-caps unelevated  color="negative" rounded @click="contactAction('delete',index)"/>
            </div>


          </div>


        </div>
        <div class="col-12">
          <p v-if="error_text" class="text-bold text-negative">{{error_text}}</p>
          <q-btn type="submit" :loading="is_loading" no-caps unelevated color="primary" rounded label="Сохранить пользователя"/>
        </div>
      </q-form>
    </div>
  </q-page>
</template>
<script setup>
import {useNotify} from "src/helpers/notify";
import {api} from "boot/axios";
import {useRoute, useRouter} from "vue-router";
import {onBeforeMount,  ref} from "vue";
const route = useRoute()
const router = useRouter()
const error_text = ref('')
const networks = ref(null)

const is_loading = ref(false)
import {getNetworks} from "src/helpers/useOrder";


const client = ref({
  name: null,
  comment: null,
  fiz: false,
  dealer: false,
  is_panic: false,
})

const client_contacts = ref([])


const contactAction = async  (action,index) => {
  if (action==='add'){
    client_contacts.value.push({
      client_id:client.value.id,
      name:null,
      phone:null,
      email:null,
      comment:null,
      social:null,
      is_new:true
    })
  }
  if (action==='delete'){
    if (!client_contacts.value[index].is_new){
      await api.delete(`/api/data/client_contact/${client_contacts.value[index].id}`)
    }
    client_contacts.value.splice(index,1)
  }
}

const formSubmit = async () => {
  is_loading.value = !is_loading.value
  const response = await api.put(`/api/data/client/${client.value.id}`,{client:client.value,contacts:client_contacts.value})
  await router.back()

  is_loading.value = !is_loading.value


  useNotify('positive','Заказчик успешно обновлен')
}

onBeforeMount(async ()=>{
  await getClient()
})
const getClient = async () => {
  is_loading.value = !is_loading.value
  const response = await api(`/api/data/client/${route.params.id}`)
  client.value = response.data
  client_contacts.value = client.value.contacts
  is_loading.value = !is_loading.value
}
</script>

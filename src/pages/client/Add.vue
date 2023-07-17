<template>
  <q-page>
    <div class="rounded-box q-mb-lg">
      <div class="page-search">
        <q-btn @click="$router.back()"  icon="navigate_before" color="primary" outline unelevated no-caps/>
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
import {onBeforeMount, ref} from "vue";
import {api} from "boot/axios";
import {useRouter} from "vue-router";
const router = useRouter()
const error_text = ref('')
const networks = ref(null)

const is_loading = ref(false)
import {getNetworks} from "src/helpers/useOrder";


const client = ref({
  name: null,
  comment: null,
  fiz: false,
})

const client_contacts = ref([])


const contactAction = (action,index) => {
  if (action==='add'){
    client_contacts.value.push({
      name:null,
      phone:null,
      email:null,
      comment:null,
      social:null,
    })
  }
  if (action==='delete'){
    client_contacts.value.splice(index,1)
  }
}

const formSubmit = async () => {
  is_loading.value = !is_loading.value
  const response = await api.post('/api/data/client',{client:client.value,contacts:client_contacts.value})
  await router.back()

  is_loading.value = !is_loading.value


  useNotify('positive','Заказчик успешно создан')
}
</script>

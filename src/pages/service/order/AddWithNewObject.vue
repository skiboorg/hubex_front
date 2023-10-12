<template>
  <q-page>
    <div class="rounded-box q-mb-lg">
      <div class="page-search">
        <q-btn @click="$router.back()" label="Назад"  icon="arrow_back" color="primary" outline unelevated no-caps/>
        <p class="no-margin title text-bold col-grow">Создание заявки с созданием объекта и оборудования</p>

      </div>
    </div>
    <div class="rounded-box">
      <p class="comment">Время создания заявки фиксируется автоматически. Исполнителей для заявки вы сможете добавить после ее создания</p>

      <q-form @submit.prevent="formSubmit">
        <p class="title text-bold">Новый объект</p>
        <q-input outlined v-model="order.object.number" label="Номер объекта\договора *" lazy-rules
                 :rules="[val => val && val.length > 0 || 'Это обязательное поле']"/>
         <q-input outlined v-model="order.object.address" type="textarea" label="Адрес*" lazy-rules
                                      :rules="[val => val && val.length > 0 || 'Это обязательное поле']"/>
     <q-input outlined v-model="order.object.address_comment" type="textarea" label="Коментатий к адресу" />
        <p class="title text-bold q-mt-md">Оборудование</p>
        <q-select outlined v-model="order.equipment.firm"
                  :options="firms"  option-label="name" label="Выберите фирму"
                  map-options
                  option-value="id"
                  emit-value
                  @update:model-value="getModels"
                  clearable
                  lazy-rules
                  :rules="[ val => val  || 'Это обязательное поле']"
        />
        <q-select outlined v-model="order.equipment.model"
                  :options="models"  option-label="name" label="Выберите модель"
                  map-options
                  option-value="id"
                  emit-value
                  clearable
                  lazy-rules
                  :rules="[ val => val  || 'Это обязательное поле']"
        />



       <q-input outlined v-model="order.equipment.serial_number" label="Серийный номер"
                                              lazy-rules
                                              :rules="[val => val && val.length > 0 || 'Это обязательное поле']"/>
        <q-input outlined v-model="order.equipment.name" label="Название" lazy-rules
                 :rules="[
                val => val && val.length > 0 || 'Это обязательное поле']"/>

        <p class="title text-bold ">Заявка</p>

        <q-select outlined v-model="order.type"
                  :options="types"  option-label="name" label="Выберите тип заявки"
                  map-options
                  option-value="id"
                  emit-value
                  clearable
                  lazy-rules
                  :rules="[ val => val  || 'Это обязательное поле']"
        />
        <q-select outlined v-model="order.work_type"
                  :options="work_types"  option-label="name" label="Выберите тип работы"
                  map-options
                  option-value="id"
                  emit-value
                  class="q-mb-md"
                  clearable
        />



        <q-input outlined type="textarea" v-model="order.comment" label="Коментарий"
                 lazy-rules
                 :rules="[
                val => val && val.length > 0 || 'Это обязательное поле']"
        />

        <q-checkbox v-model="order.is_critical" label="Заявка критичная"/>
        <div class="col-12 flex items-center justify-between q-mb-md">
          <p class="no-margin text-bold text-h6">Файлы</p>
          <q-btn @click="addFile" label="Добавить файл" no-caps unelevated color="primary"/>
        </div>
        <div class="col-12 row q-col-gutter-sm " v-for="(item,index) in files" :key="index">
          <div class="col-6"><q-file  outlined v-model="files[index].file" label="Файл" lazy-rules
                                      :rules="[val => val || 'Это обязательное поле']"/></div>
          <div class="col-5"><q-input  outlined v-model="files[index].text" label="Описание" lazy-rules
                                       :rules="[val => val && val.length > 0 || 'Это обязательное поле']"/>
          </div>
          <div class="col-1"> <q-btn color="negative" class="q-mt-sm" @click="remFile(index)" flat icon="delete"/></div>
        </div>
        <q-btn type="submit" :loading="is_loading" no-caps unelevated color="primary" rounded label="Сохранить заявку"/>


      </q-form>
    </div>
  </q-page>
</template>
<script setup>
import {onBeforeMount, ref, toRaw} from "vue";
import {api} from "boot/axios";
import {useNotify} from "src/helpers/notify";
import {useRouter} from "vue-router";
const files = ref([])
const objects = ref([])
const types = ref([])
const work_types = ref([])
const filtered_objects = ref([])
const is_loading = ref(false)
const equipments = ref([])
const router = useRouter()
const firms = ref([])
const models = ref([])

const order = ref({
  is_critical:false,
  object:{
    number:null,
    comment:null,
    address:null,
    address_comment:null,
  },
  type:null,
  work_type:null,
  equipment : {
    model:null,
    serial_number:null,
    firm:null,
    name:null,
  },
  comment:null,
  need_create_object:true
  //date_dead_line:null,
})

onBeforeMount(async ()=>{
  await getData()
  await getFirm()
})

const getFirm = async () => {
  const resp = await api.get('/api/data/equipment_firm')
  firms.value = resp.data
}
const getModels = async () => {
  const resp = await api.get(`/api/data/equipment_model?firm=${order.value.equipment.firm}`)
  models.value = resp.data
}
const getData = async () => {

  const response1 = await api(`/api/data/order_types`)
  const response2 = await api(`/api/data/order_work_types`)
  types.value = response1.data
  work_types.value = response2.data
  filtered_objects.value = objects.value
}

const remFile = (index) => {
  files.value.splice(index,1)
}
const addFile = async () => {
  files.value.push({
    file:null,
    text:null
  })
}
const getEquipment = async (obj_id) => {
  const response = await api(`/api/data/equipment_by_object?obj_id=${obj_id}`)
  equipments.value = response.data
}

const formSubmit = async () => {
  is_loading.value = !is_loading.value
  let formData = new FormData()
  //order.value.date_dead_line = order.value.date_dead_line.replaceAll('/','-')
  for (let [k,v] of Object.entries(order.value)){
    console.log(k,v)
    formData.append(k,JSON.stringify(v))
  }
  for (let file of files.value){
    formData.append('files',file.file)
    formData.append('descriptions',file.text)
  }

  const response = await api({
    method: "post",
    url: "/api/data/order",
    data: formData,
    headers: { "Content-Type": "multipart/form-data" },
  })
  console.log(response.data)
  useNotify('positive','Заявка успешно создана')
  is_loading.value = !is_loading.value
  await router.back()
}

const filterFn =  (val, update) => {
  if (val === '') {
    update(() => {
      filtered_objects.value = objects.value
      // here you have access to "ref" which
      // is the Vue reference of the QSelect
    })
    return
  }

  update(() => {
    const needle = val.toLowerCase()
    filtered_objects.value = objects.value.filter(v => v.number.includes(needle) || v.address.includes(needle))
  })
}
</script>

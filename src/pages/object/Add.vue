<template>
  <div class="rounded-box q-mb-lg">
    <div class="page-search">
      <q-btn @click="$router.back()" label="Назад" icon="navigate_before" color="primary" outline unelevated no-caps/>
      <p class="no-margin title text-bold col-grow">Добавление объекта</p>


    </div>
  </div>
  {{object}}
  <div class="rounded-box">
    <p class="comment">Lorem ipsum dolor sit amet, consectetur adipisicing elit. Animi error fugiat maiores nam reprehenderit soluta tenetur voluptatibus! Amet consequatur eaque quibusdam recusandae tempora veniam. Fugiat molestias neque quod sint vitae?</p>
    <q-form @submit.prevent="formSubmit">
      <div class="row q-col-gutter-md">
        <div class="col-12 col-md-6"><q-select outlined v-model="object.client"
                                               :options="clients"  option-label="name" label="Выберите клиента"
                                               @filter="filterFn"
                                               map-options
                                               use-input
                                               option-value="id"
                                               input-debounce="0"
                                               emit-value
                                               clearable
                                               lazy-rules
                                               :rules="[ val => val  || 'Это обязательное поле']"
        /></div>
        <div class="col-12 col-md-6"><q-file outlined v-model="image" label="Изображение" /></div>
        <div class="col-12 col-md-6"><q-input outlined v-model="object.name" label="Назвние" /></div>
        <div class="col-12 col-md-6"><q-input outlined v-model="object.number" label="Номер" /></div>
        <div class="col-12 col-md-6"><q-input outlined v-model="object.serial_number" label="Серийный номер" /></div>
        <div class="col-12 col-md-6"> <q-input outlined v-model="object.address" type="textarea" label="Адрес" /></div>
        <div class="col-12 col-md-6"><q-input outlined v-model="object.address_comment" type="textarea" label="Коментатий к адресу" /></div>
      <div class="col-12 flex items-center justify-between ">
        <p class="no-margin text-bold text-h6">Файлы</p>
        <q-btn @click="addFile" label="Добавить файл" no-caps unelevated color="primary"/>
      </div>
        <div class="col-12 row q-col-gutter-md" v-for="(item,index) in files" :key="index">
          <div class="col-6"><q-file  outlined v-model="files[index].file" label="Файл"/></div>
          <div class="col-6"><q-input  outlined v-model="files[index].text" label="Описание"/></div>
        </div>

      </div>







      <!--    <template v-slot:option="scope">-->
      <!--      <q-item v-bind="scope.itemProps">-->
      <!--        <q-item-section>#{{ scope.opt.id }}</q-item-section>-->
      <!--        <q-item-section>{{ scope.opt.name }}</q-item-section>-->


      <!--      </q-item>-->
      <!--    </template>-->
      <!--  </q-select>-->
      <q-btn label="Сохранить" color="positive" type="submit" class="q-mt-lg" unelevated no-caps/>
    </q-form>

  </div>

</template>
<script setup>

import {onBeforeMount, ref} from "vue";
import {api} from "boot/axios";

const clients = ref([])
const files = ref([])
const image = ref(null)
const  object = ref ({
  client:null,
  number:null,
  serial_number:null,
  name:null,
  comment:null,
  address:null,
  address_comment:null,
  contacts:[],

})

onBeforeMount(async ()=>{
  await getUsers()
})

const getUsers = async () => {
  const resp = await api.get('/api/data/client')
  clients.value = resp.data
}
function filterFn (val, update) {
  if (val === '') {
    update( async () => {
      await getUsers()
    })
    return
  }

  update(() => {
    const needle = val.toLowerCase()
    console.log(needle)
    clients.value = clients.value.filter(x=>x.name.toLowerCase().includes(needle))
  })
}
const addFile = async () => {
  files.value.push({
    file:null,
    text:null
  })
}
const formSubmit = async () => {
  let formData = new FormData()
  for (let [k,v] of Object.entries(object.value)){
    console.log(k,v)
    formData.append(k,JSON.stringify(v))
  }
  for (let file of files.value){
    formData.append('files',file.file)
    formData.append('descriptions',file.text)
  }
  if (image.value){
    formData.append('image',image.value)
  }
  console.log(formData)
  const response = await api({
    method: "post",
    url: "/api/data/object",
    data: formData,
    headers: { "Content-Type": "multipart/form-data" },
  })
  console.log(response.data)
}
</script>

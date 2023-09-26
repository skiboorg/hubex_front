<template>
  <div class="rounded-box q-mb-lg">
    <div class="page-search">
      <q-btn @click="$router.back()" label="Назад"  icon="arrow_back" color="primary" outline unelevated no-caps/>
      <p class="no-margin title text-bold col-grow">Редактирование объекта {{object.number}}</p>


    </div>
  </div>

  <div class="rounded-box">
    <p class="comment">Lorem ipsum dolor sit amet, consectetur adipisicing elit. Animi error fugiat maiores nam reprehenderit soluta tenetur voluptatibus! Amet consequatur eaque quibusdam recusandae tempora veniam. Fugiat molestias neque quod sint vitae?</p>
    <q-form @submit.prevent="formSubmit">
      <div class="row q-col-gutter-sm">
        <div class="col-12 col-md-6"><q-input outlined v-model="object.number" label="Номер объекта\договора *" lazy-rules
                                              :rules="[val => val && val.length > 0 || 'Это обязательное поле']"/></div>
        <div class="col-12 col-md-6"><q-select outlined v-model="object.client"
                                               :options="clients"  option-label="name" label="Выберите клиента"
                                               @filter="filterFn"
                                               map-options
                                               use-input
                                               option-value="id"
                                               input-debounce="0"
                                               emit-value
                                               clearable
        /></div>
        <!--        <div class="col-12 col-md-6"><q-file outlined v-model="image" label="Изображение" lazy-rules-->
        <!--                                             :rules="[val => val || 'Это обязательное поле']"/></div>-->
        <!--        <div class="col-12 col-md-6"><q-input outlined v-model="object.name" label="Назвние" /></div>-->

        <div class="col-12 col-md-4"><q-input outlined v-model="object.longtitude" label="Долгота" /></div>
        <div class="col-12 col-md-4"><q-input outlined v-model="object.latitude" label="Широта" /></div>
        <div class="col-12 col-md-4"><q-input outlined v-model="object.work_time" label="Часы работы" /></div>


        <div class="col-6 "> <q-input outlined v-model="object.address" type="textarea" label="Адрес*" lazy-rules
                                      :rules="[val => val && val.length > 0 || 'Это обязательное поле']"/></div>
        <div class="col-6 "><q-input outlined v-model="object.address_comment" type="textarea" label="Коментатий к адресу" /></div>
        <div class="col-12"><q-checkbox v-model="object.is_have_other_additional_equipment" label="Стоит чужое дополнительное оборудование"/></div>
        <div class="col-12 flex items-center justify-between q-mb-lg">

          <p class="no-margin text-bold text-h6">Доп. оборудование</p>
          <q-btn @click="addEquipment" label="Добавить" no-caps unelevated color="primary"/>
        </div>

        <div class="col-12 row q-col-gutter-sm q-mb-lg" v-for="(item,index) in equipments" :key="index">

          <div class="col-4" >
            <q-select v-if="item.is_new" outlined v-model="equipments[index].category"
                      :options="object_equipment_categories"  option-label="name" label="Выберите категорию"
                      map-options
                      option-value="id"
                      emit-value
                      @update:model-value="getAddEqModels(index)"
                      clearable
                      lazy-rules
                      :rules="[ val => val  || 'Это обязательное поле']"
            />
            <p class="no-margin text-bold" v-else>{{equipments[index].category}}</p>
          </div>
          <div class="col-4">
            <q-select v-if="item.is_new" outlined v-model="equipments[index].model"
                      :options="object_equipment_models"  option-label="name" label="Выберите модель"
                      map-options
                      option-value="id"
                      emit-value

                      clearable
                      lazy-rules
                      :rules="[ val => val  || 'Это обязательное поле']"
            />
            <p class="no-margin text-bold" v-else>{{equipments[index].model}}</p>
          </div>
          <div class="col-3"><q-input v-if="item.is_new" type="number" outlined v-model="equipments[index].amount" label="Кол-во" lazy-rules
                                      :rules="[val => val && val.length > 0 || 'Это обязательное поле']"/>
            <p class="no-margin text-bold" v-else>{{equipments[index].amount}}</p>
          </div>
          <div class="col-1 text-right"> <q-btn color="negative" class="q-mt-sm" @click="remEquipment(index)" flat icon="delete"/></div>
        </div>


        <div class="col-12 flex items-center justify-between q-mb-lg">
          <p class="no-margin text-bold text-h6">Файлы</p>
          <q-btn @click="addFile" label="Добавить" no-caps unelevated color="primary"/>
        </div>
        <div class="col-12 row q-col-gutter-sm q-mb-lg" v-for="(item,index) in files" :key="index">
          <div class="col-6" v-if="item.is_new"><q-file   outlined v-model="files[index].file" label="Файл" lazy-rules
                                      :rules="[val => val || 'Это обязательное поле']"/></div>
          <div class="text-bold col-6" v-else>Загруженный ранее файл</div>
          <div class="col-5"><q-input :readonly="!item.is_new" outlined v-model="files[index].text" label="Описание" lazy-rules
                                       :rules="[val => val && val.length > 0 || 'Это обязательное поле']"/>
          </div>
          <div class="col-1"> <q-btn color="negative" class="q-mt-sm" @click="remFile(index)" flat icon="delete"/></div>
        </div>
      </div>

      <div class="col-12 flex items-center justify-between q-mb-lg">

        <p class="no-margin text-bold text-h6 ">Контакты</p>
        <q-btn @click="addContact" label="Добавить" no-caps unelevated color="primary"/>
      </div>
      <div class="col-12 row q-col-gutter-sm q-mb-lg" v-for="(item,index) in contacts" :key="index">

        <div class="col-6">
          <q-input  outlined v-model="contacts[index].name" label="ФИО" lazy-rules
                    :rules="[val => val && val.length > 0 || 'Это обязательное поле']"/>
        </div>
        <div class="col-6">
          <q-input  outlined v-model="contacts[index].phone" label="Телефон" lazy-rules
                    :rules="[val => val && val.length > 0 || 'Это обязательное поле']"/>
        </div>
        <div class="col-6">
          <q-input type="textarea" outlined v-model="contacts[index].comment" label="Коментарий" />
        </div>
        <div class="col-6">
          <q-input type="textarea" outlined v-model="contacts[index].social" label="Соц. сети" />
        </div>
        <div class="col-6 q-mt-sm">
          <q-input  outlined v-model="contacts[index].email" label="Email" />
        </div>
        <div class="col-6 q-mt-sm">
          <q-input  outlined v-model="contacts[index].order_num" label="Порядок" />
        </div>


        <div class="col-6 text-right"> <q-btn color="negative" class="q-mt-sm" @click="remContact(index)" flat icon="delete"/></div>
      </div>




      <q-btn label="Сохранить" :loading="is_loading" color="positive" type="submit" class="q-mt-lg" unelevated no-caps/>
    </q-form>

  </div>

</template>
<script setup>

import {onBeforeMount, ref, toRaw} from "vue";
import {api} from "boot/axios";
import {useNotify} from "src/helpers/notify";
import {useRoute, useRouter} from "vue-router";

const is_loading = ref(false)
const clients = ref([])
const object_equipment_models = ref([])
const object_equipment_categories = ref([])
const contacts = ref([])
const equipments = ref([])
const files = ref([])
const image = ref(null)
const router = useRouter()
const route = useRoute()
const  object = ref ({
  client:null,
  number:null,
  longtitude:null,
  latitude:null,
  work_time:null,
  name:null,
  comment:null,
  address:null,
  address_comment:null,
  is_have_other_additional_equipment:false,
  contacts:[],

})

onBeforeMount(async ()=>{
  await getUsers()
  await getAddEqCategories()
  await getObject()
})

const getObject = async () => {
  is_loading.value = !is_loading.value
  const response = await api(`/api/data/object/${route.params.id}`)
  object.value = response.data
  object.value.additional_equipments.forEach((el)=>{

    equipments.value.push({
      category:el.model.category.name,
      model:el.model.name,
      amount:el.amount,
      id:el.id,
      is_new:false
    })
  })

  object.value.files.forEach((el)=>{

    files.value.push({
      file:el.id,
      text:el.text,
      is_new:false,
      id:el.id,
    })
  })

  object.value.contacts.forEach((el)=>{
    contacts.value.push({
      order_num:el.order_num,
      name:el.name,
      phone:el.phone,
      email:el.email,
      comment:el.comment,
      social:el.social,
      is_new:false,
      id:el.id
    })
  })



  is_loading.value = !is_loading.value
}

const getUsers = async () => {
  const resp = await api.get('/api/data/client')
  clients.value = resp.data
}

const getAddEqCategories = async () => {
  const resp = await api.get('/api/data/object_equipment_category')
  object_equipment_categories.value = resp.data
}

const getAddEqModels = async (index) => {
  console.log(equipments.value[index])
  const resp = await api.get(`/api/data/object_equipment_model?c_id=${equipments.value[index].category}`)
  object_equipment_models.value = resp.data
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
    text:null,
    is_new:true
  })
}
const addContact= async () => {
  contacts.value.push({
    order_num:1,
    name:null,
    phone:null,
    email:null,
    comment:null,
    social:null,
    is_new:true,
  })
}

const addEquipment= async () => {
  equipments.value.push({
    category:null,
    model:null,
    amount:null,
    is_new:true,
  })
}
const formSubmit = async () => {
  //is_loading.value = !is_loading.value
  let formData = new FormData()
  for (let [k,v] of Object.entries(object.value)){
    console.log(k,v)
    formData.append(k,JSON.stringify(v))
  }
  for (let file of files.value){
    formData.append('files',file.file)
    formData.append('descriptions',file.text)
  }
  formData.append('contacts',JSON.stringify(contacts.value))
  formData.append('equipments',JSON.stringify(equipments.value))
  // for (let contact of contacts.value){
  //
  // }
  if (image.value){
    formData.append('image',image.value)
  }
  console.log(formData)
  const response = await api({
    method: "post",
    url: `/api/data/object_update?id=${route.params.id}`,
    data: formData,
    headers: { "Content-Type": "multipart/form-data" },
  })
  console.log(response.data)
  // useNotify('positive','Объект успешно создан')
  // await router.back()
  //is_loading.value = !is_loading.value
}

const remFile = async (index) => {
  if (!files.value[index].is_new){
    await api.post('/api/data/object_delete_file',{f_id:files.value[index].id})
  }
  files.value.splice(index,1)
}
const remContact = async (index) => {
  if (!contacts.value[index].is_new){
    await api.post('/api/data/object_delete_contact',{c_id:contacts.value[index].id})
  }
  contacts.value.splice(index,1)
}
const remEquipment = async (index) => {
  if (!equipments.value[index].is_new){
   await api.post('/api/data/object_delete_add_equip',{e_id:equipments.value[index].id})
  }
  equipments.value.splice(index,1)

}
</script>

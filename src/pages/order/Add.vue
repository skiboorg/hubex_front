<template>
  <q-page padding>
    <div class="rounded-box q-mb-lg">
      <div class="page-search">
        <q-btn @click="$router.back()"  icon="navigate_before" color="primary" outline unelevated no-caps/>
        <p class="no-margin title text-bold col-grow">Создание заявки</p>

      </div>
    </div>
   {{order}}<div class="rounded-box">
      <q-form @submit.prevent="formSubmit">
        <q-checkbox v-model="order.is_critical" label="Высокая критичность"/>
        <q-select outlined v-model="order.object"
                  :options="objects"  option-label="name" label="Выберите объект"
                  map-options
                  option-value="id"
                  emit-value
                  clearable
                  @update:model-value = 'getEquipment(order.object)'
                  lazy-rules
                  :rules="[ val => val  || 'Это обязательное поле']"

        />
        <q-select outlined v-model="order.equipment"
                  :options="equipments"  option-label="name" label="Выберите оборудование"
                  map-options
                  option-value="id"
                  emit-value
                  clearable
                  lazy-rules
                  :rules="[ val => val  || 'Это обязательное поле']"
        />
        <q-input outlined type="textarea" v-model="order.comment" label="Коментарий"
                 lazy-rules
                 :rules="[
                val => val && val.length > 0 || 'Это обязательное поле']"
        />
        <q-input outlined v-model="order.date_dead_line" mask="date" :rules="['date']" label="Крайний срок">
          <template v-slot:append>
            <q-icon name="event" class="cursor-pointer">
              <q-popup-proxy cover transition-show="scale" transition-hide="scale">
                <q-date v-model="order.date_dead_line">
                  <div class="row items-center justify-end">
                    <q-btn v-close-popup label="Close" color="primary" flat />
                  </div>
                </q-date>
              </q-popup-proxy>
            </q-icon>
          </template>
        </q-input>
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
const is_loading = ref(false)
const equipments = ref([])
const router = useRouter()
const order = ref({
  is_critical:false,
  object:null,
  equipment:null,
  comment:null,
  date_dead_line:null,
})

onBeforeMount(async ()=>{
  await getObjects()

})
const getObjects = async () => {
  const response = await api(`/api/data/object`)
  objects.value = response.data

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

// const formSubmit = async () => {
//  console.log('sdf')
//   is_loading.value = !is_loading.value
//   order.value.date_dead_line = order.value.date_dead_line.replaceAll('/','-')
//   const response = await api.post(`/api/data/order`,toRaw(order.value))
//   useNotify('positive','Заявка успешно создана')
//   router.back()
//   is_loading.value = !is_loading.value
// }

const formSubmit = async () => {
  is_loading.value = !is_loading.value
  let formData = new FormData()
  order.value.date_dead_line = order.value.date_dead_line.replaceAll('/','-')
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
</script>

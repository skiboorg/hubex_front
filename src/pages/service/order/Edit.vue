<template>
  <q-page>
    <div class="rounded-box q-mb-lg">
      <div class="page-search">
        <q-btn @click="$router.back()" label="Назад"  icon="arrow_back" color="primary" outline unelevated no-caps/>
        <p class="no-margin title text-bold col-grow">Редактирование заявки {{order.number}}</p>

      </div>
    </div>
    <div class="rounded-box">
      <p class="comment">Время создания заявки фиксируется автоматически. Исполнителей для заявки вы сможете добавить после ее создания</p>
      <q-form @submit.prevent="formSubmit">
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

        <q-select outlined v-model="order.object"
                  :options="filtered_objects"  option-label="address" label="Выберите объект"
                  map-options
                  option-value="id"
                  emit-value
                  use-input
                  input-debounce="0"
                  @filter="filterFn"
                  clearable
                  @update:model-value = 'objectChange(order.object)'
                  lazy-rules
                  :rules="[ val => val  || 'Это обязательное поле']"
        >
          <template v-slot:option="scope">
            <q-item v-bind="scope.itemProps">
              <q-item-section side>
                <q-item-label>{{scope.opt.number}}</q-item-label>
                <q-item-label caption>Номер объекта\договора</q-item-label>
              </q-item-section>
              <q-item-section>
                <q-item-label>{{ scope.opt.address }}</q-item-label>
                <q-item-label caption>Адрес</q-item-label>
              </q-item-section>
            </q-item>
          </template>
        </q-select>

        <q-select outlined v-model="order.equipment"
                  :options="equipments"  option-label="serial_number" label="С/Н оборудования"
                  map-options
                  option-value="id"
                  emit-value
                  class="q-mb-md"
                  clearable

        />
<!--        lazy-rules-->
<!--        :rules="[ val => val  || 'Это обязательное поле']"-->
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
        <q-checkbox v-model="order.is_critical" label="Заявка критичная"/>
        <div class="col-12 flex items-center justify-between q-mb-md">
          <p class="no-margin text-bold text-h6">Файлы</p>
          <q-btn @click="addFile" label="Добавить файл" no-caps unelevated color="primary"/>
        </div>
        <div class="col-12 row q-col-gutter-sm " v-for="(item,index) in files" :key="index">
          <div class="col-6">
            <q-file v-if="item.is_new" outlined v-model="files[index].file" label="Файл" lazy-rules
                                      :rules="[val => val || 'Это обязательное поле']"/>
            <div class="text-bold" v-else>Загруженный ранее файл</div>
          </div>
          <div class="col-5"><q-input :readonly="!item.is_new" outlined v-model="files[index].text" label="Описание" lazy-rules
                                       :rules="[val => val && val.length > 0 || 'Это обязательное поле']"/>
          </div>
          <div class="col-1"> <q-btn color="negative" class="q-mt-sm" @click="remFile(index,item)" :loading="is_loading" flat icon="delete"/></div>
        </div>

        <q-btn type="submit" :loading="is_loading" no-caps unelevated color="primary" rounded label="Сохранить заявку"/>


      </q-form>
    </div>
  </q-page>
</template>
<script setup>
import {onBeforeMount, ref, toRaw} from "vue";
import {useRoute, useRouter} from "vue-router";
import {api} from "boot/axios";
import {useNotify} from "src/helpers/notify";

const files = ref([])
const objects = ref([])
const types = ref([])
const work_types = ref([])
const filtered_objects = ref([])
const is_loading = ref(false)
const equipments = ref([])
const router = useRouter()
const route = useRoute()
const order = ref({
  is_critical:false,
  object:null,
  type:null,
  work_type:null,
  equipment:null,
  comment:null,
  //date_dead_line:null,
})

onBeforeMount(async ()=>{
  await getItem()
  await getObjects()


})

const getItem = async () => {
  is_loading.value = !is_loading.value
  const response = await api(`/api/data/order/${route.params.number}?full=true`)
  order.value = response.data
  console.log(order.value)
  is_loading.value = !is_loading.value
  await getEquipment(order.value.object.id)
  order.value.type = order.value.type.id
  order.value.work_type = order.value.work_type ? order.value.work_type.id : null
  order.value.object = order.value.object.id

  order.value.equipment = order.value.equipment ? order.value.equipment.id : null
  order.value.files?.forEach((file)=>{
    files.value.push({
      file:file.id,
      text:file.text,
      is_new:false
    })
  })
}
const getObjects = async () => {
  console.log('sss')
  const response = await api(`/api/data/object`)
  const response1 = await api(`/api/data/order_types`)
  const response2 = await api(`/api/data/order_work_types`)
  objects.value = response.data
  types.value = response1.data
  work_types.value = response2.data
  filtered_objects.value = objects.value
}
const remFile = async  (index,item) => {
  if (item.is_new){
    files.value.splice(index,1)
  }
  else {
    is_loading.value= !is_loading.value
    await api.delete(`/api/data/order_delete_file/${item.file}`)
    await getItem()
    files.value = []
    is_loading.value= !is_loading.value
  }

}
const addFile = async () => {
  files.value.push({
    file:null,
    text:null,
    is_new:true
  })
}
const objectChange = async (obj_id) => {
  order.value.equipment = null
  await getEquipment(obj_id)
}
const getEquipment = async (obj_id) => {

  const response = await api(`/api/data/equipment_by_object?obj_id=${obj_id}`)
  equipments.value = response.data
}

const formSubmit = async () => {
  is_loading.value = !is_loading.value
  let formData = new FormData()
  order.value.date_dead_line = order.value.date_dead_line.replaceAll('/','-')
  delete order.value.date_assign_worker
  // delete order.value.date_dead_line
  delete order.value.date_done
  delete order.value.date_created_at
  delete order.value.users
  delete order.value.uuid
  delete order.value.status
  delete order.value.number
  delete order.value.is_done
  delete order.value.is_created_by_client
  delete order.value.stage
  delete order.value.id

  for (let [k,v] of Object.entries(order.value)){
    console.log(k,v)
    formData.append(k, JSON.stringify(v))
  }
  for (let file of files.value.filter(x=>x.is_new)){
    formData.append('files',file.file)
    formData.append('descriptions',file.text)
  }

  const response = await api({
    method: "post",
    url: `/api/data/order_update?number=${route.params.number}`,
    data: formData,
    headers: { "Content-Type": "multipart/form-data" },
  })
  console.log(response.data)
  useNotify('positive','Заявка успешно сохранена')
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

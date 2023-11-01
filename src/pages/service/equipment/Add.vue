<template>
  <q-page >
    <div class="rounded-box q-mb-lg">
      <div class="page-search">
        <q-btn @click="$router.back()" label="Назад"  icon="arrow_back" color="primary" outline unelevated no-caps/>
        <p class="no-margin title text-bold col-grow">Добавление оборудования</p>

      </div>

    </div>
    <div class="rounded-box">


      <q-form @submit.prevent="formSubmit">
        <q-select outlined v-model="equipment.firm"
                  :options="firms"  option-label="name" label="Выберите фирму*"
                  map-options
                  option-value="id"
                  emit-value
                  @update:model-value="getModels"
                  clearable
                  lazy-rules
                  :rules="[ val => val  || 'Это обязательное поле']"
        />
        <q-select outlined v-model="equipment.model"
                  :options="models"  option-label="name" label="Выберите модель*"
                  map-options
                  option-value="id"
                  emit-value
                  clearable
                  lazy-rules
                  :rules="[ val => val  || 'Это обязательное поле']"
        />

        <q-select outlined v-model="equipment.object"
                  :options="objects"
                  option-label="address"  label="Выберите объект*"
                  @filter="filterFn"
                  use-input
                  map-options
                  hide-selected
                  :loading="is_loading"
                  fill-input

                  debounce="10"
                  option-value="id"
                  emit-value
                  clearable
                  lazy-rules
                  :rules="[ val => val  || 'Это обязательное поле']"
        >
          <template v-slot:option="scope">
            <q-item v-bind="scope.itemProps">
              <q-item-section side>
                <q-item-label>{{ scope.opt.number }}</q-item-label>

              </q-item-section>
              <q-item-section>
                <q-item-label>{{ scope.opt.address }}</q-item-label>
              </q-item-section>
            </q-item>
          </template>
        </q-select>
        <div class="col-12 col-md-6"><q-input outlined v-model="equipment.serial_number" label="Серийный номер*"
                                              lazy-rules
                                              :rules="[val => val && val.length > 0 || 'Это обязательное поле']"/>
        </div>
<!--        <div class="col-12 col-md-6"><q-input outlined v-model="equipment.name" label="Название" lazy-rules-->
<!--                                              :rules="[-->
<!--                val => val && val.length > 0 || 'Это обязательное поле']"/></div>-->
        <div class="col-12 col-md-6 q-mb-md"> <q-input outlined v-model="equipment.comment" type="textarea" label="Коментарий" /></div>
        <div class="col-12" >
          <q-input  outlined v-model="equipment.date_in_work"
                      label="Дата отгрузки">
            <template v-slot:append>
              <q-icon name="event" class="cursor-pointer">
                <q-popup-proxy cover transition-show="scale" transition-hide="scale">
                  <q-date v-model="equipment.date_in_work" mask="DD-MM-YYYY">
                    <div class="row items-center justify-end">
                      <q-btn v-close-popup label="Close" color="primary" flat />
                    </div>
                  </q-date>
                </q-popup-proxy>
              </q-icon>
            </template>
          </q-input>
        </div>
        <div class="col-12"><q-checkbox v-model="equipment.is_service_book_sign" label="Подписана сервисная книжка"/></div>
        <div class="col-12" v-if="equipment.is_service_book_sign">
          <q-input  outlined v-model="equipment.service_book_sign_date"
                                                                              :rules="['date']" label="Дата подписания сервисной книжки">
          <template v-slot:append>
            <q-icon name="event" class="cursor-pointer">
              <q-popup-proxy cover transition-show="scale" transition-hide="scale">
                <q-date v-model="equipment.service_book_sign_date" mask="DD-MM-YYYY">
                  <div class="row items-center justify-end">
                    <q-btn v-close-popup label="Close" color="primary" flat />
                  </div>
                </q-date>
              </q-popup-proxy>
            </q-icon>
          </template>
        </q-input>
        </div>
        <div class="col-12"><q-checkbox v-model="equipment.is_warranty" label="На гарантии"/></div>
        <div class="col-12" v-if="equipment.is_warranty"> <q-input  outlined v-model="equipment.warranty_ends"  :rules="['date']" label="Срок гарантии">
          <template v-slot:append>
            <q-icon name="event" class="cursor-pointer">
              <q-popup-proxy cover transition-show="scale" transition-hide="scale">
                <q-date v-model="equipment.warranty_ends" mask="DD-MM-YYYY">
                  <div class="row items-center justify-end">
                    <q-btn v-close-popup label="Close" color="primary" flat />
                  </div>
                </q-date>
              </q-popup-proxy>
            </q-icon>
          </template>
        </q-input></div>



        <q-btn label="Сохранить" :loading="is_loading" color="positive" type="submit" class="q-mt-lg" unelevated no-caps/>
      </q-form>

    </div>
  </q-page>
</template>

<script setup>
import {onBeforeMount, ref} from "vue";
import {api} from "boot/axios";
import {useNotify} from "src/helpers/notify";
import {useRouter} from "vue-router";

const router = useRouter()
const firms = ref([])
const models = ref([])
const objects = ref([])
const is_loading = ref(false)

const equipment = ref({
  model:null,
  serial_number:null,
  firm:null,
  object:null,
  name:'',
  comment:null,
  is_warranty:false,
  is_service_book_sign:false,
  warranty_ends:null,
  service_book_sign_date:null,
  date_in_work:null
})

onBeforeMount(async ()=>{
  await getFirm()
  //await getObjects()

})

const getFirm = async () => {
  const resp = await api.get('/api/data/equipment_firm')
  firms.value = resp.data
}
const getModels = async () => {
  const resp = await api.get(`/api/data/equipment_model?firm=${equipment.value.firm}`)
  models.value = resp.data
}

const getObjects = async () => {
  const response = await api(`/api/data/object`)
  objects.value = response.data
}

const normalizeDate = (date) => {
  let temp = date.split('-')
  return `${temp[2]}-${temp[1]}-${temp[0]}`
}

const formSubmit = async () => {
  is_loading.value = !is_loading.value
  if (equipment.value.date_in_work){
    equipment.value.date_in_work = normalizeDate(equipment.value.date_in_work)
  }

  if(equipment.value.is_warranty){
    equipment.value.warranty_ends = normalizeDate(equipment.value.warranty_ends)

  }
  if(equipment.value.service_book_sign_date){
    equipment.value.service_book_sign_date = normalizeDate(equipment.value.service_book_sign_date)
  }
  const data = equipment.value
  await api.post(`/api/data/equipment`, data)
  useNotify('positive','Оборудовние добавлено ')
  // equipment.value = {
  //   model:null,
  //   serial_number:null,
  //   firm:null,
  //   object:null,
  //   name:null,
  //   comment:null,
  // }
  await router.back()
  is_loading.value = !is_loading.value
}

function filterFn  (val, update) {


  update(async () => {
    if(val){
      is_loading.value=!is_loading.value
      const needle = val.toLowerCase()
      const response = await api(`/api/data/object?q=${val}&page_size=10000`)
      console.log(response.data)
      objects.value = response.data.results
      is_loading.value=!is_loading.value
    }


  })
}
</script>

<template>
  <q-page >
    <div class="rounded-box q-mb-lg">
      <div class="page-search">
        <q-btn @click="$router.back()" label="Назад" icon="navigate_before" color="primary" outline unelevated no-caps/>
        <p class="no-margin title text-bold col-grow">Добавление оборудования</p>

      </div>
{{equipment}}
    </div>
    <div class="rounded-box">
      <q-form @submit.prevent="formSubmit">
        <q-select outlined v-model="equipment.model"
                  :options="models"  option-label="name" label="Выберите модель"
                  map-options
                  option-value="id"
                  emit-value
                  clearable
                  lazy-rules
                  :rules="[ val => val  || 'Это обязательное поле']"
        />
        <q-select outlined v-model="equipment.firm"
                  :options="firms"  option-label="name" label="Выберите фирму"
                  map-options
                  option-value="id"
                  emit-value
                  clearable
                  lazy-rules
                  :rules="[ val => val  || 'Это обязательное поле']"
        />
        <q-select outlined v-model="equipment.object"
                  :options="objects"  option-label="name" label="Выберите объект"
                  map-options
                  option-value="id"
                  emit-value
                  clearable
                  lazy-rules
                  :rules="[ val => val  || 'Это обязательное поле']"
        />
        <div class="col-12 col-md-6"><q-input outlined v-model="equipment.name" label="Название" /></div>
        <div class="col-12 col-md-6"> <q-input outlined v-model="equipment.comment" type="textarea" label="Коментарий" /></div>
        <q-btn label="Сохранить" color="positive" type="submit" class="q-mt-lg" unelevated no-caps/>
      </q-form>
    </div>
  </q-page>
</template>

<script setup>
import {onBeforeMount, ref} from "vue";
import {api} from "boot/axios";

const firms = ref([])
const models = ref([])
const objects = ref([])

const equipment = ref({
  model:null,
  firm:null,
  object:null,
  name:null,
  comment:null,
})

onBeforeMount(async ()=>{
  await getFirm()
  await getModel()
  await getObjects()

})

const getFirm = async () => {
  const resp = await api.get('/api/data/equipment_firm')
  firms.value = resp.data
}
const getModel = async () => {
  const resp = await api.get('/api/data/equipment_model')
  models.value = resp.data
}

const getObjects = async () => {
  const response = await api(`/api/data/object`)
  objects.value = response.data
}

const formSubmit = async () => {
  const data = equipment.value
  await api.post(`/api/data/equipment`, data)
}


</script>

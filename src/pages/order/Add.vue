<template>
  <q-page padding>
    <div class="rounded-box q-mb-lg">
      <div class="page-search">
        <q-btn @click="$router.back()" label="Назад" icon="navigate_before" color="primary" outline unelevated no-caps/>
        <p class="no-margin title text-bold col-grow">Создание заявки</p>

      </div>
    </div>
   {{order}}<div class="rounded-box">
      <q-form @submit.prevent="formSubmit">
        <q-input outlined v-model="order.number" label="Номер" lazy-rules
                 :rules="[
              val => val && val.length > 0 || 'Это обязательное поле']"/>
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
        <q-input outlined type="textarea" v-model="order.comment" label="Коментарий" lazy-rules
                 :rules="[
              val => val && val.length > 0 || 'Это обязательное поле']"/>
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

const objects = ref([])
const is_loading = ref(false)
const equipments = ref([])
const router = useRouter()
const order = ref({
  number:null,
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

const getEquipment = async (obj_id) => {
  const response = await api(`/api/data/equipment_by_object?obj_id=${obj_id}`)
  equipments.value = response.data
}

const formSubmit = async () => {
 console.log('sdf')
  is_loading.value = !is_loading.value
  order.value.date_dead_line = order.value.date_dead_line.replaceAll('/','-')
  const response = await api.post(`/api/data/order`,toRaw(order.value))
  useNotify('positive','Заявка успешно создана')
  router.back()
  is_loading.value = !is_loading.value

}
</script>

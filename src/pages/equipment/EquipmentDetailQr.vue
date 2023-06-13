<template>

  <q-page class="full-height">

    <div v-if="item.model" class="item-container full-height flex column items-center justify-center">



      <q-img :src="item.model?.image"/>
      <p>Модель оборудования: {{item.model?.name}}</p>
      <p>Серийный номер: {{item.serial_number}}</p>
      <p>Количество заявок: {{item.orders.length}}</p>
      <div class="row q-col-gutter-md full-width">
        <div class="col-12 col-md-6"> <q-btn no-caps unelevated color="positive" class="full-width" label="СОЗДАТЬ ЗАЯВКУ"/></div>
        <div class="col-12 col-md-6"> <q-btn no-caps unelevated color="dark" class="full-width" label="ПЕРЕЙТИ В ТЕЛЕГРАМ"/></div>


      </div>

    </div>
    <div v-else class="fullscreen relative-position">
      <q-inner-loading showing>
        <q-spinner size="50px" color="primary" />
      </q-inner-loading>
    </div>
  </q-page>
</template>
<script setup>
import {api} from "boot/axios";
import {useRoute, useRouter} from "vue-router";
import {onBeforeMount, onMounted, ref} from "vue";
const route = useRoute()
const router = useRouter()
const item = ref({})
const is_loading = ref(false)
const addDialog = ref(false)
const remDialog = ref(false)

const remove_data = ref({
  text:null,
  amount:null,
  is_remove:false
})

const add_data = ref({
  text:null,
  amount:null
})

onBeforeMount(async ()=>{
  await getItem()
})

const add_remove =  async () => {
  is_loading.value = !is_loading.value

  const response = await api.post(`/api/data/product/add_remove`,{data:remove_data.value, id:item.value.id})
  await getItem()
  remDialog.value = false
  remove_data.value.amount = null
  remove_data.value.text = null
  is_loading.value = !is_loading.value
}

const add_supply =  async () => {
  is_loading.value = !is_loading.value
  const response = await api.post(`/api/data/product/add_supply`,{data:add_data.value,id:item.value.id})
  await getItem()
  addDialog.value = false
  add_data.value.amount = null
  add_data.value.text = null
  is_loading.value = !is_loading.value
}

const getItem = async () => {
  is_loading.value = !is_loading.value
  const response = await api(`/api/data/equipment/${route.params.serial_number}`)
  item.value = response.data
  is_loading.value = !is_loading.value
}
</script>
<style lang="sass">
.item-container
  max-width: 768px
  margin: 0 auto
  padding: 0 10px
</style>

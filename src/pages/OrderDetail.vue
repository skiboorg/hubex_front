<template>
<q-page>
  <div v-if="item.type">
    <div class="rounded-box q-mb-lg">
      <div class="page-search">
        <q-btn @click="$router.back()" label="Назад" icon="navigate_before" color="primary" outline unelevated no-caps/>
        <p class="no-margin title text-bold col-grow">Заявка №{{item.number}} от {{new Date(item.date_created_at).toLocaleDateString()}}</p>

        <q-btn label="Редактировать" icon="edit" color="primary" unelevated no-caps/>
      </div>
    </div>
    <div class="rounded-box">

      <q-card flat bordered class="q-mb-md">
        <q-card-section>
          <div class="row">
            <div class="col-3 text-grey">Номер заявки:</div>
            <div class="col-9">{{item.number}}</div>
            <div class="col-3 text-grey">Тип:</div>
            <div class="col-9">{{item.type.name}}</div>

            <div class="col-3 text-grey">Статус::</div>
            <div class="col-9">{{item.status.name}}</div>

            <div class="col-3 text-grey">Вид работ::</div>
            <div class="col-9">{{item.work_type.name}}</div>
          </div>
        </q-card-section>

      </q-card>
      <q-card flat bordered>
        <q-card-section>
          <div class="row">
            <div class="col-3 text-grey">Объект:</div>
            <div class="col-9">{{item.object.name}}</div>
            <div class="col-3 text-grey">Оборудование:</div>
            <div class="col-9">{{item.equipment.name}}</div>


          </div>
        </q-card-section>
      </q-card>
    </div>
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

const getItem = async () => {
  is_loading.value = !is_loading.value
  const response = await api(`/api/data/order/${route.params.number}`)
  item.value = response.data
  is_loading.value = !is_loading.value
}
</script>

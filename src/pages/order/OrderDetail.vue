<template>
<q-page>
  <div v-if="item">
    <div class="rounded-box q-mb-lg">
      <div class="page-search">
        <q-btn @click="$router.back()" label="Назад" icon="navigate_before" color="primary" outline unelevated no-caps/>
        <p class="no-margin title text-bold col-grow">Заявка №{{item.number}} от {{new Date(item.date_created_at).toLocaleDateString()}}</p>

        <q-btn label="Редактировать" icon="edit" color="primary" unelevated no-caps/>
      </div>
    </div>
    <div class="rounded-box">

      <q-card flat bordered class="q-mb-md br10">
        <q-card-section>
          <div class="row">
            <p class="col-3 text-grey">Номер заявки:</p>
            <p class="col-9 text-dark text-bold">{{item.number}}</p>
            <p class="col-3 text-grey">Тип:</p>
            <p class="col-9 text-dark text-bold">{{item.type.name}}</p>
            <p class="col-3 text-grey">Этап:</p>
            <p class="col-9 text-dark text-bold">{{item.stage.name}}</p>

            <p class="col-3 text-grey">Статус:</p>
            <p class="col-9"><span class="status" :style="[{color:item.status.text_color},{background:item.status.bg_color}]">{{item.status.name}}</span></p>

            <p class="col-3 text-grey no-margin">Критичность:</p>
            <p class="col-9 text-dark text-bold no-margin" :class="{'text-negative':item.is_critical}">{{item.is_critical ? 'Высокая' : 'Обычная'}}</p>
          </div>
        </q-card-section>
      </q-card>
      <q-card flat bordered class=" q-mb-md br10">
        <q-card-section>
          <div class="row">
            <p class="col-3 text-grey">Объект:</p>
            <p class="col-9 ext-dark text-bold">{{item.object.name}}</p>
            <p class="col-3 text-grey no-margin">Оборудование:</p>
            <p class="col-9 ext-dark text-bold no-margin">{{item.equipment.name}}</p>
          </div>
        </q-card-section>
      </q-card>
      <q-card flat bordered class=" q-mb-md br10">
        <q-card-section>
          <div class="row">
            <div v-if="item.users.length>0" class="row col-12">
              <p class="col-3 text-grey">Исполнители:</p>
              <p class="col-9 ext-dark text-bold">{{item.users}}</p>
            </div>
            <div v-else class="row col-12">
              <p class="col-3 text-grey">Исполнители:</p>
              <p class="col-9 ext-dark text-bold"><q-btn label="Назначить"  color="primary" unelevated no-caps/></p>
            </div>
            <p class="col-3 text-grey">Дата создания заявки:</p>
            <p class="col-9 ext-dark text-bold">{{new Date(item.date_created_at).toLocaleDateString()}}</p>
            <p class="col-3 text-grey">Дата назанчения исполнителя:</p>
            <p class="col-9 ext-dark text-bold">{{new Date(item.date_assign_worker).toLocaleDateString()}}</p>
            <p class="col-3 text-grey">Срок выполнения заявки:</p>
            <p class="col-9 ext-dark text-bold">{{new Date(item.date_done).toLocaleDateString()}}</p>

            <p class="col-3 text-grey">Крайний срок:</p>
            <p class="col-9 ext-dark text-bold">{{new Date(item.date_dead_line).toLocaleDateString()}}</p>
          </div>
        </q-card-section>
      </q-card>


      <q-card flat bordered class=" q-mb-md br10">
        <q-card-section>
          <p class="text-bold">Контакты заказчика:</p>
          <q-list>
            <q-item class="table-header">
              <q-item-section>Контактный номер</q-item-section>
              <q-item-section>Ответственный по объекту</q-item-section>
              <q-item-section>Комментарий</q-item-section>
            </q-item>
            <q-item v-for="contact in item.object.client.contacts">
              <q-item-section>{{contact.phone}}</q-item-section>
              <q-item-section>{{contact.name}}</q-item-section>
              <q-item-section>{{contact.comment}}</q-item-section>
            </q-item>
          </q-list>
        </q-card-section>
      </q-card>

      <q-card flat bordered class="br10">
        <q-card-section>
          <p class="text-bold">Чек-Листы</p>
         <div class="row q-col-gutter-md">
           <div class="col-12 col-md-2" v-for="(check_list,index) in item.check_lists" :key="check_list.id">
             <q-btn :label="check_list.check_list.name" class="full-width" color="primary" unelevated no-caps />
           </div>


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
const item = ref(null)
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
  console.log(item.value)
  is_loading.value = !is_loading.value
}
</script>

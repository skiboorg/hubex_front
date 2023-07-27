<template>

  <q-page class="full-height">

    <div v-if="item.model" class="item-container full-height flex column items-start justify-center">
      <q-img class="q-mb-md" :src="item.model?.image"/>
      <p class="text-grey-6 text-caption q-mb-none">Модель оборудования</p>
      <p class="text-h6 text-weight-medium q-mb-sm">{{item.model?.name}}</p>
      <p class="text-grey-6 text-caption q-mb-none">Серийный номер</p>
      <p class="text-h6 text-weight-medium q-mb-sm">{{item.serial_number}}</p>
      <p v-if="item.is_warranty" class="text-grey-6 text-caption q-mb-none">Срок гарантии</p>
      <p v-if="item.is_warranty" class="text-h6 text-weight-medium q-mb-sm">до {{new Date(item.warranty_ends).toLocaleDateString()}}</p>

      <div v-if="item.orders.length>0">
        <p class="text-h6 q-mb-none">Заявки</p>
        <q-list>
          <q-item v-for="order in item.orders" :key="order.id">

              <q-item-section>
                {{order.date_created_at}}
              </q-item-section>
            <q-item-section>
              <p class="status q-mb-none" :style="[{color:order.status?.text_color},{background:order.status?.bg_color}]">
                <span :style="{background:order.status?.text_color}" class="status-dot"></span>
                {{order.status?.name}}
              </p>
            </q-item-section>
          </q-item>
        </q-list>

      </div>

      <div class="full-width q-mb-lg">
        <div  class="full-width  ">
          <q-btn @click="newOrder=true" no-caps unelevated color="positive" class="full-width q-py-md" label="Создать заявку"/></div>
        <div v-if="item.model?.file" class="full-width q-py-md">
          <q-btn :href="item.model?.file" no-caps unelevated color="dark" class="full-width q-py-md" label="Инструкция к оборудованию"/>
        </div>
        <div class="full-width"> <q-btn no-caps unelevated color="dark" class="full-width q-py-md" label="Написать нам в Telegram"/></div>
      </div>

    </div>
    <div v-else class="fullscreen relative-position">
      <q-inner-loading showing>
        <q-spinner size="50px" color="primary" />
      </q-inner-loading>
    </div>
  </q-page>
  <q-dialog maximized v-model="newOrder">
    <q-card>
      <q-card-section style="padding: 8px !important;" class="row items-center">
        <div class="text-body1">Новая заявка</div>
        <q-space />
        <q-btn icon="close" flat round dense v-close-popup />
      </q-card-section>

      <q-card-section style="padding: 8px !important;">
        <q-form @submit.prevent="addOrder" class="full-width">
          <q-input outlined type="textarea" v-model="order.comment" label="Коментарий"
                   lazy-rules
                   :rules="[
                val => val && val.length > 0 || 'Это обязательное поле']"
          />
          <div class="col-12 flex items-center justify-between q-mb-md">
            <p class="no-margin text-bold text-h6">Файлы</p>
            <q-btn @click="addFile" label="Добавить файл" no-caps unelevated color="primary"/>
          </div>
          <div class="col-12 row q-col-gutter-sm " v-for="(item,index) in files" :key="index">
            <div class="col-12"><q-file dense outlined v-model="files[index].file" label="Файл" lazy-rules
                                        :rules="[val => val || 'Это обязательное поле']"/></div>
            <div class="col-12"><q-input dense  outlined v-model="files[index].text" label="Описание" lazy-rules
                                         :rules="[val => val && val.length > 0 || 'Это обязательное поле']"/>
            </div>
            <div class="col-12"> <q-btn dense color="negative" class="q-mb-md" @click="remFile(index)" no-caps unelevated label="Удалить файл"/></div>

          </div>
          <q-btn no-caps unelevated color="positive" type="submit" :loading="is_loading" class="full-width q-py-md" label="Отправить"/>
        </q-form>
     </q-card-section>
    </q-card>
  </q-dialog>
</template>
<script setup>
import {api} from "boot/axios";
import {useRoute, useRouter} from "vue-router";
import {onBeforeMount, onMounted, ref} from "vue";
import {useNotify} from "src/helpers/notify";
const route = useRoute()
const router = useRouter()
const item = ref({})
const is_loading = ref(false)
const newOrder = ref(false)

const files = ref([])


const order = ref({
  is_critical:false,
  object:null,
  equipment:null,
  comment:null,
  is_created_by_client:true,
  date_dead_line:null,
})

onBeforeMount(async ()=>{
  await getItem()

})
const remFile = (index) => {
  files.value.splice(index,1)
}
const addFile = async () => {
  files.value.push({
    file:null,
    text:null
  })
}

const getItem = async () => {
  is_loading.value = !is_loading.value
  const response = await api(`/api/data/equipment/${route.params.serial_number}`)
  item.value = response.data
  is_loading.value = !is_loading.value
}

const addOrder = async () => {
  order.value.object = item.value.object.id
  order.value.equipment = item.value.id

  console.log(order.value)
  is_loading.value = !is_loading.value
  let formData = new FormData()
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
  order.value = {
    is_critical:false,
    object:null,
    equipment:null,
    comment:null,
    is_created_by_client:true,
    date_dead_line:null,
  }
  files.value = []
  newOrder.value=false

}
</script>
<style lang="sass">
.item-container
  max-width: 768px
  margin: 0 auto
  padding: 0 10px
</style>

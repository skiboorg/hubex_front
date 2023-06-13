<template>

  <q-page class="full-height">

    <div v-if="item.model">
      <div class="rounded-box q-mb-lg">
        <div class="page-search">
          <q-btn @click="$router.back()" label="Назад" icon="navigate_before" color="primary" outline unelevated no-caps/>
          <p class="no-margin title text-bold col-grow">Оборудование №{{item.serial_number}}</p>

          <q-btn label="Редактировать" icon="edit" color="primary" unelevated no-caps/>
        </div>
      </div>
      <div class="rounded-box">
      </div>

{{item}}

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
import {onBeforeMount,  ref} from "vue";
const route = useRoute()
const router = useRouter()
const item = ref({})
const is_loading = ref(false)


onBeforeMount(async ()=>{
  await getItem()
})


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

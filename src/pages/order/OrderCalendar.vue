<template>
<q-page>
  <div class="container">
    <q-date
      flat
      v-model="selected_date"
      @update:modelValue="dateSelected"
      :events="events"/>
    {{result}}
  </div>

</q-page>
</template>
<script setup>
import {onBeforeMount, ref} from "vue";
import {api} from "boot/axios";

const selected_date = ref(null)
const events = ref([])
const result = ref([])

onBeforeMount(async ()=>{
  const resp = await api.get(`/api/user/get_work_events`)
  events.value = resp.data.events
})

const dateSelected = async () => {
  const resp = await api.get(`/api/user/find_by_work_time?date=${selected_date.value.replaceAll('/','-')}`)
  result.value = resp.data
}
</script>

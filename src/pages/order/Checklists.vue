<template>

  <div class="rounded-box q-mb-lg">
    <div class="page-search">
      <p class="no-margin title text-bold">Все чек-листы</p>
      <q-space/>
      <q-btn unelevated
             :class="searchActive ? '' : 'btn-bg'"
             :color="searchActive ? 'primary' : ''"
             :text-color="searchActive ? 'white' : 'dark'"
             @click="searchActive = !searchActive"
             icon="search"/>


    </div>
  </div>
  <div v-if="searchActive" class="rounded-box q-mt-md q-mb-lg">
    <div class="page-search ">

      <q-input class="input" v-model="filters.q" dense rounded outlined placeholder="Поиск" @keydown.enter="filterAction('apply')">
        <template v-slot:prepend>
          <q-icon name="search" color="grey-4"/>
        </template>
      </q-input>
      <q-btn @click="filterAction('apply')" unelevated class="btn-bg" icon="search"/>

      <q-btn unelevated @click="filterAction('clear'), searchActive = false" class="btn-bg" icon="close"/>
    </div>
  </div>

  <div class="rounded-box">
    <q-table
      flat
      :rows="rows"
      :columns="columns"
      row-key="name"
      table-header-class="table-header"
    >
      <template v-slot:header="props">
        <q-tr :props="props" class="bg-grey-2">

          <q-th
            v-for="col in props.cols"
            :key="col.name"
            :props="props"
          >
            <span class="text-bold"> {{ col.label }}</span>
          </q-th>
          <q-th auto-width />
        </q-tr>
      </template>
      <template v-slot:body="props">
        <q-tr :props="props">

          <q-td
            v-for="col in props.cols"
            :key="col.name"
            :props="props">
            <span v-if="col.name ==='is_done'">
                <q-icon v-if="col.value" name="check_circle" size="20px" color="positive"/>
              </span>

            <span v-else>{{ col.value }}</span>
          </q-td>

          <q-td auto-width>
            <q-btn flat round dense :to="`/order/checklist/${props.row.id}`">
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M5.46967 17.4702C5.17678 17.7631 5.17678 18.2379 5.46967 18.5308C5.76256 18.8237 6.23744 18.8237 6.53033 18.5308L5.46967 17.4702ZM6.53033 18.5308L18.5303 6.53082L17.4697 5.47016L5.46967 17.4702L6.53033 18.5308Z" fill="#131119"/>
                <path d="M9 6.00049H18V15.0005" stroke="#131119" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
              </svg>
            </q-btn>
          </q-td>
        </q-tr>


      </template>
    </q-table>
  </div>

</template>
<script setup>
import {onBeforeMount, ref} from "vue";
import {api} from "boot/axios";
const columns = [
  { name: 'order_number', align: 'center',  label: 'Номер заявки', field: row => row.order_number ,  sortable: true},
  { name: 'check_list_name', align: 'left',  label: 'Название', field: row => row.check_list_name ,  sortable: true},
  { name: 'created_at', align: 'left',  label: 'Создан', field:row=>new Date(row.created_at).toLocaleString() ,  sortable: true},
  { name: 'updated_at', align: 'left',  label: 'Обновлен', field: row =>new Date(row.updated_at).toLocaleString()   ,  sortable: true},

]
const rows = ref([])

const searchActive = ref (false)
const query_string = ref('')
const filters = ref({
  is_done:false,
  is_critical:false,
  q:null,
  created_at_gte:null,
  created_at_lte:null,
})

onBeforeMount(async ()=>{
  const response = await api(`/api/data/order_checklists`)
  rows.value = response.data
  await getCheckLists()
})

const getCheckLists = async () => {
  const response = await api(`/api/data/order_checklists?${query_string.value}`)
  rows.value = response.data
}
const filterAction = async (action) => {
  query_string.value = ``
  if (action==='apply'){
    for (let [k,v] of Object.entries(filters.value)){
      console.log(k,v)
      v ? query_string.value += `${k}=${v}&` : null
    }
  }
  if (action==='clear'){
    query_string.value = ''
    filters.value = {
      is_done:false,
      is_critical:false,
      created_at_gte:null,
      created_at_lte:null,
      q:null,
    }
  }
  await getCheckLists()

}
</script>

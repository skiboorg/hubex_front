<template>
  <q-page >

      <div  class="rounded-box q-mb-lg">
        <div class="page-search">
          <p class="no-margin title text-bold">Заказчики <span class="text-grey-6">{{rows.length}}</span></p>
          <q-space/>

          <AddButton icon="add" label="Добавить заказчика" @click="$router.push('/service/clients/add')"/>

        </div>

      </div>
      <div class="rounded-box">
        <q-table
          flat
          :rows="rows"
          :columns="columns"
          row-key="name"
          table-header-class="table-header"
          :pagination="initialPagination"
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
                         <span v-if="col.name ==='fiz'">
                <q-icon v-if="col.value" name="check_circle" size="20px" color="positive"/>
                           <!--                <q-icon v-else name="engineering" size="20px" color="grey-7"/>-->
              </span>
                  <span v-else-if="col.name ==='dealer'">
                <q-icon v-if="col.value" name="check_circle" size="20px" color="positive"/>
                    <!--                <q-icon v-else name="engineering" size="20px" color="grey-7"/>-->
              </span>
                <span v-else>{{ col.value }}</span>
              </q-td>

              <q-td auto-width>
                <q-btn flat round dense :to="`/service/clients/${props.row.id}`">
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



  </q-page>
</template>
<script setup>

import {onBeforeMount, ref} from "vue";
import {api} from "boot/axios";
import ClientCard from "components/ClientCard.vue";
import AddButton from "components/AddButton.vue";
const columns = [
  { name: 'name', align: 'center',  label: 'Имя/Название', field: row => row.name ,  sortable: true},
  { name: 'fiz', align: 'left',  label: 'Физ. лицо', field: row => row.fiz ,  sortable: true},
  { name: 'dealer', align: 'left',  label: 'Дилер', field:row=>row.dealer ,  sortable: true},
  { name: 'dealer', align: 'left',  label: 'Капризный', field:row=>row.is_panic ,  sortable: true},
  //{ name: 'updated_at', align: 'left',  label: 'Обновлен', field: row =>new Date(row.updated_at).toLocaleString()   ,  sortable: true},

]
const initialPagination= {
  sortBy: 'desc',
  descending: false,
  page: 1,
  rowsPerPage: 25
  // rowsNumber: xx if getting data from a server
}
const rows = ref([])


onBeforeMount(async ()=>{
  await getClients()


})
const getClients = async () => {
  const response = await api(`/api/data/client`)
  rows.value = response.data
}
</script>

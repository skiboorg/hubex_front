<template>
  <q-page >
    <div class="rounded-box q-mb-lg">
      <div class="page-search">
        <p class="no-margin title text-bold">Все заявки</p>
        <q-input class="input" dense rounded outlined placeholder="Поиск">
          <template v-slot:prepend>
            <q-icon name="search" color="dark"/>
          </template>
        </q-input>
        <q-btn unelevated class="btn-bg">
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M9.5 14C11.1569 14 12.5 15.3431 12.5 17C12.5 18.6568 11.1569 20 9.5 20C7.84315 20 6.5 18.6568 6.5 17C6.5 15.3431 7.84315 14 9.5 14Z" stroke="#131119" stroke-width="2"/>
            <path d="M14.5 3.99998C12.8431 3.99998 11.5 5.34312 11.5 6.99998C11.5 8.65683 12.8431 9.99998 14.5 9.99998C16.1569 9.99998 17.5 8.65683 17.5 6.99998C17.5 5.34312 16.1569 3.99998 14.5 3.99998Z" stroke="#131119" stroke-width="2"/>
            <path opacity="0.5" d="M13 17L22 17" stroke="#131119" stroke-width="2" stroke-linecap="round"/>
            <path opacity="0.5" d="M11 7L2 6.9585" stroke="#131119" stroke-width="2" stroke-linecap="round"/>
            <path opacity="0.5" d="M2 17L6 17" stroke="#131119" stroke-width="2" stroke-linecap="round"/>
            <path opacity="0.5" d="M22 7L18 7" stroke="#131119" stroke-width="2" stroke-linecap="round"/>
          </svg>
        </q-btn>
        <q-btn label="Создать заявку" @click="$router.push('/orders/add')" icon="add" color="primary" unelevated no-caps/>
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
              {{ col.value }}

            </q-td>

            <q-td auto-width>

              <q-btn flat round dense :to="`/order/${props.row.number}`">
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M5.46967 17.4702C5.17678 17.7631 5.17678 18.2379 5.46967 18.5308C5.76256 18.8237 6.23744 18.8237 6.53033 18.5308L5.46967 17.4702ZM6.53033 18.5308L18.5303 6.53082L17.4697 5.47016L5.46967 17.4702L6.53033 18.5308Z" fill="#131119"/>
                  <path d="M9 6.00049H18V15.0005" stroke="#131119" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
                </svg>

              </q-btn>
            </q-td>
          </q-tr>

          <q-tr v-show="props.expand" :props="props">
            <q-td colspan="100%">
              <div class="text-left">
                <p class="text-weight-bolder q-mb-xs">Коментарий</p>
                <p class="comment q-mb-lg">{{props.row.comment}}</p>
                <p class="text-bold q-mb-xs">Заявки</p>

                <q-list >

                  <q-item  v-for="order in props.row.orders" class="bg-green-1 q-mb-sm">
                    <q-item-section>
                      <q-item-label>{{order.work_type.name}}</q-item-label>
                      <q-item-label caption>Статус: {{order.status.name}}</q-item-label>
                    </q-item-section>
                    <q-item-section side>
                      <q-btn flat round dense :to="`/order/${order.number}`">
                        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                          <path d="M5.46967 17.4702C5.17678 17.7631 5.17678 18.2379 5.46967 18.5308C5.76256 18.8237 6.23744 18.8237 6.53033 18.5308L5.46967 17.4702ZM6.53033 18.5308L18.5303 6.53082L17.4697 5.47016L5.46967 17.4702L6.53033 18.5308Z" fill="#131119"/>
                          <path d="M9 6.00049H18V15.0005" stroke="#131119" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
                        </svg>

                      </q-btn>
                    </q-item-section>

                  </q-item>
                </q-list>

              </div>
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

const columns = [
  { name: 'number', align: 'left',  label: 'Номер', field: 'number',  sortable: true},
  { name: 'object', align: 'left',  label: 'Объект', field: row => row.object.name ,  sortable: true},
  { name: 'date_created_at', align: 'left',  label: 'Дата', field: row => row.date_created_at ,  sortable: true},
  { name: 'status', align: 'left',  label: 'Статус', field: row => row.status.name ,  sortable: true},
  { name: 'comment', align: 'left',  label: 'Коментарий', field: row => row.comment ,  sortable: true},

]
const rows = ref([])


onBeforeMount(async ()=>{
  await getEquipment()

})
const getEquipment = async () => {
  const response = await api(`/api/data/order`)
  rows.value = response.data

}
</script>

<template>
  <q-page >
    <div class="rounded-box q-mb-lg">
      <div class="page-search">
        <p class="no-margin title text-bold">Все заявки</p>
        <q-space/>

        <q-btn unelevated class="btn-bg" @click="searchActive = !searchActive">
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M18.031 16.6168L22.3137 20.8995L20.8995 22.3137L16.6168 18.031C15.0769 19.263 13.124 20 11 20C6.032 20 2 15.968 2 11C2 6.032 6.032 2 11 2C15.968 2 20 6.032 20 11C20 13.124 19.263 15.0769 18.031 16.6168ZM16.0247 15.8748C17.2475 14.6146 18 12.8956 18 11C18 7.1325 14.8675 4 11 4C7.1325 4 4 7.1325 4 11C4 14.8675 7.1325 18 11 18C12.8956 18 14.6146 17.2475 15.8748 16.0247L16.0247 15.8748Z" fill="#11173E"/>
          </svg>
        </q-btn>

        <q-btn unelevated class="btn-bg">
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M9.5 14C11.1569 14 12.5 15.3431 12.5 17C12.5 18.6568 11.1569 20 9.5 20C7.84315 20 6.5 18.6568 6.5 17C6.5 15.3431 7.84315 14 9.5 14Z" fill="#ECECF0" stroke="#11173E" stroke-width="2"/>
            <path d="M14.5 3.99998C12.8431 3.99998 11.5 5.34312 11.5 6.99998C11.5 8.65683 12.8431 9.99998 14.5 9.99998C16.1569 9.99998 17.5 8.65683 17.5 6.99998C17.5 5.34312 16.1569 3.99998 14.5 3.99998Z" fill="#ECECF0" stroke="#11173E" stroke-width="2"/>
            <path opacity="0.21" d="M13 17L22 17" stroke="#11173E" stroke-width="2" stroke-linecap="round"/>
            <path opacity="0.21" d="M11 7L2 6.9585" stroke="#11173E" stroke-width="2" stroke-linecap="round"/>
            <path opacity="0.21" d="M2 17L6 17" stroke="#11173E" stroke-width="2" stroke-linecap="round"/>
            <path opacity="0.21" d="M22 7L18 7" stroke="#11173E" stroke-width="2" stroke-linecap="round"/>
          </svg>
          <q-menu>
            <q-card>
              <q-card-section>
                <q-checkbox v-model="filters.is_critical" label="Критичные"/>

                <q-checkbox v-model="filters.is_done" label="Завершенные"/>
                <br>
                <br>
                <q-input outlined dense v-model="filters.created_at_gte"  label="Дата создания от" >
                  <template v-slot:append>
                    <q-icon name="event" class="cursor-pointer">
                      <q-popup-proxy cover transition-show="scale" transition-hide="scale">
                        <q-date v-model="filters.created_at_gte" mask="YYYY-MM-DD">
                          <div class="row items-center justify-end">
                            <q-btn v-close-popup label="Выбрать" color="primary" flat />
                          </div>
                        </q-date>
                      </q-popup-proxy>
                    </q-icon>
                  </template>
                </q-input>
                <br>
                <q-input outlined dense v-model="filters.created_at_lte"  label="Дата создания до" >
                  <template v-slot:append>
                    <q-icon name="event" class="cursor-pointer">
                      <q-popup-proxy cover transition-show="scale" transition-hide="scale">
                        <q-date v-model="filters.created_at_lte" mask="YYYY-MM-DD">
                          <div class="row items-center justify-end">
                            <q-btn v-close-popup label="Выбрать" color="primary" flat />
                          </div>
                        </q-date>
                      </q-popup-proxy>
                    </q-icon>
                  </template>
                </q-input>
                <br>
                <q-btn label="Применить фильтр" @click="filterAction('apply')" v-close-popup unelevated no-caps/>
                <q-btn label="Сбросить фильтр" @click="filterAction('clear')" v-close-popup unelevated no-caps/>

              </q-card-section>
            </q-card>
          </q-menu>
        </q-btn>
        <q-btn label="Создать заявку" @click="$router.push('/orders/add')" icon="add" color="primary" unelevated no-caps/>
      </div>
    </div>
    <div v-if="searchActive" class="rounded-box q-mt-md q-mb-lg">
      <div class="page-search ">
        <q-btn unelevated class="btn-bg">
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M18.031 16.6168L22.3137 20.8995L20.8995 22.3137L16.6168 18.031C15.0769 19.263 13.124 20 11 20C6.032 20 2 15.968 2 11C2 6.032 6.032 2 11 2C15.968 2 20 6.032 20 11C20 13.124 19.263 15.0769 18.031 16.6168ZM16.0247 15.8748C17.2475 14.6146 18 12.8956 18 11C18 7.1325 14.8675 4 11 4C7.1325 4 4 7.1325 4 11C4 14.8675 7.1325 18 11 18C12.8956 18 14.6146 17.2475 15.8748 16.0247L16.0247 15.8748Z" fill="#11173E"/>
          </svg>
        </q-btn>
        <q-input class="input" v-model="filters.q" dense rounded outlined placeholder="Поиск" @keydown.enter="filterAction('apply')">
          <template v-slot:prepend>
            <q-icon name="search" color="grey-4"/>
          </template>
        </q-input>
        <q-btn unelevated class="btn-bg" icon="close"/>
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
              <span v-if="col.name ==='status'" class="status" :style="[{color:col.value.text_color},{background:col.value.bg_color}]">{{col.value.name}}</span>

              <span v-else-if="col.name ==='is_done'">
                <q-icon v-if="col.value" name="check_circle" size="20px" color="positive"/>
<!--                <q-icon v-else name="engineering" size="20px" color="grey-7"/>-->
              </span>
              <span v-else-if="col.name ==='is_critical'">
                <q-icon v-if="col.value" name="warning" size="20px" color="negative"/>
<!--                <q-icon v-else name="schedule" size="20px" color="grey-7"/>-->
              </span>
              <span v-else>{{ col.value }}</span>
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

const searchActive = ref (false)
const columns = [
  { name: 'is_critical', align: 'center',  label: '', field: row => row.is_critical ,  sortable: true},
  { name: 'date_created_at', align: 'left',  label: 'Создана', field: row => row.date_created_at ,  sortable: true},
  { name: 'number', align: 'left',  label: 'Номер', field: 'number',  sortable: true},
  { name: 'object', align: 'left',  label: 'Объект', field: row => row.object.name ,  sortable: true},
  { name: 'equipment_serial', align: 'left',  label: 'Оборудование', field: row => row.equipment?.serial_number ,  sortable: true},
  { name: 'status', align: 'left',  label: 'Статус', field: row => row.status ,  sortable: false},
  { name: 'is_done', align: 'center',  label: 'Завершена', field: row => row.is_done ,  sortable: true},
]
const rows = ref([])
const filters = ref({
  is_done:false,
  is_critical:false,
  q:null,
  created_at_gte:null,
  created_at_lte:null,
})


onBeforeMount(async ()=>{
  await getEquipment()

})
// const query_string = ref('is_done=false&is_critical=false')
const query_string = ref('')
const getEquipment = async () => {
  const response = await api(`/api/data/order?${query_string.value}`)
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
    query_string.value = 'is_done=false&is_critical=true'
    filters.value = {
      is_done:false,
      is_critical:true,
      created_at_gte:null,
      created_at_lte:null,
      q:null,
    }
  }
  await getEquipment()

}
</script>

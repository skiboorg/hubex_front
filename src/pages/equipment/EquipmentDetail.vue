<template>

  <q-page class="full-height">

    <div v-if="item.model">
      <div class="rounded-box q-mb-lg">
        <div class="page-search">
          <q-btn @click="$router.back()"  icon="navigate_before" color="primary" outline unelevated no-caps/>
          <p class="no-margin title text-bold col-grow">Оборудование №{{item.serial_number}}</p>

          <q-btn label="Редактировать" icon="edit" color="primary" unelevated no-caps/>
        </div>
      </div>
      <div class="grid q-mb-lg">
        <q-card flat  >
          <q-card-section>
            <div class="flex items-center justify-between q-mb-lg">
              <p class="no-margin text-h5 text-bold text-dark">Фото модели</p>
            </div>
            <q-img :ratio="4/3" fit="fill" :src="item.model.image"/>
          </q-card-section>
        </q-card>
        <q-card flat  >
          <q-card-section>
            <div class="flex items-center justify-between q-mb-lg">
              <p class="no-margin text-h5 text-bold text-dark">Информация об оборудоавнии</p>
            </div>
           <div class="row bordered-box">
             <p class="col-6 text-grey text-weight-medium">Дата ввода в эксплуатацию:</p>
             <p class="col-6 text-dark text-weight-medium">{{item.date_in_work}}</p>
             <p class="col-6 text-grey text-weight-medium">Дата производства:</p>
             <p class="col-6 text-dark text-weight-medium">{{item.date_in_work}}</p>
             <p class="col-6 text-grey text-weight-medium">Объект где находится:</p>
             <p class="col-6 text-dark text-weight-medium">{{item.object.address}}</p>
             <p class="col-6 text-grey text-weight-medium">Серийный номер:</p>
             <p class="col-6 text-dark text-weight-medium">{{item.serial_number}}</p>
             <p class="col-6 text-grey text-weight-medium ">Комментарий к оборудованию:</p>
             <p class="col-6 text-dark text-weight-medium comment ">{{item.comment}}</p>
             <div class="col-12">
               <div class="separator"></div>
             </div>
             <p class="col-6 text-grey text-weight-medium ">Фирма:</p>
             <p class="col-6 text-dark text-weight-medium">{{item.model.firm.name}}</p>
             <p class="col-6 text-grey text-weight-medium ">Модель:</p>
             <p class="col-6 text-dark text-weight-medium">{{item.model.name}}</p>
             <p class="col-6 text-grey text-weight-medium ">Инструкция:</p>
             <p class="col-6 text-dark text-weight-medium">{{item.comment}}</p>
           </div>
          </q-card-section>
        </q-card>
      </div>

        <q-card flat>
          <q-card-section>
            <div class="flex items-center justify-between q-mb-lg">
              <p class="no-margin text-h5 text-bold text-dark">История заявок по оборудованию</p>
            </div>
            <q-table
              flat
              :rows="item.orders"
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
          </q-card-section>
        </q-card>



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

const columns = [
  { name: 'is_critical', align: 'center',  label: '', field: row => row.is_critical ,  sortable: true},
  { name: 'date_created_at', align: 'left',  label: 'Создана', field: row => row.date_created_at ,  sortable: true},
  { name: 'number', align: 'left',  label: 'Номер', field: 'number',  sortable: true},
  { name: 'object', align: 'left',  label: 'Объект', field: row => row.object.name ,  sortable: true},
  { name: 'status', align: 'left',  label: 'Статус', field: row => row.status ,  sortable: false},
  { name: 'is_done', align: 'center',  label: 'Завершена', field: row => row.is_done ,  sortable: true},
]

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

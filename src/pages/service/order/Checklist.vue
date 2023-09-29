<template>
  <div v-if="item">
<!--    <pre>-->
<!--      {{tables_data[0]}}-->
<!--    </pre>-->
    <div class="rounded-box q-mb-lg">
      <div class="page-search">
        <q-btn @click="$router.back()" label="Назад"  icon="arrow_back" class="q-py-md" color="primary" outline unelevated no-caps/>

        <p class="no-margin title text-bold col-grow">{{item?.check_list.name}}, заявка {{item?.order_number}} </p>
        <q-btn @click="print" label="Печать"  class="q-py-md" color="primary" outline unelevated no-caps/>
        <q-btn @click="$router.push(`/service/order/checklist/edit/${item.id}`)" label="Редактировать"  class="q-py-md" color="primary" outline unelevated no-caps/>
        <q-btn :label="check_list_editable ? 'Отменить' : 'Изменить'"
               :loading="is_loading"
               class="q-py-md" @click="check_list_editable=!check_list_editable"
               :icon="check_list_editable ? 'close' : 'edit'"
               :color="check_list_editable ? 'red' : 'primary'"
               unelevated no-caps/>
      </div>
    </div>
    <div class="rounded-box print">
      <p class="text-bold q-mb-sm" v-if="item.equipment">Серийный номер оборудования {{item.equipment.serial_number}}</p>
      <p class="text-bold q-mb-sm" v-if="item.equipment">Модель оборудования {{item.equipment.model.name}}</p>
      <p class="text-bold q-mb-sm" v-if="item.equipment">На гарантии {{item.equipment.is_warranty ? 'Да' : 'Нет'}}</p>
      <p class="text-bold q-mb-sm" v-if="item.equipment && item.equipment.is_warranty">Окончание гарантии {{new Date(item.equipment.warranty_ends).toLocaleDateString() }}</p>
      <p class="text-bold q-mb-sm" v-if="item.equipment">Сервисная книжка подписана {{item.equipment.is_service_book_sign ? 'Да' : 'Нет'}}</p>
      <p class="text-bold q-mb-sm" v-if="item.equipment && item.equipment.is_service_book_sign">Дата подписания сервисной книжки {{new Date(item.equipment.service_book_sign_date).toLocaleDateString() }}</p>
      <p class="text-bold q-mb-sm" v-if="item.object_add_equipment?.length>0">Дополнительное оборудование на объекте </p>
      <p class="text-bold q-mb-sm" v-if="item.object">Объект {{item.object.address}} </p>
      <p class="no-margin" v-for="item in item.object_add_equipment" :key="item.id">{{item.model.category?.name}} {{item.model?.name}} {{item.amount}} шт</p>



    </div>
    <div class="rounded-box q-mb-md">
      <div v-for="(check_list_input,index) in item.data" :key="index" >
        <div v-if="check_list_input.is_separator" class="">
          <q-separator spaced="md"/>
          <p class="text-bold text-h6">{{item.data[index].label}}</p>
        </div>
        <q-checkbox :disable="!check_list_editable" v-if="check_list_input.is_boolean" dense
                    class="q-mb-md"
                    v-model="item.data[index].value"
                    :label="item.data[index].label"/>
        <q-input :disable="!check_list_editable" v-if="check_list_input.is_input" dense outlined class="q-mb-md"
                 v-model="item.data[index].value"
                 :label="item.data[index].label"/>
        <div class="q-mb-md" v-if="check_list_input.is_multiple_boolean">
          <p>{{item.data[index].label}}</p>
          <q-checkbox :disable="!check_list_editable"  dense class="q-mb-md"
                      v-for="(label,label_index) in item.data[index].labels.split('/')"
                      v-model="item.data[index].values[label_index]"
                      :label="label"/>
        </div>
        <div class="q-mb-md" v-if="check_list_input.is_multiple_boolean_with_input">
          <p class="q-mb-xs">{{item.data[index].label}}</p>
          <div class="flex items-center justify-between">
            <q-checkbox  dense
                         :disable="!check_list_editable"
                         v-for="(label,label_index) in item.data[index].labels.split('/').slice(0,-1)"
                         v-model="item.data[index].values[label_index]"
                         :label="label"/>
            <q-input dense outlined :disable="!check_list_editable" v-model="item.data[index].value" :label="item.data[index].labels.split('/').slice(-1)[0]"/>
          </div>

        </div>

      </div>
      <q-btn
             @click="saveData"
             :loading="is_loading"
             v-if="check_list_editable"
             no-caps
             unelevated
             color="primary"
             label="Сохранить изменения"/>
    </div>
    <div class="rounded-box q-mb-md" v-for="(table,table_index) in item.check_list.check_list_tables" :key="table_index">
      <p class="text-h6 text-bold">{{table.name}}</p>
      <q-btn label="Добавить ряд" @click="addRow(table_index)"/>
      <q-list  separator>
        <q-item class="table-header">
          <q-item-section  v-for="(item,item_index) in table.check_list_table_inputs" :key="item_index">{{item.label}}</q-item-section>
          <q-item-section  side><q-btn style="opacity: 0" icon="delete"/></q-item-section>
        </q-item>

        <q-item class="q-px-none" v-for="(row,row_index) in tables_data[table_index]" :key="row_index">

          <q-item-section v-for="(row_el,row_el_index) in row" :key="row_el_index">
            <q-checkbox dense  v-model="row_el.value" v-if="row_el.input.is_boolean"/>
            <q-input borderless dense v-model="row_el.value"  v-if="row_el.input.is_input"/>
          </q-item-section>
          <q-item-section  side><q-btn icon="delete" @click="remRow(table_index,row_index,table.id)"/></q-item-section>
        </q-item>


      </q-list>
      <q-btn label="Сохранить" @click="saveTable(table_index,table.id)"/>
    </div>
<!--    <pre>{{item.check_list.check_list_tables}}</pre>-->




  </div>
  <div v-else class="full-height ">
    <q-inner-loading showing>
      <q-spinner-gears size="50px" color="primary" />
    </q-inner-loading>
  </div>
</template>
<script setup>
import {onBeforeMount, ref, toRaw} from "vue";
import {api} from "boot/axios";
import {useRoute} from "vue-router";
import {useNotify} from "src/helpers/notify";
const route = useRoute()
const item = ref(null)
const is_loading = ref(false)
const check_list_editable = ref(false)
const tables_data = ref([])

const notify = useNotify
onBeforeMount(async ()=>{
  await getItem()
})

const getItem = async () => {
  is_loading.value = !is_loading.value
  const response = await api(`/api/data/order_checklist?id=${route.params.id}`)
  item.value = response.data
  item.value.check_list.check_list_tables.forEach(async (table)=>{
    const resp = await api.get(`/api/data/order_get_table_data?order_id=${item.value.order}&check_list_id=${item.value.check_list.id}&table_id=${table.id}`)

    if (resp.data.data){
      console.log('have data')
      console.log(resp.data.data)
      tables_data.value.push(resp.data.data.data)
    }else {
      table.default_data ? tables_data.value.push(table.default_data) : tables_data.value.push([])
    }

  })
  console.log(item.value)
  is_loading.value = !is_loading.value
}

const saveData = async (check_list_index,check_list_id) => {
  is_loading.value = !is_loading.value
  const response = await api.post(`/api/data/save_check_list_data`,{
    order_id:item.value.order,
    check_list_id:item.value.check_list.id,
    data:item.value.data})
  check_list_editable.value = false
  await getItem()
  notify('positive','Чеклист сохранен')
  is_loading.value = !is_loading.value

}


const print = () => {
  window.print()
}




const addRow = (table_index) => {
  let current_table = item.value.check_list.check_list_tables[table_index]
  const newRow = []
  current_table.check_list_table_inputs.forEach((el) => {
    console.log(el)
    el.input.is_boolean ? el.value = false : null
    newRow.push(JSON.parse(JSON.stringify(toRaw(el))))
  })
  tables_data.value[table_index].push(newRow)
}

const saveTable = async (table_index,table_id) => {
  console.log(table_id)
  console.log(tables_data.value[table_index])
  await api.post('/api/data/order_save_table',{order_id:item.value.order,check_list_id:item.value.check_list.id,table_id,data:tables_data.value[table_index]})
}

const remRow = async (table_index,row_index,table_id) => {
  tables_data.value[table_index].splice(row_index,1)

}
</script>

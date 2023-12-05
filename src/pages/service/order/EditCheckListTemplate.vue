<template>
  <div class="rounded-box q-mb-lg">
    <div class="page-search">
      <p class="no-margin title text-bold">Редактирование чеклиста {{check_list.name}}</p>

    </div>
  </div>
  <q-btn label="Добавить таблицу" class="q-mb-md" no-caps @click="addTable"/>
  <div class="rounded-box q-mb-lg" v-for="(table,table_index) in tables" :key="table_index">

    <p>Название таблицы</p>
    <q-form @submit.prevent="formTableSubmit">
      <q-input  outlined v-model="tables[table_index].name" label="Название" lazy-rules
                :rules="[val => val && val.length > 0 || 'Это обязательное поле']"/>

      <q-btn label="Добавить колонку" class="q-mb-lg" no-caps @click='addColumn(table_index)'/>

      <div class="row q-col-gutter-sm no-wrap">
        <div class="col-2" v-for="(input,input_index) in table.inputs" :key="input_index">
          <q-select dense outlined label="Тип ввода" :options="check_list_table_inputs"

                    @update:model-value = 'table.rows = []'
                    v-model="input.input" option-label="name" lazy-rules
                    :rules="[ val => val  || 'Это обязательное поле']"/>
          <q-input  dense outlined label="Название" v-model="input.label" lazy-rules
                    :rules="[val => val && val.length > 0 || 'Это обязательное поле']"/>
          <div class="text-center">
            <q-btn  dense flat no-caps text-color="negative" label="Удалить колонку" @click="remColumn(table_index,input_index)"/>
          </div>
        </div>
      </div>
      <q-btn v-if="table.inputs.length>0 && table.inputs.filter(x=>x.input === null).length===0" label="Добавить ряд" class="q-mb-lg" no-caps @click='addRow(table_index)'/>

      <div class="q-mb-sm" v-for="(row,row_index) in table.rows" :key="row_index">

        <div class="row q-col-gutter-sm no-wrap items-center">
          <div class="col-2" v-for="(input,input_index) in row" :key="input_index">
            <div class="text-center full-width">
              <q-checkbox class="full-width justify-center" dense v-if="input.input.is_boolean" v-model="input.value"/>
              <q-input  dense outlined v-if="input.input.is_input" v-model="input.value"/>
            </div>
          </div>
          <div class="col-1">
            <q-btn flat text-color="negative" icon="delete" @click="remRow(table_index,row_index)"/>
          </div>
        </div>
      </div>


    </q-form>
  </div>
  <div class="rounded-box q-mb-lg">

    <p>Название чек-листа</p>
    <q-form @submit.prevent="formSubmit">
      <q-input  outlined v-model="check_list.name" label="Название" lazy-rules
                :rules="[val => val && val.length > 0 || 'Это обязательное поле']"/>

      <q-btn label="Добавить вопрос" class="q-mb-lg" no-caps @click='addQuestion'/>


      <div class="row q-col-gutter-md bg-grey-3 q-mb-lg"
           @dragstart="rowDragStart"
           @drop.prevent='rowOnDrop($event,row_index, "row")'
           @dragenter.prevent @dragover.prevent
           draggable="true"
           :id="`${row_index}`"
           v-for="(row,row_index) in check_list.inputs"
           :key="row_index">

        <div class="col-2" >
          <q-select dense outlined label="Тип ввода" :options="check_list_inputs"

                    @popup-hide="inputTypeChanged(row_index)"
                    v-model="check_list.inputs[row_index].input_type" option-label="name" lazy-rules
                    :rules="[ val => val  || 'Это обязательное поле']"/>
        </div>
        <div class="col-2" v-if="check_list.inputs[row_index].input_type?.is_boolean || check_list.inputs[row_index].input_type?.is_input || check_list.inputs[row_index].input_type?.is_separator">
          <q-input dense outlined label="Название" v-model="check_list.inputs[row_index].label" lazy-rules
                   :rules="[val => val && val.length > 0 || 'Это обязательное поле']"/>
        </div>
        <div class="col-1" v-if="check_list.inputs[row_index].input_type?.is_multiple_boolean || check_list.inputs[row_index].input_type?.is_multiple_boolean_with_input">
          <q-btn icon="add" @click="addInputInRow(row_index)"/>
        </div>
        <div class="col-2" v-for="(label,label_index) in check_list.inputs[row_index].labels" :key="label_index">
          <q-input dense outlined
                   :label="check_list.inputs[row_index].labels[label_index].label"
                   v-model="check_list.inputs[row_index].labels[label_index].value"
                   lazy-rules
                   :rules="[val => val && val.length > 0 || 'Это обязательное поле']">
            <template v-if="check_list.inputs[row_index].labels[label_index].can_delete" v-slot:append>
              <q-btn @click="deleteInputInRow(row_index,label_index)" round dense flat icon="delete" />
            </template>
          </q-input>
        </div>
        <div class="col-1" >
          <q-btn icon="delete" @click="deleteRow(row_index)"/>
        </div>
      </div>
      <q-btn label="Сохранить изменения" v-if="check_list.inputs.length>0" type="submit" no-caps />
    </q-form>

  </div>

</template>
<script setup>
import {onBeforeMount, ref, toRaw} from "vue";
import {api} from "boot/axios";
import {useRoute} from "vue-router";
import {useNotify} from "src/helpers/notify";
const route = useRoute()

const row_drag_index = ref(0)
const check_list_inputs = ref([])
const check_list_table_inputs = ref([])

const check_list = ref({
  id:null,
  name:null,
  inputs:[]
})

const tables = ref([])

onBeforeMount(async ()=>{
  await getCheckListInputs()
  await getItem()
})

const getItem = async () => {
  const response = await api(`/api/data/checklists_template?id=${route.params.id}`)
  console.log(response.data)
  check_list.value.id = response.data.id
  check_list.value.name = response.data.name
  response.data.inputs.forEach((el)=>{
    check_list.value.inputs.push(
      {
        order_num:el.order_num,
        input_type:el.input,
        label:el.label,
        labels:[],
        temp_labels:el.labels ? el.labels.split('/') : null
      })
  })
  for (let i of check_list.value.inputs){
    if (i.temp_labels){
      i.temp_labels.forEach((el)=>{
        i.labels.push(
          {
            label:i.input_type.is_multiple_boolean ? 'Название булево' : 'Название инпут',
            value:el,
            can_delete:true
          }
        )
      })
    }
  }
  response.data.check_list_tables.forEach((table)=>{
    tables.value.push(
      {
        id:table.id,
        name:table.name,
        inputs:table.check_list_table_inputs,
        rows:table.default_data
      }
    )
  })

}
const getCheckListInputs = async () => {
  const resp = await api.get('/api/data/order_get_checklist_inputs')
  const resp1 = await api.get('/api/data/order_get_checklist_table_inputs')
  check_list_inputs.value = resp.data
  check_list_table_inputs.value = resp1.data
}

const addQuestion = () => {
  check_list.value.inputs.push(
    {
      order_num:check_list.value.inputs.length,
      input_type:null,
      label:null,
      labels:[],

    })
}

const deleteRow = (index) => {
  check_list.value.inputs.splice(index,1)
  reorder()
}
const addInputInRow = (index) => {
  let row = check_list.value.inputs[index]
  row.labels.unshift({
    label:'Название булево',
    value:null,
    can_delete:true
  })
}


const deleteInputInRow = (row_index,input_index) => {
  let row = check_list.value.inputs[row_index]
  row.labels.splice(input_index,1)
}
const inputTypeChanged = (index) => {
  let row = check_list.value.inputs[index]
  console.log(row)
  row.label = null
  row.labels = []
  if (row.input_type?.is_multiple_boolean_with_input){
    row.labels.push({
      label:'Название булево',
      value:null,
      can_delete:false
    })
    row.labels.push({
      label:'Название инпут',
      value:null,
      can_delete:false
    })
  }
  if (row.input_type?.is_multiple_boolean){
    row.labels.push({
      label:'Название булево',
      value:null,
      can_delete:false
    })

  }
}

const rowDragStart = (event) => {

  console.log('rowDragStart',event.target.id)
  row_drag_index.value = event.target.id
}

const addTable = () => {
  tables.value.push({
    name:null,
    inputs:[],
    rows:[]
  })
}

const rowOnDrop = (event,to_row_index,name) => {
  console.log('rowDragStart',row_drag_index.value)
  console.log('to_row_index',to_row_index)
  let row_data = check_list.value.inputs[row_drag_index.value]
  check_list.value.inputs.splice(row_drag_index.value,1)
  check_list.value.inputs.splice(to_row_index,0,row_data)
  reorder()
}

const reorder = () => {
  let i=0
  check_list.value.inputs.forEach((el)=>{
    el.order_num = i
    i+=1
  })
}
const formSubmit = async () => {
  const resp = await api.post('/api/data/order_update_checklist',{check_list:check_list.value,tables:tables.value})
  useNotify('positive','Чеклист изменен')
}
const formTableSubmit = () => {

}

const addColumn = (index) => {
  let table = tables.value[index]
  table.inputs.push({
    input_type:null,
    label:null,
  })
  table.rows = []
}

// {
//
//   "input": {
//   "id": 4,
//     "name": "Текстовое поле",
//     "is_boolean": false,
//     "is_input": true
// },
//   "order_num": 1,
//   "label": "Ввод1",
//   "value": null,
//   "table": 3
// },
const addRow = (index) => {
  let table = tables.value[index]
  let row = []
  table.inputs.forEach((el)=>{
    console.log(el)
    row.push({input:el.input,value:el.input.is_boolean ? false :null})
  })

  table.rows.push(row)
}
const remColumn = (table_index,input_index) => {
  let table = tables.value[table_index]
  table.inputs.splice(input_index,1)
  table.rows = []
}

const remRow = (table_index,row_index) => {
  let table = tables.value[table_index]
  table.rows.splice(row_index,1)
}
</script>

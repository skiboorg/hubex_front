<template>
  <div v-if="order">
    <q-page v-if="order.stage?.role.includes(authStore.user.role.id)" padding>
      <q-tabs
        v-model="tab"
        dense
        class="text-grey"
        active-color="primary"
        indicator-color="primary"
        align="justify"
        narrow-indicator
      >
        <q-tab name="info" label="Заявка" />
        <q-tab name="history" label="История обслуживания" />

      </q-tabs>

      <q-separator />

      <q-tab-panels v-model="tab" animated>
        <q-tab-panel name="info">

<!--          <pre>-->
<!--            {{order?.stage.firms.find(x=>x.equipment_firm === order?.equipment.model.firm).check_list.id}}-->
<!--          </pre>-->
          <div class="rounded-box small q-mb-sm">
            <p class="text-h6">Заявка {{order.number}}</p>
            <div class="flex items-center justify-between">
<!--              <q-btn v-if="order.stage?.check_list && order.stage?.role_can_interact.includes(authStore.user.role.id)" -->
<!--                     color="grey-3" text-color="grey-9" no-caps unelevated class="q-pa-md" -->
<!--                     label="Заполнить чеклист" @click="showCheckList = !showCheckList"/>-->

                            <q-btn v-if="order?.stage.firms.length>0 && order.stage?.role_can_interact.includes(authStore.user.role.id)"
                                   color="grey-3" text-color="grey-9" no-caps unelevated class="q-pa-md"
                                   label="Заполнить чеклист" @click="showCheckList = !showCheckList"/>

              <q-btn  color="grey-3" text-color="grey-9" outline unelevated no-caps class="q-pa-md" round icon="chat" @click="chat_modal=true" label="Чат"/>

            </div>
          </div>
          <div class="rounded-box small">
            <q-list class="q-mb-lg">
              <q-expansion-item group="g1" expand-separator label="Информация о заявке">
                <q-card >
                  <q-card-section>
                    <p><span class="text-bold">Статус заявки :</span> {{order.status?.name}}</p>
                    <p><span class="text-bold">Этап заявки :</span> {{order.stage?.name}}</p>
                    <p><span class="text-bold">Коментарий к этапу :</span> {{order.stage?.comment}}</p>
                    <p><span class="text-bold">Коментарий  :</span> {{order.comment}}</p>
                  </q-card-section>
                </q-card>

              </q-expansion-item>
              <q-expansion-item group="g1" expand-separator label="Информация о объекте">
                <q-card >
                  <q-card-section class="no-padding">
                    <p class=" q-pa-sm bg-grey-3" @click="copyText(order.object?.address,'Адрес скопирован<br>в буфер обмена')"><span class="text-bold " >Адрес :</span> {{order.object?.address}} <q-icon size="25px" name="content_copy"/></p>
                    <p><span class="text-bold">Координаты :</span> {{order.object?.longtitude}}, {{order.object?.latitude}}</p>
                    <p><span class="text-bold">Заказчик :</span> {{order.object?.client?.name}}</p>
                    <p><span class="text-bold">График работы :</span> {{order.object?.work_time}}</p>
                    <q-separator spaced="lg"/>
                    <p class="text-body2 text-bold q-mb-none"> Контакты по объекту:</p>
                    <q-list>

                      <q-item v-for="contact in order.object?.contacts">
                        <q-item-section>
                          <q-item-label overline>Контактный номер</q-item-label>
                          <q-item-label caption class="text-bold text-dark"><a class="can-call" :href="`tel:${contact.phone}`">{{contact.phone}}</a></q-item-label>
                          <q-item-label overline>Ответственный по объекту</q-item-label>
                          <q-item-label caption class="text-bold text-dark">{{contact.name}}</q-item-label>
                          <q-item-label overline>Комментарий</q-item-label>
                          <q-item-label caption class="text-bold text-dark">{{contact.comment}}</q-item-label>
                        </q-item-section>

                      </q-item>
                    </q-list>
                    <q-separator spaced="lg"/>
                    <p class="text-body2 text-bold q-mb-none">Контакты заказчика:</p>
                    <q-list>
                      <q-item v-for="contact in order.object?.client?.contacts">
                        <q-item-section>
                          <q-item-label overline>Контактный номер</q-item-label>
                          <q-item-label caption class="text-bold text-dark "><a class="can-call" :href="`tel:${contact.phone}`">{{contact.phone}}</a></q-item-label>
                          <q-item-label overline>Ответственный по объекту</q-item-label>
                          <q-item-label caption class="text-bold text-dark">{{contact.name}}</q-item-label>
                          <q-item-label overline>Комментарий</q-item-label>
                          <q-item-label caption class="text-bold text-dark">{{contact.comment}}</q-item-label>
                        </q-item-section>

                      </q-item>
                    </q-list>
                    <q-separator spaced="lg"/>
                    <p class="text-body2 text-bold q-mb-none"> Дополнительное оборудование:</p>
                    <q-list>
                      <q-item v-for="equipment in order.object?.additional_equipments">
                        <q-item-section>
                          <q-item-label overline>Категория</q-item-label>
                          <q-item-label caption class="text-bold text-dark">{{equipment.model?.category.name}}</q-item-label>
                          <q-item-label overline>Модель</q-item-label>
                          <q-item-label caption class="text-bold text-dark">{{equipment.model.name}}</q-item-label>
                          <q-item-label overline>Кол-во</q-item-label>
                          <q-item-label caption class="text-bold text-dark">{{equipment.amount}}</q-item-label>
                        </q-item-section>

                      </q-item>
                    </q-list>
                  </q-card-section>
                </q-card></q-expansion-item>
              <q-expansion-item group="g1" expand-separator label="Информация об оборудовании">
                <q-card >
                  <q-card-section>
<!--                    <q-img class="q-mb-sm" :src="order.equipment?.model.image"/>-->
                    <p class="q-mb-sm"><span class="text-bold">Фирма :</span> {{order.equipment?.model.firm.name}} </p>
                    <p class="q-mb-sm"><span class="text-bold">Модель :</span> {{order.equipment?.model.name}} </p>
                    <p class="q-mb-sm"><span class="text-bold">Название :</span> {{order.equipment?.name}} </p>
                    <p class="q-mb-sm"><span class="text-bold">Серийный номер :</span> {{order.equipment?.serial_number}} </p>
                    <p class="q-mb-sm"><span class="text-bold">Коментарий :</span> {{order.equipment?.comment}} </p>
                    <p class="q-mb-sm"><span class="text-bold">На гарантии :</span> {{order.equipment?.is_warranty ? 'Да' : 'Нет'}} </p>
                    <p class="q-mb-sm" v-if="order.equipment?.is_warranty">
                      <span class="text-bold">Дата окончания гарантии :</span> {{new Date(order.equipment?.warranty_ends).toLocaleDateString()}} </p>
                    <p class="q-mb-sm"><span class="text-bold">Сервисная книжка подписана :</span> {{order.equipment?.is_service_book_sign ? 'Да' : 'Нет'}} </p>
                    <p class="q-mb-sm" v-if="order.equipment?.is_service_book_sign"><span class="text-bold">Дата подписания сервисной книжки:</span>
                      {{new Date(order.equipment?.service_book_sign_date).toLocaleDateString()}} </p>


                  </q-card-section>
                </q-card>
              </q-expansion-item>
              <q-expansion-item group="g1" v-if="order.stage?.need_add_user && !user_added" expand-separator label="Нужно довабить пользователя">
                <q-card >
                  <q-card-section>
                    <q-select outlined dense class="q-mb-md" :options="add_users" option-label="fio" v-model="added_user" :label="`Выберите ${order.stage.add_user_role.name}`"/>
                    <q-btn no-caps unelevated color="primary" outline :label="order.stage.add_user_role_btn_label" @click="addUserToOrder"/>

                  </q-card-section>
                </q-card>
              </q-expansion-item>
              <q-expansion-item group="g1" expand-separator label="Мои выезды">

                    <q-list separator>
                      <q-item>
                        <q-item-section>Дата|Время</q-item-section>
                        <q-item-section side>Скрыто</q-item-section>
                      </q-item>
                      <q-item v-for="(time,index) in order.users.find(x=>x.id === authStore.user.id).work_time.filter(x=>x.order===order.id)">
                        <q-item-section>
                          <q-item-label overline c>{{new Date(time.date).toLocaleDateString()}}</q-item-label>
                          <q-item-label caption>{{time.start_time}}-{{time.end_time}}</q-item-label>

                        </q-item-section>
                        <q-item-section side>
                          <q-checkbox v-model="order.users.find(x=>x.id === authStore.user.id).work_time.filter(x=>x.order===order.id)[index].is_hidden"
                                      @update:modelValue="timeChanged(time.id)"/>
                        </q-item-section>
                      </q-item>
                    </q-list>




              </q-expansion-item>

            </q-list>

<!--            !have_data ||-->
<!--            {{order?.stage.firms.length>0 && have_data}}-->
            <div v-if="order.stage?.role_can_interact.includes(authStore.user.role.id)" class="">
              <q-btn  v-for="button in  order.stage.buttons" :key="button.id" no-caps unelevated color="primary" outline
                     :disable="order.stage?.is_add_user_required && !user_added || (order?.stage.firms.length>0 && !have_data)"
                     :loading="is_loading"
                     class="full-width q-mb-md"
                     :label="button.label" >
                <q-menu  class="q-pa-md full-width" auto-close :offset="[5,10]" >
                  <p class="text-center text-bold">Вы уверены?</p>
                  <div class="q-gutter-md text-center">
                    <q-btn label="Да" no-caps unelevated  color="positive" @click="changeStage(button.goto_stage)"/>
                    <q-btn label="Нет" no-caps unelevated  color="negative" v-close-popup/>
                  </div>
                </q-menu>
              </q-btn>

            </div>
          </div>
        </q-tab-panel>

        <q-tab-panel name="history">
<pre>{{order_history}}</pre>
        </q-tab-panel>


      </q-tab-panels>

    </q-page>
    <q-page v-else padding class="full-height flex column items-center justify-center">
      <p class="text-bold ">У вас нет доступа к этому этапу</p>
    </q-page>
  </div>
  <div style="height: 100vh" class=" full-width relative-position" v-else>
    <q-inner-loading showing>
      <q-spinner-gears size="50px" color="primary" />
    </q-inner-loading>
  </div>

  <q-dialog v-model="showCheckList" maximized>
    <q-card>
<!--      <q-card-section>-->
<!--        <div class="text-h6">Чеклист</div>-->
<!--      </q-card-section>-->
<!--      <q-separator />-->

      <q-card-section style=" font-size: 16px" class="scroll">
        <div v-for="(input,index) in checkList" :key="index">
          <q-checkbox v-if="input.is_boolean" dense class="q-mb-md" v-model="checkList[index].value" :label="checkList[index].label"/>
          <q-input v-if="input.is_input" dense outlined class="q-mb-md" v-model="checkList[index].value" :label="checkList[index].label"/>
          <div v-if="input.is_separator" class="">
            <q-separator spaced="lg"/>
            <p>{{checkList[index].label}}</p>
          </div>
          <div class="q-mb-md" v-if="input.is_multiple_boolean">
            <p>{{checkList[index].label}}</p>
            <q-checkbox  dense class="q-mr-md"
                         v-for="(label,label_index) in checkList[index].labels.split('/')"
                         v-model="checkList[index].values[label_index]"
                         :label="label"/>
          </div>
          <div class="bg-grey-3 q-mb-md" v-if="input.is_multiple_boolean_with_input">
            <p class="q-mb-xs">{{checkList[index].label}}</p>
            <div class="">
              <q-checkbox  dense
                           v-for="(label,label_index) in checkList[index].labels.split('/').slice(0,-1)"
                           class="q-mr-md q-mb-md"
                           v-model="checkList[index].values[label_index]"
                           :label="label"/>
              <q-input dense outlined  v-model="checkList[index].value" :label="checkList[index].labels.split('/').slice(-1)[0]"/>
            </div>
          </div>
        </div>

      </q-card-section>

      <q-separator />

      <q-card-actions align="center">
<!--        <q-btn outline label="Сохранить" :loading="is_loading" @click="saveData(order.id,order.stage?.check_list.id)" no-caps color="positive" />-->
        <q-btn outline label="Сохранить чеклист" :loading="is_loading"
               @click="saveData(order.id,order?.stage.firms.find(x=>x.equipment_firm === order?.equipment.model.firm).check_list.id)" no-caps color="positive" />
        <q-btn outline label="Отмена" no-caps color="negative" v-close-popup />
        <p class="text-caption text-grey-9 text-center">В случае ошибки вы сможете заполнить чек лист заного или это сделает администратор системы</p>
      </q-card-actions>
      <q-card-section>
        <div class="q-mb-md" v-for="(table,table_index) in tables" :key="table_index">
          <p class="text-h6 text-bold">{{table.name}}</p>

          <q-list  separator>
            <q-item class="table-header">
              <q-item-section :style="{'flex-grow': item.input.grow}" v-for="(item,item_index) in table.check_list_table_inputs" :key="item_index">{{item.label}}</q-item-section>

<!--              <q-item-section  side><q-btn style="opacity: 0" icon="delete"/></q-item-section>-->
            </q-item>

            <q-item class="q-px-none" v-for="(row,row_index) in tables_data[table_index]" :key="row_index">

              <q-item-section :style="{'flex-grow': row_el.input.grow}" v-for="(row_el,row_el_index) in row" :key="row_el_index">
                <q-checkbox dense  v-model="row_el.value" v-if="row_el.input.is_boolean"/>
                <q-input borderless dense v-model="row_el.value"  v-if="row_el.input.is_input"/>
              </q-item-section>

            </q-item>


          </q-list>
          <q-btn label="Сохранить таблицу" no-caps color="positive" outline @click="saveTable(table_index,table.id)"/>
        </div>
      </q-card-section>

    </q-card>
  </q-dialog>
  <q-dialog v-model="chat_modal" maximized  @show="is_show">
    <q-card class="full-width">


      <q-card-section class="q-pt-xl ">
        <q-btn class="absolute-top-right z-max" flat round icon="close" v-close-popup />
        <div class="full-height">
          <q-scroll-area ref="messages_wrapper" style="height: 80vh">

            <q-chat-message
              v-for="message in messages"
              :key="message.id"
              :stamp="new Date(message.createdAt).toLocaleString() "
              :name="message.user.fio"
              :text="[message.message]"
              :sent="message.user.uuid===user.uuid"
              :bg-color="message.user.uuid===user.uuid ? 'green-3' : 'grey-3'"


            >
              <template v-slot:name><span >
                      {{message.user.fio}}</span><br>
                <span v-if="message.file">
                   <a class="file_link" target="_blank" :href="message.file">
                      <svg width="14" height="14" viewBox="0 0 14 14" fill="none" xmlns="http://www.w3.org/2000/svg">
                          <path d="M6.99998 9.33325L4.08331 6.41658L4.89998 5.57075L6.41665 7.08742V2.33325H7.58331V7.08742L9.09998 5.57075L9.91665 6.41658L6.99998 9.33325ZM3.49998 11.6666C3.17915 11.6666 2.9044 11.5523 2.67573 11.3236C2.44706 11.0949 2.33293 10.8204 2.33331 10.4999V8.74992H3.49998V10.4999H10.5V8.74992H11.6666V10.4999C11.6666 10.8208 11.5523 11.0955 11.3236 11.3242C11.095 11.5528 10.8204 11.667 10.5 11.6666H3.49998Z" fill="white"/>
                      </svg>
                      {{message.file_name ? message.file_name : 'Прикрепленный файл'}}
                    </a>
                </span></template>
            </q-chat-message>
          </q-scroll-area>
          <div v-if="add_chat_file_form" class="q-mb-sm">
            <q-file class="q-mb-xs" dense outlined v-model="chat_file" label="Выберите файл"/>
            <q-input dense outlined v-model="chat_file_name" label="Название файла"/>
          </div>
          <div class="flex items-center ">
            <q-btn flat @click="toggleFileForm" rounded class="cursor-pointer q-mr-lg" color="grey-6" icon="attach_file" />
            <q-input  outlined
                      rounded
                      class="col-grow"
                      :loading="is_loading"
                      :disable="is_loading"
                      @keydown="keyDown"
                      v-model="new_message" label="Сообщение">

              <template v-slot:append>
                <q-btn round dense  :disable="!new_message" :loading="is_loading"  @click="sendChatMessage()" flat icon="send" />
              </template>
            </q-input>
          </div>
        </div>
      </q-card-section>
    </q-card>
  </q-dialog>


  <!--  <pre>-->
  <!--     {{checkList}}-->
  <!--  </pre>-->
</template>
<script setup>
import {computed, onBeforeMount, onBeforeUnmount, ref} from "vue";
import {api} from "boot/axios";
import {useNotify} from "src/helpers/notify"
import {useRoute} from "vue-router";
import { copyToClipboard } from 'quasar'


const route = useRoute()
const order = ref(null)
const chat_modal = ref(false)
const showCheckList = ref(false)
const user_added = ref(false)
const add_chat_file_form = ref(false)
const socket = ref(null)
const new_message = ref(null)
const messages = ref([])
const messages_wrapper = ref(null)
const chat_file = ref(null)
const chat_file_name = ref(null)
const is_loading = ref(false)
const position = ref(300000)
const add_users = ref([])
const tables = ref([])
const added_user = ref(null)
const have_data = ref(false)
const tab = ref('info')
import { useAuthStore } from 'stores/auth'
const authStore = useAuthStore()
const order_history = ref([])
const tables_data = ref([])
const cur_check_list = ref(null)
const notify = useNotify

const checkList = ref([])
onBeforeMount(async ()=>{
  await getOrder()
  await openChat()
  if(order.value.stage.need_add_user){
    const response = await api(`/api/user/by_role?id=${order.value.stage.add_user_role.id}`)
    add_users.value = response.data
  }
  const history =await api(`/api/data/order_history_by_object/${order.value.object.id}`)
    order_history.value = history.data

})

const copyText = (text,message) => {
  copyToClipboard(text)
    .then(() => {
      notify('info',message)
    })
    .catch(() => {
      // fail
    })

}

onBeforeUnmount( async ()=>{
  socket.value ? socket.value.close() : console.log('not connect')

})

const timeChanged = async(id) => {
  console.log(id)
  await api.get(`/api/user/hide_time?id=${id}`)
  await getOrder()
}

const user = computed(()=>{
  return authStore.user
})
//order?.stage.firms.find(x=>x.equipment_firm === order?.equipment.model.firm).check_list

const saveTable = async (table_index,table_id) => {
  console.log(table_id)
  console.log(tables_data.value[table_index])
  await api.post('/api/data/order_save_table',{order_id:order.value.id,check_list_id:cur_check_list.value.id,table_id,data:tables_data.value[table_index]})
  notify('positive','Таблица сохранена')
}
const getOrder = async () => {

  const response = await api(`/api/data/order/${route.params.number}?full=true`)
  order.value = response.data
  checkList.value = []
  console.log(order)
  // console.log(order.value.check_lists.filter(x=>x.check_list.id === order.value.stage.check_list.id)[0].data)
  // console.log(order.value.stage.check_list.inputs)
  //console.log(order.value.check_lists)
  let current_check_list
  if (order.value.stage.firms.length>0){
    current_check_list = order.value.stage.firms.find(x=>x.equipment_firm === order.value.equipment.model.firm).check_list
    cur_check_list.value = current_check_list
  }
  console.log(current_check_list)
  tables.value = current_check_list?.check_list_tables

  current_check_list?.check_list_tables.forEach(async (table)=>{
    const resp = await api.get(`/api/data/order_get_table_data?order_id=${order.value.id}&check_list_id=${current_check_list.id}&table_id=${table.id}`)

    if (resp.data.data){
      console.log('have data')
      console.log(resp.data.data)
      tables_data.value.push(resp.data.data.data)
    }else {
      table.default_data ? tables_data.value.push(table.default_data) : tables_data.value.push([])
    }

  })

  try {
    have_data.value = order.value.check_lists.filter(x=>x.check_list.id === current_check_list.id).length>0
  }catch (e) {
    console.log(e)
  }

  console.log(have_data)
  if (have_data.value){
    console.log('have data')
    order.value.check_lists.filter(x=>x.check_list.id === current_check_list.id)[0].data.forEach((el)=>{
      checkList.value.push(
        {
          label:el.label,
          labels:el.labels,
          value:el.value,
          values: el.values,
          is_boolean:el.is_boolean,
          is_input:el.is_input,
          is_separator:el.is_separator,
          is_multiple_boolean:el.is_multiple_boolean,
          is_multiple_boolean_with_input:el.is_multiple_boolean_with_input,
        }
      )
    })
  }else {
    console.log('not have data')
    if (current_check_list){
      console.log('have current_check_list')
      current_check_list.inputs.forEach((el)=>{
        checkList.value.push(
          {
            label:el.label,
            labels:el.labels,
            value:el.input.is_input || el.input.is_multiple_boolean_with_input ? null : false,
            values: el.labels
              ?
                el.labels.split('/').map(function(name) {
                return false;
              })
              : false,
            is_boolean:el.input.is_boolean,
            is_input:el.input.is_input,
            is_separator:el.input.is_separator,
            is_multiple_boolean:el.input.is_multiple_boolean,
            is_multiple_boolean_with_input:el.input.is_multiple_boolean_with_input,
          }
        )
      })
    }else {
      console.log('not have current_check_list')
    }
  }

}

// const getOrder = async () => {
//
//   const response = await api(`/api/data/order/${route.params.number}?full=true`)
//   order.value = response.data
//   // console.log(order.value.check_lists.filter(x=>x.check_list.id === order.value.stage.check_list.id)[0].data)
//   // console.log(order.value.stage.check_list.inputs)
//
//
//
//   try {
//     have_data.value = order.value.check_lists.filter(x=>x.check_list.id === order.value.stage.check_list.id).length>0
//   }catch (e) {
//     console.log(e)
//   }
//
//   console.log(have_data)
//   if (have_data.value){
//     order.value.check_lists.filter(x=>x.check_list.id === order.value.stage.check_list.id)[0].data.forEach((el)=>{
//       checkList.value.push(
//         {
//           label:el.label,
//           labels:el.labels,
//           value:el.value,
//           values: el.values,
//           is_boolean:el.is_boolean,
//           is_input:el.is_input,
//           is_separator:el.is_separator,
//           is_multiple_boolean:el.is_multiple_boolean,
//           is_multiple_boolean_with_input:el.is_multiple_boolean_with_input,
//         }
//       )
//     })
//   }else {
//     if (order.value.stage.check_list){
//       order.value.stage.check_list.inputs.forEach((el)=>{
//         checkList.value.push(
//           {
//             label:el.label,
//             labels:el.labels,
//             value:el.input.is_input || el.input.is_multiple_boolean_with_input ? null : false,
//             values: el.labels
//               ?
//               el.labels.split('/').map(function(name) {
//                 return false;
//               })
//               : false,
//             is_boolean:el.input.is_boolean,
//             is_input:el.input.is_input,
//             is_separator:el.input.is_separator,
//             is_multiple_boolean:el.input.is_multiple_boolean,
//             is_multiple_boolean_with_input:el.input.is_multiple_boolean_with_input,
//           }
//         )
//       })
//     }
//   }
//
// }
const changeStage = async (stage_id) => {
  is_loading.value = !is_loading.value
  checkList.value = []
  const response = await api.put(`/api/data/order/${route.params.number}`,{stage_id})
  await getOrder()
  is_loading.value = !is_loading.value
}
const saveData = async (order_id,check_list_id) => {
  is_loading.value = !is_loading.value
  const response = await api.post(`/api/data/save_check_list_data`,{order_id,check_list_id,data:checkList.value})
  showCheckList.value = false
  notify('positive','Чеклист сохранен')
  is_loading.value = !is_loading.value
  await getOrder()
}

async function openChat(){
  socket.value = new WebSocket(`${process.env.WS}/ws/order_chat/${order.value.uuid}`)
  const opened_chat = await api.get(`/api/chat/get_order_chat?order=${order.value.uuid}`)
  //console.log(opened_chat.data)
  messages.value = opened_chat.data.messages
  socket.value.onmessage = async (res) =>{
    let updated = null
    let data = JSON.parse(res.data)['message']
    //console.log('DATA',data.user.wallet)
    let new_message = {
      id:data.id,
      message: data.message,
      file: data.file ? data.file : null,//data.message,
      createdAt: data.createdAt,
      user:{
        uuid:data.user.uuid,
        fio:data.user.fio
      }
    }
    messages.value.push(new_message)
    scrollDown()
    // sound.play()
    //this.$refs.messages ?   this.$refs.messages.setScrollPosition(100000, 3000) : null

  } //socket.onmessage
}

async function sendChatMessage(){
  is_loading.value = !is_loading.value
  let formData = new FormData()
  formData.set('message', JSON.stringify(new_message.value))
  formData.set('file',chat_file.value)
  formData.set('file_name',chat_file_name.value)
  formData.set('user',user.value.uuid)
  formData.set('order',order.value.uuid)
  console.log(formData)
  const response = await api({
    method: 'post',
    headers:{
      'content-type': 'multipart/form-data'
    },
    url: `/api/chat/add_message_in_order_chat`,
    data: formData
  })
  if (chat_file.value){
    toggleFileForm()
  }
  new_message.value = null

  is_loading.value = !is_loading.value

}
async function keyDown(e){
  if (e.keyCode===13) {
    if (new_message.value) {
      await sendChatMessage()
    }
  }
}

function scrollDown(){
  if (chat_modal.value){
    messages_wrapper.value.setScrollPosition('vertical', position.value, 300)
    position.value = Math.floor(300) * 20
  }

}

function is_show(){
  scrollDown()
}

const addUserToOrder = async () => {
  let data={
    order:order.value.uuid,
    user:added_user.value.uuid,
  }

  await api.post(`/api/data/order_add_user`,data)
  user_added.value = true
}
const toggleFileForm = () => {
  add_chat_file_form.value = !add_chat_file_form.value
  chat_file.value=null
  chat_file_name.value=null
}
</script>
<style lang="sass">
.can-call
  display: inline-block
  border-bottom: 1px dashed $dark
</style>

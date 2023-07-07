<template>

  <q-page padding>
    <div class="rounded-box small q-mb-sm">
      <p class="text-h6">Заявка {{order.number}}</p>
      <div class="flex items-center justify-between">
        <q-btn v-if="order.stage?.check_list" color="grey-3" text-color="grey-9" no-caps unelevated class="q-pa-md" label="Заполнить чеклист" @click="showCheckList = !showCheckList"/>
        <q-btn  color="grey-3" text-color="grey-9" outline unelevated no-caps class="q-pa-md" round icon="chat" @click="chat_modal=true" label="Чат"/>

      </div>

    </div>
    <div class="rounded-box small">
      <q-list class="q-mb-lg">
        <q-expansion-item expand-separator label="Информация о заявке">
          <q-card >
            <q-card-section>
              <p><span class="text-bold">Статус заявки :</span> {{order.status?.name}}</p>
              <p><span class="text-bold">Этап заявки :</span> {{order.stage?.name}}</p>
              <p><span class="text-bold">Коментарий к этапу :</span> {{order.stage?.comment}}</p>
              <p><span class="text-bold">Коментарий  :</span> {{order.comment}}</p>
            </q-card-section>
          </q-card>

        </q-expansion-item>
        <q-expansion-item expand-separator label="Информация о объекте">
          <q-card >
            <q-card-section class="no-padding">
              <p><span class="text-bold">Адрес :</span> {{order.object?.address}}</p>
              <p><span class="text-bold">Координаты :</span> {{order.object?.longtitude}}, {{order.object?.latitude}}</p>
              <p><span class="text-bold">Заказчик :</span> {{order.object?.client.name}}</p>
              <p><span class="text-bold">График работы :</span> {{order.object?.work_time}}</p>
<q-separator spaced="lg"/>
              <p class="text-body2 text-bold q-mb-none"> Контакты по объекту:</p>
              <q-list>

                <q-item v-for="contact in order.object?.contacts">
                  <q-item-section>
                    <q-item-label overline>Контактный номер</q-item-label>
                    <q-item-label caption class="text-bold text-dark">{{contact.phone}}</q-item-label>
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
                <q-item v-for="contact in order.object?.client.contacts">
                  <q-item-section>
                    <q-item-label overline>Контактный номер</q-item-label>
                    <q-item-label caption class="text-bold text-dark">{{contact.phone}}</q-item-label>
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
                    <q-item-label caption class="text-bold text-dark">{{equipment.category.name}}</q-item-label>
                    <q-item-label overline>Модель</q-item-label>
                    <q-item-label caption class="text-bold text-dark">{{equipment.model.name}}</q-item-label>
                    <q-item-label overline>Кол-во</q-item-label>
                    <q-item-label caption class="text-bold text-dark">{{equipment.amount}}</q-item-label>
                  </q-item-section>

                </q-item>
              </q-list>
            </q-card-section>
          </q-card></q-expansion-item>
        <q-expansion-item expand-separator label="Информация об оборудовании">
            <q-card >
              <q-card-section>
                <q-img class="q-mb-sm" :src="order.equipment?.model.image"/>
                <p class="q-mb-sm"><span class="text-bold">Фирма :</span> {{order.equipment?.firm.name}} </p>
                <p class="q-mb-sm"><span class="text-bold">Модель :</span> {{order.equipment?.model.name}} </p>
                <p class="q-mb-sm"><span class="text-bold">Название :</span> {{order.equipment?.name}} </p>
                <p class="q-mb-sm"><span class="text-bold">Серийный номер :</span> {{order.equipment?.serial_number}} </p>
                <p class="q-mb-sm"><span class="text-bold">Коментарий :</span> {{order.equipment?.comment}} </p>
              </q-card-section>
            </q-card>
        </q-expansion-item>
        <q-expansion-item v-if="order.stage?.need_add_user && !user_added" expand-separator label="Нужно довабить пользователя">
          <q-card >
            <q-card-section>
              <q-select outlined dense class="q-mb-md" :options="add_users" option-label="fio" v-model="added_user" :label="`Выберите ${order.stage.add_user_role.name}`"/>
              <q-btn no-caps unelevated color="primary" outline :label="order.stage.add_user_role_btn_label" @click="addUserToOrder"/>

            </q-card-section>
          </q-card>
        </q-expansion-item>

      </q-list>

      <div class="q-gutter-md">
        <q-btn v-if="order.stage?.btn_1_goto_stage" no-caps unelevated color="primary" outline
               :disable="order.stage?.is_add_user_required && !user_added"
               :label="order.stage?.btn_1_label" @click="changeStage(order.stage?.btn_1_goto_stage)"/>
        <q-btn v-if="order.stage?.btn_2_goto_stage" no-caps unelevated color="primary" outline
               :label="order.stage?.btn_2_label" @click="changeStage(order.stage?.btn_2_goto_stage)"/>
      </div>
    </div>


  </q-page>
  <q-dialog v-model="showCheckList">
    <q-card>
      <q-card-section>
        <div class="text-h6">Чеклист</div>
      </q-card-section>

      <q-separator />

      <q-card-section style="max-height: 50vh" class="scroll">

        <div v-for="(input,index) in checkList" :key="index">
          <q-checkbox v-if="input.is_boolean" dense class="q-mb-md" v-model="checkList[index].value" :label="checkList[index].label"/>
          <q-input v-if="input.is_input" dense outlined class="q-mb-md" v-model="checkList[index].value" :label="checkList[index].label"/>
          <q-input v-if="input.is_date" dense outlined class="q-mb-md" v-model="checkList[index].value" :label="checkList[index].label" mask="date" :rules="['date']">
            <template v-slot:append>
              <q-icon name="event" class="cursor-pointer">
                <q-popup-proxy cover transition-show="scale" transition-hide="scale">
                  <q-date v-model="checkList[index].value">
                    <div class="row items-center justify-end">
                      <q-btn v-close-popup label="Close" color="primary" flat />
                    </div>
                  </q-date>
                </q-popup-proxy>
              </q-icon>
            </template>
          </q-input>
          <div class="" v-if="input.is_multiple_boolean">
            <p>{{checkList[index].label}}</p>
            <q-checkbox  dense class="q-mb-md"
                         v-for="(label,label_index) in checkList[index].labels.split('/')"
                         v-model="checkList[index].values[label_index]"
                         :label="label"/>
          </div>
          <div class="bg-grey-3 q-mb-md" v-if="input.is_multiple_boolean_with_input">
            <p class="q-mb-xs">{{checkList[index].label}}</p>
            <div class="flex items-center justify-between">
              <q-checkbox  dense
                           v-for="(label,label_index) in checkList[index].labels.split('/').slice(0,-1)"
                           v-model="checkList[index].values[label_index]"
                           :label="label"/>
              <q-input dense outlined  v-model="checkList[index].value" :label="checkList[index].labels.split('/').slice(-1)[0]"/>
            </div>

          </div>
        </div>

      </q-card-section>

      <q-separator />

      <q-card-actions align="center">
        <q-btn outline label="Сохранить" @click="saveData(order.id,order.stage?.check_list.id)" no-caps color="positive" />
        <q-btn outline label="Отмена" no-caps color="negative" v-close-popup />
        <p class="text-caption text-grey-9 text-center">В случае ошибки вы сможете заполнить чек лист заного или это сделает администратор системы</p>
      </q-card-actions>
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
                <span v-if="message.file"><a class="file_link" target="_blank" :href="message.file">Прикрепленный файл</a></span></template>
            </q-chat-message>
          </q-scroll-area>
          <div class="flex items-center ">
            <q-icon size="24px" class="cursor-pointer q-mr-lg" :color="chat_file ? 'positive' : 'grey-6'" name="attach_file" >
              <q-file style="position: absolute; width: 42px; opacity: 0;" v-model="chat_file" />
            </q-icon>
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



const route = useRoute()
const order = ref({})
const chat_modal = ref(false)
const showCheckList = ref(false)
const user_added = ref(false)

const socket = ref(null)
const new_message = ref(null)
const messages = ref([])
const messages_wrapper = ref(null)
const chat_file = ref([])
const is_loading = ref(false)
const position = ref(300000)
const add_users = ref([])
const added_user = ref(null)

import { useAuthStore } from 'stores/auth'
const authStore = useAuthStore()

const notify = useNotify

const checkList = ref([])
onBeforeMount(async ()=>{
  await getOrder()
  await openChat()
  const response = await api(`/api/user/by_role?id=${order.value.stage.add_user_role.id}`)
  add_users.value = response.data
})

onBeforeUnmount( async ()=>{
  socket.value ? socket.value.close() : console.log('not connect')

})

const user = computed(()=>{
  return authStore.user
})
const getOrder = async () => {

  const response = await api(`/api/data/order/${route.params.number}?full=true`)
  order.value = response.data
  if (order.value.stage.check_list){
    order.value.stage.check_list.inputs.forEach((el)=>{
      el.labels ? el.labels.split('/').map((lab)=>{console.log(lab)}) : null
      checkList.value.push(
        {
          label:el.label,
          labels:el.labels,
          value:el.input.is_input || el.input.is_multiple_boolean_with_input ? null : false,
          values: el.labels ? el.labels.split('/').slice(0,-1).map(function(name) {
            return false;
          }) : false,
          is_boolean:el.input.is_boolean,
          is_input:el.input.is_input,
          is_date:el.input.is_date,
          is_multiple_boolean:el.input.is_multiple_boolean,
          is_multiple_boolean_with_input:el.input.is_multiple_boolean_with_input,
        }
      )
    })
  }
}
const changeStage = async (stage_id) => {
  checkList.value = []
  const response = await api.put(`/api/data/order/${route.params.number}`,{stage_id})
  await getOrder()
}
const saveData = async (order_id,check_list_id) => {
  const response = await api.post(`/api/data/save_check_list_data`,{order_id,check_list_id,data:checkList.value})
  showCheckList.value = false
  notify('positive','Чеклист сохранен')
}

async function openChat(){
  socket.value = new WebSocket(`${process.env.WS}/ws/order_chat/${order.value.uuid}`)
  const opened_chat = await api.get(`/api/chat/get_order_chat?order=${order.value.uuid}`)
  console.log(opened_chat.data)
  messages.value = opened_chat.data.messages
  socket.value.onmessage = async (res) =>{
    let updated = null
    let data = JSON.parse(res.data)['message']
    console.log('DATA',data.user.wallet)
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
  new_message.value = null
  chat_file.value = null
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

</script>

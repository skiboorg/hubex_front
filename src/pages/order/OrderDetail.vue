<template>
<q-page>
  <div v-if="item">
    <div class="rounded-box q-mb-lg">
      <div class="page-search">
        <q-btn @click="$router.back()" label="Назад" icon="navigate_before" color="primary" outline unelevated no-caps/>
        <p class="no-margin title text-bold col-grow">Заявка №{{item.number}} от {{new Date(item.date_created_at).toLocaleDateString()}}</p>

        <q-btn label="Завершить" v-if="!item.is_done" @click="confirmDoneModal = true" icon="done" color="positive" unelevated no-caps/>
        <q-btn label="Редактировать" v-if="!item.is_done" icon="edit" color="primary" unelevated no-caps/>
      </div>
    </div>
    <div class="rounded-box">

      <q-card flat bordered class="q-mb-md br10">
        <q-card-section>
          <div class="row">
            <p class="col-3 text-grey">Номер заявки:</p>
            <p class="col-9 text-dark text-bold">{{item.number}}</p>
            <p class="col-3 text-grey">Тип:</p>
            <p class="col-9 text-dark text-bold">{{item.type.name}}</p>
            <p class="col-3 text-grey">Этап:</p>
            <p class="col-9 text-dark text-bold">{{item.stage?.name}}</p>

            <p class="col-3 text-grey">Статус:</p>
            <p class="col-9"><span class="status" :style="[{color:item.status.text_color},{background:item.status.bg_color}]">{{item.status.name}}</span></p>

            <p class="col-3 text-grey no-margin">Критичность:</p>
            <p class="col-9 text-dark text-bold no-margin" :class="{'text-negative':item.is_critical}">{{item.is_critical ? 'Высокая' : 'Обычная'}}</p>
          </div>
        </q-card-section>
      </q-card>
      <q-card flat bordered class=" q-mb-md br10">
        <q-card-section>
          <div class="row">
            <p class="col-3 text-grey">Объект:</p>
            <p class="col-9 ext-dark text-bold">{{item.object.name}}</p>
            <p class="col-3 text-grey no-margin">Оборудование:</p>
            <p class="col-9 ext-dark text-bold no-margin">{{item.equipment.name}}</p>
          </div>
        </q-card-section>
      </q-card>
      <q-card flat bordered class=" q-mb-md br10">
        <q-card-section>
          <div class="row">
            <div v-if="item.users.length>0" class="row col-12">
              <p class="col-3 text-grey">Исполнители:</p>
              <p class="col-9 ext-dark text-bold">
                <span class="block" v-for="user in item.users">{{user.fio}} - {{user.role?.name}}</span>
                <q-btn class="q-mt-md" label="Назначить" @click="addUserDialog=true" color="primary" unelevated no-caps/>
              </p>

            </div>

            <p class="col-3 text-grey">Дата создания заявки:</p>
            <p class="col-9 ext-dark text-bold">{{item.date_created_at ? new Date(item.date_created_at).toLocaleDateString() : '-'}}</p>
            <p class="col-3 text-grey">Дата назанчения исполнителя:</p>
            <p class="col-9 ext-dark text-bold">{{item.date_assign_worker ? new Date(item.date_assign_worker).toLocaleDateString()  : '-'}}</p>
            <p class="col-3 text-grey">Срок выполнения заявки:</p>
            <p class="col-9 ext-dark text-bold">{{item.date_done ? new Date(item.date_done).toLocaleDateString()  : '-'}}</p>

            <p class="col-3 text-grey">Крайний срок:</p>
            <p class="col-9 ext-dark text-bold">{{item.date_dead_line ? new Date(item.date_dead_line).toLocaleDateString()  : '-'}}</p>
          </div>
        </q-card-section>
      </q-card>


      <q-card flat bordered class=" q-mb-md br10">
        <q-card-section>
          <p class="text-bold">Контакты объекта:</p>
          <q-list>
            <q-item class="table-header">
              <q-item-section>Контактный номер</q-item-section>
              <q-item-section>Ответственный по объекту</q-item-section>
              <q-item-section>Комментарий</q-item-section>
            </q-item>
            <q-item v-for="contact in item.object.contacts">
              <q-item-section>{{contact.phone}}</q-item-section>
              <q-item-section>{{contact.name}}</q-item-section>
              <q-item-section>{{contact.comment}}</q-item-section>
            </q-item>
          </q-list>
        </q-card-section>
      </q-card>

      <q-card flat bordered class=" q-mb-md br10">
        <q-card-section>
          <p class="text-bold">Контакты заказчика:</p>
          <q-list>
            <q-item class="table-header">
              <q-item-section>Контактный номер</q-item-section>
              <q-item-section>Ответственный по объекту</q-item-section>
              <q-item-section>Комментарий</q-item-section>
            </q-item>
            <q-item v-for="contact in item.object.client.contacts">
              <q-item-section>{{contact.phone}}</q-item-section>
              <q-item-section>{{contact.name}}</q-item-section>
              <q-item-section>{{contact.comment}}</q-item-section>
            </q-item>
          </q-list>
        </q-card-section>
      </q-card>

      <q-card flat bordered class="br10 q-mb-md">
        <q-card-section>
          <p class="text-bold">Чек-Листы</p>
         <div class="row q-col-gutter-md">
           <div class="col-12 col-md-2" v-for="(check_list,index) in item.check_lists" :key="check_list.id">
             <q-btn @click="cur_check_list = index, checkListModal=true" :label="check_list.check_list.name" class="full-width" color="primary" unelevated no-caps />
           </div>
         </div>
        </q-card-section>
      </q-card>

      <q-card flat bordered class="br10 q-mb-md">
        <q-card-section>
          <p class="text-bold">Файлы</p>
          <div class="row q-col-gutter-md">
            <div class="col-12 col-md-3" v-for="file in item.files" :key="file.id">
              <FileCard :file="file"/>
            </div>
          </div>
        </q-card-section>
      </q-card>

      <q-card flat bordered class="  br10">
        <q-card-section>
          <p class="text-bold">Действия:</p>
          <q-list>
            <q-item class="table-header">
              <q-item-section>Дата</q-item-section>
              <q-item-section>ФИО</q-item-section>
              <q-item-section>Действие</q-item-section>
            </q-item>
            <q-item v-for="item in item.stage_logs">
              <q-item-section>{{new Date(item.created_at).toLocaleString()}}</q-item-section>
              <q-item-section>{{item.user.fio}} - {{item.user.role.name}}</q-item-section>
              <q-item-section>Смена этапа на {{item.new_stage.name}}</q-item-section>
            </q-item>
          </q-list>
        </q-card-section>
      </q-card>

    </div>
  </div>

</q-page>
  <q-dialog
    v-model="checkListModal"
  >
    <q-card style="width: 700px; max-width: 80vw;">
      <q-card-section>
        <div class="text-h6">Чеклист</div>
      </q-card-section>
      <q-card-section class="q-pt-none">
        <div v-for="i in item.check_lists[cur_check_list].data" :key="i" class="row q-col-gutter-md q-mb-sm">
          <div class="col-6">{{i.label}}</div>
          <div class="col-6">{{i.value}}</div>
        </div>
      </q-card-section>

      <q-card-actions align="right" >
        <q-btn flat label="Закрыть" v-close-popup />
      </q-card-actions>
    </q-card>
  </q-dialog>
  <q-dialog v-model="confirmDoneModal" persistent>
    <q-card>
      <q-card-section class="row items-center">
        <q-avatar icon="question_mark" color="primary" text-color="white" />
        <span class="q-ml-sm">Вы уверены что хотите завершить заявку</span>
      </q-card-section>

      <q-card-actions align="right">
        <q-btn flat label="Да" color="positive" @click="closeOrder" />
        <q-btn flat label="Нет" color="primary" v-close-popup />
      </q-card-actions>
    </q-card>
  </q-dialog>
  <q-dialog
    v-model="addUserDialog"
    persistent
    maximized
    transition-show="slide-up"
    transition-hide="slide-down"
    @before-show="addUsersDialogBeforeOpen"
  >
    <q-card>
      <q-bar>
        <p class="no-margin">Выберите сотрудников</p>
        <q-space />
        <q-btn dense flat icon="close" v-close-popup/>
      </q-bar>
      <q-card-section>
        <div class="bordered-box">
          <p>Выбранные</p>
          <div class="row q-col-gutter-md">
            <div class="col-12 col-md-3" v-for="(user,index) in selected_users" :key="user.id">
              <div class="relative-position">
                {{user.events}}
                <q-btn class="absolute-top-right" flat round icon="delete" @click="deleteUser(index)"/>
                <UserCard :user="user" @click="addNewUser=false, showUserTime(user)"/>
              </div>

            </div>
          </div>
          <q-btn icon="add" @click="addNewUser = true, addUserTime = false"/>
          <q-btn label="Сохранить" @click="addUsersToOrder"/>
        </div>
        <div class="bordered-box q-mt-md" v-if="addNewUser">
          <div class="row q-col-gutter-md">
            <div class="col-3">
              <q-select outlined v-model="role" :options="roles" option-label="name" label="Выберите роль"/>
            </div>
            <div class="col-3">
<!--              {{users.filter(x=>x.role?.name === role?.name).filter(y=>!selected_users.includes(y))}}-->
              <q-select outlined v-model="user" :options="users.filter(x=>x.role?.name === role?.name).filter(y=>!selected_users.includes(y))"
                        @update:model-value="userSelected"
                        option-label="fio" label="Выберите пользователя"/>
            </div>
            <div class="col-6" v-if="user">
              <div class="q-gutter-md">
                <q-btn @click="addUserTime=!addUserTime" label="Назначить время"/>
                <q-btn @click="addUser" label="Добавить пользователя"/>
              </div>

            </div>

          </div>

        </div>
        <div class="bordered-box q-mt-md" v-if="addUserTime">
          <div class="row q-col-gutter-md">
            <div class="col-9">
              <FullCalendar :options='calendarOptions' />
            </div>
            <div class="col-3">
              <p>Выбранное время:</p>
              <p>Начало</p>
              <p>{{new Date(selected_time.start).toLocaleString()}}</p>
              <p>Конец</p>
              <p>{{new Date(selected_time.end).toLocaleString()}}</p>

            </div>
          </div>

        </div>
      </q-card-section>
    </q-card>
  </q-dialog>
</template>
<script setup>
import {api} from "boot/axios";
import {useRoute, useRouter} from "vue-router";
import {onBeforeMount, onMounted, ref, toRaw} from "vue";
import FileCard from "components/FileCard.vue";
import UserCard from "components/UserCard.vue";

import FullCalendar from '@fullcalendar/vue3'
import dayGridPlugin from '@fullcalendar/daygrid'
import interactionPlugin from '@fullcalendar/interaction'
import timeGridPlugin from '@fullcalendar/timegrid'

const route = useRoute()
const router = useRouter()
const cur_check_list = ref(0)
const selected_users = ref([])
const users = ref([])
const addNewUser = ref(false)
const addUserTime = ref(false)
const user = ref(null)
const roles = ref([])
const role = ref(null)
const item = ref(null)
const selected_user_id = ref(0)
const selected_time = ref({
  start:null,
  end:null,
  backgroundColor:'#ff0000',
  editable: true
})
const checkListModal = ref(false)
const confirmDoneModal = ref(false)
const addUserDialog = ref(false)
const is_loading = ref(false)

const data = ref([])
const handleDateClick = (arg) => {
  console.log(arg)
}
const handleDateDrop = (arg) => {
  console.log(selected_user_id.value)
  console.log(selected_users.value.find(user=>user.id===selected_user_id.value).events)
  selected_users.value.find(user=>user.id===selected_user_id.value).events={
    start:arg.event.startStr,
    end:arg.event.endStr,
    backgroundColor: "#ff0000",
    editable:true
  }

}
const handleSelect = (arg) => {
  console.log(arg)
  selected_time.value.start = arg.startStr
  selected_time.value.end = arg.endStr
}

const calendarOptions = ref({
  plugins: [ interactionPlugin, timeGridPlugin],
  initialView: 'timeGridWeek',
  weekends: true,
  locale: 'ru',

  firstDay:1,

  select: handleSelect,
  selectable:true,
  views: {
    timeGridFourDay: {
      type: 'timeGrid',
      duration: { days: 4 },
      buttonText: '4 day',
      weekText: 'wWeek',
    }
  },
  headerToolbar: {
    left: 'prev,next',
    center: 'title',
    right: 'timeGridWeek,timeGridDay'
  },
  slotMinTime: '09:00:00',
  slotMaxTime: '21:00:00',
  timeZone: 'Europe/Moscow',
  editable: false,

  eventClick: handleDateClick,
  eventDrop:handleDateDrop,
  eventResize:handleDateDrop,
  events: [

  ]
})

const remove_data = ref({
  text:null,
  amount:null,
  is_remove:false
})

const add_data = ref({
  text:null,
  amount:null
})

onBeforeMount(async ()=>{
  await getItem()
  await getUsers()
})

const getItem = async () => {
  is_loading.value = !is_loading.value
  const response = await api(`/api/data/order/${route.params.number}?full=true`)
  item.value = response.data
  console.log(item.value)
  is_loading.value = !is_loading.value
}

const closeOrder = async () => {
  await api.put(`/api/data/order/${route.params.number}`,{is_done:true})
  confirmDoneModal.value = false
  await getItem()
}

const getUsers = async () => {
  const response1 = await api(`/api/user/all`)
  users.value = response1.data
  const response2 = await api(`/api/user/roles`)
  roles.value = response2.data
}

const userSelected = () => {
  if (user.value.work_time?.length>0){
    calendarOptions.value.events = user.value.work_time
  }else {
    calendarOptions.value.events = user.value.events
  }

}
const showUserTime = (user) => {
  selected_user_id.value = user.id
  calendarOptions.value.events = []
  console.log(user.events)
  if(user.work_time?.length>0){
    user.work_time.forEach((time_el)=>{
      calendarOptions.value.events.push(time_el)
    })
    //calendarOptions.value.events = user.work_time
  }
  console.log(user.events)
  if(user.events){
    calendarOptions.value.events.push(user.events)
  }
  console.log(calendarOptions.value.events)
  addUserTime.value = true
}


const addUser = () => {
  user.value.events = selected_time.value
  user.value.is_new = true
  selected_users.value.push(user.value)
  role.value = null
  user.value = null
  selected_time.value = {
    start:null,
    end:null,
  }
}

const deleteUser =async (index) => {
  console.log(selected_users.value[index])
  if (selected_users.value[index].is_new){
    selected_users.value.splice(index,1)
  }else {
    const data = {
      user:selected_users.value[index].uuid,
      order:item.value.uuid
    }
    const response = await api.post(`/api/data/order_delete_user`, data)
    selected_users.value.splice(index,1)
    await getItem()
  }
}

const addUsersToOrder = async () => {
  let data = {
    order:item.value.uuid,
    users:[]
  }
  selected_users.value.forEach((user)=>{
    if(user.is_new){
      data.users.push({
        id:user.id,
        events:user.events.start ? user.events : null
      })
      console.log(user)
    }
  })
  const response = await api.post(`/api/data/order_add_users`, data)
  await getItem()
}

const addUsersDialogBeforeOpen = () => {
  selected_users.value = item.value.users
}
</script>

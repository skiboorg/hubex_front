<template>
<q-page>
  <div v-if="item">
    <div class="rounded-box q-mb-lg">
      <div class="page-search">
        <q-btn @click="$router.back()" label="Назад"  icon="arrow_back" class="q-py-md" color="primary" outline unelevated no-caps/>
        <p class="no-margin title text-bold col-grow">Заявка №{{item.number}} от {{new Date(item.date_created_at).toLocaleDateString()}}</p>

        <q-btn label="Закрыть заявку" v-if="!item.is_done" outline class="q-py-md" @click="confirmDoneModal = true" icon="done" color="primary" unelevated no-caps/>
        <q-btn label="Чат" v-if="!item.is_done" @click="chatOpen=true, is_show" icon="chat" class="q-py-md" color="primary" unelevated no-caps/>
      </div>
    </div>

      <div class="grid q-mb-lg">
        <q-card flat  >
          <q-card-section>
            <div class="flex items-center justify-between q-mb-lg">
              <p class="no-margin text-h5 text-bold text-dark">Дата назначения</p>
              <div class="q-gutter-xs">
                <q-btn dense flat round>
                  <svg width="16" height="4" viewBox="0 0 16 4" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <circle cx="2" cy="2" r="2" fill="#B8B9C5"/>
                    <circle cx="8" cy="2" r="2" fill="#B8B9C5"/>
                    <circle cx="14" cy="2" r="2" fill="#B8B9C5"/>
                  </svg>
                </q-btn>
                <q-btn dense flat round>
                  <svg width="28" height="28" viewBox="0 0 28 28" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M15 8C15 7.44772 14.5523 7 14 7C13.4477 7 13 7.44772 13 8L13 12C13 12.5523 12.5523 13 12 13H8C7.44771 13 7 13.4477 7 14C7 14.5523 7.44771 15 8 15H12C12.5523 15 13 15.4477 13 16V20C13 20.5523 13.4477 21 14 21C14.5523 21 15 20.5523 15 20V16C15 15.4477 15.4477 15 16 15H20C20.5523 15 21 14.5523 21 14C21 13.4477 20.5523 13 20 13H16C15.4477 13 15 12.5523 15 12L15 8Z" fill="#11173E"/>
                  </svg>
                </q-btn>
              </div>
            </div>
            <div class="row bordered-box">
              <p class="col-6 text-grey text-weight-medium">Номер заявки:</p>
              <p class="col-6 text-dark text-weight-medium">{{item.number}}</p>


              <p class="col-6 text-grey text-weight-medium">Дата создания заявки:</p>
              <p class="col-6 text-dark text-weight-medium">{{item.date_created_at ? new Date(item.date_created_at).toLocaleDateString() : '-'}}</p>
              <p class="col-6 text-grey text-weight-medium">Дата назанчения исполнителя:</p>
              <p class="col-6 text-dark text-weight-medium">{{item.date_assign_worker ? new Date(item.date_assign_worker).toLocaleDateString()  : '-'}}</p>
              <p class="col-6 text-grey text-weight-medium">Срок выполнения заявки:</p>
              <p class="col-6 text-dark text-weight-medium">{{item.date_done ? new Date(item.date_done).toLocaleDateString()  : '-'}}</p>

              <p class="col-6 text-grey text-weight-medium">Крайний срок:</p>
              <p class="col-6 text-dark text-weight-medium">{{item.date_dead_line ? new Date(item.date_dead_line).toLocaleDateString()  : '-'}}</p>
              <p class="col-12 text-grey text-weight-medium">Коментарий:</p>
              <p class="col-12 text-dark text-weight-medium comment">{{item.comment}}</p>
              <div class="col-12">
                <div class="separator"></div>
              </div>
              <p class="col-6 text-grey text-weight-medium">Тип:</p>
              <p class="col-6 text-dark text-weight-medium">{{item.type.name}}</p>
              <p class="col-6 text-grey text-weight-medium">Этап:</p>
              <p class="col-6 text-dark text-weight-medium">{{item.stage?.name}}</p>

              <p class="col-6 text-grey text-weight-medium">Статус:</p>
              <p class="col-6"><span class="status text-weight-medium" :style="[{color:item.status.text_color},{background:item.status.bg_color}]">
                 <span :style="{background:item.status.text_color}" class="status-dot"></span>
                {{item.status.name}}</span>
              </p>

              <p class="col-6 text-grey no-margin text-weight-medium">Критичность:</p>
              <p class="col-6 text-dark  no-margin text-weight-medium" :class="{'text-negative':item.is_critical}">{{item.is_critical ? 'Высокая' : 'Обычная'}}</p>
            </div>
          </q-card-section>
        </q-card>
        <q-card flat  >
          <q-card-section>
            <div class="flex items-center justify-between q-mb-lg">
              <p class="no-margin text-h5 text-bold text-dark">Исполнители</p>
              <div class="q-gutter-xs">
                <q-btn dense flat round>
                  <svg width="16" height="4" viewBox="0 0 16 4" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <circle cx="2" cy="2" r="2" fill="#B8B9C5"/>
                    <circle cx="8" cy="2" r="2" fill="#B8B9C5"/>
                    <circle cx="14" cy="2" r="2" fill="#B8B9C5"/>
                  </svg>
                </q-btn>
                <q-btn dense flat round v-if="!item.is_done" @click="addUserDialog=true">
                  <svg width="28" height="28" viewBox="0 0 28 28" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M15 8C15 7.44772 14.5523 7 14 7C13.4477 7 13 7.44772 13 8L13 12C13 12.5523 12.5523 13 12 13H8C7.44771 13 7 13.4477 7 14C7 14.5523 7.44771 15 8 15H12C12.5523 15 13 15.4477 13 16V20C13 20.5523 13.4477 21 14 21C14.5523 21 15 20.5523 15 20V16C15 15.4477 15.4477 15 16 15H20C20.5523 15 21 14.5523 21 14C21 13.4477 20.5523 13 20 13H16C15.4477 13 15 12.5523 15 12L15 8Z" fill="#11173E"/>
                  </svg>
                </q-btn>
              </div>
            </div>
            <div class="row  q-col-gutter-sm">
             <div class="col-4" v-for="user in item.users" :key="user.id">
               <UserCard :user="user" :is_order_card="true" :time="user.work_time?.filter(x=>x.order===item.id)"/>
             </div>
            </div>
          </q-card-section>
        </q-card>
        <q-card flat  >
          <q-card-section>
            <div class="flex items-center justify-between q-mb-lg">
              <p class="no-margin text-h5 text-bold text-dark">Объект</p>
              <div class="q-gutter-xs">
                <q-btn dense flat round>
                  <svg width="16" height="4" viewBox="0 0 16 4" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <circle cx="2" cy="2" r="2" fill="#B8B9C5"/>
                    <circle cx="8" cy="2" r="2" fill="#B8B9C5"/>
                    <circle cx="14" cy="2" r="2" fill="#B8B9C5"/>
                  </svg>
                </q-btn>
                <q-btn dense flat round>
                  <svg width="28" height="28" viewBox="0 0 28 28" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M15 8C15 7.44772 14.5523 7 14 7C13.4477 7 13 7.44772 13 8L13 12C13 12.5523 12.5523 13 12 13H8C7.44771 13 7 13.4477 7 14C7 14.5523 7.44771 15 8 15H12C12.5523 15 13 15.4477 13 16V20C13 20.5523 13.4477 21 14 21C14.5523 21 15 20.5523 15 20V16C15 15.4477 15.4477 15 16 15H20C20.5523 15 21 14.5523 21 14C21 13.4477 20.5523 13 20 13H16C15.4477 13 15 12.5523 15 12L15 8Z" fill="#11173E"/>
                  </svg>
                </q-btn>
              </div>
            </div>
            <div class="row bordered-box q-mb-md">
              <p class="col-6 text-grey text-weight-medium">Название объекта:</p>
              <p class="col-6 text-dark text-weight-medium"><router-link class="table_link" :to="`/object/${item.object.number}`">{{item.object.name}}</router-link></p>
              <p class="col-6 text-grey text-weight-medium">Адрес объекта:</p>
              <p class="col-6 text-dark text-weight-medium"> {{item.object.address}}</p>
              <p class="col-6 text-grey  text-weight-medium no-margin">С/Н оборудования:</p>
              <p class="col-6 text-dark text-weight-medium no-margin"><router-link class="table_link" :to="`/equipment/${item.equipment.serial_number}`">{{item.equipment.serial_number}}</router-link></p>


            </div>
            <p class=" text-h5 text-bold text-dark q-mb-lg">Контакты объекта</p>
            <div class=" bordered-box q-mb-md" v-for="contact in item.object.contacts" :key="contact.id">
              <div class="row ">
                <p class="col-6 text-grey text-weight-medium">Контактный номер</p>
                <p class="col-6 text-dark text-weight-medium">{{contact.phone}}</p>
                <p class="col-6 text-grey text-weight-medium">Имя</p>
                <p class="col-6 text-dark text-weight-medium">{{contact.name}}</p>
                <p class="col-6 text-grey text-weight-medium no-margin">Комментарий к контакту</p>
                <p class="col-6 text-dark text-weight-medium no-margin">{{contact.comment}}</p>
              </div>
            </div>
          </q-card-section>
        </q-card>


        <q-card flat  >
          <q-card-section>
            <div class="flex items-center justify-between q-mb-lg">
              <p class="no-margin text-h5 text-bold text-dark">Контакты заказчика</p>
              <div class="q-gutter-xs">
                <q-btn dense flat round>
                  <svg width="16" height="4" viewBox="0 0 16 4" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <circle cx="2" cy="2" r="2" fill="#B8B9C5"/>
                    <circle cx="8" cy="2" r="2" fill="#B8B9C5"/>
                    <circle cx="14" cy="2" r="2" fill="#B8B9C5"/>
                  </svg>
                </q-btn>
                <q-btn dense flat round>
                  <svg width="28" height="28" viewBox="0 0 28 28" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M15 8C15 7.44772 14.5523 7 14 7C13.4477 7 13 7.44772 13 8L13 12C13 12.5523 12.5523 13 12 13H8C7.44771 13 7 13.4477 7 14C7 14.5523 7.44771 15 8 15H12C12.5523 15 13 15.4477 13 16V20C13 20.5523 13.4477 21 14 21C14.5523 21 15 20.5523 15 20V16C15 15.4477 15.4477 15 16 15H20C20.5523 15 21 14.5523 21 14C21 13.4477 20.5523 13 20 13H16C15.4477 13 15 12.5523 15 12L15 8Z" fill="#11173E"/>
                  </svg>
                </q-btn>
              </div>
            </div>
            <div class=" bordered-box q-mb-md" v-for="contact in item.object.client.contacts" :key="contact.id">
                <div class="row ">
                  <p class="col-6 text-grey text-weight-medium">Контактный номер</p>
                  <p class="col-6 text-dark text-weight-medium">{{contact.phone}}</p>
                  <p class="col-6 text-grey text-weight-medium">Имя</p>
                  <p class="col-6 text-dark text-weight-medium">{{contact.name}}</p>
                  <p class="col-6 text-grey text-weight-medium no-margin">Комментарий к контакту</p>
                  <p class="col-6 text-dark text-weight-medium no-margin">{{contact.comment}}</p>
                </div>
            </div>

          </q-card-section>
        </q-card>

      </div>
    <q-card flat class="q-mb-lg" >
      <q-card-section>
        <div class="flex items-center justify-between q-mb-lg">
          <p class="no-margin text-h5 text-bold text-dark">Чек-Листы</p>
          <div class="q-gutter-xs">
            <q-btn dense flat round>
              <svg width="16" height="4" viewBox="0 0 16 4" fill="none" xmlns="http://www.w3.org/2000/svg">
                <circle cx="2" cy="2" r="2" fill="#B8B9C5"/>
                <circle cx="8" cy="2" r="2" fill="#B8B9C5"/>
                <circle cx="14" cy="2" r="2" fill="#B8B9C5"/>
              </svg>
            </q-btn>
            <q-btn dense flat round icon="edit"
                   size="12px"
                   :color="check_list_editable ? 'red':'grey-5'"
                   @click="check_list_editable= !check_list_editable"/>


          </div>
        </div>
<!--<pre>-->
<!--  {{item.check_lists[0].data}}-->
<!--</pre>-->
        <div class="q-gutter-md">
          <q-btn :to="`/order/checklist/${check_list.id}`" v-for="(check_list,check_list_index) in item.check_lists"
                 :label="check_list.check_list?.name"
                 unelevated
                 no-caps
                 color="primary"
                 :key="check_list.id"/>
        </div>


      </q-card-section>
    </q-card>
    <q-card flat  class="q-mb-lg" v-if="item.files.length>0 || messages.filter(x=>x.file).length>0">
      <q-card-section>
        <div v-if="item.files.length>0" class="flex items-center justify-between q-mb-lg">
          <p class="no-margin text-h5 text-bold text-dark">Файлы</p>
          <div class="q-gutter-xs">
            <q-btn dense flat round>
              <svg width="16" height="4" viewBox="0 0 16 4" fill="none" xmlns="http://www.w3.org/2000/svg">
                <circle cx="2" cy="2" r="2" fill="#B8B9C5"/>
                <circle cx="8" cy="2" r="2" fill="#B8B9C5"/>
                <circle cx="14" cy="2" r="2" fill="#B8B9C5"/>
              </svg>
            </q-btn>
            <q-btn dense flat round>
              <svg width="28" height="28" viewBox="0 0 28 28" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M15 8C15 7.44772 14.5523 7 14 7C13.4477 7 13 7.44772 13 8L13 12C13 12.5523 12.5523 13 12 13H8C7.44771 13 7 13.4477 7 14C7 14.5523 7.44771 15 8 15H12C12.5523 15 13 15.4477 13 16V20C13 20.5523 13.4477 21 14 21C14.5523 21 15 20.5523 15 20V16C15 15.4477 15.4477 15 16 15H20C20.5523 15 21 14.5523 21 14C21 13.4477 20.5523 13 20 13H16C15.4477 13 15 12.5523 15 12L15 8Z" fill="#11173E"/>
              </svg>
            </q-btn>
          </div>
        </div>

        <div v-if="item.files.length>0" class="row q-col-gutter-md">
          <div class="col-12 col-md-3" v-for="file in item.files" :key="file.id">
            <FileCard :file="file"/>
          </div>
        </div>

        <p v-if="messages.filter(x=>x.file).length>0" class=" text-h5 text-bold text-dark q-mb-lg">Файлы из чата</p>

        <div v-if="messages.filter(x=>x.file).length>0" class="row q-col-gutter-md">
          <div class="col-12 col-md-3" v-for="file in messages.filter(x=>x.file)" :key="file.id">
            <FileCard :file="file"/>
          </div>
        </div>
      </q-card-section>
    </q-card>
    <q-card flat  >
      <q-card-section>
        <div class="flex items-center justify-between q-mb-lg">
          <p class="no-margin text-h5 text-bold text-dark">Действия</p>
          <div class="q-gutter-xs">
            <q-btn dense flat round>
              <svg width="16" height="4" viewBox="0 0 16 4" fill="none" xmlns="http://www.w3.org/2000/svg">
                <circle cx="2" cy="2" r="2" fill="#B8B9C5"/>
                <circle cx="8" cy="2" r="2" fill="#B8B9C5"/>
                <circle cx="14" cy="2" r="2" fill="#B8B9C5"/>
              </svg>
            </q-btn>
            <q-btn dense flat round>
              <svg width="28" height="28" viewBox="0 0 28 28" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M15 8C15 7.44772 14.5523 7 14 7C13.4477 7 13 7.44772 13 8L13 12C13 12.5523 12.5523 13 12 13H8C7.44771 13 7 13.4477 7 14C7 14.5523 7.44771 15 8 15H12C12.5523 15 13 15.4477 13 16V20C13 20.5523 13.4477 21 14 21C14.5523 21 15 20.5523 15 20V16C15 15.4477 15.4477 15 16 15H20C20.5523 15 21 14.5523 21 14C21 13.4477 20.5523 13 20 13H16C15.4477 13 15 12.5523 15 12L15 8Z" fill="#11173E"/>
              </svg>
            </q-btn>
          </div>
        </div>

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
</q-page>
  <q-no-ssr>
    <q-drawer
      v-model="chatOpen"
      side="right"
      :width="500"
      overlay
      @before-show="is_show"
      behavior="mobile"
      class="bg-white text-dark"
    >
      <q-card flat class="full-width">
        <q-card-section class="q-pt-xl ">
          <q-btn class="absolute-top-right z-max" flat round icon="close" @click="chatOpen=false" />
          <div class="full-height">
            <q-scroll-area class="q-pr-md" ref="messages_wrapper" :style="`height: ${add_chat_file_form ? '78vh' : '87vh'}`">

              <q-chat-message
                v-for="message in messages"
                :key="message.id"
                :stamp="new Date(message.createdAt).toLocaleString() "
                :name="message.user.fio"
                :text="[message.message]"
                :sent="message.user.uuid===chat_user.uuid"
                :bg-color="message.user.uuid===chat_user.uuid ? 'green-3' : 'grey-3'"
              >
                <template v-slot:name><span >
                      {{message.user.fio}}</span><br>
                  <span v-if="message.file"><a class="file_link" target="_blank" :href="message.file">{{message.file_name ? message.file_name : 'Прикрепленный файл'}}</a></span></template>
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
    </q-drawer>
  </q-no-ssr>

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
    @before-hide="addUsersDialogBeforeHide"

  >
    <q-card>
      <q-bar>
        <p class="no-margin">Назначенные сотрудники</p>
        <q-space />
        <q-btn dense flat icon="close" v-close-popup/>
      </q-bar>

      <q-card-section class="full-height" >
          <div class="row q-col-gutter-md q-mb-md">
            <div class="col-12 col-md-3" v-for="(user,index) in selected_users" :key="user.id">
              <div class="relative-position">
                <q-btn class="absolute-top-right" flat round icon="delete" @click="deleteUser(index)"/>
                <UserCard :is_order_card="true"
                          :user="user"
                          :time = "user.is_new ? [user.events] : user.work_time"
                          @click="addNewUser=false,
                          showUserTime(user)"/>
              </div>
            </div>
          </div>

          <div class="row q-col-gutter-md full-height">
            <div class="col-3  full-height">
              <p class="title text-bold text-dark">Добавление сотрудника</p>
              <q-select outlined v-model="role" class="q-mb-md" :options="roles" option-label="name" label="Выберите роль"/>
              <q-select outlined v-model="user" class="q-mb-lg"  :options="users.filter(x=>x.role?.name === role?.name).filter(y=>!selected_users.includes(y))"
                        @update:model-value="userSelected"
                        option-label="fio" label="Выберите пользователя"/>
              <div v-if="user" class="q-gutter-md">
                <q-btn @click="addUser" no-caps unelevated  color="primary" class="q-pa-md" label="Добавить сотрудника"/>
                <q-btn @click="addUserTime=!addUserTime" no-caps outline eunelevated class="q-pa-md" color="primary" label="Назначить время"/>
              </div>
              <div style="position: fixed;bottom: 20px;" class="q-gutter-md ">
                <q-btn label="Сохранить изменения" class="q-pa-md" no-caps unelevated color="primary" @click="addUsersToOrder"/>
                <q-btn label="Отмена" class="q-pa-md" no-caps unelevated outline color="primary" v-close-popup/>
              </div>
            </div>
            <div class="col-9 full-height" v-if="addUserTime">
              <p class="title text-bold text-dark">Выбор даты для сотрудника</p>
              <div class="bordered-box">
                <div class="bg-grey-2 q-pa-md">
                  <p class="text-grey no-margin">Выбранная на календаре дата</p>

                  <p class="no-margin text-body2 text-dark" v-if="selected_time.start">{{new Date(selected_time.start).toLocaleTimeString()}} - {{new Date(selected_time.end).toLocaleTimeString()}} {{new Date(selected_time.end).toLocaleDateString()}}</p>
                  <p class="no-margin text-body2 text-dark" v-else>Не выбрано</p>

                </div>

                <FullCalendar :options='calendarOptions' />
              </div>



            </div>
          </div>



      </q-card-section>
      <div >


      </div>
    </q-card>
  </q-dialog>
</template>
<script setup>
import {api} from "boot/axios";
import {useRoute, useRouter} from "vue-router";
import {computed, onBeforeMount, onBeforeUnmount, onMounted, ref, toRaw} from "vue";
import FileCard from "components/FileCard.vue";
import UserCard from "components/UserCard.vue";
import {useNotify} from "src/helpers/notify"
import FullCalendar from '@fullcalendar/vue3'
import dayGridPlugin from '@fullcalendar/daygrid'
import interactionPlugin from '@fullcalendar/interaction'
import timeGridPlugin from '@fullcalendar/timegrid'

import { useAuthStore } from 'stores/auth'
const authStore = useAuthStore()

const notify = useNotify
const route = useRoute()
const router = useRouter()
const check_list_editable = ref(false)
const cur_check_list = ref(0)
const selected_users = ref([])
const users = ref([])
const addNewUser = ref(false)
const addUserTime = ref(false)
const chatOpen = ref(false)
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

const checkList = ref([])

const checkListModal = ref(false)
const confirmDoneModal = ref(false)
const addUserDialog = ref(false)
const is_loading = ref(false)

const socket = ref(null)
const new_message = ref(null)
const messages = ref([])
const messages_wrapper = ref(null)
const add_chat_file_form = ref(false)
const chat_file = ref(null)
const chat_file_name = ref(null)
const position = ref(300000)

const data = ref([])

const chat_user = computed(()=>{
  return authStore.user
})
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
  await openChat()
  await api(`/api/user/set_notify_read?o_n=${route.params.number}`)
  await authStore.getUser()
})

onBeforeUnmount( async ()=>{
  socket.value ? socket.value.close() : console.log('not connect')

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
  addUserTime.value = false
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
  useNotify('positive','Сохранено')
}

const addUsersDialogBeforeOpen = () => {
  selected_users.value = item.value.users
}
const addUsersDialogBeforeHide = () => {
  calendarOptions.value.events = []
  selected_time.value = {
    start:null,
    end:null,
    backgroundColor:'#ff0000',
    editable: true
  }
}

async function openChat(){
  socket.value = new WebSocket(`${process.env.WS}/ws/order_chat/${item.value.uuid}`)
  const opened_chat = await api.get(`/api/chat/get_order_chat?order=${item.value.uuid}`)
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
      file_name: data.file_name ? data.file_name : null,//data.message,
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
  formData.set('user',chat_user.value.uuid)
  formData.set('order',item.value.uuid)
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
  if (chat_file.value){
    toggleFileForm()
  }

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

  if (chatOpen.value){
    messages_wrapper.value.setScrollPosition('vertical', position.value, 300)
    position.value = Math.floor(300) * 20
  }

}

function is_show(){
  scrollDown()
}

const saveData = async (check_list_index,check_list_id) => {
  const response = await api.post(`/api/data/save_check_list_data`,{
    order_id:item.value.id,
    check_list_id,
    data:item.value.check_lists[check_list_index].data})
  check_list_editable.value = false
  notify('positive','Чеклист сохранен')
}

const toggleFileForm = () => {
  add_chat_file_form.value = !add_chat_file_form.value
  chat_file.value=null
  chat_file_name.value=null
}
</script>

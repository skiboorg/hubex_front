<template>
<q-page>
  <div v-if="item">
    <div class="rounded-box q-mb-lg">

      <div class="page-search">
        <q-btn @click="$router.back()" label="Назад"  icon="arrow_back" class="q-py-md" color="primary" outline unelevated no-caps/>
        <p class="no-margin title text-bold col-grow">Заявка №{{item.number}} от {{new Date(item.date_created_at).toLocaleDateString()}}</p>


        <div v-if="item.stage?.role_can_interact.includes(authStore.user.role.id)" class="q-gutter-md">
          <q-btn v-for="button in  item.stage?.buttons"  no-caps unelevated color="primary" outline
                 :disable="item.stage?.is_add_user_required && !user_added"
                 :loading="is_loading"
                 class=" "
                 :label="button.label" >
            <q-menu  class="q-pa-md " auto-close :offset="[5,10]" >
              <p class="text-center text-bold">Вы уверены?</p>
              <div class="q-gutter-md text-center">
                <q-btn label="Да" no-caps unelevated  color="positive" @click="changeStage(button.goto_stage)"/>
                <q-btn label="Нет" no-caps unelevated  color="negative" v-close-popup/>
              </div>
            </q-menu>
          </q-btn>

        </div>
        <AddButton icon="edit" v-if="!item.is_done" label="Редактировать заявку" @click="$router.push(`/service/order/edit/${item.number}`)"/>
        <AddButton icon="add" v-if="!item.is_done" label="Добавить файл" @click="addFileModal = true"/>

        <q-btn label="Закрыть заявку" v-if="!item.is_done" outline class="q-py-md" @click="confirmDoneModal = true" icon="done" color="primary" unelevated no-caps/>
        <q-btn label="Чат"  @click="chatOpen=true, is_show" icon="chat" class="q-py-md" color="primary" unelevated no-caps/>
      </div>
    </div>

      <div class="grid q-mb-lg">
        <q-card flat  >
          <q-card-section>
            <q-btn label="СМС"  @click="smsOpen=true" icon="chat" class="q-mb-md" color="primary" unelevated no-caps/>
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
              <p class="col-6 text-grey text-weight-medium">Телефон:</p>
              <p class="col-6 text-dark text-weight-medium">{{item.phone ? item.phone : 'Не указан'}}</p>


              <p class="col-6 text-grey text-weight-medium">Дата создания заявки:</p>
              <p class="col-6 text-dark text-weight-medium">{{item.date_created_at ? new Date(item.date_created_at).toLocaleString() : '-'}}</p>
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
              <p class="col-6 text-grey text-weight-medium">Тип заявки:</p>
              <p class="col-6 text-dark text-weight-medium">{{item.type?.name}}</p>
              <p class="col-6 text-grey text-weight-medium">Тип работ:</p>
              <p class="col-6 text-dark text-weight-medium">{{item.work_type?.name}}</p>
              <p class="col-6 text-grey text-weight-medium">Этап:</p>
              <p class="col-6 text-dark text-weight-medium">{{item.stage?.name}}</p>

              <p class="col-6 text-grey text-weight-medium">Статус:</p>
              <p class="col-6"><span class="status text-weight-medium" :style="[{color:item.status.text_color},{background:item.status.bg_color}]">
                 <span :style="{background:item.status.text_color}" class="status-dot"></span>
                {{item.status.name}}</span>
              </p>

              <p class="col-6 text-grey no-margin text-weight-medium">Критичность:</p>
              <p class="col-6 text-dark  no-margin text-weight-medium" :class="{'text-negative':item.is_critical}">{{item.is_critical ? 'Высокая' : 'Обычная'}}</p>
              <p class="col-6 text-grey no-margin text-weight-medium">Заявка на дополнительное оборудование:</p>
              <p class="col-6 text-dark  no-margin text-weight-medium" >{{item.is_order_for_additional_equipment ? 'Да' : 'Нет'}}</p>
            </div>
          </q-card-section>
        </q-card>
        <q-card flat  >
          <q-card-section>
            <div class="flex items-center justify-between q-mb-lg">
              <p class="no-margin text-h5 text-bold text-dark">Исполнители</p>
              <div class="q-gutter-xs">
<!--                <q-btn dense flat round>-->
<!--                  <svg width="16" height="4" viewBox="0 0 16 4" fill="none" xmlns="http://www.w3.org/2000/svg">-->
<!--                    <circle cx="2" cy="2" r="2" fill="#B8B9C5"/>-->
<!--                    <circle cx="8" cy="2" r="2" fill="#B8B9C5"/>-->
<!--                    <circle cx="14" cy="2" r="2" fill="#B8B9C5"/>-->
<!--                  </svg>-->
<!--                </q-btn>-->
                <q-btn dense flat round v-if="!item.is_done" @click="addUserDialog=true">
                  <svg width="28" height="28" viewBox="0 0 28 28" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M15 8C15 7.44772 14.5523 7 14 7C13.4477 7 13 7.44772 13 8L13 12C13 12.5523 12.5523 13 12 13H8C7.44771 13 7 13.4477 7 14C7 14.5523 7.44771 15 8 15H12C12.5523 15 13 15.4477 13 16V20C13 20.5523 13.4477 21 14 21C14.5523 21 15 20.5523 15 20V16C15 15.4477 15.4477 15 16 15H20C20.5523 15 21 14.5523 21 14C21 13.4477 20.5523 13 20 13H16C15.4477 13 15 12.5523 15 12L15 8Z" fill="#11173E"/>
                  </svg>
                </q-btn>
              </div>
            </div>
            <div class="row  q-col-gutter-sm">
             <div class="col-6 col-md-4" v-for="user in item.users" :key="user.id">

               <UserCard :user="user" :is_order_card="true" :time="user.work_time"/>
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
              <p class="col-6 text-grey text-weight-medium">Номер объекта/договора:</p>
              <p class="col-6 text-dark text-weight-medium"><router-link class="table_link" :to="`/service/object/${item.object.id}`">{{item.object.number}}</router-link></p>
              <p class="col-6 text-grey text-weight-medium">Адрес объекта:</p>
              <p class="col-6 text-dark text-weight-medium"> {{item.object.address}}</p>
              <p class="col-6 text-grey  text-weight-medium ">С/Н оборудования:</p>
              <p class="col-6 text-dark text-weight-medium "><router-link class="table_link" :to="`/service/equipment/${item.equipment?.id}`">{{item.equipment?.serial_number}}</router-link></p>
                <p class="col-6 text-grey  text-weight-medium no-margin">Модель оборудования:</p>
              <p class="col-6 text-dark text-weight-medium no-margin">{{item.equipment?.model.name}}</p>


            </div>
            <p class=" text-h5 text-bold text-dark q-mb-lg">Дополнительное оборудование</p>

            <q-list>
              <q-item class="table-header">
<!--                <q-item-section>Категория</q-item-section>-->
                <q-item-section>Модель</q-item-section>
                <q-item-section>Кол-во</q-item-section>
              </q-item>
              <q-item v-for="equipment in item.object?.additional_equipments">
<!--                <q-item-section>{{equipment.model.category.name}}</q-item-section>-->
                <q-item-section>{{equipment.model.name}}</q-item-section>
                <q-item-section>{{equipment.amount}}</q-item-section>
              </q-item>
            </q-list>

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
            <div class=" bordered-box q-mb-md" v-for="contact in item.object.client?.contacts" :key="contact.id">
                <div class="row ">
                  <p class="col-6 text-grey text-weight-medium">Контактный номер</p>
                  <p class="col-6 text-dark text-weight-medium">{{contact.phone}}</p>
                  <p class="col-6 text-grey text-weight-medium">Имя</p>
                  <p class="col-6 text-dark text-weight-medium">{{contact.name}}</p>
                  <p class="col-6 text-grey text-weight-medium no-margin">Комментарий к контакту</p>
                  <p class="col-6 text-dark text-weight-medium no-margin">{{contact.comment}}</p>
                </div>
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
          <q-btn :to="`/service/order/checklist/${check_list.id}`" v-for="(check_list,check_list_index) in item.check_lists"
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

            <q-btn dense flat round @click="addFileModal = true">
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
            <q-item-section>{{item.new_stage.name}}</q-item-section>
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
                  <span v-if="message.file">
                    <a class="file_link" target="_blank" :href="message.file">
                      <svg width="14" height="14"  viewBox="0 0 14 14" fill="none" xmlns="http://www.w3.org/2000/svg">
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
    </q-drawer>
  </q-no-ssr>
  <q-dialog v-model="addFileModal" >
    <q-card>
      <q-card-section style="padding: 8px" class="q-pb-none q-pa-sm">

       <q-file dense  outlined v-model="files[0].file" label="Файл" lazy-rules
                                    :rules="[val => val || 'Это обязательное поле']"/>
       <q-input dense outlined v-model="files[0].text" label="Описание" lazy-rules
                                     :rules="[val => val && val.length > 0 || 'Это обязательное поле']"/>
      </q-card-section>

      <q-card-actions align="right">
        <q-btn flat label="Сохранить" color="positive" no-caps @click="addFile" />
        <q-btn flat label="Отменить" color="primary" no-caps v-close-popup />
      </q-card-actions>
    </q-card>
  </q-dialog>
  <q-dialog v-model="smsOpen" >
    <q-card style="width: 700px; max-width: 80vw;">
      <q-card-section>
        СМС
      </q-card-section>

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
    @before-hide="addUsersDialogBeforeHide"

  >
    <q-card>
      <div class="full-height" >
        <div class="row q-col-gutter-md full-height">
          <div class="col-3 full-height">
            <div class="q-pa-md full-height">
              <p class="text-h5 text-bold">Назначенные сотрудники</p>
              <q-scroll-area style="height: 100%">
                <div v-for="(user,index) in selected_users" :key="user.id" class="relative-position q-mb-md">
                  <q-btn class="absolute-top-right" flat round icon="delete" @click="deleteUser(index)"/>

                  <UserCard :is_order_card="true"
                            :user="user"
                            :time = "user.is_new ? [user.events] : user.work_time"
                            @click="cur_user=index,editUserModal=true"/>
                </div>
              </q-scroll-area>

            </div>


          </div>
          <div class="col-9">
            <div class="bg-grey-1 q-pa-md full-height">
              <div class="flex items-center justify-between q-mb-md">
                <p class="title text-bold text-dark no-margin">Добавление сотрудника</p>
                <q-btn icon="close" v-close-popup flat/>
              </div>

              <q-select outlined v-model="role" class="q-mb-md" :options="roles" option-label="name" label="Выберите роль"/>
              <q-select outlined v-model="user" class="q-mb-lg"  :options="users.filter(x=>x.role?.name === role?.name)"
                        @update:model-value="userSelected"
                        option-label="fio" label="Выберите пользователя"/>
              <div v-if="user" class="q-gutter-md q-mb-lg">
                <q-toggle v-model="addUserTime" label="Назначить время"/>
                <q-btn v-if="!addUserTime" @click="addUser" no-caps unelevated  color="primary" class="q-pa-md" label="Добавить сотрудника"/>

              </div>
              <div style="position: fixed;bottom: 20px;" class="q-gutter-md ">
                <q-btn label="Сохранить изменения" class="q-pa-md" no-caps unelevated color="primary" @click="addUsersToOrder"/>
                <q-btn label="Отмена" class="q-pa-md" no-caps unelevated outline color="primary" v-close-popup/>
              </div>
              <div class="" v-if="addUserTime">



                <div class="row q-col-gutter-md q-mb-md">
                  <div class="col-12 col-md-4">
                    <q-date
                      flat
                      @update:modelValue="dateChanged"
                      v-model="selected_time.date"
                      :events="events"
                      class="full-width"
                    />
                  </div>
                  <div class="col-12 col-md-8">
                    <q-scroll-area style="height: 400px">
                    <div class="bg-white q-pa-md q-mb-md" v-for="order in user_work_times.filter(x=>x.date.replaceAll('-','/')===selected_time.date)" :key="item.id">
                      <div class="flex items-center justify-between">
                        <p class="text-bold q-mb-none">Заявка №{{order.order_data.order_number}}</p>
                        <p class="text-bold q-mb-none">{{new Date(order.order_data.order_created).toLocaleDateString()}}</p>
                      </div>
                      <p class="text-bold q-mb-none text-h6 text-blue-7">{{order.order_data.object_number}}</p>
                      <!--            <span class="text-bold"> {{order.object.client.is_panic ? '**' : ''}}</span>-->
                      <p class="q-mb-md text-grey-6">{{order.order_data.object_address}} </p>
                      <div class="flex items-center justify-between q-mb-md">
                        <p class="status q-mb-none" :style="[{color:order.order_data.status_text_color},{background:order.order_data.status_bg_color}]">
                          <span :style="{background:order.order_data.status_text_color}" class="status-dot"></span>
                          {{order.order_data.status_name}}
                        </p>
                        <p class="q-mb-none text-bold ">{{order.order_data.stage_name}}</p>
                      </div>

                      <p class="text-bold text-blue-7">{{user?.fio}}</p>


                      <div class="bg-grey-3 q-pa-sm q-mb-sm" >
                        <p class="no-margin">Назначен на {{new Date(order.date).toLocaleDateString()}}</p>
                        <p class="no-margin">c {{order.start_time}} до {{order.end_time}}</p>
                        <p class="no-margin">{{order.type?.name}}</p>
                      </div>
                    </div>
                    </q-scroll-area>
                  </div>
                </div>

                <div v-if="selected_time.date" class="row q-col-gutter-md">
                  <div class="col-12 flex items-center justify-between">
                    <div class="flex items-center">
                      <p class="title text-bold text-dark q-mb-none q-mr-lg">Назначить время и дату для текущией заявки</p>
                      <q-toggle v-model="addUserFullDay" label="Назначить на весь день"/>
                    </div>

                    <q-btn v-if="addUserFullDay" @click="addUser('fullday')"  no-caps unelevated  color="primary" class="q-pa-md" label="Добавить сотрудника"/>
                  </div>
                  <div v-if="!addUserFullDay" class="col-12 row q-col-gutter-md">
                    <div class="col-3">
                      <q-select outlined :options="time_types" v-model="time_type" option-label="name" label="Тип выезда" />
                    </div>
                    <div class="col-3">
                      <q-select outlined v-if="time_type" :options="time_periods" v-model="start_time" label="Начало" @update:model-value="startTimeChange"/>
                    </div>
                    <div class="col-3">
                      <q-select outlined v-if="start_time" :options="end_periods" v-model="end_time" label="Конец" @update:model-value="endTimeChange"/>
                    </div>
                    <div class="col-3">
                      <q-btn  @click="addUser('selected')" :disable="!time_type || !start_time || !end_time" no-caps unelevated  color="primary" class="q-pa-md" label="Добавить сотрудника"/>
                    </div>
                  </div>

                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div >
      </div>
    </q-card>
  </q-dialog>
  <q-dialog
    v-model="editUserModal"
  >
    <q-card style="width: 700px; max-width: 80vw;">
      <q-card-section>
        <div class="text-h6">Редактирование графика {{selected_users[cur_user].role.name}} {{selected_users[cur_user].fio}}</div>
      </q-card-section>

      <q-card-section class="q-py-none">

        <q-list>
<!--          <q-item>-->
<!--            <q-item-section>-->
<!--              <q-item-label>Тип выезда/Дата</q-item-label>-->
<!--            </q-item-section>-->
<!--            <q-item-section>-->
<!--              <q-item-label>С</q-item-label>-->
<!--            </q-item-section>-->
<!--            <q-item-section>-->
<!--              <q-item-label>По</q-item-label>-->
<!--            </q-item-section>-->
<!--          </q-item>-->

          <q-item v-for="(time,index) in selected_users[cur_user].work_time.filter(x=>x.order_data.order_number===item.number)">
            <q-item-section>
              <q-item-label overline>{{time.type?.name}}</q-item-label>
              <q-item-label caption>{{new Date(time.date).toLocaleDateString()}}</q-item-label>
            </q-item-section>
            <q-item-section>
              <q-item-label>
                <q-select outlined :options="time_periods" v-model="selected_users[cur_user].work_time[index].start_time" label="Начало"/>
              </q-item-label>
            </q-item-section>
            <q-item-section>
              <q-item-label>
                {{selected_users[cur_user].work_time[index].start_time.value}}
                <q-select outlined
                          :options="time_periods.slice(time_periods.indexOf(selected_users[cur_user].work_time[index].start_time)+1, time_periods.length)"
                          v-model="selected_users[cur_user].work_time[index].end_time"
                          label="Конец"/>
              </q-item-label>
            </q-item-section>
          </q-item>

        </q-list>
        <q-btn label="Сохранить изменения" class="q-pa-md" no-caps unelevated color="primary" @click="updateUserTime"/>
      </q-card-section>


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

import { useAuthStore } from 'stores/auth'
import AddButton from "components/AddButton.vue";
const authStore = useAuthStore()

const notify = useNotify
const route = useRoute()
const router = useRouter()
const check_list_editable = ref(false)
const editUserModal = ref(false)
const addFileModal = ref(false)
const cur_user = ref(0)
const selected_users = ref([])
const users = ref([])
const addNewUser = ref(false)
const addUserTime = ref(false)
const addUserFullDay = ref(false)
const chatOpen = ref(false)
const smsOpen = ref(false)
const user = ref(null)
const roles = ref([])
const time_types = ref([])
const time_type = ref(null)
const selected_date = ref(null)
const start_time = ref(null)
const end_time = ref(null)
const role = ref(null)
const item = ref(null)
const selected_user_id = ref(0)
const events = ref([])
const user_work_times = ref([])
const files=ref([
  {
    file:null,
    text:null
  }
]

)
const time_periods = [
  '9:00:00',
  '9:30:00',
  '10:00:00',
  '10:30:00',
  '11:00:00',
  '11:30:00',
  '12:00:00',
  '12:30:00',
  '13:00:00',
  '13:30:00',
  '14:00:00',
  '14:30:00',
  '15:00:00',
  '15:30:00',
  '16:00:00',
  '16:30:00',
  '17:00:00',
  '17:30:00',
  '18:00:00',
  '18:30:00',
  '19:00:00',
  '19:30:00',
  '20:00:00',
  '20:30:00',
]
const selected_time = ref({
  date:null,
  start_time:null,
  end_time:null,
  type:null,
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


const end_periods = computed(()=>{
  if (start_time.value){
    let selected_time_index = time_periods.indexOf(start_time.value)
    return time_periods.slice(selected_time_index+1, time_periods.length)
  }


})

const addFile = async () => {
  is_loading.value = !is_loading.value
  let formData = new FormData()
  //order.value.date_dead_line = order.value.date_dead_line.replaceAll('/','-')

  for (let file of files.value){
    formData.append('files',file.file)
    formData.append('descriptions',file.text)
  }

  const response = await api({
    method: "post",
    url: `/api/data/order_add_file?number=${route.params.number}`,
    data: formData,
    headers: { "Content-Type": "multipart/form-data" },
  })
  console.log(response.data)
  useNotify('positive','Файл добавлен')
  await getItem()
  addFileModal.value = false
  is_loading.value = !is_loading.value

}

// { "start": "2023-08-07T09:00:00", "end": "2023-08-07T16:00:00", "backgroundColor": "#ff0000", "editable": true }
const startTimeChange = () => {
  end_time.value = null
  selected_time.value.start_time = `${start_time.value}`
}


const endTimeChange = () => {

  selected_time.value.end_time = `${end_time.value}`//:00
  selected_time.value.type = time_type.value.id
  console.log(selected_time.value)
}

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
  const response3 = await api(`/api/user/time_types`)
  time_types.value = response3.data
}

const dateChanged =() =>{
  console.log(selected_date)
}

const userSelected = async () => {
  console.log('user selected')
  console.log(user.value)
  user_work_times.value = []
  const user_work_time_response  = await api(`/api/user/work_time?id=${user.value.id}`)
  console.log(user_work_time_response.data)
  events.value = []
  user_work_times.value = user_work_time_response.data
  if (user_work_times.value.length>0){
    user_work_times.value.forEach((el)=>{
      events.value.push(el.date.replaceAll('-','/'))
    })
  }
  // if (user.value.work_time?.length>0){
  //   calendarOptions.value.events = user.value.work_time
  // }else {
  //   calendarOptions.value.events = user.value.events
  // }

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


const addUser = (time_type) => {
  if (time_type === 'fullday'){
    selected_time.value.start_time = '09:00:00'
    selected_time.value.end_time = '20:30:00'
  }
  addUserTime.value = false
  user.value.events = selected_time.value
  user.value.is_new = true
  selected_users.value.push(user.value)
  role.value = null
  user.value = null
  selected_time.value = {
    start_time:null,
    end_time:null,
  }
}
const updateUserTime = async () => {
  is_loading.value = !is_loading.value
  await api.post(`/api/user/update_user_work_time`, selected_users.value[cur_user.value])
  await getItem()
  useNotify('positive','Сохранено')
  editUserModal.value = false
  is_loading.value = !is_loading.value
}

const deleteUser =async (index) => {
  console.log(selected_users.value[index])
  if (selected_users.value[index].is_new){
    selected_users.value.splice(index,1)
  }else {
    const data = {
      user:selected_users.value[index].id,
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
        events:user.events.start_time ? user.events : null

      })
      console.log(user)
    }
  })
  const response = await api.post(`/api/data/order_add_users`, data)
  await getItem()
  useNotify('positive','Сохранено')
  addUserDialog.value = false
}

const addUsersDialogBeforeOpen = () => {
  selected_users.value = item.value.users
  console.log(selected_users.value)
}
const addUsersDialogBeforeHide = () => {
  // calendarOptions.value.events = []
  selected_time.value = {
    date:null,
    start_time:null,
    end_time:null,
    type:null,
    editable: true
  }
  events.value = []
  selected_date.value = null
  selected_users.value = []
  time_type.value = null
  start_time.value = null
  end_time.value = null

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

const changeStage = async (stage_id) => {
  is_loading.value = !is_loading.value
  checkList.value = []
  const response = await api.put(`/api/data/order/${route.params.number}`,{stage_id})
  await getItem()
  is_loading.value = !is_loading.value
}
</script>

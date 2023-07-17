<template>
  <q-layout view="lHh Lpr lFf">
    <header class="q-py-md ">
      <div class="container">
        <div class="rounded-box header">
          <div class="flex items-center justify-between q-mb-sm">
            <img  src="~assets/logo.png">

            <div class="q-gutter-sm">
              <q-btn round unelevated color="grey-3" text-color="dark" >
                <svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M3.33334 18.3335C3.33334 14.6516 6.31811 11.6668 10 11.6668C13.6819 11.6668 16.6667 14.6516 16.6667 18.3335H15C15 15.5721 12.7614 13.3335 10 13.3335C7.23858 13.3335 5.00001 15.5721 5.00001 18.3335H3.33334ZM10 10.8335C7.23751 10.8335 5.00001 8.596 5.00001 5.8335C5.00001 3.071 7.23751 0.833496 10 0.833496C12.7625 0.833496 15 3.071 15 5.8335C15 8.596 12.7625 10.8335 10 10.8335ZM10 9.16683C11.8417 9.16683 13.3333 7.67516 13.3333 5.8335C13.3333 3.99183 11.8417 2.50016 10 2.50016C8.15834 2.50016 6.66668 3.99183 6.66668 5.8335C6.66668 7.67516 8.15834 9.16683 10 9.16683Z" fill="black"/>
                </svg>


              </q-btn>
              <q-btn round unelevated color="grey-3" text-color="dark"  >
                <svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M15 8.33317C15 5.57175 12.7614 3.33317 10 3.33317C7.23858 3.33317 5.00001 5.57175 5.00001 8.33317V14.9998H15V8.33317ZM16.6667 15.5554L17 15.9998C17.1381 16.1839 17.1008 16.4451 16.9167 16.5832C16.8446 16.6373 16.7568 16.6665 16.6667 16.6665H3.33334C3.10322 16.6665 2.91667 16.4799 2.91667 16.2498C2.91667 16.1597 2.94591 16.0719 3.00001 15.9998L3.33334 15.5554V8.33317C3.33334 4.65127 6.3181 1.6665 10 1.6665C13.6819 1.6665 16.6667 4.65127 16.6667 8.33317V15.5554ZM7.91667 17.4998H12.0833C12.0833 18.6504 11.1506 19.5832 10 19.5832C8.84942 19.5832 7.91667 18.6504 7.91667 17.4998Z" fill="black"/>
                </svg>
                <q-badge v-if="auth_store.user.notifications.filter(x=>x.is_new).length>0" rounded  color="negative" floating :label="auth_store.user.notifications.filter(x=>x.is_new).length"/>
                <q-menu  :offset="[0, 10]" >
                  <q-list  style="min-width: 400px" >
                    <q-item  v-for="n in auth_store.user.notifications" :key="n.id">
                      <q-item-section side>{{new Date(n.created_at).toLocaleString()}}</q-item-section>
                      <q-item-section @click="$router.push(n.link)" style="border-bottom: 1px dashed #11173E;cursor: pointer"
                                      :class="{'text-bold':n.is_new}">{{n.text}}</q-item-section>
                      <q-item-section side><q-btn icon="delete" @click="delN(n.id)" color="red" flat dense round/></q-item-section>
                    </q-item>

                  </q-list>
                </q-menu>

              </q-btn>
            </div>
          </div>
          <div style="margin-bottom: 0px" class="separator"></div>
          <q-tabs v-model="tab" align="left" indicator-color="primary" narrow-indicator active-color="primary">
            <q-route-tab v-show="link.is_enabled" :ripple="false" v-for="(link,index) in menu_links"  no-caps :name="link.tab_name" :label="link.name" :to="`/${link.url}`"  />
          </q-tabs>
        </div>

<!--        <div class="flex items-center justify-between">-->

<!--        </div>-->
      </div>

    </header>
    <q-page-container>
        <div class="container">
          <router-view />
        </div>


    </q-page-container>
  </q-layout>
</template>
<script>
import { useAuthStore } from 'stores/auth'
//import Header from "components/Header";
export default {
  //components: {Header},
  preFetch({store, redirect}) {
    const auth_store = useAuthStore(store)
    if (!auth_store.loggedIn) {
      redirect({path: '/login'})
    }
    if (auth_store.user.is_driving) {
      redirect({path: '/worker'})
    }
  },
}
</script>
<script setup>
import {ref} from "vue";
import { useAuthStore } from 'stores/auth'
import {api} from "boot/axios";
const auth_store = useAuthStore()
const tab = ref('orders')
const menu_links = ref([
  {tab_name:'orders',name:'Заявки',url:'orders',is_enabled:true},
  {tab_name:'objects',name:'Объекты',url:'objects',is_enabled:true},
  {tab_name:'users',name:'Сотрудники',url:'users',is_enabled:true},
  {tab_name:'equipment',name:'Оборудование',url:'equipment',is_enabled:true},
  {tab_name:'models',name:'Модели',url:'equipment/models',is_enabled:true},
  {tab_name:'checklists',name:'Чеклисты',url:'order/checklists',is_enabled:true},
  {tab_name:'clients',name:'Заказчики',url:'clients',is_enabled:true},
  {tab_name:'stats',name:'Cтатистика',url:'stats',is_enabled:true},

])

const delN = async (id) => {
  await api(`/api/user/del_notify?n_id=${id}`)
  await auth_store.getUser()
}


</script>

<style lang="sass">
.main-wrapper
  display: grid
  grid-template-areas: "menu content"
  grid-template-columns: 280px auto
  padding: 24px
  gap: 24px
  height: 100vh


.menu-wrapper
  grid-area: menu
  padding: 40px 0
  height: calc(100vh - 48px)
  position: fixed
  top: 24px
  width: 280px

.menu
  &-item
    position: relative
    display: flex
    align-items: center
    justify-content: start
    gap: 10px
    padding: 13px 40px
    cursor: pointer
    font-weight: 500
    font-size: 18px
    transition: all 0.2s linear
    color: #919398
    &:hover
      background: #EFF1F6
      color: $dark
    &-active
      color: $dark
      &::before
        position: absolute
        content: ''
        left: 0
        top: 0
        bottom: 0
        width: 5px
        background: $primary
        border-radius: 0px 15px 15px 0px


.button-wrapper
  padding: 0 40px

.content
  grid-area: content
</style>

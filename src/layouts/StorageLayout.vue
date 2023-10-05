<template>
  <q-layout view="lHh Lpr lFf">
    <header class="header">
      <div class="container  q-py-md">
        <div class="flex items-center justify-between">
          <Logo/>
          <div class="flex items-center">
            <q-btn round unelevated  text-color="dark" class="q-mr-lg" >
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M12 3C10.2098 3 8.49293 3.71116 7.22706 4.97703C5.96119 6.2429 5.25003 7.95979 5.25003 9.75V13.3522L3.80328 16.9718C3.75781 17.0856 3.74093 17.2088 3.7541 17.3306C3.76728 17.4525 3.81012 17.5693 3.87887 17.6707C3.94762 17.7722 4.04019 17.8552 4.14848 17.9126C4.25677 17.9701 4.37747 18 4.50003 18H9.00003C9.00003 19.6628 10.3373 21 12 21C13.6628 21 15 19.6628 15 18H19.5C19.6226 18 19.7433 17.9701 19.8516 17.9126C19.9599 17.8552 20.0524 17.7722 20.1212 17.6707C20.1899 17.5693 20.2328 17.4525 20.246 17.3306C20.2591 17.2088 20.2423 17.0856 20.1968 16.9718L18.75 13.3522V9.75C18.75 7.95979 18.0389 6.2429 16.773 4.97703C15.5071 3.71116 13.7902 3 12 3ZM13.5 18C13.5 18.834 12.834 19.5 12 19.5C11.166 19.5 10.5 18.834 10.5 18H13.5ZM6.75003 9.75C6.75003 8.35761 7.30315 7.02226 8.28772 6.03769C9.27229 5.05312 10.6076 4.5 12 4.5C13.3924 4.5 14.7278 5.05312 15.7123 6.03769C16.6969 7.02226 17.25 8.35761 17.25 9.75V13.4963C17.2499 13.5915 17.268 13.686 17.3033 13.7745L18.3923 16.5H5.60778L6.69678 13.7745C6.73195 13.6862 6.75002 13.592 6.75003 13.497V9.75Z" fill="white"/>
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
            <div class="flex items-center cursor-pointer" @click="$router.push(`/users/${auth_store.user.uuid}`)">
              <q-avatar size="40px" class="q-mr-md">
                <img v-if="auth_store.user.avatar" :src="auth_store.user.avatar">
                <img v-else src="https://placehold.co/300">
              </q-avatar>
              <div class="">

                <p class="text-white text-bold no-margin">{{auth_store.user.fio}}</p>
                <p class="text-grey-5 text-caption no-margin">{{auth_store.user.role.name}}</p>
              </div>


            </div>
          </div>
        </div>

      </div>
      <q-separator style="background:#6B6E81" />
      <div class="container q-py-md">
        <div class="flex items-center">
          <router-link v-show="link.is_enabled" exact-active-class="active" :to="link.url" class="link"  v-for="(link,index) in menu_links" :key="index">
            <span v-html="link.icon"></span>
            <p class="no-margin">{{link.name}}</p>
          </router-link>

        </div>
      </div>
    </header>

    <header style="display: none" class="q-py-md ">
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
import {computed, onBeforeMount, ref} from "vue";
import { useAuthStore } from 'stores/auth'
import {api} from "boot/axios";
import Logo from "components/Logo.vue";
const auth_store = useAuthStore()
const tab = ref('index')
const menu_links = ref([
  {tab_name:'index',name:'index',url:'/storage',is_enabled:true,icon:``},

])
const user = computed(()=>{
  return auth_store.user
})

// onBeforeMount(()=>{
//   try{
//     user.value.role.pages.forEach((el)=>{
//       console.log(el)
//       menu_links.value.find(x=>x.url===el.page.url).is_enabled = el.permission.can_open
//     })
//   }catch (e) {
//     console.log(e)
//   }
//
// })

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


.header
  background: #51556B
  margin-bottom: 32px
.link
  opacity: .4
  display: flex
  align-items: center
  gap: 8px
  margin-right: 25px
  cursor: pointer
  transition: opacity .2s linear
  span
    display: inline-flex
    align-items: center
    justify-content: center
  p
    font-weight: 600
    color: #fff
  &.active
    opacity: 1
  &:hover
    opacity: 1
</style>

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
const tab = ref('orders')
const timerInterval = ref(null)
const menu_links = ref([
  {tab_name:'orders',name:'Заявки',url:'/service/order',is_enabled:true,icon:`<svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
<g clip-path="url(#clip0_51_113)">
<path d="M15.8459 5.89092C15.2738 4.32655 13.4051 3.80942 12.1166 4.66567L10.3904 3.23255C10.857 1.71764 9.76703 0.0512372 8.07244 0.00208092C6.32725 -0.0485441 5.12275 1.65042 5.60913 3.23052L3.88172 4.66461C2.55384 3.78221 0.637564 4.36792 0.120251 5.98974C-0.357624 7.48796 0.649876 8.95639 2.0625 9.21055L2.73084 11.6086C1.53741 12.6361 1.56638 14.6125 2.96422 15.5622C4.34903 16.5029 6.179 15.8257 6.71722 14.3682H9.27859C9.83631 15.8955 11.7794 16.5348 13.1477 15.4785C14.4655 14.4612 14.3998 12.5275 13.2019 11.5567L13.8919 9.21839C15.373 8.98236 16.4048 7.4193 15.8459 5.89089V5.89092ZM9.17488 12.9935H6.82269C6.55994 11.702 5.29397 10.8265 3.99541 11.0256L3.44884 9.06433C4.77613 8.5303 5.36038 6.96849 4.77766 5.70764L6.36134 4.39289C7.28519 5.19652 8.70431 5.20646 9.63691 4.39396L11.222 5.70992C10.6408 6.96727 11.2243 8.5023 12.5089 9.04733L11.9284 11.0147C10.6431 10.8542 9.43291 11.7394 9.17488 12.9935Z" fill="white"/>
</g>
<defs>
<clipPath id="clip0_51_113">
<rect width="16" height="16" fill="white"/>
</clipPath>
</defs>
</svg>
`},
  {tab_name:'objects',name:'Объекты',url:'/service/object',is_enabled:true,icon:`<svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
<path d="M14 7.22179V12.9999C14 13.2651 13.8946 13.5195 13.7071 13.707C13.5196 13.8946 13.2652 13.9999 13 13.9999H10.5C10.2348 13.9999 9.98043 13.8946 9.79289 13.707C9.60536 13.5195 9.5 13.2651 9.5 12.9999V10.4999C9.5 10.3673 9.44732 10.2401 9.35355 10.1464C9.25979 10.0526 9.13261 9.99991 9 9.99991H7C6.86739 9.99991 6.74021 10.0526 6.64645 10.1464C6.55268 10.2401 6.5 10.3673 6.5 10.4999V12.9999C6.5 13.2651 6.39464 13.5195 6.20711 13.707C6.01957 13.8946 5.76522 13.9999 5.5 13.9999H3C2.73478 13.9999 2.48043 13.8946 2.29289 13.707C2.10536 13.5195 2 13.2651 2 12.9999V7.22179C1.99998 7.08339 2.02869 6.94649 2.08431 6.81976C2.13993 6.69303 2.22125 6.57922 2.32312 6.48554L7.32312 1.76804L7.33 1.76116C7.51409 1.59375 7.75398 1.50098 8.00281 1.50098C8.25164 1.50098 8.49154 1.59375 8.67562 1.76116C8.67776 1.76361 8.68005 1.76591 8.6825 1.76804L13.6825 6.48554C13.7834 6.57971 13.8636 6.69374 13.9183 6.82045C13.9729 6.94716 14.0007 7.0838 14 7.22179Z" fill="white"/>
</svg>
`},
  {tab_name:'users',name:'Сотрудники',url:'/service/users',is_enabled:true,icon:`<svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
<path d="M8.00008 9.99992C5.05341 9.99992 2.66675 11.1933 2.66675 12.6666V13.9999H13.3334V12.6666C13.3334 11.1933 10.9467 9.99992 8.00008 9.99992ZM5.33341 5.99992C5.33341 6.70716 5.61437 7.38544 6.11446 7.88554C6.61456 8.38563 7.29284 8.66659 8.00008 8.66659C8.70733 8.66659 9.3856 8.38563 9.8857 7.88554C10.3858 7.38544 10.6667 6.70716 10.6667 5.99992M7.66675 1.33325C7.46675 1.33325 7.33342 1.47325 7.33342 1.66659V3.66659H6.66675V1.99992C6.66675 1.99992 5.16675 2.57325 5.16675 4.49992C5.16675 4.49992 4.66675 4.59325 4.66675 5.33325H11.3334C11.3001 4.59325 10.8334 4.49992 10.8334 4.49992C10.8334 2.57325 9.33342 1.99992 9.33342 1.99992V3.66659H8.66675V1.66659C8.66675 1.47325 8.54008 1.33325 8.33342 1.33325H7.66675Z" fill="white"/>
</svg>
`},
  {tab_name:'equipment',name:'Оборудование',url:'/service/equipment',is_enabled:true,icon:`<svg width="14" height="14" viewBox="0 0 14 14" fill="none" xmlns="http://www.w3.org/2000/svg">
<g clip-path="url(#clip0_51_101)">
<path d="M13.5597 4.55547C13.6472 4.79336 13.5734 5.05859 13.3847 5.22813L12.2007 6.30547C12.2308 6.53242 12.2472 6.76484 12.2472 7C12.2472 7.23516 12.2308 7.46758 12.2007 7.69453L13.3847 8.77187C13.5734 8.94141 13.6472 9.20664 13.5597 9.44453C13.4394 9.76992 13.2945 10.0816 13.1277 10.3824L12.9992 10.6039C12.8187 10.9047 12.6164 11.1891 12.3949 11.457C12.2336 11.6539 11.9656 11.7195 11.725 11.643L10.2019 11.159C9.83551 11.4406 9.43082 11.6758 8.99879 11.8535L8.65699 13.4148C8.6023 13.6637 8.4109 13.8605 8.15933 13.9016C7.78199 13.9645 7.39371 13.9973 6.99722 13.9973C6.60074 13.9973 6.21246 13.9645 5.83511 13.9016C5.58355 13.8605 5.39215 13.6637 5.33746 13.4148L4.99566 11.8535C4.56363 11.6758 4.15894 11.4406 3.79254 11.159L2.27222 11.6457C2.0316 11.7223 1.76363 11.6539 1.6023 11.4598C1.38082 11.1918 1.17847 10.9074 0.998005 10.6066L0.869489 10.3852C0.702693 10.0844 0.557771 9.77266 0.437458 9.44727C0.349958 9.20938 0.423786 8.94414 0.612458 8.77461L1.79644 7.69727C1.76636 7.46758 1.74996 7.23516 1.74996 7C1.74996 6.76484 1.76636 6.53242 1.79644 6.30547L0.612458 5.22813C0.423786 5.05859 0.349958 4.79336 0.437458 4.55547C0.557771 4.23008 0.702693 3.91836 0.869489 3.61758L0.998005 3.39609C1.17847 3.09531 1.38082 2.81094 1.6023 2.54297C1.76363 2.34609 2.0316 2.28047 2.27222 2.35703L3.79527 2.84102C4.16168 2.55938 4.56636 2.32422 4.9984 2.14648L5.34019 0.585156C5.39488 0.336328 5.58629 0.139453 5.83785 0.0984375C6.21519 0.0328125 6.60347 0 6.99996 0C7.39644 0 7.78472 0.0328125 8.16207 0.0957031C8.41363 0.136719 8.60504 0.333594 8.65972 0.582422L9.00152 2.14375C9.43355 2.32148 9.83824 2.55664 10.2046 2.83828L11.7277 2.3543C11.9683 2.27773 12.2363 2.34609 12.3976 2.54023C12.6191 2.8082 12.8214 3.09258 13.0019 3.39336L13.1304 3.61484C13.2972 3.91562 13.4421 4.22734 13.5625 4.55273L13.5597 4.55547ZM6.99996 9.1875C7.58012 9.1875 8.13652 8.95703 8.54675 8.5468C8.95699 8.13656 9.18746 7.58016 9.18746 7C9.18746 6.41984 8.95699 5.86344 8.54675 5.4532C8.13652 5.04297 7.58012 4.8125 6.99996 4.8125C6.4198 4.8125 5.8634 5.04297 5.45316 5.4532C5.04293 5.86344 4.81246 6.41984 4.81246 7C4.81246 7.58016 5.04293 8.13656 5.45316 8.5468C5.8634 8.95703 6.4198 9.1875 6.99996 9.1875Z" fill="white"/>
</g>
<defs>
<clipPath id="clip0_51_101">
<rect width="14" height="14" fill="white"/>
</clipPath>
</defs>
</svg>
`},
  // {tab_name:'models',name:'Модели',url:'/equipment/models',is_enabled:false,icon:``},
  {tab_name:'checklists',name:'Чеклисты',url:'/service/order/checklists',is_enabled:true,icon:`<svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
<path d="M7.99992 14.6666C4.31802 14.6666 1.33325 11.6818 1.33325 7.99992C1.33325 4.31802 4.31802 1.33325 7.99992 1.33325C11.6818 1.33325 14.6666 4.31802 14.6666 7.99992C14.6666 11.6818 11.6818 14.6666 7.99992 14.6666ZM7.33498 10.6666L12.0491 5.95254L11.1063 5.00973L7.33498 8.78098L5.44939 6.89532L4.50658 7.83818L7.33498 10.6666Z" fill="white"/>
</svg>
`},
  {tab_name:'clients',name:'Заказчики',url:'/service/clients',is_enabled:true,icon:`<svg width="16" height="14" viewBox="0 0 16 14" fill="none" xmlns="http://www.w3.org/2000/svg">
<path d="M2.4 6.20015C3.2825 6.20015 4 5.48265 4 4.60015C4 3.71765 3.2825 3.00015 2.4 3.00015C1.5175 3.00015 0.8 3.71765 0.8 4.60015C0.8 5.48265 1.5175 6.20015 2.4 6.20015ZM13.6 6.20015C14.4825 6.20015 15.2 5.48265 15.2 4.60015C15.2 3.71765 14.4825 3.00015 13.6 3.00015C12.7175 3.00015 12 3.71765 12 4.60015C12 5.48265 12.7175 6.20015 13.6 6.20015ZM14.4 7.00015H12.8C12.36 7.00015 11.9625 7.17765 11.6725 7.46515C12.68 8.01765 13.395 9.01515 13.55 10.2001H15.2C15.6425 10.2001 16 9.84265 16 9.40015V8.60015C16 7.71765 15.2825 7.00015 14.4 7.00015ZM8 7.00015C9.5475 7.00015 10.8 5.74765 10.8 4.20015C10.8 2.65265 9.5475 1.40015 8 1.40015C6.4525 1.40015 5.2 2.65265 5.2 4.20015C5.2 5.74765 6.4525 7.00015 8 7.00015ZM9.92 7.80015H9.7125C9.1925 8.05015 8.615 8.20015 8 8.20015C7.385 8.20015 6.81 8.05015 6.2875 7.80015H6.08C4.49 7.80015 3.2 9.09015 3.2 10.6801V11.4001C3.2 12.0626 3.7375 12.6001 4.4 12.6001H11.6C12.2625 12.6001 12.8 12.0626 12.8 11.4001V10.6801C12.8 9.09015 11.51 7.80015 9.92 7.80015ZM4.3275 7.46515C4.0375 7.17765 3.64 7.00015 3.2 7.00015H1.6C0.7175 7.00015 0 7.71765 0 8.60015V9.40015C0 9.84265 0.3575 10.2001 0.8 10.2001H2.4475C2.605 9.01515 3.32 8.01765 4.3275 7.46515Z" fill="white"/>
</svg>
`},
  {tab_name:'stats',name:'Cтатистика',url:'/service/stats',is_enabled:true,icon:`<svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
<path d="M3.25 15.5H2.25C2.05109 15.5 1.86032 15.421 1.71967 15.2803C1.57902 15.1397 1.5 14.9489 1.5 14.75V10.25C1.5 10.0511 1.57902 9.86032 1.71967 9.71967C1.86032 9.57902 2.05109 9.5 2.25 9.5H3.25C3.44891 9.5 3.63968 9.57902 3.78033 9.71967C3.92098 9.86032 4 10.0511 4 10.25V14.75C4 14.9489 3.92098 15.1397 3.78033 15.2803C3.63968 15.421 3.44891 15.5 3.25 15.5ZM10.25 15.5H9.25C9.05109 15.5 8.86032 15.421 8.71967 15.2803C8.57902 15.1397 8.5 14.9489 8.5 14.75V7.25C8.5 7.05109 8.57902 6.86032 8.71967 6.71967C8.86032 6.57902 9.05109 6.5 9.25 6.5H10.25C10.4489 6.5 10.6397 6.57902 10.7803 6.71967C10.921 6.86032 11 7.05109 11 7.25V14.75C11 14.9489 10.921 15.1397 10.7803 15.2803C10.6397 15.421 10.4489 15.5 10.25 15.5ZM13.75 15.5H12.75C12.5511 15.5 12.3603 15.421 12.2197 15.2803C12.079 15.1397 12 14.9489 12 14.75V3.75C12 3.55109 12.079 3.36032 12.2197 3.21967C12.3603 3.07902 12.5511 3 12.75 3H13.75C13.9489 3 14.1397 3.07902 14.2803 3.21967C14.421 3.36032 14.5 3.55109 14.5 3.75V14.75C14.5 14.9489 14.421 15.1397 14.2803 15.2803C14.1397 15.421 13.9489 15.5 13.75 15.5ZM6.75 15.5H5.75C5.55109 15.5 5.36032 15.421 5.21967 15.2803C5.07902 15.1397 5 14.9489 5 14.75V1.25C5 1.05109 5.07902 0.860322 5.21967 0.71967C5.36032 0.579018 5.55109 0.5 5.75 0.5H6.75C6.94891 0.5 7.13968 0.579018 7.28033 0.71967C7.42098 0.860322 7.5 1.05109 7.5 1.25V14.75C7.5 14.9489 7.42098 15.1397 7.28033 15.2803C7.13968 15.421 6.94891 15.5 6.75 15.5Z" fill="white"/>
</svg>
`},
  {tab_name:'calendar',name:'Календарь по пользователям',url:'/service/order/calendar',is_enabled:true,icon:``},
  {tab_name:'order_calendar',name:'Календарь по заявкам',url:'/service/order/order_calendar',is_enabled:true,icon:``},
  {tab_name:'history',name:'История',url:'/service/history',is_enabled:true,icon:``},

])
const user = computed(()=>{
  return auth_store.user
})

onBeforeMount(()=>{

  user.value.role.pages.forEach((el)=>{
    console.log(el)
    menu_links.value.find(x=>x.url===el.page.url).is_enabled = el.permission.can_open
  })
  timer()
})

function timer(){
  timerInterval.value = setInterval( async function(){
    await auth_store.getUser()
  }, 5000)
}

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

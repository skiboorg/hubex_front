<template>
<!--  :class="{'bg-grey-3':!user.is_new}"-->
  <div class="user-card" >
    <div class="row q-col-gutter-sm">
      <div :class="is_order_card ? 'col-5' : 'col-3'">
        <q-avatar size="56px" class="q-mr-md ">
          <img v-if="user.avatar" :src="user.avatar">
          <img v-else src="https://placehold.co/300">
        </q-avatar>
      </div>
      <div :class="is_order_card ? 'col-7' : 'col-9'">
        <p style="line-height: 100%"  class="q-mb-xs text-body1 text-weight-bolder ">{{user.fio}}</p>
        <p class="q-mb-none text-body2 text-grey-5 text-bold">{{user.role.name}}</p>
      </div>

      <div class="">

      </div>

    </div>
    <div v-if="is_order_card" class="user-bottom">
      <div class="" v-for="time_item in time ">
        <p class="no-margin">Тип выезда: {{time_item.type?.name}}</p>
        <p class="no-margin" v-if="time_item.date"> Дата: {{new Date(time_item.date).toLocaleDateString()}}</p>
        <p class="no-margin" v-else>Дата не назначена</p>
        <p class="no-margin" v-if="time_item.start_time">с {{time_item.start_time}} до {{time_item.end_time}} </p>
        <p class="no-margin" v-else>Время не назначено</p>
        <q-separator spaced="md"/>
      </div>

    </div>
    <div v-else class="user-bottom">
      <p class="q-mb-sm flex items-center text-weight-regular text-dark text-body2">   <svg class="q-mr-sm" width="18" height="18" viewBox="0 0 18 18" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path d="M7.52819 3.98713L8.01495 4.85933C8.45423 5.64644 8.27789 6.67899 7.58604 7.37085C7.58603 7.37085 7.58603 7.37085 7.58603 7.37085C7.58592 7.37097 6.74694 8.21016 8.26839 9.73161C9.78918 11.2524 10.6283 10.4148 10.6291 10.414C10.6292 10.4139 10.6292 10.414 10.6292 10.4139C11.321 9.72211 12.3536 9.54578 13.1407 9.98505L14.0129 10.4718C15.2014 11.1351 15.3418 12.8019 14.2971 13.8466C13.6693 14.4744 12.9003 14.9629 12.0502 14.9951C10.6191 15.0493 8.18871 14.6872 5.75078 12.2492C3.31285 9.81129 2.95066 7.38092 3.00491 5.94982C3.03714 5.0997 3.5256 4.33068 4.15335 3.70292C5.19807 2.65821 6.86488 2.79858 7.52819 3.98713Z" stroke="#232323" stroke-width="1.5" stroke-linecap="round"/>
      </svg>

        {{user.email}}</p>
      <p class="q-mb-none flex items-center text-weight-regular text-dark text-body2">
        <svg class="q-mr-sm" width="18" height="14" viewBox="0 0 18 14" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M1.5 7C1.5 4.17157 1.5 2.75736 2.37868 1.87868C3.25736 1 4.67157 1 7.5 1H10.5C13.3284 1 14.7426 1 15.6213 1.87868C16.5 2.75736 16.5 4.17157 16.5 7C16.5 9.82843 16.5 11.2426 15.6213 12.1213C14.7426 13 13.3284 13 10.5 13H7.5C4.67157 13 3.25736 13 2.37868 12.1213C1.5 11.2426 1.5 9.82843 1.5 7Z" stroke="#232323" stroke-width="1.5"/>
          <path d="M4.5 4L6.11917 5.34931C7.49665 6.49721 8.18539 7.07116 9 7.07116C9.81461 7.07116 10.5034 6.49721 11.8808 5.34931L13.5 4" stroke="#232323" stroke-width="1.5" stroke-linecap="round"/>
        </svg>
        {{user.phone}}
      </p>
    </div>
  </div>
</template>
<script setup>
const props = defineProps(['user', 'is_order_card','time'])
</script>

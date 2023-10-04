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
        {{user.phone}}
        </p>
      <p class="q-mb-sm flex items-center text-weight-regular text-dark text-body2">
        <svg class="q-mr-sm" width="18" height="14" viewBox="0 0 18 14" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M1.5 7C1.5 4.17157 1.5 2.75736 2.37868 1.87868C3.25736 1 4.67157 1 7.5 1H10.5C13.3284 1 14.7426 1 15.6213 1.87868C16.5 2.75736 16.5 4.17157 16.5 7C16.5 9.82843 16.5 11.2426 15.6213 12.1213C14.7426 13 13.3284 13 10.5 13H7.5C4.67157 13 3.25736 13 2.37868 12.1213C1.5 11.2426 1.5 9.82843 1.5 7Z" stroke="#232323" stroke-width="1.5"/>
          <path d="M4.5 4L6.11917 5.34931C7.49665 6.49721 8.18539 7.07116 9 7.07116C9.81461 7.07116 10.5034 6.49721 11.8808 5.34931L13.5 4" stroke="#232323" stroke-width="1.5" stroke-linecap="round"/>
        </svg>
        {{user.email}}
      </p>
      <p class="q-mb-none flex items-center text-weight-regular text-dark text-body2">
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M11.944 3.26667e-05C8.77112 0.0148396 5.73324 1.28566 3.4949 3.53449C1.25656 5.78332 -3.4549e-05 8.82711 7.12435e-10 12C7.12441e-10 15.1826 1.26428 18.2349 3.51472 20.4853C5.76516 22.7357 8.8174 24 12 24C15.1826 24 18.2348 22.7357 20.4853 20.4853C22.7357 18.2349 24 15.1826 24 12C24 8.81743 22.7357 5.76519 20.4853 3.51475C18.2348 1.26431 15.1826 3.26667e-05 12 3.26667e-05C11.9813 -1.08889e-05 11.9627 -1.08889e-05 11.944 3.26667e-05ZM16.906 7.22403C17.006 7.22203 17.227 7.24703 17.371 7.36403C17.4667 7.44713 17.5277 7.56311 17.542 7.68903C17.558 7.78203 17.578 7.99503 17.562 8.16103C17.382 10.059 16.6 14.663 16.202 16.788C16.034 17.688 15.703 17.989 15.382 18.018C14.686 18.083 14.157 17.558 13.482 17.116C12.426 16.423 11.829 15.992 10.804 15.316C9.619 14.536 10.387 14.106 11.062 13.406C11.239 13.222 14.309 10.429 14.369 10.176C14.376 10.144 14.383 10.026 14.313 9.96403C14.243 9.90203 14.139 9.92303 14.064 9.94003C13.958 9.96403 12.271 11.08 9.003 13.285C8.523 13.615 8.09 13.775 7.701 13.765C7.273 13.757 6.449 13.524 5.836 13.325C5.084 13.08 4.487 12.951 4.539 12.536C4.566 12.32 4.864 12.099 5.432 11.873C8.93 10.349 11.262 9.34403 12.43 8.85903C15.762 7.47303 16.455 7.23203 16.906 7.22403Z" fill="black"/>
        </svg>
        {{user.telega }}
      </p>
    </div>
  </div>
</template>
<script setup>
const props = defineProps(['user', 'is_order_card','time'])
</script>

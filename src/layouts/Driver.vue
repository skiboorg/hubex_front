<template>
  <q-layout view="hHh Lpr lff">
    <q-header class="bg-white text-dark">
      <q-toolbar>
        <q-btn v-if="$route.path !== '/worker'" @click="$router.back()" icon="chevron_left" round flat class="q-mr-md"   />
        <q-btn v-else round @click="drawerOpen=!drawerOpen" :icon="drawerOpen ? 'close':'menu'" flat class="q-mr-md"   />
        <div class="flex items-center" >
          <q-avatar size="32px" class="q-mr-md">
            <img :src="auth.user?.avatar">
          </q-avatar>
          <p class="no-margin">
            <span>{{auth.user?.fio}}</span><br>
            <span class="text-caption">{{auth.user?.role.name}}</span>
          </p>

        </div>


      </q-toolbar>

    </q-header>
    <q-drawer
      v-model="drawerOpen"
      side="left"
      overlay
      behavior="desktop"
      class="bg-white text-dark"
    >
      <q-list separator>
        <q-item to="/worker">
          <q-item-section>Мои заявки</q-item-section>
          <q-item-section side><q-icon size="15px" name="arrow_forward"/></q-item-section>
        </q-item>
        <q-item to="/worker">
          <q-item-section>Мой календарь</q-item-section>
          <q-item-section side><q-icon size="15px" name="arrow_forward"/></q-item-section>
        </q-item>
      </q-list>
    </q-drawer>
    <q-page-container>
      <router-view />
    </q-page-container>
  </q-layout>
</template>
<script setup>
import {ref} from "vue";

const drawerOpen = ref(false)
</script>

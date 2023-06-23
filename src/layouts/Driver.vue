<template>
  <q-layout view="lHh Lpr lFf">
    <q-header>
      <q-toolbar>
        <q-btn v-if="$route.path !== '/worker'" @click="$router.back()" icon="chevron_left" flat   />
        <q-toolbar-title>
          <span>{{auth.user?.fio}}</span><br>
          <span class="text-caption">{{auth.user?.role.name}}</span>
        </q-toolbar-title>
        <q-space/>
        <q-btn icon="menu" dense flat round/>
      </q-toolbar>

    </q-header>
    <q-page-container>
      <router-view />
    </q-page-container>
  </q-layout>
</template>
<script setup>
</script>

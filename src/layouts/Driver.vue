<template>
  <q-layout view="lHh Lpr lFf">
    <q-header>
      <q-toolbar>
        <q-toolbar-title>
          <span>{{auth.user?.fio}}</span><br>
          <span class="text-caption">{{auth.user?.role.name}}</span>
        </q-toolbar-title>
        <q-space/>
        <q-btn icon="menu"/>
      </q-toolbar>

    </q-header>
    <q-page-container>
      <router-view />
    </q-page-container>
  </q-layout>
</template>
<script setup>
</script>

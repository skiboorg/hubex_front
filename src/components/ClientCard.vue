<template>

  <div class="user-card" >

      <div class="is_order_card ? 'col-7' : 'col-9'">
        <p style="line-height: 100%"  class="q-mb-xs text-body1 text-weight-bolder ">{{client.name}}</p>
      </div>

  </div>
</template>
<script setup>
const props = defineProps(['client',])
</script>

<template>
  <div id="app">
    <transition name="fade"
      mode="out-in">
      <router-view class="view"></router-view>
    </transition>
  </div>
</template>

<script lang="ts">
export default {
  name: 'App'
}
</script>

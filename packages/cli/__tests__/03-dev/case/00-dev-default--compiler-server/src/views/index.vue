<template>
<div>
  <p id="test1">{{ text1 }}</p>
  <p id="state">{{ stateTest }}</p>
  <p id="hasUser">{{ hasUser }}</p>
</div>
</template>

<script>
import { dispatch, getGetter, getState } from '../store'

export default {
  async asyncData({ store, locals: { test } }) {
    await dispatch(store, 'FETCH_USER', { test })
  },
  data() {
    return {
      text1: 'home Page'
    }
  },
  computed: {
    stateTest() {
      return getState(this.$store, 'user', 'test')
    },
    hasUser() {
      return getGetter(this.$store, 'hasUser')
    }
  }
}
</script>

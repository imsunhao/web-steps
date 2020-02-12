<template>
<div>
  <p id="test1">{{ text1 }}</p>
  <p id="state">{{ stateTest }}</p>
  <p id="hasUser">{{ hasUser }}</p>
  <p id="count">{{ count + '' }}</p>
  <button id="add" @click="add">+</button>
</div>
</template>

<script>
import { dispatch, getGetter, getState, commit } from '../store'

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
    count() {
      return getState(this.$store, 'count')
    },
    hasUser() {
      return getGetter(this.$store, 'hasUser')
    }
  },
  methods: {
    add() {
      commit(this.$store, 'ADD_NUMBER', 1)
    }
  }
}
</script>

<template>
<div>
  <p id="test1">{{ text1 }}</p>
  <p id="test2">{{ text2 }}</p>
  <p id="test3">{{ text3 }}</p>
  <p id="state">{{ stateTest }}</p>
  <p id="hasUser">{{ hasUser }}</p>
  <p id="count">{{ count + '' }}</p>
  <p id="get">{{ get + '' }}</p>
  <p id="post">{{ post + '' }}</p>
  <button id="add" @click="add">+</button>
  <p id="context">INJECT_CONTEXT: {{ INJECT_CONTEXT }}</p>
</div>
</template>

<script>
import { hostGlobal } from '../envs'
import { dispatch, getGetter, getState, commit } from '../store'
import onlyClient from '../../local_modules/only-client'
import onlyClient2 from '../../local_modules/only-client-2'

export default {
  async asyncData({ store, locals: { test } }) {
    await Promise.all([
      dispatch(store, 'FETCH_USER', { test }),
      dispatch(store, 'API_POST', undefined),
      dispatch(store, 'API_GET', undefined)
    ])
  },
  data() {
    return {
      text1: 'home Page',
      text2: onlyClient(),
      text3: onlyClient2(),
      INJECT_CONTEXT: hostGlobal.__INJECT_CONTEXT__
    }
  },
  computed: {
    stateTest() {
      return getState(this.$store, 'user', 'test')
    },
    count() {
      return getState(this.$store, 'count')
    },
    get() {
      return getState(this.$store, 'api', 'get')
    },
    post() {
      return getState(this.$store, 'api', 'post')
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


<style lang="scss">
#test1 {
  color: red;
}
</style>

<style>
@import '../css/test.css';
</style>

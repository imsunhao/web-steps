<template>
<div>
  <p id="test1">{{ text1 }}</p>
  <p id="test2">{{ text2 }}</p>
  <p id="state">{{ stateTest }}</p>
  <p id="hasUser">{{ hasUser }}</p>
  <p id="count">{{ count + '' }}</p>
  <p id="get">{{ get + '' }}</p>
  <p id="post">{{ post + '' }}</p>
  <button id="add" @click="add">+</button>
  <img :src="imgSrc" alt="logo">
</div>
</template>

<script>
import { dispatch, getGetter, getState, commit } from '../store'
import onlyClient from '../../local_modules/only-client'
import { getPublicAssets } from '../helpers'

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
      text2: onlyClient()
    }
  },
  computed: {
    imgSrc() {
      return getPublicAssets('home', 'home.svg')
    },
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

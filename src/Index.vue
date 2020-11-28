<template>
  <div id='index'>
    <app-header/>
    <index-sign-in v-if='mode === "signIn"' v-on:changeMode='changeMode' v-on:successSignIn='successSignIn'/>
    <index-sign-up v-else-if='mode === "signUp"'/>
  </div>
</template>

<script>
import AppHeader from './components/AppHeader.vue'
import IndexSignIn from './components/IndexSignIn.vue'
import IndexSignUp from './components/IndexSignUp.vue'

export default {
  name: 'index',
  data: function() {
    return {
      mode: 'signIn'
    }
  },
  components: {
    AppHeader: AppHeader,
    IndexSignIn: IndexSignIn,
    IndexSignUp: IndexSignUp
  },
  methods: {
    changeMode: function(arg) {
      this.mode = arg
    },
    successSignIn: function(arg) {
      this.$emit('successSignIn', arg)
    }
  }
}
</script>

<style>

</style>
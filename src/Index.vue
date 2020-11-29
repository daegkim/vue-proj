<template>
  <div id='index'>
    <app-header/>
    <index-sign-in v-if='mode === "signIn"' v-on:changeMode='changeMode' v-on:successSignIn='successSignIn'/>
    <index-sign-up v-else-if='mode === "signUp"' v-on:changeMode='changeMode'/>
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
      console.log(arg)
      this.mode = arg
    },
    successSignIn: function(arg) {
      console.log(arg)
      this.$emit('successSignIn', arg)
    }
  }
}
</script>

<style>

</style>
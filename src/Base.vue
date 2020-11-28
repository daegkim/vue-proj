<template>
  <div id='base'>
    <router-view v-on:successSignIn='successSignIn' v-bind:userId=userId></router-view>
  </div>
</template>

<script>
export default {
  name: 'BaseElem',
  data: function() {
    return {
      isLogin: false,
      userId: ''
    }
  },
  methods: {
    successSignIn: function(arg) {
      this.userId = arg
      this.$router.push({
        name: 'App'
      })
    }
  }
}
</script>

<style>
#base {
  font-family: 'Avenir', Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
  margin-top: 60px;
}
</style>
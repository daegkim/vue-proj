<template>
  <div id='app-form'>
    <form v-on:submit.prevent='addMemo'>
      <input v-model='memo' type="text" name="memo" id="inputMemo">
      <button type="submit">save</button>
    </form>
  </div>
</template>

<script>
import axios from 'axios'

export default {
  name: 'AppForm',
  props: ['propUserId', 'propMemoList'],
  data: function() {
    return {
      memo: ''
    }
  },
  methods: {
    addMemo: function() {
      if(this.memo === ''){
        return
      }

      this.$emit('addMemo', this.memo)
      this.memo = ''
    }
  }
}
</script>

<style>

</style>
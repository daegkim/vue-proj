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

      let priority = this.propMemoList[this.propMemoList.length - 1].priority + 1
      let tmpMemo = {
        memo: this.memo,
        isDone: false,
        changeMode: false,
        priority: priority,
        canFocusOut: true
      }
      this.$emit('addMemo', tmpMemo)
      this.memo = ''
    }
  }
}
</script>

<style>

</style>
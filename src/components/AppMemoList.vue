<template>
  <div id='app-memo-list'>
    <ul>
      <li v-for='(v, idx) in memoList' v-bind:key='idx' 
      draggable='true' 
      v-on:dragstart='dragStart($event, idx)'
      v-on:drop='drop($event, idx)'
      v-on:dragover.prevent>
        <input v-model='v.isDone' v-on:change='changeDone(idx)' type='checkbox' name='isDone'>
        <p v-if='!v.changeMode' v-on:dblclick='startChange(idx)' v-bind:class='{done: v.isDone}'>{{ v.memo }}</p>
        <input v-else v-on:keyup='endChange($event, idx)' v-model='v.memo'
        v-focus
        v-on:focusout='v.canFocusOut ? focusOut($event, idx) : null' type="text">
      </li>
    </ul>
  </div>
</template>

<script>
export default {
  name: 'AppMemoList',
  props: ['propMemoList'],
  data: function() {
    return {
      oldMemoList: undefined
    }
  },
  computed: {
    memoList: function() {
      return this.propMemoList
    }
  },
  directives: {
    focus: {
      inserted: function(el) {
        el.focus()
      }
    }
  },
  methods: {
    reportChange: function(prop, idx) {
      this.$emit('reportChange', {
        prop: prop,
        idx: idx
      })
    },
    changeDone: function(idx) {
      this.reportChange('changeDone', idx)
    },
    startChange: function(idx) {
      if(this.memoList.length !== 0){
        this.oldMemoList = []
      }

      for(let i in this.memoList){
        if(this.memoList[i].changeMode) {
          this.memoList[i].changeMode = false
        }
        if(idx === parseInt(i)){
          this.memoList[i].changeMode = true
          this.memoList[i].canFocusOut = true
        }

        let tmpMemo = {
          priority: this.memoList[i].priority,
          memo: this.memoList[i].memo,
          isDone: this.memoList[i].isDone,
          changeMode: this.memoList[i].changeMode,
          canFocusOut: this.memoList[i].canFocusOut
        }
        this.oldMemoList.push(tmpMemo)
      }
    },
    endChange: function(e, idx) {
      if(e.keyCode === 13) {
        this.memoList[idx].canFocusOut = false
        this.memoList[idx].changeMode = false
        this.reportChange('endChange', idx)
      }
    },
    dragStart: function(e, idx) {
      e.dataTransfer.setData('srcMemoKey', idx)
    },
    drop: function(e, trgtIdx) {
      var srcIdx = parseInt(e.dataTransfer.getData('srcMemoKey'))
      if(trgtIdx === srcIdx) {
        return
      }
      let srcPriority = this.memoList[srcIdx].priority
      let trgtPriority = this.memoList[trgtIdx].priority

      this.memoList[trgtIdx].priority = srcPriority
      this.memoList[srcIdx].priority = trgtPriority
      this.reportChange('changePriority', [srcPriority, trgtPriority])
    },
    focusOut: function(e, idx) {
      console.log(e)
      this.memoList[idx].changeMode = false
      this.memoList[idx].memo = this.oldMemoList[idx].memo
    }
  }
}
</script>

<style>
#app-memo-list p {
  margin: 0px;
  display: inline-block;
}

#app-memo-list input {
  display: inline-block;
}

.done {
  text-decoration: line-through;
}
</style>
<template>
  <div id='app-memo-list'>
    <ul>
      <li v-for='(v, idx) in propMemoList' v-bind:key='idx' 
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

    <button v-on:click='showModal=true'>Clear All</button>
    <modal v-if='showModal'>
      <h3 slot='header'>Caution</h3>
      <p slot='body' style='white-space: nowrap'>
        Are you sure you want to delete everything?
        <br>
        Unable to recover.
      </p>
      <div slot='footer'>
        <button class='modal-default-button' v-on:click='showModal=false'>CANCEL</button>
        <button class='modal-default-button' v-on:click='okModal' style='margin-right: 5px'>OK</button>
      </div>
    </modal>

  </div>
</template>

<script>
import Modal from './common/Modal.vue'

export default {
  name: 'AppMemoList',
  props: ['propMemoList'],
  components: {
    Modal: Modal
  },
  data: function() {
    return {
      oldMemoList: undefined,
      showModal: false
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
      console.log(idx)
      if(this.propMemoList.length !== 0){
        this.oldMemoList = []
      }

      for(let i in this.propMemoList){
        if(this.propMemoList[i].changeMode) {
          this.propMemoList[i].changeMode = false
        }
        if(idx === parseInt(i)){
          this.propMemoList[i].changeMode = true
          this.propMemoList[i].canFocusOut = true
        }

        let tmpMemo = {
          priority: this.propMemoList[i].priority,
          memo: this.propMemoList[i].memo,
          isDone: this.propMemoList[i].isDone,
          changeMode: this.propMemoList[i].changeMode,
          canFocusOut: this.propMemoList[i].canFocusOut
        }
        this.oldMemoList.push(tmpMemo)
      }
    },
    endChange: function(e, idx) {
      if(e.keyCode === 13) {
        this.propMemoList[idx].canFocusOut = false
        this.propMemoList[idx].changeMode = false
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
      let srcPriority = this.propMemoList[srcIdx].priority
      let trgtPriority = this.propMemoList[trgtIdx].priority

      this.propMemoList[trgtIdx].priority = srcPriority
      this.propMemoList[srcIdx].priority = trgtPriority
      this.reportChange('changePriority', [srcPriority, trgtPriority])
    },
    focusOut: function(e, idx) {
      this.propMemoList[idx].changeMode = false
      this.propMemoList[idx].memo = this.oldMemoList[idx].memo
    },
    okModal: function() {
      this.reportChange('clearMemoList')
      this.showModal = false
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
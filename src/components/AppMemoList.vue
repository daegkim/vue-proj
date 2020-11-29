<template>
  <div id='app-memo-list'>
    <h4>ongoing</h4>
    <ul>
      <li v-for='(v, idx) in propOngoingMemoList' v-bind:key='idx' 
      draggable='true' 
      v-on:dragstart='dragStart($event, idx)'
      v-on:drop='drop($event, idx)'
      v-on:dragover.prevent>
        <input v-model='v.isDone' v-on:change='changeDone($event, "ongoing", idx)' type='checkbox' name='isDone'>
        <p v-if='!v.changeMode' v-on:dblclick='startChange(idx)' v-bind:class='{done: v.isDone}'>{{ v.memo }}</p>
        <input v-else v-on:keyup='endChange($event, idx)' v-model='v.memo'
        v-focus
        v-on:focusout='v.canFocusOut ? focusOut($event, idx) : null'
        type="text"
        v-on:input='inputEvent'>
      </li>
    </ul>

    <h4>done</h4>
    <ul>
      <li v-for='(v, idx) in propDoneMemoList' v-bind:key='idx'>
        <input v-model='v.isDone' v-on:change='changeDone($event, "done", idx)' type='checkbox' name='isDone'>
        <p class='done'>{{ v.memo }}</p>
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
  props: ['propMemoList', 'propDoneMemoList', 'propOngoingMemoList'],
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
      inserted: (el) => {
        el.focus()
        this.a.methods.resizableInput(el)
      }
    }
  },
  mounted: function() {

  },
  methods: {
    reportChange: function(prop, idx) {
      this.$emit('reportChange', {
        prop: prop,
        idx: idx
      })
    },
    changeDone: function(e, kind, idx) {
      if(kind === 'ongoing'){
        e.target.checked = false
      }
      else if(kind === 'done'){
        e.target.checked = true
      }
      this.reportChange('changeDone', idx)
    },
    startChange: function(idx) {
      if(this.propOngoingMemoList.length !== 0){
        this.oldMemoList = []
      }

      for(let i in this.propOngoingMemoList){
        if(this.propOngoingMemoList[i].changeMode) {
          this.propOngoingMemoList[i].changeMode = false
        }
        if(idx === parseInt(i)){
          this.propOngoingMemoList[i].changeMode = true
          this.propOngoingMemoList[i].canFocusOut = true
        }

        let tmpMemo = {
          priority: this.propOngoingMemoList[i].priority,
          memo: this.propOngoingMemoList[i].memo,
          isDone: this.propOngoingMemoList[i].isDone,
          changeMode: this.propOngoingMemoList[i].changeMode,
          canFocusOut: this.propOngoingMemoList[i].canFocusOut
        }
        this.oldMemoList.push(tmpMemo)
      }
    },
    endChange: function(e, idx) {
      if(e.keyCode === 13) {
        this.propOngoingMemoList[idx].canFocusOut = false
        this.propOngoingMemoList[idx].changeMode = false
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
      let srcPriority = this.propOngoingMemoList[srcIdx].priority
      let trgtPriority = this.propOngoingMemoList[trgtIdx].priority

      this.propOngoingMemoList[trgtIdx].priority = srcPriority
      this.propOngoingMemoList[srcIdx].priority = trgtPriority
      this.reportChange('changePriority', [srcIdx, trgtIdx])
    },
    focusOut: function(e, idx) {
      this.propOngoingMemoList[idx].changeMode = false
      this.propOngoingMemoList[idx].memo = this.oldMemoList[idx].memo
    },
    okModal: function() {
      this.reportChange('clearMemoList')
      this.showModal = false
    },
    inputEvent: function(e) {
      this.resizableInput(e.target)
    },
    resizableInput: function(el) {
      let virtualDom = document.createElement('div')
      virtualDom.setAttribute('id', 'virtual-dom')
      virtualDom.innerText = el.value
      document.getElementById('app-memo-list').appendChild(virtualDom)

      el.style.width = String(document.getElementById('virtual-dom').offsetWidth) + 'px'

      virtualDom.innerText = ''
      document.getElementById('virtual-dom').remove()
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
  text-align: center;
}

.done {
  text-decoration: line-through;
}

#virtual-dom {
  display: inline-block;
  visibility: hidden;
  margin: 0px;
  padding: 0px;
}

#app-memo-list ul {
  list-style-type: none;
  padding: 0;
}
</style>
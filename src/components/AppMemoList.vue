<template>
  <div id='app-memo-list'>
    <h4>ongoing</h4>
    <ul id='ongoing-memo-list'>
      <li v-for='(v, idx) in propOngoingMemoList' v-bind:key='idx' 
      draggable='true' 
      v-on:dragstart='dragStart($event, idx)'
      v-on:drop='drop($event, idx)'
      v-on:dragover.prevent>
        <input v-model='v.isDone' v-on:change='changeDone($event, "ongoing", idx)' type='checkbox' name='isDone'>

        <p v-if='!v.changeMode'
        v-on:touchstart='touchStartEvent($event, idx)'
        v-on:touchmove.prevent='touchMoveEvent' 
        v-on:touchend='touchEndEvent($event, idx)'
        v-on:touchcancel='touchEndEvent'
        v-on:dblclick='startChange(idx)' 
        v-bind:class='{done: v.isDone}'>{{ v.memo }}</p>
        
        <input v-else
        v-on:keyup='endChange($event, idx)'
        v-model='v.memo'
        v-focus
        v-on:focus='focusOn($event, idx)'
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
    focusOn: function(e, idx) {
      e.preventDefault()
      this.resizableInput(e.target)
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

      el.style.width = String(document.getElementById('virtual-dom').offsetWidth + 10) + 'px'

      virtualDom.innerText = ''
      document.getElementById('virtual-dom').remove()
    },
    touchStartEvent: function(e, idx) {
      let preTime = this.propOngoingMemoList[idx].touchStartTime
      console.log(preTime)
      this.propOngoingMemoList[idx].touchStartTime = new Date()
      if((this.propOngoingMemoList[idx].touchStartTime - preTime) < 250) {       
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
      }
    },
    touchMoveEvent: function(e) {
      if(document.getElementById('shadow-p') !== null){
        let elem = document.getElementById('shadow-p')
        elem.style.top = String(e.changedTouches[0].clientY - 30) + 'px'
        elem.style.left = String(e.changedTouches[0].clientX - 20) + 'px'
        return
      }
      var elem = document.createElement('p')
      elem.innerText = e.target.innerText
      elem.setAttribute('id', 'shadow-p')
      elem.style.position = 'absolute'
      elem.style.opacity = '0.4'
      elem.style.top = String(e.changedTouches[0].clientY - 30) + 'px'
      elem.style.left = String(e.changedTouches[0].clientX - 20) + 'px'

      document.getElementById('app').append(elem)
    },
    touchEndEvent: function(e, srcIdx) {
      if(e.cancelable) {
        e.preventDefault()
      }

      if(document.getElementById('shadow-p') !== null){
        document.getElementById('shadow-p').remove()
      }

      var children = document.querySelectorAll('#ongoing-memo-list li p')
      //p가 input으로 바뀐게 있으면 이동시키지 말아야 함
      if(children.length !== this.propOngoingMemoList.length){
        return
      }
      let trgtIdx = 0
      for(let child of children){
        var destRect = child.getBoundingClientRect()
        var destHeight = child.offsetHeight;
        var destWidth = child.offsetWidth;
        var rangeX = [destRect.x, destRect.x + destWidth]
        var rangeY = [destRect.y, destRect.y + destHeight]

        if(e.changedTouches[0].clientX >= rangeX[0] && e.changedTouches[0].clientX <= rangeX[1]
        && e.changedTouches[0].clientY >= rangeY[0] && e.changedTouches[0].clientY <= rangeY[1]){
          if(srcIdx === trgtIdx) {
            break
          }
          let srcPriority = this.propOngoingMemoList[srcIdx].priority
          let trgtPriority = this.propOngoingMemoList[trgtIdx].priority

          this.propOngoingMemoList[trgtIdx].priority = srcPriority
          this.propOngoingMemoList[srcIdx].priority = trgtPriority
          this.reportChange('changePriority', [srcIdx, trgtIdx])
        }
        trgtIdx += 1
      }
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

#app-memo-list li {
  margin-bottom: 10px;
}
</style>
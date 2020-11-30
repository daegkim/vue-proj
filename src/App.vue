<template>
  <div id="app">
    <app-header/>
    <app-form v-bind:propUserId='propUserId'
    v-bind:propMemoList='sortedOngoingMemoList'
    v-on:addMemo='addMemo'/>
    <app-memo-list v-bind:propOngoingMemoList='sortedOngoingMemoList'
    v-bind:propDoneMemoList='sortedDoneMemoList'
    v-on:reportChange='reportChange'/>
  </div>
</template>

<script>
import axios from 'axios'

import AppHeader from './components/AppHeader.vue'
import AppForm from './components/AppForm.vue'
import AppMemoList from './components/AppMemoList.vue'

export default {
  name: 'app',
  data: function() {
    return {
      msg: 'Welcome to Your Vue.js App',
      ongoingMemoList: [],
      doneMemoList: []
    }
  },
  props: ['propUserId'],
  computed: {
    sortedOngoingMemoList: function() {
      this.ongoingMemoList.sort(function(a, b) {
        if(a.priority > b.priority) return -1
        else if(a.priority === b.priority) return 0
        else if(a.priority < b.priority) return 1
      })
      return this.ongoingMemoList
    },
    sortedDoneMemoList: function() {
      this.doneMemoList.sort(function(a, b) {
        if(a.priority > b.priority) return -1
        else if(a.priority === b.priority) return 0
        else if(a.priority < b.priority) return 1
      })
      return this.doneMemoList
    }
  },
  components: {
    AppHeader: AppHeader,
    AppForm: AppForm,
    AppMemoList: AppMemoList
  },
  created: function() {
    this.getMemoList()
  },
  methods: {
    addMemo: function(arg) {
      let self = this
      axios({
        method: 'post',
        baseURL: 'http://localhost:3000',
        url: '/memo/createMemo',
        data: {
          userId: self.propUserId,
          memo: arg
        }
      })
      .then(function(res) {
        self.ongoingMemoList.push({
          memoId: res.data.memoId,
          memo: res.data.memo,
          priority: res.data.priority,
          isDone: res.data.isDone,
          changeMode: false,
          canFocusOut: false
        })
      })
    },
    getMemoList: function() {
      let self = this
      axios({
        method: 'post',
        url: 'http://localhost:3000/memo/getMemoList',
        data: {
          userId: self.propUserId
        }
      })
      .then(function(res) {
        for(let i in res.data){
          let tmpMemo = {
            memoId: res.data[i].memoId,
            priority: res.data[i].priority,
            memo: res.data[i].memo,
            isDone: res.data[i].isDone,
            changeMode: false,
            canFocusOut: true
          }

          if(res.data[i].isDone === undefined || !res.data[i].isDone){
            self.ongoingMemoList.push(tmpMemo)
          }
          else{
            self.doneMemoList.push(tmpMemo)
          }

          /*
          self.$watch속성 부여. 나중에 사용할 일이 있을 것 같아서 주석처리함.
          self.$watch('memoList.' + i + '.isDone', function(newVal, oldVal) {
            if(oldVal === undefined) {
              return
            }
            console.log('save memo')
          }, {deep: true})

          self.$watch('memoList.' + i + '.changeMode', function(newVal, oldVal) {
            if(oldVal === undefined) {
              return
            }

            if(oldVal && !newVal){
              console.log('save memo')
            }

          }, {deep: true})
          */
        }
      })
    },
    setEditData: function(arg) {
      let selectedMemo = this.ongoingMemoList[arg.idx]
      let selectedDoneMemo = this.doneMemoList[arg.idx]
      let data = {}
      let action = ''

      switch(arg.prop){
        case 'endChange':
          if(selectedMemo.memo === ''){
            //해당 메모 삭제
            action = 'delete'
            data = {
              memoId: this.ongoingMemoList[arg.idx].memoId
            }
            this.ongoingMemoList.splice(arg.idx, 1)
          }
          else{
            action = 'change'
            data = {
              memoId: selectedMemo.memoId,
              memo: selectedMemo.memo,
              isDone: selectedMemo.isDone,
              priority: selectedMemo.priority
            }
          }
          break
        case 'changeDone':
          if(selectedMemo !== undefined && selectedMemo.isDone){
            let jsonStr = JSON.stringify(selectedMemo)
            let tmpMemo = JSON.parse(jsonStr)

            action = 'change'
            data = {
              memoId: selectedMemo.memoId,
              memo: selectedMemo.memo,
              isDone: selectedMemo.isDone,
              priority: selectedMemo.priority
            }

            
            this.ongoingMemoList.splice(arg.idx, 1)
            this.doneMemoList.push(tmpMemo)
          }
          else if(selectedDoneMemo !== undefined && !selectedDoneMemo.isDone){
            let jsonStr = JSON.stringify(selectedDoneMemo)
            let tmpMemo = JSON.parse(jsonStr)

            action = 'change'
            data = {
              memoId: selectedDoneMemo.memoId,
              memo: selectedDoneMemo.memo,
              isDone: selectedDoneMemo.isDone,
              priority: selectedDoneMemo.priority
            }

            this.doneMemoList.splice(arg.idx, 1)
            this.ongoingMemoList.push(tmpMemo)
          }
          break
        case 'changePriority':
          action = 'change'
          data = [
          {
            memoId: this.ongoingMemoList[arg.idx[0]].memoId,
            memo: this.ongoingMemoList[arg.idx[0]].memo,
            isDone: this.ongoingMemoList[arg.idx[0]].isDone,
            priority: this.ongoingMemoList[arg.idx[0]].priority
          },
          {
            memoId: this.ongoingMemoList[arg.idx[1]].memoId,
            memo: this.ongoingMemoList[arg.idx[1]].memo,
            isDone: this.ongoingMemoList[arg.idx[1]].isDone,
            priority: this.ongoingMemoList[arg.idx[1]].priority
          }
          ]
          break
        case 'clearMemoList':
          this.ongoingMemoList = []
          this.doneMemoList = []
          action = 'delete'
          data = {
            memoId: null
          }
          break
      }

      return {
        action: action,
        data: data
      }
    },
    reportChange: function(arg) {
      let editData = this.setEditData(arg)
      let actionUrl = ''
      
      if(editData.action === 'change'){
        actionUrl = 'http://localhost:3000/memo/updateMemo'
      }
      else if(editData.action === 'delete'){
        actionUrl = 'http://localhost:3000/memo/deleteMemo'
      }
      axios({
        url: actionUrl,
        method: 'post',
        data: editData.data
      })
      .then(function(res) {
        console.log(res)
      })
      //axios로 서버에 요청하여 서버에서 케이스 별로 데이터 수정
    }
  }
}
</script>

<style>

</style>

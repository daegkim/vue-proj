<template>
  <div id="app">
    <app-header/>
    <app-form v-bind:propUserId='userId'
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
      userId: 'dgsoul',
      ongoingMemoList: [],
      doneMemoList: []
    }
  },
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
      this.ongoingMemoList.push(arg)
    },
    getMemoList: function() {
      let self = this
      axios({
        method: 'get',
        baseURL: 'https://jsonplaceholder.typicode.com',
        url: '/todos',
        params: {
          userId: 1
        }
      })
      .then(function(res) {
        for(let i in res.data){
          let tmpMemo = {
            priority: parseInt(i),
            memo: res.data[i].title,
            isDone: false,
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
    reportChange: function(arg) {
      console.log(arg.prop)
      let selectedMemo = this.ongoingMemoList[arg.idx]
      let selectedDoneMemo = this.doneMemoList[arg.idx]

      switch(arg.prop){
        case 'endChange':
          console.log(selectedMemo.memo)
          if(selectedMemo.memo === ''){
            this.ongoingMemoList.splice(arg.idx, 1)
          }
          break
        case 'changeDone':
          if(selectedMemo !== undefined && selectedMemo.isDone){
            let jsonStr = JSON.stringify(selectedMemo)
            let tmpMemo = JSON.parse(jsonStr)
            this.ongoingMemoList.splice(arg.idx, 1)
            this.doneMemoList.push(tmpMemo)
          }
          else if(selectedDoneMemo !== undefined && !selectedDoneMemo.isDone){
            selectedDoneMemo = this.doneMemoList[arg.idx]
            let jsonStr = JSON.stringify(selectedDoneMemo)
            let tmpMemo = JSON.parse(jsonStr)
            this.doneMemoList.splice(arg.idx, 1)
            this.ongoingMemoList.push(tmpMemo)
          }
          break
        case 'changePriority':
          console.log(arg.idx)
          break
        case 'clearMemoList':
          this.ongoingMemoList = []
          this.doneMemoList = []
          break
      }
      //axios로 서버에 요청하여 서버에서 케이스 별로 데이터 수정
    }
  }
}
</script>

<style>
#app {
  font-family: 'Avenir', Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
  margin-top: 60px;
}

ul {
  list-style-type: none;
  padding: 0;
}
</style>

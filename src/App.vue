<template>
  <div id="app">
    <app-header/>
    <app-form v-bind:propUserId='userId' v-bind:propMemoList='sortedMemoList' v-on:addMemo='addMemo'/>
    <app-memo-list v-bind:propMemoList='sortedMemoList' v-on:reportChange='reportChange'/>
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
      memoList: []
    }
  },
  computed: {
    sortedMemoList: function() {
      this.memoList.sort(function(a, b) {
        return (a.priority < b.priority) ? (-1) : (a.priority > b.priority ? 1 : 0)
      })
      return this.memoList
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
      this.memoList.push(arg)
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
        let resMemoList = []
        for(let i in res.data){
          let tmpMemo = {
            priority: parseInt(i),
            memo: res.data[i].title,
            isDone: false,
            changeMode: false,
            canFocusOut: true
          }
          resMemoList.push(tmpMemo)

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
        self.memoList = resMemoList
      })
    },
    reportChange: function(arg) {
      console.log(arg.prop)
      switch(arg.prop){
        case 'endChange':
          console.log(this.memoList[arg.idx].memo)
          if(this.memoList[arg.idx].memo === ''){
            this.memoList.splice(arg.idx, 1)
          }
          break
        case 'changeDone':
          console.log(this.memoList[arg.idx].isDone)
          break
        case 'changePriority':
          console.log(arg.idx)
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

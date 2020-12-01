<template>
  <div id='index-sign-in'>
    <form v-on:submit.prevent='requestSignIn'>
      <div style='margin-bottom: 5px'>
        <label for='inputUserId'>ID</label>
        <input v-model='account.userId' type="text" name="userId" id="inputUserId" v-on:focus='initRightFlag'>
        <p v-if='!isRightId' v-bind:style='errorStyle'>wrong ID</p>
      </div>
      <div style='margin-bottom: 20px'>
        <label for='inputUserPwd'>PWD</label>
        <input v-model='account.userPwd' type="password" name="userPwd" id="inputUserPwd" v-on:focus='initRightFlag'>
        <p v-if='!isRightPwd' v-bind:style='errorStyle'>wrong password</p>
      </div>
      <button type="submit">Sign In</button>
    </form>
    <p v-on:click='changeMode'>Would you like to sign up?</p>
  </div>
</template>

<script>
import crypto from 'crypto'
import axios from 'axios'

export default {
  name: 'IndexSignIn',
  data: function() {
    return {
      account: {
        userId: '',
        userPwd: '',
      },
      isRightId: true,
      isRightPwd: true,
      errorStyle: {
        color: 'red',
        fontSize: '10px',
        cursor: 'auto',
        margin: '0px'
      }
    }
  },
  computed: {
    sha512UserPwd: function() {
      return crypto.createHash('sha512').update(this.account.userPwd).digest('base64')
    }
  },
  methods: {
    requestSignIn: function() {
      //axios로 로그인 성공여부를 확인한 후에 성공이면 path이동 실패면 에러 팝업
      //path이동시 id값을 어떻게 vue객체에게 전달해 줄 것인가?
      //Base가 가지고 있을 수 있는가? 가능하다. 그럼 전달하3
      var url = ''
      if(process.env.NODE_ENV === 'production'){
        url = '/signin'
      }
      else if(process.env.NODE_ENV === 'development'){
        url = 'http://localhost:3000/signin'
      }
      
      var self = this
      axios({
        url: url,
        method: 'post',
        data: {
          userId: this.account.userId,
          userPwd: this.sha512UserPwd,
        }
      })
      .then(function(res) {
        if(res.data.userId === null){
          if(res.data.error === 'userId'){
            self.isRightId = false
          }
          else if(res.data.error === 'userPwd'){
            self.isRightPwd = false
          }
          return
        }
        self.$emit('successSignIn', res.data.userId)
      })
      .catch(function(exception) {
        
      })
    },
    changeMode: function() {
      this.$emit('changeMode', 'signUp')
    },
    initRightFlag: function() {
      this.isRightId = true
      this.isRightPwd = true
    }
  }
}
</script>

<style>
#index-sign-in label {
  width: 40px;
  text-align: right;
  display: inline-block;
}

#index-sign-in p {
  margin: 5px 0px 0px 0px;
  font-size: 12px;
  color: green;
  cursor: pointer;
}
</style>
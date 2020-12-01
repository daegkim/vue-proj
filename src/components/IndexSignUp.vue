<template>
  <div id='index-sign-up'>
    <h3>Sign Up</h3>
    <form v-on:submit.prevent='requestSignUp'>
      <div style='margin-bottom: 5px'>
        <label for='inputUserId'>ID</label>
        <input v-model='account.userId' type="text" name="userId" id="inputUserId" v-on:focusout='checkIdExist'>
        <p v-if='validIdLen'>It must be longer than 6 digits.</p>
        <p v-if='!validIdLen && !validIdExist' style='color: green'>good!!</p>
        <p v-if='!validIdLen && validIdExist'>The ID already exists</p>
      </div>
      <div style='margin-bottom: 5px'>
        <label for='inputUserPwd'>PWD</label>
        <input v-model='account.userPwd' type="password" name="userPwd" id="inputUserPwd" v-on:paste.prevent>
        <p v-if='validPwdLen'>It must be longer than 8 digits.</p>
        <p v-else-if='!validPwdLen' style='color: green'>good!!</p>
      </div>
      <div style='margin-bottom: 20px'>
        <label for='inputUserPwd'>PWD(*)</label>
        <input v-model='account.userChkPwd' type="password" name="userChkPwd" id="inputChkUserPwd" v-on:paste.prevent>
        <p v-if='validPwdSame && !validPwdLen'>The two passwords do not match.</p>
        <p v-else-if='!validPwdSame && !validPwdLen' style='color: green'>good!!</p>
        <p v-else-if='validPwdLen' style='color: red'>It must be longer than 8 digits.</p>
      </div>
      <button type="submit">Sign Up</button>
    </form>
  </div>
</template>

<script>
import crypto from 'crypto'
import axios from 'axios'

export default {
  name: 'IndexSignUp',
  data: function() {
    return {
      account: {
        userId: '',
        userPwd: '',
        userChkPwd: ''
      },
      validIdExist: false
    }
  },
  computed: {
    sha512UserPwd: function() {
      return crypto.createHash('sha512').update(this.account.userPwd).digest('base64')
    },
    sha512UserChkPwd: function() {
      return crypto.createHash('sha512').update(this.account.userChkPwd).digest('base64')
    },
    validPwdLen: function() {
      if(this.account.userPwd.length >= 8){
        return false
      }
      else{
        return true
      }
    },
    validPwdSame: function() {
      if(this.account.userPwd === this.account.userChkPwd){
        return false
      }
      else{
        return true
      }
    },
    validIdLen: function() {
      if(this.account.userId.length >= 6){
        return false
      }
      else{
        return true
      }
    }
  },
  methods: {
    requestSignUp: function() {
      //axios로 회원가입 성공 후
      //성공했으면 다시 모드 변경
      var self = this

      var url = ''
      if(process.env.NODE_ENV === 'production'){
        url = '/signup'
      }
      else if(process.env.NODE_ENV === 'development'){
        url = 'http://localhost:3000/signup'
      }

      axios({
        url: url,
        method: 'post',
        data: {
          userId: self.account.userId,
          userPwd: self.sha512UserPwd,
          userChkPwd: self.sha512UserChkPwd
        }
      })
      .then(function(res) {
        console.log(res.data)
        if(res.data !== null){
          self.initAccount()
          if(res.data === 'error'){
            alert('The two passwords do not match.')
          }
          else{
            alert('The ID already exists.')
          }
          return
        }
        self.$emit('changeMode', 'signIn')
        self.initAccount()
      })
      .catch(function(exception) {
        console.log(exception)
      })
    },
    changeMode: function() {
      this.$emit('changeMode', 'signIn')
    },
    initAccount: function() {
      this.account.userId = ''
      this.account.userPwd = ''
      this.account.userChkPwd = ''
    },
    checkIdExist: function() {
      var self = this
      axios({
        url: 'http://localhost:3000/checkid',
        method: 'post',
        data: {
          userId: self.account.userId,
        }
      })
      .then(function(res) {
        console.log(res.data)
        if(res.data !== null){
          console.log(self.validIdExist)
          self.validIdExist = true
        }
        else{
          self.validIdExist = false
        }
      })
      .catch(function(exception) {
        console.log(exception)
      })
    }
  }
}
</script>

<style>
#index-sign-up label {
  width: 50px;
  text-align: right;
  display: inline-block;
}

#index-sign-up p {
  color: red;
  margin: 0px;
  font-size: 10px;
}
</style>
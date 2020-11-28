<template>
  <div id='index-sign-up'>
    <h3>Sign Up</h3>
    <form v-on:submit.prevent='requestSignUp'>
      <div style='margin-bottom: 5px'>
        <label for='inputUserId'>ID</label>
        <input v-model='account.userId' type="text" name="userId" id="inputUserId"
        v-on:input='validId("id")'>
        <p v-if='validIdLen' style='color: red'>It must be longer than 6 digits.</p>
        <p v-else-if='!validIdLen' style='color: green'>good!!</p>
      </div>
      <div style='margin-bottom: 5px'>
        <label for='inputUserPwd'>PWD</label>
        <input v-model='account.userPwd' type="password" name="userPwd" id="inputUserPwd" v-on:paste.prevent>
        <p v-if='validPwdLen' style='color: red'>It must be longer than 8 digits.</p>
        <p v-else-if='!validPwdLen' style='color: green'>good!!</p>
      </div>
      <div style='margin-bottom: 20px'>
        <label for='inputUserPwd'>PWD(*)</label>
        <input v-model='account.userChkPwd' type="password" name="userChkPwd" id="inputChkUserPwd" v-on:paste.prevent>
        <p v-if='validPwdSame' style='color: red'>The two passwords do not match.</p>
        <p v-else-if='!validPwdSame' style='color: green'>good!!</p>
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
      }
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
      return this.validUserPwd()
    },
    validPwdSame: function() {
      return this.validChkUserPwd()
    },
    validIdLen: function() {
      return this.validUserId()
    }
  },
  methods: {
    requestSignUp: function() {
      //axios로 회원가입 성공 후
      //성공했으면 다시 모드 변경
      var self = this
      axios({
        url: '/signup',
        method: 'post',
        data: {
          userId: this.account.userId,
          userPwd: this.sha512UserPwd,
          userChkPwd: this.sha512UserChkPwd
        }
      })
      .then(function(res) {
        self.$emit('changeMode', 'signIn')
        self.initAccount()
      })
      .catch(function(exception) {
        console.log(exception)
        self.$emit('changeMode', 'signIn')
      })
    },
    changeMode: function() {
      this.$emit('changeMode', 'signIn')
    },
    validUserPwd: function() {
      if(this.account.userPwd.length >= 8){
        return false
      }
      else{
        return true
      }
      this.validChkUserPwd()
    },
    validChkUserPwd: function() {
      if(this.account.userPwd === this.account.userChkPwd && this.account.userPwd.length >= 8){
        return false
      }
      else{
        return true
      }
    },
    validUserId: function() {
      if(this.account.userId.length >= 6){
        return false
      }
      else{
        return true
      }
    },
    initAccount: function() {
      this.account.userId = ''
      this.account.userPwd = ''
      this.account.userChkPwd = ''
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
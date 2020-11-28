<template>
  <div id='index-sign-in'>
    <form v-on:submit.prevent='requestSignIn'>
      <div style='margin-bottom: 5px'>
        <label for='inputUserId'>ID</label>
        <input v-model='account.userId' type="text" name="userId" id="inputUserId">
      </div>
      <div style='margin-bottom: 20px'>
        <label for='inputUserPwd'>PWD</label>
        <input v-model='account.userPwd' type="password" name="userPwd" id="inputUserPwd">
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
        userPwd: ''
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
      axios({
        url: '/signin',
        method: 'post',
        data: {
          userId: this.account.userId,
          userPwd: this.sha512UserPwd
        }
      })
      .then(function(res) {
        this.$emit('successSignIn', this.account.userId)
      })
      .catch(function(exception) {
        
      })
    },
    changeMode: function() {
      this.$emit('changeMode', 'signUp')
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
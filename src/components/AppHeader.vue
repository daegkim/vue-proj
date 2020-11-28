<template>
  <div id='app-header'>
    <h1><a href='./' style='text-decoration: none'>{{ title }}</a></h1>
  </div>
</template>

<script>
export default {
  name: 'AppHeader',
  data: function() {
    return {
      title: 'Memo App'
    }
  }
}
</script>

<style>
#app-header a:link
, #app-header a:visited
, #app-header a:hover {
  text-decoration: none;
  color: black;
}
</style>
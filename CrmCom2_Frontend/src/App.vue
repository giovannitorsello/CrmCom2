<template>
 
  <div id="q-app" class="imgBack">
  
        <div class="absolute-bottom text-subtitle1 text-center">
          
          {{ mode }}
          
        </div>
   
    <router-view />
  </div>
</template>
<script>
export default {
  name: 'App'
}
</script>

<style>
#q-app {
  padding: 10px;
  
  
}
.imgBack{
background-image: url("/icons/sfondoLogin.jpg");
opacity: 1;
z-index: -1;
}

</style>
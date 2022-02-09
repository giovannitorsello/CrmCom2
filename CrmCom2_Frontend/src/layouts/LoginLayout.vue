<template>
  <q-layout view="hHh lpR lFf">
    
    <q-page-container>
      
     
      <router-view />
    </q-page-container>
    
  </q-layout>
</template>

<script>
export default {
  data() {
    return {
      left: false,
      linkImg:'https://placeimg.com/500/300/nature'
    };
  },
  methods: {
    
  }
};
</script>
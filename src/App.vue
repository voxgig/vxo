<template>
<div>
  <h1>TESTBED</h1>

  
  <vxo-canary></vxo-canary>

  <hr>
  <br>

  <div style="padding: 0 10vw;">
  <vxo-slide-select
    v-model="slide"
    :items="[
            {text:'AAA'},
            {text:'BBB'},
            {text:'CCC'},
            {text:'DDD'},
            {text:'EEE'},
            {text:'FFF'},
            {text:'GGG'},
            {text:'HHH'},
            {text:'III'},
            ]"
    :size="3"
    ></vxo-slide-select>
  SLIDE: {{ slide }}
  </div>
  
  <hr>
  <br>

  
</div>
</template>

<script>
export default {
  name: "app",
  data: function() {
    return {
      slide: null
    }
  },
  methods: {
  }
}
</script>

<style>
</style>

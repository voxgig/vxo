<template>
<div>
  <h1>TESTBED</h1>

  
  <vxo-task-box
    :spec="test.taskbox0.spec"
    v-model="test.taskbox0.items"
    >
    <template v-slot:custom.zed="{ item }">
      ZED {{ item.zed }}
    </template>
  </vxo-task-box>

  <hr>
  <br>

  <!--
  <vxo-slide-select
    :items="test.slideselect0.items"
    :size="3"
    v-model="test.slideselect0.index"
    >
  </vxo-slide-select>

  <p>INDEX: {{ test.slideselect0.index }}</p>
  
  <br>
  <hr>
  

  <br>
  <vxo-slide-select
    :range="test.slideselect1.range"
    :size="7"
    v-model="test.slideselect1.index"
    >
    <template v-slot:item={item}>
      <div style="display:flex; flex-flow: column nowrap; justify-content: center;">
        <p>{{ resolve_dow(item) }} </p>
        <p>{{ resolve_day(item) }}</p>
      </div>
    </template>
  </vxo-slide-select>
  INDEX: {{ test.slideselect1.index }} 
  DAY: {{ day_selected(test.slideselect1.index) }}
  <br>

  <hr>
  -->
  
</div>
</template>

<script>
export default {
  name: "app",
  data: function() {
    return {
      test: {
        taskbox0: {
          spec: {
            title: 'Foo',
            text: {
              add_item: 'Add Foo'
            },
            fields: [
              {name:'bar',kind:'text'},
              {name:'zed',kind:'custom'}
            ]
          },
          items: [
            {id:'01', title:'t01', state:'done', bar:'B0', zed:'Z0'},
            {id:'02', title:'t02', state:'todo', bar:'B1', zed:'Z1'},
            {id:'03', title:'t03', state:'todo', bar:'B2', zed:'Z2'},
          ]
        },
        slideselect0: {
          index: 0,
          items: [
            {text:'AAA'},
            {text:'BBB'},
            {text:'CCC'},
            {text:'DDD'},
            {text:'EEE'},
            {text:'FFF'},
            {text:'GGG'},
            {text:'HHH'},
            {text:'III'},
          ]
        },
        slideselect1: {
          index: 109,
          range:this.weeks(15),
        }
      }
    }
  },
  methods: {
    day_selected: function(index) {
      let r = this.test.slideselect1.range
      return this.$Moment().add(index-(Math.floor((1+r.end-r.start)/2)),'days')
    },
    weeks: function(n) {
      var wd = this.$Moment().day()
      return {start:(-7*n)-wd,end:(7*(n+1))-wd}
    },
    resolve_dow: function(item) {
      return this.$Moment().add(item.offset,'days').format('ddd')
    },
    resolve_day: function(item) {
      return this.$Moment().add(item.offset,'days').format('MMM Do')
    }
  }
}
</script>

<style>
.vxo-slide-select-main {
    border:1px solid #333;
}
.vxo-slide-select-item-selected {
    background-color: #ccf;
}
</style>

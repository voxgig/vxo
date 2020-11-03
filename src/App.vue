<template>
<v-app>
  <h1>TESTBED</h1>

    <!--
  <vxo-canary
    :a="a"
    :b="b"
    >
    </vxo-canary>

  a<input v-model="a" /><br />
  b.e<input v-model="b.e" /><br />
  b.f<input v-model="b.f" /><br />
  

  <p style="font-size:1rem">
  9:30: <vxo-time :time="930" /> <br>
  9:30AM: <vxo-time :time="930" clock="MM"/> <br>
  9:30a: <vxo-time :time="930" clock="m"/> <br>
  2:30p: <vxo-time :time="1430" clock="m"/> <br>
  12:00PM: <vxo-time :time="1200" clock="MM"/> <br>
  12:00AM: <vxo-time :time="0" clock="MM"/> <br>
  9:30&ndash;15:15: <vxo-time :time="{start:930, end:1515}" /> <br>
  9:30a&ndash;3:15p: <vxo-time :time="{start:930, end:1515}" clock="m"/> <br>
  </p>
  -->


  <vxo-task-box
    :spec="test.taskbox1.spec"
    v-model="test.taskbox1.items"
    >
  </vxo-task-box>


  <vxo-task-box
    :spec="test.taskbox0.spec"
    v-model="test.taskbox0.items"
    >
    <!--
    <template v-slot:custom.zed="{ item }">
      ZED {{ item.zed }}
    </template>
    -->
    
    <template v-slot:edit.zed="{item, field, name}">
      APP ZED {{ item }} {{ field }} {{ name }}
    </template>

    <!--
    <template v-slot:edit.baz="{task, field}">
      APP BAZ {{ task }} {{ field }}
    </template>
    -->
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
  
</v-app>
</template>

<script>

export default {
  name: "app",
  data: function() {
    return {
      a: 'A',
      b: { e: 'E' },
      test: {
        taskbox1: {
          spec: {
            title: 'Title Text',
            
            vuetify: {
              vtoolbar: {
                flat: false,
              }
            },
            ux: {
              add_item: false,
              add_last: true,
              open_rows: 3,

              item: {
                title_editor_link: true,
              },
              
              keys: {
                enter_inserts: true
              },

              actions: {
                // remove: false
              }
            },

            icon: {
              done: 'mdi-check-circle'
            },

          },
          items: [
            {
              title: 'AAA'
            },

            {
              title: 'BBB BBB BBB BBB BBB BBB BBB BBB BBB BBB BBB BBB BBB BBB BBB BBB BBB BBB BBB BBB BBB BBB BBB BBB BBB BBB BBB BBB BBB BBB BBB BBB BBB BBB BBB BBB BBB BBB BBB BBB BBB BBB BBB BBB BBB BBB BBB BBB BBB BBB BBB BBB BBB BBB BBB BBB BBB BBB '
            },

            {
              title: 'CCC'
            },

            {
              title: 'DDD'
            },

          ]
        },
        taskbox0: {
          spec: {
            title: 'Foo',
            text: {
              add_item: 'Add Foo'
            },
            ux: {
              headers: [
                { title: 'CONTROLS' },
                { title: 'COMPLETE', name: 'complete' },
                { title: 'TITLE', name: 'title' },
                { title: 'BAR', name: 'bar' },
                { title: 'ZED', name: 'zed' },
                { title: 'BAZ', name: 'baz' },
                { title: 'FOO', name: 'foo' },
              ],
            },
            fields: [
              {
                name:'complete',
                kind:'done'
              },
              {
                name:'bar',
                kind:'text',
                show_label: false
              },
              {
                name:'zed',
                kind:'custom'
              },
              {
                name:'baz',
                //kind:'custom'
              },
              {
                name:'foo',
                kind:'text',
                show_list: false,
                show_edit: false,
                //kind:'component',
                //component: 'foo-bar'
              },
            ]
          },
          items: [
            {
              id:'01',
              title:'t01',
              complete:true,
              state:'done',
              bar:'B0',
              zed:'Z0',
              baz:'A0',
              foo:'F0',
            },
            {
              id:'02', title:'t02', complete:false, state:'todo', bar:'B1', zed:'Z1',
              foo:'F1'
            },
            {
              id:'03', title:'t03', complete:false, state:'todo', bar:'B2', zed:'Z2'
            },
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

<style lang="scss">
.vxo-slide-select-main {
    border:1px solid #333;
}
.vxo-slide-select-item-selected {
    background-color: #ccf;
}

.vxo-task-box-state-icon-done {
    color: green !important;
}

.vxo-task-box-item {
    border: 1px solid gray;
}

.vxo-task-box-item {
    &:hover {
        border-color: blue;
    }
}

.vxo-task-box-actions {
    order: -1;
}

.vxo-task-box-editor-item-bar {
    font-size: 24px;
}

</style>

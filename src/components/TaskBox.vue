<template>
  <v-card v-bind="spec.card" :class="spec.classes">
    <h3
      v-if="null!=spec.title"
      @click="title_toggle"
      >
      {{ spec.title }}
      <span
        v-if="spec.ux.title_count"
        >({{ filtered_items.length }})</span>
    </h3>

    <v-list
      v-bind="spec.list"
      v-if="list_visible"
      class="vxo-task-box-items"
      >

      <slot
        name="header"
        v-if="spec.ux.headers"
        >
        <v-list-item>
          <v-list-item-content
            v-for="(header,index) in headers"
            :key="index"
            class="vxo-task-box-item-field vxo-task-box-item-header"
            >{{ header.title }}</v-list-item-content>
          <v-spacer
            v-if="spec.ux.actions"
            />
        </v-list-item>

      </slot>


      <draggable
        v-model="items"
        handle=".vxo-task-box-handle"
        >
      <v-list-item
        v-for="item in filtered_items"
        :key="item.id"
        v-if="!item.$remove"
        >

        <v-list-item-action
          v-if="spec.ux.state"
          >
          <v-icon
            @click="change_item_state(item)"
            >{{ item_state_icon(item) }}</v-icon>
        </v-list-item-action>
        
        <v-list-item-content
          v-if="!has_custom_title"
          class="vxo-task-box-item-title vxo-task-box-item-field"
          >
          <span
            v-if="!item.$edit"
            >
            {{ item.title }}
          </span>

          <v-text-field
            v-if="item.$edit"
            v-model="item.title"
            >
          </v-text-field>

        </v-list-item-content>

        <v-list-item-content
          v-for="field in spec.fields"
          :key="field.name"
          class="vxo-task-box-item-field"
          >

          <span
            v-if="field.kind=='text'"
            :style="make_text_style(field)"
            >
            {{ item[field.name] }}
          </span>

          <slot
            :item="item"
            :field="field"
            :name="'custom.'+field.name"
            v-if="field.kind=='custom'"
            >
            {{ item[field.name] }}
          </slot>
          
        </v-list-item-content>

        <v-spacer
          v-if="spec.ux.actions"
          />
        
        <v-list-item-icon
          v-if="spec.ux.actions"
          >
          <v-icon
            v-if="!item.$edit"
            @click="remove_item(item)"
            >{{ spec.icon.remove }}</v-icon>
          <v-icon
            v-if="!item.$edit"
            class="vxo-task-box-handle"
            >{{ spec.icon.drag }}</v-icon>
          <v-icon
            v-if="item.$edit"
            @click="save_item(item)"
            >{{ spec.icon.save }}</v-icon>
        </v-list-item-icon>
        
      </v-list-item>
      </draggable>

      <slot
        name="footer"
        :add_item="add_item"
        v-if="spec.ux.add_item"
        >
        <v-list-item>
          <v-btn
            @click="add_item"
            >{ { spec.text.add_item } }</v-btn>
        </v-list-item>
      </slot>
    </v-list>
  </v-card>
</template>

<style lang="scss">
.vxo-task-box > h3 {
    cursor: pointer;
}
.vxo-task-box-handle {
    cursor:grab;               
}
.vxo-task-box-item-title {
    padding-left: 8px;
}
.vxo-task-box-item {
    padding-left: 8px;
}
.vxo-task-box-item-header {
    font-wieght: bold;
}
</style>


<script>
export default {
  name: 'vxo-task-box',
  props: {
    spec: {
      type: Object,
      required: true
    },
    filter: {
      type: Object,
    },
    value: {
      type: Array,
      required: true      
    }
  },
  data: function() {
    return {
      items: [],
      list_visible: this.spec.ux.init_list_visible
    }
  },
  
  beforeCreate: function() {
    var spec = this.$options.propsData.spec
    init_spec(spec)
  },
  created: function() {
    this.items = [...this.value]
  },
  watch: {
    spec: function(val) {
      init_spec(val)
    }
  },
  computed: {
    has_custom_title: function() {
      return this.spec.fields.filter(f=>f.name==='title').length>0
    },
    filtered_items: function() {
      if(this.filter) {
        return this.items.filter(
          item => 
            Object.entries(this.filter).reduce(
              (o,e)=>(o&&item[e[0]]===e[1]),true)
        )
      }
      else {
        return this.items
      }
    },
    headers: function() {
      return this.spec.ux.headers
    }
  },
  methods: {
    add_item: function() {
      this.items.push(this.new_item())
    },
    new_item: function() {
      return {
        $new: true,
        $edit: true,
        id: this.make_id(),
        title: '',
        state: 'todo'
      }
    },
    remove_item: function(item) {
      item.$remove = true
      this.$forceUpdate()
    },
    save_item: function(item) {
      item.$edit = false
    },
    make_id: function() {
      return (Math.random()+'').substring(2)
    },
    item_state_icon: function (item) {
      return this.spec.icon.$state[item.state] || 'mdi-circle-outline'
    },
    change_item_state: function(item) {
      item.state = this.spec.statemap[item.state] || 'todo'
    },
    make_text_style: function(field) {
      let style = {}
      if(field.color) {
        style.color = field.color
      }
      return style
    },
    title_toggle: function() {
      this.list_visible = !this.list_visible
    }
  }
}

function init_spec(spec) {
  spec.card = {
    ...spec.card
  } 
  
  spec.list = {
    ...spec.list
  } 
  
  spec.text = {
    add_item: 'Add Item',
    ...spec.text
  } 
  
  spec.icon = {
    save: 'mdi-checkbox-marked',
    remove: 'mdi-close-box',
    drag: 'mdi-apps-box',
    ...spec.icon
  } 
  
  spec.icon.$state = {
    done: 'mdi-check-circle-outline',
    todo: 'mdi-circle-outline',
    ...spec.icon.$state
  }
  
  spec.classes = {
    'vxo-task-box': true,
    ...spec.classes
  } 
  
  spec.statemap = {
    done: 'todo',
    todo: 'done',
    ...spec.statemap
  }
  
  spec.fields = [
    ...(spec.fields||[])
  ]

  spec.ux = {
    state: true,
    actions: true,
    title_count: false,
    title_toggle: true,
    add_item: true,
    init_list_visible: true,
    ...spec.ux
  }
}
</script>


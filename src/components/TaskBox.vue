<template>
  <v-card v-bind="spec.card" :class="spec.classes">
    <v-toolbar
      flat
      dense
      >
      <h3
        v-if="null!=spec.title"
        @click="title_toggle"
        >
        {{ spec.title }}
        <span
          v-if="spec.ux.title_count"
          >({{ filtered_items.length }})</span>
      </h3>

      <v-spacer
        v-if="spec.tool.add.active"
        ></v-spacer>
      
      <v-btn
        v-if="spec.tool.add.active"
        v-bind="spec.tool.add.props"
        @click.stop.prevent="add_item"
        >
        {{ spec.tool.add.text }}
        </v-btn>
    </v-toolbar>
    
    <v-list
      v-bind="spec.list"
      v-if="list_visible"
      class="vxo-task-box-items"
      >

      <slot
        name="header"
        v-if="spec.ux.headers"
        >
        <v-list-item
          class="vxo-task-box-item-headers"
          >
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
        
        <v-list-item-content
          v-if="!has_custom_title"
          class="vxo-task-box-item-title vxo-task-box-item-field"
          >
          <v-icon
            left
            style="max-width:32px"
            v-if="spec.ux.state"
            @click.stop.prevent="change_item_state(item)"
            >{{ item_state_icon(item) }}</v-icon>

          <span
            v-if="!item.$edit"
            @click="item_title_action($event,item)"
            >
            {{ item.title }}
          </span>

          <v-text-field
            outlined
            hide-details
            v-if="item.$edit"
            v-model="item.title"
            @keyup.enter="item_title_save(item)"
            >
          </v-text-field>

        </v-list-item-content>

        <v-list-item-content
          v-for="field in field_list"
          :key="field.name"
          class="vxo-task-box-item-field"
          :data-field-name="field.name"
          @click="act_item(item)"
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
            @click="edit_item(item)"
            >{{ spec.icon.edit }}</v-icon>
          <v-icon
            v-if="item.$edit"
            @click="save_item(item)"
            >{{ spec.icon.save }}</v-icon>
          <v-icon
            v-if="!item.$edit"
            class="vxo-task-box-handle"
            >{{ spec.icon.drag }}</v-icon>
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
            >{{ spec.text.add_item }}</v-btn>
        </v-list-item>
      </slot>
    </v-list>

    <task-box-editor
      v-model="edit"
      :spec="spec"
      :task="edit_task"
      @toggle_status="toggle_status"
      @update_field="update_field"
      @create_task="create_task"
      >
      <template
        v-for="field in spec.fields"
        v-slot:[edit_slot(field)]
        >
        <slot
          :name="'edit.'+field.name"
          :task="edit_task"
          :field="field"
          :spec="spec"
          >
        </slot>
      </template>
    </task-box-editor>
  </v-card>
</template>

<style lang="scss">
.vxo-task-box > h3 {
    cursor: pointer;
}
.vxo-task-box-handle {
    cursor: grab;               
}
.vxo-task-box-item-title {
    min-width: 50%;
    span {
        max-width: 80%;
    }
}
.vxo-task-box-item-field {
    &:first-of-type {
        min-width: 50%;
    }
}
.vxo-task-box-item-header {
    &:first-of-type {
        min-width: 50%;
    }
}
</style>


<script>
import Common from './common'
import TaskBoxEditor from './TaskBoxEditor.vue'

const { clone } = Common

export default {
  name: 'vxo-task-box',
  components: {
    'task-box-editor': TaskBoxEditor
  },
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
    },
    trigger: {
      type: Object,
      default: ()=>({
        new_task: {}
      })
    },
  },
  data: function() {
    return {
      edit: false,
      edit_task: {},
      items: [],
      list_visible: this.spec.ux.init_list_visible
    }
  },
  
  beforeCreate: function() {
    var spec = this.$options.propsData.spec
    init_spec(spec)
  },
  created: function() {
    this.init()
  },
  watch: {
    spec: function(val) {
      init_spec(val)
    },
    'trigger.new_task': function(new_task) {
      var new_item = clone(new_task)
      new_item.$mark = Math.random()
      new_item.$edit = false
      new_item.$new = true
      this.edit_item(new_item)
    },
    value: function() {
      this.init()
    }
  },
  computed: {
    field_list: function() {
      var fields = this.spec.fields.filter(f=>f.name!=='title') 
      return fields
    },
    has_custom_title: function() {
      return this.spec.custom.title ||
        this.spec.fields.filter(f=>f.name==='title' && f.custom).length>0
    },
    filtered_items: function() {
      console.log('VTB filtered_items', this.items, this.filter)

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
    init: function() {
      this.items = [...this.value||[]].map(item=>{
        item = clone(item)
        item.$mark = Math.random()
        item.$edit = false
        return item
      })
    },
    edit_slot: function(field) {
      return 'edit.'+field.name
    },
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
    edit_item: function(item) {
      if(this.spec.ux.edit_dialog) {
        this.edit = true
        this.edit_task = item
      }
    },
    act_item: function(item) {
      this.edit_item(item)
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

    toggle_status: function() {
      if(this.edit_task) {
        this.change_item_state(this.edit_task)
      }
    },
    update_field: function({field,item}) {
      if(this.edit_task) {
        this.edit_task[field.name] = item[field.name]
      }
    },
    create_task: function(item) {
      delete item.$new
      var new_item = clone(item)
      this.items = [...this.items,new_item]
    },

    item_title_action: function(event, item) {
      if(this.spec.item.title_edit) {
        event.stopPropagation()
        event.preventDefault()
        item.$edit=true
      }
      else {
        this.act_item(item)
      }
    },
    item_title_save: function(item) {
      item.$edit = false
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

  spec.dialog = {
    ...spec.dialog
  } 

  spec.list = {
    ...spec.list
  } 
  
  spec.text = {
    add_item: 'Add Item',
    ...spec.text
  } 

  spec.item = {
    title_edit: true,
    ...spec.item
  } 

  
  spec.icon = {
    save: 'mdi-checkbox-marked',
    remove: 'mdi-close-box',
    drag: 'mdi-apps-box',
    edit: 'mdi-pencil-box',
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


  spec.tool = spec.tool || {}

  spec.tool.add = {
    active: false,
    text: 'Add Item',
    ...spec.tool.add
  }

  spec.tool.add.props = {
    ...spec.tool.add.props
  }


  
  spec.ux = {
    state: true,
    actions: true,
    title_count: false,
    title_toggle: true,
    add_item: true,
    init_list_visible: true,
    toolbar: true,
    toolbar_status_btn_text_map: {
      done: 'Mark not done',
      todo: 'Mark done',
    },
    toolbar_btn_class: '',
    edit_dialog: true,
    ...spec.ux
  }

  
  spec.custom = {
    ...spec.custom
  } 

}
</script>


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
          >({{ items.length }})</span>
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
            :style="header.styling"
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
        v-for="item in items"
        :key="item.meta.mark"
        v-if="!item.meta.flags.remove"
        :class="list_item_classes(item)"
        >

        <v-list-item-content
          v-if="!has_custom_title"
          class="vxo-task-box-item-title vxo-task-box-item-field"
          >
          <v-icon
            left
            style="max-width:32px"
            v-if="spec.ux.state && !item.meta.state.empty"
            @click.stop.prevent="change_item_state(item)"
            >{{ item_state_icon(item) }}</v-icon>

          <p
            v-if="!item.meta.state.edit && !item.meta.state.empty"
            @click="item_title_action($event,item)"
            >
            {{ item.task.title }}

            <!--
            <small>
              adder: {{ item.meta.state.adder }}
              edit: {{ item.meta.state.edit }}
              empty: {{ item.meta.state.empty }}
            </small>
            -->
          </p>

          <v-text-field
            outlined
            hide-details
            v-if="item.meta.state.edit && !item.meta.state.empty"
            v-model="item.task.title"
            @keyup.enter="item_title_key('enter',item)"
            @keyup.esc="item_title_key('esc',item)"
            @keydown.tab="item_title_key('tab',item)"
            :ref="'item'+item.meta.index"
            >
          </v-text-field>
        </v-list-item-content>


        <v-list-item-content
          v-for="field in field_list"
          :key="field.name"
          class="vxo-task-box-item-field"
          :style="field.styling"
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
            v-if="!item.meta.state.edit"
            @click="remove_item(item)"
            >{{ spec.icon.remove }}</v-icon>
          <v-icon
            v-if="!item.meta.state.edit"
            @click="edit_item(item)"
            >{{ spec.icon.edit }}</v-icon>
          <v-icon
            v-if="item.meta.state.edit"
            @click="save_item(item)"
            >{{ spec.icon.save }}</v-icon>
          <v-icon
            v-if="!item.meta.state.edit"
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

    <!--
    <task-box-editor
      v-model="edit"
      :spec="spec"
      :task="edit_task"
      @toggle_status="toggle_status"
      @update_field="update_field"
      x-create_task="create_task"
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
    -->
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
    display: flex;
    overflow-x: scroll;
    > * {
        margin: 4px !important;
        flex: 0 1 auto;
    }
    > .v-input {
        flex-grow: 1;
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

// NOTE:
// item: { task, meta }

import Vue from 'vue'
import { JoiProps, Joi } from 'joiprops'

import Common from './common'
// import TaskBoxEditor from './TaskBoxEditor.vue'

const { clone, genid } = Common

export default {
  name: 'vxo-task-box',
  components: {
    // 'task-box-editor': TaskBoxEditor
  },
  props: {
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
  mixins:[
    JoiProps({
      spec: Joi.object({

        ux: Joi.object({

          title: Joi.object({
            edit: Joi.boolean().default(true),
            title_count: Joi.boolean().default(false),
            title_toggle: Joi.boolean().default(true),
          }).default(),

          state: Joi.boolean().default(true),
          actions: Joi.boolean().default(true),
          add_item: Joi.boolean().default(true),
          init_list_visible: Joi.boolean().default(true),
          toolbar: Joi.boolean().default(true),
          edit_dialog: Joi.boolean().default(true),
          add_last: Joi.boolean().default(false),

          open_rows: Joi.number().min(0).default(0),


          keys: Joi.object({
            enter_saves: Joi.boolean().default(true),
            enter_inserts: Joi.boolean().default(false),
            tab_saves: Joi.boolean().default(true),
          }).default(),
        }).default(),

        text: Joi.object({
          add_last: Joi.string().default('Add task...'),
        }).default(),
        
        icon: Joi.object({
          save: Joi.string().default('mdi-checkbox-marked'),
          remove: Joi.string().default('mdi-close-box'),
          drag: Joi.string().default('mdi-apps-box'),
          edit: Joi.string().default('mdi-pencil-box'),
        }).default()
      }).unknown().required()
    })
  ],
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
      // TODO
      /*
      var new_item = clone(new_task)
      new_item.$mark = Math.random()
      new_item.meta.state.edit = false
      new_item.$new = true
      this.edit_item(new_item)
      */
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
    headers: function() {
      return this.spec.ux.headers
    }
  },
  methods: {
    init: function() {
      let index = 0
      this.items = [...this.value||[]].map(task=>{
        return this.new_item(task,{index: index++})
      })

      this.update_items()
    },

    
    norm_items: function(edit_item) {
      let index = 0
      this.items.forEach(item => {
        let is_edit_item = edit_item ? item.meta.mark === edit_item.meta.mark : false
        item.meta.index = index++
        item.meta.state.edit = is_edit_item ? edit_item.meta.mark : false

        if(!is_edit_item ) { 
          // Disallow empty titles on existing items
          if(''===item.task.title || null == item.task.title) {
            item.task.title =
              item.meta.last ? item.last.title : this.spec.text.add_last
          }
        }
      })

      this.print_items('norm')
    },

    append_item(task,meta,after_item) {
      let new_item = this.new_item(task, meta)

      this.items.splice(
        null == after_item ? this.items.length : after_item.meta.index+1,0,new_item)
      this.norm_items(new_item.meta.state.edit ? new_item : null)

      return new_item
    },

    print_items: function(note) {
      console.log('VTB print_items', note, '\n'+this.items.map(
        x=>[
          x.meta.index,
          JSON.stringify(x.meta.state),
          new String(x.task.title),
        ].join('|')).join('\n'))
    },
    
    update_items: function() {
      this.norm_items()

      if( this.spec.ux.open_rows ) {
        var empty = this.items.find(x=>x.meta.state.empty)
        var adder = this.items.find(x=>x.meta.state.adder)
        var len = Math.max(
          this.spec.ux.open_rows,
          this.items.length+
            (null==empty&&null==adder?1:0))

        while(this.items.length < len) {
          this.append_item(null,{state:{empty:true}})
        }
      }

      if( this.spec.ux.add_last ) {
        var adder = this.items.find(x=>x.meta.state.adder)
        if(null == adder) {
          adder = this.items.find(x=>x.meta.state.empty)
          adder.meta.state.adder = true
          adder.meta.state.empty = false
          adder.task.title = this.spec.text.add_last
        }
      }

      this.print_items('update')
    },
    edit_slot: function(field) {
      return 'edit.'+field.name
    },
    add_item: function() {
      this.items.push(this.new_item())
    },
    new_task: function(task) {
      return null != task ? clone(task) : {
        title: '',
        state: 'todo'
      }
    },
    new_item: function(
      task, // optional initial task data
      meta   // optional initial meta data
    ) {
      let new_item = {
        // Original data from parent component
        task: this.new_task(task),

        // Internal meta data
        meta: {
          
          // Unique identifier
          mark: genid('T'),
          
          // Item index
          index: meta ? meta.index : 0,
          
          // UX state
          state: {
            
            // Item can be edited
            edit: (meta && meta.state && meta.state.edit || false),
            
            // Empty item row
            empty: (meta && meta.state && meta.state.empty || false),
            
            // First empty row where new tasks can be added
            adder: false
          },
          
          // Flags
          flags: {
            
            // Indicate that this item is new
            new: null == task,
            
            // Indicate that this item should be removed
            remove: false
          }
        }
      }
      
      return new_item
    },
    remove_item: function(item) {
      item.meta.flags.remove = true
      this.$forceUpdate()
    },
    save_item: function(item) {
      item.meta.state.edit = false
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

    /*
    create_task: function(item) {
      delete item.$new
      var new_item = clone(item)
      this.items = [...this.items,new_item]
    },
*/
    item_title_action: function(event, item) {
      if(this.spec.ux.title.edit) {
        event.stopPropagation()
        event.preventDefault()

        item.meta.last=clone(item.task)

        this.norm_items()
        
        //if(item.meta.state.adder && item.title === this.spec.text.add_last) {
        if(item.task.title === this.spec.text.add_last) {
          item.task.title = ''
        }

        item.meta.state.edit = true

        this.item_title_edit_focus(item)
      }
      else {
        this.act_item(item)
      }
    },

    item_title_edit_focus (item) {
      Vue.nextTick(() => {
        var input_el = this.$refs['item'+item.meta.index]
        window.foo = input_el[0]
        if(input_el[0]) {
          input_el[0].$el.querySelector('input').focus()
        }
      })
    },
    
    item_title_key: function(keyname, item) {
      if('esc' === keyname ) {
        item.meta.state.edit = false

        if(item.meta.last) {
          item.task.title = item.meta.last.title
        }

        this.update_items()
        return
      }
      
      // Save if title non-empty
      if('' !== item.title) {
        item.meta.state.edit = false
        item.meta.state.adder = false
        item.meta.state.empty = false
      }

      // Ensure everything is consistent
      this.update_items()

      if('enter' === keyname ) {

        if(this.spec.ux.keys.enter_saves) {
          this.$emit('save', clone(item))
        }

        if(this.spec.ux.keys.enter_inserts) {
          let new_item = this.append_item(null,{state:{edit:true}},item)
          this.item_title_edit_focus(new_item)
        }
      }
      else if('tab' === keyname ) {

        if(this.spec.ux.keys.tab_saves) {
          this.$emit('save', clone(item))
        }
      }
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
    },
    list_item_classes (item) {
      return [
        item.meta.state.edit ? 'vxo-task-box-item-state-edit' : '',
        item.meta.state.empty ? 'vxo-task-box-item-state-empty' : '',
        item.meta.state.adder ? 'vxo-task-box-item-state-adder' : '',
        item.meta.flags.new ? 'vxo-task-box-item-state-new' : '',
        item.meta.flags.remove ? 'vxo-task-box-item-state-remove' : '',
      ].join(' ')
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

  spec.custom = {
    ...spec.custom
  } 

}
</script>


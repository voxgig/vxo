<template>
<v-card
  v-bind="spec.vuetify.vcard"
  :id="spec.id"
  :class="spec.classes"
  >

  <v-toolbar
    v-if="null!=spec.title"
    v-bind="spec.vuetify.vtoolbar"
    >
    <h3
      v-if="null!=spec.title"
      @click="click_title_toggle"
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
      v-bind="spec.tool.add.bind"
      :class="spec.tool.add.class"
      @click.stop.prevent="click_add_item"
      outlined
      >
      {{ spec.tool.add.text }}
    </v-btn>
  </v-toolbar>
  
  <v-list
    v-bind="spec.vuetify.vlist"
    v-if="list_visible"
    class="vxo-task-box-items"
    >
    
    <slot
      name="header"
      v-if="spec.ux.show_headers"
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
          v-if="has_ux_actions"
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
        :class="list_item_classes(item)"
        @mouseenter="mouse_set_active_item(item)"
        >

        <v-list-item-content
          v-if="!has_custom_title"
          class="vxo-task-box-item-title vxo-task-box-item-field"
          @click.stop.prevent="click_item_title($event,item)"
          >
          <v-icon
            left
            :class="'vxo-task-box-state-icon-'+item.task.state"
            v-if="spec.ux.state && !item.meta.state.empty"
            @click.stop.prevent="click_change_item_state(item)"
            >{{ item_state_icon(item) }}</v-icon>
          
          <p
            v-if="!item.meta.state.edit"
            style="flex-grow: 2;"
            >
            {{ format_task_title(item) }}            
          </p>

<!--
          <small>
            {{ item.meta.index }}
            {{ item.meta.flags }}
            {{ item.meta.state }}
          </small>
-->

          <v-text-field
            outlined
            hide-details
            v-if="item.meta.state.edit"
            v-model="item.task.title"
            @keyup.enter="key_item_title_ent(item)"
            @keyup.esc="key_item_title_esc(item)"
            @keyup.delete="key_item_title_delete(item)"
            @keydown.tab.stop.prevent="key_item_title_tab(item)"
            :ref="'item'+item.meta.index"
            >
          </v-text-field>
          
          <p
            style="align-self:right;"
            v-if="has_title_editor_link(item)"
            class="vxo-task-box-title-editor-link vxo-task-box-title-editor-link-text"
            @click.stop.prevent="click_edit_item(item)"
            >
            <span>{{ spec.text.title_editor_link }}</span>
            <v-icon
              small
              >{{ spec.icon.editor_link }}</v-icon>
          </p>          
        </v-list-item-content>
        
        
        <v-list-item-content
          v-for="field in field_list"
          :key="field.name"
          class="vxo-task-box-item-field"
          :style="field.styling"
          :data-field-name="field.name"
          @click="click_act_item(item)"
          >
          
          <span
            v-if="field.kind=='text'"
            :style="make_text_style(field)"
            >
            {{ item.task[field.name] }}
          </span>
          
          <slot
            :name="'custom.'+field.name"
            :item="item"
            :field="field"
            v-if="field.kind=='custom'"
            >
            {{ item.task[field.name] }}
          </slot>
          
        </v-list-item-content>
        
        
        <v-spacer
          v-if="has_ux_actions"
          />
        
        
        <v-list-item-icon
          v-if="has_ux_actions"
          class="vxo-task-box-actions"
          >
          <v-icon
            v-if="spec.ux.actions.remove"
            @click="click_remove_item(item)"
            >{{ spec.icon.remove }}</v-icon>
          <v-icon
            v-if="spec.ux.actions.edit"
            @click="click_edit_item(item)"
            >{{ spec.icon.edit }}</v-icon>
          <v-icon
            v-if="spec.ux.actions.save"
            @click="click_save_item(item)"
            >{{ spec.icon.save }}</v-icon>
          <v-icon
            v-if="spec.ux.actions.drag"
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
    :edit="editor_item"
    @toggle_status="editor_toggle_status"
    @update_field="editor_update_field"
    @create_item="editor_create_item"
    @delete_item="editor_delete_item"
    >
    <template
      v-for="field in spec.fields"
      v-slot:[edit_slot(field)]
      >
      <slot
        :name="'edit.'+field.name"
        :task="editor_item"
        :field="field"
        :spec="spec"
        :item="editor_item"
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
    display: flex;
    flex-wrap: nowrap !important;
    overflow-x: scroll;
    > * {
        margin: 4px !important;
        flex: 0 1 auto;
    }
    > .v-input {
        flex-grow: 1;
    }

    &:hover {
        .vxo-task-box-title-editor-link {
            display: revert;
            min-width: 5rem;
            overflow-x: hidden;

            &:hover * {
                cursor: pointer;
                color: rgb(var(--vxo-cd-link)) !important;
            }
        }
    }
    
    .vxo-task-box-title-editor-link {
        display: none;
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

import { JoiProps, Joi, JT, JF, JB, JS, JN, JO, JA, JOu } from 'joiprops'

import Common from './common'
import TaskBoxEditor from './TaskBoxEditor.vue'

const { clone, genid, debug } = Common
const print = debug.extend('task-box')


const joiprops = JoiProps({
  spec: JO({

    id: JS().default(()=>genid('vxo-task-box-')),

    statemap: JO({
      done: JS('todo'),
      todo: JS('done'),
    }),
    
    ux: JO({
      
      headers: JA(JO({
        title: JS(),
        name: JS(),
        kind: JS(),
        styling: JS(),
      })),
      
      title: JO({
        edit: JT,
        title_count: JF,
        title_toggle: JT,
      }),
      
      state: JT,
      add_item: JT,
      init_list_visible: JT,
      toolbar: JT,
      add_last: JF,          
      open_rows: JN(0).min(0),
      show_headers: JT,
      
      actions: JO({
        remove: JT,
        edit: JT,
        save: JT,
        drag: JT,
      }),
      
      item: JO({
        title_editor_link: JF,
      }),
      
      keys: JO({
        enter_saves: JT,
        enter_inserts: JF,
        tab_saves: JT,
        esc_cancels: JT,
        del_removes: JT,
      }),
    }),
    
    text: JO({
      add_item: JS('Add task...'),
      add_last: JS('Add task...'),
      empty_title: JS('--'),
      title_editor_link: JS('Details'),
      editor: JO({
        create_task: JS('Create task...'),
        delete_task: JS('Delete task'),
        task_state: JO({
          done: JS('Mark not done'),
          todo: JS('Mark done'),
        }),
      }),
    }),
    
    icon: JO({
      save: JS('mdi-checkbox-marked'),
      remove: JS('mdi-close-box'),
      drag: JS('mdi-apps-box'),
      edit: JS('mdi-pencil-box'),
      done: JS('mdi-check-circle-outline'),
      todo: JS('mdi-circle-outline'),
      editor_link: JS('mdi-chevron-right'),          
    }),
    
    fields: JA().items(JO({
      name: JS().required(),
      kind: JS(),
      label: JS().allow(null),
      show_label: JT,
      show_list: JT,
      show_edit: JT,
    })).default([{name:'title',label:'Task'}]),


    vuetify: JO({
      vcard: JOu({
        flat: JT,
        dense: JT,
      }),
      vtoolbar: JOu({
        flat: JT,
        dense: JT
      }),
      vlist: JOu({
        flat: JT,
        dense: JT,
      }),
      vdialog: JOu({
      }),
    }),


    classes: JO({
      'vxo-task-box': JT,
    }),

    tool: JOu({
      add: JOu({
        active: JF,
        text: JS('Add task'),
        bind: JO()
      }),
    }),

    custom: JOu({
      title: JF
    })

  }).unknown().required()
})


export default {
  name: 'vxo-task-box',
  components: {
    'task-box-editor': TaskBoxEditor
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
  mixins:[joiprops],
  data () {
    return {
      edit: false,
      editor_item: {},
      active_item: {},
      items: [],
      list_visible: this.spec.ux.init_list_visible,
      keys_active: false,
    }
  },
  
  created () {
    this.init()
  },
  mounted () {
    if(this.$el) {
      this.$el.addEventListener('mouseenter', this.activate_keys)
      this.$el.addEventListener('mouseleave', this.deactivate_keys)
      window.addEventListener('keyup', this.key_handler_general)
    }
  },
  destroyed () {
    if(this.$el) {
      this.$el.removeEventListener('mouseenter', this.activate_keys)
      this.$el.removeEventListener('mouseleave', this.deactivate_keys)
      window.removeEventListener('keyup', this.key_handler_general)
    }
  },
  watch: {
    value () {
      this.init()
    }
  },
  computed: {
    field_list () {
      var fields = this.spec.fields.filter(f=>f.name!=='title' && f.show_list) 
      return fields
    },
    has_custom_title () {
      return true === this.spec.custom.title ||
        this.spec.fields.filter(f=>f.name==='title' && f.custom).length>0
    },
    headers () {
      return this.spec.ux.headers.filter(h=>{
        var field = this.spec.fields.find(f=>f.name===h.name)
        return null == field ? true : field.show_list
      })
    },
    has_ux_actions () {
      let actions = this.spec.ux.actions
      return Object.keys(actions).reduce((has_any,name)=>has_any||actions[name],false)
    }
  },
  methods: {
    
    init () {
      this.items = [...this.value||[]].map(task=>{
        return this.make_new_item(task)
      })

      this.norm_items('init')
    },

    
    click_title_toggle () {
      this.list_visible = !this.list_visible
    },

    click_add_item () {
      this.norm_items('click_add_item')
      this.items.push(this.make_new_item())
    },

    click_item_title (event, item) {
      if(!this.spec.ux.title.edit) {
        this.edit_item(item)
      }

      event.stopPropagation()
      event.preventDefault()

      this.norm_items('click_item_title')

      if(!item.meta.state.empty) {
        this.edit_item_title(item)
      }
    },

    click_act_item (item) {
      this.norm_items('click_act_item')
      this.edit_item(item)
    },

    click_edit_item (item) {
      this.norm_items('click_edit_item')
      if(!item.meta.state.empty) {
        this.edit_item(item)
      }
    },

    click_save_item (item) {
      this.norm_items('click_save_item')
      this.save_item(item)
    },

    click_remove_item (item) {
      this.norm_items('click_remove_item')
      this.remove_item(item)
    },

    click_change_item_state (item) {
      this.norm_items('click_change_item_state')
      this.change_item_state (item)
    },

    mouse_set_active_item (item) {
      this.active_item = item
    },

    key_item_title_delete (item) {
      if( this.spec.ux.keys.del_removes ) {
        if( item.meta.flags.new ) {
          if( null == item.task.title || '' == item.task.title) {
            this.remove_item(item)
          }
        }
      }
    },

    key_item_title_esc (item) {
      if(this.spec.ux.keys.esc_cancels) {
        this.norm_items('key_item_title_esc')
        this.cancel_edit_item_title(item)
      }
    },

    key_item_title_tab (item) {
      if(this.spec.ux.keys.tab_saves) {
        this.norm_items('key_item_title_tab')
        this.save_item(item)
      }
    },

    key_item_title_ent (item) {
      if(this.spec.ux.keys.enter_saves || this.spec.ux.keys.enter_inserts) {
        this.norm_items('key_item_title_ent')
      }

      if( null == item.task.title || '' == item.task.title) {
        item.meta.state.edit = true
      }
      else {
        if(this.spec.ux.keys.enter_saves) {
          this.save_item(item)
        }
        
        if(this.spec.ux.keys.enter_inserts) {
          let new_item = this.insert_item(item)
          this.edit_item_title(new_item)
        }
      }
    },
    
    key_handler_general (keyevent) {
      if(!this.keys_active) return;
    },


    
    norm_items (whence) {
      let index = 0

      if( this.spec.ux.open_rows ) {
        if(this.items.length < this.spec.ux.open_rows) {
          while(this.items.length < this.spec.ux.open_rows) {
            this.append_item(null,{state:{empty:true}})
          }
        }
        else if(this.items.length < this.spec.ux.open_rows) {
          let firstempty = this.items.length-1
          while( this.items[firstempty].meta.state.empty &&
                 this.spec.ux.open_rows <= firstempty) {
            firstempty--
          }
          if(firstempty < this.items.length-1) {
            this.items.splice(firstempty,this.items.length-firstempty)
          }
        }
      }
  
      if( this.spec.ux.add_last ) {
        let item = null

        let lastindex = this.items.length
        while( this.items[lastindex-1] &&
               (this.items[lastindex-1].meta.state.empty ||
                this.items[lastindex-1].meta.state.adder) )
        {
          item = this.items[--lastindex]
        }
        
        if(null == item) {
          this.append_item(null,{state:{adder:true,empty:false}})
        }
        else {
          item.meta.state.adder = true
          item.meta.state.empty = false
        }
      }

      this.items.forEach(item => {
        item.meta.index = index++
        item.meta.state.edit = false
      })

      print(this.describe('norm-'+whence))
    },

    append_item(task,meta,after_item) {
      let new_item = this.make_new_item(task, meta)

      this.items.splice(
        null == after_item ? this.items.length : after_item.meta.index+1,0,new_item)

      let index = 0
      this.items.forEach(item=>{
        item.meta.index = index++
      })
      
      return new_item
    },

    edit_item (item) {
      this.editor_item = item
      this.edit = true
    },

    
    edit_item_title (item) {
      item.meta.last = clone(item.task)
      item.meta.state.edit = true

      this.focus_item_title_edit(item)
    },
    
    cancel_edit_item_title (item) {
      item.meta.state.edit = false

      if(item.meta.flags.new && '' === item.task.title) {
        this.remove_item(item)
      }
          
      else if(item.meta.last) {
        item.task.title = item.meta.last.title
      }
    },

    
    change_item_state (item) {
      item.task.state = this.spec.statemap[item.task.state] || 'todo'
      this.$emit('state', clone(item))
    },

    save_item (item) {
      item.meta.state.edit = false
      item.meta.state.adder = false
      item.meta.state.empty = false
      item.meta.flags.new = false
      this.$emit('save', clone(item))
    },

    remove_item (item) {
      this.items.splice(item.meta.index,1)
      this.norm_items('remove_item')
      
      if(!item.meta.state.new) {
        this.$emit('remove', clone(item))
      }
    },


    insert_item (item) {
      // use empties if immediately following
      let following = null == item ? null : this.items[item.meta.index+1]
          
      let new_item = this.is_empty(following) ? following : 
          this.append_item(null,null,item)            

      new_item.meta.state.empty = false
      new_item.meta.flags.new = true

      return new_item
    },

    
    make_new_item (
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

          // Increment when item changes
          change: meta && null !== meta.change ? meta.change : 0,
          
          // UX state
          state: {
            
            // Item can be edited
            edit: (meta && meta.state && meta.state.edit || false),
            
            // Empty item row
            empty: (meta && meta.state && meta.state.empty || false),
            
            // First empty row where new tasks can be added
            adder: (meta && meta.state && meta.state.adder || false),
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

    new_task (task) {
      let new_task = null != task ? clone(task) : {
        title: '',
        state: 'todo'
      }

      new_task.state = new_task.state || 'todo'

      return new_task
    },
    
    format_task_title (item) {
      let title = (item.meta.state.empty ? '' :
                   item.meta.state.adder ? this.spec.text.add_last :
                   item.task.title)
      return null == title ? '' : title
    },

    focus_item_title_edit (item) {
      this.$nextTick(() => {
        var input_el = this.$refs['item'+item.meta.index]
        if(input_el && input_el[0]) {
          input_el[0].$el.querySelector('input').focus()
        }
      })
    },

        make_text_style (field) {
      let style = {}
      if(field.color) {
        style.color = field.color
      }
      return style
    },

    list_item_classes (item) {
      return [
        'vxo-task-box-item',
        item.meta.state.edit ? 'vxo-task-box-item-state-edit' : '',
        item.meta.state.empty ? 'vxo-task-box-item-state-empty' : '',
        item.meta.state.adder ? 'vxo-task-box-item-state-adder' : '',
        item.meta.flags.new ? 'vxo-task-box-item-state-new' : '',
        item.meta.flags.remove ? 'vxo-task-box-item-state-remove' : '',
      ].join(' ')
    },

    has_title_editor_link (item) {
      return (
        !item.meta.state.empty &&
          !item.meta.state.adder &&
          this.spec.ux.item.title_editor_link
      )
    },


    editor_toggle_status () {
      if(this.editor_item) {
        this.change_item_state(this.editor_item)
      }
    },
    editor_update_field ({field,item}) {
      if(this.editor_item) {
        this.$set(this.editor_item.task, field.name, item.task[field.name])
      }
    },
    editor_delete_item () {
      if(this.editor_item) {
        this.remove_item(this.editor_item)
      }
    },
    editor_create_item (item) {
      this.make_new_item(item)
    },

    is_empty (item) {
      return null == item ? false : (item.meta.state.empty || item.meta.state.adder) 
    },

    edit_slot (field) {
      return 'edit.'+field.name
    },

    make_id () {
      return (Math.random()+'').substring(2)
    },

    item_state_icon (item) {
      if(item && item.task && this.spec.icon ) {
        item.task.state = item.task.state || 'todo'
        let icon = this.spec.icon[item.task.state] || 'mdi-circle-outline'
        return icon
      }
    },

    activate_keys () {
      this.keys_active = true
    },
    
    deactivate_keys () {
      this.keys_active = false
    },
    
    describe (note) {
      let s = print.enabled && (this.spec.id+' '+note+'\n'+this.items.map(
        x=>[
          x.meta.index,
          JSON.stringify(x.meta.state),
          x.task.state,
          new String(x.task.title),
        ].join('|')).join('\n'))
      return s
    },    
  }
}
</script>


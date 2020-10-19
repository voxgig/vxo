<template>
<v-dialog
  v-model="open"
  v-bind="spec.dialog"
  >
  <v-card
    class="vxo-task-box-editor"
    >

    EDIT {{ item }}
    

    <v-toolbar
      v-if="spec.ux.toolbar"
      dense
      flat
      class="vxo-task-box-toolbar"
      >

      <v-btn
        v-if="!item.meta.new"
        outlined
        class="vxo-task-box-editor-toolbar-btn"
        @click="toggle_status"
        > {{ spec.text.editor.task_state[item.task.state] }} </v-btn>

      <v-btn
        v-if="item.meta.new"
        outlined
        class="vxo-task-box-editor-toolbar-btn"
        @click="create_item(item)"
        > {{ spec.text.editor.create_task }} </v-btn>
      <v-spacer />
      <v-icon @click="open=false">mdi-close</v-icon>
    </v-toolbar>

    <ul
      class="vxo-task-box-editor-items"
      >
      <li
        v-for="field in fields"
        :key="field.index"
        >

        <div
          v-if="'done' === field.kind"
          class="vxo-task-box-editor-item"
          >
          <v-icon
            v-if="!item.task[field.name]"
            @click="item.task[field.name]=true"
            >mdi-checkbox-blank</v-icon>
          <v-icon
            v-if="item.task[field.name]"
            @click="item.task[field.name]=false"
            >mdi-checkbox-marked</v-icon>
        </div>
        
        <v-text-field
          v-if="'string' === field.kind"
          v-model="item.task[field.name]"
          :label="field.label || field.name"
          class="vxo-task-box-editor-item"
          :data-field-name="field.name"
          @change="update_field(field,item)"
          placeholder="--"
          >
        </v-text-field>

        <slot
          :task="item"
          :field="field"
          :spec="spec"
          :name="'edit.'+field.name"
          class="vxo-task-box-editor-item"
          v-if="'custom' === field.kind"
          >
          {{ item.task[field.name] }}
        </slot>

        <component
          v-model="item.task[field.name]"
          :task="item"
          :field="field"
          :spec="spec"
          v-if="field.kind=='component'"
          :is="field.component"
          class="vxo-task-box-editor-item"
          ></component>

      </li>
    </ul>
  </v-card>
</v-dialog>
</template>

<style lang="scss">
.vxo-task-box-editor {
    padding: var(--vxo-s4);
    height: 100%;

    .vxo-task-box-toolbar {
        .v-toolbar__content {
            padding: 0;
        }
    }
    
    .vxo-task-box-editor-items {
        list-style-type: none;
        padding: 0;
    }
}
</style>


<script>
import Common from './common'

const { clone, taskbox } = Common

export default {
  name: 'vxo-task-box-editor',
  props: {
    value: {
      type: Boolean,
      required: true
    },
    spec: {
      type: Object,
      required: true
    },
    edit: {
      type: Object,
      default: ()=>({
        task: {},
        meta: {},
      })
    },
  },
  data: function() {
    return {
      open: false,
      fields: [],
      item: {
        task: {},
        meta: {}
      }
    }
  },  
  created: function() {
    this.init_spec()
  },
  watch: {
    value: function(val) {
      if(this.open !== val) {
        this.open = val
      }
    },
    open: function(val) {
      if(this.value != val) {
        this.$emit('input', val)
      }
    },
    spec: function() {
      this.init_spec()
    },
    edit: function() {
      this.init_edit()
    },
    'edit.meta.change': function() {
      this.init_edit()
    },
    'edit.task.state': function(state) {
      this.item.task.state = state
    },
  },
  methods: {
    init_spec: function() {
      this.open = this.value

      var spec = this.spec
      console.log('VTBE init fields', spec.fields)
      
      var fields = this.fields = []

      for(var i = 0; i < spec.fields.length; i++) {
        var field = clone(spec.fields[i])

        if(null == field.name) {
          throw new Error(`Missing field.name on field ${i}: ${field}`)
        }

        field.index = i
        field.kind = taskbox.field.kinds[field.kind] ? field.kind : 'string'

        fields.push(field)
      }
    },
    init_edit: function() {
      if(this.edit) {
        this.item = clone(this.edit) || {}
      }
    },
    toggle_status: function() {
      this.$emit('toggle_status')
    },
    update_field: function(field,item) {
      this.$emit('update_field', {field,item})
    },
    create_item: function(item) {
      this.$emit('create_item', item)
      this.open = false
    }
  }
}
</script>


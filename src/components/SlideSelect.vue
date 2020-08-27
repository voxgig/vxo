<template>
<div
  class="vxo-slide-select">
  <vueper-slides
    class="no-shadow"
    arrows-outside
    slide-multiple
    disable-arrows-on-edges
    :visible-slides="size"
    :bullets="false"
    :infinte="false"
    :touchable="false"
    :fixedHeight="styles.height"
    :initSlide="initial"
    >
    <vueper-slide
      v-for="(item,index) in slides"
      :key="index"
      :class="slide_class(index)"
      >
      <template v-slot:content >
        <div
          @click="action_item(item,index)">
          <slot
            name="item"
            :item="item"
            >
            <div>{{ item.text }}</div>
          </slot>
        </div>
      </template>
    </vueper-slide>
  </vueper-slides>
</div>
</template>

<script>
export default {
  name: 'vxo-slide-select',
  props: {
    items: {
      type: Array,
      default: null
    },
    range: {
      type: Object,
      default: null
    },
    size: {
      type: Number,
      default: 7
    },
    styling: {
      type: Object,
    },
    value: {
      type: Number,
      default: 1
    }
  },
  data: function() {
    return {
      initial: 1,
      selected: 1,
      slides: [],
    }
  },
  created: function() {
    if(this.range) {
      let start = this.range.start
      let end = this.range.end

      let total = 1+end-start
      
      this.slides = new Array(total).fill().map((_,i)=>({
        offset: i+start,
        text: ''+(i+start)
      }))
    }
    else {
      this.slides = Array.isArray(this.items) ? [...this.items] : []
    }

    this.initial =
      null === this.value ? Math.floor(this.slides.length/2) : this.value

    this.selected = this.value
    this.$emit('input',this.initial)
  },
  computed: {
    styles: function() {
      var out = Object.assign({
        height: '50px',
      },this.styling||{})
      return out
    }
  },
  methods: {
    action_item: function(item, index) {
      this.selected = index
      this.$emit('input',index)
    },
    slide_class: function(index) {
      return {
        'vxo-slide-select-item':true,
        'vxo-slide-select-item-selected':index===this.selected,
        'vxo-slide-select-item-rightmost':0===(1+index)%this.size
      }
    },
  }
}
</script>

<style lang="scss">
.vxo-slide-select {
    margin: auto;

    .vueperslides {
        border-left: 1px solid #ccc;
        border-right: 1px solid #ccc;
    }
}

.vxo-slide-select-item {
    text-align: center;
    border-top: 1px solid #ccc;
    border-bottom: 1px solid #ccc;
    border-right: 1px solid #ccc;
}

.vxo-slide-select-item div {
    height: 100%;
}

.vxo-slide-select-item-rightmost {
    border-right: 0px;
}
</style>

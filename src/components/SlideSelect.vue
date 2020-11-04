<template>
<div
  class="vxo-slide-select">
  <vueper-slides
    class="no-shadow"
    arrows-outside
    slide-multiple
    disable-arrows-on-edges
    :visible-slides="spec.size"
    :bullets="false"
    :infinite="false"
    :touchable="false"
    :fixedHeight="spec.styles.height"
    :initSlide="initial"
    ref="vs"
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


<script>
import { JoiProps, Joi, JO, JN, JA, JOu, JS } from 'joiprops'

export default {
  name: 'vxo-slide-select',
  mixins: [
    JoiProps({
      spec: JO({
        modify: Joi.function(),
        initial: JN().allow(null).default(null),
        range: JO({
          start: JN().required(),
          end: JN().required(),
        }).default(null),
        size: JN(7),
        styles: JO({
          height: JS('50px')
        }),
      }),
      items: JA(JOu({})).default(null)
    })
  ],
  props: {
    value: {
      type: Number,
      default: 0
    }
  },
  data: function() {
    return {
      initial: 0,
      selected: 1,
      slides: [],
    }
  },
  created: function() {
    let slides = []
    
    if(this.spec.range) {
      let start = this.spec.range.start
      let end = this.spec.range.end

      let total = 1+end-start
      
      slides = new Array(total).fill().map((_,i)=>({
        index: i,
        offset: i+start,
        text: ''+(i+start)
      }))
    }
    else {
      slides = Array.isArray(this.items) ? this.items : []
    }

    let initial =
        null === this.spec.initial ? Math.floor(this.slides.length/2) :
        this.spec.initial

    if(this.spec.modify) {
      [ slides, initial ] = this.spec.modify(slides, initial)
    }

    this.slides = slides
    this.initial = initial

    this.action_item(slides[this.initial], this.initial)
  },
  watch: {
    value (index) {
      if(this.selected != index) {
        this.action_item(this.slides[index], index)
      }

      this.$refs.vs.goToSlide(index)
    }
  },
  methods: {
    action_item: function(item, index) {
      this.selected = index
      this.$emit('input',index)
      this.$emit('slide',item)
    },
    slide_class: function(index) {
      return {
        'vxo-slide-select-item':true,
        'vxo-slide-select-item-selected':index===this.selected,
        'vxo-slide-select-item-rightmost':0===(1+index)%this.spec.size
      }
    },
  }
}
</script>


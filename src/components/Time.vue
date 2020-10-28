<template>
<span
  class="vxo-time"
  :class="classes"
  :style="styling"
  >{{ start }}{{ '' != end ? '&ndash;'+end : '' }}</span>
</template>

<script>
export default {
  name: 'vxo-time',
  props: ['time','clock','classes','styling'],
  data: function() {
    return {
      start: '',
      end: '',
    }
  },
  created: function() {
    this.normalize()
  },
  watch: {
    time: 'normalize',
    clock: 'normalize',
  },
  methods: {
    normalize: function() {
      if('object' != typeof(this.time)) {
        this.start = this.format(this.time)
      }
      else if(null != this.time) {
        this.start = this.format(this.time.start)
        this.end = this.format(this.time.end)
      }
    },

    resolve_suffix: function(hour) {
      let clockdef = (this.clock||'')
      let clockfirst = clockdef.substring(0,1)
      let clocklen = clockdef.length
      
      let suffix = ''
      if(0<clocklen) {
        suffix = 'AM'
        if(12 <= hour) {
          suffix = 'PM'
        }
        if(1 === clocklen) {
          suffix = suffix.substring(0,1)
        }
        if('m' === clockfirst) {
          suffix = suffix.toLowerCase()
        }
      }
      return suffix
    },
    format: function(timeval) {
      if(null == timeval) {
        return ''
      }

      try {
        let time = parseInt(timeval)
        let hour = Math.floor(time / 100)
        let min = time % 100
        let suffix = this.resolve_suffix(hour)
        if('' != suffix) {
          if(12 < hour) {
            hour -= 12
          }
          hour = 0 === hour ? 12 : hour
        }

        return hour+':'+(''+min).padStart(2,'0')+suffix
      }
      catch(e) {
        return ''
      }
    }
  }
}
</script>

<style>
</style>

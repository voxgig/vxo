<template>
<div>
  <v-label>VXO-CANARY</v-label>
  <p>A: {{ a }}</p>
  <p>Z: {{ z }}</p>
  <p>B: {{ b }}</p>
</div>
</template>

<script>
import { JoiProps, Joi } from 'joiprops'

export default {
  name: 'vxo-canary',
  mixins: [
    JoiProps({
      a: Joi.string().default('A'),
      z: Joi.string().default('Z'),
      b: Joi.object({
        e: Joi.string().required(),
        f: Joi.string(),
        c: Joi.object({
          d: Joi.string().default('D')
        }).default()
      }).default()
    })
  ],
}
</script>

<style>
</style>

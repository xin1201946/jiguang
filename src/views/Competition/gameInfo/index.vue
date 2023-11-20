<template>
  <Card>
    <template slot="query">
      <a-page-header :title="title" @back="handleBack" />
    </template>
    <div style="overflow-y: hidden">

    </div>
  </Card>
</template>

<script>
import Card from '@comp/card/card.vue'
export default {
  name: 'gameInfo',
  components: {
    Card
  },
  data() {
    return {
      title: '比赛详情'
    }
  },
  methods: {
    handleBack() {

    }
  }
}
</script>

<style scoped lang="scss">

</style>
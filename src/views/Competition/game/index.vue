<template>
  <Card>
    <template slot="query">
      <QuerySearch
        ref="query"
      ></QuerySearch>
    </template>
    <a-table></a-table>
  </Card>
</template>

<script>
import QuerySearch from '@comp/query/QuerySearch.vue'
import Card from '@comp/card/card.vue'
export default {
  name: 'game',
  components: {
    Card,
    QuerySearch
  }
}
</script>

<style scoped lang="less">

</style>
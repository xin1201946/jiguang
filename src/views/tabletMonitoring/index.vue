<template>
  <Card>
    <template slot="query">
      <QuerySearch
        ref="search"
        @reset="handleSearch"
        @submit="handleSearch"
      ></QuerySearch>
    </template>
    <div>
      平板监控
    </div>
  </Card>
</template>

<script>
import Card from '@comp/card/card.vue'
import QuerySearch from '@comp/query/QuerySearch.vue'
export default {
  name:'tabletMonitoring', //平板监控
  components:{
    Card,
    QuerySearch,
  },
  data() {
    return {

    }
  }
}
</script>

<style lang="less" scoped></style>
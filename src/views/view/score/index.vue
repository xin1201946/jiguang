<template>
  <Card>
    <template slot="query">
      <QuerySearch
        ref="query"
        @submit="handleSubmit"
        @reset="handleSubmit"
      ></QuerySearch>
    </template>
    <template slot="operator"></template>
    <template>
      <a-table
        :columns="columns"
        bordered
        :row-selection="rowSelection"
      ></a-table>
    </template>
  </Card>
</template>

<script>
import Card from '@comp/card/card.vue'
import QuerySearch from '@comp/query/QuerySearch.vue'
import { scoreQuery, scoreTableColums } from '@views/view/score/score.config'
export default {
  name: 'scope',
  components: {
    Card,
    QuerySearch
  },
  data() {
    return {
      columns: scoreTableColums,
      selectedRowKeys: [],
    }
  },
  computed: {
    rowSelection() {
      return {
        selectedRowKeys: this.selectedRowKeys,
        type: 'checkbox'
      }
    }
  },
  mounted() {
    this.$refs.query.init(scoreQuery)
  },
  methods: {
    handleSubmit (data) {
      console.log(data)
    }
  }
}
</script>

<style scoped lang="less">

</style>
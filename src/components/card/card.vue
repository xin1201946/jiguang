<template>
  <a-card :bordered="false">
    <div class="table-page-search-wrapper">
      <slot name="query"></slot>
    </div>
    <div class="table-operator">
      <slot name="operator"></slot>
    </div>
    <div>
      <slot></slot>
    </div>
  </a-card>
</template>

<script>
export default {
  name: 'card'
}
</script>

<style scoped lang="less">

</style>
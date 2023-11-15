<template>
  <div class="card">
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
  </div>
</template>

<script>
export default {
  name: 'card'
}
</script>

<style scoped lang="less">
.card{
  height: 100%;
  width: 100%;
  padding-bottom: 20px;
  /deep/.ant-card{
    height: 100%;
    width: 100%;
  }
  /deep/.ant-card-body{
    height: 100%;
    overflow-y: auto;
  }
}
</style>
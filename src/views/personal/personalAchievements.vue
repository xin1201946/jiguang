<template>
  <div class="box">
    <Card>
      <template slot="query">
        <a-form :form="form" layout="inline" @submit="handleSubmit">
          <a-row :gutter="24">
            <a-col :span="6">
              <a-form-item label="靶位">
                <a-input placeholder="请输入靶位号" v-model="form.targetSite" />
              </a-form-item>
            </a-col>
            <a-form-item>
              <a-space>
                <a-button html-type="submit" type="primary" icon="search" @click="handleSubmit">查询</a-button>
                <a-button @click="handleReset" icon="reload">重置</a-button>
              </a-space>
            </a-form-item>
          </a-row>
        </a-form>
      </template>
    </Card>
  </div>
</template>

<script>
import Card from '@comp/card/card.vue'
export default {
  name: 'personalAchievements',  //个人成绩
  components: {
    Card,
  },
  data() {
    return {
      form: {},
    }
  },
  methods: {
    handleSubmit() {

    },
    handleReset() {
      
     },
  }
}
</script>

<style lang="less" scoped></style>>
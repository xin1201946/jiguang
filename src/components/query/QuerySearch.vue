<template>
  <a-form
    :form="form"
    @submit="handleSubmit"
    layout="inline"
  >
    <a-row :gutter="24">
      <a-col :span="4" v-for="(item,i) in formData" :key="i">
        <a-form-item colon :label="item.label">
<!--          普通输入框-->
          <template v-if="item.type === 'input'">
            <a-input
              allowClear
              :placehorder="item.placehorder"
              v-decorator="item.rules"
            ></a-input>
          </template>
<!--          选择器-->
          <template v-else-if="item.type === 'select'">
            <a-select
              allowClear
              :placehorder="item.placehorder"
              v-decorator="item.rules"
            >
              <a-select-option
                v-for="value in item.data"
                :value="value.value"
              >{{ value.label }}</a-select-option>
            </a-select>
          </template>
<!--          数字输入框-->
          <template v-else-if="item.type === 'number'">
            <a-input
              :placehorder="item.placehorder"
              oninput="value=value.replace(/[^\d]/g,'')"
              allowClear
              v-decorator="item.rules"
            ></a-input>
          </template>
        </a-form-item>
      </a-col>
      <a-col :span="6">
        <a-form-item :labelCol="{span: 0}">
          <a-space>
            <a-button html-type="submit" type="primary" icon="search">查询</a-button>
            <a-button @click="handleReset" icon="reload">重置</a-button>
          </a-space>
        </a-form-item>
      </a-col>
    </a-row>
  </a-form>
</template>

<script>
export default {
  name: 'querySearch',
  data() {
    return {
      formData: [],
      form: this.$form.createForm(this, {name: 'search'}),
      resets: []
    }
  },
  methods: {
    init(arr) {
      this.formData = arr
      this.resets = []
      for (const item of arr) {
        this.resets.push(item.rules[0])
      }
    },
    handleSubmit (e) {
      e.preventDefault();
      this.form.validateFields( (errors, values) => {
        this.$emit("submit", values)
      })
    },
    handleReset() {
      this.form.resetFields(this.resets)
      this.$nextTick(() => {
        const obj = {}
        for (const item of this.resets) {
          obj[item] = undefined
        }
        this.$emit('reset', obj)
      })
    }
  }
}
</script>



<style scoped lang="scss">

</style>
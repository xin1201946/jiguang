<template>
  <a-form
    :wrapperCol="wrapperCol"
    :labelCol="labelCol"
    :form="form"
    @submit="handleSubmit"
  >
    <a-row :gutter="24">
      <a-col :span="5" v-for="(item,i) in formData" :key="i">
        <a-form-item colon :label="item.label">
          <template v-if="item.type === 'input'">
            <a-input v-decorator="item.rules"></a-input>
          </template>
          <template v-else-if="item.type === 'select'">
            <a-select v-decorator="item.rules">
              <a-select-option
                v-for="value in item.data"
                :value="value.value"
              >{{ value.label }}</a-select-option>
            </a-select>
          </template>
        </a-form-item>
      </a-col>
      <a-col :span="6">
        <a-form-item :labelCol="{span: 0}">
          <a-space>
            <a-button html-type="submit" type="primary">查询</a-button>
            <a-button @click="handleReset">重置</a-button>
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
      wrapperCol: {
        span: 14
      },
      labelCol: {
        span: 8
      },
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
          obj[item] = ''
        }
        this.$emit('reset', obj)
      })
    }
  }
}
</script>



<style scoped lang="scss">

</style>
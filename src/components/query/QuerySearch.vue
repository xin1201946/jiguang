<template>
  <a-form-model :form="form" @submit="handleSubmit" layout="inline">
    <a-row :gutter="24" v-if="formData.length">
      <a-col :span="item.span || (item.label.length > 5 ? 5 : 4)" v-for="(item, i) in formData">
        <a-form-model-item colon :label="item.label" :key="i">
          <!--          普通输入框-->
          <template v-if="item.type === 'input'">
            <a-input allowClear :placeholder="item.placeholder" v-decorator="item.rules"></a-input>
          </template>
          <!--          选择器-->
          <template v-else-if="item.type === 'select'">
            <a-select
              :allowClear="item.value ? false : true"
              :placeholder="item.placeholder"
              v-decorator="item.rules"
            >
              <a-select-option
                v-for="value in item.data"
                :value="value.value"
                :key="value.value"
              >{{ value.label }}
              </a-select-option>
            </a-select>
          </template>
          <!--          数字输入框-->
          <template v-else-if="item.type === 'number'">
            <a-input
              :placeholder="item.placeholder"
              oninput="value=value.replace(/[^\d]/g,'')"
              allowClear
              v-decorator="item.rules"
            ></a-input>
          </template>
          <!--          日期范围-->
          <template v-else-if="item.type === 'range'">
            <a-range-picker
              allowClear
              valueFormat="YYYY-MM-DD HH:mm:ss"
              :placeholder="item.placeholder"
              v-decorator="item.rules"
            ></a-range-picker>
          </template>
          <!--          查询-->
          <template v-else-if="item.type === 'search'">
            <a-select
              allowClear
              show-search
              :placeholder="item.placeholder"
              v-decorator="item.rules"
              style="width: 100%"
              @search="v => fetchUser(v, item.data)"
              @change="handleChange"
            >
              <a-spin v-if="fetching" slot="notFoundContent" size="small" />
              <a-select-option
                v-else
                v-for="(value, i) in item.data"
                :value="value.value"
                :key="i"
              >{{ value.label }}
              </a-select-option>
            </a-select>
          </template>
        </a-form-model-item>
      </a-col>
      <a-col :span='4'>
        <a-form-model-item :labelCol="{ span: 0 }">
          <a-space>
            <a-button html-type="submit" type="primary" icon="search">查询</a-button>
            <a-button @click="handleReset" icon="reload">重置</a-button>
          </a-space>
        </a-form-model-item>
      </a-col>
    </a-row>

<!--    <a-row v-if="formData.length" :gutter="24">
&lt;!&ndash;      :span="item.span || (item.label.length > 5 ? 5 : 4)"&ndash;&gt;
      <a-col
        :xl="item.span || (item.label.length > 5 ? 5 : 4)"
        :lg=" (item.label.length > 5 ? 6 : 5)"
        :md="(item.label.length > 5 ? 7 : 6)"
        :sm="(item.label.length > 5 ? 8 : 7)"
        :xs="24"
       >

      </a-col>
      <a-col :span="6">

      </a-col>
    </a-row>-->
  </a-form-model>
</template>

<script>
export default {
  name: 'querySearch',
  data() {
    return {
      formData: [],
      form: this.$form.createForm(this, { name: 'search' }),
      resets: [],
      obj: {},
      fetching: false
    }
  },
  methods: {
    init(arr) {
      if (arr) {
        this.formData = arr
        this.resets = []
        for (const item of arr) {
          this.resets.push(item.rules[0])
          if (item.value) {
            this.obj[item.rules[0]] = item.value
          }
        }
        this.$nextTick(() => {
          this.form.setFieldsValue(this.obj)
        })
      } else {
        this.formData = []
        this.resets = []
      }
    },
    handleSubmit(e) {
      e.preventDefault()
      this.form.validateFields((errors, values) => {
        let flag = false
        for (const key in values) {
          if (Array.isArray(values[key])) {
            flag = true
          }
        }
        if (flag) {
          const obj = {}
          for (const key in values) {
            if (Array.isArray(values[key])) {
              const range = this.formData.filter(item => item.range).length ? this.formData.filter(item => item.range)[0].range : [null, null]
              obj[(range[0] || 'start')] = values[key][0]
              obj[(range[1] || 'end')] = values[key][1]
            } else {
              obj[key] = values[key]
            }
          }
          this.$emit("submit", obj)
        } else {
          this.$emit("submit", values)
        }
      })
    },
    handleReset() {
      this.form.resetFields(this.resets)
      this.form.setFieldsValue(this.obj)
      this.$nextTick(() => {
        const obj = {}
        if (this.resets.length) {
          for (const item of this.resets) {
            obj[item] = undefined
          }
        }
        this.$emit('reset', { ...obj, ...this.obj })
      })
    },
    fetchUser(value, data) {
      // console.log(value, data)
    },
    handleChange(value) {
      // console.log(value)
    }
  }
}
</script>



<style scoped lang="less"></style>
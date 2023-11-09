import { bizDeviceList } from '@api/biz'



const bizMixins = {
  data(){
    return {
      pagination: {
        current: 1,
        pageSize: 10,
        total: 20
      },
      device: []
    }
  },
  methods: {
    // 分页
    handleTableChange (pagination) {
      this.pagination = pagination
      this.getList()
    },
    // 添加按钮
    handleAdd(type) {
      if (type) {
        this.$refs.modal.init(type)
      }else {
        this.$refs.modal.init()
      }

    },
    // 查询重置按钮
    handleSearch(data) {
      for (const key in this.query) {
        this.query[key] = data[key]
      }
      this.pagination.current = 1
      this.$nextTick(() => {
        this.getList()
      })
    },
    // 弹窗确定回调
    handleList() {
      this.getList()
    },
    // 点击编辑
    handleEdit(record) {
      this.$refs.modal.edit(record)
    },
    // 编辑弹窗初始化
    edit(row, type) {
      this.visible = true
      this.title = '修改'
      this.type = 1
      switch (type) {
        case 'device':
          bizDeviceList({}).then(res => {
            console.log(res)
            this[type] = res.result
          })
          break
      }
      this.$nextTick(() => {
        for (const key in this.formData) {
          this.formData[key] = row[key]
        }
      })
    },
    // 添加弹窗初始化
    init(type) {
      this.visible = true
      this.title = '添加'
      this.type = 0
      switch (type) {
        case 'device':
          bizDeviceList({}).then(res => {
            console.log(res)
            this[type] = res.result
          })
          break
      }
      this.$nextTick(() => {
        for (const key in this.formData) {
          this.formData[key] = undefined
        }
        this.$refs.form.clearValidate()
      })
    },
  }
}

export default bizMixins
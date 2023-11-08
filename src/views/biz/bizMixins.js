const bizMixins = {
  data(){
    return {
      pagination: {
        current: 1,
        pageSize: 10,
        total: 20
      }
    }
  },
  methods: {
    handleTableChange (pagination) {
      this.pagination = pagination
      this.getList()
    },
    handleAdd() {
      this.$refs.modal.init()
    },
    handleSearch(data) {
      for (const key in this.query) {
        this.query[key] = data[key]
      }
      this.pagination.current = 1
      this.$nextTick(() => {
        this.getList()
      })
    },
    handleList() {
      this.getList()
    },
    handleEdit(record) {
      this.$refs.modal.edit(record)
    },
    edit(row) {
      this.visible = true
      this.title = '修改'
      this.type = 1
      this.$nextTick(() => {
        for (const key in this.formData) {
          this.formData[key] = row[key]
        }
      })
    },
    init() {
      this.visible = true
      this.title = '添加'
      this.type = 0
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
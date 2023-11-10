import { bizDeviceList, bizTabletPcList } from '@api/biz'
import Vue from 'vue'
import { ACCESS_TOKEN, TENANT_ID } from '@/store/mutation-types'



const bizMixins = {
  computed: {
    //token header
    tokenHeader(){
      let head = {'X-Access-Token': Vue.ls.get(ACCESS_TOKEN)}
      let tenantid = Vue.ls.get(TENANT_ID)
      if(tenantid){
        head['tenant-id'] = tenantid
      }
      return head;
    },
    importExcelUrl: function(){
      return `${window._CONFIG['domianURL']}/${this.api}`;
    }
  },
  data(){
    return {
      pagination: {
        current: 1,
        pageSize: 10,
        total: 20
      },
      device: [],
      type: {}
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
      this.getType(type)
      this.$nextTick(() => {
        for (const key in this.formData) {
          this.formData[key] = row[key]
        }
        this.$refs.form.clearValidate()
      })
    },
    getType(type) {
      switch (type) {
        case 'device':
          bizDeviceList({}).then(res => {
            console.log(res)
            this[type] = res.result
          })
          break
        case 'tablePc':
          bizTabletPcList().then(res => {
            this.type[type] = res.result
          })
      }
    },
    // 添加弹窗初始化
    init(type) {
      this.visible = true
      this.title = '添加'
      this.type = 0
      this.getType(type)
      this.$nextTick(() => {
        for (const key in this.formData) {
          this.formData[key] = undefined
        }
        this.$refs.form.clearValidate()
      })
    },
   // 导入
    handleImportExcel(info) {
      const { file } = info
      console.log(file)
      if (file.status === "uploading") {

      }
      if (file.status === "done") {
        const {response} = file
        if (response.code === 200) {
          this.$message.success("导入成功")
          this.pagination.current = 1
          this.getList()
        }else {
          this.$message.warning(response.message)
        }
      }
    },
    downLoad(data, name) {
      if (!data || data.size === 0){
        this.$message.warning("文件下载失败")
      }else{
        const url = window.URL.createObjectURL(new Blob([data]), name)
        const a = document.createElement("a")
        a.style.display = "none"
        a.href = url
        a.setAttribute("download", name)
        document.body.appendChild(a)
        a.click()
        document.body.removeChild(a)
        window.URL.revokeObjectURL(url)
      }
    }
  }
}

export default bizMixins
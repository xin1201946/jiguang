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
        total: 0
      },
      types: {
        tablePc: [],
        device: []
      },
      loadingModal: false
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
    handleEdit(record, type) {
      if (type) {
        this.$refs.modal.edit(record, type)
      }else {
        this.$refs.modal.edit(record)
      }
    },
    // 编辑弹窗初始化
    edit(row, type) {
      this.visible = true
      this.loadingModal = false
      this.title = '修改'
      this.type = 1
      if (type){
        this.getType(type)
      }
      this.$nextTick(() => {
        for (const key in this.formData) {
          this.formData[key] = row[key]
        }
        if (this.$refs.form) {
          this.$refs.form.clearValidate()
        }
      })
    },
    // 设置types
    getType(type) {
      switch (type) {
        // 设备集合
        case 'device':
          bizDeviceList({}).then(res => {
            this.types[type] = res.result
          })
          break
        // 平板集合
        case 'tablePc':
          bizTabletPcList().then(res => {
            this.types[type] = res.result
          })
          break
      }
    },
    // 添加弹窗初始化
    init(type) {
      this.loadingModal = false
      this.visible = true
      this.title = '添加'
      this.type = 0
      if (type){
        this.getType(type)
      }
      this.$nextTick(() => {
        for (const key in this.formData) {
          this.formData[key] = undefined
        }
        if (this.$refs.form) {
          this.$refs.form.clearValidate()
        }
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
          this.$nextTick(() => {
            this.getList()
          })
        }else {
          this.$message.warning(response.message)
        }
      }
    },
    downLoad(data, name) {
      if (!data || data.size === 0){
        this.$message.warning("文件下载失败")
      }else{
        const blob = new Blob([data], {type: 'application/vnd.ms-excel'})
        const url = window.URL.createObjectURL(blob)
        const a = document.createElement('a')
        a.style.display = 'none'
        a.href = url
        a.setAttribute('download', name)
        document.body.appendChild(a)
        a.click()
        document.body.removeChild(a)
        window.URL.revokeObjectURL(url)
      }
    },
    callback(res) {
      if (res.code === 200) {
        this.$message.success(res.message)
        this.handleCancel()
        this.$emit("list")
      }else {
        this.$message.warning(res.message)
      }
      this.loadingModal = false
    },
  }
}

export default bizMixins
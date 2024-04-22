<template>
  <a-drawer
    :title="title"
    :maskClosable="true"
    :width="drawerWidth"
    placement="right"
    :closable="true"
    @close="handleCancel"
    :visible="visible"
    style="height: 100%;"
  >
    <a-form-model ref="form" :model="model" :rules="validatorRules">
      <a-form-model-item
        label="充值次数"
        :labelCol="labelCol"
        :wrapperCol="wrapperCol"
        prop="memberCardNum"
      >
        <a-input type="number" v-model="model.memberCardNum" placeholder="请输入充值次数" />
      </a-form-model-item>
    </a-form-model>
    <div class="drawer-bootom-button" v-show="!disableSubmit">
      <a-popconfirm title="确定放弃编辑？" @confirm="handleCancel" okText="确定" cancelText="取消">
        <a-button style="margin-right: .8rem">取消</a-button>
      </a-popconfirm>
      <a-button @click="handleSubmit" type="primary" :loading="confirmLoading">提交</a-button>
    </div>
  </a-drawer>
</template>

<script>
import { sysUserUserRenew } from '@api/api'

export default {
  name: 'UserVipModal',
  data() {
    return {
      title: "会员卡充值",
      visible: false,
      drawerWidth: "460",
      disableSubmit:false,
      confirmLoading: false,
      model: {
        id: "",
        memberCardNum: ""
      },
      labelCol: {
        xs: { span: 24 },
        sm: { span: 5 },
      },
      wrapperCol: {
        xs: { span: 24 },
        sm: { span: 16 },
      },
      validatorRules: {
        memberCardNum: [
          {required: true, message: '请输入充值次数!'} ,
        ]
      }
    }
  },
  methods: {
    show(row) {
      console.log(row)
      this.model.id = row.id
      this.model.memberCardNum = row.memberCardNum
      this.visible = true;
      this.$nextTick(() => {
        this.$refs.form.clearValidate();
      })
    },
    handleSubmit() {
      this.$refs.form.validate(valid => {
        if (valid) {
          this.confirmLoading = true;
          sysUserUserRenew(this.model).then(res => {
            if(res.success){
              this.$message.success(res.message || "重置成功");
              this.$emit('ok');
            }else{
              this.$message.warning(res.message);
            }
          }).finally(() => {
            this.confirmLoading = false;
            this.close();
          })
        }
      })
      // sysUserUserRenew()
    },
    close () {
      this.$emit('close');
      this.visible = false;
      this.disableSubmit = false;
      this.nextDepartOptions=[];
      this.departIdShow=false;
      this.$refs.form.resetFields();
    },
    handleCancel() {
      this.visible = false;
      this.disableSubmit = false;
      this.$refs.form.resetFields();
    }
  }
}
</script>

<style scoped lang='less'>
.drawer-bootom-button {
  position: absolute;
  bottom: 0;
  width: 100%;
  border-top: 1px solid #e8e8e8;
  padding: 10px 16px;
  text-align: right;
  left: 0;
  background: #fff;
  border-radius: 0 0 2px 2px;
}
</style>
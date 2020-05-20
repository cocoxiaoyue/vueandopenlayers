<template>
  <a-form
    id="components-form-demo-normal-login"
    :form="form"
    class="login-form"
    @submit="handleSubmit"
  >
    <a-form-item>
      <a-input
        v-decorator="[
          'userName',
          { rules: [{ required: true, message: '请输入用户名!' }] },
        ]"
        placeholder="用户名"
      >
        <a-icon slot="prefix" type="user" style="color: rgba(0,0,0,.25)" />
      </a-input>
    </a-form-item>
    <a-form-item>
      <a-input
        v-decorator="[
          'password',
          { rules: [{ required: true, message: '请输入密码!' }] },
        ]"
        type="password"
        placeholder="密码"
      >
        <a-icon slot="prefix" type="lock" style="color: rgba(0,0,0,.25)" />
      </a-input>
    </a-form-item>
    <a-row type="flex" justify="space-between" align="middle" style="margin-bottom:20px">
      <a-col>
        <a-input v-model="verification" placeholder="验证码"></a-input>
      </a-col>
      <a-col>
        <div style="identifyCode" v-on:click="changeIdentifyCode()">
          <Verification :identifyCode="identifyCode" :fontSizeMin="30" :fontSizeMax="45" />
        </div>
      </a-col>
    </a-row>
    <a-form-item>
      <a-button type="primary" html-type="submit" class="login-form-button">登录</a-button>
      <!-- Or
      <a href>register now!</a>-->
      <a-row type="flex" justify="space-around" align="middle">
        <a-col>
          <a-checkbox
            v-decorator="[
          'remember',
          {
            valuePropName: 'checked',
            initialValue: true,
          },
        ]"
          >记住账号</a-checkbox>
        </a-col>
        <a-col>
          <a class="login-form-forgot" href>忘记密码</a>
        </a-col>
      </a-row>
    </a-form-item>
  </a-form>
</template>

<script>
import Verification from "../verification";

export default {
  name: "LoginIndex",
  components: { Verification },
  data() {
    return {
      formLayout: "horizontal",
      identifyCode: "",
      verification: "",
      form: this.$form.createForm(this, { name: "coordinated" })
    };
  },
  beforeCreate() {
    this.form = this.$form.createForm(this, { name: "normal_login" });
  },
  created: function() {
    this.changeIdentifyCode();
  },
  methods: {
    changeIdentifyCode() {
      let codeStr =
        "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";
      var str = "";
      // 验证码有几位就循环几次
      for (var i = 0; i < 4; i++) {
        var ran = Math.floor(Math.random() * 62);
        str += codeStr.charAt(ran);
      }
      this.identifyCode = str;
    },
    handleSubmit(e) {
      e.preventDefault();
      this.form.validateFields((err, values) => {
        if (!err) {
          if (
            this.verification.toLowerCase() === this.identifyCode.toLowerCase()
          ) {
            // console.log(values.userName);
            // console.log(values.password);
            if (values.userName === "admin" && values.password === "admin") {
              localStorage.setItem("token", values.userName);
              this.$router.push({ path: "/" });
            }
          } else {
            this.$message.warn("验证码输入错误！");
          }
        }
      });
    }
  }
};
</script>
<style>
#components-form-demo-normal-login .login-form {
  max-width: 300px;
}
#components-form-demo-normal-login .login-form-forgot {
  float: right;
}
#components-form-demo-normal-login .login-form-button {
  width: 100%;
}
.identifyCode {
  width: 100%;
  height: 100%;
  cursor: pointer;
}
</style>

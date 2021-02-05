
<template>
  <div>
    <div class="app-container">用户管理</div>
    <!-- 检索数据 -->
    <div class="filter-container">
      <el-form ref="sf" :model="searchForm" :inline="true">
        <el-form-item label="用户名" prop="userName">
          <el-input
            v-model="searchForm.userName"
            placeholder="用户名"
          ></el-input>
        </el-form-item>

        <el-form-item label="学历" prop="degree">
          <el-select v-model="searchForm.degree" placeholder="学历">
            <el-option
              v-for="(value, key) in degreeMap"
              :key="key"
              :label="value"
              :value="key"
            ></el-option>
          </el-select>
        </el-form-item>

        <el-form-item label="" prop="type">
          <el-radio
            v-for="(value, key) in typeMap"
            :key="key"
            v-model="searchForm.type"
            :label="key"
          >
            {{ value }}
          </el-radio>
        </el-form-item>

        <!-- 按钮部分 -->
        <el-form-item label="">
          <el-button
            type="warning"
            size="medium"
            icon="el-icon-edit"
            @click="reset"
            >重置</el-button
          >
          <el-button
            type="primary"
            size="medium"
            icon="el-icon-edit"
            @click="search"
            >查询</el-button
          >
          <el-button
            type="success"
            size="medium"
            icon="el-icon-edit"
            @click="addDialog"
            >添加</el-button
          >
        </el-form-item>
      </el-form>
    </div>

    <!-- 添加更新dialog -->
    <el-dialog
      :title="methodType"
      :visible.sync="dialogVisible"
      width="35%"
      :before-close="dialogCancle"
      center
    >
      <el-form
        ref="editForm"
        :model="editForm"
        :rules="editRules"
        label-width="100px"
        label-position="right"
        label-suffix=":"
      >
        <el-form-item label="用户名" prop="userName">
          <el-input
            v-model.lazy="editForm.userName"
            placeholder="输入用户名"
            :disabled="isUpdate"
          />
        </el-form-item>

        <el-form-item label="用户类型" prop="type">
          <el-radio
            v-for="(value, key) in typeMap"
            :key="key"
            v-model="editForm.type"
            :label="key"
          >
            {{ value }}
          </el-radio>
        </el-form-item>

        <el-form-item label="性别" prop="sex">
          <el-radio
            v-for="(value, key) in sexMap"
            :key="key"
            v-model="editForm.sex"
            :label="key"
          >
            {{ value }}
          </el-radio>
        </el-form-item>
        <el-form-item label="学历" prop="degree">
          <el-select v-model="editForm.degree" placeholder="">
            <el-option
              v-for="(value, key) in degreeMap"
              :key="key"
              :value="key"
              :label="value"
            >
              {{ value }}
            </el-option>
          </el-select>
        </el-form-item>

        <el-form-item label="爱好">
          <el-checkbox-group v-model="checkHobby">
            <el-checkbox
              v-for="(h, index) in hobbyList"
              :key="index"
              :label="h"
            />
          </el-checkbox-group>
        </el-form-item>

        <el-form-item label="生日">
          <el-date-picker
            v-model="editForm.birthday"
            type="date"
            placeholder="选择日期"
            value-format="yyyy-MM-dd"
          ></el-date-picker>
        </el-form-item>

        <el-form-item label="简介">
          <el-input
            v-model="editForm.content"
            placeholder="简介"
            type="textarea"
            rows="7"
          />
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="dialogCancle">取消</el-button>
        <el-button type="primary" @click="submitForm">保存</el-button>
      </span>
    </el-dialog>

    <!-- 列表显示 -->
    <el-table :data="list" border stripe>
      <el-table-column label="用户名" prop="userName" align="center" />
      <el-table-column label="性别" prop="sex" align="center">
        <template slot-scope="scope">
          <span> {{ scope.row.sex | sexFilter }} </span>
        </template>
      </el-table-column>

      <el-table-column label="学历" prop="degree" align="center">
        <template slot-scope="scope">
          <span> {{ scope.row.degree | degreeFilter }} </span>
        </template>
      </el-table-column>

      <el-table-column label="爱好" prop="hobby" align="center" />
      <el-table-column label="生日" prop="birthday" align="center" />
      <el-table-column label="简介" prop="content" align="center" />

      <el-table-column label="用户类型" prop="type" align="center">
        <template slot-scope="scope">
          <span> {{ scope.row.type | typeFilter }} </span>
        </template>
      </el-table-column>
      <!-- 弹出对话框 -->

      <el-table-column label="操作" align="center">
        <template slot-scope="scope">
          <el-button size="mini" @click="updateDialog(scope.row)"
            >修改
          </el-button>

          <el-button type="danger" size="mini" @click="del(scope.row)"
            >删除
          </el-button>
        </template>
      </el-table-column>
    </el-table>

    <!-- 分页显示 -->
    <div class="pagination">
      <el-pagination
        :total="total"
        :current-page="pageNum"
        :page-size="pageSize"
        :page-sizes="pageSizes"
        @current-change="handleCurrentChange"
        @size-change="handleSizeChange"
        layout="total,sizes,prev,pager,next,jumper"
      ></el-pagination>
    </div>
  </div>
</template>
<script>
import App from "@/App.vue";
import { getList, addUser, updateUser, delUser } from "../../api/user";
import { valid } from "mockjs";

var app;

export default {
  components: { App },

  filters: {
    sexFilter(sex) {
      return app.sexMap[sex];
    },
    degreeFilter(degree) {
      return app.degreeMap[degree];
    },
    typeFilter(type) {
      return app.typeMap[type];
    },
  },

  beforeCreate() {
    app = this;
  },

  data() {
    return {
      hobbyList: ["游泳", "体育", "滑冰"],
      checkHobby: [], // 复选框数据
      editForm: {
        //  编辑数据
        id: "",
        userName: "",
        pwd: "123456",
        sex: "1",
        degree: "1",
        content: "",
        hobby: "",
        birthday: "",
        type: "1",
      },

      editRules: {
        // 效验规则
        userName: [
          {
            required: true,
            message: "用户名必须添加",
            trigger: "blur",
          },
          {
            min: 3,
            max: "12",
            message: "长度在3到12个字符",
            trigger: "blur",
          },
          {
            pattern: /^(\w){3,20}$/,
            message: "只能输入3-20个字母、数字、下划线",
          },
        ],
        birthday: [
          {
            required: true,
            message: "日期必须添加",
            trigger: "blur",
          },
        ],
        content: [
          {
            required: true,
            message: "简介必须添加",
            trigger: "blur",
          },
        ],
      },

      methodType: "", // 操作类型：添加、更新
      dialogVisible: false, // 对话框的显示
      isUpdate: false, // 是否是更新

      searchForm: {
        // 检索数据
        userName: "",
        type: "",
        degree: "",
      },

      list: [], // 列表数据
      pageNum: 1, // 页数,
      pageSize: 2, // 每页数量
      total: 0, // 总记录数
      pageSizes: [2, 4, 6, 8],

      sexMap: {
        1: "男",
        0: "女",
      },

      typeMap: {
        1: "普通用户",
        9: "管理员",
      },

      degreeMap: {
        1: "研究生",
        2: "本科生",
        3: "高中",
        4: "初中",
        5: "小学",
      },
    };
  },

  methods: {
    fetchData() {
      //  添加fetchData 方法，获得服务器的数据。
      // 定义参数
      const query = {
        pageSize: this.pageSize, // 每页的数量
        pageNum: this.pageNum, // 页数
        userName: this.searchForm.userName,
        degree: this.searchForm.degree,
        type: this.searchForm.type,
      };
      // 调用api中定义的方法
      getList(query).then((res) => {
        // 取出data的数据
        const { data } = res;
        // 获得列表
        this.list = data.list;
        // /获得总记录数
        this.total = Number(data.total);
      });
    },

    handleCurrentChange(val) {
      this.pageNum = val;
    },

    handleSizeChange(val) {
      this.pageSize = val;
      this.pageNum = 1; // 当前页面数量发生变化，返回的是第一页。
    },

    search() {
      // 检索数据
      this.fetchData();
    },
    reset() {
      // 重置
      this.$refs["sf"].resetFields();
      this.pageNum = 1; //  回到第一页
      this.fetchData();
    },

    // 显示添加对话框架
    addDialog() {
      this.dialogVisible = !this.dialogVisible;
      this.methodType = "添加用户";
      this.isUpdate = false;
    },
    dialogCancle() {
      this.$refs["editForm"].resetFields();
      this.dialogVisible = !this.dialogVisible;
      // 清空对象的值
      Object.keys(this.editForm).forEach((key) => (this.editForm[key] = ""));

      //默认值
      this.editForm.sex = "1";
      this.editForm.degree = "1";
      // 清空数组
      this.checkHobby = [];
    },

    add() {
      // 添加数据
      addUser(this.editForm).then((res) => {
        if (res == null) return;
        // 关闭窗口，刷新数据
        this.dialogCancle();
        this.fetchData();
        this.$message({
          message: res.responseMsg,
          type: "success",
        });
      });
    },
    // 编辑操作
    submitForm() {
      this.$refs["editForm"].validate((valid) => {
        if (valid) {
          //  验证通过
          if (this.isUpdate) {
            // 更新
            this.update();
          } else {
            // 添加
            this.add();
          }
        }
      });
    },

    updateDialog(row) {
      this.dialogVisible = !this.dialogVisible;
      this.methodType = "更新用户";
      this.isUpdate = true; // 更新标识

      Object.assign(this.editForm, row); // 浅拷贝，取消更新窗口的影响
      this.checkHobby = row.hobby.split(","); // 将数据转换为数组
    },
    update() {
      // 更新方法
      updateUser(this.editForm).then((res) => {
        if (res == null) return;
        //关闭窗口，刷新数据
        this.dialogCancle();
        this.fetchData();
        this.$message({
          message: res.responseMsg,
          type: "success",
        });
      });
    },

    del(row) {
      // 删除数据
      if (this.total > 1) {
        // 保留一条数据
        this.$confirm("时候删除用户", "警告", {
          confirmButtonText: "确定",
          cancelButtonText: "取消",
          type: "warning",
        })
          .then(() => {
            delUser(row).then((res) => {
              if (res == null) return;
              this.fetchData();
              this.$message({
                message: res.responseMsg,
                type: "success",
              });
            });
          })
          .catch(() => {}); // catch 放置错误
      } else {
        this.$message({
          message: "最后一条数据不能删除",
          type: "error",
        });
      }
    },
  },

  mounted() {
    // 获取数据
    this.fetchData();
  },

  watch: {
    pageNum: function () {
      this.fetchData();
    },
    pageSize: function () {
      this.fetchData();
    },
    checkHobby: function () {
      // 爱好的数组转换为字符串
      this.editForm.hobby = this.checkHobby.toString();
    },
  },
};
</script>

<style scoped>
.pagination {
  margin-top: 10px;
  text-align: right;
}

.filter-container {
  float: right;
  margin-bottom: 10px;
}
</style>

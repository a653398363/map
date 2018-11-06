<template>
<div class="Maintain">
    <el-form class="query-from" label-width="110px" ref="query" :model="query">
        <el-row>
            <el-col :span="5" :xs="5">
            <el-form-item label="站场名称">
                <el-select v-model="query.ZCDM" filterable clearable placeholder="请选择">
                  <el-option v-for="item in options" :key="item.ItemId" :label="item.ItemName" :value="item.ItemId">
                  </el-option>
                </el-select>
            </el-form-item>
            </el-col> 
            <el-col :span="5" :xs="5">
            <el-form-item label="站场地点">
                <el-input placeholder="请输入" v-model.trim="query.XZQMC" ></el-input>
            </el-form-item>
            </el-col>
            <el-col :span="6" :xs="6">
                <div class="button-container">
                  <el-button type="primary" size="small" icon="el-icon-search" @click="queFun">查询</el-button>
              </div>
            </el-col>
        </el-row>
    </el-form>
    <div class="table-wrapper">
        <el-table :data="ZCData" height="1000px" border stripe @row-dblclick="dbClick">
            <el-table-column prop="ZCMC"  header-align="center" align="left" label="站场名称">
            </el-table-column>
            <el-table-column prop="ZCMC_JC"  header-align="center" align="left" label="站场简称">
            </el-table-column>
            <el-table-column prop="ZCLXMC"  header-align="center" align="left" label="站场类型">
            </el-table-column>
            <el-table-column prop="XZQMC"  header-align="center" align="left" label="站场地点">
            </el-table-column>
            <el-table-column prop="ZCBG"  header-align="center" align="left" label="站场标高">
            </el-table-column>
            <el-table-column prop="ZJM" header-align="center" align="left" label="助记码">
            </el-table-column>
            <!-- <el-table-column prop="GI_id"  header-align="center" align="left" label="地理信息ID">
            </el-table-column> -->
            <el-table-column prop="caozuo" header-align="center" align="center" label="操作">
                <template slot-scope="scope">
                    <el-tooltip content="修改点位" placement="top">
                        <i @click="EditFun(scope.row.ZCDM)" class="el-icon-edit"></i>
                      </el-tooltip>
                      <!-- <el-tooltip content="新增点位" placement="top">
                        <i @click="dialogVisible = true" class="el-icon-edit-outline"></i>
                      </el-tooltip> -->
                </template>
            </el-table-column>
      </el-table>
    </div>
</div>
</template>

<script>
export default {
  props: {
    coorObj: Object
  },
  data() {
    return {
      options:[],
      query: {
        ZCDM: "",
        XZQMC: ""
      },
      ZCData: [
        {
          ZCDM: "",
          ZCMC: "",
          ZCMC_JC: "",
          ZCLXMC: "",
          XZQMC: "",
          ZCBG: "",
          ZJM: ""
          //GI_id:"23"
        }
      ] //表格集合
    };
  },
  watch: {},
  created() {
    this.handleSelect(this.query);
    console.log(333333);
    this.ShowZCMC();
  },
  methods: {
      queFun(){
          this.handleSelect(this.query);
      },
    //模糊查询;
    handleSelect(obj) {
         var zcdm = obj.ZCDM;
         var xzqmc = obj.XZQMC;
      console.log(333333333,obj)
      this.axios
        .post("Stationaddition/ShowZCXXdata?zcdm="+zcdm+" &xzqmc="+xzqmc+" ", zcdm = zcdm, xzqmc = xzqmc) //查询
        //.post("Stationaddition/ShowZCXXdata?zcmc=&xzqmc=", zcmc = zcmc, xzqmc = xzqmc) //查询
        .then(_ => {
          this.ZCData = _.data.Data;
        })
        .catch(err => {
          // errorMessage(err)
        });
    },
    EditFun(val) {
      var Zcdm = val || "";
      debugger
      //this.$router.push({ name: "show-new-view", query: { ZCDM: obj.ZCDM } });
      this.$router.push({ name: "show-new-view",query:{ZCDM : Zcdm}  });
    },
    dbClick(val) {
        var Zcdm = val.ZCDM;
        this.$router.push({ name: "show-new-view",query:{ZCDM : Zcdm}  });
    },
    ShowZCMC(){
      this.axios
        .post("/Stationtype/LoadShowZCMC") //填充管线名称
        .then(res=> {
          this.options = res.data.Data;
          this.query.ZCDM = res.data.Data[0].ItemId
        })
        .catch(err => {
          errorMessage(err)
        });
    }
  }
};
</script>

<style scoped>
.Maintain{
    width: 100%;
  height: 100%;

  .query-from{
      height: 10%;
  }

  .table-wrapper{
      height: 90%;
  }
}

</style>
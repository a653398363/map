<template>
  <div class="frame">
    <el-dialog :title=" $parent.Isupdate == 'true' ? '修改场站':'新增场站'" width="450px" :visible.sync="popupVisble" >
      <!-- <span slot="title" class="dialog-title">
      </span> -->
      <el-form class="query-from" label-width="110px" ref="query" :model="query">
        <el-row >
            <el-form-item label="场站名称:">
              <el-select v-model="userinfo.zcdm" filterable placeholder="请选择" @change="handleSelect">
              <el-option
                v-for="item in stationData"
                :key="item.ItemId"
                :label="item.ItemName"
                :value="item.ItemId">
              </el-option>
            </el-select>
            </el-form-item>
            </el-row>
            <el-row >
                <el-col>
                    <el-form-item label="地点:">
                        <template slot-scope="scoped">
                            <label>{{query.XZQMC}}</label>
                        </template>
                    </el-form-item>
                    <el-form-item label="类型:">
                        <template slot-scope="scoped">
                            <label>{{query.ZCLXMC}}</label>
                        </template>
                    </el-form-item>
                </el-col>
            </el-row>
            <el-row >
                <el-col>
                    <el-form-item label="显示层级:">
                        <el-checkbox-group v-model="checkList" @change="listchange">
                            <el-checkbox label="一层"></el-checkbox>
                            <el-checkbox label="二层"></el-checkbox>
                            <el-checkbox label="三层"></el-checkbox>
                        </el-checkbox-group>
                    </el-form-item>
                </el-col>
            </el-row>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="cancel">取 消</el-button>
        <el-button type="primary" @click="saveInfo">保 存</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
import {errorMessage,successMessage} from '@/util/message.js';
export default {
  props:{
    coorObj: Object
  },
  data() {
    return {
      timeout:null,
      popupVisble: false,
      stationData: [
        {
          value: "站场1",
          label: "站场1"
        },
        {
          value: "站场2",
          label: "站场2"
        },
        {
          value: "站场3",
          label: "站场3"
        }],
      query: {
        ZCDM: "暂无", //站场名称
        XZQMC: "暂无", //行政区名称
        ZCLXMC: "暂无" //站场类型名称
      },
      checkList: ["一层"],
      userinfo:{
        "zcdm": "23",      //场站名字
        "giMd": {           //地图位置
          "keyId":"",
          "is_display1": "1",     //0 不显示， 1显示
          "is_display2": "0",
          "is_display3": "0",
        },
        "featureVo":"",
      },
    };
  },
  watch:{
    '$parent.coorObj'(){
      this.watchCzdm()
    }
  },
  created() {
    //自定义方法
    this.loadTable()
    
  },
  methods: {
    watchCzdm(){
      console.log('coorObj',this.coorObj,!this.coorObj.properties)
      if(this.$parent.Isupdate == true && !this.coorObj.properties == false){
        console.log(this.coorObj.properties.dataId.trim().length)
        this.handleSelect(this.coorObj.properties.dataId)
        this.userinfo.giMd.keyId = this.coorObj.id;
        this.stationData.map(item=>{
          if(item.ItemId == this.coorObj.properties.dataId.trim()){
            this.userinfo.zcdm = item.ItemName;
          }
        })
      }else{
        this.loadTable()
      }
    },
    //自定义方法集合
    loadTable() {
      this.axios
        .post("/Stationtype/LoadShowZCMC") //下拉框
        .then(res=> {
          this.stationData = res.data.Data;
          this.userinfo.zcdm = res.data.Data[0].ItemId;
          this.handleSelect(res.data.Data[0].ItemId)
        })
        .catch(err => {
          // errorMessage(err)
        });
    },
    //显示层级改变
    listchange(){
      let _this = this;
      if(_this.checkList.indexOf("一层") != '-1'){
        _this.userinfo.giMd.is_display1 = '1'
      }else{
        _this.userinfo.giMd.is_display1 = '0'
      }
      if(_this.checkList.indexOf("二层") != '-1'){
        _this.userinfo.giMd.is_display2 = '1'
      }else{
        _this.userinfo.giMd.is_display2 = '0'
      }
      if(_this.checkList.indexOf("三层") != '-1'){
        _this.userinfo.giMd.is_display3 = '1'
      }else{
        _this.userinfo.giMd.is_display3 = '0'
      }
    },
    //保存数据
    saveInfo(evts) {
      // 保存
      let _this = this;
      let url = ''
      if(!evts.geometry){
        _this.userinfo.featureVo = _this.coorObj;
      }else{
        _this.userinfo.featureVo = evts;
      }
      console.log('coorobj',_this.coorObj)
      _this.userinfo.giMd.keyId = _this.userinfo.featureVo.id;
      console.log('Isupdate',_this.$parent.Isupdate)
      if(_this.$parent.Isupdate == true){
        url = '/Stationtype/UpZCJBXXdata';
        this.stationData.map(item=>{
          if(item.ItemName == this.userinfo.zcdm){
            this.userinfo.zcdm = item.ItemId
          }
        })
      } else{
        url = `/Stationtype/AddCZVectorData`
      }
        //后端方法路径   /Stationtype/AddCZVectorData
        _this.axios
          .post(  url , _this.userinfo)
          .then(res=> {
            console.log("res",res)
            if (res.data.Code == 1) {
              successMessage(res.data.Msg);
              // _this.$router.push({name:"Index"})
              _this.$parent.datareturn(res.data.Data)
              _this.popupVisble = false;
            } else errorMessage(res.data.Msg);
          })
          .catch(
            err => {
               errorMessage(err)
            });
    },
    //模糊查询;   
    handleSelect(item){
      let _this = this;
      _this.axios
        .post(" /Stationtype/ShowZCdata?zcdm="+item) //查询
        .then(res=> {
            _this.query = res.data.Data[0];
        })
        .catch(err => {
          // errorMessage(err)
        });
    },
    deletes(evts){
        if(evts.geometry){
          this.userinfo.featureVo = evts;
        }
        this.userinfo.zcdm = this.userinfo.featureVo.properties.dataId;
        this.axios.post("/Stationtype/DeletZCdata?zcdm="+this.userinfo.zcdm).
        then(res=>{
            if(res.data.Code ==1){
              successMessage(res.data.Msg);
              // this.$router.push({name:"Index"});
              this.popupVisble = false;
              this.$parent.removeLast()
            }else{
              errorMessage(res.data.Msg)
            }
        })
    },
    cancel() {
      this.popupVisble = false;
        this.popupVisble = false;
      if(this.$parent.Isupdate == false){
        this.$parent.drawEnd();
      }
      // this.$router.push({name:"Index"})
    }
  }
};
</script>

<style scoped>
.frame {
  width: 350px;
  height: 100%;
  box-sizing: border-box;
}
.el-form-item{
  margin-bottom: 0px !important;
}
.el-input__inner{
  height: 30px!important;
  line-height: 30px!important;
}
</style>

// import 'babel-polyfill'

// const G = Object.assign({ a: 1, b: 2 }, { c: 3 });
// console.log(G);
// console.log(G.a);
// console.log(G.b);
// console.log(G.c);

// const fn = x => x.name;

// fn({ name: 'bbb' });
/* eslint-disable no-new */
import Vue from 'vue/dist/vue.min'
import Mint from 'mint-ui'
import 'mint-ui/lib/style.css'
import { fdcJsonp } from 'fdc-common/http'
import tool from '../util/dateFormat'
import config from '../util/config'

Vue.use(Mint)

new Vue({
  el: '#main',
  data: {
    ct1: '',
    ct2: '',
    time: new Date(),
    name: '',
    tel: '',
    isPlay: '',
    ownerid: '',
    isshowTip: false,
    istelsame: false,
    isShow: false,
    isShow1: false,
    listData: [
      // {
      //   createTime: 1528365679164,
      //   headimgurl:
      // 'http://static.fdc.com.cn/worldcup/eluosi.png',
      //   id:
      // '5b19026f205c8b40df557039',
      //   nickName:
      // '俄罗斯',
      //   ownerid:
      // '5b19026f205c8b40df557039',
      //   roseCount: 4,
      //   type: 2,
      //   updateTime: 1528365679164,
      // },
    ]
  },
  methods: {
    openPicker () {
      this.$refs.picker.open()
    },
    openDialog (item) {
      // console.log(item);
      // this.ownerid = item.ownerid;
      // this.name = '';
      // this.tel = '';
      // this.isShow = true;
      // http://sandbox.gw.fdc.com.cn/router/rest?method=&id=1&activeState=2
      console.log(item)
      fdcJsonp(config.sandbox_url, 'activeweb.restful.updatemystate', {
        id: item.ownerid,
        activeState: item.activeState * 1 === 1 ? 2 : 1
      }).then((res) => {
        if (res.data === 1) {
          this.$toast('修改成功')
          this.getListData()
        }
      })
    },
    add () {
      if (!this.ct1) {
        this.$toast('国家1为空！')
        return
      } else if (!this.ct2) {
        this.$toast('国家2为空！')
        return
      }
      fdcJsonp(config.sandbox_url, 'activeweb.restful.initcup', {
        ownerName: this.ct1,
        toName: this.ct2,
        time: this.time.getTime()
      }).then((res) => {
        console.log(res)
        if (res.data) {
          this.$toast('新增成功！')
        } else {
          this.$toast('新增失败！')
        }
      }).catch((res) => {
        this.$toast(res)
      })
    },
    del () {
      // http://sandbox.gw.fdc.com.cn/router/rest?method=activeweb.restful.delcup&ownerName=中国&toName=美国
      if (!this.ct1) {
        this.$toast('国家1为空！')
        return
      } else if (!this.ct2) {
        this.$toast('国家2为空！')
        return
      }
      fdcJsonp(config.sandbox_url, 'activeweb.restful.delcup', {
        ownerName: this.ct1,
        toName: this.ct2
      }).then((res) => {
        if (res.data) {
          this.$toast('删除成功！')
        } else {
          this.$toast('删除失败！')
        }
      }).catch((res) => {
        this.$toast(res)
      })
    },
    toggleTip () {
      this.isshowTip = !this.isshowTip
    },
    togglePlay () {
      const bgMusic = document.getElementById('audio')
      if (bgMusic.paused) {
        bgMusic.play()
        this.isPlay = false
        // $(this).removeClass('paused');
      } else {
        bgMusic.pause()
        this.isPlay = true
        // $(this).addClass('paused');
      }
    },
    submitForm () {
      if (this.checkForm()) {
        // const ajax = true;
        // if (ajax) {
        //   this.isShow1 = true;
        // } else {
        //   this.name = '';
        //   this.tel = '';
        //   this.istelsame = true;
        // }
        fdcJsonp(config.sandbox_url, 'activeweb.restful.sign', {
          userName: this.name,
          phone: this.tel,
          type: 2,
          ownerid: this.ownerid
        }).then((res) => {
          if (res.msg === '报名成功') {
            this.isShow1 = true
            this.getListData()
          }
        }).catch(() => {
          this.name = ''
          this.tel = ''
          this.istelsame = true
        })
      }
    },
    checkForm () {
      const reg = /^1[0-9]{10}$/
      if (!this.name) {
        alert('姓名不能为空！')
        return false
      } else if (!this.tel) {
        alert('电话不能为空！')
        return false
      } else if (!reg.test(this.tel)) {
        alert('电话格式不正确！')
        return false
      }
      return true
    },
    getListData () {
      console.log('11111111111111111111')
      // http.get('../static/mork/dataList.json')
      //   .then((res) => {
      //     console.log(res);
      //     this.listData = res.data;
      //   });
      fdcJsonp(config.sandbox_url, 'activeweb.restful.alllist')
        .then((res) => {
          console.log(res)
          this.listData = res.data
        })
        .catch((res) => {
          console.log('333333333333333')
          console.log(res)
        })

      console.log('22222222222222222222')
    }
  },
  filters: {
    dateFormat (value) {
      return tool.dateFormat(value, 'yy年MM月dd日 hh:mm')
    }
  },
  created () {
    console.log('12312312312')
    this.getListData()
  },
  mounted () {
    console.log('12312312312')
  }
})

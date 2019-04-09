import 'babel-polyfill';

// const G = Object.assign({ a: 1, b: 2 }, { c: 3 });
// console.log(G);
// console.log(G.a);
// console.log(G.b);
// console.log(G.c);


// const fn = x => x.name;

// fn({ name: 'bbb' });
/* eslint-disable no-new */
import Vue from 'vue/dist/vue.min';
import { fdcJsonp } from 'fdc-common/http';
import config from '@/static/util/env.config';

new Vue({
  el: '#main',
  data: {
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
    ],
  },
  methods: {
    openDialog(item) {
      console.log(item);
      this.ownerid = item.ownerid;
      this.name = '';
      this.tel = '';
      this.isShow = true;
    },
    toggleTip() {
      this.isshowTip = !this.isshowTip;
    },
    togglePlay() {
      const bgMusic = document.getElementById('audio');
      if (bgMusic.paused) {
        bgMusic.play();
        this.isPlay = false;
        // $(this).removeClass('paused');
      } else {
        bgMusic.pause();
        this.isPlay = true;
        // $(this).addClass('paused');
      }
    },
    submitForm() {
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
          ownerid: this.ownerid,
        }).then((res) => {
          if (res.msg === '报名成功') {
            this.isShow1 = true;
            this.getListData();
          }
        }).catch(() => {
          this.name = '';
          this.tel = '';
          this.istelsame = true;
        });
      }
    },
    checkForm() {
      const reg = /^1[0-9]{10}$/;
      if (!this.name) {
        alert('姓名不能为空！');
        return false;
      } else if (!this.tel) {
        alert('电话不能为空！');
        return false;
      } else if (!reg.test(this.tel)) {
        alert('电话格式不正确！');
        return false;
      }
      return true;
    },
    getListData() {
      // http.get('../static/mork/dataList.json')
      //   .then((res) => {
      //     console.log(res);
      //     this.listData = res.data;
      //   });
      fdcJsonp(config.sandbox_url, 'activeweb.restful.alllist')
        .then((res) => {
          console.log(res);
          this.listData = res.data;
        })
        .catch((res) => {
          console.log(res);
        });
    },
  },
  created() {
    this.getListData();
  },
  mounted() {
    function audioAutoPlay(id) {
      const audio = document.getElementById(id);
      const play = function () {
        audio.play();
        document.removeEventListener('touchstart', play, false);
      };
      audio.play();
      document.addEventListener('WeixinJSBridgeReady', () => { // 微信
        play();
      }, false);
      document.addEventListener('YixinJSBridgeReady', () => { // 易信
        play();
      }, false);
      document.addEventListener('touchstart', play, false);
    }
    audioAutoPlay('audio');
  },
});

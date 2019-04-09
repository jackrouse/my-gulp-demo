import 'babel-polyfill';

/* eslint-disable no-new */
import Vue from 'vue/dist/vue.min';
import { fdcJsonp } from 'fdc-common/http';
import tool from '../util/dateFormat';
import config from '../util/config';

new Vue({
  el: '#main',
  data: {
    currentTime: '',
    name: '',
    tel: '',
    ownerid: '',
    isPlay: '',
    onwerName: '',
    checkArr: [],
    isshowTip: false,
    istelsame: false,
    isShow: false,
    isShow1: false,
    listData: [
    ],
  },
  methods: {
    openDialog(item, index) {
      if (this.checkArr[index].indexOf(true) === -1) {
        alert('请先勾选再提交！');
      } else {
        this.ownerid = item.id;
        this.name = '';
        this.tel = '';
        this.isShow = true;
        if (this.checkArr[index][0]) {
          this.onwerName = item.ownerName;
        } else if (this.checkArr[index][1]) {
          this.onwerName = item.toName;
        } else {
          this.onwerName = '平';
        }
      }
      console.log(this.onwerName);
    },
    toggleTip() {
      this.isshowTip = !this.isshowTip;
    },
    togglePlay() {
      const bgMusic = document.getElementById('audio');
      if (bgMusic.paused) {
        bgMusic.play();
        this.isPlay = false;
      } else {
        bgMusic.pause();
        this.isPlay = true;
      }
    },
    setCheckBox(status, index) {
      console.log(index);
      const arr = [false, false, false];
      arr[status] = true;
      this.checkArr[index] = arr;
      this.checkArr = this.checkArr.concat([]);
      console.log(this.checkArr);
    },
    submitForm() {
      if (this.checkForm()) {
        fdcJsonp(config.sandbox_url, 'activeweb.restful.sign', {
          userName: this.name,
          phone: this.tel,
          type: 3,
          onwerName: this.onwerName,
          ownerid: this.ownerid,
        }).then((res) => {
          if (res.msg === '报名成功') {
            this.isShow1 = true;
          }
          // else {
          //   this.name = '';
          //   this.tel = '';
          //   this.istelsame = true;
          // }
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
      fdcJsonp(config.sandbox_url, 'activeweb.restful.allcup')
        .then((res) => {
          console.log(res);
          this.listData = res.data;
          this.currentTime = res.time;
          const dataLength = res.data.length;
          let i = 0;
          for (; i < dataLength; i++) {   //eslint-disable-line
            this.checkArr.push([false, false, false]);
          }
        });

      // http://sandbox.gw.fdc.com.cn/router/rest?method=activeweb.restful.allcup
    },
  },
  filters: {
    dateFormat(value) {
      return tool.dateFormat(new Date(value * 1), 'MM月dd日 hh:mm');
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

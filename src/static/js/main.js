import 'babel-polyfill'

// const G = Object.assign({ a: 1, b: 2 }, { c: 3 });
// console.log(G);
// console.log(G.a);
// console.log(G.b);
// console.log(G.c);

// const fn = x => x.name;

// fn({ name: 'bbb' });
/* eslint-disable no-new */
import Vue from 'vue/dist/vue.min'

const $ = require('Zepto')

new Vue({
  el: '#main',
  data: {
    isPlay: ''
  },
  methods: {
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
    }
  },
  mounted () {
    function audioAutoPlay (id) {
      const audio = document.getElementById(id)
      const play = function () {
        audio.play()
        document.removeEventListener('touchstart', play, false)
      }
      audio.play()
      document.addEventListener('WeixinJSBridgeReady', () => { // 微信
        play()
      }, false)
      document.addEventListener('YixinJSBridgeReady', () => { // 易信
        play()
      }, false)
      document.addEventListener('touchstart', play, false)
    }
    audioAutoPlay('audio')
  }
})

console.log($('body'))

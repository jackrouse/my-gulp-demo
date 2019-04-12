import 'babel-polyfill'
// const G = Object.assign({ a: 1, b: 2 }, { c: 3 });
// console.log(G);
// console.log(G.a);
// console.log(G.b);
// console.log(G.c);

// import { fdcJsonp } from 'fdc-common/http';
// const fn = x => x.name;

// fn({ name: 'bbb' });
/* eslint-disable no-new */
import Vue from 'vue/dist/vue.runtime.min'
import App from './app.vue'

new Vue({
  el: '#app',
  render: h => h(App)
})

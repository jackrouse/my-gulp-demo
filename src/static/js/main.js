import 'babel-polyfill'
import { fdcJsonp } from 'fdc-common/http'
import config from '../util/env.config'
const G = Object.assign({ a: 1, b: 2 }, { c: 3 })
console.log(G)
console.log(G.a)
console.log(G.b)
console.log(G.c)

const fn = x => x.name

fn({ name: 'bbb' })
/* eslint-disable no-new */

const $ = require('jquery')
fdcJsonp(config.sandbox_url, 'activeweb.restful.allcup')
  .then((res) => {
    console.log(res)
  })
console.log($('body'))

(window["webpackJsonp"]=window["webpackJsonp"]||[]).push([["chunk-0e0afd53"],{"037e":function(t,e,s){},"1d07":function(t,e,s){"use strict";var i=s("037e"),n=s.n(i);n.a},"42ba":function(t,e,s){"use strict";s.d(e,"c",(function(){return a})),s.d(e,"a",(function(){return o})),s.d(e,"b",(function(){return l}));var i=s("5ac7"),n=s("da71"),r=new i["a"];function a(){var t="/api/getTopBanner",e={pageSize:10,nid:23831003,pageNo:0,type:2006},s={Host:"m.music.migu.cn",Referer:"https://m.music.migu.cn/v3"};return r.accessProxy({url:t,params:e,headers:s}).then((function(t){return t}))}function o(){var t="/api/getRecommendList",e={picmid:1,rnd:Math.random(),g_tk_new_20200303:1248420552,categoryId:1e7,sortId:5,sin:0,ein:19};Object.assign(e,n["c"]);var s=n["b"];return r.accessProxy({url:t,params:e,headers:s}).then((function(t){return t}))}function l(t){var e="/api/getCdInfo",s=Object.assign({},n["d"],{disstid:t,type:1,json:1,utf8:1,onlysong:0,platform:"yqq",hostUin:0,needNewCode:0}),i={referer:"https://c.y.qq.com/",host:"c.y.qq.com"};return r.accessProxy({url:e,headers:i,params:s}),r.accessProxy({url:e,headers:i,params:s}).then((function(t){return t}))}},"4df0":function(t,e,s){},"6ddc":function(t,e,s){"use strict";var i=s("4df0"),n=s.n(i);n.a},"72c9":function(t,e,s){"use strict";s.r(e);var i=function(){var t=this,e=t.$createElement,s=t._self._c||e;return s("div",{staticClass:"recommend"},[s("scroll",{ref:"scroll",staticClass:"recommend-content"},[s("div",[t.sliderData.length?s("div",{staticClass:"slider-wrapper"},[s("slider",t._l(t.sliderData,(function(e,i){return s("div",{key:i},[s("a",{attrs:{href:e.linkUrl}},[s("img",{attrs:{src:e.url},on:{load:function(e){!i&&t.initBScroll()}}})])])})),0)],1):t._e(),s("div",{staticClass:"recommend-list-wrapper"},[s("h1",{staticClass:"list-title"},[t._v("热门歌单推荐")]),t.recommendListData[0]?s("ul",{staticClass:"recommend-list"},t._l(t.recommendListData,(function(e,i){return s("li",{key:i,staticClass:"recommend-item",on:{click:function(s){return t.selectDisc(e)}}},[s("div",{staticClass:"img-wrapper"},[s("img",{directives:[{name:"lazy",rawName:"v-lazy",value:e.imgurl,expression:"item.imgurl"}],on:{load:function(e){!i&&t.initBScroll()}}})]),s("div",{staticClass:"text-wrapper"},[s("h2",{staticClass:"title"},[t._v(t._s(e.dissname))]),s("span",{staticClass:"info"},[t._v(t._s(e.creator.name))])])])})),0):t._e()])]),s("div",{directives:[{name:"show",rawName:"v-show",value:!t.sliderData.length||!t.recommendListData.length,expression:"!sliderData.length || !recommendListData.length"}],staticClass:"loading-wrapper"},[s("loading")],1),s("transition",{attrs:{name:"slide"}},[s("router-view")],1)],1)],1)},n=[],r=s("5530"),a=function(){var t=this,e=t.$createElement,s=t._self._c||e;return s("div",{ref:"slider",staticClass:"slider"},[s("div",{ref:"sliderGroup",staticClass:"slider-group"},[t._t("default")],2),t.dots.length?s("div",{staticClass:"dots-wrapper"},t._l(t.dots,(function(e,i){return s("span",{key:i,staticClass:"dot",class:i===t.currentIndex?"active":""})})),0):t._e()])},o=[],l=(s("a9e3"),s("1b9e")),c=s("1fba"),d=new l["a"],u={data:function(){return{currentIndex:0,dots:[]}},props:{loop:{type:Boolean,default:!0},autoPlay:{type:Boolean,default:!0},interval:{type:Number,default:3e3}},mounted:function(){var t=this;this.$nextTick((function(){t._setSliderWidth(),t._initSlider(),t._initDots(),t.autoPlay&&t._play(),window.addEventListener("resize",(function(){t.slider&&(t._setSliderWidth(!0),t.slider.refresh())}))}))},methods:{_setSliderWidth:function(t){var e=this.$refs.sliderGroup;this.elSliderItemList=e.children;for(var s=this.elSliderItemList,i=this.$refs.slider.clientWidth,n=0,r=0;r<s.length;r++){var a=s[r];d.addClass(a,"slider-item"),a.style.width=i+"px",n+=i}this.loop&&!t&&(n+=2*i),e.style.width=n+"px"},_initSlider:function(){var t=this;this.slider=new c["a"](this.$refs.slider,{scrollX:!0,scrollY:!1,momentum:!1,click:!0,snap:{loop:this.loop,threshold:.3,speed:400}}),this.slider.on("scrollEnd",(function(){var e=t.slider.getCurrentPage().pageX;t.currentIndex=e,t.autoPlay&&(clearTimeout(t.timer),t._play())}))},_initDots:function(){this.dots=new Array(this.elSliderItemList.length-2)},_play:function(){var t,e=this;this.timer=setInterval((function(){t=e.currentIndex+1,t=7===t?0:t,e.slider.goToPage(t,0,400)}),this.interval)}},beforeDestroy:function(){clearTimeout(this.timer)}},m=u,f=(s("1d07"),s("2877")),h=Object(f["a"])(m,a,o,!1,null,"461ebf44",null),p=h.exports,v=s("2b64"),g=s("1e2f"),_=s("42ba"),y=s("da71"),w=s("470c"),b=s("5880"),C={mixins:[w["c"]],data:function(){return{sliderData:[],recommendListData:[]}},components:{Slider:p,Scroll:v["a"],Loading:g["a"]},mounted:function(){this._getTopBanner(),this._getRecommendList()},methods:Object(r["a"])({whenPlayList:function(t){var e=t.length?"60px":"";this.$refs.scroll.$el.style.bottom=e,this.$refs.scroll.refresh()},selectDisc:function(t){this.$router.push({path:"/recommend/".concat(t.dissid)}),this.setDisk(t)},_getTopBanner:function(){var t=this;Object(_["c"])().then((function(e){e.code===y["a"]&&(t.sliderData=e.results)}))},_getRecommendList:function(){var t=this;Object(_["a"])().then((function(e){e.code===y["a"]&&(t.recommendListData=e.data.list)}))},initBScroll:function(){this.$refs.scroll.refresh()}},Object(b["mapMutations"])(["setDisk"]))},D=C,x=(s("6ddc"),Object(f["a"])(D,i,n,!1,null,"f9766940",null));e["default"]=x.exports}}]);
//# sourceMappingURL=chunk-0e0afd53.f407fa76.js.map
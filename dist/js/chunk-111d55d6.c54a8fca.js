(window["webpackJsonp"]=window["webpackJsonp"]||[]).push([["chunk-111d55d6"],{"1f36":function(t,s,e){"use strict";var n=e("ef60"),a=e.n(n);a.a},"2ece":function(t,s,e){},7235:function(t,s,e){"use strict";e.r(s);var n=function(){var t=this,s=t.$createElement,e=t._self._c||s;return e("div",{staticClass:"singer-detail"},[e("music-list",{attrs:{songs:t.songs,title:t.singer.name,bgImg:t.singer.avatar}})],1)},a=[],i=(e("4160"),e("159b"),e("5530")),c=e("7d2a"),l=e("5880"),r=e("a33c"),o=e("7f5c"),g=e("da71"),u={data:function(){return{songs:[]}},created:function(){this._getDetail()},computed:Object(i["a"])({},Object(l["mapState"])(["singer"])),components:{MusicList:c["a"]},methods:{_getDetail:function(){var t=this;this.singer.id?Object(o["a"])(this.singer.id).then((function(s){s.code===g["a"]&&Object(r["c"])(t._normalizeSongs(s.data.list,s.data.singer_mid)).then((function(s){t.songs=s}))})):this.$router.push("/singer")},_normalizeSongs:function(t,s){var e=[];return t.forEach((function(t){var s=t.musicData;Object(r["b"])(s)&&e.push(Object(r["a"])(s))})),e}}},f=u,h=(e("7713"),e("2877")),b=Object(h["a"])(f,n,a,!1,null,"09107ec6",null);s["default"]=b.exports},7713:function(t,s,e){"use strict";var n=e("2ece"),a=e.n(n);a.a},"7d2a":function(t,s,e){"use strict";var n=function(){var t=this,s=t.$createElement,e=t._self._c||s;return e("div",{staticClass:"music-list"},[e("div",{ref:"title",staticClass:"title-wrapper"},[e("div",{staticClass:"back",on:{click:t.back}},[e("i",{staticClass:"icon-back"})]),e("div",{staticClass:"title"},[t._v(t._s(t.title))])]),e("div",{ref:"bg",staticClass:"background",style:t.bgStyle},[e("div",{ref:"mask",staticClass:"mask"}),e("div",{directives:[{name:"show",rawName:"v-show",value:t.songs.length,expression:"songs.length"}],staticClass:"play-wrapper"},[e("div",{staticClass:"play-btn",on:{click:t.playAll}},[e("i",{staticClass:"icon-play"}),e("span",{staticClass:"text"},[t._v("随机播放全部")])])])]),e("div",{ref:"bgLayer",staticClass:"bg-layer"}),e("scroll",{ref:"scroll",staticClass:"song-scroll",attrs:{probeType:3,listenScroll:!0,tag:t.songs},on:{scroll:t.scroll}},[e("song-list",{attrs:{songs:t.songs,rank:t.rank},on:{selectSong:t.selectSong}})],1)],1)},a=[],i=(e("99af"),e("5530")),c=e("7771"),l=e("2b64"),r=e("1b9e"),o=e("470c"),g=e("5880"),u=new r["a"],f=u.prefixStyle("transform"),h=u.prefixStyle("filter"),b={mixins:[o["c"]],props:{bgImg:{type:String,default:""},songs:{type:Array,default:function(){return[]}},title:{type:String,default:""},rank:{type:Boolean,default:!1}},data:function(){return{scrollY:0}},components:{SongList:c["a"],Scroll:l["a"]},computed:{bgStyle:function(){return"background-image: url(".concat(this.bgImg,")")}},mounted:function(){this._setStyle(),this.minTranslate=-this.imageHeight+this.$refs.title.clientHeight},methods:Object(i["a"])({whenPlayList:function(t){var s=t.length?"60px":"";this.$refs.scroll.$el.style.bottom=s,this.$refs.scroll.refresh()},selectSong:function(t,s){this.selectPlay({list:this.songs,index:s})},scroll:function(t){this.scrollY=t.y},back:function(){this.$router.go(-1)},playAll:function(){this.selectPlayAll({list:this.songs})},_setStyle:function(){this.imageHeight=this.$refs.bg.clientHeight,this.$refs.scroll.$el.style.top="".concat(this.imageHeight,"px"),this.$refs.bgLayer.style.top="".concat(this.imageHeight,"px")}},Object(g["mapActions"])(["selectPlay","selectPlayAll"])),watch:{scrollY:function(t){var s=1,e=0,n=t/this.minTranslate,a=Math.abs(t/this.imageHeight);if(t>0?(s+=a,this.$refs.bg.style[f]="scale(".concat(s,")")):(e=Math.min(25*a,25),this.$refs.bg.style[h]="blur(".concat(e,"px)")),n>=.4&&n<=1){var i=Math.ceil(250*Math.pow(n,2)),c=Math.floor(250*Math.pow(1-n+.4,2));this.$refs.mask.style.background="rgba(".concat(i,", ").concat(i,", ").concat(i,", ").concat(n,")"),this.$refs.title.style.color="rgb(".concat(c,", ").concat(c,", ").concat(c,")")}t<this.minTranslate?(this.$refs.title.style.background="rgba(250, 250, 250, ".concat(n,")"),this.$refs.title.style.color="rgb(0, 0, 0)"):this.$refs.title.style.background=null,t>=0&&(this.$refs.mask.style.background="rgba(41, 41, 41, .3)",this.$refs.bg.style[h]="blur(0)",this.$refs.title.style.color="rgb(250, 250, 250)");var l=Math.max(t,this.minTranslate);this.$refs.bgLayer.style[f]="translateY(".concat(l,"px)")}}},d=b,p=(e("1f36"),e("2877")),m=Object(p["a"])(d,n,a,!1,null,"3da0f1a2",null);s["a"]=m.exports},"7f5c":function(t,s,e){"use strict";e.d(s,"b",(function(){return c})),e.d(s,"a",(function(){return l}));var n=e("5ac7"),a=e("da71"),i=new n["a"];function c(){var t="https://c.y.qq.com/v8/fcg-bin/v8.fcg",s=Object.assign({},a["d"],{channel:"singer",page:"list",key:"all_all_all",pagesize:100,pagenum:2,hostUin:0,needNewCode:0,platform:"yqq"});return i.jsonp(t,s,a["e"]).then((function(t){return t}))}function l(t){var s="https://c.y.qq.com/v8/fcg-bin/fcg_v8_singer_track_cp.fcg",e=Object.assign({},a["d"],{hostUin:0,needNewCode:0,platform:"yqq",order:"listen",begin:0,num:80,songstatus:1,singermid:t});return i.jsonp(s,e,a["e"]).then((function(t){return t}))}},ef60:function(t,s,e){}}]);
//# sourceMappingURL=chunk-111d55d6.c54a8fca.js.map
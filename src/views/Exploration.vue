<template>
  <div class="exploration">
    <div class="search-tool">
      <input type="text" />
      <button @click="search" id="search"></button>
      <div class="filters">
        <div class="filter">
          <p class="name">批次</p>
          <p class="value">第一批</p>
        </div>
        <div class="filter">
          <p class="name">文种</p>
          <p class="value">汉文</p>
        </div>
        <div class="filter">
          <p class="name">出版时代</p>
          <p class="value">明</p>
        </div>
        <div class="filter">
          <p class="name">古籍类型</p>
          <p class="value">汉文古籍</p>
        </div>
        <div class="filter">
          <p class="name">版本类型</p>
          <p class="value">刻本</p>
        </div>
        <div class="filter">
          <p class="name">相关人物</p>
          <p class="value">黄丕烈</p>
        </div>
        <div class="filter">
          <p class="name">收藏单位</p>
          <p class="value">国家图书馆</p>
        </div>
      </div>
      <p class="total">共123条结果</p>
    </div>
    <div class="search-result">
      <div class="results results-plain" v-if="!relationship_mode">
        <div class="classification">
          <label for="">分类依据：</label>
          <input type="radio" name="classify-by" id="all" /><span>不限</span> <input type="radio" name="classify-by" id="" /><span>出版时间</span>
          <input type="radio" name="classify-by" id="" /><span>版刻地点</span> <input type="radio" name="classify-by" id="" /><span>相关人物</span>
          <input type="radio" name="classify-by" id="" /><span>古籍类型</span> <input type="radio" name="classify-by" id="" /><span>版本类型</span>
        </div>
        <div class="ranking"></div>
      </div>
      <div class="results results-relation" v-if="relationship_mode"></div>
      <div class="toggle-view">
        <div @click="relationship_mode = false" :class="{ inactive: relationship_mode }">古籍检索</div>
        <div @click="relationship_mode = true" :class="{ inactive: !relationship_mode }">关系发现</div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: "Exploration",
  data() {
    return {
      relationship_mode: false,
      temp_arr: [
        {
          id: "51",
          batch: "第1批",
          "名录内容（国务院版）": "引书　西汉　竹简　湖北江陵张家山247号汉墓　湖北省荆州市博物馆",
          "图录版名录内容 纠错版": "引書　西漢　竹簡　湖北江陵張家山247號漢墓　湖北省荆州市博物館",
          名录纠错说明: "",
          文献类型: "簡帛",
          language: "漢文",
          province_code: "420000",
          province: "湖北",
          收藏单位代码: "2382",
          "收藏单位名称 1简转繁": "荆州博物館",
          索书号: "",
          批校题跋0: "",
          出土地: "湖北江陵張家山247號漢墓",
          是否完整: "是",
          "存缺卷 未替换": "",
          册数: "112（现存）",
          册数计量单位: "枚",
          全文影像链接: "",
          装帧形式: "",
          开本尺寸: "簡長30至30.5厘米",
          版框尺寸: "",
          版式: "",
          牌记: "",
          钤印: "",
          批校题跋: "",
        },
        {
          id: "222",
          batch: "第1批",
          "名录内容（国务院版）": "禹贡论二卷后论一卷山川地理图二卷　（宋）程大昌撰　宋淳熙八年（1181）陈应行泉州州学刻本　国家图书馆",
          "图录版名录内容 纠错版": "禹貢論二卷後論一卷山川地理圖二卷　（宋）程大昌撰　宋淳熙八年（1181）陳應行泉州州學刻本　國家圖書館",
          名录纠错说明: "",
          文献类型: "漢文古籍",
          language: "漢文",
          province_code: "110000",
          province: "北京",
          收藏单位代码: "101",
          "收藏单位名称 1简转繁": "國家圖書館",
          索书号: "9584",
          批校题跋0: "",
          出土地: "",
          是否完整: "是",
          "存缺卷 未替换": "",
          册数: "4",
          册数计量单位: "册",
          全文影像链接: "http://read.nlc.cn/allSearch/searchDetail?searchType=&showType=1&indexName=data_892&fid=412004001744",
          装帧形式: "",
          开本尺寸: "",
          版框尺寸: "匡高19.6厘米，廣13.6厘米",
          版式: "半葉十二行，行二十二字，白口，左右雙邊",
          牌记: "",
          钤印: "有“郁印松年”、“田耕堂藏”、“蔣祖詒”、“榖孫”、“祁陽陳澄中藏書記”等印",
          批校题跋: "",
        },
        {
          id: "4806",
          batch: "第2批",
          "名录内容（国务院版）": "澄怀录二卷　（宋）周密辑　清吴翌凤家抄本　秦更年录吴翌凤校跋　南开大学图书馆",
          "图录版名录内容 纠错版": "澄懷錄二卷　（宋）周密輯　清吳翌鳳家抄本　吳翌鳳校　南開大學圖書館",
          名录纠错说明: "秦更年录吴翌凤校跋改为“吳翌鳳校”",
          文献类型: "漢文古籍",
          language: "漢文",
          province_code: "120000",
          province: "天津",
          收藏单位代码: "341",
          "收藏单位名称 1简转繁": "南開大學圖書館",
          索书号: "善857.1526 818-2",
          批校题跋0: "吳翌鳳校",
          出土地: "",
          是否完整: "是",
          "存缺卷 未替换": "",
          册数: "1",
          册数计量单位: "册",
          全文影像链接: "",
          装帧形式: "",
          开本尺寸: "",
          版框尺寸: "",
          版式: "半葉十行，行十八字",
          牌记: "",
          钤印: "有“莫棠字楚生印”、“曾在秦嬰闇處”、“蔓青手校”等印",
          批校题跋: "",
        },
        {
          id: "9820",
          batch: "第3批",
          "名录内容（国务院版）": "龙戏　清抄本　中国民族图书馆",
          "图录版名录内容 纠错版": "龍戲　清抄本　中國民族圖書館",
          名录纠错说明: "",
          文献类型: "少數民族文字古籍",
          language: "水文",
          province_code: "110000",
          province: "北京",
          收藏单位代码: "3194",
          "收藏单位名称 1简转繁": "中國民族圖書館",
          索书号: "",
          批校题跋0: "",
          出土地: "",
          是否完整: "是",
          "存缺卷 未替换": "",
          册数: "1",
          册数计量单位: "册",
          全文影像链接: "",
          装帧形式: "綫裝",
          开本尺寸: "開本高28厘米，廣20.4厘米",
          版框尺寸: "",
          版式: "",
          牌记: "",
          钤印: "",
          批校题跋: "",
        },
        {
          id: "9982",
          batch: "第4批",
          "名录内容（国务院版）":
            "增广注释音辩唐柳先生集四十三卷别集二卷外集二卷　（唐）柳宗元撰　（宋）童宗说注释　（宋）张敦颐音辩　（宋）潘纬音义　年谱一卷　（宋）文安礼撰　附录一卷　元刻本　袁克文跋　国家图书馆",
          "图录版名录内容 纠错版":
            "增廣註釋音辯唐柳先生集四十三卷別集二卷外集二卷　（唐）柳宗元撰　（宋）童宗說註釋　（宋）張敦頤音辯　（宋）潘緯音義　年譜一卷　（宋）文安禮撰　附錄一卷　元刻本　袁克文跋　國家圖書館",
          名录纠错说明: "",
          文献类型: "漢文古籍",
          language: "漢文",
          province_code: "110000",
          province: "北京",
          收藏单位代码: "101",
          "收藏单位名称 1简转繁": "國家圖書館",
          索书号: "8711",
          批校题跋0: "袁克文跋",
          出土地: "",
          是否完整: "是",
          "存缺卷 未替换": "",
          册数: "12",
          册数计量单位: "册",
          全文影像链接: "http://read.nlc.cn/allSearch/searchDetail?searchType=&showType=1&indexName=data_892&fid=412004001155",
          装帧形式: "",
          开本尺寸: "",
          版框尺寸: "匡高18.9厘米，廣12.5厘米",
          版式: "半葉十二行，行二十一字，小字雙行同，細黑口，四周雙邊",
          牌记: "",
          钤印: "",
          批校题跋: "",
        },
        {
          id: "11839",
          batch: "第5批",
          "名录内容（国务院版）":
            "李翰林全集四十二卷目录四卷　（唐）李白撰　（明）刘世教辑　年谱一卷　（宋）薛仲邕撰　明万历四十年（1612）刻合刻分体李杜全集本　赵士春批　海滨漫士题识　翁同龢跋　上海图书馆",
          "图录版名录内容 纠错版":
            "李翰林全集四十二卷目錄四卷　（唐）李白撰　（明）劉世教輯　年譜一卷　（宋）薛仲邕撰　明萬曆四十年（1612）刻合刻分體李杜全集本　趙士春批　海濱漫士題識　翁同龢跋　上海圖書館",
          名录纠错说明: "",
          文献类型: "漢文古籍",
          language: "漢文",
          province_code: "310000",
          province: "上海",
          收藏单位代码: "201",
          "收藏单位名称 1简转繁": "上海圖書館",
          索书号: "823256-59，43/B570",
          批校题跋0: "趙士春批　海濱漫士題識　翁同龢跋",
          出土地: "",
          是否完整: "是",
          "存缺卷 未替换": "",
          册数: "4",
          册数计量单位: "册",
          全文影像链接: "",
          装帧形式: "",
          开本尺寸: "",
          版框尺寸: "匡高20.2厘米，廣14.6厘米",
          版式: "半葉九行，行十八字，白口，左右雙邊",
          牌记: "",
          钤印: "有“東田舊史”、“翁印同龢”、“虞山翁同龢印”等印",
          批校题跋: "",
        },
        {
          id: "12564",
          batch: "第6批",
          "名录内容（国务院版）": " [弘治]衢州府志十五卷　（明）吾冔　吴夔等纂修　明弘治刻本　宁波市天一阁博物院",
          "图录版名录内容 纠错版": "[弘治]衢州府志十五卷　（明）吾冔　吳夔等纂修　明弘治刻本　寧波市天一閣博物院",
          名录纠错说明: "",
          文献类型: "漢文古籍",
          language: "漢文",
          province_code: "330000",
          province: "浙江",
          收藏单位代码: "1705",
          "收藏单位名称 1简转繁": "寧波市天一閣博物院",
          索书号: "",
          批校题跋0: "",
          出土地: "",
          是否完整: "是",
          "存缺卷 未替换": "",
          册数: "",
          册数计量单位: "",
          全文影像链接: "",
          装帧形式: "",
          开本尺寸: "",
          版框尺寸: "匡高23.5厘米，廣14.9厘米",
          版式: "半葉九行，行二十二字，小字雙行同，黑口，四周雙邊",
          牌记: "",
          钤印: "有“范氏天一閣藏書”等印",
          批校题跋: "",
        },
      ],
    };
  },
  methods: {
    search() {
      console.log(2333);
    },
  },
};
</script>

<style lang="less" scoped>
.exploration {
  font-size: 0.8rem;
  width: 100vw;
  height: 100vh;
  background: #f2e0c4;
  padding: 2rem 5rem;
  box-sizing: border-box;
  // background: linear-gradient(#b8a885, #fff2d9, #fff2d9, #fff2d9, #fff2d9, #fff2d9, #fff2d9, #fff2d9, #fff2d9, #fff2d9, #b8a885);
  .search-tool {
    input[type="text"] {
      height: 2rem;
      width: 15rem;
      border-radius: 0.5rem;
    }
    #search {
      background: #fbb03b url(../assets/icons/search.svg) center no-repeat;
      background-size: 66%;
      width: 2rem;
      height: 2rem;
      border-radius: 0.5rem;
      border: none;
      cursor: pointer;
    }

    .filters {
      display: flex;
      justify-content: space-between;
      .filter {
        background: #4a3300;
        border-radius: 0.5rem;
        text-align: center;
        padding: 0.5rem 1rem;
        color: #fff;
        user-select: none;
        cursor: pointer;
      }
    }
  }
  .search-result {
    position: relative;
    .results {
      background: #42210b11;
      min-height: 50vh;
    }
    .toggle-view {
      position: absolute;
      top: 5rem;
      right: -1.6rem;
      div {
        width: 1rem;
        font-size: 0.8rem;
        text-align: center;
        background: #42210b11;
        padding: 0.8rem 0.3rem;
        user-select: none;
        cursor: pointer;
      }
      div:nth-child(1) {
        border-top-right-radius: 0.5rem;
      }
      div:nth-child(2) {
        border-bottom-right-radius: 0.5rem;
      }
      div.inactive {
        background: #4a3300;
        color: #fff;
      }
    }
  }
}
</style>

<template>
  <baidu-map class="bm-view" :center="center" :zoom="zoom" :scroll-wheel-zoom="true" @ready="handler">
        <!-- 缩放控件 -->
        <bm-navigation anchor="left"></bm-navigation>
        <!-- 比例尺控件 -->
        <bm-scale anchor="bottom" ></bm-scale>
        <!-- 缩略图 -->
        <!-- <bm-overview-map anchor="BMAP_ANCHOR_BOTTOM_RIGHT" :isOpen="true"></bm-overview-map> -->
        <bm-marker  v-for="(marker, index) in points" 
                    :key=index
                    :position="{lng: marker.lng, lat: marker.lat}"
                    :icon="marker.icon"
                    @mouseover="showInfoWindow(marker)"
                    @mouseout="infoWindowClose(marker)">
            <bm-info-window :title="infoWindow.name" 
                            :position="{lng: infoWindow.lng, lat: infoWindow.lat}"   
                            :show="marker.showFlag" 
                            :autoPan="true"
                            @close="infoWindowClose(marker)" 
                            @open="infoWindowOpen(marker)">
                <p v-text="infoWindow.contents"></p>
            </bm-info-window>
        </bm-marker>
  </baidu-map>
</template>


<script>

const circle_color = "rgba(177, 44, 11, 0.818)"
const circle_size_rate = 0.05
import * as Data from "@/data/dataLoader"


export default {
    data () {
        return {
            center: {lng: 0, lat: 0},
            zoom: 3,
            points: [],
            circle_color: circle_color,
            infoWindow: {},
            BMap: ''
        }
    },
    methods: {
        handler ({BMap, map}) {
            console.log(BMap, map)
            this.center.lng = 105
            this.center.lat = 38
            this.zoom = 4.5
            this.BMap = BMap
        },
        getCircleSize(sum) {
            return sum*circle_size_rate
        },
        initProvincePoints () {
            let BMap = this.BMap
            console.log(BMap)
            const points = [];
            let province_list = Data.get_province_list()
            for (let i in province_list) {
                let province = province_list[i]
                let iconSize = this.getCircleSize(province["藏书总数"])
                let myIcon = {
                    url: this.iconImage,
                    size: {
                        height: iconSize,
                        width: iconSize,
                    },
                    imageSize: {
                        height: 200,
                        width: 200,
                    },
                    // imageOffset: {
                    //     height: 25,
                    //     width: 25
                    // }
                }
                let point = {
                        lng: province["经度"], 
                        lat: province["纬度"],
                        name: province["省份"],
                        id: i,
                        showFlag: false,
                        icon: myIcon,
                        contents: `藏书总数: ${province["藏书总数"]}`
                    }
                points.push(point)
            }
            this.points = points
        },
        showInfoWindow(marker){
            marker.showFlag = true;
            this.infoWindow = marker;
        },
        // 关闭弹窗
        infoWindowClose(marker) {
            marker.showFlag = false
        },
        // 打开弹窗
        infoWindowOpen(marker) {
            marker.showFlag = true
        },
    },
    mounted() {
        this.iconImage = require("@/assets/iconImage2.png")
        this.initProvincePoints()

    }
}
</script>

<style>
.bm-view {
  width: 80vw;
  height: 80vh;
}
</style>
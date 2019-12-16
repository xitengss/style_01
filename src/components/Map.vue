<template>
  <div id="map" style="width:100%; height:200px"></div>
</template>

<script>
import maps from 'qqmap'
import { TX_MAP_KEY } from 'api/config'
export default {
  props: {
    position: {
      type: Object,
      default: () => ({
        lat: 24.56424,
        lng: 118.09837
      })
    }
  },
  data () {
    return {
      map: null,
      marker: null
    }
  },
  watch: {
    position () {
      this.addMark()
    }
  },
  mounted () {
    this.init()
  },
  methods: {
    /* eslint-disable */
    init () { // 初始化
      maps.init(TX_MAP_KEY, () => {
        let myLatlng = new qq.maps.LatLng(this.position.lat, this.position.lng)
        let myOptions = {
          zoom: 12,
          center: myLatlng,
          mapTypeId: qq.maps.MapTypeId.ROADMAP
        }
        this.map = new qq.maps.Map(
          document.getElementById('map'),
          myOptions
        )
      })
    },
    addMark () { // 添加标记
      let position = new qq.maps.LatLng(this.position.lat, this.position.lng)
      if (this.marker) {
        this.marker.setPosition(position)
        return
      }
      this.map.setCenter(position)
      this.marker = new qq.maps.Marker({
        position: position,
        center: position,
        map: this.map
      })
      let markerIcon = new qq.maps.MarkerImage(
        require('assets/img/marker.png'),
        new qq.maps.Size(42, 68),
        new qq.maps.Point(0, 0),
        new qq.maps.Point(0, 39)
      )
      this.marker.setIcon(markerIcon)
    }
  }
}
</script>

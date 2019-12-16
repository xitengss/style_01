<template>
  <div class="preview">
    <div class="img_view">
      <div class="preview_img" ref="showImg"></div>
    </div>
    <div class="preview_word"></div>
    <div class="hideCanvas">
      <canvas @click="sedImg" ref="canvas" id="canvas"></canvas>
    </div>
  </div>
</template>

<script>
export default {
  name: 'CanvasImg',
  props: {
    data: {
      type: Object
    }
  },
  mounted () {
    this.getImages()
  },
  data () {
    return {
      imgArr: [],
      imgSrc: ''
    }
  },
  methods: {
    // 向详情页传图片地址
    /* toParent:function () {
    this.$emit('imgsrc',this.imgSrc)
    }, */
    sedImg () {
      this.$emit('sonImg', this.imgSrc)
    },
    onClickClose () {
      this.data.show = false
      this.$refs.showImg.innerHTML = ''
    },
    // 加载图片
    loadImage (url) {
      return new Promise((resolve, reject) => {
        const img = new Image()
        img.crossOrigin = ''
        img.onload = () => resolve(img)
        img.src = url
      })
    },
    // 加载图片
    getImages (views) {
      const imageList = []
      let mulitImg = [this.data.image, this.data.qrimg]
      for (let i = 0; i < mulitImg.length; i++) {
        imageList.push(this.loadImage(mulitImg[i]))
      }
      Promise.all(imageList).then(res => {
        this.imgArr = res
        console.log(this.imgArr, 33)
        this.createPoster()
      }).catch((err) => {
        this.$emit('fail', err)
      })
    },
    createPoster () {
      const that = this
      const WIDTH = 768
      const HEIGHT = 1168
      const canvas = document.getElementById('canvas')
      const ctx = canvas.getContext('2d')
      ctx.clearRect(0, 0, canvas.width, canvas.height)
      canvas.width = WIDTH
      canvas.height = HEIGHT
      // qrimg.src = this.data.qrimg
      ctx.fillStyle = '#fff'
      ctx.fillRect(0, 0, canvas.width, canvas.height)
      ctx.drawImage(that.imgArr[0], 0, 0, canvas.width, 440)
      // 绘制标题
      ctx.fillStyle = '#333' // 文字颜色
      ctx.font = `bold ${52}px PingFang` // 文字字号
      let title1 = that.data.title1
      title1 = that.ellipseText(ctx, title1, 700)
      ctx.fillText(title1, 56, 550)
      // 绘制价格
      let priceWidth = 0
      let price = `￥${this.data.price}`
      for (let i = 0; i < price.length; i++) {
        priceWidth += ctx.measureText(price[i]).width
      }
      that.roundRect2(ctx, 750 - priceWidth, 400, (priceWidth + 40), 72, 20)
      ctx.fillStyle = '#fff' // 文字颜色
      ctx.font = `${48}px SourceHanSansCN` // 文字字号
      ctx.fillText(price, 750 - priceWidth + 15, 455)
      // 绘制时间
      ctx.fillStyle = '#0097fe'
      ctx.font = `${26}px PingFang` // 文字字号
      let timeName = that.data.time
      let timeNameWidth = ctx.measureText(timeName).width
      ctx.fillText(timeName, 70, 620)
      that.roundRect(ctx, 50, 585, (timeNameWidth + 40), 50, 20)
      // 绘制内容
      let lineWidth = 0
      let initHeight = 700
      let lastSubStrIndex = 0
      ctx.fillStyle = '#333' // 文字颜色
      ctx.font = `${26}px PingFang` // 文字字号
      let title2 = that.data.title2
      for (let i = 0; i < title2.length; i++) {
        lineWidth += ctx.measureText(title2[i]).width
        if (lineWidth > 640) {
          ctx.fillText(title2.substring(lastSubStrIndex, i), 50, initHeight) // 绘制截取部分
          initHeight += 40 // 20为字体的高度
          lineWidth = 0
          lastSubStrIndex = i
        }
        if (i === title2.length - 1) { // 绘制剩余部分
          ctx.fillText(title2.substring(lastSubStrIndex, i + 1), 50, initHeight)
        }
      }
      // 绘制地址
      ctx.fillStyle = '#000000'
      ctx.font = `${26}px SourceHanSansCN` // 文字字号
      let telName = `TEL： ${that.data.phone}`
      ctx.fillText(telName, 50, 980)
      // 绘制地址
      let alineWidth = 0
      let ainitHeight = 1036
      let alastSubStrIndex = 0
      ctx.fillStyle = '#000000'
      ctx.font = `${26}px SourceHanSansCN` // 文字字号
      let addressName = `地址：${that.data.address}`
      for (let i = 0; i < addressName.length; i++) {
        alineWidth += ctx.measureText(addressName[i]).width
        if (alineWidth > 420) {
          ctx.fillText(addressName.substring(alastSubStrIndex, i), 50, ainitHeight) // 绘制截取部分
          ainitHeight += 40 // 20为字体的高度
          alineWidth = 0
          alastSubStrIndex = i
        }
        if (i === addressName.length - 1) { // 绘制剩余部分
          ctx.fillText(addressName.substring(alastSubStrIndex, i + 1), 50, ainitHeight)
        }
      }
      // ctx.fillText(addressName, 50, 1036)
      // 绘制二维码
      let ercodeDesc = '长按识别二维码报名'
      ctx.fillStyle = '#bbb' // 文字颜色
      ctx.font = '22px PingFang'
      let ercodeDescWidth = ctx.measureText(ercodeDesc).width
      let offsetErCode = (750 - 30) - ercodeDescWidth
      ctx.fillText(ercodeDesc, offsetErCode, 1078)
      // qrimg.onload = function () {
      ctx.drawImage(that.imgArr[1], 540, 880, 165, 165)
      // }
      // 绘制联盟
      that.drawTextVertical(ctx, this.data.alliance, 50, 60)
      const img = new Image()
      img.crossOrigin = ''
      img.src = canvas.toDataURL('image/png')
      // 后台打印
      this.imgSrc = img.src
      // console.log(this.imgSrc, 666)
      console.log(this.imgSrc, 444)
      img.style.width = '100%'
      that.$refs.showImg.appendChild(img)
      that.data.show = true
    },
    drawTextVertical (context, text, x, y) {
      const that = this
      // eslint-disable-next-line no-unused-vars
      let height = 0
      let width = 0
      let arrText = text.split('')
      let arrWidth = arrText.map(function (letter) { // 获取每个字的高度
        return context.measureText(letter).width
      })
      // 开始逐字绘制
      let TextArr = arrText
      let widthArr = arrWidth
      let dotx = x
      let doty = y
      TextArr.forEach(function (letter, index) {
        // 确定下一个字符的纵坐标位置
        let letterWidth = widthArr[index]
        let code = letter.charCodeAt(0)
        if (code <= 256) { // 判断是否是中文
        } else if (index > 0 && text.charCodeAt(index - 1) < 21) {
          doty = doty + widthArr[index - 1] / 2
        }
        if (doty >= 344) {
          dotx = dotx + 30
          doty = 60
        }
        width = dotx
        height = doty
        letterWidth = widthArr[index]
        doty = doty + letterWidth
      })
      that.roundRect2d(context, 25, 40, width, 344, 20)
      // 开始逐字绘制
      arrText.forEach(function (letter, index) {
        // 确定下一个字符的纵坐标位置
        let letterWidth = arrWidth[index]
        // 是否需要旋转判断
        let code = letter.charCodeAt(0)
        if (code <= 256) { // 判断是否是中文
          context.translate(x, y)
          // 英文字符，旋转90°
          context.rotate(90 * Math.PI / 180)
          context.translate(-x, -y)
        } else if (index > 0 && text.charCodeAt(index - 1) < 21) {
          // offset fix
          y = y + arrWidth[index - 1] / 2
        }
        if (y >= 344 && y !== 60) {
          x = x + 30
          y = 65
        } else {
          y = y + 5
        }
        context.fillStyle = '#fff' // 文字颜色
        context.globalAlpha = 1
        context.font = '26px SourceHanSansCN'
        context.textAlign = 'center'
        context.textBaseline = 'top'
        context.fillText(letter, x, y)
        // 旋转坐标系还原成初始态
        context.setTransform(1, 0, 0, 1, 0, 0)
        // 确定下一个字符的纵坐标位置
        letterWidth = arrWidth[index]
        y = y + letterWidth
      })
    },
    // canvas文字超出一行省略
    ellipseText (ctx, str, maxWidth) {
      let width = ctx.measureText(str).width
      let ellipsis = '…'
      let ellipsisWidth = ctx.measureText(ellipsis).width
      if (width <= maxWidth || width <= ellipsisWidth) {
        return str
      } else {
        let len = str.length
        while (width >= maxWidth - ellipsisWidth && len-- > 0) {
          str = str.substring(0, len)
          width = ctx.measureText(str).width
        }
        return str + ellipsis
      }
    },
    // 绘制圆角矩形
    roundRect (ctx, x, y, w, h, r) {
      // ctx.save();
      if (w < 2 * r) {
        r = w / 2
      }
      if (h < 2 * r) {
        r = h / 2
      }
      ctx.beginPath()
      ctx.strokeStyle = '#0097fe'
      ctx.fillStyle = 'transparent'
      ctx.lineWidth = 0.5
      ctx.moveTo(x + r, y)
      ctx.arcTo(x + w, y, x + w, y + h, r)
      ctx.arcTo(x + w, y + h, x, y + h, r)
      ctx.arcTo(x, y + h, x, y, r)
      ctx.arcTo(x, y, x + w, y, r)
      ctx.stroke()
      ctx.closePath()
    },
    // 绘制圆角矩形
    roundRect2d (ctx, x, y, w, h, r) {
      // ctx.save();
      if (w < 2 * r) {
        r = w / 2
      }
      if (h < 2 * r) {
        r = h / 2
      }
      ctx.beginPath()
      ctx.globalAlpha = 0.7
      ctx.fillStyle = '#0097fe'
      ctx.lineWidth = 0.5
      ctx.moveTo(x, y)
      ctx.arcTo(x + w, y, x + w, y + h, r)
      ctx.arcTo(x + w, y + h, x, y + h, 0)
      ctx.arcTo(x, y + h, x, y, r)
      ctx.arcTo(x, y, x + w, y, 0)
      ctx.stroke()
      ctx.closePath()
      ctx.fill()
    },
    // 绘制圆角矩形
    roundRect2 (ctx, x, y, w, h, r) {
      // ctx.save()
      if (w < 2 * r) { r = w / 2 }
      if (h < 2 * r) { r = h / 2 }
      ctx.beginPath()
      ctx.strokeStyle = '#ff2602'
      ctx.lineWidth = 0.5
      ctx.moveTo(x + r, y)
      ctx.arcTo(x + w, y, x + w, y + h, r)
      ctx.arcTo(x + w, y + h, x, y + h, r)
      ctx.arcTo(x, y + h, x, y, r)
      ctx.arcTo(x, y, x + w, y, r)
      // ctx.stroke()
      ctx.closePath()
      ctx.fillStyle = '#ff2602'
      ctx.fill()
    }
  }
}
</script>

<style lang="scss" scoped>
.preview {
  width: 100%;
  height: 100%;
  background-color: #fff;
  z-index: 3000;
  display: -webkit-box;
  display: -webkit-flex;
  display: -moz-box;
  display: flex;
  -webkit-box-orient: vertical;
  -webkit-box-direction: normal;
  -webkit-flex-direction: column;
  -moz-box-orient: vertical;
  -moz-box-direction: normal;
  flex-direction: column;
  -webkit-box-pack: center;
  -webkit-justify-content: center;
  -moz-box-pack: center;
  justify-content: center;
  -webkit-box-align: center;
  -webkit-align-items: center;
  -moz-box-align: center;
  align-items: center;
  .img_view {
    position: relative;
  }
}
.preview_img {
  width: 140px;
}
@media only screen and (min-width: 375px) {
  .preview_img {
    width: 140px;
  }
  .preview_word {
    font-size: 14px;
  }
}
.preview_word {
  font-size: 12px;
  color: white;
  margin-top: 10px;
}
.close_big {
  position: absolute;
  right: -30px;
  top: -30px;
  height: 60px;
  width: 60px;
  display: -webkit-box;
  display: -webkit-flex;
  display: -moz-box;
  display: flex;
  -webkit-box-pack: center;
  -webkit-justify-content: center;
  -moz-box-pack: center;
  justify-content: center;
  -webkit-box-align: center;
  -webkit-align-items: center;
  -moz-box-align: center;
  align-items: center;
  .close {
    height: 26px;
    width: 26px;
    border-radius: 50%;
    background: #fff;
    box-shadow: 0 1px 2px rgba(0, 0, 0, 0.2);
  }
}
.close::before {
  -webkit-transform: translateX(-50%) translateY(-50%) rotateZ(-45deg);
  -moz-transform: translateX(-50%) translateY(-50%) rotateZ(-45deg);
  transform: translateX(-50%) translateY(-50%) rotateZ(-45deg);
}
.close::after {
  -webkit-transform: translateX(-50%) translateY(-50%) rotateZ(45deg);
  -moz-transform: translateX(-50%) translateY(-50%) rotateZ(45deg);
  transform: translateX(-50%) translateY(-50%) rotateZ(45deg);
}
.close::after,
.close::before {
  content: "";
  width: 13px;
  height: 1px;
  background: #999;
  position: absolute;
  left: 50%;
  top: 50%;
}
.hideCanvas {
  display: block;
  position: fixed;
  left: -1000px;
  top: -1000px;
  visibility: hidden;
  opacity: 0;
  pointer-events: none;
}
</style>

<template>
   <div class="progress-bar" ref="progressBar" @click="progressClick">
    <div class="bar-inner">
      <div class="progress" ref="progress"></div>
      <div class="progress-btn-wrapper" ref="progressBtn" @touchstart.prevent="progressTouchStart"
           @touchmove.prevent="progressTouchMove"
           @touchend="progressTouchEnd">
        <div class="progress-btn"></div>
      </div>
    </div>
  </div>
</template>
<script>
export default {
  props: {
    percent: {
      type: Number,
      default: 0
    }
  },
  created() {
    this.touch = {};
  },
  methods: {
    progressTouchStart(e) {
      this.touch.initiated = true; //设置触摸状态
      this.touch.startX = e.touches[0].pageX; //记录触碰开始位置
      this.touch.left = this.$refs.progress.clientWidth; //记录进度条长度
    },
    progressTouchMove(e) {
      if (!this.touch.initiated) {
        return;
      }
      const deltaX = e.touches[0].pageX - this.touch.startX;//计算滑动距离
      const offsetWidth = Math.min(this.$refs.progressBar.clientWidth, Math.max(0, this.touch.left + deltaX)); //计算新距离
      this._offset(offsetWidth)
      //触发正在变化事件
      this.$emit('percentChanging', this._getPercent())
    },
    progressTouchEnd() {
      this.touch.initiated = false;
      //移动结束改变percent 触发事件
      this._triggerPercent();
    },
    setProgressOffest(percent) {
      if (percent > 0 && !this.touch.initiated) {
        const barWidth = this.$refs.progressBar.clientWidth;
        const offsetWidth = percent * barWidth;
        this._offset(offsetWidth);
      }
    },
    progressClick(e) {
      const rect = this.$refs.progressBar.getBoundingClientRect();
      const offsetWidth = e.pageX - rect.left - 8; //计算两者误差
      this._offset(offsetWidth); //设置进度条位置
      this._triggerPercent();
    },
    _offset(offsetWidth) {
      this.$refs.progress.style.width = `${offsetWidth}px`;
      this.$refs.progressBtn.style[
        "transform"
      ] = `translate3d(${offsetWidth}px,0,0)`;
    },
    _triggerPercent() {
      //触发父组件事件 percent改变
      this.$emit("percentChange", this._getPercent());
    },
    _getPercent() {
      const barWidth = this.$refs.progressBar.clientWidth; //进度条总长
      return this.$refs.progress.clientWidth / barWidth; //返回百分比
    }
  },
  watch: {
    percent(newpersent) {
      this.setProgressOffest(newpersent);
    }
  }
};
</script>
<style>
.progress-bar {
  height: 30px;
}
.bar-inner {
  position: relative;
  top: 13px;
  height: 4px;
  background: rgba(0, 0, 0, 0.3);
}
.progress {
  position: absolute;
  height: 100%;
  background: #fff;
}
.progress-btn-wrapper {
  position: absolute;
  left: -8px;
  top: -13px;
  width: 30px;
  height: 30px;
}
.progress-btn {
  position: relative;
  top: 7px;
  box-sizing: border-box;
  width: 16px;
  height: 16px;
  border: 3px solid #00000096;
  border-radius: 50%;
  background: #fff;
}
</style>

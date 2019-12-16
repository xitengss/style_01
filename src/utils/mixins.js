const entryNoCache = []

export const beforeRouteEnterMixin = {
  beforeRouteEnter (to, from, next) {
    next(that => {
      if (!from.name || entryNoCache.includes(from.name) || to.meta.isRefresh) {
        to.meta.isRefresh = false
        that.loadData && that.loadData()
      }
    })
  }
}

export const beforeRouteLeaveMixin = {
  beforeRouteLeave (to, from, next) {
    if (this.isRefresh) {
      this.isRefresh = false
      to.meta.isRefresh = true
    }
    next()
  }

}

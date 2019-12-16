import store from 'store'

export default (Vue) => {
  Vue.directive('permission', {
    inserted: function (el, binding) {
      const {
        value
      } = binding

      if (value && typeof value === 'string') {
        const funcList = store.getters && store.getters.funcList
        const hasPermission = funcList.some(func => {
          return func.tag === value
        })

        if (!hasPermission) {
          el.parentNode && el.parentNode.removeChild(el)
        }
      } else {
        throw new Error(`need roles! Like v-permission="funcCopy"`)
      }
    }
  })
}

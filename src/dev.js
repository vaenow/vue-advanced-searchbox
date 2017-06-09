import Vue from 'vue'
import vAdvancedSearchbox from './components/AdvancedSearchbox.vue'
import debounce from 'lodash/debounce'
import resource from 'vue-resource'

Vue.use(resource)

Vue.component('v-advanced-searchbox', vAdvancedSearchbox)

Vue.config.devtools = true

/* eslint-disable no-new */
new Vue({
  el: '#app',
  data: {
    placeholder: "placeholder",
    value: null,
    ajaxRes: []
  },
  methods: {
    search(search, loading) {
      loading(true)
      this.getRepositories(search, loading, this)
    },
    getRepositories: debounce((search, loading, vm) => {
      vm.$http.get(`https://api.github.com/search/repositories?q=${search}`).then(res => {
        vm.ajaxRes = res.data.items
        loading(false)
      })
    }, 250)
  }
})

import Vue from 'vue'
import Vuex from 'vuex'
import axios from 'axios'
import router from '@/router'

Vue.use(Vuex)


export default new Vuex.Store({
  state: {
    token: localStorage.getItem('token') || '',
    user: '',
    loaded: false
  },
  mutations: {
    setToken(state, payload) {
      state.token = payload;
    },
    removeToken(state) {
      state.token = null;
    },
    setUser(state, payload) {
      state.user = payload;
    },
    removeUser(state) {
      state.user = null;
    },
    setLoaded(state, payload){
      state.loaded = payload;
    }
  },
  actions: {
    init({ dispatch }) {
      dispatch('update');
      setInterval(() => {
        dispatch('update');
      }, 3 * 60000)

    },
    update({ state, commit }) {
      if (state.token) {
        axios
          .get(Vue.prototype.$apiUrl + `/token`, { headers: { "Authorization": "Refresh " + state.token } })
          .then((res) => {
            commit('setUser', res.data);
            axios.defaults.headers.common['Authorization'] = "User " + res.data.token;
            commit('setLoaded',true);
          })
          .catch(() => {
          });
      }else{
        commit('setLoaded',true);
      }
    },
    login({ commit, dispatch }, payload) {
      commit('setToken', payload.token);
      window.localStorage.setItem('token', payload.token);
      dispatch('update');
    },
    logout({commit}){
      window.localStorage.removeItem('token');
      commit('removeToken');
      commit('removeUser');
      axios.defaults.headers.common['Authorization'] = null;
      router.push('/');
    }
  },
  getters: {
    token: state => state.token,
    user: state => state.user,
    loaded: state => state.loaded
  }
})
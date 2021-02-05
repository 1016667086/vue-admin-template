/* eslint-disable eol-last */
/* eslint-disable indent */
import { login, logout, getInfo } from '@/api/user'
import { getToken, setToken, removeToken } from '@/utils/auth'
import { resetRouter } from '@/router'

const getDefaultState = () => {
    return {
        token: getToken(),
        name: '',
        avatar: '',
        id: ''
    }
}

const state = getDefaultState()

const mutations = {
    RESET_STATE: (state) => {
        Object.assign(state, getDefaultState())
    },
    SET_TOKEN: (state, token) => {
        state.token = token
    },
    SET_NAME: (state, name) => {
        state.name = name
    },
    SET_AVATAR: (state, avatar) => {
        state.avatar = avatar
    },
    SET_ID: (state, id) => {
        state.id = id
    }

}

const actions = {
    // user login
    login({ commit }, userInfo) {
        const { username, password } = userInfo
        return new Promise((resolve, reject) => {
            login({ userName: username.trim(), pwd: password }).then(response => { // 修改40行的代码。
                // console.log("登录的数据," +response);
                const { data } = response
                commit('SET_TOKEN', data.token)
                commit('SET_ID', data.user.id)
                setToken(data.token)
                resolve()
            }).catch(error => {
                reject(error)
            })
        })
    },

    // 获取用户信息。
    getInfo({ commit, state }) {

        // 解决刷新丢失store的问题
        let Id = state.id
        if (Id === '') {
            // 从sessionStorage 获得数据 ,次数据在登录页面添加
            Id = user.id;
        }
        return new Promise((resolve, reject) => {
            getInfo(state.id).then(response => {
                const { data } = response
                if (!data) {
                    return reject('Verification failed, please Login again.')
                }
                commit('SET_NAME', data.userName)
                commit('SET_AVATAR', 'https://wpimg.wallstcn.com/f778738c-e4f8-4870-b634-56703b4acafe.gif')
                resolve(data)
            }).catch(error => {
                reject(error)
            })
        })
    },

    // 用户注销登录的逻辑代码
    logout({ commit, state }) {
        return new Promise((resolve, reject) => {
            logout(state.token).then(() => {
                removeToken() // must remove  token  first
                resetRouter()
                commit('RESET_STATE')
                resolve()
            }).catch(error => {
                reject(error)
            })
        })
    },

    // remove token
    resetToken({ commit }) {
        return new Promise(resolve => {
            removeToken() // must remove  token  first
            commit('RESET_STATE')
            resolve()
        })
    }
}

export default {
    namespaced: true,
    state,
    mutations,
    actions
}
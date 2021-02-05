/* eslint-disable eol-last */
/* eslint-disable comma-dangle */
/* eslint-disable indent */
/* eslint-disable */
import request from '@/utils/request'

export function login(data) {
    return request({
        url: '/user/login',
        method: 'post',
        data
    })
}

export function getInfo(id) {
    return request({
        url: '/user/' + id,
        method: 'get'
    })
}

export function logout() {
    return request({
        url: '/vue-admin-template/user/logout',
        method: 'post'
    })
}

export function getList(query) {
    return request({
        url: '/user/list',
        method: 'get',
        params: query
    })
}


export function addUser(data) {
    return request({
        url: '/user/register',
        method: 'post',
        data
    })
}

export function updateUser(data) {
    return request({
        url: '/user/update',
        method: 'put',
        data
    })
}

export function delUser(data) {
    return request({
        url: '/user/del',
        method: 'delete',
        data
    })
}
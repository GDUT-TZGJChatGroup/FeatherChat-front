import axios from 'axios';
const baseURL = '/';


const axiosInstance = axios.create({
    baseURL,
    headers: {
        'Content-Type': 'application/json'
    }
});


// 获取邮箱验证码
// userApi.js
export const sendEmailCaptcha = async (to) => {
    return axiosInstance.post('/api/mail', { to });
};


// 用户注册
export const userRegister = async (params) => {
    return axiosInstance.post('/api/user/register', params);
};

// 用户登录
export const userLogin = async (params) => {
    return axiosInstance.post('/api/user/login', params);
};

// 获取好友列表
export const getFriendList = async () => {
    return axiosInstance.get('/api/user/friends');
};

// 发送好友请求
export const sendFriendRequest = async (accountName) => {
    return axiosInstance.post(`/api/user/friendRequest/${accountName}`);
};

// 获取好友请求列表（新）
export const getFriendRequestList = async () => {
    return axiosInstance.get('/api/user/friendsRequestList');
};

// 同意好友请求
export const agreeFriendRequest = async (accountName) => {
    return axiosInstance.put(`/api/user/friendAgree/${accountName}`);
};

// 删除好友
export const deleteFriend = async (accountName) => {
    return axiosInstance.delete(`/api/user/friendDelete/${accountName}`);
};

// 获取聊天记录
export const getChatHistory = async (friendAccount) => {
    return axiosInstance.get('/api/chat/history', { params: { friendAccount } });
};

// 请求拦截器，添加 token（排除不需要 token 的接口）
axiosInstance.interceptors.request.use(config => {
    const token = localStorage.getItem('token');

    // 不需要 token 的接口白名单
    const noTokenUrls = ['/api/mail', '/api/user/login', '/api/user/register'];

    // 判断当前请求 URL 是否在白名单中
    const isNoToken = noTokenUrls.some(url => config.url.includes(url));

    if (token && !isNoToken) {
        config.headers['token'] = token;
    }

    return config;
}, error => {
    return Promise.reject(error);
});

import axios, { AxiosHeaders, AxiosResponse } from "axios";
import CONSTANT from "./constant";

const golbalAxios = axios.create({
    baseURL: process.env.API_ENDPOINT,
    headers: {
        'Content-Type': 'application/json',
    },
    timeout: 5000,
})

golbalAxios.interceptors.request.use((config) =>{
    const token = getToken(CONSTANT.STORAGE.ACCESS_TOKEN);
    if(token){
        (config.headers as AxiosHeaders).set('Authorization', `Bearer ${token}`)
    }
    return config
}, (error) =>{
    return Promise.reject(error)
})
golbalAxios.interceptors.response.use((res: AxiosResponse) =>{
    return res
}, async error =>{
    if(error.response.status === 401){
        try{
            // const refreshToken = getToken(CONSTANT.STORAGE.REFRESH_TOKEN);
            // const result = await golbalAxios.post('auth/refreh-token', {
            //     refreshToken
            // })
            // console.log('result--------', result)
            // localStorage.setItem('access_token', data.access_token);
            // instance.defaults.headers.common['Authorization'] = `Bearer ${data.access_token}`;
            // return instance(error.config);
        }catch{
            return Promise.reject(error)
        }
    }
    return Promise.reject(error)
})

const getToken = (tokenType: string) => localStorage.getItem(tokenType)

export default golbalAxios;
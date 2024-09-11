import axios from "axios";
import cookie from "react-cookies";

const BASE_URL = 'http://localhost:8080/SpringSaleApp';

export const endpoints ={
    'categories' : '/api/categories/',
    'products' : '/api/products/',
    'details' : (productId) => `/api/products/${productId}/`,
    'register' : '/api/users',
    'login' : '/api/login',
    'current-user': '/api/current-user',
    'pay' : '/api/pay/'
}

export const authApi = () =>{
    return axios.create({
        baseURL: BASE_URL,
        headers: {
            'Authorization': `${cookie.load('token')}`
        }
    })
}

export default axios.create({
    baseURL: BASE_URL
});
import axios from "axios";

const BASE_URL = "http://localhost:5001";

export const registerUser = async(data) =>{
    return await axios.post(`${BASE_URL}/api/auth/sign-Up`,data)
}

export const loginUser = async(data)=>{
    return await axios.post(`${BASE_URL}/api/auth/log-In`,data)
}
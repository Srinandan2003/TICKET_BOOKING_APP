import axios from "axios";

const BASE_URL = "https://ticket-booking-app-pfq1.onrender.com";

export const registerUser = async(data) =>{
    return await axios.post(`${BASE_URL}/api/auth/sign-Up`,data)
}

export const loginUser = async(data)=>{
    return await axios.post(`${BASE_URL}/api/auth/log-In`,data)
}
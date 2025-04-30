import axios from 'axios'

const axiosInstance = axios.create({
    baseURL:"https://ticket-booking-app-pfq1.onrender.com"
})

export default axiosInstance
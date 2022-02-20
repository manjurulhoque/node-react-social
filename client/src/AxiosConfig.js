import axios from "axios";

const AxiosConfig = axios.create({
    baseURL: "http://localhost:8800/api",
    headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json',
    },
});


export default AxiosConfig;
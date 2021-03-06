import axios from "axios";

/**
 * 서버 요청
 */
export default axios.create({
    baseURL: process.env.REACT_APP_WAS_URL,
    headers: {
        "Content-type": "application/json"
    }
});
import axios from "axios";

export default axios.create({
    baseURL:"http://192.168.11.102:8081/morwork/api/v1",
    headers:{"ngrok-skip-browser-warning":"true"}
})
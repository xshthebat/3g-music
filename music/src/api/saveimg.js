const debug = process.env.NODE_ENV !== 'production'
import axios from "axios";
// console.log(axios);
axios.defaults.withCredentials = true;
export default function saveimg(blob) {
    const url = debug ? "http://localhost:8881/api/changeimg" : "http://123.207.138.78:8881/api/changeimg";
    let fromData = new FormData();
    fromData.append("img", blob);
    return axios.post(url, fromData, {
        headers: {
            'Content-Type': 'multipart/form-data' //之前说的以表单传数据的格式来传递fromdata
        }
    });
}
import axios from 'axios';
import env   from '../envVariables';

const apiUpdate = axios.create({
    baseURL: env.REACT_APP_API_URL,
    withCredentials: false,
});

export default apiUpdate;

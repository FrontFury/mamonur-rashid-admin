import axios from "axios";

const axiosSecure = axios.create({
  baseURL: "https://mamonur-rashid-server.vercel.app", 
});

const useAxios = () => {
    
    return axiosSecure;
};

export default useAxios;
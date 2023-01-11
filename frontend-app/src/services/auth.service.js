import Axios from "../custom-axios/axios.js";


const API_URL = "/auth";

const login = async (username, email, organizationType, password) => {
    const user = {username, password, email, organizationType};

    return await Axios
        .post(API_URL + "/login", user)
        .then((response) => {
            if (response.data.access_token) {
                localStorage.setItem("user", JSON.stringify(response.data));
            }

            return response.data;
        });
};

const register = async (username, email, organizationType, password, roles) => {
    const user = {username, email, password, organizationType, roles};

    return await Axios
        .post(API_URL + "/register", user)
        .then((response) => {
            if (response.data.accessToken) {
                localStorage.setItem("user", JSON.stringify(response.data));
            }

            return response.data;
        });
};

const testAuthentication = async () => {
    const currentUser = JSON.parse(localStorage.getItem("user"));
    const accessToken = currentUser.access_token;
    return await Axios.get(API_URL + "/test-JWT", {headers: {"Authorization": `Bearer ${accessToken}`}}).then(
        (response) => {
            console.log(response.data)
        }
    );
};


const logout = () => {
    localStorage.removeItem("user");
    // redirect to home page maybe
};

const getCurrentUser = () => {
    return JSON.parse(localStorage.getItem("user"));
};

const authService = {
    login,
    register,
    logout,
    getCurrentUser,
    testAuthentication
};

export default authService;
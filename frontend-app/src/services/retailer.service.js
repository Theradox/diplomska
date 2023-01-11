import Axios from "../custom-axios/axios.js";

const API_URL = "/retailer";


const findAllWarranties = async () => {
    const currentUser = JSON.parse(localStorage.getItem("user"));
    const accessToken = currentUser.access_token;

    return await Axios.get(`${API_URL}/warranties`, {headers: {"Authorization": `Bearer ${accessToken}`}})
};

const createWarranty = async (id, issuer, owner, warrantyStatus, warrantyService,
     warrantyIssueDate, warrantyExpirationDate) => {

        const currentUser = JSON.parse(localStorage.getItem("user"));
        const accessToken = currentUser.access_token;

        const warranty = {
            id,
            issuer,
            owner,
            warrantyStatus,
            warrantyService,
            warrantyIssueDate,
            warrantyExpirationDate
        };

    return await Axios.post(`${API_URL}/warranty`, warranty, {headers: {"Authorization": `Bearer ${accessToken}`}});
}

const assignWarranty = async (id, owner) => {

       const currentUser = JSON.parse(localStorage.getItem("user"));
       const accessToken = currentUser.access_token;

       const warranty = {
           id,
           owner
       };

   return await Axios.put(`${API_URL}/assign-ownership`, warranty, {headers: {"Authorization": `Bearer ${accessToken}`}});
}

// const terminateWarrantyOwnership = async (id) => {
//     const currentUser = JSON.parse(localStorage.getItem("user"));
//     const accessToken = currentUser.access_token;

//     return await Axios.put(`${API_URL}/terminate-ownership/${id}`, '' ,{headers: {"Authorization": `Bearer ${accessToken}`}})
// }

const retailerService = {
    findAllWarranties,
    createWarranty,
    // terminateWarrantyOwnership,
    assignWarranty
};

export default retailerService;



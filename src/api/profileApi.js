import apiClient from './axiosConfig';

export const profileApi = {

    getProfile: async () => {

        const body = new URLSearchParams();
        body.append("vTimezoneOffset", "");
        body.append("vTimezone", "");

        return apiClient.post('/user/userprofile', body);
    },

    updateProfile: async (formData) => {

        const body = new URLSearchParams();

        body.append("vFirstName", formData.firstName);
        body.append("vLastName", formData.lastName);
        body.append("vEmailId", formData.email);
        body.append("vZipCode", formData.zipCode);
        body.append("tiGender",
            formData.gender === "Male" ? "1" :
            formData.gender === "Female" ? "2" : "3"
        );
        body.append("vStreetAddress", formData.streetAddress);
        body.append("vDob", formData.dob);
        body.append("vSsnNumber", formData.ssn);
        body.append("iRadius", formData.radius);

        return apiClient.post('/user/editprofile', body);
    }

};
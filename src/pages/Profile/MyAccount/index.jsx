import React, { useState, useEffect } from 'react';
// import { useNavigate } from 'react-router-dom';
import { profileApi } from '../../../api/profileApi';
import { useMessage } from '../../../context/MessageContext';
import './MyAccount.scss';
import Header from '../../../components/layout/Header/Header';

export default function MyAccount() {

    // const navigate = useNavigate();
    const [activeTab, setActiveTab] = useState('personal');
    const { showMessage } = useMessage();

    const [formData, setFormData] = useState(() => {
        let user = {};
        try {
            const storedUser = localStorage.getItem('userData');
            if (storedUser) {
                user = JSON.parse(storedUser);
            }
        } catch (e) {
            console.error("Error parsing userData from localStorage", e);
        }

        return {
            firstName: user?.vFirstName || '',
            lastName: user?.vLastName || '',
            email: user?.vEmailId || '',
            streetAddress: user?.vStreetAddress || '',
            zipCode: user?.vZipCode || '',
            gender: String(user?.tiGender) === "1" ? "Male" : String(user?.tiGender) === "2" ? "Female" : user?.tiGender ? "Other" : "",
            dob: user?.vDob || '',
            radius: user?.iRadius || '',
            mobileNumber: user?.vMobileNumber || '',
            ssn: user?.vSsnNumber || '',
            dLatitude: user?.dLatitude || '',
            dLongitude: user?.dLongitude || '',
            vCity: user?.vCity || '',
            vState: user?.vState || '',
            vCountry: user?.vCountry || '',
            vCountryCode: user?.vCountryCode || '',
            iCityId: user?.iCityId || '',
            txProfilePic: user?.txProfilePic || '',
            txProfileThumb: user?.txProfileThumb || '',
            bankName: '',
            branchLocation: '',
            routingNumber: '',
            accountHolderName: '',
            accountNumber: ''
        };
    });


    useEffect(() => {

        const fetchProfile = async () => {
            try {
                const res = await profileApi.getProfile();

                console.log("STATUS CODE:", res.status);
                console.log("PROFILE RESPONSE:", res.data);

                if (res.data?.responseCode !== 200) return;

                const user = res.data.responseData;

                setFormData(prev => ({
                    ...prev,
                    firstName: user?.vFirstName || '',
                    lastName: user?.vLastName || '',
                    email: user?.vEmailId || '',
                    streetAddress: user?.vStreetAddress || '',
                    zipCode: user?.vZipCode || '',
                    gender:
                        String(user?.tiGender) === "1"
                            ? "Male"
                            : String(user?.tiGender) === "2"
                                ? "Female"
                                : "Other",
                    dob: user?.vDob || '',
                    radius: user?.iRadius || '',
                    mobileNumber: user?.vMobileNumber || '',
                    ssn: user?.vSsnNumber || '',
                    dLatitude: user?.dLatitude || '',
                    dLongitude: user?.dLongitude || '',
                    vCity: user?.vCity || '',
                    vState: user?.vState || '',
                    vCountry: user?.vCountry || '',
                    vCountryCode: user?.vCountryCode || '',
                    iCityId: user?.iCityId || '',
                    txProfilePic: user?.txProfilePic || '',
                    txProfileThumb: user?.txProfileThumb || ''
                }));

            } catch (error) {
                console.log("PROFILE ERROR:", error);
            }
        };

        fetchProfile();

    }, []);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };


    const handleSubmit = async (e) => {
        e.preventDefault();

        try {
            const res = await profileApi.updateProfile(formData);

            console.log("UPDATE RESPONSE:", res.data);

            if (res.data?.responseCode === 200) {
                showMessage(res.data?.responseMessage || 'Profile Updated Successfully', 'success');
            } else {
                showMessage(res.data?.responseMessage || 'Update Failed', 'error');
            }

        } catch (error) {
            console.log("UPDATE ERROR:", error);
            showMessage('Update Failed', 'error');
        }
    };

    return (
        <div className="my-account-container">
            <Header title="My Account" />

            <div className="tabs-container">
                <div
                    className={`tab ${activeTab === 'personal' ? 'active' : ''}`}
                    onClick={() => setActiveTab('personal')}
                >
                    Personal Details
                </div>
                <div
                    className={`tab ${activeTab === 'bank' ? 'active' : ''}`}
                    onClick={() => setActiveTab('bank')}
                >
                    Bank Details
                </div>
            </div>

            <div className="my-account-content">
                {activeTab === 'personal' ? (
                    <div className="personal-details">
                        <div className="photo-section">
                            <div className="avatar-circle">
                                <span className="avatar-icon">👤</span>
                            </div>
                            <button className="change-photo-btn">Change Photo</button>
                        </div>

                        <form className="account-form" onSubmit={handleSubmit}>
                            <div className="form-row">
                                <div className="form-group half">
                                    <label>First Name</label>
                                    <input type="text" name="firstName" value={formData.firstName} onChange={handleChange} />
                                </div>
                                <div className="form-group half">
                                    <label>Last Name</label>
                                    <input type="text" name="lastName" value={formData.lastName} onChange={handleChange} />
                                </div>
                            </div>

                            <div className="form-group">
                                <label>Email</label>
                                <input type="email" name="email" value={formData.email} onChange={handleChange} />
                            </div>

                            <div className="form-group address-group">
                                <label>Street Address</label>
                                <div className="input-with-icon">
                                    <input type="text" name="streetAddress" value={formData.streetAddress} onChange={handleChange} />
                                    <span className="location-icon">📍</span>
                                </div>
                            </div>

                            <div className="form-row">
                                <div className="form-group half">
                                    <label>Zip Code</label>
                                    <input type="text" name="zipCode" value={formData.zipCode} onChange={handleChange} />
                                </div>
                                <div className="form-group half">
                                    <label>Gender</label>
                                    <select name="gender" value={formData.gender} onChange={handleChange}>
                                        <option value="">Select</option>
                                        <option value="Male">Male</option>
                                        <option value="Female">Female</option>
                                        <option value="Other">Other</option>
                                    </select>
                                </div>
                            </div>

                            <div className="form-row">
                                <div className="form-group half">
                                    <label>DOB</label>
                                    <input type="date" name="dob" value={formData.dob} onChange={handleChange} />
                                </div>
                                <div className="form-group half">
                                    <label>Radius</label>
                                    <input type="text" name="radius" value={formData.radius} onChange={handleChange} />
                                </div>
                            </div>

                            <div className="form-group phone-group">
                                <label>Mobile Number</label>
                                <div className="phone-input-container">
                                    <span className="country-code">+1</span>
                                    <span className="phone-display">{formData.mobileNumber}</span>
                                    <button type="button" className="change-link">Change</button>
                                </div>
                            </div>

                            <div className="form-group">
                                <label>Social Security number</label>
                                <input type="text" name="ssn" value={formData.ssn} onChange={handleChange} />
                            </div>

                            <button type="submit" className="update-btn">Update</button>
                        </form>
                    </div>
                ) : (
                    <div className="bank-details">
                        <form className="account-form" onSubmit={handleSubmit}>
                            <div className="form-group">
                                <label>Bank Name</label>
                                <input type="text" name="bankName" value={formData.bankName} onChange={handleChange} />
                            </div>

                            <div className="form-group">
                                <label>Branch Location</label>
                                <input type="text" name="branchLocation" value={formData.branchLocation} onChange={handleChange} />
                            </div>

                            <div className="form-group">
                                <label>Bank Routing Number</label>
                                <input type="text" name="routingNumber" value={formData.routingNumber} onChange={handleChange} />
                            </div>

                            <div className="form-group">
                                <label>Account Holder's Name</label>
                                <input type="text" name="accountHolderName" value={formData.accountHolderName} onChange={handleChange} />
                            </div>

                            <div className="form-group">
                                <label>Account Number</label>
                                <input type="text" name="accountNumber" value={formData.accountNumber} onChange={handleChange} />
                            </div>

                            <button type="submit" className="update-btn">Update</button>
                        </form>
                    </div>
                )}
            </div>
        </div>
    );
}
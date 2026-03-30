import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { profileApi } from '../../../api/profileApi';
import { bankApi } from '../../../api/bankApi';
import { useMessage } from '../../../context/MessageContext';
import Header from '../../../components/layout/Header/Header';
import './MyAccount.scss';

// SVG Icons
const PersonIcon = () => (
    <svg viewBox="0 0 24 24" width="32" height="32" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path>
        <circle cx="12" cy="7" r="4"></circle>
    </svg>
);

const LocationIcon = () => (
    <svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"></path>
        <circle cx="12" cy="10" r="3"></circle>
    </svg>
);


export default function MyAccount() {
    const navigate = useNavigate();
    const [activeTab, setActiveTab] = useState(0);
    const [hasBankDetails, setHasBankDetails] = useState(false);
    const [bankLoading, setBankLoading] = useState(false);
    const { showMessage } = useMessage();

    const [formData, setFormData] = useState(() => {
        let user = {};
        try {
            const storedUser = localStorage.getItem('userData');
            if (storedUser) user = JSON.parse(storedUser);
        } catch (e) {
            console.error("Error parsing userData", e);
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
                if (res.data?.responseCode !== 200) return;
                const user = res.data.responseData;
                setFormData(prev => ({
                    ...prev,
                    firstName: user?.vFirstName || '',
                    lastName: user?.vLastName || '',
                    email: user?.vEmailId || '',
                    streetAddress: user?.vStreetAddress || '',
                    zipCode: user?.vZipCode || '',
                    gender: String(user?.tiGender) === "1" ? "Male" : String(user?.tiGender) === "2" ? "Female" : "Other",
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
            } catch (error) {}
        };
        fetchProfile();
    }, []);

    useEffect(() => {
        if (activeTab !== 1) return;
        const fetchBankInfo = async () => {
            try {
                setBankLoading(true);
                const res = await bankApi.getBankInfo();
                const bank = res.data?.responseData || res.data?.data || res.data;
                if (bank && (bank.vBankName || bank.iAccountNumber)) {
                    setHasBankDetails(true);
                    setFormData(prev => ({
                        ...prev,
                        bankName: bank.vBankName || '',
                        branchLocation: bank.vBranchLocation || '',
                        routingNumber: bank.iRoutingNumber || '',
                        accountHolderName: bank.vAccountHolderName || '',
                        accountNumber: bank.iAccountNumber || ''
                    }));
                }
            } catch (error) {} finally { setBankLoading(false); }
        };
        fetchBankInfo();
    }, [activeTab]);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const res = await profileApi.updateProfile(formData);
            if (res.data?.responseCode === 200) {
                showMessage(res.data?.responseMessage || 'Profile Updated Successfully', 'success');
            } else {
                showMessage(res.data?.responseMessage || 'Update Failed', 'error');
            }
        } catch (error) { showMessage('Update Failed', 'error'); }
    };

    const handleBankSubmit = async (e) => {
        e.preventDefault();
        try {
            const bankData = {
                bankName: formData.bankName,
                branchLocation: formData.branchLocation,
                routingNumber: formData.routingNumber,
                accountHolderName: formData.accountHolderName,
                accountNumber: formData.accountNumber
            };
            let res = hasBankDetails ? await bankApi.editBankDetails(bankData) : await bankApi.addBankDetails(bankData);
            if (res.data?.responseCode === 200) {
                setHasBankDetails(true);
                showMessage(res.data?.responseMessage || 'Bank Details Saved!', 'success');
            } else {
                showMessage(res.data?.responseMessage || 'Failed to save bank details', 'error');
            }
        } catch (error) { showMessage('Failed to save bank details', 'error'); }
    };

    return (
        <div className="my-account-container">
            <Header title="My Account" onBack={() => navigate('/dashboard/profile')} />

            <div className="tabs-wrapper">
                <div className={`tab ${activeTab === 0 ? 'active' : ''}`} onClick={() => setActiveTab(0)}>Personal Details</div>
                <div className={`tab ${activeTab === 1 ? 'active' : ''}`} onClick={() => setActiveTab(1)}>Bank Details</div>
            </div>

            <div className="account-form-wrapper">
                <div className="card">
                    {activeTab === 0 ? (
                        <form onSubmit={handleSubmit}>
                            <div className="avatar-section">
                                <div className="avatar">
                                    {(formData.txProfileThumb || formData.txProfilePic) ? (
                                        <img src={formData.txProfileThumb || formData.txProfilePic} alt="Avatar" />
                                    ) : <PersonIcon />}
                                </div>
                                <button type="button">Change Photo</button>
                            </div>

                            <div className="form-grid">
                                <div className="form-field">
                                    <label>First Name</label>
                                    <input name="firstName" value={formData.firstName} onChange={handleChange} placeholder="First Name" />
                                </div>
                                <div className="form-field">
                                    <label>Last Name</label>
                                    <input name="lastName" value={formData.lastName} onChange={handleChange} placeholder="Last Name" />
                                </div>
                                <div className="form-field full-width">
                                    <label>Email ID</label>
                                    <input type="email" name="email" value={formData.email} onChange={handleChange} placeholder="Email" />
                                </div>
                                <div className="form-field full-width">
                                    <label>Street Address</label>
                                    <div className="input-wrapper">
                                        <input name="streetAddress" value={formData.streetAddress} onChange={handleChange} placeholder="Street Address" />
                                        <div className="icon"><LocationIcon /></div>
                                    </div>
                                </div>
                                <div className="form-field">
                                    <label>Zip Code</label>
                                    <input name="zipCode" value={formData.zipCode} onChange={handleChange} placeholder="Zip Code" />
                                </div>
                                <div className="form-field">
                                    <label>Gender</label>
                                    <select name="gender" value={formData.gender} onChange={handleChange}>
                                        <option value="">Select</option>
                                        <option value="Male">Male</option>
                                        <option value="Female">Female</option>
                                        <option value="Other">Other</option>
                                    </select>
                                </div>
                                <div className="form-field">
                                    <label>Date of Birth</label>
                                    <input type="date" name="dob" value={formData.dob} onChange={handleChange} />
                                </div>
                                <div className="form-field">
                                    <label>Radius (miles)</label>
                                    <input type="number" name="radius" value={formData.radius} onChange={handleChange} placeholder="Radius" />
                                </div>
                                <div className="form-field full-width">
                                    <label>Mobile Number</label>
                                    <div className="mobile-box">
                                        <div className="info">
                                            <span className="code">+1</span>
                                            <span>{formData.mobileNumber || 'Not provided'}</span>
                                        </div>
                                        <span className="change-link" onClick={() => navigate('/dashboard/profile/change-mobile')}>Change</span>
                                    </div>
                                </div>
                                <div className="form-field full-width">
                                    <label>Social Security Number</label>
                                    <input name="ssn" value={formData.ssn} onChange={handleChange} placeholder="SSN" />
                                </div>
                                
                                <div className="full-width">
                                    <button type="submit" className="btn-large">Update Profile</button>
                                </div>
                            </div>
                        </form>
                    ) : (
                        <form onSubmit={handleBankSubmit}>
                            {bankLoading ? (
                                <div className="loading-wrap">Loading...</div>
                            ) : (
                                <div className="form-grid">
                                    <div className="form-field full-width">
                                        <label>Bank Name</label>
                                        <input name="bankName" value={formData.bankName} onChange={handleChange} required placeholder="Bank Name" />
                                    </div>
                                    <div className="form-field full-width">
                                        <label>Branch Location</label>
                                        <input name="branchLocation" value={formData.branchLocation} onChange={handleChange} required placeholder="Branch Location" />
                                    </div>
                                    <div className="form-field full-width">
                                        <label>Bank Routing Number</label>
                                        <input name="routingNumber" value={formData.routingNumber} onChange={handleChange} required placeholder="Routing Number" />
                                    </div>
                                    <div className="form-field full-width">
                                        <label>Account Holder's Name</label>
                                        <input name="accountHolderName" value={formData.accountHolderName} onChange={handleChange} required placeholder="Name" />
                                    </div>
                                    <div className="form-field full-width">
                                        <label>Account Number</label>
                                        <input name="accountNumber" value={formData.accountNumber} onChange={handleChange} required placeholder="Account Number" />
                                    </div>
                                    <div className="full-width">
                                        <button type="submit" className="btn-large">
                                            {hasBankDetails ? 'Update Bank Details' : 'Save Bank Details'}
                                        </button>
                                    </div>
                                </div>
                            )}
                        </form>
                    )}
                </div>
            </div>
        </div>
    );
}
import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { profileApi } from '../../../api/profileApi';
import { bankApi } from '../../../api/bankApi';
import { useMessage } from '../../../context/MessageContext';
import { getImageUrl } from '../../../utils/imageUtils';
import './MyAccount.scss';
import Header from '../../../components/layout/Header/Header';

export default function MyAccount() {

    const navigate = useNavigate();
    const [activeTab, setActiveTab] = useState('personal');
    const [hasBankDetails, setHasBankDetails] = useState(false);
    const [bankLoading, setBankLoading] = useState(false);
    const [errors, setErrors] = useState({});
    const { showMessage } = useMessage();
    const fileInputRef = useRef(null);

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
            }
        };

        fetchProfile();

    }, []);

    // Fetch bank details when the bank tab is activated
    useEffect(() => {
        if (activeTab !== 'bank') return;

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
            } catch (error) {
            } finally {
                setBankLoading(false);
            }
        };

        fetchBankInfo();
    }, [activeTab]);

    const validatePersonal = () => {
        let newErrors = {};
        if (!formData.firstName?.trim()) newErrors.firstName = "First Name is required";
        if (!formData.lastName?.trim()) newErrors.lastName = "Last Name is required";
        
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!formData.email?.trim()) newErrors.email = "Email is required";
        else if (!emailRegex.test(formData.email)) newErrors.email = "Invalid email format";

        if (!formData.streetAddress?.trim()) newErrors.streetAddress = "Street Address is required";
        
        if (!formData.zipCode?.trim()) newErrors.zipCode = "Zip Code is required";
        
        if (!formData.gender) newErrors.gender = "Gender is required";
        if (!formData.dob) newErrors.dob = "DOB is required";
        
        if (!String(formData.radius)?.trim()) newErrors.radius = "Radius is required";
        else if (isNaN(formData.radius)) newErrors.radius = "Radius must be a valid number";
        
        if (!formData.ssn?.trim()) newErrors.ssn = "SSN is required";
        else if (!/^\d{9}$/.test(formData.ssn.replace(/[- ]/g, ''))) newErrors.ssn = "Invalid SSN format";

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const validateBank = () => {
        let newErrors = {};
        if (!formData.bankName?.trim()) newErrors.bankName = "Bank Name is required";
        if (!formData.branchLocation?.trim()) newErrors.branchLocation = "Branch Location is required";
        
        if (!formData.routingNumber?.trim()) newErrors.routingNumber = "Routing Number is required";
        else if (!/^\d{9}$/.test(formData.routingNumber)) newErrors.routingNumber = "Routing number must be 9 digits";

        if (!formData.accountHolderName?.trim()) newErrors.accountHolderName = "Account Holder Name is required";
        
        if (!formData.accountNumber?.trim()) newErrors.accountNumber = "Account Number is required";
        else if (!/^\d{6,18}$/.test(formData.accountNumber)) newErrors.accountNumber = "Invalid Account Number";

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
        if (errors[name]) {
            setErrors(prev => ({ ...prev, [name]: null }));
        }
    };

    const handlePhotoSelect = async (e) => {
        const file = e.target.files[0];
        if (!file) return;

        try {
            const base64 = await fileToBase64(file);
            setFormData(prev => ({
                ...prev,
                txProfilePic: base64,
                txProfileThumb: base64
            }));
        } catch (error) {
            showMessage('Failed to process image', 'error');
        }
    };

    const fileToBase64 = (file) => {
        return new Promise((resolve, reject) => {
            const reader = new FileReader();
            reader.readAsDataURL(file);
            reader.onload = () => resolve(reader.result);
            reader.onerror = (error) => reject(error);
        });
    };


    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!validatePersonal()) return;

        try {
            const res = await profileApi.updateProfile(formData);
            if (res.data?.responseCode === 200) {
                showMessage(res.data?.responseMessage || 'Profile Updated Successfully', 'success');
            } else {
                showMessage(res.data?.responseMessage || 'Update Failed', 'error');
            }

        } catch (error) {
            showMessage('Update Failed', 'error');
        }
    };

    const handleBankSubmit = async (e) => {
        e.preventDefault();
        if (!validateBank()) return;

        try {
            const bankData = {
                bankName: formData.bankName,
                branchLocation: formData.branchLocation,
                routingNumber: formData.routingNumber,
                accountHolderName: formData.accountHolderName,
                accountNumber: formData.accountNumber
            };

            let res;
            if (hasBankDetails) {
                res = await bankApi.editBankDetails(bankData);
            } else {
                res = await bankApi.addBankDetails(bankData);
            }


            if (res.data?.responseCode === 200) {
                setHasBankDetails(true);
                showMessage(res.data?.responseMessage || 'Bank Details Saved Successfully', 'success');
            } else {
                showMessage(res.data?.responseMessage || 'Failed to save bank details', 'error');
            }
        } catch (error) {
            showMessage('Failed to save bank details', 'error');
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
                                {formData.txProfilePic ? (
                                    <img 
                                        src={getImageUrl(formData.txProfilePic)} 
                                        alt="Profile" 
                                        style={{ width: '100%', height: '100%', objectFit: 'cover', borderRadius: '50%' }} 
                                    />
                                ) : (
                                    <span className="avatar-icon">👤</span>
                                )}
                            </div>
                            <input 
                                type="file" 
                                ref={fileInputRef} 
                                onChange={handlePhotoSelect} 
                                accept="image/*" 
                                style={{ display: 'none' }} 
                            />
                            <button type="button" className="change-photo-btn" onClick={() => fileInputRef.current?.click()}>
                                Change Photo
                            </button>
                        </div>

                        <form className="account-form" onSubmit={handleSubmit}>
                            <div className="form-row">
                                <div className="form-group half">
                                    <label>First Name</label>
                                    <input type="text" name="firstName" value={formData.firstName} onChange={handleChange} />
                                    {errors.firstName && <span style={{ color: 'red', fontSize: '12px', marginTop: '4px' }}>{errors.firstName}</span>}
                                </div>
                                <div className="form-group half">
                                    <label>Last Name</label>
                                    <input type="text" name="lastName" value={formData.lastName} onChange={handleChange} />
                                    {errors.lastName && <span style={{ color: 'red', fontSize: '12px', marginTop: '4px' }}>{errors.lastName}</span>}
                                </div>
                            </div>

                            <div className="form-group">
                                <label>Email</label>
                                <input type="email" name="email" value={formData.email} onChange={handleChange} />
                                {errors.email && <span style={{ color: 'red', fontSize: '12px', marginTop: '4px' }}>{errors.email}</span>}
                            </div>

                            <div className="form-group address-group">
                                <label>Street Address</label>
                                <div className="input-with-icon">
                                    <input type="text" name="streetAddress" value={formData.streetAddress} onChange={handleChange} />
                                    <span className="location-icon">📍</span>
                                </div>
                                {errors.streetAddress && <span style={{ color: 'red', fontSize: '12px', marginTop: '4px' }}>{errors.streetAddress}</span>}
                            </div>

                            <div className="form-row">
                                <div className="form-group half">
                                    <label>Zip Code</label>
                                    <input type="text" name="zipCode" value={formData.zipCode} onChange={handleChange} />
                                    {errors.zipCode && <span style={{ color: 'red', fontSize: '12px', marginTop: '4px' }}>{errors.zipCode}</span>}
                                </div>
                                <div className="form-group half">
                                    <label>Gender</label>
                                    <select name="gender" value={formData.gender} onChange={handleChange}>
                                        <option value="">Select</option>
                                        <option value="Male">Male</option>
                                        <option value="Female">Female</option>
                                        <option value="Other">Other</option>
                                    </select>
                                    {errors.gender && <span style={{ color: 'red', fontSize: '12px', marginTop: '4px' }}>{errors.gender}</span>}
                                </div>
                            </div>

                            <div className="form-row">
                                <div className="form-group half">
                                    <label>DOB</label>
                                    <input type="date" name="dob" value={formData.dob} onChange={handleChange} />
                                    {errors.dob && <span style={{ color: 'red', fontSize: '12px', marginTop: '4px' }}>{errors.dob}</span>}
                                </div>
                                <div className="form-group half">
                                    <label>Radius</label>
                                    <input type="text" name="radius" value={formData.radius} onChange={handleChange} />
                                    {errors.radius && <span style={{ color: 'red', fontSize: '12px', marginTop: '4px' }}>{errors.radius}</span>}
                                </div>
                            </div>

                            <div className="form-group phone-group">
                                <label>Mobile Number</label>
                                <div className="phone-input-container">
                                    <span className="country-code">+1</span>
                                    <span className="phone-display">{formData.mobileNumber}</span>
                                    <button
                                        type="button"
                                        className="change-link"
                                        onClick={() => navigate('/dashboard/profile/change-mobile')}
                                    >
                                        Change
                                    </button>
                                </div>
                            </div>

                            <div className="form-group">
                                <label>Social Security number</label>
                                <input type="text" name="ssn" value={formData.ssn} onChange={handleChange} />
                                {errors.ssn && <span style={{ color: 'red', fontSize: '12px', marginTop: '4px' }}>{errors.ssn}</span>}
                            </div>

                            <button type="submit" className="update-btn">Update</button>
                        </form>
                    </div>
                ) : (
                    <div className="bank-details">
                        {bankLoading ? (
                            <div style={{ padding: '20px', textAlign: 'center' }}>Loading bank details...</div>
                        ) : (
                            <form className="account-form" onSubmit={handleBankSubmit}>
                                <div className="form-group">
                                    <label>Bank Name</label>
                                    <input type="text" name="bankName" value={formData.bankName} onChange={handleChange} />
                                    {errors.bankName && <span style={{ color: 'red', fontSize: '12px', marginTop: '4px' }}>{errors.bankName}</span>}
                                </div>

                                <div className="form-group">
                                    <label>Branch Location</label>
                                    <input type="text" name="branchLocation" value={formData.branchLocation} onChange={handleChange} />
                                    {errors.branchLocation && <span style={{ color: 'red', fontSize: '12px', marginTop: '4px' }}>{errors.branchLocation}</span>}
                                </div>

                                <div className="form-group">
                                    <label>Bank Routing Number</label>
                                    <input type="text" name="routingNumber" value={formData.routingNumber} onChange={handleChange} />
                                    {errors.routingNumber && <span style={{ color: 'red', fontSize: '12px', marginTop: '4px' }}>{errors.routingNumber}</span>}
                                </div>

                                <div className="form-group">
                                    <label>Account Holder's Name</label>
                                    <input type="text" name="accountHolderName" value={formData.accountHolderName} onChange={handleChange} />
                                    {errors.accountHolderName && <span style={{ color: 'red', fontSize: '12px', marginTop: '4px' }}>{errors.accountHolderName}</span>}
                                </div>

                                <div className="form-group">
                                    <label>Account Number</label>
                                    <input type="text" name="accountNumber" value={formData.accountNumber} onChange={handleChange} />
                                    {errors.accountNumber && <span style={{ color: 'red', fontSize: '12px', marginTop: '4px' }}>{errors.accountNumber}</span>}
                                </div>

                                <button type="submit" className="update-btn">
                                    {hasBankDetails ? 'Update' : 'Save'}
                                </button>
                            </form>
                        )}
                    </div>
                )}
            </div>
        </div>
    );
}
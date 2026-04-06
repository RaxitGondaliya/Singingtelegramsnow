import React, { useState, useEffect } from 'react';
import './GlobalLoader.scss';

const GlobalLoader = () => {
    const [isLoading, setIsLoading] = useState(false);

    useEffect(() => {
        const handleShowLoader = () => setIsLoading(true);
        const handleHideLoader = () => setIsLoading(false);

        window.addEventListener('apiLoadStart', handleShowLoader);
        window.addEventListener('apiLoadEnd', handleHideLoader);

        return () => {
            window.removeEventListener('apiLoadStart', handleShowLoader);
            window.removeEventListener('apiLoadEnd', handleHideLoader);
        };
    }, []);

    if (!isLoading) return null;

    return (
        <div className="global-loader-overlay">
            <div className="spinner"></div>
        </div>
    );
};

export default GlobalLoader;

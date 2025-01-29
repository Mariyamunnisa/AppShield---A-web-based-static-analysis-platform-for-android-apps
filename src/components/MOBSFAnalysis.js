import React from 'react';

function MOBSFAnalysis() {
    // Function to redirect to MobSF
    const redirectToMobSF = () => {
        window.open('http://127.0.0.1:8000/', '_blank'); // Open in a new tab
    };

    return (
        <div>
            <h1 onClick={redirectToMobSF} style={{ cursor: 'pointer' }}>MobSF APK Analysis</h1>
        </div>
    );
}

export default MOBSFAnalysis;

import React, { useState, useEffect } from 'react';
import { Space } from 'antd';

export const CookieConsentBar = () => {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    // Check if user has already made a choice
    const consent = localStorage.getItem('cookie-consent');
    if (!consent) {
      setIsVisible(true);
    }
  }, []);

  const handleConsent = (e, choice) => {
    e.preventDefault()
    // 'accepted' | 'declined'
    localStorage.setItem('cookie-consent', choice);
    setIsVisible(false);
    
    if (choice === 'accepted') {
      // TODO: Initialize analytics other tracking ...
    }
  };

  if (!isVisible) return null;

  return (
    <div className='c-cookieConsentBar'>
      {/* Left side: Information text */}
      <Space align="start" size="middle" style={{ flex: '1 1 300px' }}>
        <span className='p2'><i className="bi bi-shield-exclamation"></i></span>
        <p className='c-cookieConsentBar__body'>
          We use cookies to improve your experience and analyze site traffic. 
          By clicking "Accept All", you consent to our use of cookies. Read our{' '}
          <a href="/privacy-policy" target="_blank">
            Privacy Policy
          </a> for details.
        </p>
      </Space>

      {/* Right side: Action Buttons */}
      <Space 
        size="small" 
        className='c-cookieConsentBar__btns'>
        <a 
          className='c-btn c-btn--outline c-btn--outline--black'
          type="text" 
          onClick={(e) => handleConsent(e, 'declined')}
        >
          Decline
        </a>
        <a 
          className='c-btn c-btn--secondary'
          onClick={(e) => handleConsent(e, 'accepted')}
        >
          Accept All
        </a>
      </Space>
    </div>
  );
};
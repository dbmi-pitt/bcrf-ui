import React, { useState, useEffect } from 'react';
import { Space, Typography } from 'antd';

const { Text, Link } = Typography;

export const CookieConsentBar = () => {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    // Check if user has already made a choice
    const consent = localStorage.getItem('cookie-consent');
    if (!consent) {
      setIsVisible(true);
    }
  }, []);

  const handleConsent = (choice) => {
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
        <Text style={{ fontSize: '18px', lineHeight: '1.5' }}>
          We use cookies to improve your experience and analyze site traffic. 
          By clicking "Accept All", you consent to our use of cookies. Read our{' '}
          <Link href="/privacy-policy" target="_blank">
            Privacy Policy
          </Link> for details.
        </Text>
      </Space>

      {/* Right side: Action Buttons */}
      <Space 
        size="small" 
        className='c-cookieConsentBar__btns'>
        <a 
          className='c-btn c-btn--primary'
          type="text" 
          onClick={() => handleConsent('declined')}
        >
          Decline
        </a>
        <a 
          className='c-btn c-btn--secondary'
          onClick={() => handleConsent('accepted')}
        >
          Accept All
        </a>
      </Space>
    </div>
  );
};
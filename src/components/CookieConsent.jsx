'use client';

import { useEffect } from 'react';
import * as CookieConsent from 'vanilla-cookieconsent';

export default function CookieConsentBanner() {
  useEffect(() => {
    CookieConsent.run({
      guiOptions: {
        consentModal: {
          layout: 'box wide',
          position: 'bottom left',
          equalWeightButtons: false,
          flipButtons: false,
        },
        preferencesModal: {
          layout: 'bar',
          position: 'right',
          equalWeightButtons: false,
          flipButtons: false,
        },
      },
      categories: {
        necessary: {
          readOnly: true,
        },
        functionality: {},
        analytics: {},
      },
      language: {
        default: 'en',
        autoDetect: 'browser',
        translations: {
          en: {
            consentModal: {
              title: "Hello traveller, it's cookie time!",
              description:
                'We use cookies to make this website work, to understand how it is used and to show you relevant ads.',
              acceptAllBtn: 'Accept all',
              acceptNecessaryBtn: 'Reject all',
              showPreferencesBtn: 'Manage preferences',
              footer:
                '<a href="#link">Privacy Policy</a>\n<a href="#link">Terms and conditions</a>',
            },
            preferencesModal: {
              title: 'Consent Preferences Center',
              acceptAllBtn: 'Accept all',
              acceptNecessaryBtn: 'Reject all',
              savePreferencesBtn: 'Save preferences',
              closeIconLabel: 'Close modal',
              serviceCounterLabel: 'Service|Services',
              sections: [
                {
                  title: 'Cookie Usage',
                  description:
                    'We use cookies to make this website work and to improve your experience. You can choose which categories to allow below and change your choice at any time. For more details, read our <a href="#link" class="cc__link">Privacy Policy</a>.',
                },
                {
                  title:
                    'Strictly Necessary Cookies <span class="pm__badge">Always Enabled</span>',
                  description:
                    'These cookies are essential for the website to work properly, for example to keep you signed in or to remember your cookie preferences. They cannot be disabled.',
                  linkedCategory: 'necessary',
                },
                {
                  title: 'Functionality Cookies',
                  description:
                    'These cookies remember your choices, such as your language or region, to give you a more personal experience. Disabling them may break some features.',
                  linkedCategory: 'functionality',
                },
                {
                  title: 'Analytics Cookies',
                  description:
                    'These cookies collect anonymous information about how visitors use the website, such as the pages visited and the time spent on them, so we can improve it.',
                  linkedCategory: 'analytics',
                },
                {
                  title: 'More information',
                  description:
                    'If you have any questions about our cookie policy or your choices, please <a class="cc__link" href="#yourdomain.com">contact us</a>.',
                },
              ],
            },
          },
        },
      },
    });
  }, []);

  return null;
}

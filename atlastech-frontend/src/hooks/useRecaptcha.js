import { useEffect, useState } from 'react';
import toast from 'react-hot-toast';

/**
 * Hook custom pour charger et gérer Google reCAPTCHA v2
 * @param {string} containerId - L'ID du container HTML où rendre le widget
 * @returns {boolean} - True quand le reCAPTCHA est prêt
 */
export const useRecaptcha = (containerId) => {
  const [isReady, setIsReady] = useState(false);
  const siteKey = '6LeAd38sAAAAAFtP24L1PuL4uWaHV2k0tLve6-qI';

  useEffect(() => {
    // Check if script already loaded globally
    if (window.grecaptcha && window.grecaptchaLoaded) {
      // Script exists, just render the widget
      renderWidget();
      return;
    }

    // Check if script tag already exists
    if (document.getElementById('recaptcha-script')) {
      // Script being loaded, wait for it
      window.grecaptcha?.ready(() => {
        renderWidget();
      });
      return;
    }

    // Load the script for the first time
    const script = document.createElement('script');
    script.id = 'recaptcha-script';
    script.src = 'https://www.google.com/recaptcha/api.js';
    script.async = true;
    script.defer = true;

    script.onload = () => {
      window.grecaptchaLoaded = true;
      console.log('✅ Google reCAPTCHA script loaded');
      
      // Wait for grecaptcha API to be ready, then render
      if (window.grecaptcha) {
        window.grecaptcha.ready(() => {
          console.log('✅ grecaptcha API ready, rendering widget...');
          renderWidget();
        });
      }
    };

    script.onerror = (error) => {
      console.error('❌ Failed to load reCAPTCHA script:', error);
      toast.error('Failed to load reCAPTCHA. Please refresh the page.');
      setIsReady(false);
    };

    document.head.appendChild(script);

    return () => {
      // Cleanup - keep script loaded for other components
    };
  }, []);

  const renderWidget = () => {
    // Give DOM time to render
    setTimeout(() => {
      try {
        const container = document.getElementById(containerId);
        
        if (!container) {
          console.error(`❌ Container #${containerId} not found in DOM`);
          return;
        }

        // Check if already rendered
        if (container.querySelector('iframe')) {
          console.log('✅ reCAPTCHA widget already rendered');
          setIsReady(true);
          return;
        }

        console.log(`✅ Rendering reCAPTCHA in container #${containerId}`);
        
        if (window.grecaptcha) {
          window.grecaptcha.render(containerId, {
            sitekey: siteKey,
            theme: 'light',
            type: 'image',
          });
          
          console.log('✅ reCAPTCHA widget rendered successfully');
          
          // Verify token availability (should be empty until user checks the box)
          const token = window.grecaptcha.getResponse();
          console.log('ℹ️ Widget ready. Token available:', !!token ? '✅ Yes' : '❌ No (waiting for user to check box)');
          
          setIsReady(true);
        } else {
          console.error('❌ window.grecaptcha is not available');
        }
      } catch (error) {
        console.error('❌ Error rendering reCAPTCHA:', error);
        toast.error('Failed to render reCAPTCHA. Please refresh.');
      }
    }, 500); // Increased from 200ms to 500ms for slower network connections
  };

  return isReady;
};

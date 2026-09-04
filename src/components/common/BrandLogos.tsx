import React from 'react';

interface BrandLogoProps {
  className?: string;
  title?: string;
}

/**
 * Google Search Console Logo (Official Google Search Console / Multi-color Search Lens & Telemetry)
 */
export const GscLogo: React.FC<BrandLogoProps> = ({ className = "w-4 h-4", title = "Google Search Console" }) => (
  <svg 
    viewBox="0 0 24 24" 
    className={className} 
    fill="none" 
    xmlns="http://www.w3.org/2000/svg"
    role="img"
    aria-label={title}
  >
    <title>{title}</title>
    {/* Blue base shape */}
    <path 
      d="M12 2C6.48 2 2 6.48 2 12C2 17.52 6.48 22 12 22C17.52 22 22 17.52 22 12C22 6.48 17.52 2 12 2Z" 
      fill="#4285F4" 
    />
    {/* Search Lens Ring */}
    <path 
      d="M11 6.5C8.51 6.5 6.5 8.51 6.5 11C6.5 13.49 8.51 15.5 11 15.5C12.06 15.5 13.03 15.13 13.79 14.51L16.64 17.36C16.83 17.55 17.15 17.55 17.35 17.35C17.54 17.16 17.54 16.84 17.35 16.65L14.5 13.8C15.13 13.04 15.5 12.06 15.5 11C15.5 8.51 13.49 6.5 11 6.5ZM11 8C12.66 8 14 9.34 14 11C14 12.66 12.66 14 11 14C9.34 14 8 12.66 8 11C8 9.34 9.34 8 11 8Z" 
      fill="#FFFFFF" 
    />
    {/* Analytics Graph Bars inside lens */}
    <rect x="9.2" y="11.2" width="1.1" height="2" rx="0.3" fill="#FBBC05" />
    <rect x="10.7" y="9.8" width="1.1" height="3.4" rx="0.3" fill="#34A853" />
    <rect x="12.2" y="10.5" width="1.1" height="2.7" rx="0.3" fill="#EA4335" />
  </svg>
);

/**
 * Google Analytics 4 (GA4) Logo (Official GA4 Gradient Orange Bar Pillars)
 */
export const Ga4Logo: React.FC<BrandLogoProps> = ({ className = "w-4 h-4", title = "Google Analytics 4" }) => (
  <svg 
    viewBox="0 0 24 24" 
    className={className} 
    fill="none" 
    xmlns="http://www.w3.org/2000/svg"
    role="img"
    aria-label={title}
  >
    <title>{title}</title>
    {/* Background rounded squircle */}
    <rect width="24" height="24" rx="5" fill="#F9AB00" />
    {/* Primary Orange Analytics Pillars */}
    <rect x="15" y="4" width="4.5" height="16" rx="2.25" fill="#E37400" />
    <rect x="9.75" y="9" width="4.5" height="11" rx="2.25" fill="#FFFFFF" />
    <circle cx="6.5" cy="17.75" r="2.25" fill="#FFFFFF" />
  </svg>
);

/**
 * WordPress Logo (Official WordPress 'W' circular logo)
 */
export const WordpressLogo: React.FC<BrandLogoProps> = ({ className = "w-4 h-4", title = "WordPress" }) => (
  <svg 
    viewBox="0 0 24 24" 
    className={className} 
    fill="none" 
    xmlns="http://www.w3.org/2000/svg"
    role="img"
    aria-label={title}
  >
    <title>{title}</title>
    <path 
      d="M12 2C6.48 2 2 6.48 2 12C2 17.52 6.48 22 12 22C17.52 22 22 17.52 22 12C22 6.48 17.52 2 12 2Z" 
      fill="#21759B" 
    />
    <path 
      d="M3.15 12C3.15 15.35 4.97 18.27 7.64 19.82L4.32 10.72C3.57 11.11 3.15 11.53 3.15 12ZM16.89 11.45C16.89 10.33 16.49 9.55 16.15 8.94C15.7 8.16 15.26 7.49 15.26 6.71C15.26 5.82 15.93 5 17.1 5C17.15 5 17.2 5.01 17.26 5.01C15.79 3.76 13.97 3 12 3C9.48 3 7.21 4.23 5.8 6.13C6.18 6.15 6.72 6.15 7.34 6.15C8.4 6.15 10.03 6.02 10.03 6.02C10.51 5.97 10.56 6.64 10.08 6.72C10.08 6.72 9.44 6.8 8.72 6.84L12.44 17.89L14.67 11.19L13.08 6.84C12.42 6.8 11.83 6.72 11.83 6.72C11.35 6.64 11.4 5.97 11.88 6.02C11.88 6.02 13.51 6.15 14.52 6.15C15.58 6.15 17.21 6.02 17.21 6.02C17.69 5.97 17.74 6.64 17.26 6.72C17.26 6.72 16.62 6.8 15.91 6.84L19.58 17.72C20.37 16.03 20.85 14.1 20.85 12C20.85 9.77 20.08 7.72 18.79 6.09C18.82 6.3 18.84 6.52 18.84 6.76C18.84 7.82 18.62 8.94 18.17 10.06L16.89 11.45ZM12.19 13.09L9.43 21.09C10.25 21.34 11.11 21.48 12 21.48C12.8 21.48 13.57 21.36 14.31 21.14L12.19 13.09Z" 
      fill="#FFFFFF" 
    />
  </svg>
);

/**
 * Microsoft Bing / Bing Webmaster Tools Logo (Official Bing 'b' Emblem)
 */
export const BingLogo: React.FC<BrandLogoProps> = ({ className = "w-4 h-4", title = "Microsoft Bing Webmaster" }) => (
  <svg 
    viewBox="0 0 24 24" 
    className={className} 
    fill="none" 
    xmlns="http://www.w3.org/2000/svg"
    role="img"
    aria-label={title}
  >
    <title>{title}</title>
    {/* Teal-blue square background */}
    <rect width="24" height="24" rx="5" fill="#008272" />
    {/* Geometric modern Bing 'b' symbol */}
    <path 
      d="M6 3.5V18.8L10.8 21.5L18 17.3V12.1L12.5 10.1L9.6 11.4V6.2L6 3.5Z" 
      fill="#FFFFFF" 
    />
    <path 
      d="M12.5 10.1L18 12.1V7.2L12.5 4.8V10.1Z" 
      fill="#29D2BF" 
    />
    <path 
      d="M10.8 14.6L14.4 16.4L10.8 18.5V14.6Z" 
      fill="#005B4F" 
    />
  </svg>
);

/**
 * PageSpeed Insights / Google Lighthouse Logo (Official Speedometer & Lighthouse Symbol)
 */
export const PageSpeedLogo: React.FC<BrandLogoProps> = ({ className = "w-4 h-4", title = "PageSpeed Insights" }) => (
  <svg 
    viewBox="0 0 24 24" 
    className={className} 
    fill="none" 
    xmlns="http://www.w3.org/2000/svg"
    role="img"
    aria-label={title}
  >
    <title>{title}</title>
    {/* Blue background pill */}
    <rect width="24" height="24" rx="5" fill="#1A73E8" />
    {/* Speedometer Arc & Ray */}
    <path 
      d="M12 4C7.58 4 4 7.58 4 12C4 13.9 4.66 15.65 5.77 17.03L12 12V6C12 4.9 12 4 12 4Z" 
      fill="#EA4335" 
    />
    <path 
      d="M12 6V12L18.23 17.03C19.34 15.65 20 13.9 20 12C20 7.58 16.42 4 12 4V6Z" 
      fill="#34A853" 
    />
    <path 
      d="M12 12L5.77 17.03C7.26 18.87 9.5 20 12 20C14.5 20 16.74 18.87 18.23 17.03L12 12Z" 
      fill="#FBBC05" 
    />
    {/* Center dial indicator */}
    <circle cx="12" cy="12" r="3.2" fill="#FFFFFF" />
    <polygon points="12,12 15,8 12.8,11.2" fill="#202124" />
  </svg>
);

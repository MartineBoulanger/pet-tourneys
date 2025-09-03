import Script from 'next/script';

export const CookieBotHeadScript = () => {
  return (
    <Script
      id='Cookiebot'
      src='https://consent.cookiebot.com/uc.js'
      data-cbid='8d3dad3f-5bc9-4903-9446-a553bd0abab4'
      data-blockingmode='auto'
      type='text/javascript'
      strategy='beforeInteractive'
    />
  );
};

export const CookieBotBodyScript = () => {
  return (
    <script
      id='CookieDeclaration'
      src='https://consent.cookiebot.com/YOUR-DOMAIN-GROUP-ID/cd.js'
      type='text/javascript'
      async
    />
  );
};

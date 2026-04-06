import React from 'react';
import './Footer.css';

const Footer = () => {
  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <footer className="footer">
      <div className="container">
        <div className="footer-top">
          <div className="social-links">
            <svg width="24" height="24" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M18.896 0H1.104C0.494 0 0 0.494 0 1.104V18.896C0 19.506 0.494 20 1.104 20H10.682V12.255H8.076V9.237H10.682V7.01C10.682 4.426 12.26 3.02 14.565 3.02C15.669 3.02 16.617 3.102 16.894 3.139V5.839H15.296C14.042 5.839 13.8 6.435 13.8 7.309V9.236H16.789L16.399 12.254H13.799V20H18.896C19.506 20 20 19.506 20 18.896V1.104C20 0.494 19.506 0 18.896 0Z" fill="#CCCCCC" />
            </svg>
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M20.3619 7.75881C20.2635 15.1787 15.5187 20.2609 8.43573 20.5801C5.51482 20.7138 3.39872 19.7703 1.55713 18.6004C3.71595 18.9449 6.39288 18.082 7.82456 16.8564C5.70846 16.6506 4.45559 15.5735 3.86936 13.8401C4.48083 13.9458 5.12502 13.9177 5.70594 13.7947C3.79642 13.1555 2.43283 11.9753 2.36238 9.50232C2.89823 9.74628 3.45684 9.97561 4.19896 10.0208C2.7699 9.20797 1.71319 6.23654 2.92347 4.27166C5.04442 6.59639 7.59567 8.49344 11.7849 8.75007C10.7331 4.25404 16.6911 1.81597 19.1846 4.83775C20.2387 4.63383 21.0967 4.23391 21.922 3.79863C21.5823 4.84273 20.9281 5.57239 20.1307 6.1561C21.0061 6.03792 21.7809 5.82401 22.4429 5.49693C22.0323 6.34988 21.1344 7.11476 20.3619 7.75881Z" fill="#CCCCCC" />
            </svg>
            <svg width="24" height="24" viewBox="0 0 21 15" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M20.05 2.25C20.2 2.90002 20.35 3.95002 20.4 5.30002L20.45 7.15001V9.10001C20.4 10.5 20.25 11.55 20.1 12.2C20 12.6 19.75 13 19.45 13.3C19.15 13.6 18.75 13.85 18.3 13.95C17.65 14.1 16.15 14.25 13.75 14.35L10.25 14.4L6.84999 14.35C4.44999 14.25 2.94998 14.15 2.29999 13.95C1.84999 13.85 1.44998 13.6 1.14998 13.3C0.75 13 0.549984 12.6 0.399984 12.2C0.249984 11.5 0.0999845 10.5 0.0499923 9.10001L0 7.25002C0 6.70001 7.82311e-08 6.10001 0.0499923 5.4C0.0999845 4.05 0.249984 3 0.399984 2.35001C0.549984 1.8 0.75 1.40002 1.09999 1.10002C1.44998 0.800016 1.8 0.550008 2.25 0.400008C2.89999 0.250008 4.39999 0.100008 6.79999 0.0500157L10.25 0L13.65 0.0500157C16.05 0.100008 17.6 0.250008 18.25 0.400008C18.7 0.500016 19.1 0.75 19.4 1.05C19.7 1.40002 19.95 1.8 20.05 2.25ZM8.14999 10.3L13.5 7.25002L8.14999 4.2V10.3Z" fill="#CCCCCC" />
            </svg>
          </div>
          <button className="back-to-top" onClick={scrollToTop}>
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="m18 15-6-6-6 6"/>
            </svg>
          </button>
        </div>

        <div className="footer-columns">
          <div className="footer-col">
            <span className="col-title">Resource</span>
            <a href="#">Creator Support</a>
            <a href="#">Published On Epic</a>
            <a href="#">Profession</a>
            <a href="#">Company</a>
          </div>
          <div className="footer-col spacer">
            <a href="#">Fan Work Policy</a>
            <a href="#">User Exp Service</a>
            <a href="#">User Liscence</a>
          </div>
          <div className="footer-col spacer">
            <a href="#">Online Service</a>
            <a href="#">Community</a>
            <a href="#">Epic Newsroom</a>
          </div>
          <div className="footer-col spacer">
            <a href="#">Battle Breakers</a>
            <a href="#">Fortnite</a>
            <a href="#">Infinity Blade</a>
          </div>
          <div className="footer-col spacer">
            <a href="#">Robo Recall</a>
            <a href="#">Shadow Complex</a>
            <a href="#">Unreal Tournament</a>
          </div>
        </div>

        <div className="footer-copyright">
          <p>
            © 2022, Epic Games, Inc. All rights reserved. Epic, Epic Games, Epic Games logo, Fortnite, Fortnite logo, Unreal, Unreal Engine,
            Unreal Engine logo, Unreal Tournament ) and the Unreal Tournament logo are trademarks or registered trademarks of Epic
            Games, Inc. in the United States of America and elsewhere. Other brand or product names are trademarks of their respective
            owners. Transactions outside the United States are handled through Epic Games International, S.à r.l..
          </p>
        </div>

        <div className="footer-bottom">
          <div className="bottom-links">
            <a href="#">Terms of Service</a>
            <a href="#">Privacy Policy</a>
            <a href="#">Store Refund Policy</a>
          </div>
          <div className="epic-logo-small">
            <svg width="32" height="32" viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M16 0L1.6 4.8V22.4L16 32L30.4 22.4V4.8L16 0ZM16 3.2L27.2 6.4V20.8L16 28.8L4.8 20.8V6.4L16 3.2Z" fill="white"/>
              <path d="M14.4 9.6H17.6V22.4H14.4V9.6Z" fill="white"/>
            </svg>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;

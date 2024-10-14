// ==UserScript==
// @name         Safeway Coupon Auto-clipper
// @icon         https://www.safeway.com/favicon.ico
// @namespace    https://github.com/NeurekaSoftware/Safeway-Coupon-Auto-Clipper
// @version      1.0.2
// @description  A Violentmonkey userscript that will automatically clip your Just For U coupons for Safeway.
// @author       Douglas Parker
// @downloadURL  https://raw.githubusercontent.com/NeurekaSoftware/Safeway-Coupon-Auto-Clipper/main/auto-clipper.user.js
// @supportURL   https://github.com/NeurekaSoftware/Safeway-Coupon-Auto-Clipper/issues
// @match        https://www.safeway.com/foru/coupons-deals.html
// @run-at       document-idle
// @grant        none
// ==/UserScript==

(function() {
    'use strict';

    const STARTUP_DELAY      = 5000;
    const ACTION_DELAY       = 1000;
    const DISPLAY_STATISTICS = true;

    let totalCouponsClipped  = 0;
    let totalCouponsExpired  = 0;
    let couponsLoaded        = false;
    let couponsClipped       = false;
    let statisticsSent       = false;

    setTimeout(function() {

        setInterval(function() {
            if(!couponsLoaded) {
                loadCoupons();
            } else if(!couponsClipped) {
                clipCoupons();
            }
            else if(DISPLAY_STATISTICS && !statisticsSent) {
                alert(`Safeway Coupon Auto-clipper\n\nCoupons Clipped: ${totalCouponsClipped + totalCouponsExpired}`);
                statisticsSent = true;
            }
    
        }, ACTION_DELAY);

    }, STARTUP_DELAY);

    function loadCoupons() {
        let loadMoreButton = document.querySelector('.btn.load-more');
        if(loadMoreButton) {
            loadMoreButton.click();

            // Scroll to bottom of page
            let footer = document.querySelector('footer');
            footer.scrollIntoView({ behavior: 'smooth'});
        }
        else {
            couponsLoaded = true;
        }
    }

    function clipCoupons() {
        let coupon = document.querySelector('[id^="couponAddBtn"]');
        if(coupon) {
            coupon.click();
            checkExpiredCoupon(coupon);

            // Scroll to next element
            coupon = document.querySelector('[id^="couponAddBtn"]');
            if(coupon) coupon.scrollIntoView({ behavior: 'smooth'});
        }
        else {
            couponsClipped = true;
        }
    }

    function checkExpiredCoupon(coupon) {
        const expiredCoupon = document.querySelector('[id="errorModal"] [class="btn btn-default btn-modal"]');
        if(expiredCoupon) {
            expiredCoupon.click();
            coupon.parentNode.parentNode.parentNode.parentNode.parentNode.parentNode.remove();
            totalCouponsExpired++;
        }
        else {
            totalCouponsClipped++;
        }
    }
})();

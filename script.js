/* Pooya Malek · core config, loaded before paint */

// Single source of truth for the booking link. When moving off Cal.com to a
// custom booking/payment flow, change this one value and every
// [data-booking-link] element updates, both its href (fallback, open-in-new-tab)
// and the sheet it opens.
var BOOKING_URL = 'https://cal.com/pooya-malek';

// Applies BOOKING_URL to every [data-booking-link] element under root (defaults
// to the whole document) and wires it to open the booking sheet. Call again
// after injecting new markup dynamically, e.g. from assessment.js after
// rendering the result.
function applyBookingLinks(root) {
  (root || document).querySelectorAll('[data-booking-link]').forEach(function (a) {
    a.href = BOOKING_URL;
    a.addEventListener('click', function (e) {
      if (window.AppShell && window.AppShell.openBookingSheet) {
        e.preventDefault();
        window.AppShell.openBookingSheet();
      }
    });
  });
}

try { localStorage.removeItem('pm-theme'); } catch (e) {}

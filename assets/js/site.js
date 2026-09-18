/* ===========================================================================
   AD Housing Services — site behaviour
   ---------------------------------------------------------------------------
   Loaded with `defer`, after gsap.min.js and ScrollTrigger.min.js.

   Design rule enforced here: nothing in this file may delay, cover or intercept
   the phone call. Animation is layered on top of a page that already works, and
   every entry point degrades to "content is visible" if GSAP fails to load or
   the visitor prefers reduced motion.
   =========================================================================== */
(function () {
  "use strict";

  var root = document.documentElement;
  var CONSENT_KEY = "adhs-consent";

  var hasGsap = typeof window.gsap !== "undefined";
  var reduceMotion =
    window.matchMedia && window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  var animate = hasGsap && !reduceMotion;

  if (hasGsap && window.ScrollTrigger) {
    gsap.registerPlugin(ScrollTrigger);
  }

  /* =========================================================================
   * Sticky call bar
   *
   * Measured rather than hard-coded: its real height is published as
   * --callbar-h so the page reserves exactly that much bottom padding and the
   * consent banner can sit directly on top of it instead of over it.
   * ====================================================================== */
  function initCallBar() {
    var bar = document.querySelector("[data-callbar]");
    if (!bar) return;

    var publishHeight = function () {
      var desktop = window.matchMedia("(min-width: 900px)").matches;
      var h = desktop ? 0 : bar.offsetHeight;
      root.style.setProperty("--callbar-h", h + "px");
    };

    // Reveal immediately — a visitor arriving from a mobile ad should never
    // have to scroll to find the call button.
    requestAnimationFrame(function () {
      bar.classList.add("is-in");
      publishHeight();
      if (window.ScrollTrigger) ScrollTrigger.refresh();
    });

    var resizeTimer;
    window.addEventListener("resize", function () {
      clearTimeout(resizeTimer);
      resizeTimer = setTimeout(publishHeight, 150);
    }, { passive: true });
  }

  /* =========================================================================
   * Header shadow once the page has moved
   * ====================================================================== */
  function initHeader() {
    var head = document.querySelector("[data-masthead]");
    if (!head) return;

    var apply = function () {
      head.classList.toggle("is-stuck", window.scrollY > 8);
    };
    apply();
    window.addEventListener("scroll", apply, { passive: true });
  }

  /* =========================================================================
   * Mobile drawer
   *
   * Closed state carries `inert`, so its links leave the tab order and the
   * accessibility tree together.
   * ====================================================================== */
  function initDrawer() {
    var button = document.querySelector("[data-navtoggle]");
    var drawer = document.querySelector("[data-drawer]");
    if (!button || !drawer) return;

    var setOpen = function (open) {
      drawer.classList.toggle("is-open", open);
      button.setAttribute("aria-expanded", open ? "true" : "false");
      button.setAttribute("aria-label", open ? "Close navigation" : "Open navigation");
      if (open) {
        drawer.removeAttribute("inert");
        drawer.removeAttribute("aria-hidden");
      } else {
        drawer.setAttribute("inert", "");
        drawer.setAttribute("aria-hidden", "true");
      }
    };

    var isOpen = function () {
      return button.getAttribute("aria-expanded") === "true";
    };

    button.addEventListener("click", function () { setOpen(!isOpen()); });

    drawer.addEventListener("click", function (e) {
      if (e.target.closest("a")) setOpen(false);
    });

    document.addEventListener("keydown", function (e) {
      if (e.key === "Escape" && isOpen()) { setOpen(false); button.focus(); }
    });

    if (window.matchMedia) {
      var desktop = window.matchMedia("(min-width: 900px)");
      var onChange = function (e) { if (e.matches && isOpen()) setOpen(false); };
      if (desktop.addEventListener) desktop.addEventListener("change", onChange);
      else if (desktop.addListener) desktop.addListener(onChange);
    }
  }

  /* =========================================================================
   * Scroll reveals
   *
   * The pre-animation state lives in CSS behind `.js-motion`, which is only
   * added once we know GSAP is present and motion is wanted. Without that
   * class every [data-anim] element renders at full opacity, so a failed CDN,
   * a blocked script or reduced-motion all land on "everything is visible".
   * ====================================================================== */
  function initReveals() {
    var nodes = Array.prototype.slice.call(document.querySelectorAll("[data-anim]"));
    if (!nodes.length) return;

    if (!animate) {
      nodes.forEach(function (n) { n.classList.add("is-shown"); });
      return;
    }

    root.classList.add("js-motion");

    var from = {
      rise:  { y: 22, opacity: 0 },
      fade:  { opacity: 0 },
      left:  { x: -22, opacity: 0 },
      right: { x: 22, opacity: 0 },
      scale: { scale: 0.96, opacity: 0 }
    };

    // Group siblings that share a [data-anim-group] parent so they stagger
    // together instead of each firing its own ScrollTrigger.
    var groups = Array.prototype.slice.call(document.querySelectorAll("[data-anim-group]"));
    var grouped = new Set();

    groups.forEach(function (group) {
      var items = Array.prototype.slice.call(group.querySelectorAll("[data-anim]"));
      if (!items.length) return;
      items.forEach(function (i) { grouped.add(i); });

      gsap.to(items, {
        opacity: 1, x: 0, y: 0, scale: 1,
        duration: 0.62,
        ease: "power2.out",
        stagger: 0.08,
        scrollTrigger: { trigger: group, start: "top 88%", once: true }
      });
    });

    nodes.filter(function (n) { return !grouped.has(n); }).forEach(function (node) {
      var kind = node.getAttribute("data-anim") || "rise";
      var delay = parseFloat(node.getAttribute("data-anim-delay") || "0");

      gsap.fromTo(node, from[kind] || from.rise, {
        opacity: 1, x: 0, y: 0, scale: 1,
        duration: 0.6,
        delay: delay,
        ease: "power2.out",
        scrollTrigger: { trigger: node, start: "top 90%", once: true }
      });
    });
  }

  /* =========================================================================
   * Hero parallax — background layers only, never text, and never on mobile
   * where it costs scroll performance for no real gain.
   * ====================================================================== */
  function initParallax() {
    if (!animate || !window.ScrollTrigger) return;
    if (!window.matchMedia("(min-width: 900px)").matches) return;

    gsap.utils.toArray("[data-parallax]").forEach(function (layer) {
      gsap.to(layer, {
        yPercent: 12,
        ease: "none",
        scrollTrigger: {
          trigger: layer.closest("section") || layer.parentElement,
          start: "top top",
          end: "bottom top",
          scrub: 0.6
        }
      });
    });
  }

  /* =========================================================================
   * FAQ accordion — one open at a time, first open on load
   * ====================================================================== */
  function initFaq() {
    document.querySelectorAll("[data-faq]").forEach(function (list) {
      var items = Array.prototype.slice.call(list.querySelectorAll("[data-faq-item]"));

      var setState = function (item, open, instant) {
        var button = item.querySelector("[data-faq-q]");
        var panel = item.querySelector("[data-faq-a]");
        if (!button || !panel) return;

        button.setAttribute("aria-expanded", open ? "true" : "false");

        if (open) panel.hidden = false;

        if (animate && !instant) {
          gsap.to(panel, {
            height: open ? "auto" : 0,
            duration: 0.36,
            ease: open ? "power2.out" : "power2.in",
            onComplete: function () {
              if (!open) panel.hidden = true;
              else gsap.set(panel, { height: "auto" });
              if (window.ScrollTrigger) ScrollTrigger.refresh();
            }
          });
        } else {
          panel.style.height = open ? "auto" : "";
          if (!open) panel.hidden = true;
        }
      };

      items.forEach(function (item, index) {
        var button = item.querySelector("[data-faq-q]");
        if (!button) return;

        setState(item, index === 0, true);

        button.addEventListener("click", function () {
          var willOpen = button.getAttribute("aria-expanded") !== "true";
          items.forEach(function (other) { setState(other, other === item && willOpen); });
        });
      });
    });
  }

  /* =========================================================================
   * Phone-click tracking
   *
   * One delegated listener covers every tel: link on the page. Pushes the same
   * `phone_click` event shape the site has always used, so an existing Google
   * Ads or GTM conversion trigger keeps working untouched.
   *
   * The handler does no preventDefault and no async work — the dial intent
   * fires exactly as it would on a bare <a href="tel:">.
   * ====================================================================== */
  function initPhoneTracking() {
    document.addEventListener("click", function (e) {
      var link = e.target.closest("[data-phone-link]");
      if (!link) return;

      // Someone who has already started a call should not then be interrupted
      // by a dialog asking them to call.
      callAlreadyStarted = true;

      /* The dataLayer push and the Ads conversion are fired by the inline
         bootstrap in <head>, which is already listening in the capture phase —
         it exists so taps landing before this bundle parses are still counted.
         Pushing again here would double-count every call. */
    });
  }

  /* =========================================================================
   * Cookie consent
   *
   * A stored choice is replayed on every page load, before the banner decision
   * — otherwise a returning visitor who accepted would stay on the denied
   * default from <head> and their conversions would go unmeasured.
   * ====================================================================== */
  function updateConsent(value) {
    if (typeof window.gtag === "function") {
      window.gtag("consent", "update", {
        ad_storage: value,
        analytics_storage: value,
        ad_user_data: value,
        ad_personalization: value
      });
    }
  }

  function readStored() {
    try { return window.localStorage.getItem(CONSENT_KEY); }
    catch (e) { return null; }
  }

  /* The call prompt must not stack on top of the consent banner, so it waits
     for this to settle. Resolves immediately when a choice is already stored. */
  var consentSettled = false;
  var consentWaiters = [];
  var consentBanner = null;
  var consentReveal = null;

  function settleConsent() {
    if (consentSettled) return;
    consentSettled = true;
    consentWaiters.splice(0).forEach(function (fn) { fn(); });
  }

  function initConsent() {
    var banner = document.querySelector("[data-consent]");
    var stored = readStored();

    /* The banner is hidden, never removed. A visitor must be able to change
       their mind, and the privacy policy now promises a footer control that
       brings this back — that promise needs something to bring back. */
    function reveal() {
      banner.hidden = false;
      if (animate) {
        gsap.from(banner, { y: 16, opacity: 0, duration: 0.4, ease: "power2.out" });
      }
    }

    document.addEventListener("click", function (e) {
      var reset = e.target.closest("[data-consent-reset]");
      if (!reset || !banner) return;
      e.preventDefault();
      try { window.localStorage.removeItem(CONSENT_KEY); } catch (err) { /* fine */ }
      updateConsent("denied");
      reveal();
      var first = banner.querySelector("[data-consent-choice]");
      if (first) first.focus();
    });

    /* Published so the call prompt can take the screen for a moment and give it
       back, instead of waiting for a click that may never come. */
    consentBanner = banner;
    consentReveal = reveal;

    if (stored) {
      updateConsent(stored === "accepted" ? "granted" : "denied");
      if (banner) banner.hidden = true;
      settleConsent();
      return;
    }
    if (!banner) { settleConsent(); return; }

    reveal();

    banner.addEventListener("click", function (e) {
      var button = e.target.closest("[data-consent-choice]");
      if (!button) return;

      var choice = button.getAttribute("data-consent-choice");
      try { window.localStorage.setItem(CONSENT_KEY, choice); } catch (err) { /* session-only */ }
      updateConsent(choice === "accepted" ? "granted" : "denied");

      if (animate) {
        gsap.to(banner, {
          y: 12, opacity: 0, duration: 0.25, ease: "power2.in",
          onComplete: function () { banner.hidden = true; gsap.set(banner, { clearProps: "all" }); }
        });
      } else {
        banner.hidden = true;
      }

      settleConsent();
    });
  }

  /* =========================================================================
   * Timed call prompt
   *
   * A soft dialog that surfaces the phone number a few seconds into the page
   * view. Timing and copy come from config/site.php via data-attributes, not
   * from constants in here.
   *
   * Deliberate suppressions — an unwanted prompt costs more calls than it wins:
   *   · never while the consent banner is still unanswered (no stacked overlays)
   *   · never for a visitor who has already tapped a call link this page view
   *   · never while the mobile menu is open
   *   · optionally once per session, when config says so
   *
   * It is a real modal: focus moves into it, is trapped while open, and returns
   * to wherever it was when the prompt closes.
   * ====================================================================== */
  var callAlreadyStarted = false;

  function initCallPopup() {
    var pop = document.querySelector("[data-callpop]");
    if (!pop) return;

    var card = pop.querySelector(".callpop__card");
    var delay = parseInt(pop.getAttribute("data-delay") || "3000", 10);
    var oncePerSession = pop.getAttribute("data-once") === "1";
    var SESSION_KEY = "adhs-callpop-seen";
    var lastFocused = null;
    var isOpen = false;
    var borrowedConsent = false;

    var seenThisSession = function () {
      try { return window.sessionStorage.getItem(SESSION_KEY) === "1"; }
      catch (e) { return false; }
    };
    var markSeen = function () {
      try { window.sessionStorage.setItem(SESSION_KEY, "1"); } catch (e) { /* fine */ }
    };

    var focusables = function () {
      return Array.prototype.slice
        .call(card.querySelectorAll('a[href], button:not([disabled]), [tabindex]:not([tabindex="-1"])'))
        .filter(function (el) { return el.offsetParent !== null; });
    };

    var onKeydown = function (e) {
      if (e.key === "Escape") { close(); return; }
      if (e.key !== "Tab") return;

      var items = focusables();
      if (!items.length) return;
      var first = items[0];
      var last = items[items.length - 1];

      if (e.shiftKey && document.activeElement === first) { e.preventDefault(); last.focus(); }
      else if (!e.shiftKey && document.activeElement === last) { e.preventDefault(); first.focus(); }
    };

    function open() {
      if (isOpen || callAlreadyStarted) return;

      var drawer = document.querySelector("[data-drawer]");
      if (drawer && drawer.classList.contains("is-open")) return;

      isOpen = true;
      lastFocused = document.activeElement;

      /* If the consent banner is still on screen, tuck it away for the duration
         rather than covering it — it comes back the moment this closes, so the
         visitor still gets to make the choice. */
      if (consentBanner && !consentBanner.hidden) {
        consentBanner.hidden = true;
        borrowedConsent = true;
      }

      pop.hidden = false;
      /* Always open at the top. A card left mid-scroll from a previous open
         hides its own heading and close button. */
      card.scrollTop = 0;
      document.body.classList.add("is-locked");
      // Next frame, so the transition has a start value to animate from.
      requestAnimationFrame(function () { pop.classList.add("is-open"); });

      var target = card.querySelector("[data-callpop-close]") || card;
      if (target && target.focus) target.focus({ preventScroll: true });

      document.addEventListener("keydown", onKeydown);
      markSeen();

      window.dataLayer = window.dataLayer || [];
      window.dataLayer.push({ event: "call_prompt_shown", page_path: window.location.pathname });
    }

    function close(reason) {
      if (!isOpen) return;
      isOpen = false;

      pop.classList.remove("is-open");
      document.body.classList.remove("is-locked");
      document.removeEventListener("keydown", onKeydown);

      var finish = function () { pop.hidden = true; };
      if (reduceMotion) finish();
      else window.setTimeout(finish, 380);

      if (borrowedConsent && consentBanner && typeof consentReveal === "function") {
        borrowedConsent = false;
        consentReveal();
      }

      if (lastFocused && lastFocused.focus) lastFocused.focus({ preventScroll: true });

      window.dataLayer = window.dataLayer || [];
      window.dataLayer.push({
        event: "call_prompt_closed",
        close_reason: reason || "dismissed",
        page_path: window.location.pathname
      });
    }

    pop.addEventListener("click", function (e) {
      if (e.target.closest("[data-callpop-close]")) { close("dismissed"); return; }
      if (e.target.closest("[data-callpop-scrim]")) { close("scrim"); return; }
      // Tapping the call button hands off to the dialer; get out of the way.
      if (e.target.closest("[data-phone-link]")) close("called");
    });

    if (oncePerSession && seenThisSession()) return;

    /* The timer runs from page load, full stop. It used to wait for the consent
       banner to be answered so two overlays could never stack — but a visitor
       who simply ignores the banner then never saw the prompt at all, which
       quietly cancelled the whole feature on a first visit.
       The stacking problem is solved properly below instead: if the banner is
       still open when the prompt appears, the prompt borrows the screen and
       hands it straight back on dismissal. */
    window.setTimeout(open, delay);
  }

  /* =========================================================================
   * Boot
   * ====================================================================== */
  initCallBar();
  initHeader();
  initDrawer();
  initReveals();
  initParallax();
  initFaq();
  initPhoneTracking();
  initConsent();
  initCallPopup();   // must run after initConsent so it can wait on the banner

  // Late-loading images change section heights; recalculate trigger positions
  // once everything has settled so reveals fire at the right scroll offsets.
  window.addEventListener("load", function () {
    if (window.ScrollTrigger) ScrollTrigger.refresh();
  });
})();

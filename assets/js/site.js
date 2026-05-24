/* =====================================================================
   TAVRIDA INC — site behavior
   - Animated SVG trucks (Gemini-authored, integrated by tractor+trailer)
   - Stat counters, scroll reveal, route map draw, mobile nav
   ===================================================================== */

(() => {
  'use strict';

  /* =====================================================================
     SVG ASSET LIBRARY
     All side-profile, facing LEFT. Tractor occupies 0–160 in x, trailers
     are 300-wide with kingpin near the left edge — composed in a 460-wide
     viewBox with the trailer translated to meet the 5th wheel.
     ===================================================================== */

  // Tractor — Peterbilt 389 long-nose conventional, viewBox 0 0 160 140.
  const TRACTOR_SVG = `
    <defs>
      <linearGradient id="__P__cabPaint" x1="0%" y1="0%" x2="100%" y2="50%">
        <stop offset="0%" stop-color="#e63946"/><stop offset="70%" stop-color="#c92a3a"/><stop offset="100%" stop-color="#9c1a25"/>
      </linearGradient>
      <linearGradient id="__P__hoodTopPaint" x1="0%" y1="0%" x2="0%" y2="100%">
        <stop offset="0%" stop-color="#ff4d5a"/><stop offset="100%" stop-color="#c92a3a"/>
      </linearGradient>
      <linearGradient id="__P__fenderPaint" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" stop-color="#c92a3a"/><stop offset="100%" stop-color="#7a1019"/>
      </linearGradient>
      <linearGradient id="__P__chromeVert" x1="0%" y1="0%" x2="100%" y2="0%">
        <stop offset="0%" stop-color="#e0e0e0"/><stop offset="20%" stop-color="#ffffff"/><stop offset="45%" stop-color="#d6d6d6"/><stop offset="60%" stop-color="#999999"/><stop offset="80%" stop-color="#ffffff"/><stop offset="100%" stop-color="#aaaaaa"/>
      </linearGradient>
      <linearGradient id="__P__chromeHoriz" x1="0%" y1="0%" x2="0%" y2="100%">
        <stop offset="0%" stop-color="#ffffff"/><stop offset="30%" stop-color="#d6d6d6"/><stop offset="50%" stop-color="#888888"/><stop offset="75%" stop-color="#ffffff"/><stop offset="100%" stop-color="#777777"/>
      </linearGradient>
      <linearGradient id="__P__glass" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" stop-color="#e0f7fa" stop-opacity="0.9"/><stop offset="40%" stop-color="#80deea" stop-opacity="0.7"/><stop offset="100%" stop-color="#00acc1" stop-opacity="0.8"/>
      </linearGradient>
      <radialGradient id="__P__rimGrad" cx="50%" cy="50%" r="50%">
        <stop offset="0%" stop-color="#ffffff"/><stop offset="45%" stop-color="#dddddd"/><stop offset="70%" stop-color="#999999"/><stop offset="90%" stop-color="#ffffff"/><stop offset="100%" stop-color="#555555"/>
      </radialGradient>
    </defs>

    <ellipse cx="80" cy="118" rx="75" ry="5" fill="#000" fill-opacity="0.18"/>

    <g>
      <rect x="35" y="100" width="120" height="7" fill="#1c1919"/>
      <rect x="55" y="98" width="95" height="3" fill="#2d2d2d"/>
      <path d="M 92,95 A 16,16 0 0 0 121,95" fill="none" stroke="url(#__P__chromeHoriz)" stroke-width="1.5"/>
      <path d="M 122,95 A 16,16 0 0 0 151,95" fill="none" stroke="url(#__P__chromeHoriz)" stroke-width="1.5"/>
      <rect x="150" y="94" width="2" height="18" fill="#111"/>
      <rect x="149" y="100" width="4" height="11" fill="#222"/>
    </g>

    <g>
      <path d="M 90,44 L 142,44 L 142,102 L 90,102 Z" fill="url(#__P__cabPaint)"/>
      <path d="M 90,44 C 90,44 110,42 142,43 L 142,44 Z" fill="#ff4d5a"/>
      <rect x="125" y="88" width="10" height="4" fill="url(#__P__chromeHoriz)" rx="0.5"/>
      <rect x="100" y="52" width="14" height="10" fill="url(#__P__glass)" rx="1" stroke="#666" stroke-width="0.8"/>

      <path d="M 90,102 L 90,52 C 90,52 74,53 66,54 C 65,54 62,56 61,59 L 55,75 C 55,75 44,75 42,75 L 42,102 Z" fill="url(#__P__cabPaint)"/>
      <path d="M 55,75 L 14,75 L 14,101 L 42,101 L 42,75 Z" fill="url(#__P__cabPaint)"/>
      <path d="M 55,75 L 14,75 L 14,77 L 55,77 Z" fill="url(#__P__hoodTopPaint)"/>
      <line x1="90" y1="44" x2="90" y2="102" stroke="#111" stroke-width="0.8"/>

      <path d="M 14,73 L 17,73 L 17,101 L 14,101 Z" fill="url(#__P__chromeVert)"/>
      <rect x="14.5" y="75" width="1.5" height="25" fill="#333"/>
      <ellipse cx="14" cy="87" rx="0.4" ry="1" fill="#e63946"/>
      <path d="M 11,92 L 14,92 L 14,112 L 12,112 L 11,109 Z" fill="url(#__P__chromeVert)"/>
      <path d="M 11,88 C 11,85 14,85 15,86 L 15,91 C 14,92 11,91 11,88 Z" fill="url(#__P__chromeVert)"/>
      <ellipse cx="11" cy="88.5" rx="0.5" ry="2" fill="#fffde6"/>
      <path d="M 13,101 C 13,90 20,87 31,87 C 42,87 46,96 46,101 L 42,101 C 42,94 36,91 31,91 C 24,91 17,94 17,101 Z" fill="url(#__P__fenderPaint)"/>

      <path d="M 88,56 L 68,57 L 63,71 L 88,71 Z" fill="url(#__P__glass)"/>
      <path d="M 67,57 L 62,71 L 57,71 Z" fill="url(#__P__glass)" opacity="0.7"/>
      <path d="M 89,55 L 67,56 L 62,71 L 89,71 Z" fill="none" stroke="url(#__P__chromeHoriz)" stroke-width="1"/>
      <path d="M 89,54 L 61,56 L 59,74 L 56,80 L 56,101" fill="none" stroke="#5c0e15" stroke-width="0.8"/>
      <rect x="82" y="75" width="4" height="1.5" fill="url(#__P__chromeHoriz)" rx="0.2"/>

      <rect x="58" y="95" width="31" height="12" rx="6" fill="url(#__P__chromeHoriz)"/>
      <rect x="59" y="95" width="29" height="12" rx="5.5" fill="none" stroke="#666" stroke-width="0.5"/>
      <line x1="66" y1="95" x2="66" y2="107" stroke="#222" stroke-width="0.8"/>
      <line x1="81" y1="95" x2="81" y2="107" stroke="#222" stroke-width="0.8"/>
      <rect x="45" y="96" width="12" height="10" fill="url(#__P__chromeHoriz)"/>
      <rect x="44" y="105" width="45" height="1.5" fill="url(#__P__chromeHoriz)"/>

      <rect x="49" y="71" width="5" height="20" rx="1.5" fill="url(#__P__chromeVert)"/>
      <path d="M 47,85 L 50,85 L 50,89 L 47,89 Z" fill="#222"/>
      <path d="M 51,71 L 51,66 L 53,64" fill="none" stroke="url(#__P__chromeVert)" stroke-width="1"/>

      <path d="M 91,100 L 91,32 C 91,32 91.5,28 93,26" fill="none" stroke="url(#__P__chromeVert)" stroke-width="2" stroke-linecap="round"/>
      <rect x="90" y="65" width="3" height="25" fill="url(#__P__chromeVert)"/>
      <path d="M 94,100 L 94,30 C 94,30 94.5,26 96,24" fill="none" stroke="url(#__P__chromeVert)" stroke-width="2" stroke-linecap="round"/>
      <rect x="93" y="63" width="3" height="25" fill="url(#__P__chromeVert)"/>

      <polygon points="63,54 52,60 52,58 62,53" fill="url(#__P__chromeVert)"/>

      <path d="M 68,52 Q 69,50 71,52 Z" fill="url(#__P__chromeHoriz)"/><circle cx="71" cy="52" r="0.5" fill="#ffa500"/>
      <path d="M 75,51 Q 76,49 78,51 Z" fill="url(#__P__chromeHoriz)"/><circle cx="78" cy="51" r="0.5" fill="#ffa500"/>
      <path d="M 82,51 Q 83,49 85,51 Z" fill="url(#__P__chromeHoriz)"/><circle cx="85" cy="51" r="0.5" fill="#ffa500"/>

      <line x1="62" y1="56" x2="59" y2="56" stroke="url(#__P__chromeHoriz)" stroke-width="0.8"/>
      <line x1="65" y1="68" x2="59" y2="68" stroke="url(#__P__chromeHoriz)" stroke-width="0.8"/>
      <rect x="58" y="54" width="2.5" height="16" rx="0.5" fill="url(#__P__chromeVert)"/>
      <rect x="58.5" y="66" width="1.5" height="3" fill="url(#__P__chromeVert)"/>
    </g>

    <g class="wheel" style="transform-origin: 31px 105px;">
      <circle cx="31" cy="105" r="13" fill="#1a1a1a"/>
      <circle cx="31" cy="105" r="10" fill="#111"/>
      <circle cx="31" cy="105" r="11.5" fill="none" stroke="#252525" stroke-dasharray="3,1.5" stroke-width="1"/>
      <circle cx="31" cy="105" r="7.5" fill="url(#__P__rimGrad)"/>
      <circle cx="31" cy="105" r="4.5" fill="#888" stroke="#666" stroke-width="0.3"/>
      <circle cx="31" cy="105" r="3" fill="url(#__P__chromeHoriz)"/>
      <circle cx="31" cy="105" r="3.7" fill="none" stroke="#fff" stroke-dasharray="1,1" stroke-width="0.6"/>
      <circle cx="31" cy="105" r="1.2" fill="#222"/>
    </g>
    <g class="wheel" style="transform-origin: 106px 105px;">
      <circle cx="106" cy="105" r="13" fill="#1a1a1a"/>
      <circle cx="106" cy="105" r="10" fill="#111"/>
      <circle cx="106" cy="105" r="11.5" fill="none" stroke="#252525" stroke-dasharray="3,1.5" stroke-width="1"/>
      <circle cx="106" cy="105" r="7.5" fill="url(#__P__rimGrad)"/>
      <circle cx="106" cy="105" r="5" fill="#333"/>
      <rect x="104.5" y="103.5" width="3" height="3" fill="url(#__P__chromeHoriz)" rx="0.3"/>
      <circle cx="106" cy="105" r="4.2" fill="none" stroke="#fff" stroke-dasharray="0.8,0.8" stroke-width="0.5"/>
    </g>
    <g class="wheel" style="transform-origin: 136px 105px;">
      <circle cx="136" cy="105" r="13" fill="#1a1a1a"/>
      <circle cx="136" cy="105" r="10" fill="#111"/>
      <circle cx="136" cy="105" r="11.5" fill="none" stroke="#252525" stroke-dasharray="3,1.5" stroke-width="1"/>
      <circle cx="136" cy="105" r="7.5" fill="url(#__P__rimGrad)"/>
      <circle cx="136" cy="105" r="5" fill="#333"/>
      <rect x="134.5" y="103.5" width="3" height="3" fill="url(#__P__chromeHoriz)" rx="0.3"/>
      <circle cx="136" cy="105" r="4.2" fill="none" stroke="#fff" stroke-dasharray="0.8,0.8" stroke-width="0.5"/>
    </g>
  `;

  /* ----- TRAILERS (kingpin near x=5, viewBox 0 0 300 140) ------------ */

  const DRY_VAN_SVG = `
    <defs>
      <linearGradient id="__P__dvCV" x1="0%" y1="0%" x2="100%" y2="0%"><stop offset="0%" stop-color="#e0e0e0"/><stop offset="20%" stop-color="#fff"/><stop offset="45%" stop-color="#d6d6d6"/><stop offset="60%" stop-color="#999"/><stop offset="80%" stop-color="#fff"/><stop offset="100%" stop-color="#aaa"/></linearGradient>
      <linearGradient id="__P__dvCH" x1="0%" y1="0%" x2="0%" y2="100%"><stop offset="0%" stop-color="#fff"/><stop offset="30%" stop-color="#d6d6d6"/><stop offset="50%" stop-color="#888"/><stop offset="75%" stop-color="#fff"/><stop offset="100%" stop-color="#777"/></linearGradient>
      <linearGradient id="__P__dvBody" x1="0%" y1="0%" x2="0%" y2="100%"><stop offset="0%" stop-color="#fff"/><stop offset="8%" stop-color="#fcfcfc"/><stop offset="85%" stop-color="#f4f4f4"/><stop offset="100%" stop-color="#e2e2e2"/></linearGradient>
      <radialGradient id="__P__dvRim" cx="50%" cy="50%" r="50%"><stop offset="0%" stop-color="#fff"/><stop offset="45%" stop-color="#ddd"/><stop offset="70%" stop-color="#999"/><stop offset="90%" stop-color="#fff"/><stop offset="100%" stop-color="#555"/></radialGradient>
      <linearGradient id="__P__dvShadow" x1="0%" y1="0%" x2="100%" y2="0%"><stop offset="0%" stop-color="#000" stop-opacity="0.15"/><stop offset="3%" stop-color="#000" stop-opacity="0"/><stop offset="97%" stop-color="#fff" stop-opacity="0"/><stop offset="100%" stop-color="#fff" stop-opacity="0.3"/></linearGradient>
    </defs>
    <ellipse cx="150" cy="130" rx="142" ry="4" fill="#000" fill-opacity="0.15"/>
    <ellipse cx="235" cy="126" rx="40" ry="3" fill="#000" fill-opacity="0.2"/>
    <g>
      <rect x="40" y="101" width="245" height="6" fill="#1c1a1a"/>
      <rect x="202" y="104" width="66" height="9" fill="#2d2d2d" stroke="#1c1a1a" stroke-width="0.5"/>
      <line x1="206" y1="113" x2="264" y2="113" stroke="#444" stroke-width="1.5"/>
      <line x1="38" y1="102" x2="48" y2="118" stroke="#222" stroke-width="1.5"/>
      <line x1="48" y1="118" x2="62" y2="102" stroke="#333" stroke-width="1"/>
      <rect x="36" y="101" width="4" height="15" fill="#333"/>
      <rect x="35" y="116" width="6" height="3" fill="#1c1a1a" rx="0.5"/>
      <rect x="33" y="119" width="10" height="1.5" fill="#444"/>
      <rect x="43" y="101" width="3.5" height="14" fill="#222"/>
      <rect x="42" y="115" width="5.5" height="3" fill="#111" rx="0.5"/>
      <rect x="40" y="118" width="9" height="1.2" fill="#2d2d2d"/>
      <rect x="4" y="101" width="25" height="2" fill="#111"/>
      <path d="M 12,103 L 14,103 L 14,106 L 12,106 Z" fill="#050505"/>
      <polygon points="58,102 200,102 196,111 64,111" fill="#111" opacity="0.95"/>
      <line x1="64" y1="111" x2="196" y2="111" stroke="#333" stroke-width="0.5"/>
    </g>
    <g>
      <rect x="5" y="18" width="290" height="84" fill="url(#__P__dvBody)"/>
      <path d="M 8,18 L 5,18 L 5,102 L 8,102 A 3,42 0 0 0 8,18 Z" fill="url(#__P__dvCV)" opacity="0.85"/>
      <rect x="5" y="18" width="290" height="3" fill="url(#__P__dvCH)"/>
      <rect x="5" y="99" width="290" height="3" fill="url(#__P__dvCH)"/>
      <g stroke="#ccc" stroke-width="0.5">
        <rect x="8" y="21" width="28" height="78" fill="url(#__P__dvShadow)" stroke="none"/><line x1="36" y1="21" x2="36" y2="99"/>
        <rect x="36" y="21" width="29" height="78" fill="url(#__P__dvShadow)" stroke="none"/><line x1="65" y1="21" x2="65" y2="99"/>
        <rect x="65" y="21" width="29" height="78" fill="url(#__P__dvShadow)" stroke="none"/><line x1="94" y1="21" x2="94" y2="99"/>
        <rect x="94" y="21" width="29" height="78" fill="url(#__P__dvShadow)" stroke="none"/><line x1="123" y1="21" x2="123" y2="99"/>
        <rect x="123" y="21" width="29" height="78" fill="url(#__P__dvShadow)" stroke="none"/><line x1="152" y1="21" x2="152" y2="99"/>
        <rect x="152" y="21" width="29" height="78" fill="url(#__P__dvShadow)" stroke="none"/><line x1="181" y1="21" x2="181" y2="99"/>
        <rect x="181" y="21" width="29" height="78" fill="url(#__P__dvShadow)" stroke="none"/><line x1="210" y1="21" x2="210" y2="99"/>
        <rect x="210" y="21" width="29" height="78" fill="url(#__P__dvShadow)" stroke="none"/><line x1="239" y1="21" x2="239" y2="99"/>
        <rect x="239" y="21" width="29" height="78" fill="url(#__P__dvShadow)" stroke="none"/><line x1="268" y1="21" x2="268" y2="99"/>
        <rect x="268" y="21" width="27" height="78" fill="url(#__P__dvShadow)" stroke="none"/>
      </g>
      <rect x="292" y="18" width="3" height="84" fill="url(#__P__dvCV)"/>
      <rect x="294" y="28" width="1" height="4" fill="#333"/>
      <rect x="294" y="48" width="1" height="4" fill="#333"/>
      <rect x="294" y="68" width="1" height="4" fill="#333"/>
      <rect x="294" y="88" width="1" height="4" fill="#333"/>
      <path d="M 291,102 L 294,102 L 294,116 L 291,116 Z" fill="#222"/>
      <line x1="292" y1="115" x2="284" y2="115" stroke="#e63946" stroke-width="1.5"/>
    </g>
    <g>
      <text x="149" y="58" font-family="Outfit, sans-serif" font-weight="900" font-size="22" fill="#0d1b2a" letter-spacing="4.5" text-anchor="middle" opacity="0.95">TAVRIDA</text>
      <line x1="50" y1="64" x2="248" y2="64" stroke="#0d1b2a" stroke-width="1" opacity="0.85"/>
      <line x1="110" y1="66" x2="188" y2="66" stroke="#e63946" stroke-width="0.75"/>
      <text x="149" y="75" font-family="Outfit, sans-serif" font-weight="700" font-size="6.5" fill="#e63946" letter-spacing="2.8" text-anchor="middle">INTERSTATE TRUCKING</text>
      <text x="12" y="94" font-family="monospace" font-size="2.5" fill="#666" letter-spacing="0.2">LENGTH: 53FT</text>
      <text x="262" y="94" font-family="monospace" font-size="2.5" fill="#666" letter-spacing="0.2">SYS-908A</text>
      <path d="M 12,97.5 L 290,97.5" stroke="#e63946" stroke-width="0.8" stroke-dasharray="8,8"/>
      <path d="M 16,97.5 L 290,97.5" stroke="#fff" stroke-width="0.8" stroke-dasharray="8,8"/>
    </g>
    <path d="M 264,102 C 264,102 266,102 266,105 L 266,122 L 262,122 L 262,105 Z" fill="#111"/>
    <rect x="262" y="120" width="4" height="2" fill="url(#__P__dvCH)"/>
    <g class="wheel" style="transform-origin: 220px 113px;">
      <circle cx="220" cy="113" r="13" fill="#1c1a1a"/><circle cx="220" cy="113" r="10.2" fill="#111"/>
      <circle cx="220" cy="113" r="11.6" fill="none" stroke="#282626" stroke-dasharray="2,1"/>
      <circle cx="220" cy="113" r="7.5" fill="url(#__P__dvRim)"/><circle cx="220" cy="113" r="5" fill="#444"/>
      <circle cx="220" cy="113" r="2.8" fill="#1a1a1a"/><circle cx="220" cy="113" r="4" fill="none" stroke="#fff" stroke-dasharray="0.8,0.8" stroke-width="0.6"/>
      <circle cx="220" cy="113" r="1.2" fill="#bcbcbc"/>
    </g>
    <g class="wheel" style="transform-origin: 250px 113px;">
      <circle cx="250" cy="113" r="13" fill="#1c1a1a"/><circle cx="250" cy="113" r="10.2" fill="#111"/>
      <circle cx="250" cy="113" r="11.6" fill="none" stroke="#282626" stroke-dasharray="2,1"/>
      <circle cx="250" cy="113" r="7.5" fill="url(#__P__dvRim)"/><circle cx="250" cy="113" r="5" fill="#444"/>
      <circle cx="250" cy="113" r="2.8" fill="#1a1a1a"/><circle cx="250" cy="113" r="4" fill="none" stroke="#fff" stroke-dasharray="0.8,0.8" stroke-width="0.6"/>
      <circle cx="250" cy="113" r="1.2" fill="#bcbcbc"/>
    </g>
  `;

  const REEFER_SVG = `
    <defs>
      <linearGradient id="__P__rfCV" x1="0%" y1="0%" x2="100%" y2="0%"><stop offset="0%" stop-color="#e0e0e0"/><stop offset="20%" stop-color="#fff"/><stop offset="45%" stop-color="#d6d6d6"/><stop offset="60%" stop-color="#999"/><stop offset="80%" stop-color="#fff"/><stop offset="100%" stop-color="#aaa"/></linearGradient>
      <linearGradient id="__P__rfCH" x1="0%" y1="0%" x2="0%" y2="100%"><stop offset="0%" stop-color="#fff"/><stop offset="30%" stop-color="#d6d6d6"/><stop offset="50%" stop-color="#888"/><stop offset="75%" stop-color="#fff"/><stop offset="100%" stop-color="#777"/></linearGradient>
      <linearGradient id="__P__rfBody" x1="0%" y1="0%" x2="0%" y2="100%"><stop offset="0%" stop-color="#fff"/><stop offset="5%" stop-color="#fdfeff"/><stop offset="80%" stop-color="#f2f6f8"/><stop offset="100%" stop-color="#dae3e7"/></linearGradient>
      <linearGradient id="__P__rfUnit" x1="0%" y1="0%" x2="100%" y2="100%"><stop offset="0%" stop-color="#2d3134"/><stop offset="40%" stop-color="#202326"/><stop offset="100%" stop-color="#111214"/></linearGradient>
      <linearGradient id="__P__rfGlassCy" x1="0%" y1="0%" x2="0%" y2="100%"><stop offset="0%" stop-color="#e0f7fa"/><stop offset="50%" stop-color="#00e5ff"/><stop offset="100%" stop-color="#00838f"/></linearGradient>
      <radialGradient id="__P__rfRim" cx="50%" cy="50%" r="50%"><stop offset="0%" stop-color="#fff"/><stop offset="45%" stop-color="#ddd"/><stop offset="70%" stop-color="#999"/><stop offset="90%" stop-color="#fff"/><stop offset="100%" stop-color="#555"/></radialGradient>
      <linearGradient id="__P__rfJoint" x1="0%" y1="0%" x2="100%" y2="0%"><stop offset="0%" stop-color="#000" stop-opacity="0.08"/><stop offset="50%" stop-color="#fff" stop-opacity="0"/><stop offset="100%" stop-color="#fff" stop-opacity="0.12"/></linearGradient>
    </defs>
    <ellipse cx="150" cy="130" rx="142" ry="4" fill="#000" fill-opacity="0.14"/>
    <ellipse cx="235" cy="126" rx="40" ry="3" fill="#000" fill-opacity="0.18"/>
    <g>
      <rect x="35" y="101" width="250" height="5" fill="#1e2022"/>
      <rect x="202" y="103" width="66" height="10" fill="#2d3033" stroke="#191b1c" stroke-width="0.5"/>
      <line x1="205" y1="113" x2="265" y2="113" stroke="#484d52" stroke-width="1.5"/>
      <line x1="42" y1="102" x2="52" y2="118" stroke="#191b1c" stroke-width="1.2"/>
      <line x1="52" y1="118" x2="64" y2="102" stroke="#2d3033" stroke-width="0.8"/>
      <rect x="40" y="101" width="4" height="15" fill="#2d3033"/>
      <rect x="39" y="116" width="6" height="3" fill="#191b1c" rx="0.5"/>
      <rect x="37" y="119" width="10" height="1.5" fill="#484d52"/>
      <rect x="46" y="101" width="3.5" height="14" fill="#191b1c"/>
      <rect x="45" y="115" width="5.5" height="3" fill="#111213"/>
      <rect x="43" y="118" width="9" height="1.2" fill="#383c40"/>
      <rect x="4" y="101" width="28" height="2" fill="#141517"/>
      <path d="M 12,103 L 14,103 L 14,106 L 12,106 Z" fill="#090a0a"/>
      <polygon points="62,102 200,102 197,110 67,110" fill="#141517"/>
      <line x1="67" y1="110" x2="197" y2="110" stroke="#2d3033" stroke-width="0.5"/>
    </g>
    <g>
      <rect x="5" y="26" width="290" height="76" fill="url(#__P__rfBody)"/>
      <rect x="5" y="26" width="290" height="3" fill="url(#__P__rfCH)"/>
      <rect x="5" y="99" width="290" height="3" fill="url(#__P__rfCH)"/>
      <path d="M 8,26 L 5,26 L 5,102 L 8,102 A 3,38 0 0 0 8,26 Z" fill="url(#__P__rfCV)"/>
      <rect x="76" y="29" width="3" height="70" fill="url(#__P__rfJoint)"/>
      <line x1="77" y1="29" x2="77" y2="99" stroke="#dae3e7" stroke-width="0.75"/>
      <rect x="148" y="29" width="3" height="70" fill="url(#__P__rfJoint)"/>
      <line x1="149" y1="29" x2="149" y2="99" stroke="#dae3e7" stroke-width="0.75"/>
      <rect x="220" y="29" width="3" height="70" fill="url(#__P__rfJoint)"/>
      <line x1="221" y1="29" x2="221" y2="99" stroke="#dae3e7" stroke-width="0.75"/>
      <rect x="292" y="26" width="3" height="76" fill="url(#__P__rfCV)"/>
      <rect x="294" y="34" width="1" height="4" fill="#383c40"/>
      <rect x="294" y="52" width="1" height="4" fill="#383c40"/>
      <rect x="294" y="70" width="1" height="4" fill="#383c40"/>
      <rect x="294" y="88" width="1" height="4" fill="#383c40"/>
      <path d="M 291,102 L 294,102 L 294,116 L 291,116 Z" fill="#1e2022"/>
      <line x1="292" y1="115" x2="284" y2="115" stroke="#e63946" stroke-width="1.5"/>
      <path d="M 12,97.5 L 290,97.5" stroke="#e63946" stroke-width="0.8" stroke-dasharray="6,6"/>
      <path d="M 15,97.5 L 290,97.5" stroke="#fff" stroke-width="0.8" stroke-dasharray="6,6"/>
    </g>
    <g opacity="0.85">
      <g stroke="#00acc1" stroke-width="1" stroke-linecap="round">
        <line x1="102" y1="62" x2="112" y2="62"/>
        <line x1="107" y1="57" x2="107" y2="67"/>
        <line x1="103.5" y1="58.5" x2="110.5" y2="65.5"/>
        <line x1="103.5" y1="65.5" x2="110.5" y2="58.5"/>
        <path d="M 104,61 L 102,62 L 104,63 M 110,61 L 112,62 L 110,63 M 106,59 L 107,57 L 108,59 M 106,65 L 107,67 L 108,65" fill="none" stroke-width="0.75"/>
      </g>
      <text x="117" y="65" font-family="Outfit, sans-serif" font-weight="700" font-size="7.5" fill="#00838f" letter-spacing="0.5">-20°F to +70°F</text>
      <text x="117" y="56" font-family="Outfit, sans-serif" font-weight="800" font-size="4.5" fill="#546e7a" letter-spacing="1.5">MULTI-TEMPERATURE INSULATED</text>
    </g>
    <g>
      <path d="M 5,26 L 5,10 C 5,6 9,4 15,4 L 63,4 C 68,4 70,7 70,11 L 70,27 Z" fill="url(#__P__rfUnit)"/>
      <path d="M 5,9 L 70,9" stroke="url(#__P__rfCH)" stroke-width="0.75"/>
      <rect x="9" y="6" width="52" height="2.5" fill="#111213" rx="0.5"/>
      <rect x="12" y="7" width="4" height="1" fill="#00e5ff" opacity="0.9"/>
      <circle cx="19" cy="7.5" r="0.4" fill="#00e676"/>
      <circle cx="21" cy="7.5" r="0.4" fill="#00e676"/>
      <g fill="#151718" stroke="#0f1011" stroke-width="0.5">
        <rect x="42" y="11" width="24" height="13" rx="1"/>
        <line x1="44" y1="13" x2="64" y2="13" stroke="#222426" stroke-width="0.8"/>
        <line x1="44" y1="15" x2="64" y2="15" stroke="#222426" stroke-width="0.8"/>
        <line x1="44" y1="17" x2="64" y2="17" stroke="#222426" stroke-width="0.8"/>
        <line x1="44" y1="19" x2="64" y2="19" stroke="#222426" stroke-width="0.8"/>
        <line x1="44" y1="21" x2="64" y2="21" stroke="#222426" stroke-width="0.8"/>
      </g>
      <text x="11" y="20" font-family="'Arial Black', Impact, sans-serif" font-weight="900" font-size="6.5" fill="#fff" letter-spacing="0.8">CARRIER</text>
      <path d="M 38,11 L 38,24" stroke="#222426" stroke-width="0.5"/>
      <path d="M 9,11 L 38,11" stroke="#222426" stroke-width="0.5"/>
      <circle cx="11" cy="13" r="0.4" fill="#fff" opacity="0.3"/>
      <path d="M 5,22 L 3,22 L 3,24 L 5,24 Z" fill="url(#__P__rfCV)"/>
      <rect x="2" y="22.3" width="1" height="1.4" fill="url(#__P__rfGlassCy)"/>
    </g>
    <path d="M 264,102 C 264,102 266,102 266,105 L 266,122 L 262,122 L 262,105 Z" fill="#141517"/>
    <rect x="262" y="120" width="4" height="2" fill="url(#__P__rfCH)"/>
    <g class="wheel" style="transform-origin: 220px 113px;">
      <circle cx="220" cy="113" r="13" fill="#202224"/><circle cx="220" cy="113" r="10.2" fill="#141517"/>
      <circle cx="220" cy="113" r="11.6" fill="none" stroke="#2c2f32" stroke-dasharray="2,1"/>
      <circle cx="220" cy="113" r="7.5" fill="url(#__P__rfRim)"/><circle cx="220" cy="113" r="5" fill="#3f4448"/>
      <circle cx="220" cy="113" r="2.8" fill="#191b1c"/><circle cx="220" cy="113" r="4" fill="none" stroke="#fff" stroke-dasharray="0.8,0.8" stroke-width="0.6"/>
      <circle cx="220" cy="113" r="1.2" fill="#d5dbdb"/>
    </g>
    <g class="wheel" style="transform-origin: 250px 113px;">
      <circle cx="250" cy="113" r="13" fill="#202224"/><circle cx="250" cy="113" r="10.2" fill="#141517"/>
      <circle cx="250" cy="113" r="11.6" fill="none" stroke="#2c2f32" stroke-dasharray="2,1"/>
      <circle cx="250" cy="113" r="7.5" fill="url(#__P__rfRim)"/><circle cx="250" cy="113" r="5" fill="#3f4448"/>
      <circle cx="250" cy="113" r="2.8" fill="#191b1c"/><circle cx="250" cy="113" r="4" fill="none" stroke="#fff" stroke-dasharray="0.8,0.8" stroke-width="0.6"/>
      <circle cx="250" cy="113" r="1.2" fill="#d5dbdb"/>
    </g>
  `;

  const POWER_ONLY_SVG = `
    <defs>
      <marker id="__P__poArr" viewBox="0 0 10 10" refX="0" refY="5" markerWidth="6" markerHeight="6" orient="auto-start-reverse">
        <path d="M 10 0 L 0 5 L 10 10 z" fill="#f97316"/>
      </marker>
    </defs>
    <rect x="5" y="20" width="290" height="80" rx="4" fill="none" stroke="#22d3ee" stroke-width="2" stroke-dasharray="6 4"/>
    <circle cx="15" cy="100" r="4" fill="#22d3ee"/>
    <line x1="15" y1="104" x2="-8" y2="104" stroke="#f97316" stroke-width="2.5" marker-end="url(#__P__poArr)"/>
    <text x="150" y="58" fill="#22d3ee" font-family="Outfit, sans-serif" font-size="18" font-weight="800" letter-spacing="4" text-anchor="middle">YOUR TRAILER</text>
    <text x="150" y="74" fill="#22d3ee" font-family="Outfit, sans-serif" font-size="7" font-weight="600" opacity="0.7" letter-spacing="3" text-anchor="middle">WE PROVIDE THE TRACTOR</text>
  `;

  const FLATBED_SVG = `
    <defs>
      <linearGradient id="__P__fbChrome" x1="0%" y1="0%" x2="0%" y2="100%"><stop offset="0%" stop-color="#fff"/><stop offset="30%" stop-color="#e0e6ed"/><stop offset="45%" stop-color="#9aa0a6"/><stop offset="50%" stop-color="#3a4045"/><stop offset="55%" stop-color="#60676d"/><stop offset="85%" stop-color="#d2d8df"/><stop offset="100%" stop-color="#a2a8ae"/></linearGradient>
      <linearGradient id="__P__fbSteel" x1="0%" y1="0%" x2="0%" y2="100%"><stop offset="0%" stop-color="#2d3238"/><stop offset="15%" stop-color="#40464d"/><stop offset="50%" stop-color="#1a1c1e"/><stop offset="85%" stop-color="#24282c"/><stop offset="100%" stop-color="#0f1112"/></linearGradient>
      <linearGradient id="__P__fbChassis" x1="0%" y1="0%" x2="0%" y2="100%"><stop offset="0%" stop-color="#444a50"/><stop offset="50%" stop-color="#181a1c"/><stop offset="100%" stop-color="#0c0d0e"/></linearGradient>
      <linearGradient id="__P__fbWoodSide" x1="0%" y1="0%" x2="100%" y2="0%"><stop offset="0%" stop-color="#b08359"/><stop offset="25%" stop-color="#a07349"/><stop offset="50%" stop-color="#b88b5f"/><stop offset="75%" stop-color="#966a40"/><stop offset="100%" stop-color="#a87b51"/></linearGradient>
      <linearGradient id="__P__fbWoodEnd" x1="0%" y1="0%" x2="0%" y2="100%"><stop offset="0%" stop-color="#91643b"/><stop offset="50%" stop-color="#734925"/><stop offset="100%" stop-color="#593414"/></linearGradient>
      <pattern id="__P__fbPlank" width="40" height="4" patternUnits="userSpaceOnUse">
        <line x1="0" y1="0" x2="40" y2="0" stroke="#121518" stroke-width="0.4"/>
        <line x1="0" y1="2" x2="40" y2="2" stroke="#2a2e33" stroke-width="0.3"/>
      </pattern>
      <radialGradient id="__P__fbTire" cx="50%" cy="50%" r="50%" fx="30%" fy="30%"><stop offset="0%" stop-color="#3c4146"/><stop offset="75%" stop-color="#1c1d1f"/><stop offset="100%" stop-color="#090a0a"/></radialGradient>
      <linearGradient id="__P__fbStrap" x1="0%" y1="0%" x2="100%" y2="0%"><stop offset="0%" stop-color="#000" stop-opacity="0.3"/><stop offset="30%" stop-color="#fff" stop-opacity="0.2"/><stop offset="70%" stop-color="#000" stop-opacity="0"/><stop offset="100%" stop-color="#000" stop-opacity="0.4"/></linearGradient>
    </defs>
    <ellipse cx="145" cy="126" rx="140" ry="6" fill="#000" opacity="0.4"/>
    <g>
      <path d="M 25 100 L 290 100 L 288 106 L 35 106 Z" fill="url(#__P__fbChassis)"/>
      <path d="M 5 97 L 25 100 L 25 102 L 5 99 Z" fill="url(#__P__fbSteel)"/>
      <rect x="55" y="101" width="12" height="5" fill="#151718"/>
      <rect x="85" y="101" width="12" height="5" fill="#151718"/>
      <rect x="115" y="101" width="12" height="5" fill="#151718"/>
      <rect x="145" y="101" width="12" height="5" fill="#151718"/>
      <rect x="175" y="101" width="12" height="5" fill="#151718"/>
      <rect x="202" y="104" width="62" height="4" fill="#111"/>
      <circle cx="220" cy="107" r="5" fill="#222"/>
      <circle cx="250" cy="107" r="5" fill="#222"/>
      <path d="M 205 105 Q 220 111 235 105 Q 250 111 265 105" fill="none" stroke="#333" stroke-width="2"/>
    </g>
    <g>
      <line x1="33" y1="105" x2="50" y2="118" stroke="#1c1d1f" stroke-width="2"/>
      <line x1="43" y1="105" x2="35" y2="118" stroke="#1c1d1f" stroke-width="1.5"/>
      <rect x="34" y="101" width="4" height="16" fill="url(#__P__fbSteel)"/>
      <rect x="41" y="101" width="4" height="16" fill="url(#__P__fbSteel)"/>
      <rect x="35" y="117" width="2" height="6" fill="url(#__P__fbChrome)"/>
      <rect x="42" y="117" width="2" height="6" fill="url(#__P__fbChrome)"/>
      <path d="M 32 123 L 40 123 L 39 125 L 33 125 Z" fill="#111315"/>
      <path d="M 39 123 L 47 123 L 46 125 L 40 125 Z" fill="#111315"/>
    </g>
    <rect x="4" y="97" width="4" height="2" fill="#000"/>
    <path d="M 3 99 L 9 99 L 7 101 L 5 101 Z" fill="url(#__P__fbSteel)"/>
    <rect x="264" y="101" width="3" height="2" fill="url(#__P__fbChrome)"/>
    <path d="M 265 103 L 268 103 L 269 119 L 265 119 Z" fill="#141517"/>
    <g>
      <rect x="5" y="86" width="290" height="14" fill="url(#__P__fbSteel)" rx="0.5"/>
      <rect x="5" y="89" width="290" height="2.5" fill="url(#__P__fbChrome)"/>
      <rect x="6" y="87" width="288" height="2" fill="url(#__P__fbWoodSide)" opacity="0.85"/>
      <rect x="6" y="87" width="288" height="2" fill="url(#__P__fbPlank)"/>
      <g fill="url(#__P__fbSteel)" stroke="#111" stroke-width="0.2">
        <rect x="12" y="88" width="3" height="4"/><rect x="32" y="88" width="3" height="4"/>
        <rect x="52" y="88" width="3" height="4"/><rect x="72" y="88" width="3" height="4"/>
        <rect x="92" y="88" width="3" height="4"/><rect x="112" y="88" width="3" height="4"/>
        <rect x="132" y="88" width="3" height="4"/><rect x="152" y="88" width="3" height="4"/>
        <rect x="172" y="88" width="3" height="4"/><rect x="192" y="88" width="3" height="4"/>
        <rect x="212" y="88" width="3" height="4"/><rect x="232" y="88" width="3" height="4"/>
        <rect x="252" y="88" width="3" height="4"/><rect x="272" y="88" width="3" height="4"/>
        <rect x="287" y="88" width="3" height="4"/>
      </g>
      <path d="M 292 88 L 295 88 L 295 98 L 292 98 Z" fill="#1a1a1a"/>
      <circle cx="293.5" cy="91" r="1" fill="#dc2626"/>
      <circle cx="293.5" cy="95" r="1" fill="#f59e0b"/>
    </g>
    <g>
      <rect x="15" y="68" width="16" height="18" fill="url(#__P__fbWoodEnd)" stroke="#4a2f16" stroke-width="0.5"/>
      <g stroke="#3d220a" stroke-width="0.3" fill="none">
        <path d="M 15 71 L 31 71 M 15 74 L 31 74 M 15 77 L 31 77 M 15 80 L 31 80 M 15 83 L 31 83"/>
        <path d="M 19 68 L 19 86 M 23 68 L 23 86 M 27 68 L 27 86"/>
      </g>
      <rect x="31" y="68" width="115" height="18" fill="url(#__P__fbWoodSide)" stroke="#5c3a21" stroke-width="0.5"/>
      <g stroke="#6e4629" stroke-width="0.4">
        <line x1="31" y1="71" x2="146" y2="71"/><line x1="31" y1="74" x2="146" y2="74"/>
        <line x1="31" y1="77" x2="146" y2="77"/><line x1="31" y1="80" x2="146" y2="80"/>
        <line x1="31" y1="83" x2="146" y2="83"/>
      </g>
      <text x="80" y="79" font-family="monospace" font-size="3" fill="#3a200a" opacity="0.6" font-weight="bold" text-anchor="middle">PREMIUM LUMBER</text>
      <rect x="146" y="68" width="115" height="18" fill="url(#__P__fbWoodSide)" stroke="#5c3a21" stroke-width="0.5"/>
      <g stroke="#6e4629" stroke-width="0.4">
        <line x1="146" y1="71" x2="261" y2="71"/><line x1="146" y1="74" x2="261" y2="74"/>
        <line x1="146" y1="77" x2="261" y2="77"/><line x1="146" y1="80" x2="261" y2="80"/>
        <line x1="146" y1="83" x2="261" y2="83"/>
      </g>
      <rect x="261" y="68" width="16" height="18" fill="url(#__P__fbWoodEnd)" stroke="#4a2f16" stroke-width="0.5"/>
      <g stroke="#3d220a" stroke-width="0.3" fill="none">
        <path d="M 261 71 L 277 71 M 261 74 L 277 74 M 261 77 L 277 77 M 261 80 L 277 80 M 261 83 L 277 83"/>
        <path d="M 265 68 L 265 86 M 269 68 L 269 86 M 273 68 L 273 86"/>
      </g>
      <rect x="15" y="50" width="16" height="18" fill="url(#__P__fbWoodEnd)" stroke="#4a2f16" stroke-width="0.5"/>
      <g stroke="#3d220a" stroke-width="0.3" fill="none">
        <path d="M 15 53 L 31 53 M 15 56 L 31 56 M 15 59 L 31 59 M 15 62 L 31 62 M 15 65 L 31 65"/>
        <path d="M 19 50 L 19 68 M 23 50 L 23 68 M 27 50 L 27 68"/>
      </g>
      <rect x="31" y="50" width="115" height="18" fill="url(#__P__fbWoodSide)" stroke="#5c3a21" stroke-width="0.5"/>
      <g stroke="#6e4629" stroke-width="0.4">
        <line x1="31" y1="53" x2="146" y2="53"/><line x1="31" y1="56" x2="146" y2="56"/>
        <line x1="31" y1="59" x2="146" y2="59"/><line x1="31" y1="62" x2="146" y2="62"/>
        <line x1="31" y1="65" x2="146" y2="65"/>
      </g>
      <rect x="146" y="50" width="115" height="18" fill="url(#__P__fbWoodSide)" stroke="#5c3a21" stroke-width="0.5"/>
      <g stroke="#6e4629" stroke-width="0.4">
        <line x1="146" y1="53" x2="261" y2="53"/><line x1="146" y1="56" x2="261" y2="56"/>
        <line x1="146" y1="59" x2="261" y2="59"/><line x1="146" y1="62" x2="261" y2="62"/>
        <line x1="146" y1="65" x2="261" y2="65"/>
      </g>
      <rect x="261" y="50" width="16" height="18" fill="url(#__P__fbWoodEnd)" stroke="#4a2f16" stroke-width="0.5"/>
      <g stroke="#3d220a" stroke-width="0.3" fill="none">
        <path d="M 261 53 L 277 53 M 261 56 L 277 56 M 261 59 L 277 59 M 261 62 L 277 62 M 261 65 L 277 65"/>
        <path d="M 265 50 L 265 68 M 269 50 L 269 68 M 273 50 L 273 68"/>
      </g>
    </g>
    <g>
      <rect x="54.5" y="50" width="2" height="37" fill="#f97316"/>
      <rect x="54.5" y="50" width="2" height="37" fill="url(#__P__fbStrap)"/>
      <rect x="53.5" y="87.5" width="4" height="4" fill="#3a4045" rx="0.5"/>
      <rect x="114.5" y="50" width="2" height="37" fill="#f97316"/>
      <rect x="114.5" y="50" width="2" height="37" fill="url(#__P__fbStrap)"/>
      <rect x="113.5" y="87.5" width="4" height="4" fill="#3a4045" rx="0.5"/>
      <rect x="174.5" y="50" width="2" height="37" fill="#f97316"/>
      <rect x="174.5" y="50" width="2" height="37" fill="url(#__P__fbStrap)"/>
      <rect x="173.5" y="87.5" width="4" height="4" fill="#3a4045" rx="0.5"/>
      <rect x="234.5" y="50" width="2" height="37" fill="#f97316"/>
      <rect x="234.5" y="50" width="2" height="37" fill="url(#__P__fbStrap)"/>
      <rect x="233.5" y="87.5" width="4" height="4" fill="#3a4045" rx="0.5"/>
    </g>
    <g class="wheel" style="transform-origin: 220px 113px;">
      <circle cx="220" cy="113" r="13" fill="url(#__P__fbTire)"/>
      <circle cx="220" cy="113" r="11.5" fill="none" stroke="#121314" stroke-width="0.5" stroke-dasharray="4,2"/>
      <circle cx="220" cy="113" r="7.5" fill="url(#__P__fbChrome)"/>
      <circle cx="220" cy="113" r="5.5" fill="#1b1e20"/>
      <circle cx="220" cy="113" r="3" fill="url(#__P__fbChrome)"/>
      <circle cx="220" cy="113" r="1.8" fill="#2d3238"/>
    </g>
    <g class="wheel" style="transform-origin: 250px 113px;">
      <circle cx="250" cy="113" r="13" fill="url(#__P__fbTire)"/>
      <circle cx="250" cy="113" r="11.5" fill="none" stroke="#121314" stroke-width="0.5" stroke-dasharray="4,2"/>
      <circle cx="250" cy="113" r="7.5" fill="url(#__P__fbChrome)"/>
      <circle cx="250" cy="113" r="5.5" fill="#1b1e20"/>
      <circle cx="250" cy="113" r="3" fill="url(#__P__fbChrome)"/>
      <circle cx="250" cy="113" r="1.8" fill="#2d3238"/>
    </g>
  `;

  /* ----- ASSEMBLY ---------------------------------------------------- */

  // Per-render unique counter so each instance gets unique IDs and references.
  let renderCounter = 0;
  const ns = (svgString) => {
    renderCounter++;
    const token = `t${renderCounter}`;
    return svgString.replace(/__P__/g, token + '_');
  };

  // The trailer is translated so its kingpin (around x=12) meets the
  // tractor's 5th-wheel area (around x=148). offset = 148 - 12 = 136.
  const TRAILER_X_OFFSET = 136;

  const composite = (trailerSvg) => {
    const tractor = ns(TRACTOR_SVG);
    const trailer = ns(trailerSvg);
    return `<svg class="trailer-svg" viewBox="0 0 460 140" xmlns="http://www.w3.org/2000/svg" preserveAspectRatio="xMidYMax meet">
      ${tractor}
      <g transform="translate(${TRAILER_X_OFFSET}, 0)">${trailer}</g>
    </svg>`;
  };

  const tractorOnly = () => {
    return `<svg class="trailer-svg" viewBox="0 0 160 140" xmlns="http://www.w3.org/2000/svg" preserveAspectRatio="xMidYMax meet">
      ${ns(TRACTOR_SVG)}
    </svg>`;
  };

  const trucks = {
    'hero':       () => composite(DRY_VAN_SVG),
    'page-hero':  () => tractorOnly(),
    'power-only': () => composite(POWER_ONLY_SVG),
    'dry-van':    () => composite(DRY_VAN_SVG),
    'reefer':     () => composite(REEFER_SVG),
    'open-deck':  () => composite(FLATBED_SVG),
    'flatbed':    () => composite(FLATBED_SVG),
  };

  /* ----- INJECTION ---------------------------------------------------- */
  function injectTrucks() {
    document.querySelectorAll('[data-truck]').forEach(el => {
      const kind = el.getAttribute('data-truck');
      if (trucks[kind]) el.innerHTML = trucks[kind]();
    });
  }

  /* ----- SCROLL REVEAL ----------------------------------------------- */
  function setupReveal() {
    const io = new IntersectionObserver((entries) => {
      entries.forEach(e => {
        if (e.isIntersecting) {
          e.target.classList.add('visible');
          io.unobserve(e.target);
        }
      });
    }, { threshold: 0.12, rootMargin: '0px 0px -40px 0px' });

    document.querySelectorAll('.reveal, .reveal-left, .reveal-right').forEach(el => {
      const rect = el.getBoundingClientRect();
      if (rect.top < window.innerHeight && rect.bottom > 0) el.classList.add('visible');
      else io.observe(el);
    });
  }

  /* ----- ANIMATED COUNTERS ------------------------------------------- */
  function animateCounter(el) {
    const target = el.getAttribute('data-count');
    const suffix = el.getAttribute('data-suffix') || '';
    const prefix = el.getAttribute('data-prefix') || '';
    const isFloat = target.includes('.');
    const final = parseFloat(target);
    const duration = 1800;
    const start = performance.now();

    function step(now) {
      const t = Math.min(1, (now - start) / duration);
      const eased = 1 - Math.pow(1 - t, 3);
      const val = final * eased;
      el.textContent = prefix + (isFloat ? val.toFixed(1) : Math.floor(val)) + suffix;
      if (t < 1) requestAnimationFrame(step);
      else el.textContent = prefix + target + suffix;
    }
    requestAnimationFrame(step);
  }

  function setupCounters() {
    const io = new IntersectionObserver((entries) => {
      entries.forEach(e => {
        if (e.isIntersecting) {
          animateCounter(e.target);
          io.unobserve(e.target);
        }
      });
    }, { threshold: 0.4 });
    document.querySelectorAll('[data-count]').forEach(el => io.observe(el));
  }

  /* ----- ROUTE MAP DRAW ---------------------------------------------- */
  function setupRouteMap() {
    const map = document.querySelector('.us-map');
    if (!map) return;
    const io = new IntersectionObserver((entries) => {
      entries.forEach(e => {
        if (e.isIntersecting) {
          map.classList.add('in-view');
          io.unobserve(map);
        }
      });
    }, { threshold: 0.3 });
    io.observe(map);
  }

  /* ----- MOBILE NAV -------------------------------------------------- */
  window.toggleNav = function() {
    document.getElementById('navLinks')?.classList.toggle('open');
  };

  function setupNavClose() {
    document.querySelectorAll('.nav-links a').forEach(a => {
      a.addEventListener('click', () => {
        document.getElementById('navLinks')?.classList.remove('open');
      });
    });
  }

  /* ----- INIT -------------------------------------------------------- */
  function init() {
    injectTrucks();
    setupReveal();
    setupCounters();
    setupRouteMap();
    setupNavClose();
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();

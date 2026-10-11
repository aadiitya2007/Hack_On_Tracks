'use client';

import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';

export type LanguageCode = 'en' | 'hi' | 'mr' | 'gu' | 'ta' | 'bn';

export interface LanguageInfo {
  id: LanguageCode;
  name: string;
  native: string;
  region: string;
}

export const LANGUAGES: LanguageInfo[] = [
  { id: 'en', name: 'English (India)', native: 'English', region: 'Default • National' },
  { id: 'hi', name: 'Hindi', native: 'हिन्दी', region: 'उत्तर एवं मध्य भारत' },
  { id: 'mr', name: 'Marathi', native: 'मराठी', region: 'महाराष्ट्र' },
  { id: 'gu', name: 'Gujarati', native: 'ગુજરાતી', region: 'ગુજરાત' },
  { id: 'ta', name: 'Tamil', native: 'தமிழ்', region: 'தமிழ்நாடு' },
  { id: 'bn', name: 'Bengali', native: 'বাংলা', region: 'পশ্চিমবঙ্গ' },
];

export const TRANSLATIONS: Record<LanguageCode, Record<string, string>> = {
  en: {
    nav_dashboard: "Dashboard",
    nav_risk: "Risk Profile",
    nav_prediction: "Stock Insights",
    nav_news: "Market News",
    nav_community: "Community Forum",
    nav_accounts: "Accounts",
    nav_profile: "Profile & Settings",
    nav_learn: "Learn",
    nav_time_machine: "Time Machine",
    nav_sign_out: "Sign Out",
    live_sync_active: "Live Sync Active",
    accounts_linked: "Accounts Linked",
    plan_track_grow: "PLAN • TRACK • GROW",
    dashboard_title: "Portfolio Dashboard",
    dashboard_subtitle: "Consolidated real-time telemetry across linked Indian brokerages",
    live_feed: "Live Feed",
    syncing_feeds: "Syncing Feeds...",
    simulate_trade: "+ Simulate Trade",
    ai_advisory_title: "AI Advisory & Portfolio Strategy",
    ai_advisory_desc: "Personalized LLM guidance tailored to your classification level and live portfolio telemetry.",
    retake_quiz: "Re-take Skill Quiz",
    total_net_portfolio: "Total Net Portfolio",
    invested: "Invested",
    realized_unrealized_pnl: "Total Realized & Unrealized P&L",
    today_market_movement: "Today's Market Movement",
    multi_broker_telemetry: "Multi-Broker Telemetry",
    brokers_live: "Brokers Live",
    asset_allocation: "Asset Allocation & Diversification",
    consolidated_holdings: "Consolidated Multi-Broker Holdings",
    search_scrips: "Search scrips or ISIN...",
    col_asset: "Asset",
    col_broker: "Broker",
    col_qty: "Qty",
    col_avg_price: "Avg Price",
    col_ltp: "LTP / Current",
    col_current_value: "Current Value",
    col_gain_loss: "Overall Gain / P&L",
    all_accounts: "All Accounts",
    time_machine_projections: "Time Machine Projections",
    time_machine_desc: "Historical SIP & Lump Sum compounding growth analytics.",
    monthly_sip: "Monthly SIP Amount",
    time_horizon: "Time Horizon",
    years: "Years",
    expected_portfolio: "Expected Portfolio Value",
    run_projection: "Run Projection",
    lang_regional_title: "Regional Language & Localization",
    lang_regional_desc: "Select your preferred language for portfolio insights, ML predictions, and market summaries.",
    save_preferences: "Save Preferences",
    saved_successfully: "Saved Successfully!",
    currency_format_title: "Indian Currency Number System",
    currency_format_desc: "Display figures in Indian Lakhs/Crores or Millions",
    live_refresh_title: "Live Market Telemetry Refresh",
    live_refresh_desc: "Auto-sync interval across Zerodha, Groww & Upstox",
    session_mgmt: "Session Management",
    session_desc: "Log out of this device or switch investor profile",
    switch_account: "Sign Out / Switch →",
    order_executed: "Order Executed",
    ckyc_verified: "CKYC Verified",
    recent_executions: "Recent Executed Trades",
    quick_stats: "Portfolio Overview",
    positions_shown: "Positions Shown"
  },
  hi: {
    nav_dashboard: "डैशबोर्ड",
    nav_risk: "जोखिम प्रोफाइल",
    nav_prediction: "स्टॉक इनसाइट्स",
    nav_news: "मार्केट समाचार",
    nav_community: "कम्युनिटी फोरम",
    nav_accounts: "खाते",
    nav_profile: "प्रोफाइल और सेटिंग्स",
    nav_learn: "सीखें",
    nav_time_machine: "टाइम मशीन",
    nav_sign_out: "लॉग आउट",
    live_sync_active: "लाइव सिंक सक्रिय",
    accounts_linked: "खाते जुड़े हैं",
    plan_track_grow: "योजना • ट्रैक • प्रगति",
    dashboard_title: "पोर्टफोलियो डैशबोर्ड",
    dashboard_subtitle: "जुड़े हुए भारतीय ब्रोकरों का रीयल-टाइम डेटा",
    live_feed: "लाइव फीड",
    syncing_feeds: "सिंक हो रहा है...",
    simulate_trade: "+ ट्रेड सिमुलेशन",
    ai_advisory_title: "AI एडवाइजरी और निवेश रणनीति",
    ai_advisory_desc: "आपके निवेशक स्तर और लाइव पोर्टफोलियो टेलीमेट्री के अनुसार वैयक्तिकृत मार्गदर्शन।",
    retake_quiz: "क्विज़ दोबारा लें",
    total_net_portfolio: "कुल नेट पोर्टफोलियो",
    invested: "निवेशित पूंजी",
    realized_unrealized_pnl: "कुल वास्तविक और अवास्तविक लाभ/हानि (P&L)",
    today_market_movement: "आज का बाजार मूवमेंट",
    multi_broker_telemetry: "मल्टी-ब्रोकर टेलीमेट्री",
    brokers_live: "ब्रोकर लाइव",
    asset_allocation: "परिसंपत्ति आवंटन और विविधीकरण",
    consolidated_holdings: "एकत्रित मल्टी-ब्रोकर होल्डिंग्स",
    search_scrips: "शेयर या ISIN खोजें...",
    col_asset: "परिसंपत्ति",
    col_broker: "ब्रोकर",
    col_qty: "मात्रा",
    col_avg_price: "औसत भाव",
    col_ltp: "वर्तमान भाव (LTP)",
    col_current_value: "वर्तमान मूल्य",
    col_gain_loss: "कुल लाभ / हानि",
    all_accounts: "सभी खाते",
    time_machine_projections: "टाइम मशीन अनुमान",
    time_machine_desc: "ऐतिहासिक SIP और एकमुश्त निवेश कम्पाउंडिंग विकास विश्लेषण।",
    monthly_sip: "मासिक SIP राशि",
    time_horizon: "समय अवधि",
    years: "वर्ष",
    expected_portfolio: "अनुमानित कुल संपत्ति",
    run_projection: "अनुमान देखें",
    lang_regional_title: "क्षेत्रीय भाषा और स्थानीयकरण",
    lang_regional_desc: "पोर्टफोलियो, AI सुझाव और मार्केट इनसाइट्स के लिए अपनी पसंदीदा भाषा चुनें।",
    save_preferences: "प्राथमिकताएं सहेजें",
    saved_successfully: "सफलतापूर्वक सहेजा गया!",
    currency_format_title: "भारतीय मुद्रा संख्या प्रणाली",
    currency_format_desc: "आंकड़े भारतीय लाख/करोड़ या मिलियन में प्रदर्शित करें",
    live_refresh_title: "लाइव मार्केट टेलीमेट्री रीफ्रेश",
    live_refresh_desc: "Zerodha, Groww व Upstox का ऑटो-सिंक अंतराल",
    session_mgmt: "सत्र प्रबंधन",
    session_desc: "लॉग आउट करें या निवेशक प्रोफ़ाइल बदलें",
    switch_account: "लॉग आउट / बदलें →",
    order_executed: "ऑर्डर निष्पादित हुआ",
    ckyc_verified: "CKYC सत्यापित",
    recent_executions: "हाल के निष्पादित ट्रेड",
    quick_stats: "पोर्टफोलियो अवलोकन",
    positions_shown: "प्रदर्शित पोजीशन"
  },
  mr: {
    nav_dashboard: "डॅशबोर्ड",
    nav_risk: "जोखीम प्रोफाइल",
    nav_prediction: "स्टॉक इनसाइट्स",
    nav_news: "बाजार बातम्या",
    nav_community: "कम्युनिटी फोरम",
    nav_accounts: "खाती",
    nav_profile: "प्रोफाइल आणि सेटिंग्ज",
    nav_learn: "शिका",
    nav_time_machine: "टाईम मशीन",
    nav_sign_out: "बाहेर पडा",
    live_sync_active: "थेट सिंक सुरू",
    accounts_linked: "खाती जोडलेली आहेत",
    plan_track_grow: "नियोजन • ट्रॅक • वृद्धी",
    dashboard_title: "पोर्टफोलिओ डॅशबोर्ड",
    dashboard_subtitle: "जोडलेल्या भारतीय ब्रोकर्सचा रिअल-टाइम डेटा",
    live_feed: "थेट फीड",
    syncing_feeds: "सिंक होत आहे...",
    simulate_trade: "+ ट्रेड सिम्युलेट करा",
    ai_advisory_title: "AI सल्लागार आणि गुंतवणूक धोरण",
    ai_advisory_desc: "आपल्या गुंतवणूकदार वर्गीकरणानुसार वैयक्तिकृत मार्गदर्शन आणि थेट पोर्टफोलिओ विश्लेषण.",
    retake_quiz: "चाचणी पुन्हा द्या",
    total_net_portfolio: "एकूण निव्वळ पोर्टफोलिओ",
    invested: "गुंतवलेली रक्कम",
    realized_unrealized_pnl: "एकूण नफा आणि तोटा (P&L)",
    today_market_movement: "आजची बाजार हालचाल",
    multi_broker_telemetry: "मल्टी-ब्रोकर टेलिमेट्री",
    brokers_live: "ब्रोकर्स थेट",
    asset_allocation: "मालमत्ता वाटप आणि विविधता",
    consolidated_holdings: "एकत्रित मल्टी-ब्रोकर होल्डिंग्ज",
    search_scrips: "शेअर्स किंवा ISIN शोधा...",
    col_asset: "मालमत्ता",
    col_broker: "ब्रोकर",
    col_qty: "प्रमाण",
    col_avg_price: "सरासरी भाव",
    col_ltp: "चालू भाव (LTP)",
    col_current_value: "सध्याचे मूल्य",
    col_gain_loss: "एकूण नफा / तोटा",
    all_accounts: "सर्व खाती",
    time_machine_projections: "टाईम मशीन अंदाज",
    time_machine_desc: "ऐतिहासिक एसआयपी आणि एकरकमी गुंतवणुकीची चक्रवाढ वाढ विश्लेषण.",
    monthly_sip: "मासिक SIP रक्कम",
    time_horizon: "कालावधी",
    years: "वर्षे",
    expected_portfolio: "अपेक्षित एकूण मालमत्ता",
    run_projection: "अंदाज पहा",
    lang_regional_title: "प्रादेशिक भाषा आणि स्थानिकीकरण",
    lang_regional_desc: "पोर्टफोलिओ आणि विश्लेषणासाठी आपली पसंतीची भाषा निवडा.",
    save_preferences: "प्राधान्ये सेव्ह करा",
    saved_successfully: "यशस्वीरित्या सेव्ह झाले!",
    currency_format_title: "भारतीय चलन संख्या प्रणाली",
    currency_format_desc: "आकडेवारी लाख/कोटी किंवा दशलक्षामध्ये दाखवा",
    live_refresh_title: "थेट बाजार डेटा रीफ्रेश",
    live_refresh_desc: "Zerodha, Groww व Upstox चा ऑटो-सिंक वेळ",
    session_mgmt: "सत्र व्यवस्थापन",
    session_desc: "लॉग आउट करा किंवा प्रोफाइल बदला",
    switch_account: "लॉग आउट / बदला →",
    order_executed: "ऑर्डर पूर्ण झाली",
    ckyc_verified: "CKYC पडताळणीकृत",
    recent_executions: "नुकतेच झालेले व्यवहार",
    quick_stats: "पोर्टफोलिओ आढावा",
    positions_shown: "दाखवलेली पोझिशन्स"
  },
  gu: {
    nav_dashboard: "ડેશબોર્ડ",
    nav_risk: "જોખમ પ્રોફાઇલ",
    nav_prediction: "સ્ટોક ઇનસાઇટ્સ",
    nav_news: "બજાર સમાચાર",
    nav_community: "કમ્યુનિટી ફોરમ",
    nav_accounts: "ખાતાઓ",
    nav_profile: "પ્રોફાઇલ અને સેટિંગ્સ",
    nav_learn: "શીખો",
    nav_time_machine: "ટાઇમ મશીન",
    nav_sign_out: "લૉગ આઉટ",
    live_sync_active: "લાઇવ સિંક સક્રિય",
    accounts_linked: "ખાતાઓ જોડાયેલા છે",
    plan_track_grow: "યોજના • ટ્રેક • વૃદ્ધિ",
    dashboard_title: "પોર્ટફોલિયો ડેશબોર્ડ",
    dashboard_subtitle: "જોડાયેલા ભારતીય બ્રોકરેજનો રિયલ-ટાઇમ ડેટા",
    live_feed: "લાઇવ ફીડ",
    syncing_feeds: "સિંક થઈ રહ્યું છે...",
    simulate_trade: "+ ટ્રેડ સિમ્યુલેટ કરો",
    ai_advisory_title: "AI સલાહકાર અને રોકાણ વ્યૂહરચના",
    ai_advisory_desc: "તમારા સ્તર અને પોર્ટફોલિયો ટેલિમેટ્રી અનુસાર વ્યક્તિગત AI માર્ગદર્શન.",
    retake_quiz: "ક્વિઝ ફરીથી આપો",
    total_net_portfolio: "કુલ નેટ પોર્ટફોલિયો",
    invested: "રોકાણ કરેલી રકમ",
    realized_unrealized_pnl: "કુલ નફો અને નુકસાન (P&L)",
    today_market_movement: "આજની બજારની હિલચાલ",
    multi_broker_telemetry: "મલ્ટી-બ્રોકર ટેલિમેટ્રી",
    brokers_live: "બ્રોકર્સ લાઇવ",
    asset_allocation: "એસેટ એલોકેશન અને વિવિધતા",
    consolidated_holdings: "સંકલિત મલ્ટી-બ્રોકર હોલ્ડિંગ્સ",
    search_scrips: "શેર અથવા ISIN શોધો...",
    col_asset: "સંપત્તિ",
    col_broker: "બ્રોકર",
    col_qty: "જથ્થો",
    col_avg_price: "સરેરાશ ભાવ",
    col_ltp: "વર્તમાન ભાવ (LTP)",
    col_current_value: "વર્તમાન મૂલ્ય",
    col_gain_loss: "કુલ નફો / નુકસાન",
    all_accounts: "બધા ખાતાઓ",
    time_machine_projections: "ટાઇમ મશીન અંદાજો",
    time_machine_desc: "ઐતિહાસિક SIP અને એકમ રોકાણની ચક્રવૃદ્ધિ વૃદ્ધિનું વિશ્લેષણ.",
    monthly_sip: "માસિક SIP રકમ",
    time_horizon: "સમયગાળો",
    years: "વર્ષ",
    expected_portfolio: "અપેક્ષિત કુલ સંપત્તિ",
    run_projection: "અંદાજ જુઓ",
    lang_regional_title: "પ્રાદેશિક ભાષા અને સ્થાનિકીકરણ",
    lang_regional_desc: "પોર્ટફોલિયો અને વિશ્લેષણ માટે તમારી પસંદગીની ભાષા પસંદ કરો.",
    save_preferences: "પસંદગીઓ સાચવો",
    saved_successfully: "સફળતાપૂર્વક સાચવ્યું!",
    currency_format_title: "ભારતીય ચલણ નંબર સિસ્ટમ",
    currency_format_desc: "આંકડા લાખ/કરોડ અથવા મિલિયનમાં જુઓ",
    live_refresh_title: "માર્કેટ ડેટા રિફ્રેશ",
    live_refresh_desc: "Zerodha, Groww અને Upstox નો ઓટો-સિંક સમય",
    session_mgmt: "સત્ર વ્યવસ્થાપન",
    session_desc: "લૉગ આઉટ કરો અથવા પ્રોફાઇલ બદલો",
    switch_account: "લૉગ આઉટ / બદલો →",
    order_executed: "ઓર્ડર પૂર્ણ થયો",
    ckyc_verified: "CKYC ચકાસાયેલ",
    recent_executions: "તાજેતરના ટ્રેડ્સ",
    quick_stats: "પોર્ટફોલિયો વિહંગાવલોકન",
    positions_shown: "દર્શાવેલ પોઝિશન્સ"
  },
  ta: {
    nav_dashboard: "டாஷ்போர்டு",
    nav_risk: "இடர் சுயவிவரம்",
    nav_prediction: "பங்கு நுண்ணறிவு",
    nav_news: "சந்தை செய்திகள்",
    nav_community: "சமூக மன்றம்",
    nav_accounts: "கணக்குகள்",
    nav_profile: "சுயவிவரம் & அமைப்புகள்",
    nav_learn: "கற்றுக்கொள்ளுங்கள்",
    nav_time_machine: "கால இயந்திரம்",
    nav_sign_out: "வெளியேறு",
    live_sync_active: "நேரலை ஒத்திசைவு",
    accounts_linked: "கணக்குகள் இணைக்கப்பட்டுள்ளன",
    plan_track_grow: "திட்டம் • கண்காணிப்பு • வளர்ச்சி",
    dashboard_title: "போர்ட்ஃபோலியோ டாஷ்போர்டு",
    dashboard_subtitle: "இணைக்கப்பட்ட இந்திய தரகர்களின் நேரலை விவரங்கள்",
    live_feed: "நேரலை ஊட்டம்",
    syncing_feeds: "ஒத்திசைக்கப்படுகிறது...",
    simulate_trade: "+ வர்த்தக மாதிரி",
    ai_advisory_title: "AI ஆலோசனை & முதலீட்டு உத்தி",
    ai_advisory_desc: "உங்கள் முதலீட்டாளர் நிலைக்கு ஏற்ற தனிப்பயனாக்கப்பட்ட AI வழிகாட்டுதல்.",
    retake_quiz: "வினாடி வினாவை மீண்டும் எடுக்கவும்",
    total_net_portfolio: "மொத்த நிகர போர்ட்ஃபோலியோ",
    invested: "முதலீடு செய்த தொகை",
    realized_unrealized_pnl: "மொத்த லாபம் & இழப்பு (P&L)",
    today_market_movement: "இன்றைய சந்தை இயக்கம்",
    multi_broker_telemetry: "பல தரகர் டெலிமெட்ரி",
    brokers_live: "நேரலை தரகர்கள்",
    asset_allocation: "சொத்து ஒதுக்கீடு & பன்முகப்படுத்தல்",
    consolidated_holdings: "ஒருங்கிணைந்த பல தரகர் பங்குகள்",
    search_scrips: "பங்குகள் அல்லது ISIN தேடவும்...",
    col_asset: "சொத்து",
    col_broker: "தரகர்",
    col_qty: "அளவு",
    col_avg_price: "சராசரி விலை",
    col_ltp: "தற்போதைய விலை (LTP)",
    col_current_value: "தற்போதைய மதிப்பு",
    col_gain_loss: "ஒட்டுமொத்த லாபம் / இழப்பு",
    all_accounts: "அனைத்து கணக்குகள்",
    time_machine_projections: "கால இயந்திர கணிப்புகள்",
    time_machine_desc: "கூட்டு வளர்ச்சி SIP மற்றும் ஒட்டுமொத்த முதலீட்டு பகுப்பாய்வு.",
    monthly_sip: "மாதாந்திர SIP தொகை",
    time_horizon: "கால அளவு",
    years: "ஆண்டுகள்",
    expected_portfolio: "எதிர்பார்க்கப்படும் மொத்த மதிப்பு",
    run_projection: "கணிப்பை பார்க்கவும்",
    lang_regional_title: "பிராந்திய மொழி & உள்ளூர்மயமாக்கல்",
    lang_regional_desc: "போர்ட்ஃபோலியோ மற்றும் நுண்ணறிவுகளுக்கு விருப்பமான மொழியைத் தேர்ந்தெடுக்கவும்.",
    save_preferences: "விருப்பங்களைச் சேமிக்கவும்",
    saved_successfully: "வெற்றிகரமாக சேமிக்கப்பட்டது!",
    currency_format_title: "இந்திய நாணய எண் முறை",
    currency_format_desc: "இலட்சம்/கோடி அல்லது மில்லியனில் காட்டவும்",
    live_refresh_title: "நேரலை சந்தை புதுப்பிப்பு",
    live_refresh_desc: "Zerodha, Groww மற்றும் Upstox தானியங்கி ஒத்திசைவு",
    session_mgmt: "அமர்வு மேலாண்மை",
    session_desc: "வெளியேறவும் அல்லது சுயவிவரத்தை மாற்றவும்",
    switch_account: "வெளியேறு / மாற்று →",
    order_executed: "ஆர்டர் நிறைவேற்றப்பட்டது",
    ckyc_verified: "CKYC சரிபார்க்கப்பட்டது",
    recent_executions: "சமீபத்திய வர்த்தகங்கள்",
    quick_stats: "போர்ட்ஃபோலியோ மேலோட்டம்",
    positions_shown: "காட்டப்படும் நிலைகள்"
  },
  bn: {
    nav_dashboard: "ড্যাশবোর্ড",
    nav_risk: "ঝুঁকি প্রোফাইল",
    nav_prediction: "স্টক অন্তর্দৃষ্টি",
    nav_news: "বাজার সংবাদ",
    nav_community: "কমিউনিটি ফোরাম",
    nav_accounts: "অ্যাকাউন্টস",
    nav_profile: "প্রোফাইল ও সেটিংস",
    nav_learn: "শিখুন",
    nav_time_machine: "টাইম মেশিন",
    nav_sign_out: "সাইন আউট",
    live_sync_active: "লাইভ সিঙ্ক সক্রিয়",
    accounts_linked: "অ্যাকাউন্ট লিঙ্ক করা আছে",
    plan_track_grow: "পরিকল্পনা • ট্র্যাক • বৃদ্ধি",
    dashboard_title: "পোর্টফোলিও ড্যাশবোর্ড",
    dashboard_subtitle: "সংযুক্ত ভারতীয় ব্রোকারেজের রিয়েল-টাইম ডেটা",
    live_feed: "লাইভ ফিড",
    syncing_feeds: "সিঙ্ক হচ্ছে...",
    simulate_trade: "+ ট্রেড সিমুলেট করুন",
    ai_advisory_title: "AI পরামর্শ ও বিনিয়োগ কৌশল",
    ai_advisory_desc: "আপনার বিনিয়োগকারী স্তর এবং পোর্টফোলিও বিশ্লেষণের ভিত্তিতে ব্যক্তিগতকৃত পরামর্শ।",
    retake_quiz: "কুইজ পুনরায় দিন",
    total_net_portfolio: "মোট নেট পোর্টফোলিও",
    invested: "বিনিয়োগকৃত অর্থ",
    realized_unrealized_pnl: "মোট লাভ ও ক্ষতি (P&L)",
    today_market_movement: "আজকের বাজার গতিবিধি",
    multi_broker_telemetry: "মাল্টি-ব্রোকার টেলিমেট্রি",
    brokers_live: "ব্রোকার লাইভ",
    asset_allocation: "সম্পদ বরাদ্দ ও বৈচিত্র্যকরণ",
    consolidated_holdings: "একত্রিত মাল্টি-ব্রোকার হোল্ডিংস",
    search_scrips: "শেয়ার বা ISIN অনুসন্ধান করুন...",
    col_asset: "সম্পদ",
    col_broker: "ব্রোকার",
    col_qty: "পরিমাণ",
    col_avg_price: "গড় দাম",
    col_ltp: "বর্তমান মূল্য (LTP)",
    col_current_value: "বর্তমান মান",
    col_gain_loss: "মোট লাভ / ক্ষতি",
    all_accounts: "সব অ্যাকাউন্ট",
    time_machine_projections: "টাইম মেশিন পূর্বাভাস",
    time_machine_desc: "ঐতিহাসিক SIP এবং এককালীন বিনিয়োগের চক্রবৃদ্ধি বৃদ্ধির পূর্বাভাস।",
    monthly_sip: "মাসিক SIP পরিমাণ",
    time_horizon: "সময়কাল",
    years: "বছর",
    expected_portfolio: "প্রত্যাশিত মোট সম্পদ",
    run_projection: "পূর্বাভাস দেখুন",
    lang_regional_title: "আঞ্চলিক ভাষা ও স্থানীয়করণ",
    lang_regional_desc: "পোর্টফোলিও এবং অন্তর্দৃষ্টির জন্য আপনার পছন্দের ভাষা বেছে নিন।",
    save_preferences: "পছন্দসমূহ সংরক্ষণ করুন",
    saved_successfully: "সফলভাবে সংরক্ষিত হয়েছে!",
    currency_format_title: "ভারতীয় মুদ্রা সংখ্যা পদ্ধতি",
    currency_format_desc: "পরিসংখ্যান লক্ষ/কোটি বা মিলিয়নে প্রদর্শন করুন",
    live_refresh_title: "লাইভ মার্কেট ডেটা রিফ্রেশ",
    live_refresh_desc: "Zerodha, Groww এবং Upstox স্বয়ংক্রিয় সিঙ্ক সময়",
    session_mgmt: "সেশন পরিচালনা",
    session_desc: "সাইন আউট করুন বা প্রোফাইল পরিবর্তন করুন",
    switch_account: "সাইন আউট / পরিবর্তন →",
    order_executed: "অর্ডার সম্পন্ন হয়েছে",
    ckyc_verified: "CKYC যাচাইকৃত",
    recent_executions: "সাম্প্রতিক ট্রেড",
    quick_stats: "পোর্টফোলিও সংক্ষিপ্তসার",
    positions_shown: "প্রদর্শিত পজিশন"
  }
};

interface LanguageContextType {
  language: LanguageCode;
  setLanguage: (lang: LanguageCode) => void;
  t: (key: string, fallback?: string) => string;
  languages: LanguageInfo[];
}

const LanguageContext = createContext<LanguageContextType>({
  language: 'en',
  setLanguage: () => {},
  t: (key, fallback) => fallback || key,
  languages: LANGUAGES,
});

export function LanguageProvider({ children }: { children: React.ReactNode }) {
  const [language, setLanguageState] = useState<LanguageCode>('en');

  // Synchronize on initial mount from localStorage
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const stored = localStorage.getItem('unify_language') as LanguageCode;
      if (stored && ['en', 'hi', 'mr', 'gu', 'ta', 'bn'].includes(stored)) {
        setLanguageState(stored);
        document.documentElement.lang = stored;
      }
    }

    const handleStorage = (e: StorageEvent) => {
      if (e.key === 'unify_language' && e.newValue) {
        const nextLang = e.newValue as LanguageCode;
        if (['en', 'hi', 'mr', 'gu', 'ta', 'bn'].includes(nextLang)) {
          setLanguageState(nextLang);
          document.documentElement.lang = nextLang;
        }
      }
    };

    const handleCustomChange = (e: Event) => {
      const customEvent = e as CustomEvent<LanguageCode>;
      if (customEvent.detail && ['en', 'hi', 'mr', 'gu', 'ta', 'bn'].includes(customEvent.detail)) {
        setLanguageState(customEvent.detail);
        document.documentElement.lang = customEvent.detail;
      }
    };

    window.addEventListener('storage', handleStorage);
    window.addEventListener('unify_language_changed', handleCustomChange);

    return () => {
      window.removeEventListener('storage', handleStorage);
      window.removeEventListener('unify_language_changed', handleCustomChange);
    };
  }, []);

  const setLanguage = useCallback((lang: LanguageCode) => {
    setLanguageState(lang);
    if (typeof window !== 'undefined') {
      localStorage.setItem('unify_language', lang);
      document.documentElement.lang = lang;
      window.dispatchEvent(new CustomEvent('unify_language_changed', { detail: lang }));
    }
  }, []);

  const t = useCallback((key: string, fallback?: string): string => {
    const langDict = TRANSLATIONS[language];
    if (langDict && langDict[key]) {
      return langDict[key];
    }
    // Fallback to English
    if (TRANSLATIONS.en[key]) {
      return TRANSLATIONS.en[key];
    }
    return fallback || key;
  }, [language]);

  return (
    <LanguageContext.Provider value={{ language, setLanguage, t, languages: LANGUAGES }}>
      {children}
    </LanguageContext.Provider>
  );
}

export function useLanguage() {
  return useContext(LanguageContext);
}

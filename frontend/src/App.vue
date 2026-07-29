<template>
  <div class="app-wrapper facebook" :class="{ 'khmer-font': currentLang === 'kh' }">
    
    <!-- Custom Toast -->
    <transition name="toast-slide">
      <div v-if="toast.visible" class="custom-toast" :class="toast.type">
        <div class="toast-icon-wrapper">
          <svg v-if="toast.type === 'success'" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path><polyline points="22 4 12 14.01 9 11.01"></polyline></svg>
          <svg v-if="toast.type === 'error'" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"></circle><line x1="15" y1="9" x2="9" y2="15"></line><line x1="9" y1="9" x2="15" y2="15"></line></svg>
        </div>
        <div class="toast-content">
          <h4>{{ toast.title }}</h4>
          <p>{{ toast.message }}</p>
        </div>
        <button class="toast-close" @click="toast.visible = false">×</button>
        <div class="toast-progress"></div>
      </div>
    </transition>

    <!-- Navbar Header -->
    <header class="navbar">
      <div class="nav-content">
        <div class="nav-logo" style="cursor: pointer;" @click="navigateTo('top')">
           <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="nav-icon"><polygon points="12 2 2 7 12 12 22 7 12 2"></polygon><polyline points="2 17 12 22 22 17"></polyline><polyline points="2 12 12 17 22 12"></polyline></svg>
           <span>OmniTool</span>
        </div>
        <nav class="nav-links">
           <a href="#" @click.prevent="navigateTo('tool')">{{ t('toolkit') }}</a>
           <a href="#" @click.prevent="navigateTo('features')">{{ t('features') }}</a>
           <a href="#" @click.prevent="navigateTo('faq')">{{ t('faq') }}</a>
           <button class="lang-toggle" @click="toggleLang">
             <span :class="{ active: currentLang === 'eng' }">EN</span>
             <span class="divider">/</span>
             <span :class="{ active: currentLang === 'kh' }">KH</span>
           </button>
        </nav>
      </div>
    </header>

    <!-- Background Elements -->
    <div class="background-elements">
      <div class="blob blob-1 facebook"></div>
      <div class="blob blob-2 facebook"></div>
      <div class="blob blob-3 facebook"></div>
    </div>

    <!-- Main Content -->
    <main class="main-content">
      
      <!-- HOME PAGE -->
      <div v-if="currentPage === 'home'">
        <!-- Hero Section -->
        <section class="hero-section">
          <h1 class="hero-title">{{ t('heroTitle') }}</h1>
          <p class="hero-desc">{{ t('heroDesc') }}</p>
          <a href="#" @click.prevent="navigateTo('tool')" class="cta-btn">{{ t('startBtn') }}</a>
        </section>

      <!-- Tool Section -->
      <section id="tool" class="tool-section">
        <div class="glass-card">
          <div class="header">
            <div class="logo-placeholder facebook">
              <svg viewBox="0 0 24 24" fill="currentColor" class="social-icon">
                <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.469h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.469h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
              </svg>
            </div>
            
            <div class="tabs main-tabs">
              <button 
                :class="['tab-btn', { active: activeTab === 'extractor' }]" 
                @click="activeTab = 'extractor'"
              >
                {{ t('tabFb') }}
              </button>
              <button 
                :class="['tab-btn', { active: activeTab === '2fa' }]" 
                @click="activeTab = '2fa'"
              >
                {{ t('tab2fa') }}
              </button>
            </div>
          </div>
          
          <!-- Extractor Tab -->
          <div v-show="activeTab === 'extractor'" class="tab-content">
            <p class="subtitle">{{ t('fbSubtitle') }}</p>

            <transition name="fade">
              <form @submit.prevent="fetchUserId" class="extract-form">
                <div class="input-group">
                  <input 
                    type="url" 
                    v-model="profileUrl" 
                    :placeholder="t('fbPlaceholder')" 
                    :required="activeTab === 'extractor'" 
                    class="url-input"
                    :class="{ 'has-value': profileUrl.length > 0 }"
                  />
                  <button type="submit" :disabled="isLoading" class="action-btn facebook">
                    <span v-if="!isLoading">{{ t('extractBtn') }}</span>
                    <span v-else class="loader"></span>
                  </button>
                </div>
              </form>
            </transition>

            <!-- Success Result -->
            <transition name="fade">
              <div v-if="resultId" class="result-container">
                <div class="result-box success">
                  <div class="result-content">
                    <span class="result-label">{{ t('extractedId') }}</span>
                    <span class="result-value">{{ resultId }}</span>
                  </div>
                  <button class="copy-btn" @click="copyToClipboard(resultId, 'id')" title="Copy to clipboard">
                    <svg v-if="!copiedId" viewBox="0 0 24 24" width="20" height="20" stroke="currentColor" stroke-width="2" fill="none"><rect x="9" y="9" width="13" height="13" rx="2" ry="2"></rect><path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"></path></svg>
                    <svg v-else viewBox="0 0 24 24" width="20" height="20" stroke="#4ade80" stroke-width="2" fill="none"><polyline points="20 6 9 17 4 12"></polyline></svg>
                  </button>
                </div>
              </div>
            </transition>
          </div>

          <!-- 2FA Tab -->
          <div v-show="activeTab === '2fa'" class="tab-content">
            <p class="subtitle">{{ t('twoFaSubtitle') }}</p>
            <form @submit.prevent="submitTotp" class="extract-form">
              <div class="input-group">
                <input 
                  type="text" 
                  v-model="totpSecretInput" 
                  :placeholder="t('twoFaPlaceholder')" 
                  class="url-input"
                  :class="{ 'has-value': totpSecretInput.length > 0 }"
                  autocomplete="off"
                />
                <button type="submit" class="action-btn facebook" :disabled="!totpSecretInput">
                  <span>{{ t('generateBtn') }}</span>
                </button>
              </div>
            </form>

            <transition name="fade">
              <div v-if="activeTotpSecret" class="result-container">
                <div class="result-box success" :class="{'warning': totpCode === 'Invalid Key'}">
                  <div class="result-content">
                    <span class="result-label" v-if="totpCode !== 'Invalid Key'">
                      {{ t('authCode') }}
                      <span class="time-badge">{{ totpTimeRemaining }}s</span>
                    </span>
                    <span class="result-label" v-else>{{ t('error') }}</span>
                    
                    <span class="result-value" :class="{'invalid-code': totpCode === 'Invalid Key'}">
                      {{ formatTotp(totpCode) }}
                    </span>
                  </div>
                  
                  <button v-if="totpCode !== 'Invalid Key'" class="copy-btn" @click="copyToClipboard(totpCode, '2fa')" title="Copy to clipboard">
                    <svg v-if="!copied2Fa" viewBox="0 0 24 24" width="20" height="20" stroke="currentColor" stroke-width="2" fill="none"><rect x="9" y="9" width="13" height="13" rx="2" ry="2"></rect><path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"></path></svg>
                    <svg v-else viewBox="0 0 24 24" width="20" height="20" stroke="#4ade80" stroke-width="2" fill="none"><polyline points="20 6 9 17 4 12"></polyline></svg>
                  </button>
                </div>
              </div>
            </transition>
          </div>

        </div>
      </section>

      <!-- Features / Info Section -->
      <section id="features" class="info-section">
        <div class="info-container">
          <h2 class="section-title">{{ t('whatTitle') }}</h2>
          <p class="section-desc">{{ t('whatDesc') }}</p>
          
          <div class="features-grid">
            <div class="feature-card">
              <div class="feature-icon-wrapper">
                <span class="feature-icon">🔍</span>
              </div>
              <h3>{{ t('feat1Title') }}</h3>
              <p>{{ t('feat1Desc') }}</p>
            </div>
            <div class="feature-card">
              <div class="feature-icon-wrapper">
                <span class="feature-icon">🔐</span>
              </div>
              <h3>{{ t('feat2Title') }}</h3>
              <p>{{ t('feat2Desc') }}</p>
            </div>
            <div class="feature-card">
              <div class="feature-icon-wrapper">
                <span class="feature-icon">⚡</span>
              </div>
              <h3>{{ t('feat3Title') }}</h3>
              <p>{{ t('feat3Desc') }}</p>
            </div>
          </div>
        </div>
      </section>
      
      <!-- FAQ Section -->
      <section id="faq" class="info-section alternate-bg">
        <div class="info-container">
          <h2 class="section-title">{{ t('faqTitle') }}</h2>
          <div class="faq-list">
             <div class="faq-item">
               <h4>{{ t('faq1q') }}</h4>
               <p>{{ t('faq1a') }}</p>
             </div>
             <div class="faq-item">
               <h4>{{ t('faq2q') }}</h4>
               <p>{{ t('faq2a') }}</p>
             </div>
          </div>
        </div>
      </section>
      </div> <!-- END HOME PAGE -->

      <!-- LEGAL PAGES -->
      <div v-if="currentPage === 'privacy'" class="legal-page">
        <div class="glass-card legal-card">
          <button class="back-btn" @click="currentPage = 'home'">← {{ t('backHome') }}</button>
          <h2>{{ t('privacy') }}</h2>
          <div class="legal-content">
            <p>{{ t('privacyContent') }}</p>
          </div>
        </div>
      </div>

      <div v-if="currentPage === 'terms'" class="legal-page">
        <div class="glass-card legal-card">
          <button class="back-btn" @click="currentPage = 'home'">← {{ t('backHome') }}</button>
          <h2>{{ t('terms') }}</h2>
          <div class="legal-content">
            <p>{{ t('termsContent') }}</p>
          </div>
        </div>
      </div>

    </main>

    <!-- Footer -->
    <footer class="footer">
      <div class="footer-content">
        <div class="footer-brand">
          <div class="nav-logo" style="cursor: pointer;" @click="navigateTo('top')">
             <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" class="nav-icon" style="width: 20px; height: 20px;"><polygon points="12 2 2 7 12 12 22 7 12 2"></polygon><polyline points="2 17 12 22 22 17"></polyline><polyline points="2 12 12 17 22 12"></polyline></svg>
             <span>OmniTool</span>
          </div>
          <p class="footer-tagline">{{ t('footerTagline') }}</p>
        </div>
        <div class="footer-links">
          <div class="link-column">
             <h4>{{ t('product') }}</h4>
             <a href="#" @click.prevent="navigateTo('tool', 'extractor')">{{ t('tabFb') }}</a>
             <a href="#" @click.prevent="navigateTo('tool', '2fa')">{{ t('tab2fa') }}</a>
          </div>
          <div class="link-column">
             <h4>{{ t('legal') }}</h4>
             <a href="#" @click.prevent="currentPage = 'privacy'">{{ t('privacy') }}</a>
             <a href="#" @click.prevent="currentPage = 'terms'">{{ t('terms') }}</a>
          </div>
        </div>
      </div>
      <div class="footer-bottom">
        {{ t('rights') }}
      </div>
    </footer>
  </div>
</template>

<script setup>
import { ref, onMounted, onUnmounted, nextTick } from 'vue';
import { TOTP } from 'totp-generator';

// i18n Translations
const currentLang = ref(localStorage.getItem('omnitool_lang') || 'eng'); // 'eng' or 'kh'

const translations = {
  eng: {
    toolkit: 'Toolkit',
    features: 'Features',
    faq: 'FAQ',
    heroTitle: 'The Ultimate FB & Security Toolkit',
    heroDesc: 'Extract hidden numeric user IDs from Facebook profiles and generate secure Time-Based One-Time Passwords (TOTP) instantly—all in one place.',
    startBtn: 'Start Using Tools',
    tabFb: 'FB ID Extractor',
    tab2fa: '2FA Generator',
    fbSubtitle: 'Uncover the hidden numeric ID of any public Facebook profile, page, or post instantly.',
    fbPlaceholder: 'e.g., https://www.facebook.com/username',
    extractBtn: 'Extract ID',
    extractedId: 'Extracted ID',
    twoFaSubtitle: 'Generate standard 6-digit Time-Based One-Time Passwords from your secret key.',
    twoFaPlaceholder: 'Enter 2FA Secret (e.g., JBSWY3DPEHPK...)',
    generateBtn: 'Generate',
    authCode: 'Authenticator Code',
    error: 'Error',
    whatTitle: 'What can this tool do?',
    whatDesc: 'OmniTool is built for developers, OSINT researchers, and privacy-conscious individuals looking for a reliable, all-in-one web utility.',
    feat1Title: 'Facebook ID Extraction',
    feat1Desc: 'Facebook hides the unique numeric user IDs behind custom usernames. Our tool scrapes the raw data to extract these permanent IDs for any public profile, page or post.',
    feat2Title: '2FA Generator',
    feat2Desc: 'Generate secure, time-based one-time passwords (TOTP) directly in your browser. No need to reach for your phone. Your secret keys are processed entirely client-side, ensuring maximum security and privacy.',
    feat3Title: 'Lightning Fast & Secure',
    feat3Desc: 'Designed with a modern architecture, all computations are blazingly fast. We do not store or log your queries, ensuring your workflow remains completely private.',
    faqTitle: 'Frequently Asked Questions',
    faq1q: 'Why do I need a numeric Facebook ID?',
    faq1a: 'Usernames change, but underlying numeric IDs are permanent. If you are building integrations with the Graph API, tracking profiles, or managing large datasets, you need the static numeric ID.',
    faq2q: 'Is the 2FA Generator safe to use?',
    faq2a: 'Yes. The TOTP generation relies purely on frontend JavaScript. Your secret keys are never transmitted to our backend servers, meaning they cannot be intercepted or logged.',
    footerTagline: 'Empowering developers & researchers with lightning-fast utilities.',
    product: 'Product',
    legal: 'Legal',
    privacy: 'Privacy Policy',
    terms: 'Terms of Service',
    rights: '© 2026 OmniTool Suite. All rights reserved.',
    success: 'Success!',
    idExtracted: 'ID successfully extracted',
    connectionErr: 'Connection Error',
    invalidChars: 'A real 2FA key only contains letters A-Z and numbers 2-7.',
    fakeKey: 'Fake Key Detected',
    fakeLength: 'Real 2FA keys are exactly 16 or 32 characters long.',
    twoFaActive: '2FA Generator active',
    copied: 'Copied',
    idCopied: 'ID copied to clipboard',
    twoFaCopied: '2FA code copied to clipboard',
    apiError: 'An error occurred while connecting to the backend server.',
    failedExtract: 'Failed to extract ID.',
    backHome: 'Back to Home',
    privacyContent: 'Last updated: July 2026. OmniTool respects your privacy. We do not store, log, or share your generated 2FA secrets or extracted Facebook IDs. All 2FA generation occurs locally in your browser. Any server requests made for ID extraction are temporary and immediately discarded.',
    termsContent: 'By using OmniTool, you agree to use it responsibly and legally. The tools provided (FB ID Extractor, 2FA Generator) are for educational, security, and legitimate research purposes only. Do not use this service to violate Facebook\'s Terms of Service or for malicious intent. We provide this tool "as is" without warranty.'
  },
  kh: {
    toolkit: 'ឧបករណ៍',
    features: 'លក្ខណៈពិសេស',
    faq: 'សំណួរញឹកញាប់',
    heroTitle: 'ប្រព័ន្ធ FB និងឧបករណ៍សុវត្ថិភាពដ៏ល្អបំផុត',
    heroDesc: 'ទាញយកលេខសម្គាល់គណនីហ្វេសប៊ុក និងបង្កើតលេខកូដសុវត្ថិភាព 2FA ភ្លាមៗនៅកន្លែងតែមួយ។',
    startBtn: 'ចាប់ផ្តើមប្រើប្រាស់',
    tabFb: 'ទាញយក FB ID',
    tab2fa: 'បង្កើតលេខកូដ 2FA',
    fbSubtitle: 'ស្វែងរកលេខសម្គាល់ដែលលាក់របស់គណនី ផេក ឬការបង្ហោះហ្វេសប៊ុកសាធារណៈភ្លាមៗ។',
    fbPlaceholder: 'ឧទាហរណ៍៖ https://www.facebook.com/username',
    extractBtn: 'ទាញយក ID',
    extractedId: 'ID ដែលបានទាញយក',
    twoFaSubtitle: 'បង្កើតលេខកូដសម្ងាត់ 6 ខ្ទង់ស្តង់ដារពីលេខកូដសម្ងាត់របស់អ្នក។',
    twoFaPlaceholder: 'បញ្ចូលលេខកូដ 2FA (ឧទាហរណ៍៖ JBSWY3...)',
    generateBtn: 'បង្កើតកូដ',
    authCode: 'លេខកូដផ្ទៀងផ្ទាត់',
    error: 'កំហុស',
    whatTitle: 'តើឧបករណ៍នេះអាចធ្វើអ្វីបានខ្លះ?',
    whatDesc: 'OmniTool ត្រូវបានបង្កើតឡើងសម្រាប់អ្នកអភិវឌ្ឍន៍ អ្នកស្រាវជ្រាវ OSINT និងបុគ្គលដែលយកចិត្តទុកដាក់លើឯកជនភាព ដែលកំពុងស្វែងរកឧបករណ៍ដែលអាចទុកចិត្តបាន។',
    feat1Title: 'ការទាញយក Facebook ID',
    feat1Desc: 'ហ្វេសប៊ុកលាក់លេខសម្គាល់អ្នកប្រើប្រាស់ពីក្រោយឈ្មោះអ្នកប្រើប្រាស់។ ឧបករណ៍របស់យើងទាញយកទិន្នន័យដើម្បីស្វែងរក ID អចិន្ត្រៃយ៍ទាំងនេះសម្រាប់គណនីសាធារណៈ។',
    feat2Title: 'បង្កើតលេខកូដ 2FA',
    feat2Desc: 'បង្កើតលេខកូដផ្ទៀងផ្ទាត់ 2FA ដោយសុវត្ថិភាពដោយផ្ទាល់នៅក្នុងកម្មវិធីរុករករបស់អ្នក។ លេខកូដសម្ងាត់របស់អ្នកត្រូវបានដំណើរការនៅលើម៉ាស៊ីនរបស់អ្នកផ្ទាល់។',
    feat3Title: 'លឿនដូចរន្ទះ និងសុវត្ថិភាព',
    feat3Desc: 'រចនាឡើងជាមួយនឹងស្ថាបត្យកម្មទំនើប ការគណនាទាំងអស់គឺលឿនបំផុត។ យើងមិនរក្សាទុកទិន្នន័យរបស់អ្នកទេ ដើម្បីធានាថាវាឯកជនទាំងស្រុង។',
    faqTitle: 'សំណួរដែលសួរញឹកញាប់',
    faq1q: 'ហេតុអ្វីបានជាខ្ញុំត្រូវការ Facebook ID?',
    faq1a: 'ឈ្មោះអ្នកប្រើប្រាស់អាចផ្លាស់ប្តូរ ប៉ុន្តែលេខ ID គឺអចិន្ត្រៃយ៍។ ប្រសិនបើអ្នកកំពុងបង្កើតការតភ្ជាប់ជាមួយ Graph API ឬគ្រប់គ្រងទិន្នន័យ អ្នកត្រូវការលេខ ID នេះ។',
    faq2q: 'តើការបង្កើតលេខកូដ 2FA មានសុវត្ថិភាពដែរឬទេ?',
    faq2a: 'បាទ/ចាស។ ការបង្កើតលេខកូដ 2FA ពឹងផ្អែកទាំងស្រុងលើ JavaScript ខាងមុខ (Frontend)។ លេខកូដសម្ងាត់របស់អ្នកមិនត្រូវបានបញ្ជូនទៅម៉ាស៊ីនមេរបស់យើងទេ។',
    footerTagline: 'ផ្តល់អំណាចដល់អ្នកអភិវឌ្ឍន៍ និងអ្នកស្រាវជ្រាវជាមួយនឹងឧបករណ៍ដ៏លឿន។',
    product: 'ផលិតផល',
    legal: 'ផ្លូវច្បាប់',
    privacy: 'គោលការណ៍ឯកជនភាព',
    terms: 'លក្ខខណ្ឌប្រើប្រាស់',
    rights: '© 2026 OmniTool Suite. រក្សាសិទ្ធិគ្រប់យ៉ាង។',
    success: 'ជោគជ័យ!',
    idExtracted: 'ទាញយក ID បានដោយជោគជ័យ',
    connectionErr: 'បញ្ហាក្នុងការភ្ជាប់បណ្តាញ',
    invalidChars: 'លេខកូដ 2FA ត្រូវតែមានតែអក្សរ A-Z និងលេខ 2-7 ប៉ុណ្ណោះ។',
    fakeKey: 'រកឃើញកូដក្លែងក្លាយ',
    fakeLength: 'លេខកូដ 2FA ពិតប្រាកដមានប្រវែង 16 ឬ 32 តួអក្សរ។',
    twoFaActive: '2FA កំពុងដំណើរការ',
    copied: 'បានចម្លង',
    idCopied: 'បានចម្លង ID ទុក',
    twoFaCopied: 'បានចម្លងលេខកូដ 2FA ទុក',
    apiError: 'មានបញ្ហាក្នុងការភ្ជាប់ទៅម៉ាស៊ីនមេ។',
    failedExtract: 'ការទាញយក ID បរាជ័យ។',
    backHome: 'ត្រឡប់ទៅទំព័រដើម',
    privacyContent: 'ធ្វើបច្ចុប្បន្នភាពចុងក្រោយ៖ កក្កដា ២០២៦។ OmniTool គោរពឯកជនភាពរបស់អ្នក។ យើងមិនរក្សាទុក ឬចែករំលែកលេខកូដសម្ងាត់ 2FA ឬលេខ Facebook ID របស់អ្នកទេ។ ការបង្កើត 2FA ទាំងអស់កើតឡើងនៅក្នុងកម្មវិធីរុករករបស់អ្នកផ្ទាល់។ រាល់សំណើទៅកាន់ម៉ាស៊ីនមេ គឺធ្វើឡើងបណ្តោះអាសន្ន និងត្រូវបានលុបចោលភ្លាមៗ។',
    termsContent: 'ដោយប្រើប្រាស់ OmniTool អ្នកយល់ព្រមប្រើវាដោយការទទួលខុសត្រូវ និងស្របច្បាប់។ ឧបករណ៍ទាំងនេះត្រូវបានផ្តល់ជូនសម្រាប់គោលបំណងស្រាវជ្រាវ ការអប់រំ និងសុវត្ថិភាពតែប៉ុណ្ណោះ។ កុំប្រើសេវាកម្មនេះក្នុងគោលបំណងទុច្ចរិត។ យើងផ្តល់ឧបករណ៍នេះ "ដូចដែលមានស្រាប់" ដោយគ្មានការធានាអ្វីទាំងអស់។'
  }
};

const t = (key) => translations[currentLang.value][key] || key;

const toggleLang = () => {
  currentLang.value = currentLang.value === 'eng' ? 'kh' : 'eng';
  localStorage.setItem('omnitool_lang', currentLang.value);
};

const currentPage = ref('home'); // 'home', 'privacy', 'terms'
const activeTab = ref('extractor'); // 'extractor' | '2fa'

// Navigation Logic
const navigateTo = async (sectionId, tab = null) => {
  if (currentPage.value !== 'home') {
    currentPage.value = 'home';
    await nextTick();
  }
  
  if (tab) {
    activeTab.value = tab;
  }
  
  if (sectionId) {
    if (sectionId === 'top') {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    } else {
      const el = document.getElementById(sectionId);
      if (el) {
        el.scrollIntoView({ behavior: 'smooth' });
      }
    }
  }
};

// Toast Notification Logic
const toast = ref({
  visible: false,
  type: 'success', // 'success' or 'error'
  title: '',
  message: ''
});
let toastTimeout = null;

const showToast = (type, title, message) => {
  toast.value = { visible: true, type, title, message };
  if (toastTimeout) clearTimeout(toastTimeout);
  toastTimeout = setTimeout(() => {
    toast.value.visible = false;
  }, 3500); // Hide after 3.5 seconds
};

// Extractor logic
const profileUrl = ref('');
const isLoading = ref(false);
const resultId = ref(null);
const errorMessage = ref('');
const copiedId = ref(false);

const fetchUserId = async () => {
  isLoading.value = true;
  resultId.value = null;
  errorMessage.value = '';
  copiedId.value = false;

  try {
    const apiUrl = import.meta.env.VITE_API_URL || 'http://localhost:3000';
    const response = await fetch(`${apiUrl}/api/extract-id`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ 
        profileUrl: profileUrl.value,
        platform: 'facebook'
      }),
    });

    const data = await response.json();

    if (response.ok && data.success) {
      resultId.value = data.id;
      profileUrl.value = '';
      showToast('success', t('success'), t('idExtracted'));
    } else {
      errorMessage.value = data.error || t('failedExtract');
      showToast('error', t('error'), errorMessage.value);
    }
  } catch (error) {
    errorMessage.value = t('apiError');
    showToast('error', t('connectionErr'), errorMessage.value);
  } finally {
    isLoading.value = false;
  }
};

// 2FA Logic
const totpSecretInput = ref('');
const activeTotpSecret = ref('');
const totpCode = ref(null);
const totpTimeRemaining = ref(30);
const copied2Fa = ref(false);
let totpInterval = null;

const submitTotp = () => {
  if (totpSecretInput.value) {
    const rawSecret = totpSecretInput.value.replace(/\s+/g, '');
    
    // Check if it's just a random keyboard smash by enforcing standard 2FA key lengths
    if (![16, 24, 32, 64].includes(rawSecret.length)) {
      showToast('error', t('fakeKey'), `${t('fakeLength')} You typed ${rawSecret.length} characters.`);
      return;
    }

    // Strict validation: Base32 (A-Z, 2-7)
    if (!/^[A-Z2-7]+$/i.test(rawSecret)) {
      showToast('error', t('error'), t('invalidChars'));
      return;
    }

    activeTotpSecret.value = rawSecret;
    totpSecretInput.value = '';
    generateTotp();
    showToast('success', t('success'), t('twoFaActive'));
  }
};

const generateTotp = async () => {
  if (!activeTotpSecret.value) {
    totpCode.value = null;
    return;
  }
  
  try {
    const secret = activeTotpSecret.value; // Already stripped of spaces
    const { otp, expires } = await TOTP.generate(secret);
    totpCode.value = otp;
    
    const now = Date.now();
    totpTimeRemaining.value = Math.max(0, Math.floor((expires - now) / 1000));
  } catch (error) {
    totpCode.value = 'Invalid Key';
    totpTimeRemaining.value = 0;
  }
};

const formatTotp = (code) => {
  if (!code || code === 'Invalid Key') return code;
  return code.slice(0, 3) + ' ' + code.slice(3);
};

onMounted(() => {
  totpInterval = setInterval(generateTotp, 1000);
});

onUnmounted(() => {
  if (totpInterval) clearInterval(totpInterval);
});

// Common
const copyToClipboard = async (text, type) => {
  if (text) {
    await navigator.clipboard.writeText(text.replace(/\s/g, ''));
    if (type === 'id') {
      copiedId.value = true;
      showToast('success', t('copied'), t('idCopied'));
      setTimeout(() => { copiedId.value = false; }, 2000);
    } else if (type === '2fa') {
      copied2Fa.value = true;
      showToast('success', t('copied'), t('twoFaCopied'));
      setTimeout(() => { copied2Fa.value = false; }, 2000);
    }
  }
};
</script>

<style>
/* Global resets */
* {
  box-sizing: border-box;
  margin: 0;
  padding: 0;
}
html {
  scroll-behavior: smooth;
}
body {
  font-family: 'Inter', -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif;
  background-color: #0f172a;
  color: #f8fafc;
  overflow-x: hidden;
}
.khmer-font {
  font-family: 'Siemreap', 'Khmer OS Siemreap', 'Inter', sans-serif !important;
}
.khmer-font h1, .khmer-font h2, .khmer-font h3, .khmer-font h4, .khmer-font p, .khmer-font span, .khmer-font button, .khmer-font input, .khmer-font a {
  font-family: 'Siemreap', 'Khmer OS Siemreap', 'Inter', sans-serif !important;
}
</style>

<style scoped>
.app-wrapper {
  position: relative;
  width: 100%;
  min-height: 100vh;
  display: flex;
  flex-direction: column;
  z-index: 1;
}

/* Custom Toast Notification */
.custom-toast {
  position: fixed;
  top: 2rem;
  right: 2rem;
  z-index: 9999;
  background: rgba(30, 41, 59, 0.85);
  backdrop-filter: blur(16px);
  -webkit-backdrop-filter: blur(16px);
  border: 1px solid rgba(255, 255, 255, 0.08);
  border-radius: 12px;
  padding: 1.25rem 1.5rem;
  display: flex;
  align-items: flex-start;
  gap: 1.25rem;
  min-width: 320px;
  max-width: 400px;
  box-shadow: 0 25px 50px -12px rgba(0, 0, 0, 0.5), 0 0 0 1px rgba(255, 255, 255, 0.05);
  overflow: hidden;
}

.custom-toast.success { border-left: 5px solid #10b981; }
.custom-toast.error { border-left: 5px solid #ef4444; }

.toast-icon-wrapper {
  flex-shrink: 0;
  width: 26px;
  height: 26px;
}
.custom-toast.success .toast-icon-wrapper { color: #10b981; }
.custom-toast.error .toast-icon-wrapper { color: #ef4444; }

.toast-content {
  flex-grow: 1;
}
.toast-content h4 {
  color: #fff;
  font-size: 1.05rem;
  font-weight: 700;
  margin-bottom: 0.35rem;
}
.toast-content p {
  color: #94a3b8;
  font-size: 0.9rem;
  line-height: 1.5;
}

.toast-close {
  background: transparent;
  border: none;
  color: #64748b;
  font-size: 1.5rem;
  cursor: pointer;
  padding: 0;
  line-height: 1;
  transition: color 0.2s;
}
.toast-close:hover { color: #fff; }

.toast-progress {
  position: absolute;
  bottom: 0;
  left: 0;
  height: 4px;
  background: currentColor;
  width: 100%;
  animation: toast-progress-anim 3.5s linear forwards;
}
.custom-toast.success .toast-progress { color: #10b981; }
.custom-toast.error .toast-progress { color: #ef4444; }

@keyframes toast-progress-anim {
  0% { width: 100%; }
  100% { width: 0%; }
}

.toast-slide-enter-active, .toast-slide-leave-active {
  transition: all 0.5s cubic-bezier(0.175, 0.885, 0.32, 1.275);
}
.toast-slide-enter-from {
  opacity: 0;
  transform: translateX(120%) scale(0.9);
}
.toast-slide-leave-to {
  opacity: 0;
  transform: translateX(120%) scale(0.9);
}

/* NAVBAR */
.navbar {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  padding: 1rem 2rem;
  background: rgba(15, 23, 42, 0.8);
  backdrop-filter: blur(12px);
  border-bottom: 1px solid rgba(255, 255, 255, 0.05);
  z-index: 100;
  display: flex;
  justify-content: center;
}
.nav-content {
  width: 100%;
  max-width: 1200px;
  display: flex;
  justify-content: space-between;
  align-items: center;
}
.nav-logo {
  display: flex;
  align-items: center;
  gap: 0.75rem;
  font-weight: 700;
  font-size: 1.25rem;
  color: #fff;
  letter-spacing: -0.025em;
}
.nav-icon {
  width: 24px;
  height: 24px;
  color: #3b82f6;
}

.nav-links {
  display: flex;
  gap: 2rem;
  align-items: center;
}
.nav-links a {
  color: #94a3b8;
  text-decoration: none;
  font-weight: 500;
  font-size: 0.95rem;
  transition: color 0.2s;
}
.nav-links a:hover {
  color: #fff;
}

/* Language Toggle */
.lang-toggle {
  background: rgba(255, 255, 255, 0.05);
  border: 1px solid rgba(255, 255, 255, 0.1);
  border-radius: 20px;
  padding: 0.35rem 0.85rem;
  color: #64748b;
  cursor: pointer;
  display: flex;
  align-items: center;
  gap: 0.4rem;
  font-weight: 600;
  font-size: 0.8rem;
  transition: all 0.2s;
  margin-left: 0.5rem;
}
.lang-toggle:hover {
  background: rgba(255, 255, 255, 0.1);
}
.lang-toggle span.active {
  color: #3b82f6;
}
.lang-toggle .divider {
  color: #475569;
  font-weight: 400;
}

/* MAIN CONTENT */
.main-content {
  flex: 1;
  width: 100%;
  padding-top: 80px;
}

/* HERO SECTION */
.hero-section {
  text-align: center;
  padding: 6rem 2rem 4rem;
  max-width: 800px;
  margin: 0 auto;
  position: relative;
  z-index: 10;
}
.hero-title {
  font-size: 3.5rem;
  font-weight: 800;
  line-height: 1.4;
  padding-top: 0.2em;
  padding-bottom: 0.2em;
  margin-top: -0.2em;
  margin-bottom: 1.3rem;
  background: linear-gradient(to right, #ffffff, #94a3b8);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  letter-spacing: -0.025em;
}
.hero-desc {
  font-size: 1.25rem;
  color: #94a3b8;
  line-height: 1.6;
  margin-bottom: 2.5rem;
  max-width: 600px;
  margin-left: auto;
  margin-right: auto;
}
.cta-btn {
  display: inline-block;
  background: #3b82f6;
  color: #fff;
  padding: 1rem 2rem;
  border-radius: 12px;
  font-weight: 600;
  text-decoration: none;
  transition: all 0.3s;
  box-shadow: 0 10px 25px -5px rgba(59, 130, 246, 0.5);
}
.cta-btn:hover {
  background: #2563eb;
  transform: translateY(-2px);
  box-shadow: 0 15px 30px -5px rgba(59, 130, 246, 0.6);
}

/* TOOL SECTION */
.tool-section {
  display: flex;
  justify-content: center;
  padding: 2rem;
  position: relative;
  z-index: 10;
  margin-bottom: 6rem;
}

/* GLASS CARD */
.glass-card {
  background: rgba(30, 41, 59, 0.7);
  backdrop-filter: blur(16px);
  -webkit-backdrop-filter: blur(16px);
  border: 1px solid rgba(255, 255, 255, 0.08);
  border-radius: 24px;
  padding: 3rem 2.5rem;
  width: 100%;
  max-width: 540px;
  box-shadow: 0 25px 50px -12px rgba(0, 0, 0, 0.5), 0 0 0 1px rgba(255, 255, 255, 0.05);
}

.header {
  text-align: center;
  margin-bottom: 2rem;
}

.logo-placeholder {
  width: 72px;
  height: 72px;
  margin: 0 auto 1.5rem;
  background: linear-gradient(135deg, #1877f2, #0e5bbf);
  border-radius: 20px;
  display: flex;
  justify-content: center;
  align-items: center;
  box-shadow: 0 10px 25px -5px rgba(24, 119, 242, 0.4);
}

.social-icon { width: 40px; height: 40px; color: #fff; }

.subtitle {
  color: #94a3b8;
  font-size: 0.95rem;
  line-height: 1.5;
  text-align: center;
  margin-bottom: 1.5rem;
}

.tabs {
  display: flex;
  background: rgba(15, 23, 42, 0.4);
  padding: 0.35rem;
  border-radius: 12px;
  margin-bottom: 1.5rem;
}
.tab-btn {
  flex: 1;
  background: transparent;
  color: #94a3b8;
  border: none;
  padding: 0.75rem 1rem;
  border-radius: 10px;
  font-weight: 600;
  font-size: 0.95rem;
  cursor: pointer;
  transition: all 0.3s ease;
}
.tab-btn:hover { color: #f1f5f9; }
.tab-btn.active {
  background: rgba(255, 255, 255, 0.1);
  color: #fff;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.2);
}

.extract-form { margin-bottom: 2rem; }
.input-group { position: relative; display: flex; align-items: center; }
.url-input {
  width: 100%;
  background: rgba(15, 23, 42, 0.6);
  border: 1px solid rgba(148, 163, 184, 0.2);
  border-radius: 16px;
  padding: 1.125rem 1.5rem;
  padding-right: 130px;
  font-size: 1rem;
  color: #f1f5f9;
  transition: all 0.3s ease;
  font-family: inherit;
}
.url-input:focus {
  outline: none;
  border-color: #3b82f6;
  box-shadow: 0 0 0 3px rgba(59, 130, 246, 0.2);
  background: rgba(15, 23, 42, 0.8);
}
.url-input::placeholder { color: #64748b; }

.action-btn {
  position: absolute;
  right: 6px;
  top: 6px;
  bottom: 6px;
  background: linear-gradient(135deg, #3b82f6, #2563eb);
  color: white;
  border: none;
  border-radius: 12px;
  padding: 0 1.25rem;
  font-weight: 600;
  font-size: 0.9rem;
  cursor: pointer;
  transition: all 0.5s ease;
  box-shadow: 0 4px 12px rgba(37, 99, 235, 0.3);
  display: flex;
  justify-content: center;
  align-items: center;
  min-width: 110px;
}
.action-btn:hover:not(:disabled) { transform: translateY(-1px); filter: brightness(1.1); }
.action-btn:active:not(:disabled) { transform: translateY(0); }
.action-btn:disabled { background: #334155; color: #94a3b8; box-shadow: none; cursor: not-allowed; }

.loader {
  width: 18px;
  height: 18px;
  border: 2.5px solid rgba(255, 255, 255, 0.3);
  border-radius: 50%;
  border-top-color: #fff;
  animation: spin 0.8s linear infinite;
}
@keyframes spin { to { transform: rotate(360deg); } }

/* Result Box */
.result-box {
  border-radius: 12px;
  padding: 1.25rem 1.5rem;
  display: flex;
  align-items: center;
  justify-content: space-between;
}
.result-box.success { background: rgba(16, 185, 129, 0.1); border: 1px solid rgba(16, 185, 129, 0.2); }
.result-box.warning { background: rgba(245, 158, 11, 0.1); border: 1px solid rgba(245, 158, 11, 0.2); }
.result-content { display: flex; flex-direction: column; gap: 0.25rem; }
.result-label {
  font-size: 0.75rem; text-transform: uppercase; letter-spacing: 0.05em;
  color: #34d399; font-weight: 600; display: flex; align-items: center; gap: 0.75rem;
}
.time-badge {
  background: rgba(52, 211, 153, 0.2);
  color: #34d399;
  padding: 2px 6px;
  border-radius: 4px;
  font-size: 0.65rem;
  font-weight: 700;
}
.result-value { font-size: 1.5rem; font-weight: 700; color: #fff; letter-spacing: 0.05em; font-variant-numeric: tabular-nums; }
.invalid-code { color: #f87171; font-size: 1.1rem; }
.copy-btn {
  background: rgba(255, 255, 255, 0.1);
  border: none;
  color: #fff;
  width: 40px; height: 40px;
  border-radius: 10px;
  display: flex; justify-content: center; align-items: center;
  cursor: pointer; transition: all 0.2s;
}
.copy-btn:hover { background: rgba(255, 255, 255, 0.2); transform: scale(1.05); }

.result-container {
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

/* Information Section */
.info-section {
  padding: 6rem 2rem;
}
.alternate-bg {
  background: rgba(15, 23, 42, 0.5);
  border-top: 1px solid rgba(255, 255, 255, 0.02);
  border-bottom: 1px solid rgba(255, 255, 255, 0.02);
}
.info-container {
  max-width: 1000px;
  margin: 0 auto;
}
.section-title {
  font-size: 2.25rem;
  font-weight: 700;
  margin-bottom: 1rem;
  text-align: center;
  color: #fff;
}
.section-desc {
  text-align: center;
  color: #94a3b8;
  font-size: 1.1rem;
  max-width: 600px;
  margin: 0 auto 3rem;
  line-height: 1.6;
}

.features-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
  gap: 2rem;
}
.feature-card {
  background: rgba(30, 41, 59, 0.4);
  border: 1px solid rgba(255, 255, 255, 0.05);
  border-radius: 16px;
  padding: 2rem;
  transition: transform 0.3s ease;
}
.feature-card:hover {
  transform: translateY(-5px);
  background: rgba(30, 41, 59, 0.6);
}
.feature-icon-wrapper {
  width: 48px;
  height: 48px;
  background: rgba(59, 130, 246, 0.1);
  border-radius: 12px;
  display: flex;
  justify-content: center;
  align-items: center;
  margin-bottom: 1.5rem;
}
.feature-icon { font-size: 1.5rem; }
.feature-card h3 {
  color: #f1f5f9;
  font-size: 1.25rem;
  margin-bottom: 1rem;
  font-weight: 600;
}
.feature-card p {
  color: #94a3b8;
  line-height: 1.6;
  font-size: 0.95rem;
}

.faq-list {
  display: grid;
  gap: 1.5rem;
  max-width: 800px;
  margin: 0 auto;
}
.faq-item {
  background: rgba(30, 41, 59, 0.3);
  border: 1px solid rgba(255, 255, 255, 0.03);
  padding: 1.5rem;
  border-radius: 12px;
}
.faq-item h4 {
  color: #f1f5f9;
  font-size: 1.1rem;
  margin-bottom: 0.75rem;
  font-weight: 600;
}
.faq-item p {
  color: #94a3b8;
  line-height: 1.6;
  font-size: 0.95rem;
}

/* Footer */
.footer {
  background: #0b1120;
  padding: 4rem 2rem 2rem;
  border-top: 1px solid rgba(255, 255, 255, 0.05);
}
.footer-content {
  max-width: 1200px;
  margin: 0 auto;
  display: flex;
  justify-content: space-between;
  flex-wrap: wrap;
  gap: 3rem;
  margin-bottom: 3rem;
}
.footer-brand { max-width: 300px; }
.footer-tagline { color: #64748b; margin-top: 1rem; font-size: 0.9rem; line-height: 1.5; }
.footer-links { display: flex; gap: 4rem; flex-wrap: wrap; }
.link-column { display: flex; flex-direction: column; gap: 1rem; }
.link-column h4 { color: #f1f5f9; font-size: 1rem; font-weight: 600; margin-bottom: 0.5rem; }
.link-column a { color: #64748b; text-decoration: none; font-size: 0.9rem; transition: color 0.2s; }
.link-column a:hover { color: #3b82f6; }
.footer-bottom {
  text-align: center;
  color: #475569;
  font-size: 0.85rem;
  padding-top: 2rem;
  border-top: 1px solid rgba(255, 255, 255, 0.05);
  max-width: 1200px;
  margin: 0 auto;
}

/* Animations */
.fade-enter-active, .fade-leave-active { transition: opacity 0.4s ease, transform 0.4s ease; }
.fade-enter-from, .fade-leave-to { opacity: 0; transform: translateY(-10px); }

/* Dynamic Background Blobs */
.background-elements {
  position: fixed;
  top: 0;
  left: 0;
  width: 100vw;
  height: 100vh;
  overflow: hidden;
  z-index: 0;
  pointer-events: none;
}
.blob {
  position: absolute;
  filter: blur(100px);
  opacity: 0.15;
  border-radius: 50%;
  transition: all 1s ease;
  animation: float 15s ease-in-out infinite;
}
.blob-1 { width: 500px; height: 500px; top: -10%; left: -10%; animation-delay: 0s; }
.blob-2 { width: 400px; height: 400px; bottom: -10%; right: -10%; animation-delay: -5s; }
.blob-3 { width: 300px; height: 300px; top: 40%; left: 50%; animation-delay: -10s; }
.blob.facebook { background: #1877f2; }

@keyframes float {
  0% { transform: translate(0, 0) scale(1); }
  33% { transform: translate(30px, -50px) scale(1.1); }
  66% { transform: translate(-20px, 20px) scale(0.9); }
  100% { transform: translate(0, 0) scale(1); }
}

/* Responsive */
@media (max-width: 768px) {
  .navbar {
    padding: 1rem;
  }
  .nav-links a {
    display: none; /* Hide text links on mobile */
  }
  .hero-title { font-size: 2.5rem; }
  .glass-card { padding: 2rem 1.5rem; }
  .footer-content { flex-direction: column; }
  .custom-toast {
    top: 1rem;
    right: 1rem;
    min-width: auto;
    max-width: calc(100vw - 2rem);
  }
}

/* Legal Pages */
.legal-page {
  padding: 4rem 2rem;
  display: flex;
  justify-content: center;
  align-items: flex-start;
  min-height: 60vh;
}
.legal-card {
  max-width: 800px;
  width: 100%;
  padding: 3rem;
}
.legal-card h2 {
  font-size: 2rem;
  color: #fff;
  margin-bottom: 2rem;
}
.legal-content p {
  color: #94a3b8;
  line-height: 1.8;
  font-size: 1.05rem;
  margin-bottom: 1rem;
}
.back-btn {
  background: transparent;
  border: none;
  color: #3b82f6;
  font-weight: 600;
  font-size: 0.95rem;
  cursor: pointer;
  margin-bottom: 2rem;
  display: flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0;
  transition: color 0.2s;
}
.back-btn:hover {
  color: #2563eb;
}
</style>
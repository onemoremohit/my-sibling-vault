/**
 * i18n/translations.js
 * Comprehensive translation dictionary for English ('en') and Hinglish ('hinglish').
 * Tailored for Indian Gen-Z conversational tone in Hinglish.
 */

export const translations = {
  en: {
    // Navbar
    brandName: 'Kinship & Keepsake',
    creatorStudioBadge: 'Creator Studio',
    previewModeBadge: 'Preview Mode',
    generateShareBtn: 'Generate & Share',

    // Studio Steps
    step0Label: 'Setup & Language',
    step1Label: 'Memory Timeline',
    step2Label: 'Wishlist',
    step3Label: 'Punishment Wheel',
    step4Label: 'Coupons & Certs',

    // Step 0: Setup
    step0Title: 'Step 0: Who is this for',
    selectLanguageLabel: 'Select Vault Language',
    selectLanguageDesc: 'This language will be used across your Creator Studio and your Sibling\'s Recipient View.',
    langEn: 'English 🇬🇧',
    langHinglish: 'Hinglish 🇮🇳',
    senderNameLabel: 'Your Name (Sender) *',
    senderNamePlaceholder: 'e.g. Veer',
    recipientNameLabel: "Sibling's Name (Recipient) *",
    recipientNamePlaceholder: 'e.g. Ani',

    // Module Toggles
    chooseModulesTitle: 'Choose Modules',
    chooseModulesDesc: 'Select what goes inside your vault',
    modTimelineTitle: 'Memory Timeline',
    modTimelineDesc: 'Photos, stories & secret notes',
    modWishlistTitle: 'Gift Wishlist',
    modWishlistDesc: 'Let them pledge your gift',
    modWheelTitle: 'Punishment Wheel',
    modWheelDesc: 'Spin for hilarious dares',
    modCouponsTitle: 'Coupon Book',
    modCouponsDesc: 'Redeemable favor cards',

    // Step 1: Timeline Builder
    addMemoryTitle: 'Add a Memory 📸',
    uploadMediaTitle: 'Upload Photos or 1 Video',
    uploadMediaHint: 'Upload up to 6 photos to auto-create a collage, or upload 1 video!',
    mediaReady: '✅ Media ready',
    photosCountReady: 'photos selected',
    titleLabel: 'Memory Title *',
    titlePlaceholder: 'The Great Cookie Heist 🍪',
    dateLabel: 'Date / Period',
    datePlaceholder: 'e.g. Summer 2018 or July 14, 2021',
    storyLabel: 'Memory Story',
    storyPlaceholder: 'Tell the full story of this memory…',
    secretNoteLabel: '✉️ Wax-Sealed Secret Message',
    secretNoteHint: '(Your sibling must break the seal to read!)',
    secretNotePlaceholder: 'Write an exclusive secret message, confession, or inside joke…',
    addToVaultBtn: 'Add Memory to Vault',
    memoriesAddedCount: 'Memories Added',
    noDateText: 'Memorable Day',
    hasSecretNoteTooltip: 'Contains wax-sealed secret note',
    tapToRevealSecret: '✉️ Wax-Sealed Secret Message — Tap to Break Seal & Unlock 🔑',
    secretUnlocked: '📜 Secret Message Unlocked!',

    // Step 2: Wishlist Setup
    quickAddCategoriesTitle: 'Quick-Add Categories 🎁',
    quickAddCategoriesDesc: 'Tap a category to add a hint',
    customItemTitle: 'Add Custom Item',
    customItemPlaceholder: 'e.g. AirPods Pro, Spa day, Maggi instant noodles…',
    addToWishlistBtn: 'Add to Wishlist',
    wishlistCountText: 'Items on Wishlist',

    // Wishlist Categories
    catChocolates: 'Chocolates 🍫',
    catTech: 'Tech & Gadgets 💻',
    catBooks: 'Books & Novels 📚',
    catExperiences: 'Experiences & Trips 🎡',
    catFashion: 'Fashion & Clothes 👗',
    catFood: 'Food & Treats 🍕',
    catCustom: 'Custom',

    // Step 3: Wheel Customizer
    wheelTitle: 'The Punishment Wheel 🎰',
    wheelDesc: 'Add punishments for your sibling to spin!',
    wheelLoadedText: 'punishments loaded',
    quickPresetsTitle: 'Quick-Add Presets',
    addPunishmentPlaceholder: 'Make them do dishes for a week…',
    addBtn: 'Add',

    // Wheel Presets
    presetBuyFood: 'Buy me food for 3 days 🍕',
    presetChores: 'Do my chores for a week 🧹',
    presetApology: 'One free apology pass 🤐',
    presetMovie: 'Pick the movie next time 🎬',
    presetMassage: 'Foot massage on demand 🦶',
    presetNoRoasting: 'No roasting for 24 hours 🕊️',

    // Step 4: Coupon & Certificate Editor
    presetCouponsTitle: 'Preset Coupons 🎟️',
    presetCouponsDesc: 'Tap to add a ready-made coupon',
    customCouponTitle: 'Custom Coupon',
    couponTitlePlaceholder: 'e.g. One Get Out of Trouble Free',
    couponTermsPlaceholder: 'Terms & conditions (e.g. Expires never, subject to my mood)',
    addCustomCouponBtn: 'Add Custom Coupon',
    couponsInBookCount: 'Coupons in the book',

    // Coupon Presets
    c1Title: 'Free Hug',
    c1Terms: 'Valid 1x. No questions asked.',
    c2Title: 'Zero Arguments Pass',
    c2Terms: 'I will not argue with you for 24h.',
    c3Title: 'Pick the Movie',
    c3Terms: 'You choose the movie, no complaints.',
    c4Title: 'Maggi on Demand',
    c4Terms: 'I will make Maggi for you anytime.',
    c5Title: 'Late Night Drive',
    c5Terms: 'One midnight drive, anywhere you want.',
    c6Title: 'Breakfast in Bed',
    c6Terms: 'One lazy Sunday breakfast served.',

    // Certificates Editor
    funnyCertsTitle: 'Funny Certificates 🏆',
    funnyCertsDesc: 'Tap to award a certificate to your sibling',
    customCertTitle: 'Custom Certificate',
    certTitlePlaceholder: 'e.g. Official Snack Stealer',
    certDescPlaceholder: 'For exceptional achievements in snack theft and midnight fridge raids…',
    createCertBtn: 'Create Certificate',

    // Certificate Presets
    cert1Title: 'Official Maggi Thief',
    cert1Desc: 'Awarded for repeatedly stealing Maggi at 2 AM without permission.',
    cert2Title: "World's Loudest Sibling",
    cert2Desc: 'For maintaining an impressive noise level of 11/10 at all times.',
    cert3Title: 'Drama Queen/King Supreme',
    cert3Desc: 'In recognition of turning every minor inconvenience into a Netflix series.',
    cert4Title: 'Remote Control Monopolist',
    cert4Desc: 'For exclusive and unauthorized control of the TV remote since birth.',

    // Live Preview
    mobilePreviewTitle: '📱 Live Recipient Mobile Preview',
    vaultForRecipient: 'Vault for',
    defaultRecipient: "Sibling's Vault",
    fromSender: 'From:',
    defaultSender: 'Your Sibling',
    giftPacketTitle: 'A Memory Gift Packet',
    memoriesCount: 'memories',
    noMemoriesYet: 'No memories added yet…',
    itemsCount: 'items',
    noWishesAdded: 'No wishes added',
    daresCount: 'dares',
    spinText: 'SPIN',
    couponsCertsPreview: 'Coupons & Awards',
    readyCount: 'ready',

    // Recipient View (View Mode)
    recipientGiftBadge: 'A Gift For You 💌',
    recipientHeroTitle: "'s Memory Vault",
    recipientHeroSubtitle: 'Crafted with love by',
    recipientHeroIntro: 'Scroll down to open your memories, spin the punishment wheel, and redeem your coupons!',
    timelineSectionHeader: 'Memory Timeline 📸',
    timelineSectionSub: 'Our precious (and embarrassing) moments over the years.',
    tapToRevealSecret: 'Tap to reveal secret message 🔒',
    secretUnlocked: 'Secret Unlocked!',
    wishlistSectionHeader: 'Secret Wishlist 🎁',
    wishlistSectionSub: 'Here are a few things your sibling would love to get!',
    pledgedStatus: 'Pledged ✨',
    pledgedBtnText: 'Promised / Pledged!',
    pledgeBtnText: 'Pledge This Gift',
    wheelSectionHeader: 'The Punishment Wheel 🎰',
    wheelSectionSub: 'Spin to settle our next argument once and for all!',
    spinBtnText: 'Spin the Wheel!',
    spinningBtnText: 'Spinning…',
    wheelWinnerTitle: '🎉 The Wheel Has Spoken!',
    wheelWinnerSub: 'Your punishment is:',
    noTakebacksText: 'No takebacks allowed!',
    acceptFateBtn: 'Accept Fate 🤝',
    couponsSectionHeader: 'Favor Coupons 🎟️',
    couponsSectionSub: 'Tap to redeem your sibling favors!',
    redeemedBadge: 'Redeemed',
    officialFavorBadge: 'Official Favor',
    redeemedBtnText: 'Redeemed!',
    redeemBtnText: 'Redeem Coupon',
    redeemedStamp: 'REDEEMED',
    certsSectionHeader: 'Official Awards 🏆',
    certsSectionSub: 'Honorary certificates awarded to you.',
    certHeader: 'Official Certificate of Excellence',
    certConferredText: 'This honor is hereby conferred upon',
    certifiedSiblingText: 'Certified Sibling Moments',
    footerBrand: 'Kinship & Keepsake',
    footerBuiltBy: 'Built for',
    footerWithLove: 'with ❤️',

    // Step Nav
    prevStepBtn: 'Previous Step',
    nextStepBtn: 'Next Step',
    generateVaultBtn: 'Generate & Share Vault',
    vaultReadyTitle: '🎁 Your Memory Vault is Ready!',
    shareLinkInstructions: 'Share this unique link with',
    copyBtn: 'Copy',
    openRecipientBtn: 'Open Recipient View',
  },

  hinglish: {
    // Navbar
    brandName: 'Kinship & Keepsake',
    creatorStudioBadge: 'Creator Studio',
    previewModeBadge: 'Preview Mode',
    generateShareBtn: 'Vault Share Karo',

    // Studio Steps
    step0Label: 'Setup & Bhasha',
    step1Label: 'Yaadein (Timeline)',
    step2Label: 'Wishlist (Gifts)',
    step3Label: 'Punishment Wheel',
    step4Label: 'Coupons & Certs',

    // Step 0: Setup
    step0Title: 'Step 0: Kis ke liye hai',
    selectLanguageLabel: 'Vault Ki Language Choose Karo',
    selectLanguageDesc: 'Yeh language apke Creator Studio aur Sibling ke Recipient View dono me apply hogi.',
    langEn: 'English 🇬🇧',
    langHinglish: 'Hinglish 🇮🇳',
    senderNameLabel: 'Aapka Naam (Sender) *',
    senderNamePlaceholder: 'e.g. Veer',
    recipientNameLabel: "Bhai/Behen Ka Naam (Recipient) *",
    recipientNamePlaceholder: 'e.g. Ani',

    // Module Toggles
    chooseModulesTitle: 'Modules Select Karo',
    chooseModulesDesc: 'Chuno aapke vault me kya-kya hona chahiye',
    modTimelineTitle: 'Yaadon Ki Timeline',
    modTimelineDesc: 'Photos, stories aur secret notes',
    modWishlistTitle: 'Gift Wishlist',
    modWishlistDesc: 'Unse bolo aapka gift pledge karein',
    modWheelTitle: 'Punishment Wheel',
    modWheelDesc: 'Mazaak waale dares ke liye spin karo',
    modCouponsTitle: 'Coupon Book',
    modCouponsDesc: 'Redeem karne waale favor cards',

    // Step 1: Timeline Builder
    addMemoryTitle: 'Ek Yaad Add Karo 📸',
    uploadMediaTitle: 'Multiple Photos ya 1 Video Upload Karo',
    uploadMediaHint: 'Up to 6 photos upload karke collage banao, ya 1 video upload karo!',
    mediaReady: '✅ Media Ready hai!',
    photosCountReady: 'photos select ho gayi',
    titleLabel: 'Memory Ka Title *',
    titlePlaceholder: 'Maggi Ki Chori 🍝',
    dateLabel: 'Tareekh / Period',
    datePlaceholder: 'Jaise: Summer 2018 ya July 14, 2021',
    storyLabel: 'Kahaani / Story',
    storyPlaceholder: 'Iss yaad ki poori story likho…',
    secretNoteLabel: '✉️ Wax-Sealed Secret Message (Khaas Secret)',
    secretNoteHint: '(Bhai/behen ko seal break karke unlock karna padega)',
    secretNotePlaceholder: 'Ek secret message, confession ya inside joke likho…',
    addToVaultBtn: 'Vault me Add Karo',
    memoriesAddedCount: 'Yaadein Added',
    noDateText: 'Khaas Din',
    hasSecretNoteTooltip: 'Wax-sealed secret note hai',
    tapToRevealSecret: '✉️ Secret Message — Seal Tod Kar Unlock Karo 🔑',
    secretUnlocked: '📜 Secret Message Unlock Ho Gaya!',

    // Step 2: Wishlist Setup
    quickAddCategoriesTitle: 'Quick-Add Categories 🎁',
    quickAddCategoriesDesc: 'Tap karke ek gift category add karo',
    customItemTitle: 'Custom Gift Item Add Karo',
    customItemPlaceholder: 'Jaise: AirPods, Pizza treat, Maggi packet…',
    addToWishlistBtn: 'Wishlist me Add Karo',
    wishlistCountText: 'Wishlist Items',

    // Wishlist Categories
    catChocolates: 'Mithai & Chocolates 🍫',
    catTech: 'Tech & Gadgets 💻',
    catBooks: 'Kitabein & Books 📚',
    catExperiences: 'Masti & Trips 🎡',
    catFashion: 'Kapde & Fashion 👗',
    catFood: 'Khana & Treat 🍕',
    catCustom: 'Apni Pasand (Custom)',

    // Step 3: Wheel Customizer
    wheelTitle: 'The Punishment Wheel 🎰',
    wheelDesc: 'Bhai/behen ke liye funny punishments add karo!',
    wheelLoadedText: 'punishments ready hain',
    quickPresetsTitle: 'Ready-made Presets',
    addPunishmentPlaceholder: '1 hafte tak bartan dhone padenge…',
    addBtn: 'Add',

    // Wheel Presets
    presetBuyFood: '3 din tak khana order karega 🍕',
    presetChores: '1 hafte tak mere saare kaam kar 🧹',
    presetApology: 'Ek bina behas waala Sorry bol 🤐',
    presetMovie: 'Movie ki choice meri hogi 🎬',
    presetMassage: 'Foot massage on demand 🦶',
    presetNoRoasting: '24 ghante koyi roast nahi karega 🕊️',

    // Step 4: Coupon & Certificate Editor
    presetCouponsTitle: 'Preset Coupons 🎟️',
    presetCouponsDesc: 'Tap karke ek coupon add karo',
    customCouponTitle: 'Custom Coupon Banayein',
    couponTitlePlaceholder: 'Jaise: Ek Jaadu Ki Jhappi Pass',
    couponTermsPlaceholder: 'Terms (Jaise: Kabhi bhi valid, mera mood achha hona chahiye)',
    addCustomCouponBtn: 'Custom Coupon Add Karo',
    couponsInBookCount: 'Coupons ready hain',

    // Coupon Presets
    c1Title: 'Jaadu Ki Jhappi Pass',
    c1Terms: '1 baar valid. Koyi sawaal nahi poochha jayega.',
    c2Title: '24 Ghante Koyi Behas Nahi',
    c2Terms: 'Aaj main tumse bilkul nahi ladunga/ladungi.',
    c3Title: 'Movie Choice Meri Hogi',
    c3Terms: 'Movie tum select karoge, koyi shikayat nahi.',
    c4Title: 'Midnight Maggi On Demand',
    c4Terms: 'Raat ko kabhi bhi bolo, Maggi banani padegi.',
    c5Title: 'Late Night Drive Pass',
    c5Terms: 'Ek midnight drive, jahan tum kaho.',
    c6Title: 'Subah Ka Chai/Coffee Pass',
    c6Terms: 'Subah ki chai/coffee tum banake laoge.',

    // Certificates Editor
    funnyCertsTitle: 'Funny Certificates 🏆',
    funnyCertsDesc: 'Apne bhai/behen ko ek funny award do',
    customCertTitle: 'Custom Certificate',
    certTitlePlaceholder: 'Jaise: Official Maggi Chor',
    certDescPlaceholder: 'Raat ke 2 baje Maggi churane ke liye dhyan-se diya gaya award…',
    createCertBtn: 'Certificate Banayein',

    // Certificate Presets
    cert1Title: 'Official Maggi Chor 🍜',
    cert1Desc: 'Raat ke 2 baje bina pooche Maggi churane ke shandar record ke liye.',
    cert2Title: 'Ghar Ka Sabse Bada Shor 📢',
    cert2Desc: '24 ghante 11/10 volume pe chillane ke atut prayaas ke liye.',
    cert3Title: 'Overacting Ki Dukan 🎭',
    cert3Desc: 'Chhoti se chhoti baat pe full Netflix serial waala drama karne ke liye.',
    cert4Title: 'TV Remote Ka Akela Maalik 📺',
    cert4Desc: 'Bachpan se TV remote pe illegal qabza rakhne ke shandar prayaas ke liye.',

    // Live Preview
    mobilePreviewTitle: '📱 Live Mobile Preview',
    vaultForRecipient: 'Vault for',
    defaultRecipient: 'Sibling Ka Vault',
    fromSender: 'From:',
    defaultSender: 'Aapka Bhai/Behen',
    giftPacketTitle: 'Yaadon Ka Gift Vault',
    memoriesCount: 'yaadein',
    noMemoriesYet: 'Abhi tak koyi yaad add nahi hui…',
    itemsCount: 'items',
    noWishesAdded: 'Koyi wish add nahi hui',
    daresCount: 'dares',
    spinText: 'SPIN',
    couponsCertsPreview: 'Coupons & Awards',
    readyCount: 'ready',

    // Recipient View (View Mode)
    recipientGiftBadge: 'Aapke Liye Ek Khaas Gift 💌',
    recipientHeroTitle: " Ka Memory Vault",
    recipientHeroSubtitle: 'Pyaar se banaya',
    recipientHeroIntro: 'Niche scroll karke yaadein dekho, punishment wheel spin karo, aur coupons redeem karo!',
    timelineSectionHeader: 'Yaadon Ki Timeline 📸',
    timelineSectionSub: 'Humari saari pyaari (aur thodi embarrassed karne waali) yaadein.',
    tapToRevealSecret: 'Secret Message Unlock Karne Ke Liye Tap Karo 🔒',
    secretUnlocked: 'Secret Unlock Ho Gaya!',
    wishlistSectionHeader: 'Secret Wishlist 🎁',
    wishlistSectionSub: 'Yeh hain woh cheezein jo aapka bhai/behen chahta/chahti hai!',
    pledgedStatus: 'Pledged ✨',
    pledgedBtnText: 'Promise Kar Diya! 🎁',
    pledgeBtnText: 'Yeh Gift Main Doonga/Doongi',
    wheelSectionHeader: 'The Punishment Wheel 🎰',
    wheelSectionSub: 'Spin karke faisla karo agli ladai me kaun kya karega!',
    spinBtnText: 'Wheel Spin Karo!',
    spinningBtnText: 'Wheel Ghoom Raha Hai…',
    wheelWinnerTitle: '🎉 Wheel Ne Faisla Kar Diya!',
    wheelWinnerSub: 'Aapki punishment hai:',
    noTakebacksText: 'Ab Mukar Nahi Sakte!',
    acceptFateBtn: 'Faisla Manzoor Hai 🤝',
    couponsSectionHeader: 'Favor Coupons 🎟️',
    couponsSectionSub: 'Tap karke apne coupons redeem karo!',
    redeemedBadge: 'Redeem Ho Gaya',
    officialFavorBadge: 'Official Favor',
    redeemedBtnText: 'Redeemed!',
    redeemBtnText: 'Coupon Redeem Karo',
    redeemedStamp: 'REDEEMED',
    certsSectionHeader: 'Official Awards 🏆',
    certsSectionSub: 'Aapko diye gaye honorary certificates.',
    certHeader: 'Official Certificate of Excellence',
    certConferredText: 'Yeh award pooray samman ke saath diya jata hai',
    certifiedSiblingText: 'Certified Sibling Moments',
    footerBrand: 'Kinship & Keepsake',
    footerBuiltBy: 'Banaya gaya',
    footerWithLove: 'ke liye pyaaar se ❤️',

    // Step Nav
    prevStepBtn: 'Peechhe Jao',
    nextStepBtn: 'Aage Badho',
    generateVaultBtn: 'Vault Share Karo',
    vaultReadyTitle: '🎁 Aapka Memory Vault Ready Hai!',
    shareLinkInstructions: 'Yeh link bhej do apne sibling',
    copyBtn: 'Copy Link',
    openRecipientBtn: 'Recipient View Kholo',
  },
};

/**
 * Translation helper function
 * @param {string} key
 * @param {string} lang - 'en' | 'hinglish'
 */
export const t = (key, lang = 'en') => {
  const dictionary = translations[lang] || translations.en;
  return dictionary[key] || translations.en[key] || key;
};

/**
 * Internationalization type definitions.
 */

export type Locale = "ru" | "kk";

export interface Dictionary {
  /** Meta / layout */
  meta: {
    title: string;
    description: string;
  };

  /** Common strings reused across the app */
  common: {
    appName: string;
    signIn: string;
    signUp: string;
    signOut: string;
    getStarted: string;
    learnMore: string;
    cancel: string;
    save: string;
    edit: string;
    change: string;
    remove: string;
    email: string;
    password: string;
    fullName: string;
    loading: string;
  };

  /** Landing page navbar */
  nav: {
    features: string;
    howItWorks: string;
    languages: string;
  };

  /** Hero section */
  hero: {
    badge: string;
    titleStart: string;
    titleHighlight: string;
    description: string;
    ctaAnalyze: string;
    statAccuracy: string;
    statAccuracyLabel: string;
    statLanguages: string;
    statLanguagesLabel: string;
    statTime: string;
    statTimeLabel: string;
  };

  /** Features section */
  features: {
    heading: string;
    subheading: string;
    items: {
      title: string;
      description: string;
    }[];
  };

  /** How it works section */
  howItWorks: {
    heading: string;
    subheading: string;
    steps: {
      title: string;
      description: string;
    }[];
  };

  /** Languages section */
  languagesSection: {
    heading: string;
    subheading: string;
    items: {
      code: string;
      name: string;
      description: string;
      status: string;
    }[];
  };

  /** Footer */
  footer: {
    tagline: string;
    rights: string;
  };

  /** Auth – login */
  login: {
    title: string;
    subtitle: string;
    emailPlaceholder: string;
    passwordPlaceholder: string;
    forgotPassword: string;
    submitButton: string;
    submitting: string;
    noAccount: string;
    errorFillAll: string;
    errorInvalid: string;
    successWelcome: string;
  };

  /** Auth – register */
  register: {
    title: string;
    subtitle: string;
    namePlaceholder: string;
    emailPlaceholder: string;
    passwordPlaceholder: string;
    confirmPasswordLabel: string;
    confirmPasswordPlaceholder: string;
    submitButton: string;
    submitting: string;
    hasAccount: string;
    errorFillAll: string;
    errorPasswordLength: string;
    errorPasswordMatch: string;
    errorGeneric: string;
    successCreated: string;
  };

  /** Dashboard sidebar / nav */
  dashboard: {
    analyzeText: string;
    history: string;
    profile: string;
    navigation: string;
  };

  /** Analyze page */
  analyze: {
    heading: string;
    subheading: string;
    textAnalysis: string;
    textAnalysisDesc: string;
    pasteText: string;
    uploadFile: string;
    textPlaceholder: string;
    wordsLabel: string;
    charsLabel: string;
    minChars: string;
    maxChars: string;
    analyzeButton: string;
    analyzeFileButton: string;
    analyzing: string;
    dropFileHere: string;
    fileFormats: string;
    languageAutoDetect: string;
    languageRu: string;
    languageKk: string;
    languageEn: string;
    errorMinLength: string;
    errorMaxLength: string;
    errorSelectFile: string;
    errorFileSize: string;
    errorAnalysis: string;
    errorFileAnalysis: string;
  };

  /** Analysis progress */
  progress: {
    steps: string[];
  };

  /** Analysis results */
  results: {
    aiGenerated: string;
    humanWritten: string;
    mixedContent: string;
    wordsAnalyzed: string;
    aiProbability: string;
    humanProbability: string;
    detailedMetrics: string;
    perplexity: string;
    perplexityDesc: string;
    burstiness: string;
    burstinessDesc: string;
    entropy: string;
    entropyDesc: string;
    repetitiveness: string;
    repetitivenessDesc: string;
    analyzedText: string;
    analyzeAnother: string;
  };

  /** History page */
  historyPage: {
    heading: string;
    subheading: string;
    noAnalyses: string;
    noAnalysesDesc: string;
    wordsUnit: string;
  };

  /** Profile page */
  profilePage: {
    heading: string;
    subheading: string;
    personalInfo: string;
    nameLabel: string;
    emailLabel: string;
    memberSince: string;
    security: string;
    passwordLabel: string;
    passwordChanged: string;
    saving: string;
    saveChanges: string;
    errorNameEmpty: string;
    errorEmailEmpty: string;
    errorUpdateFailed: string;
    successUpdated: string;
  };

  /** Language switcher */
  langSwitcher: {
    ru: string;
    kk: string;
  };
}

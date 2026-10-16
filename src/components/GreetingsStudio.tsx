import React, { useState, useEffect, useRef, useMemo } from 'react';
import { useI18n } from '../context/I18nContext';
import { useAdvisor } from '../context/AdvisorContext';
import { downloadCanvasAsPng } from '../utils/downloadHelper';
import {
  Cake,
  Heart,
  Sparkles,
  Download,
  Share2,
  Copy,
  Check,
  User,
  Phone,
  RefreshCw,
  Gift,
  Award,
  Image as ImageIcon,
  Upload,
  Trash2,
  Search,
  Sliders,
  ChevronDown,
  ChevronUp,
  ShieldCheck,
  Calendar,
  Sun,
  Camera,
  Layers,
  Palette,
  Maximize2,
  Type,
  LayoutTemplate,
  CheckCircle2,
  Github,
  ExternalLink,
  ZoomIn,
  ZoomOut,
  Lock,
  Move,
  Eye,
  EyeOff,
} from 'lucide-react';
import { LanguageCode } from '../types';
import {
  BIRTHDAY_BACKGROUNDS,
  ANNIVERSARY_BACKGROUNDS,
  FESTIVALS_LIST,
  SPECIAL_DAYS_LIST,
  BackgroundPreset,
  FestivalItem,
  SpecialDayItem,
} from '../constants/greetingsData';
import {
  renderGreetingCard,
  GreetingCanvasOptions,
  AdvisorBrandingData,
  GreetingAspectRatio,
  FooterStyle,
  PhotoShape,
  TypographyTheme,
  PhotoAnchor,
  TextAnchor,
  TextBackplate,
  getCanvasDimensions,
} from '../utils/greetingCanvasRenderer';
import {
  getStoredBackgrounds,
  syncGitHubRepository,
  getSavedGitHubConfig,
  saveGitHubConfig,
  DEFAULT_GITHUB_CONFIG,
  CategorizedBackgrounds,
  countTotalImages,
} from '../services/githubBackgroundService';

interface GreetingsStudioProps {
  initialTab?: 'birthday' | 'anniversary' | 'festivals' | 'days';
  initialRecipientName?: string;
}

type GreetingTab = 'birthday' | 'anniversary' | 'festivals' | 'days';
type StudioControlTab = 'occasion' | 'library' | 'photo' | 'branding';

export const GreetingsStudio: React.FC<GreetingsStudioProps> = ({
  initialTab = 'birthday',
  initialRecipientName = '',
}) => {
  const { language } = useI18n();
  const { profile } = useAdvisor();

  // Primary Occasion Category
  const [activeTab, setActiveTab] = useState<GreetingTab>(initialTab);
  const [controlTab, setControlTab] = useState<StudioControlTab>('occasion');
  const [recipientName, setRecipientName] = useState<string>(initialRecipientName || 'Rajeshbhai Patel');
  const [greetingLang, setGreetingLang] = useState<LanguageCode>('en');

  // GitHub Background Library State
  const [githubCatalog, setGithubCatalog] = useState<CategorizedBackgrounds>(getStoredBackgrounds());
  const [isSyncingGithub, setIsSyncingGithub] = useState<boolean>(false);
  const [githubSyncNotice, setGithubSyncNotice] = useState<string | null>(null);
  const [showGithubSettings, setShowGithubSettings] = useState<boolean>(false);
  const [githubConfig, setGithubConfig] = useState(getSavedGitHubConfig());

  // Background Selection
  const [selectedBdayBg, setSelectedBdayBg] = useState<BackgroundPreset>(
    () => githubCatalog.birthday[0] || BIRTHDAY_BACKGROUNDS[0]
  );
  const [selectedAnniBg, setSelectedAnniBg] = useState<BackgroundPreset>(
    () => githubCatalog.anniversary[0] || ANNIVERSARY_BACKGROUNDS[0]
  );
  const [selectedDiwaliBg, setSelectedDiwaliBg] = useState<BackgroundPreset>(
    () => githubCatalog.diwali[0] || FESTIVALS_LIST[0]?.bgPresets[0]
  );
  const [selectedFestival, setSelectedFestival] = useState<FestivalItem>(FESTIVALS_LIST[0]);
  const [selectedFestivalBg, setSelectedFestivalBg] = useState<BackgroundPreset>(FESTIVALS_LIST[0].bgPresets[0]);
  const [selectedSpecialDay, setSelectedSpecialDay] = useState<SpecialDayItem>(SPECIAL_DAYS_LIST[0]);
  const [selectedSpecialDayBg, setSelectedSpecialDayBg] = useState<BackgroundPreset>(SPECIAL_DAYS_LIST[0].bgPresets[0]);

  // Custom Background Upload
  const [customBgPreset, setCustomBgPreset] = useState<BackgroundPreset | null>(null);
  const [isUsingCustomBg, setIsUsingCustomBg] = useState<boolean>(false);
  const [customImageUrlInput, setCustomImageUrlInput] = useState<string>('');

  // Search Filters
  const [festivalSearch, setFestivalSearch] = useState<string>('');
  const [specialDaySearch, setSpecialDaySearch] = useState<string>('');
  const [libraryCategory, setLibraryCategory] = useState<'all' | 'birthday' | 'anniversary' | 'diwali' | 'festivals' | 'specialDays' | 'custom'>('all');

  // Canvas Workspace Architecture (Default: Portrait 2:3, 1024×1536 px)
  const [aspectRatio, setAspectRatio] = useState<GreetingAspectRatio>('portrait_2_3');
  const [resolution, setResolution] = useState<'hd' | '4k'>('hd');
  const [zoomLevel, setZoomLevel] = useState<number>(1.0);

  // Layer 1: Client Photo & Frame Settings
  const [hasCustomerPhoto, setHasCustomerPhoto] = useState<boolean>(false);
  const [customerPhotoUrl, setCustomerPhotoUrl] = useState<string | null>(null);
  const [customerPhotoShape, setCustomerPhotoShape] = useState<PhotoShape>('circle');
  const [customerPhotoScale, setCustomerPhotoScale] = useState<number>(1.0);
  const [customerPhotoAnchor, setCustomerPhotoAnchor] = useState<PhotoAnchor>('top_center');
  const [photoOffsetX, setPhotoOffsetX] = useState<number>(0);
  const [photoOffsetY, setPhotoOffsetY] = useState<number>(0);

  // Layer 2: Typography, Occasion Badge & Wishes
  const [showOccasionIcon, setShowOccasionIcon] = useState<boolean>(true);
  const [typographyTheme, setTypographyTheme] = useState<TypographyTheme>('gold');
  const [titleScale, setTitleScale] = useState<number>(1.0);
  const [messageScale, setMessageScale] = useState<number>(1.0);
  const [textAnchor, setTextAnchor] = useState<TextAnchor>('middle');
  const [textAlign, setTextAlign] = useState<'center' | 'left' | 'right'>('center');
  const [textBackplate, setTextBackplate] = useState<TextBackplate>('none');
  const [textOffsetY, setTextOffsetY] = useState<number>(0);
  const [customWishText, setCustomWishText] = useState<string>('');
  const [customSalutation, setCustomSalutation] = useState<string>('');

  // Layer 3: Advisor Branding & Footer Architecture
  const [showAdvisorCard, setShowAdvisorCard] = useState<boolean>(true);
  const [footerStyle, setFooterStyle] = useState<FooterStyle>('frosted_glass');
  const [advisorName, setAdvisorName] = useState<string>(profile.advisorName || 'Chintan Raval');
  const [advisorDesignation, setAdvisorDesignation] = useState<string>(
    profile.designation || 'AMFI Registered MFD & Wealth Architect'
  );
  const [firmName, setFirmName] = useState<string>('Raval Finserv Wealth');
  const [phoneNumber, setPhoneNumber] = useState<string>(profile.phoneNumber || '+91 98765 43210');
  const [arnNumber, setArnNumber] = useState<string>(profile.professionalDetails || 'ARN-123456');
  const [website, setWebsite] = useState<string>(profile.website || 'www.ravalfinserv.com');
  const [advisorAvatarUrl, setAdvisorAvatarUrl] = useState<string | null>(null);

  // Status & Feedback
  const [isCopied, setIsCopied] = useState<boolean>(false);
  const [isRendering, setIsRendering] = useState<boolean>(false);
  const [actionNotice, setActionNotice] = useState<string | null>(null);

  // Canvas & Image Refs
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const bgImageRef = useRef<HTMLImageElement | null>(null);
  const customerPhotoRef = useRef<HTMLImageElement | null>(null);
  const advisorPhotoRef = useRef<HTMLImageElement | null>(null);
  const fileInputBgRef = useRef<HTMLInputElement>(null);
  const fileInputCustomerRef = useRef<HTMLInputElement>(null);
  const fileInputAdvisorRef = useRef<HTMLInputElement>(null);

  // Sync initial props
  useEffect(() => {
    if (initialTab) setActiveTab(initialTab);
    if (initialRecipientName) setRecipientName(initialRecipientName);
  }, [initialTab, initialRecipientName]);

  // Sync advisor profile when active profile changes
  useEffect(() => {
    if (profile.advisorName) setAdvisorName(profile.advisorName);
    if (profile.phoneNumber) setPhoneNumber(profile.phoneNumber);
    if (profile.designation) setAdvisorDesignation(profile.designation);
    if (profile.professionalDetails) setArnNumber(profile.professionalDetails);
    if (profile.website) setWebsite(profile.website);
  }, [profile.id]);

  // Handle GitHub sync on mount or manual trigger
  const handleSyncGithub = async (config = githubConfig) => {
    setIsSyncingGithub(true);
    setGithubSyncNotice('Connecting to GitHub repository...');
    try {
      const res = await syncGitHubRepository(config);
      if (res.success) {
        setGithubCatalog(res.backgrounds);
        setGithubSyncNotice(`Successfully loaded ${res.totalImages} images from ${config.owner}/${config.repo}!`);
        setTimeout(() => setGithubSyncNotice(null), 5000);
      } else {
        setGithubSyncNotice(res.error || 'GitHub sync fallback active.');
        setTimeout(() => setGithubSyncNotice(null), 6000);
      }
    } catch {
      setGithubSyncNotice('Sync completed with local cached library.');
      setTimeout(() => setGithubSyncNotice(null), 4000);
    } finally {
      setIsSyncingGithub(false);
    }
  };

  // Determine current active background preset
  const currentBgPreset: BackgroundPreset = useMemo(() => {
    if (isUsingCustomBg && customBgPreset) {
      return customBgPreset;
    }
    switch (activeTab) {
      case 'birthday':
        return selectedBdayBg;
      case 'anniversary':
        return selectedAnniBg;
      case 'festivals':
        return selectedFestivalBg;
      case 'days':
        return selectedSpecialDayBg;
      default:
        return selectedBdayBg;
    }
  }, [
    activeTab,
    isUsingCustomBg,
    customBgPreset,
    selectedBdayBg,
    selectedAnniBg,
    selectedFestivalBg,
    selectedSpecialDayBg,
  ]);

  // Pre-load background image whenever preset changes
  useEffect(() => {
    if (!currentBgPreset.fullUrl) return;

    const img = new Image();
    img.crossOrigin = 'anonymous';
    img.src = currentBgPreset.fullUrl;

    img.onload = () => {
      bgImageRef.current = img;
      triggerRender();
    };

    img.onerror = () => {
      // Fallback to thumbnail URL if full URL fails
      if (currentBgPreset.thumbnailUrl && currentBgPreset.thumbnailUrl !== currentBgPreset.fullUrl) {
        const fallbackImg = new Image();
        fallbackImg.crossOrigin = 'anonymous';
        fallbackImg.src = currentBgPreset.thumbnailUrl;
        fallbackImg.onload = () => {
          bgImageRef.current = fallbackImg;
          triggerRender();
        };
        fallbackImg.onerror = () => {
          bgImageRef.current = null;
          triggerRender();
        };
      } else {
        bgImageRef.current = null;
        triggerRender();
      }
    };
  }, [currentBgPreset]);

  // Pre-load customer photo
  useEffect(() => {
    if (!hasCustomerPhoto || !customerPhotoUrl) {
      customerPhotoRef.current = null;
      triggerRender();
      return;
    }

    const img = new Image();
    img.crossOrigin = 'anonymous';
    img.src = customerPhotoUrl;
    img.onload = () => {
      customerPhotoRef.current = img;
      triggerRender();
    };
    img.onerror = () => {
      customerPhotoRef.current = null;
      triggerRender();
    };
  }, [hasCustomerPhoto, customerPhotoUrl]);

  // Pre-load advisor photo
  useEffect(() => {
    if (!advisorAvatarUrl) {
      advisorPhotoRef.current = null;
      triggerRender();
      return;
    }

    const img = new Image();
    img.crossOrigin = 'anonymous';
    img.src = advisorAvatarUrl;
    img.onload = () => {
      advisorPhotoRef.current = img;
      triggerRender();
    };
    img.onerror = () => {
      advisorPhotoRef.current = null;
      triggerRender();
    };
  }, [advisorAvatarUrl]);

  // Compute wishes and titles based on occasion & language
  const greetingContent = useMemo(() => {
    let defaultTitle = 'HAPPY BIRTHDAY';
    let defaultWishes =
      'Wishing you a day filled with immense joy, everlasting prosperity, and sound financial abundance for all your future milestones!';
    let defaultSalutation = `Dear ${recipientName}`;
    let icon = '🎂';

    if (activeTab === 'birthday') {
      icon = '🎂';
      if (greetingLang === 'gu') {
        defaultTitle = 'જન્મદિન મુબારક';
        defaultSalutation = `સ્નેહી શ્રી ${recipientName}`;
        defaultWishes =
          'આપના જન્મદિવસે અનંત સુખ, ઉત્તમ સ્વાસ્થ્ય અને સમૃદ્ધિની મંગલકામનાઓ. આપના જીવનના તમામ નાણાકીય અને પારિવારિક લક્ષ્યો સિદ્ધ થાય તેવી શુભેચ્છાઓ!';
      } else if (greetingLang === 'hi') {
        defaultTitle = 'जन्मदिन की हार्दिक शुभकामनाएं';
        defaultSalutation = `प्रिय ${recipientName}`;
        defaultWishes =
          'ईश्वर से प्रार्थना है कि आपका यह जन्मदिन आपके जीवन में उत्तम स्वास्थ्य, अपार खुशियाँ और वित्तीय समृद्धि लेकर आए।';
      } else {
        defaultTitle = 'HAPPY BIRTHDAY';
        defaultSalutation = `Dear ${recipientName}`;
        defaultWishes =
          'May this special year bring you good health, joy, and fulfilling prosperity. Wishing you continued success and great financial well-being!';
      }
    } else if (activeTab === 'anniversary') {
      icon = '💍';
      if (greetingLang === 'gu') {
        defaultTitle = 'લગ્ન વર્ષગાંઠની શુભકામના';
        defaultSalutation = `શ્રી અને શ્રીમતી ${recipientName}`;
        defaultWishes =
          'આપના દાંપત્ય જીવનમાં પ્રેમ, સુમેળ અને સમૃદ્ધિ હંમેશાં વધતાં રહે. આપનું પારિવારિક અને નાણાકીય ભવિષ્ય ઉજ્જવળ રહે તેવી હાર્દિક પ્રાર્થના!';
      } else if (greetingLang === 'hi') {
        defaultTitle = 'शादी की सालगिरह मुबारक';
        defaultSalutation = `श्री और श्रीमती ${recipientName}`;
        defaultWishes =
          'आपके वैवाहिक जीवन में प्रेम, विश्वास और वित्तीय संपन्नता सदैव बनी रहे। आपको सुखद भविष्य की अनंत शुभकामनाएं!';
      } else {
        defaultTitle = 'HAPPY ANNIVERSARY';
        defaultSalutation = `Mr. & Mrs. ${recipientName}`;
        defaultWishes =
          'Wishing a fantastic couple a very happy wedding anniversary! May your bond of love and shared financial dreams grow stronger with each passing year.';
      }
    } else if (activeTab === 'festivals') {
      icon = selectedFestival.icon || '🪔';
      defaultTitle =
        greetingLang === 'gu'
          ? selectedFestival.nameGu
          : greetingLang === 'hi'
          ? selectedFestival.nameHi
          : selectedFestival.name.toUpperCase();
      defaultSalutation =
        greetingLang === 'gu'
          ? `આદરણીય ${recipientName}`
          : greetingLang === 'hi'
          ? `आदरणीय ${recipientName}`
          : `Dear ${recipientName}`;
      defaultWishes =
        greetingLang === 'gu'
          ? selectedFestival.defaultWishesGu
          : greetingLang === 'hi'
          ? selectedFestival.defaultWishesHi
          : selectedFestival.defaultWishesEn;
    } else if (activeTab === 'days') {
      icon = selectedSpecialDay.icon || '🌟';
      defaultTitle =
        greetingLang === 'gu'
          ? selectedSpecialDay.nameGu
          : greetingLang === 'hi'
          ? selectedSpecialDay.nameHi
          : selectedSpecialDay.name.toUpperCase();
      defaultSalutation =
        greetingLang === 'gu'
          ? `આદરણીય ${recipientName}`
          : greetingLang === 'hi'
          ? `आदरणीय ${recipientName}`
          : `Dear ${recipientName}`;
      defaultWishes =
        greetingLang === 'gu'
          ? selectedSpecialDay.defaultWishesGu
          : greetingLang === 'hi'
          ? selectedSpecialDay.defaultWishesHi
          : selectedSpecialDay.defaultWishesEn;
    }

    return {
      title: defaultTitle,
      salutation: customSalutation || defaultSalutation,
      message: customWishText || defaultWishes,
      icon,
    };
  }, [
    activeTab,
    greetingLang,
    recipientName,
    selectedFestival,
    selectedSpecialDay,
    customWishText,
    customSalutation,
  ]);

  // Main Canvas Render Trigger (100% Background Immunity)
  const triggerRender = async () => {
    if (!canvasRef.current) return;
    setIsRendering(true);

    const advisorData: AdvisorBrandingData = {
      advisorName,
      designation: advisorDesignation,
      firmName,
      phoneNumber,
      arnNumber,
      website,
      profilePhoto: advisorPhotoRef.current,
    };

    const renderOptions: GreetingCanvasOptions = {
      canvas: canvasRef.current,
      resolution,
      aspectRatio,
      bgImage: bgImageRef.current,
      bgPreset: currentBgPreset,
      hasCustomerPhoto,
      customerPhoto: customerPhotoRef.current,
      customerPhotoShape,
      customerPhotoScale,
      customerPhotoAnchor,
      photoOffsetX,
      photoOffsetY,
      occasionType: activeTab,
      occasionIcon: greetingContent.icon,
      showOccasionIcon,
      title: greetingContent.title,
      recipientName,
      salutation: greetingContent.salutation,
      message: greetingContent.message,
      advisor: advisorData,
      footerStyle,
      showAdvisorCard,
      typographyTheme,
      titleScale,
      messageScale,
      textAnchor,
      textAlign,
      textBackplate,
      textOffsetY,
    };

    try {
      await renderGreetingCard(renderOptions);
    } catch (err) {
      console.error('Error rendering greeting canvas:', err);
    } finally {
      setIsRendering(false);
    }
  };

  // Re-render when any design parameter changes
  useEffect(() => {
    triggerRender();
  }, [
    activeTab,
    aspectRatio,
    resolution,
    currentBgPreset,
    hasCustomerPhoto,
    customerPhotoShape,
    customerPhotoScale,
    customerPhotoAnchor,
    photoOffsetX,
    photoOffsetY,
    showOccasionIcon,
    greetingContent,
    typographyTheme,
    titleScale,
    messageScale,
    textAnchor,
    textAlign,
    textBackplate,
    textOffsetY,
    footerStyle,
    showAdvisorCard,
    advisorName,
    advisorDesignation,
    firmName,
    phoneNumber,
    arnNumber,
    website,
  ]);

  // File Upload Handlers
  const handleCustomBgUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      const dataUrl = event.target?.result as string;
      const customPreset: BackgroundPreset = {
        id: `custom_${Date.now()}`,
        name: file.name.replace(/\.[^/.]+$/, '') || 'Custom Background',
        thumbnailUrl: dataUrl,
        fullUrl: dataUrl,
        themeColor: '#1e293b',
        secondaryColor: '#334155',
        accentColor: '#fbbf24',
        patternType: 'sparkles',
      };
      setCustomBgPreset(customPreset);
      setIsUsingCustomBg(true);
      setActionNotice('Custom background loaded! Original pixels preserved 100%.');
      setTimeout(() => setActionNotice(null), 4000);
    };
    reader.readAsDataURL(file);
  };

  const handleCustomUrlLoad = () => {
    if (!customImageUrlInput.trim()) return;
    const url = customImageUrlInput.trim();
    const customPreset: BackgroundPreset = {
      id: `url_${Date.now()}`,
      name: 'Custom URL Artwork',
      thumbnailUrl: url,
      fullUrl: url,
      themeColor: '#1e293b',
      secondaryColor: '#334155',
      accentColor: '#fbbf24',
      patternType: 'sparkles',
    };
    setCustomBgPreset(customPreset);
    setIsUsingCustomBg(true);
    setCustomImageUrlInput('');
    setActionNotice('Background loaded from URL! 100% untouched source.');
    setTimeout(() => setActionNotice(null), 4000);
  };

  const handleCustomerPhotoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      const dataUrl = event.target?.result as string;
      setCustomerPhotoUrl(dataUrl);
      setHasCustomerPhoto(true);
      setActionNotice('Customer photo added to foreground layer!');
      setTimeout(() => setActionNotice(null), 3000);
    };
    reader.readAsDataURL(file);
  };

  const handleAdvisorAvatarUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      const dataUrl = event.target?.result as string;
      setAdvisorAvatarUrl(dataUrl);
      setActionNotice('Advisor profile photo updated in branding card!');
      setTimeout(() => setActionNotice(null), 3000);
    };
    reader.readAsDataURL(file);
  };

  // High-Resolution Download Action
  const handleDownloadPng = async (forcedRes?: 'hd' | '4k') => {
    if (!canvasRef.current) return;
    const targetRes = forcedRes || resolution;

    // If requesting a resolution different than current view, re-render temporarily to export
    if (targetRes !== resolution) {
      await renderGreetingCard({
        canvas: canvasRef.current,
        resolution: targetRes,
        aspectRatio,
        bgImage: bgImageRef.current,
        bgPreset: currentBgPreset,
        hasCustomerPhoto,
        customerPhoto: customerPhotoRef.current,
        customerPhotoShape,
        customerPhotoScale,
        customerPhotoAnchor,
        photoOffsetX,
        photoOffsetY,
        occasionType: activeTab,
        occasionIcon: greetingContent.icon,
        showOccasionIcon,
        title: greetingContent.title,
        recipientName,
        salutation: greetingContent.salutation,
        message: greetingContent.message,
        advisor: {
          advisorName,
          designation: advisorDesignation,
          firmName,
          phoneNumber,
          arnNumber,
          website,
          profilePhoto: advisorPhotoRef.current,
        },
        footerStyle,
        showAdvisorCard,
        typographyTheme,
        titleScale,
        messageScale,
        textAnchor,
        textAlign,
        textBackplate,
        textOffsetY,
      });
    }

    const cleanRecipient = recipientName.trim().replace(/\s+/g, '_') || 'Client';
    const filename = `${cleanRecipient}_${activeTab}_${targetRes.toUpperCase()}_Greeting.png`;

    downloadCanvasAsPng(canvasRef.current, filename);
    setActionNotice(`Downloaded ${targetRes.toUpperCase()} Greeting PNG!`);
    setTimeout(() => setActionNotice(null), 4000);

    // Revert canvas to preview resolution if changed
    if (targetRes !== resolution) {
      triggerRender();
    }
  };

  // Copy Canvas to Clipboard
  const handleCopyClipboard = async () => {
    if (!canvasRef.current) return;
    try {
      canvasRef.current.toBlob(async (blob) => {
        if (!blob) return;
        try {
          await navigator.clipboard.write([
            new ClipboardItem({
              'image/png': blob,
            }),
          ]);
          setIsCopied(true);
          setActionNotice('Greeting image copied to clipboard!');
          setTimeout(() => {
            setIsCopied(false);
            setActionNotice(null);
          }, 3500);
        } catch (clipErr) {
          console.warn('Clipboard write failed, using dataUrl fallback', clipErr);
          setActionNotice('Please use Download button on your browser.');
        }
      }, 'image/png');
    } catch (err) {
      console.error('Clipboard copy error:', err);
    }
  };

  // WhatsApp Web / Mobile Share
  const handleWhatsAppShare = async () => {
    if (!canvasRef.current) return;

    const formattedMessage = `*${greetingContent.title}* 🎉\n\n${greetingContent.salutation},\n\n${greetingContent.message}\n\nWarm regards,\n*${advisorName}*\n${advisorDesignation}\n📞 ${phoneNumber}`;

    // Try Web Share API with image file first
    if (navigator.share && navigator.canShare) {
      try {
        canvasRef.current.toBlob(async (blob) => {
          if (!blob) return;
          const file = new File([blob], `${recipientName}_Greeting.png`, { type: 'image/png' });
          if (navigator.canShare({ files: [file] })) {
            await navigator.share({
              title: greetingContent.title,
              text: formattedMessage,
              files: [file],
            });
            setActionNotice('Shared via WhatsApp!');
            setTimeout(() => setActionNotice(null), 3000);
            return;
          }
          // Direct WhatsApp link fallback
          const encoded = encodeURIComponent(formattedMessage);
          window.open(`https://api.whatsapp.com/send?text=${encoded}`, '_blank');
        }, 'image/png');
        return;
      } catch (e) {
        console.warn('Web share cancelled or unsupported', e);
      }
    }

    // Direct WhatsApp Web / App link fallback
    const encoded = encodeURIComponent(formattedMessage);
    window.open(`https://api.whatsapp.com/send?text=${encoded}`, '_blank');
    setActionNotice('WhatsApp message link opened!');
    setTimeout(() => setActionNotice(null), 3000);
  };

  // Active canvas dimension indicators
  const currentDimensions = useMemo(() => {
    return getCanvasDimensions(aspectRatio, resolution, bgImageRef.current);
  }, [aspectRatio, resolution, currentBgPreset]);

  // Combined backgrounds list for active browser tab
  const displayedLibraryPresets = useMemo(() => {
    if (libraryCategory === 'birthday') {
      return [...githubCatalog.birthday, ...BIRTHDAY_BACKGROUNDS];
    }
    if (libraryCategory === 'anniversary') {
      return [...githubCatalog.anniversary, ...ANNIVERSARY_BACKGROUNDS];
    }
    if (libraryCategory === 'diwali') {
      return githubCatalog.diwali;
    }
    if (libraryCategory === 'festivals') {
      return selectedFestival.bgPresets;
    }
    if (libraryCategory === 'specialDays') {
      return selectedSpecialDay.bgPresets;
    }
    if (libraryCategory === 'custom') {
      return customBgPreset ? [customBgPreset] : [];
    }
    // 'all': Show GitHub curated set first
    return [
      ...githubCatalog.birthday,
      ...githubCatalog.anniversary,
      ...githubCatalog.diwali,
    ];
  }, [libraryCategory, githubCatalog, selectedFestival, selectedSpecialDay, customBgPreset]);

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 p-4 lg:p-6 pb-24">
      {/* Top Header & Breadcrumb */}
      <div className="max-w-7xl mx-auto mb-6">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-slate-900/90 border border-slate-800 rounded-2xl p-4 lg:p-6 backdrop-blur-xl shadow-2xl">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span className="px-2.5 py-0.5 rounded-full text-xs font-semibold bg-amber-500/10 text-amber-400 border border-amber-500/20">
                PRO STUDIO
              </span>
              <span className="px-2.5 py-0.5 rounded-full text-xs font-semibold bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 flex items-center gap-1">
                <Lock className="w-3 h-3" /> 100% Background Lock
              </span>
              <span className="px-2.5 py-0.5 rounded-full text-xs font-semibold bg-blue-500/10 text-blue-400 border border-blue-500/20 flex items-center gap-1">
                <Github className="w-3 h-3" /> GitHub Cloud Library
              </span>
            </div>
            <h1 className="text-2xl lg:text-3xl font-extrabold tracking-tight text-white flex items-center gap-2">
              Client Greetings Studio
              <span className="text-amber-400 text-sm font-normal">
                (Portrait 1024×1536 • 4K Engine)
              </span>
            </h1>
            <p className="text-sm text-slate-400 mt-1">
              Create immaculate, personalized greetings with zero background modification, custom client portraits, and advisor branding.
            </p>
          </div>

          {/* Quick Action Toolbar */}
          <div className="flex flex-wrap items-center gap-2.5">
            <button
              onClick={() => handleDownloadPng('hd')}
              className="px-4 py-2.5 rounded-xl font-semibold text-sm bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 flex items-center gap-2 transition-all shadow-md active:scale-95"
              title="Download 1024×1536 Portrait PNG"
            >
              <Download className="w-4 h-4 text-emerald-400" />
              Download HD
            </button>

            <button
              onClick={() => handleDownloadPng('4k')}
              className="px-4 py-2.5 rounded-xl font-bold text-sm bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-slate-950 shadow-lg shadow-amber-500/20 flex items-center gap-2 transition-all active:scale-95"
              title="Download Ultra High-Res 4K (2048×3072)"
            >
              <Sparkles className="w-4 h-4 fill-slate-950" />
              Download 4K Ultra
            </button>

            <button
              onClick={handleCopyClipboard}
              className="px-3.5 py-2.5 rounded-xl text-sm font-medium bg-slate-800/80 hover:bg-slate-700 text-slate-200 border border-slate-700 flex items-center gap-1.5 transition-all active:scale-95"
              title="Copy image to clipboard"
            >
              {isCopied ? <Check className="w-4 h-4 text-emerald-400" /> : <Copy className="w-4 h-4" />}
              {isCopied ? 'Copied' : 'Copy'}
            </button>

            <button
              onClick={handleWhatsAppShare}
              className="px-4 py-2.5 rounded-xl text-sm font-bold bg-emerald-600 hover:bg-emerald-500 text-white shadow-lg shadow-emerald-600/25 flex items-center gap-2 transition-all active:scale-95"
              title="Share to WhatsApp"
            >
              <Share2 className="w-4 h-4" />
              WhatsApp
            </button>
          </div>
        </div>
      </div>

      {/* Action Notification Toast */}
      {actionNotice && (
        <div className="fixed top-6 right-6 z-50 bg-slate-900 border border-amber-500/40 text-slate-100 px-5 py-3 rounded-xl shadow-2xl flex items-center gap-3 animate-fade-in backdrop-blur-md">
          <CheckCircle2 className="w-5 h-5 text-amber-400" />
          <span className="text-sm font-medium">{actionNotice}</span>
        </div>
      )}

      {/* Main Studio Grid: Left Canvas Workspace | Right Controls */}
      <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* =========================================================================
            LEFT COLUMN: INTERACTIVE CANVAS WORKSPACE PREVIEW (RESPONSIVE 2:3 RATIO)
            ========================================================================= */}
        <div className="lg:col-span-6 xl:col-span-7 flex flex-col items-center">
          {/* Canvas Workspace Toolbar */}
          <div className="w-full bg-slate-900/90 border border-slate-800 rounded-t-2xl px-4 py-3 flex flex-wrap items-center justify-between gap-3 backdrop-blur-md">
            {/* Dimensions & Aspect Ratio Badge */}
            <div className="flex items-center gap-2">
              <span className="text-xs font-bold text-slate-300 bg-slate-800 px-2.5 py-1 rounded-lg border border-slate-700/60 font-mono">
                {currentDimensions.width} × {currentDimensions.height} px
              </span>
              <span className="text-xs text-amber-400 bg-amber-500/10 border border-amber-500/20 px-2 py-0.5 rounded-md font-medium">
                {aspectRatio === 'portrait_2_3'
                  ? 'Vertical 2:3'
                  : aspectRatio === 'story_9_16'
                  ? 'Story 9:16'
                  : aspectRatio === 'square_1_1'
                  ? 'Square 1:1'
                  : 'Source Auto'}
              </span>
              {isRendering && (
                <span className="text-xs text-cyan-400 flex items-center gap-1 animate-pulse">
                  <RefreshCw className="w-3 h-3 animate-spin" /> Rendering...
                </span>
              )}
            </div>

            {/* Canvas Aspect Ratio & Resolution Selectors */}
            <div className="flex items-center gap-2">
              {/* Aspect Ratio Switcher */}
              <div className="flex items-center bg-slate-950 p-0.5 rounded-xl border border-slate-800 text-xs">
                <button
                  onClick={() => setAspectRatio('portrait_2_3')}
                  className={`px-2.5 py-1 rounded-lg font-medium transition-all ${
                    aspectRatio === 'portrait_2_3'
                      ? 'bg-amber-500 text-slate-950 font-bold shadow'
                      : 'text-slate-400 hover:text-white'
                  }`}
                  title="2:3 Portrait (Default 1024×1536)"
                >
                  2:3 Portrait
                </button>
                <button
                  onClick={() => setAspectRatio('story_9_16')}
                  className={`px-2 py-1 rounded-lg font-medium transition-all ${
                    aspectRatio === 'story_9_16'
                      ? 'bg-amber-500 text-slate-950 font-bold shadow'
                      : 'text-slate-400 hover:text-white'
                  }`}
                  title="9:16 WhatsApp Story (1080×1920)"
                >
                  9:16 Story
                </button>
                <button
                  onClick={() => setAspectRatio('square_1_1')}
                  className={`px-2 py-1 rounded-lg font-medium transition-all ${
                    aspectRatio === 'square_1_1'
                      ? 'bg-amber-500 text-slate-950 font-bold shadow'
                      : 'text-slate-400 hover:text-white'
                  }`}
                  title="1:1 Square (1080×1080)"
                >
                  1:1 Square
                </button>
              </div>

              {/* Resolution Selector */}
              <div className="flex items-center bg-slate-950 p-0.5 rounded-xl border border-slate-800 text-xs">
                <button
                  onClick={() => setResolution('hd')}
                  className={`px-2.5 py-1 rounded-lg font-medium transition-all ${
                    resolution === 'hd'
                      ? 'bg-slate-700 text-white font-bold'
                      : 'text-slate-400 hover:text-white'
                  }`}
                >
                  HD
                </button>
                <button
                  onClick={() => setResolution('4k')}
                  className={`px-2.5 py-1 rounded-lg font-medium transition-all ${
                    resolution === '4k'
                      ? 'bg-amber-500 text-slate-950 font-bold'
                      : 'text-slate-400 hover:text-white'
                  }`}
                >
                  4K
                </button>
              </div>

              {/* Zoom Controls */}
              <div className="flex items-center gap-1 bg-slate-950 p-1 rounded-xl border border-slate-800 text-slate-400">
                <button
                  onClick={() => setZoomLevel((z) => Math.max(0.6, z - 0.1))}
                  className="p-1 hover:text-white rounded"
                  title="Zoom Out"
                >
                  <ZoomOut className="w-3.5 h-3.5" />
                </button>
                <span className="text-[11px] font-mono px-1">{Math.round(zoomLevel * 100)}%</span>
                <button
                  onClick={() => setZoomLevel((z) => Math.min(1.4, z + 0.1))}
                  className="p-1 hover:text-white rounded"
                  title="Zoom In"
                >
                  <ZoomIn className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          </div>

          {/* Canvas Viewing Stage */}
          <div className="w-full bg-slate-950/80 border-x border-b border-slate-800 rounded-b-2xl p-4 lg:p-6 flex items-center justify-center min-h-[580px] overflow-hidden relative shadow-inner">
            {/* Background Grid Pattern */}
            <div className="absolute inset-0 bg-[radial-gradient(#1e293b_1px,transparent_1px)] [background-size:16px_16px] opacity-40 pointer-events-none" />

            {/* The Live HTML5 Canvas */}
            <div
              className="relative transition-transform duration-200 shadow-2xl rounded-xl overflow-hidden border border-slate-800 max-w-full"
              style={{
                transform: `scale(${zoomLevel})`,
                transformOrigin: 'top center',
              }}
            >
              <canvas
                ref={canvasRef}
                className="block max-w-full h-auto object-contain rounded-xl shadow-2xl"
                style={{
                  maxHeight: '74vh',
                  aspectRatio: currentDimensions.cssAspect,
                }}
              />
            </div>
          </div>

          {/* Absolute Background Immunity Guarantee Card */}
          <div className="w-full mt-3 bg-slate-900/60 border border-slate-800/80 rounded-xl p-3 flex items-center justify-between text-xs text-slate-400">
            <div className="flex items-center gap-2">
              <ShieldCheck className="w-4 h-4 text-emerald-400 flex-shrink-0" />
              <span>
                <strong className="text-slate-200">Zero Distortion Lock:</strong> Source artwork is rendered verbatim without color grading, darkening, or compression filters.
              </span>
            </div>
            <span className="text-slate-500 font-mono text-[11px] hidden sm:inline">
              Layered 2D Engine
            </span>
          </div>
        </div>

        {/* =========================================================================
            RIGHT COLUMN: TABBED STUDIO CONTROLS (OCCASION, LIBRARY, PHOTO, BRANDING)
            ========================================================================= */}
        <div className="lg:col-span-6 xl:col-span-5 bg-slate-900/95 border border-slate-800 rounded-2xl shadow-2xl backdrop-blur-xl overflow-hidden">
          {/* Main Studio Navigation Tabs */}
          <div className="grid grid-cols-4 border-b border-slate-800 bg-slate-950/60 p-1.5 gap-1 text-xs">
            <button
              onClick={() => setControlTab('occasion')}
              className={`py-2.5 px-2 rounded-xl font-bold flex flex-col items-center gap-1 transition-all ${
                controlTab === 'occasion'
                  ? 'bg-amber-500 text-slate-950 shadow-md'
                  : 'text-slate-400 hover:text-white hover:bg-slate-800/50'
              }`}
            >
              <Gift className="w-4 h-4" />
              <span>Wishes</span>
            </button>

            <button
              onClick={() => setControlTab('library')}
              className={`py-2.5 px-2 rounded-xl font-bold flex flex-col items-center gap-1 transition-all ${
                controlTab === 'library'
                  ? 'bg-amber-500 text-slate-950 shadow-md'
                  : 'text-slate-400 hover:text-white hover:bg-slate-800/50'
              }`}
            >
              <ImageIcon className="w-4 h-4" />
              <span>Art Library</span>
            </button>

            <button
              onClick={() => setControlTab('photo')}
              className={`py-2.5 px-2 rounded-xl font-bold flex flex-col items-center gap-1 transition-all ${
                controlTab === 'photo'
                  ? 'bg-amber-500 text-slate-950 shadow-md'
                  : 'text-slate-400 hover:text-white hover:bg-slate-800/50'
              }`}
            >
              <Camera className="w-4 h-4" />
              <span>Client Photo</span>
            </button>

            <button
              onClick={() => setControlTab('branding')}
              className={`py-2.5 px-2 rounded-xl font-bold flex flex-col items-center gap-1 transition-all ${
                controlTab === 'branding'
                  ? 'bg-amber-500 text-slate-950 shadow-md'
                  : 'text-slate-400 hover:text-white hover:bg-slate-800/50'
              }`}
            >
              <Award className="w-4 h-4" />
              <span>Branding</span>
            </button>
          </div>

          {/* Tab 1: Occasion, Client Details & Typography */}
          {controlTab === 'occasion' && (
            <div className="p-5 space-y-5">
              {/* Occasion Switcher */}
              <div>
                <label className="text-xs font-bold text-slate-300 uppercase tracking-wider mb-2 block">
                  Select Occasion Category
                </label>
                <div className="grid grid-cols-4 gap-2">
                  <button
                    onClick={() => setActiveTab('birthday')}
                    className={`py-2 px-1 rounded-xl text-xs font-bold flex flex-col items-center gap-1 transition-all border ${
                      activeTab === 'birthday'
                        ? 'bg-amber-500/20 text-amber-300 border-amber-500/50 shadow'
                        : 'bg-slate-950/60 text-slate-400 border-slate-800 hover:text-white'
                    }`}
                  >
                    <Cake className="w-4 h-4 text-amber-400" />
                    <span>Birthday</span>
                  </button>

                  <button
                    onClick={() => setActiveTab('anniversary')}
                    className={`py-2 px-1 rounded-xl text-xs font-bold flex flex-col items-center gap-1 transition-all border ${
                      activeTab === 'anniversary'
                        ? 'bg-rose-500/20 text-rose-300 border-rose-500/50 shadow'
                        : 'bg-slate-950/60 text-slate-400 border-slate-800 hover:text-white'
                    }`}
                  >
                    <Heart className="w-4 h-4 text-rose-400" />
                    <span>Anniversary</span>
                  </button>

                  <button
                    onClick={() => setActiveTab('festivals')}
                    className={`py-2 px-1 rounded-xl text-xs font-bold flex flex-col items-center gap-1 transition-all border ${
                      activeTab === 'festivals'
                        ? 'bg-amber-500/20 text-amber-300 border-amber-500/50 shadow'
                        : 'bg-slate-950/60 text-slate-400 border-slate-800 hover:text-white'
                    }`}
                  >
                    <Sparkles className="w-4 h-4 text-yellow-400" />
                    <span>Festivals</span>
                  </button>

                  <button
                    onClick={() => setActiveTab('days')}
                    className={`py-2 px-1 rounded-xl text-xs font-bold flex flex-col items-center gap-1 transition-all border ${
                      activeTab === 'days'
                        ? 'bg-blue-500/20 text-blue-300 border-blue-500/50 shadow'
                        : 'bg-slate-950/60 text-slate-400 border-slate-800 hover:text-white'
                    }`}
                  >
                    <Calendar className="w-4 h-4 text-blue-400" />
                    <span>Special Days</span>
                  </button>
                </div>
              </div>

              {/* Sub-selector if Festivals is active */}
              {activeTab === 'festivals' && (
                <div className="bg-slate-950/70 p-3.5 rounded-xl border border-slate-800 space-y-2">
                  <label className="text-xs font-bold text-slate-300 flex items-center justify-between">
                    <span>Festival Selection</span>
                    <span className="text-[11px] text-amber-400 font-normal">
                      {selectedFestival.name}
                    </span>
                  </label>
                  <div className="relative">
                    <Search className="w-3.5 h-3.5 absolute left-3 top-3 text-slate-500" />
                    <input
                      type="text"
                      placeholder="Search Diwali, Holi, Navratri, Eid, Christmas..."
                      value={festivalSearch}
                      onChange={(e) => setFestivalSearch(e.target.value)}
                      className="w-full bg-slate-900 border border-slate-700/80 rounded-lg pl-8 pr-3 py-1.5 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-amber-400"
                    />
                  </div>
                  <div className="flex gap-2 overflow-x-auto pb-1 pt-1 no-scrollbar">
                    {FESTIVALS_LIST.filter((f) =>
                      f.name.toLowerCase().includes(festivalSearch.toLowerCase())
                    ).map((fest) => (
                      <button
                        key={fest.id}
                        onClick={() => {
                          setSelectedFestival(fest);
                          setSelectedFestivalBg(fest.bgPresets[0]);
                        }}
                        className={`px-3 py-1.5 rounded-lg text-xs font-semibold whitespace-nowrap flex items-center gap-1.5 border transition-all ${
                          selectedFestival.id === fest.id
                            ? 'bg-amber-500 text-slate-950 border-amber-400 font-bold'
                            : 'bg-slate-900 text-slate-300 border-slate-700 hover:border-slate-500'
                        }`}
                      >
                        <span>{fest.icon}</span>
                        <span>{fest.name}</span>
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {/* Sub-selector if Special Days is active */}
              {activeTab === 'days' && (
                <div className="bg-slate-950/70 p-3.5 rounded-xl border border-slate-800 space-y-2">
                  <label className="text-xs font-bold text-slate-300 flex items-center justify-between">
                    <span>Special Day Selection</span>
                    <span className="text-[11px] text-blue-400 font-normal">
                      {selectedSpecialDay.name} ({selectedSpecialDay.dateStr})
                    </span>
                  </label>
                  <div className="relative">
                    <Search className="w-3.5 h-3.5 absolute left-3 top-3 text-slate-500" />
                    <input
                      type="text"
                      placeholder="Search CA Day, Doctors Day, Teachers Day, Republic Day..."
                      value={specialDaySearch}
                      onChange={(e) => setSpecialDaySearch(e.target.value)}
                      className="w-full bg-slate-900 border border-slate-700/80 rounded-lg pl-8 pr-3 py-1.5 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-blue-400"
                    />
                  </div>
                  <div className="flex gap-2 overflow-x-auto pb-1 pt-1 no-scrollbar">
                    {SPECIAL_DAYS_LIST.filter((d) =>
                      d.name.toLowerCase().includes(specialDaySearch.toLowerCase())
                    ).map((day) => (
                      <button
                        key={day.id}
                        onClick={() => {
                          setSelectedSpecialDay(day);
                          setSelectedSpecialDayBg(day.bgPresets[0]);
                        }}
                        className={`px-3 py-1.5 rounded-lg text-xs font-semibold whitespace-nowrap flex items-center gap-1.5 border transition-all ${
                          selectedSpecialDay.id === day.id
                            ? 'bg-blue-500 text-slate-950 border-blue-400 font-bold'
                            : 'bg-slate-900 text-slate-300 border-slate-700 hover:border-slate-500'
                        }`}
                      >
                        <span>{day.icon}</span>
                        <span>{day.name}</span>
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {/* Client Name & Language */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="text-xs font-semibold text-slate-300 mb-1 block">
                    Recipient / Client Name
                  </label>
                  <div className="relative">
                    <User className="w-4 h-4 absolute left-3 top-2.5 text-slate-500" />
                    <input
                      type="text"
                      value={recipientName}
                      onChange={(e) => setRecipientName(e.target.value)}
                      placeholder="e.g. Rajeshbhai Patel"
                      className="w-full bg-slate-950 border border-slate-800 rounded-xl pl-9 pr-3 py-2 text-sm text-white focus:outline-none focus:border-amber-400"
                    />
                  </div>
                </div>

                <div>
                  <label className="text-xs font-semibold text-slate-300 mb-1 block">
                    Greeting Language
                  </label>
                  <div className="grid grid-cols-3 gap-1 bg-slate-950 p-1 rounded-xl border border-slate-800">
                    <button
                      onClick={() => setGreetingLang('en')}
                      className={`py-1.5 rounded-lg text-xs font-medium transition-all ${
                        greetingLang === 'en'
                          ? 'bg-amber-500 text-slate-950 font-bold'
                          : 'text-slate-400 hover:text-white'
                      }`}
                    >
                      English
                    </button>
                    <button
                      onClick={() => setGreetingLang('gu')}
                      className={`py-1.5 rounded-lg text-xs font-medium transition-all ${
                        greetingLang === 'gu'
                          ? 'bg-amber-500 text-slate-950 font-bold'
                          : 'text-slate-400 hover:text-white'
                      }`}
                    >
                      ગુજરાતી
                    </button>
                    <button
                      onClick={() => setGreetingLang('hi')}
                      className={`py-1.5 rounded-lg text-xs font-medium transition-all ${
                        greetingLang === 'hi'
                          ? 'bg-amber-500 text-slate-950 font-bold'
                          : 'text-slate-400 hover:text-white'
                      }`}
                    >
                      हिन्दी
                    </button>
                  </div>
                </div>
              </div>

              {/* Salutation & Heartfelt Message */}
              <div className="space-y-3">
                <div>
                  <label className="text-xs font-semibold text-slate-300 mb-1 flex items-center justify-between">
                    <span>Salutation Header</span>
                    <button
                      onClick={() => setCustomSalutation('')}
                      className="text-[11px] text-slate-500 hover:text-amber-400"
                    >
                      Reset Default
                    </button>
                  </label>
                  <input
                    type="text"
                    value={greetingContent.salutation}
                    onChange={(e) => setCustomSalutation(e.target.value)}
                    placeholder="e.g. Dear Rajeshbhai Patel"
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-sm text-amber-300 focus:outline-none focus:border-amber-400 font-medium"
                  />
                </div>

                <div>
                  <label className="text-xs font-semibold text-slate-300 mb-1 flex items-center justify-between">
                    <span>Greeting Wishes (Multi-line)</span>
                    <button
                      onClick={() => setCustomWishText('')}
                      className="text-[11px] text-slate-500 hover:text-amber-400"
                    >
                      Reset Default
                    </button>
                  </label>
                  <textarea
                    rows={3}
                    value={greetingContent.message}
                    onChange={(e) => setCustomWishText(e.target.value)}
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl p-3 text-xs leading-relaxed text-slate-200 focus:outline-none focus:border-amber-400 resize-none"
                  />
                </div>
              </div>

              {/* Typography & Visual Positioning */}
              <div className="bg-slate-950/60 p-4 rounded-xl border border-slate-800/80 space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-slate-300 flex items-center gap-1.5">
                    <Type className="w-3.5 h-3.5 text-amber-400" /> Typography Theme & Layout
                  </span>
                  <div className="flex items-center gap-1">
                    <button
                      onClick={() => setShowOccasionIcon(!showOccasionIcon)}
                      className={`text-[11px] px-2 py-0.5 rounded border transition-all ${
                        showOccasionIcon
                          ? 'bg-amber-500/20 text-amber-300 border-amber-500/40'
                          : 'bg-slate-900 text-slate-500 border-slate-800'
                      }`}
                    >
                      {showOccasionIcon ? 'Icon Visible' : 'Icon Hidden'}
                    </button>
                  </div>
                </div>

                {/* Typography Color Palette */}
                <div className="grid grid-cols-4 gap-2">
                  {[
                    { id: 'gold', label: 'Royal Gold', color: '#facc15' },
                    { id: 'pearl', label: 'Pearl White', color: '#ffffff' },
                    { id: 'rose_gold', label: 'Rose Gold', color: '#fda4af' },
                    { id: 'saffron', label: 'Sunset Saffron', color: '#f97316' },
                  ].map((theme) => (
                    <button
                      key={theme.id}
                      onClick={() => setTypographyTheme(theme.id as TypographyTheme)}
                      className={`py-1.5 px-1 rounded-lg text-[11px] font-semibold border flex items-center justify-center gap-1.5 transition-all ${
                        typographyTheme === theme.id
                          ? 'border-amber-400 bg-amber-500/10 text-white font-bold'
                          : 'border-slate-800 bg-slate-900 text-slate-400 hover:text-white'
                      }`}
                    >
                      <span className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: theme.color }} />
                      <span className="truncate">{theme.label}</span>
                    </button>
                  ))}
                </div>

                {/* Text Position & Alignment Anchors */}
                <div className="grid grid-cols-2 gap-3 pt-1">
                  <div>
                    <label className="text-[11px] font-medium text-slate-400 mb-1 block">
                      Vertical Placement
                    </label>
                    <div className="grid grid-cols-3 gap-1 bg-slate-900 p-1 rounded-lg border border-slate-800 text-xs">
                      {(['top', 'middle', 'bottom'] as TextAnchor[]).map((anchor) => (
                        <button
                          key={anchor}
                          onClick={() => setTextAnchor(anchor)}
                          className={`py-1 rounded capitalize font-medium ${
                            textAnchor === anchor
                              ? 'bg-amber-500 text-slate-950 font-bold'
                              : 'text-slate-400 hover:text-white'
                          }`}
                        >
                          {anchor}
                        </button>
                      ))}
                    </div>
                  </div>

                  <div>
                    <label className="text-[11px] font-medium text-slate-400 mb-1 block">
                      Text Contrast Backplate
                    </label>
                    <div className="grid grid-cols-3 gap-1 bg-slate-900 p-1 rounded-lg border border-slate-800 text-xs">
                      {[
                        { id: 'none', label: 'None' },
                        { id: 'subtle_badge', label: 'Shadow' },
                        { id: 'frosted_box', label: 'Frosted' },
                      ].map((item) => (
                        <button
                          key={item.id}
                          onClick={() => setTextBackplate(item.id as TextBackplate)}
                          className={`py-1 rounded font-medium ${
                            textBackplate === item.id
                              ? 'bg-amber-500 text-slate-950 font-bold'
                              : 'text-slate-400 hover:text-white'
                          }`}
                        >
                          {item.label}
                        </button>
                      ))}
                    </div>
                  </div>
                </div>

                {/* Fine Offset Sliders */}
                <div className="pt-2 border-t border-slate-800/80 space-y-2">
                  <div className="flex items-center justify-between text-[11px] text-slate-400">
                    <span>Fine Y-Adjustment:</span>
                    <input
                      type="range"
                      min="-0.2"
                      max="0.2"
                      step="0.01"
                      value={textOffsetY}
                      onChange={(e) => setTextOffsetY(parseFloat(e.target.value))}
                      className="w-36 accent-amber-500"
                    />
                    <button
                      onClick={() => setTextOffsetY(0)}
                      className="text-slate-500 hover:text-amber-400 ml-1"
                    >
                      0
                    </button>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Tab 2: Art Library & GitHub Repository Integration */}
          {controlTab === 'library' && (
            <div className="p-5 space-y-5">
              {/* GitHub Cloud Connection Status */}
              <div className="bg-gradient-to-r from-slate-950 to-slate-900 border border-slate-800 rounded-xl p-3.5 space-y-2">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <div className="p-1.5 bg-slate-800 rounded-lg text-white">
                      <Github className="w-4 h-4" />
                    </div>
                    <div>
                      <h4 className="text-xs font-bold text-white flex items-center gap-1.5">
                        GitHub Repository:
                        <span className="text-amber-400 font-mono text-[11px]">
                          {githubConfig.owner}/{githubConfig.repo}
                        </span>
                      </h4>
                      <p className="text-[11px] text-slate-400">
                        Branch: <span className="font-mono text-slate-300">{githubConfig.branch}</span> • Auto-Sync Enabled
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center gap-1.5">
                    <button
                      onClick={() => handleSyncGithub()}
                      disabled={isSyncingGithub}
                      className="px-3 py-1.5 bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 rounded-lg text-xs font-semibold flex items-center gap-1.5 transition-all"
                      title="Fetch latest images from GitHub repository"
                    >
                      <RefreshCw className={`w-3.5 h-3.5 text-amber-400 ${isSyncingGithub ? 'animate-spin' : ''}`} />
                      <span>{isSyncingGithub ? 'Syncing...' : 'Sync Now'}</span>
                    </button>

                    <button
                      onClick={() => setShowGithubSettings(!showGithubSettings)}
                      className="p-1.5 bg-slate-800 hover:bg-slate-700 text-slate-400 hover:text-white rounded-lg border border-slate-700"
                      title="Configure repository settings"
                    >
                      <Sliders className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>

                {githubSyncNotice && (
                  <div className="text-[11px] text-amber-300 bg-amber-500/10 border border-amber-500/20 px-2.5 py-1 rounded-md">
                    {githubSyncNotice}
                  </div>
                )}

                {/* GitHub Config Modal Dropdown */}
                {showGithubSettings && (
                  <div className="pt-2 border-t border-slate-800 space-y-2">
                    <div className="grid grid-cols-3 gap-2 text-xs">
                      <div>
                        <label className="text-[10px] text-slate-400 block mb-0.5">Repo Owner</label>
                        <input
                          type="text"
                          value={githubConfig.owner}
                          onChange={(e) => setGithubConfig({ ...githubConfig, owner: e.target.value })}
                          className="w-full bg-slate-900 border border-slate-700 rounded px-2 py-1 text-white text-xs"
                        />
                      </div>
                      <div>
                        <label className="text-[10px] text-slate-400 block mb-0.5">Repo Name</label>
                        <input
                          type="text"
                          value={githubConfig.repo}
                          onChange={(e) => setGithubConfig({ ...githubConfig, repo: e.target.value })}
                          className="w-full bg-slate-900 border border-slate-700 rounded px-2 py-1 text-white text-xs"
                        />
                      </div>
                      <div>
                        <label className="text-[10px] text-slate-400 block mb-0.5">Branch</label>
                        <input
                          type="text"
                          value={githubConfig.branch}
                          onChange={(e) => setGithubConfig({ ...githubConfig, branch: e.target.value })}
                          className="w-full bg-slate-900 border border-slate-700 rounded px-2 py-1 text-white text-xs"
                        />
                      </div>
                    </div>
                    <div className="flex justify-end gap-2 pt-1">
                      <button
                        onClick={() => {
                          setGithubConfig(DEFAULT_GITHUB_CONFIG);
                          saveGitHubConfig(DEFAULT_GITHUB_CONFIG);
                          handleSyncGithub(DEFAULT_GITHUB_CONFIG);
                        }}
                        className="text-[11px] text-slate-400 hover:text-white"
                      >
                        Reset Defaults
                      </button>
                      <button
                        onClick={() => {
                          saveGitHubConfig(githubConfig);
                          handleSyncGithub(githubConfig);
                          setShowGithubSettings(false);
                        }}
                        className="px-3 py-1 bg-amber-500 text-slate-950 font-bold rounded text-xs"
                      >
                        Save & Connect
                      </button>
                    </div>
                  </div>
                )}
              </div>

              {/* Category Filter Tabs */}
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <label className="text-xs font-bold text-slate-300 uppercase tracking-wider">
                    Browse Artwork Categories
                  </label>
                  <span className="text-[11px] text-slate-500">
                    {displayedLibraryPresets.length} Artworks
                  </span>
                </div>

                <div className="flex flex-wrap gap-1.5">
                  {[
                    { id: 'all', label: '✨ All Curated' },
                    { id: 'birthday', label: '🎂 Birthday' },
                    { id: 'anniversary', label: '💍 Anniversary' },
                    { id: 'diwali', label: '🪔 Diwali' },
                    { id: 'festivals', label: '🎉 Festivals' },
                    { id: 'specialDays', label: '🇮🇳 Special Days' },
                    { id: 'custom', label: '📁 Custom Upload' },
                  ].map((cat) => (
                    <button
                      key={cat.id}
                      onClick={() => setLibraryCategory(cat.id as any)}
                      className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all border ${
                        libraryCategory === cat.id
                          ? 'bg-amber-500 text-slate-950 border-amber-400 font-bold shadow'
                          : 'bg-slate-950/70 text-slate-400 border-slate-800 hover:text-white'
                      }`}
                    >
                      {cat.label}
                    </button>
                  ))}
                </div>
              </div>

              {/* Grid of Background Thumbnails */}
              <div className="grid grid-cols-3 sm:grid-cols-4 gap-2.5 max-h-[380px] overflow-y-auto pr-1 no-scrollbar">
                {displayedLibraryPresets.map((preset) => {
                  const isSelected = currentBgPreset.id === preset.id && !isUsingCustomBg;
                  return (
                    <button
                      key={preset.id}
                      onClick={() => {
                        setIsUsingCustomBg(false);
                        if (activeTab === 'birthday') setSelectedBdayBg(preset);
                        else if (activeTab === 'anniversary') setSelectedAnniBg(preset);
                        else if (activeTab === 'festivals') setSelectedFestivalBg(preset);
                        else if (activeTab === 'days') setSelectedSpecialDayBg(preset);
                      }}
                      className={`group relative rounded-xl overflow-hidden aspect-[2/3] border-2 transition-all transform active:scale-95 text-left ${
                        isSelected
                          ? 'border-amber-400 ring-2 ring-amber-400/30 shadow-lg shadow-amber-500/20'
                          : 'border-slate-800 hover:border-slate-600 opacity-80 hover:opacity-100'
                      }`}
                    >
                      <img
                        src={preset.thumbnailUrl}
                        alt={preset.name}
                        className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
                        loading="lazy"
                        onError={(e) => {
                          // Image load fallback
                          const target = e.target as HTMLImageElement;
                          target.src = preset.fullUrl;
                        }}
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-transparent to-transparent opacity-90" />
                      <div className="absolute bottom-1.5 left-1.5 right-1.5">
                        <span className="text-[10px] font-bold text-white line-clamp-1 drop-shadow">
                          {preset.name}
                        </span>
                      </div>
                      {isSelected && (
                        <div className="absolute top-1.5 right-1.5 w-5 h-5 bg-amber-500 text-slate-950 rounded-full flex items-center justify-center font-bold text-xs shadow">
                          ✓
                        </div>
                      )}
                    </button>
                  );
                })}
              </div>

              {/* Custom Artwork Loader & URL Input */}
              <div className="bg-slate-950/70 p-4 rounded-xl border border-slate-800/80 space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-slate-300 flex items-center gap-1.5">
                    <Upload className="w-3.5 h-3.5 text-amber-400" /> Upload Custom Background
                  </span>
                  {isUsingCustomBg && (
                    <button
                      onClick={() => setIsUsingCustomBg(false)}
                      className="text-[11px] text-rose-400 hover:underline flex items-center gap-1"
                    >
                      <Trash2 className="w-3 h-3" /> Revert to Library
                    </button>
                  )}
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                  <button
                    onClick={() => fileInputBgRef.current?.click()}
                    className="w-full py-2.5 px-3 rounded-xl bg-slate-900 hover:bg-slate-800 text-slate-300 border border-slate-700/80 text-xs font-semibold flex items-center justify-center gap-2 transition-all"
                  >
                    <Upload className="w-4 h-4 text-emerald-400" />
                    <span>Upload Image File</span>
                  </button>
                  <input
                    ref={fileInputBgRef}
                    type="file"
                    accept="image/*"
                    onChange={handleCustomBgUpload}
                    className="hidden"
                  />

                  <div className="flex items-center gap-1">
                    <input
                      type="url"
                      placeholder="Paste Image URL..."
                      value={customImageUrlInput}
                      onChange={(e) => setCustomImageUrlInput(e.target.value)}
                      className="w-full bg-slate-900 border border-slate-800 rounded-lg px-2.5 py-2 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-amber-400"
                    />
                    <button
                      onClick={handleCustomUrlLoad}
                      className="px-3 py-2 bg-slate-800 hover:bg-slate-700 text-amber-400 font-bold rounded-lg text-xs border border-slate-700 whitespace-nowrap"
                    >
                      Load
                    </button>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Tab 3: Customer Photo Layer Controls */}
          {controlTab === 'photo' && (
            <div className="p-5 space-y-5">
              {/* Photo Toggle */}
              <div className="flex items-center justify-between bg-slate-950/70 p-3.5 rounded-xl border border-slate-800">
                <div>
                  <h4 className="text-xs font-bold text-white flex items-center gap-1.5">
                    <Camera className="w-4 h-4 text-amber-400" />
                    Customer Portrait Layer
                  </h4>
                  <p className="text-[11px] text-slate-400 mt-0.5">
                    Display recipient portrait framed with golden accents
                  </p>
                </div>
                <button
                  onClick={() => setHasCustomerPhoto(!hasCustomerPhoto)}
                  className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
                    hasCustomerPhoto
                      ? 'bg-emerald-500 text-slate-950 shadow'
                      : 'bg-slate-800 text-slate-400 hover:text-white'
                  }`}
                >
                  {hasCustomerPhoto ? 'Enabled' : 'Disabled'}
                </button>
              </div>

              {hasCustomerPhoto ? (
                <>
                  {/* Upload Customer Photo */}
                  <div className="space-y-2">
                    <label className="text-xs font-semibold text-slate-300 block">
                      Customer Photo Source
                    </label>
                    <div className="flex items-center gap-3">
                      <div className="w-16 h-16 rounded-xl bg-slate-950 border border-slate-800 overflow-hidden flex items-center justify-center flex-shrink-0">
                        {customerPhotoUrl ? (
                          <img
                            src={customerPhotoUrl}
                            alt="Customer"
                            className="w-full h-full object-cover"
                          />
                        ) : (
                          <User className="w-6 h-6 text-slate-600" />
                        )}
                      </div>

                      <div className="flex-1 space-y-2">
                        <button
                          onClick={() => fileInputCustomerRef.current?.click()}
                          className="w-full py-2 px-3 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 text-xs font-semibold flex items-center justify-center gap-2 transition-all"
                        >
                          <Upload className="w-3.5 h-3.5 text-amber-400" />
                          <span>{customerPhotoUrl ? 'Change Portrait Photo' : 'Upload Client Photo'}</span>
                        </button>
                        <input
                          ref={fileInputCustomerRef}
                          type="file"
                          accept="image/*"
                          onChange={handleCustomerPhotoUpload}
                          className="hidden"
                        />
                        {customerPhotoUrl && (
                          <button
                            onClick={() => {
                              setCustomerPhotoUrl(null);
                              setHasCustomerPhoto(false);
                            }}
                            className="text-[11px] text-rose-400 hover:underline flex items-center gap-1"
                          >
                            <Trash2 className="w-3 h-3" /> Remove Photo
                          </button>
                        )}
                      </div>
                    </div>
                  </div>

                  {/* Frame Shapes */}
                  <div className="space-y-2">
                    <label className="text-xs font-semibold text-slate-300 block">
                      Portrait Frame Shape
                    </label>
                    <div className="grid grid-cols-4 gap-2">
                      {[
                        { id: 'circle', label: 'Circle' },
                        { id: 'squircle', label: 'Squircle' },
                        { id: 'diamond', label: 'Diamond' },
                        { id: 'gold_shield', label: 'Shield' },
                      ].map((shape) => (
                        <button
                          key={shape.id}
                          onClick={() => setCustomerPhotoShape(shape.id as PhotoShape)}
                          className={`py-2 rounded-lg text-xs font-semibold border capitalize transition-all ${
                            customerPhotoShape === shape.id
                              ? 'bg-amber-500/20 text-amber-300 border-amber-400 font-bold'
                              : 'bg-slate-950/70 text-slate-400 border-slate-800 hover:text-white'
                          }`}
                        >
                          {shape.label}
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Position Anchors */}
                  <div className="space-y-2">
                    <label className="text-xs font-semibold text-slate-300 block">
                      Position Anchor
                    </label>
                    <div className="grid grid-cols-3 gap-2">
                      {[
                        { id: 'top_center', label: 'Top Center' },
                        { id: 'top_left', label: 'Top Left' },
                        { id: 'top_right', label: 'Top Right' },
                        { id: 'center', label: 'Center' },
                        { id: 'center_left', label: 'Mid Left' },
                        { id: 'center_right', label: 'Mid Right' },
                      ].map((anchor) => (
                        <button
                          key={anchor.id}
                          onClick={() => {
                            setCustomerPhotoAnchor(anchor.id as PhotoAnchor);
                            setPhotoOffsetX(0);
                            setPhotoOffsetY(0);
                          }}
                          className={`py-1.5 rounded-lg text-xs font-semibold border transition-all ${
                            customerPhotoAnchor === anchor.id
                              ? 'bg-amber-500 text-slate-950 border-amber-400 font-bold shadow'
                              : 'bg-slate-950/70 text-slate-400 border-slate-800 hover:text-white'
                          }`}
                        >
                          {anchor.label}
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Size & Offset Sliders */}
                  <div className="bg-slate-950/60 p-3.5 rounded-xl border border-slate-800/80 space-y-3">
                    <div className="flex items-center justify-between text-xs">
                      <span className="text-slate-400">Photo Scale:</span>
                      <input
                        type="range"
                        min="0.6"
                        max="1.5"
                        step="0.05"
                        value={customerPhotoScale}
                        onChange={(e) => setCustomerPhotoScale(parseFloat(e.target.value))}
                        className="w-36 accent-amber-500"
                      />
                      <span className="font-mono text-slate-300 text-[11px] w-10 text-right">
                        {Math.round(customerPhotoScale * 100)}%
                      </span>
                    </div>

                    <div className="flex items-center justify-between text-xs">
                      <span className="text-slate-400">Fine X-Offset:</span>
                      <input
                        type="range"
                        min="-0.3"
                        max="0.3"
                        step="0.01"
                        value={photoOffsetX}
                        onChange={(e) => setPhotoOffsetX(parseFloat(e.target.value))}
                        className="w-36 accent-amber-500"
                      />
                      <button
                        onClick={() => setPhotoOffsetX(0)}
                        className="text-slate-500 hover:text-amber-400 text-[11px] w-10 text-right"
                      >
                        Reset
                      </button>
                    </div>

                    <div className="flex items-center justify-between text-xs">
                      <span className="text-slate-400">Fine Y-Offset:</span>
                      <input
                        type="range"
                        min="-0.3"
                        max="0.3"
                        step="0.01"
                        value={photoOffsetY}
                        onChange={(e) => setPhotoOffsetY(parseFloat(e.target.value))}
                        className="w-36 accent-amber-500"
                      />
                      <button
                        onClick={() => setPhotoOffsetY(0)}
                        className="text-slate-500 hover:text-amber-400 text-[11px] w-10 text-right"
                      >
                        Reset
                      </button>
                    </div>
                  </div>
                </>
              ) : (
                <div className="p-8 text-center bg-slate-950/50 rounded-2xl border border-dashed border-slate-800 text-slate-500 space-y-2">
                  <Camera className="w-8 h-8 mx-auto text-slate-600" />
                  <p className="text-xs">
                    Enable client portrait to place photo in a luxurious gold ring frame.
                  </p>
                  <button
                    onClick={() => {
                      setHasCustomerPhoto(true);
                      fileInputCustomerRef.current?.click();
                    }}
                    className="px-4 py-2 bg-amber-500 text-slate-950 font-bold rounded-xl text-xs inline-flex items-center gap-1.5 shadow"
                  >
                    <Upload className="w-3.5 h-3.5" />
                    Upload Photo Now
                  </button>
                </div>
              )}
            </div>
          )}

          {/* Tab 4: Advisor Branding & Footer Architecture */}
          {controlTab === 'branding' && (
            <div className="p-5 space-y-5">
              {/* Branding Toggle */}
              <div className="flex items-center justify-between bg-slate-950/70 p-3.5 rounded-xl border border-slate-800">
                <div>
                  <h4 className="text-xs font-bold text-white flex items-center gap-1.5">
                    <Award className="w-4 h-4 text-amber-400" />
                    Advisor Endorsement Card
                  </h4>
                  <p className="text-[11px] text-slate-400 mt-0.5">
                    Safe bottom zone credentials and compliments banner
                  </p>
                </div>
                <button
                  onClick={() => setShowAdvisorCard(!showAdvisorCard)}
                  className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
                    showAdvisorCard
                      ? 'bg-emerald-500 text-slate-950 shadow'
                      : 'bg-slate-800 text-slate-400 hover:text-white'
                  }`}
                >
                  {showAdvisorCard ? 'Visible' : 'Hidden'}
                </button>
              </div>

              {showAdvisorCard && (
                <>
                  {/* Footer Style Variants */}
                  <div className="space-y-2">
                    <label className="text-xs font-semibold text-slate-300 block">
                      Card Aesthetic Style
                    </label>
                    <div className="grid grid-cols-3 gap-2">
                      {[
                        { id: 'frosted_glass', label: 'Frosted Glass' },
                        { id: 'solid_card', label: 'Midnight Solid' },
                        { id: 'minimal_banner', label: 'Minimal Banner' },
                        { id: 'elegant_classic', label: 'Royal Classic' },
                        { id: 'floating_badge', label: 'Floating Badge' },
                      ].map((style) => (
                        <button
                          key={style.id}
                          onClick={() => setFooterStyle(style.id as FooterStyle)}
                          className={`py-2 px-1 rounded-lg text-xs font-semibold border transition-all ${
                            footerStyle === style.id
                              ? 'bg-amber-500/20 text-amber-300 border-amber-400 font-bold shadow'
                              : 'bg-slate-950/70 text-slate-400 border-slate-800 hover:text-white'
                          }`}
                        >
                          {style.label}
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Advisor Photo / Avatar */}
                  <div className="space-y-2">
                    <label className="text-xs font-semibold text-slate-300 block">
                      Advisor Profile Photo
                    </label>
                    <div className="flex items-center gap-3">
                      <div className="w-12 h-12 rounded-full bg-slate-950 border border-amber-400/60 overflow-hidden flex items-center justify-center flex-shrink-0 shadow">
                        {advisorAvatarUrl ? (
                          <img src={advisorAvatarUrl} alt="Advisor" className="w-full h-full object-cover" />
                        ) : (
                          <span className="text-amber-400 font-bold text-sm">
                            {advisorName.slice(0, 2).toUpperCase()}
                          </span>
                        )}
                      </div>

                      <div className="flex-1 flex items-center gap-2">
                        <button
                          onClick={() => fileInputAdvisorRef.current?.click()}
                          className="py-1.5 px-3 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 text-xs font-semibold flex items-center gap-1.5 transition-all"
                        >
                          <Upload className="w-3.5 h-3.5 text-amber-400" />
                          <span>{advisorAvatarUrl ? 'Change Photo' : 'Upload Avatar'}</span>
                        </button>
                        <input
                          ref={fileInputAdvisorRef}
                          type="file"
                          accept="image/*"
                          onChange={handleAdvisorAvatarUpload}
                          className="hidden"
                        />
                        {advisorAvatarUrl && (
                          <button
                            onClick={() => setAdvisorAvatarUrl(null)}
                            className="text-[11px] text-rose-400 hover:underline"
                          >
                            Remove
                          </button>
                        )}
                      </div>
                    </div>
                  </div>

                  {/* Advisor Form Details */}
                  <div className="space-y-3">
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      <div>
                        <label className="text-[11px] font-semibold text-slate-400 block mb-1">
                          Advisor Name
                        </label>
                        <input
                          type="text"
                          value={advisorName}
                          onChange={(e) => setAdvisorName(e.target.value)}
                          className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-1.5 text-xs text-white focus:outline-none focus:border-amber-400"
                        />
                      </div>

                      <div>
                        <label className="text-[11px] font-semibold text-slate-400 block mb-1">
                          Designation / Title
                        </label>
                        <input
                          type="text"
                          value={advisorDesignation}
                          onChange={(e) => setAdvisorDesignation(e.target.value)}
                          className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-1.5 text-xs text-white focus:outline-none focus:border-amber-400"
                        />
                      </div>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      <div>
                        <label className="text-[11px] font-semibold text-slate-400 block mb-1">
                          Firm / Brand Name
                        </label>
                        <input
                          type="text"
                          value={firmName}
                          onChange={(e) => setFirmName(e.target.value)}
                          className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-1.5 text-xs text-white focus:outline-none focus:border-amber-400"
                        />
                      </div>

                      <div>
                        <label className="text-[11px] font-semibold text-slate-400 block mb-1">
                          Phone / WhatsApp Number
                        </label>
                        <input
                          type="text"
                          value={phoneNumber}
                          onChange={(e) => setPhoneNumber(e.target.value)}
                          className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-1.5 text-xs text-white focus:outline-none focus:border-amber-400"
                        />
                      </div>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      <div>
                        <label className="text-[11px] font-semibold text-slate-400 block mb-1">
                          AMFI ARN Number
                        </label>
                        <input
                          type="text"
                          value={arnNumber}
                          onChange={(e) => setArnNumber(e.target.value)}
                          className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-1.5 text-xs text-white focus:outline-none focus:border-amber-400 font-mono"
                        />
                      </div>

                      <div>
                        <label className="text-[11px] font-semibold text-slate-400 block mb-1">
                          Website / Email
                        </label>
                        <input
                          type="text"
                          value={website}
                          onChange={(e) => setWebsite(e.target.value)}
                          className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-1.5 text-xs text-white focus:outline-none focus:border-amber-400 font-mono"
                        />
                      </div>
                    </div>
                  </div>
                </>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

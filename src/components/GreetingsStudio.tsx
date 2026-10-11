import React, { useState, useEffect, useRef, useMemo } from 'react';
import { useI18n } from '../context/I18nContext';
import { useAdvisor } from '../context/AdvisorContext';
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
  Briefcase,
  Calendar,
  Globe,
  Sun,
  Camera,
} from 'lucide-react';
import { LanguageCode } from '../types';
import {
  BIRTHDAY_BACKGROUNDS,
  ANNIVERSARY_BACKGROUNDS,
  FESTIVALS_LIST,
  SPECIAL_DAYS_LIST,
  EVENT_BACKGROUND_MAPPINGS,
  BackgroundPreset,
  FestivalItem,
  SpecialDayItem,
} from '../constants/greetingsData';
import {
  renderGreetingCard,
  GreetingCanvasOptions,
  AdvisorBrandingData,
} from '../utils/greetingCanvasRenderer';

interface GreetingsStudioProps {
  initialTab?: 'birthday' | 'anniversary' | 'festivals' | 'days';
  initialRecipientName?: string;
}

type GreetingTab = 'birthday' | 'anniversary' | 'festivals' | 'days';

export const GreetingsStudio: React.FC<GreetingsStudioProps> = ({
  initialTab = 'birthday',
  initialRecipientName = '',
}) => {
  const { language } = useI18n();
  const { profile } = useAdvisor();

  // Navigation & Active Occasion
  const [activeTab, setActiveTab] = useState<GreetingTab>(initialTab);
  const [recipientName, setRecipientName] = useState<string>(initialRecipientName || 'Rajeshbhai Patel');
  const [greetingLang, setGreetingLang] = useState<LanguageCode>('en'); // Default English strictly as required

  // Selections for each category
  const [selectedBdayBg, setSelectedBdayBg] = useState<BackgroundPreset>(BIRTHDAY_BACKGROUNDS[0]);
  const [selectedAnniBg, setSelectedAnniBg] = useState<BackgroundPreset>(ANNIVERSARY_BACKGROUNDS[0]);
  const [selectedFestival, setSelectedFestival] = useState<FestivalItem>(FESTIVALS_LIST[0]);
  const [selectedFestivalBg, setSelectedFestivalBg] = useState<BackgroundPreset>(FESTIVALS_LIST[0].bgPresets[0]);
  const [selectedSpecialDay, setSelectedSpecialDay] = useState<SpecialDayItem>(SPECIAL_DAYS_LIST[0]);
  const [selectedSpecialDayBg, setSelectedSpecialDayBg] = useState<BackgroundPreset>(SPECIAL_DAYS_LIST[0].bgPresets[0]);

  // Search queries for large lists
  const [festivalSearch, setFestivalSearch] = useState<string>('');
  const [specialDaySearch, setSpecialDaySearch] = useState<string>('');

  // Custom Background from Advisor's Device
  const [customBgUrl, setCustomBgUrl] = useState<string | null>(null);
  const [isUsingCustomBg, setIsUsingCustomBg] = useState<boolean>(false);
  const [bgDarkness, setBgDarkness] = useState<number>(0.42);

  // Customer Photo Upload & Frame
  const [hasCustomerPhoto, setHasCustomerPhoto] = useState<boolean>(false);
  const [customerPhotoUrl, setCustomerPhotoUrl] = useState<string | null>(null);
  const [customerPhotoShape, setCustomerPhotoShape] = useState<'circle' | 'square_rounded'>('circle');

  // Text Customization
  const [customWishText, setCustomWishText] = useState<string>('');
  const [customSalutation, setCustomSalutation] = useState<string>('');

  // Advisor Custom Branding Drawer
  const [showAdvisorEditor, setShowAdvisorEditor] = useState<boolean>(false);
  const [advisorName, setAdvisorName] = useState<string>(profile.advisorName || 'Chintan Raval');
  const [advisorDesignation, setAdvisorDesignation] = useState<string>(profile.designation || 'Financial Advisor & Wealth Architect');
  const [firmName, setFirmName] = useState<string>('Raval Finserv Wealth');
  const [phoneNumber, setPhoneNumber] = useState<string>(profile.phoneNumber || '+91 98765 43210');
  const [arnNumber, setArnNumber] = useState<string>(profile.professionalDetails || 'ARN-123456');
  const [website, setWebsite] = useState<string>(profile.website || 'www.ravalfinserv.com');

  // Resolution & Canvas state
  const [resolution, setResolution] = useState<'hd' | '4k'>('hd'); // hd: 1080x1080, 4k: 2160x2160
  const [isCopied, setIsCopied] = useState<boolean>(false);
  const [isRendering, setIsRendering] = useState<boolean>(false);
  const [actionNotice, setActionNotice] = useState<string | null>(null);

  const canvasRef = useRef<HTMLCanvasElement>(null);
  const bgImageRef = useRef<HTMLImageElement | null>(null);
  const customerPhotoRef = useRef<HTMLImageElement | null>(null);
  const fileInputBgRef = useRef<HTMLInputElement>(null);
  const fileInputCustomerRef = useRef<HTMLInputElement>(null);

  // Sync initial props
  useEffect(() => {
    if (initialTab) setActiveTab(initialTab);
    if (initialRecipientName) setRecipientName(initialRecipientName);
  }, [initialTab, initialRecipientName]);

  // Update profile fallback if profile changes
  useEffect(() => {
    if (profile.advisorName && !advisorName) setAdvisorName(profile.advisorName);
    if (profile.designation && !advisorDesignation) setAdvisorDesignation(profile.designation);
    if (profile.phoneNumber && !phoneNumber) setPhoneNumber(profile.phoneNumber);
  }, [profile]);

  // Filtered lists
  const filteredFestivals = useMemo(() => {
    const q = festivalSearch.toLowerCase().trim();
    if (!q) return FESTIVALS_LIST;
    return FESTIVALS_LIST.filter(
      (f) =>
        f.name.toLowerCase().includes(q) ||
        f.nameGu.toLowerCase().includes(q) ||
        f.nameHi.toLowerCase().includes(q) ||
        f.month.toLowerCase().includes(q)
    );
  }, [festivalSearch]);

  const filteredSpecialDays = useMemo(() => {
    const q = specialDaySearch.toLowerCase().trim();
    if (!q) return SPECIAL_DAYS_LIST;
    return SPECIAL_DAYS_LIST.filter(
      (d) =>
        d.name.toLowerCase().includes(q) ||
        d.nameGu.toLowerCase().includes(q) ||
        d.nameHi.toLowerCase().includes(q) ||
        d.category.toLowerCase().includes(q) ||
        d.dateStr.toLowerCase().includes(q)
    );
  }, [specialDaySearch]);

  // Active event matching presets list (2-3 tailored themes per event)
  const matchingPresets: BackgroundPreset[] = useMemo(() => {
    if (activeTab === 'birthday') return BIRTHDAY_BACKGROUNDS;
    if (activeTab === 'anniversary') return ANNIVERSARY_BACKGROUNDS;
    if (activeTab === 'festivals') return selectedFestival?.bgPresets || [];
    return selectedSpecialDay?.bgPresets || [];
  }, [activeTab, selectedFestival, selectedSpecialDay]);

  const currentEventTitle = useMemo(() => {
    if (activeTab === 'birthday') return 'Birthday';
    if (activeTab === 'anniversary') return 'Anniversary';
    if (activeTab === 'festivals') return selectedFestival.name;
    return selectedSpecialDay.name;
  }, [activeTab, selectedFestival, selectedSpecialDay]);

  const currentEventKeywords = useMemo(() => {
    const key =
      activeTab === 'birthday'
        ? 'birthday'
        : activeTab === 'anniversary'
        ? 'anniversary'
        : activeTab === 'festivals'
        ? selectedFestival.id
        : selectedSpecialDay.id;
    return EVENT_BACKGROUND_MAPPINGS[key]?.keywords || [];
  }, [activeTab, selectedFestival, selectedSpecialDay]);

  // Active Background Preset
  const currentBgPreset: BackgroundPreset = useMemo(() => {
    if (activeTab === 'birthday') return selectedBdayBg;
    if (activeTab === 'anniversary') return selectedAnniBg;
    if (activeTab === 'festivals') {
      const match = selectedFestival.bgPresets.find((p) => p.id === selectedFestivalBg.id);
      return match || selectedFestival.bgPresets[0];
    }
    const match = selectedSpecialDay.bgPresets.find((p) => p.id === selectedSpecialDayBg.id);
    return match || selectedSpecialDay.bgPresets[0];
  }, [activeTab, selectedBdayBg, selectedAnniBg, selectedFestivalBg, selectedFestival, selectedSpecialDayBg, selectedSpecialDay]);

  // Active Background URL (custom or preset)
  const currentBgUrl = useMemo(() => {
    if (isUsingCustomBg && customBgUrl) return customBgUrl;
    return currentBgPreset.fullUrl;
  }, [isUsingCustomBg, customBgUrl, currentBgPreset]);

  // Generate dynamic occasion titles, salutations, and messages
  const currentContent = useMemo(() => {
    const isGu = greetingLang === 'gu';
    const isHi = greetingLang === 'hi';

    if (activeTab === 'birthday') {
      const defaultSalutation = isGu
        ? `સ્નેહીશ્રી ${recipientName || 'મિત્ર'},`
        : isHi
        ? `आदरणीय ${recipientName || 'मित्र'},`
        : `Dear ${recipientName || 'Valued Client'},`;

      const defaultMsg = isGu
        ? `આપના જન્મદિવસના આ વિશેષ અવસરે આપને દીર્ઘાયુષ્ય, ઉત્તમ સ્વાસ્થ્ય, મનની શાંતિ અને અખૂટ આર્થિક સમૃદ્ધિની પ્રભુચરણે પ્રાર્થના.\n\nઆવનારું નવું વર્ષ આપના તમામ લક્ષ્યાંકો અને સપનાઓને સાકાર કરે તેવી હૃદયપૂર્વકની અભિલાષા.`
        : isHi
        ? `आपके जन्मदिन के इस पावन अवसर पर ईश्वर से आपके दीर्घायु, उत्तम स्वास्थ्य, मानसिक शांति और अटूट आर्थिक समृद्धि की मंगल कामना करते हैं।\n\nआने वाला वर्ष आपके जीवन में नए अवसर और अपार खुशियां लेकर आए।`
        : `Wishing you a truly joyous birthday filled with good health, cherished moments, and flourishing financial prosperity.\n\nMay this coming year bring great milestones, peace of mind, and immense success to you and your loved ones.`;

      const title = isGu ? 'જન્મદિવસની હાર્દિક શુભકામનાઓ' : isHi ? 'जन्मदिन की हार्दिक शुभकामनाएं' : 'Happy Birthday';

      return {
        icon: '🎂',
        title,
        salutation: customSalutation || defaultSalutation,
        message: customWishText || defaultMsg,
        signature: `${advisorName} • ${advisorDesignation}`,
      };
    }

    if (activeTab === 'anniversary') {
      const defaultSalutation = isGu
        ? `સ્નેહીશ્રી ${recipientName || 'દંપતી'},`
        : isHi
        ? `आदरणीय ${recipientName || 'दंपति'},`
        : `Dear ${recipientName || 'Couple'},`;

      const defaultMsg = isGu
        ? `આપના લગ્ન જીવનના પવિત્ર બંધનની વર્ષગાંઠ નિમિત્તે આપ બંનેને હૃદયપૂર્વકની શુભેચ્છાઓ!\n\nઆપનું દામ્પત્ય જીવન પ્રેમ, પરસ્પર વિશ્વાસ, ઉત્તમ સ્વાસ્થ્ય અને પરિપૂર્ણ નાણાકીય સ્થિરતાથી સદાય મહેકતું રહે તેવી મંગલ કામના.`
        : isHi
        ? `आप दोनों को शादी की सालगिरह की ढेरों बधाइयां!\n\nईश्वर से प्रार्थना है कि आपका दांपत्य जीवन प्रेम, सामंजस्य, स्वास्थ्य और निरंतर समृद्धि से सदा आलोकित रहे।`
        : `Heartiest congratulations on your wedding anniversary!\n\nMay your journey together continue to be blessed with boundless love, shared joy, vibrant health, and lasting financial security.`;

      const title = isGu ? 'લગ્ન વર્ષગાંઠની શુભકામનાઓ' : isHi ? 'विवाह वर्षगांठ की शुभकामनाएं' : 'Happy Wedding Anniversary';

      return {
        icon: '💍',
        title,
        salutation: customSalutation || defaultSalutation,
        message: customWishText || defaultMsg,
        signature: `${advisorName} • ${advisorDesignation}`,
      };
    }

    if (activeTab === 'festivals') {
      const festName = isGu ? selectedFestival.nameGu : isHi ? selectedFestival.nameHi : selectedFestival.name;
      const festWishes = isGu ? selectedFestival.defaultWishesGu : isHi ? selectedFestival.defaultWishesHi : selectedFestival.defaultWishesEn;
      const defaultSalutation = isGu
        ? `સ્નેહીશ્રી ${recipientName || 'પરિવારજન'},`
        : isHi
        ? `आदरणीय ${recipientName || 'परिवार'},`
        : `Dear ${recipientName || 'Friend'},`;

      return {
        icon: selectedFestival.icon,
        title: festName,
        salutation: customSalutation || defaultSalutation,
        message: customWishText || festWishes,
        signature: `${advisorName} • ${advisorDesignation}`,
      };
    }

    // Special Days
    const dayName = isGu ? selectedSpecialDay.nameGu : isHi ? selectedSpecialDay.nameHi : selectedSpecialDay.name;
    const dayWishes = isGu ? selectedSpecialDay.defaultWishesGu : isHi ? selectedSpecialDay.defaultWishesHi : selectedSpecialDay.defaultWishesEn;
    const defaultSalutation = isGu
      ? `સ્નેહીશ્રી ${recipientName || 'મિત્ર'},`
      : isHi
      ? `आदरणीय ${recipientName || 'मित्र'},`
      : `Dear ${recipientName || 'Valued Associate'},`;

    return {
      icon: selectedSpecialDay.icon,
      title: dayName,
      salutation: customSalutation || defaultSalutation,
      message: customWishText || dayWishes,
      signature: `${advisorName} • ${advisorDesignation}`,
    };
  }, [
    activeTab,
    greetingLang,
    recipientName,
    selectedFestival,
    selectedSpecialDay,
    customWishText,
    customSalutation,
    advisorName,
    advisorDesignation,
  ]);

  // Load and Render Canvas
  const triggerRender = async () => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    setIsRendering(true);

    // 1. Prepare Background Image Element
    let bgImgEl: HTMLImageElement | null = null;
    if (currentBgUrl) {
      try {
        bgImgEl = await new Promise<HTMLImageElement | null>((res) => {
          const img = new Image();
          img.crossOrigin = 'anonymous';
          img.onload = () => res(img);
          img.onerror = () => res(null); // Fallback gracefully to procedural gradient
          img.src = currentBgUrl;
        });
      } catch (e) {
        bgImgEl = null;
      }
    }
    bgImageRef.current = bgImgEl;

    // 2. Prepare Customer Photo Element if enabled
    let custImgEl: HTMLImageElement | null = null;
    if (hasCustomerPhoto && customerPhotoUrl) {
      try {
        custImgEl = await new Promise<HTMLImageElement | null>((res) => {
          const img = new Image();
          img.crossOrigin = 'anonymous';
          img.onload = () => res(img);
          img.onerror = () => res(null);
          img.src = customerPhotoUrl;
        });
      } catch (e) {
        custImgEl = null;
      }
    }
    customerPhotoRef.current = custImgEl;

    // 3. Assemble Advisor Branding Data
    const advisorData: AdvisorBrandingData = {
      advisorName,
      designation: advisorDesignation,
      firmName,
      phoneNumber,
      arnNumber,
      website,
      showSocialIcons: true,
    };

    // 4. Render to Canvas
    const canvasOptions: GreetingCanvasOptions = {
      canvas,
      resolution,
      bgImage: bgImgEl,
      bgPreset: currentBgPreset,
      bgDarkness,
      hasCustomerPhoto: hasCustomerPhoto && !!customerPhotoUrl,
      customerPhoto: custImgEl,
      customerPhotoShape,
      occasionType: activeTab,
      occasionIcon: currentContent.icon,
      title: currentContent.title,
      recipientName,
      salutation: currentContent.salutation,
      message: currentContent.message,
      signature: currentContent.signature,
      advisor: advisorData,
    };

    await renderGreetingCard(canvasOptions);
    setIsRendering(false);
  };

  // Re-render whenever parameters change
  useEffect(() => {
    triggerRender();
  }, [
    activeTab,
    currentBgUrl,
    currentBgPreset,
    bgDarkness,
    hasCustomerPhoto,
    customerPhotoUrl,
    customerPhotoShape,
    recipientName,
    currentContent,
    advisorName,
    advisorDesignation,
    firmName,
    phoneNumber,
    arnNumber,
    website,
    resolution,
  ]);

  // Handle Custom Background Upload from Advisor's Device
  const handleUploadCustomBg = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = () => {
      if (typeof reader.result === 'string') {
        setCustomBgUrl(reader.result);
        setIsUsingCustomBg(true);
        setActionNotice('Custom background loaded from your device!');
        setTimeout(() => setActionNotice(null), 3000);
      }
    };
    reader.readAsDataURL(file);
  };

  // Handle Customer Photo Upload
  const handleUploadCustomerPhoto = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = () => {
      if (typeof reader.result === 'string') {
        setCustomerPhotoUrl(reader.result);
        setHasCustomerPhoto(true);
        setActionNotice('Customer photo attached with gold frame!');
        setTimeout(() => setActionNotice(null), 3000);
      }
    };
    reader.readAsDataURL(file);
  };

  // 1-Click High-Res PNG Download (0 API calls, pure client-side)
  const handleDownload = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    try {
      const sanitizedName = (recipientName || 'Valued_Client').replace(/\s+/g, '_');
      const filename = `Greeting_${activeTab.toUpperCase()}_${sanitizedName}_${resolution.toUpperCase()}.png`;

      canvas.toBlob((blob) => {
        if (!blob) return;
        const url = URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.download = filename;
        link.href = url;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        URL.revokeObjectURL(url);

        setActionNotice(`Downloaded ${resolution === '4k' ? 'Supreme 4K' : 'Ultra HD'} Poster successfully!`);
        setTimeout(() => setActionNotice(null), 3500);
      }, 'image/png');
    } catch (err) {
      console.error('Download error:', err);
    }
  };

  // Share via WhatsApp with direct File share when supported, plus text caption
  const handleShareWhatsApp = async () => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const fullCaption = `*${currentContent.title}* ${currentContent.icon}\n\n${currentContent.salutation}\n\n${currentContent.message}\n\n━━━━━━━━━━━━━━━━━━━━\nWarm Regards,\n*${advisorName}*\n${advisorDesignation} • ${firmName}\n📱 WhatsApp/Mobile: ${phoneNumber}\n${arnNumber ? `ARN: ${arnNumber}` : ''}`;

    // Check if Web Share API with Files is supported (mobile Chrome / Safari)
    if (navigator.share && navigator.canShare) {
      try {
        const sanitizedName = (recipientName || 'Greeting').replace(/\s+/g, '_');
        const filename = `${sanitizedName}_Card.png`;

        canvas.toBlob(async (blob) => {
          if (!blob) return;
          const file = new File([blob], filename, { type: 'image/png' });

          if (navigator.canShare({ files: [file] })) {
            try {
              await navigator.share({
                title: currentContent.title,
                text: fullCaption,
                files: [file],
              });
              setActionNotice('Shared card directly via WhatsApp!');
              setTimeout(() => setActionNotice(null), 3000);
              return;
            } catch (shareErr) {
              // User cancelled share or fallback
            }
          }

          // Fallback: download image and open WhatsApp
          fallbackShareToWhatsApp(fullCaption);
        }, 'image/png');
        return;
      } catch (err) {
        // Fallback
      }
    }

    fallbackShareToWhatsApp(fullCaption);
  };

  const fallbackShareToWhatsApp = (textCaption: string) => {
    // 1. Download image automatically so user has it ready in gallery/downloads
    handleDownload();

    // 2. Open WhatsApp with formatted text
    const encoded = encodeURIComponent(textCaption);
    const webUrl = `https://api.whatsapp.com/send?text=${encoded}`;
    const opened = window.open(webUrl, '_blank');
    if (!opened) {
      window.location.href = `whatsapp://send?text=${encoded}`;
    }

    setActionNotice('Poster saved to Downloads! WhatsApp opened with your custom greeting text.');
    setTimeout(() => setActionNotice(null), 4000);
  };

  const handleCopyText = () => {
    const fullText = `*${currentContent.title}* ${currentContent.icon}\n\n${currentContent.salutation}\n\n${currentContent.message}\n\n━━━━━━━━━━━━━━━━━━━━\nWarm Regards,\n${advisorName}\n${advisorDesignation}\n📱 ${phoneNumber}`;
    navigator.clipboard.writeText(fullText);
    setIsCopied(true);
    setTimeout(() => setIsCopied(false), 2000);
  };

  const handleResetWishes = () => {
    setCustomWishText('');
    setCustomSalutation('');
    setActionNotice('Reset to standard occasion message.');
    setTimeout(() => setActionNotice(null), 2500);
  };

  return (
    <div className="space-y-6 pb-24 max-w-7xl mx-auto px-2 sm:px-4">
      {/* Top Notification Toast */}
      {actionNotice && (
        <div className="fixed top-5 right-5 z-50 bg-slate-900 text-white px-5 py-3 rounded-2xl shadow-2xl border border-amber-500/40 flex items-center space-x-3 animate-fade-in text-xs font-bold">
          <Sparkles className="w-4 h-4 text-amber-400 shrink-0" />
          <span>{actionNotice}</span>
        </div>
      )}

      {/* Header Banner */}
      <div className="relative rounded-3xl bg-gradient-to-br from-amber-950 via-slate-900 to-amber-900 p-6 sm:p-8 text-white overflow-hidden shadow-2xl border border-amber-500/30">
        <div className="relative z-10 space-y-3">
          <div className="inline-flex items-center space-x-2 px-3 py-1.5 rounded-full bg-amber-500/20 text-amber-300 border border-amber-400/30 text-xs font-bold tracking-wide backdrop-blur-md">
            <Gift className="w-3.5 h-3.5 text-amber-400" />
            <span>Personalized Client Relationship Studio</span>
          </div>

          <h1 className="text-2xl sm:text-3xl font-black tracking-tight">
            Client Greetings, Festivals & Days Studio
          </h1>

          <p className="text-amber-100/90 text-xs sm:text-sm max-w-3xl leading-relaxed">
            Create high-converting, personalized branded greeting posters in Ultra HD & 4K for your clients.
            Pre-loaded with 15+ Birthday themes, 15+ Anniversary designs, 50+ Major Indian Festivals, and 50+ Special Days.
            Supports customer photo frames and complete financial advisor branding with zero API costs.
          </p>

          {/* 4 Main Category Tabs */}
          <div className="pt-2 flex flex-wrap gap-2 text-xs font-bold">
            <button
              onClick={() => {
                setActiveTab('birthday');
                setIsUsingCustomBg(false);
              }}
              className={`px-4 py-2.5 rounded-xl flex items-center space-x-2 transition-all cursor-pointer ${
                activeTab === 'birthday'
                  ? 'bg-amber-500 text-slate-950 shadow-md font-black ring-2 ring-amber-400/40'
                  : 'bg-white/10 text-white hover:bg-white/20'
              }`}
            >
              <Cake className="w-4 h-4" />
              <span>Birthday Studio (15+ Designs)</span>
            </button>

            <button
              onClick={() => {
                setActiveTab('anniversary');
                setIsUsingCustomBg(false);
              }}
              className={`px-4 py-2.5 rounded-xl flex items-center space-x-2 transition-all cursor-pointer ${
                activeTab === 'anniversary'
                  ? 'bg-amber-500 text-slate-950 shadow-md font-black ring-2 ring-amber-400/40'
                  : 'bg-white/10 text-white hover:bg-white/20'
              }`}
            >
              <Heart className="w-4 h-4" />
              <span>Anniversary Studio (15+ Designs)</span>
            </button>

            <button
              onClick={() => {
                setActiveTab('festivals');
                setIsUsingCustomBg(false);
              }}
              className={`px-4 py-2.5 rounded-xl flex items-center space-x-2 transition-all cursor-pointer ${
                activeTab === 'festivals'
                  ? 'bg-amber-500 text-slate-950 shadow-md font-black ring-2 ring-amber-400/40'
                  : 'bg-white/10 text-white hover:bg-white/20'
              }`}
            >
              <Sparkles className="w-4 h-4" />
              <span>50+ Festivals (તહેવારો)</span>
            </button>

            <button
              onClick={() => {
                setActiveTab('days');
                setIsUsingCustomBg(false);
              }}
              className={`px-4 py-2.5 rounded-xl flex items-center space-x-2 transition-all cursor-pointer ${
                activeTab === 'days'
                  ? 'bg-amber-500 text-slate-950 shadow-md font-black ring-2 ring-amber-400/40'
                  : 'bg-white/10 text-white hover:bg-white/20'
              }`}
            >
              <Sun className="w-4 h-4" />
              <span>50+ Special Days (મહત્વના દિવસો)</span>
            </button>
          </div>
        </div>
      </div>

      {/* Main Studio Grid: Controls (Left) & Canvas Preview (Right) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Left Column: Customization Controls (5 cols) */}
        <div className="lg:col-span-5 space-y-5">
          {/* 1. Recipient Details & Language */}
          <div className="bg-white rounded-3xl border border-slate-200/90 p-5 shadow-xs space-y-4">
            <h3 className="font-extrabold text-slate-900 text-sm flex items-center space-x-2">
              <User className="w-4 h-4 text-amber-600" />
              <span>Client Name & Language Settings</span>
            </h3>

            {/* Recipient Name Input */}
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">
                Client / Recipient Name (કસ્ટમરનું નામ)
              </label>
              <input
                type="text"
                value={recipientName}
                onChange={(e) => setRecipientName(e.target.value)}
                placeholder="e.g. Rajeshbhai Patel or Mr. & Mrs. Patel"
                className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-semibold text-slate-900 focus:outline-none focus:ring-2 focus:ring-amber-500"
              />
            </div>

            {/* Language Switcher */}
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">
                Greeting Language (ભાષા પસંદ કરો)
              </label>
              <div className="grid grid-cols-3 gap-2">
                {[
                  { code: 'en' as LanguageCode, label: 'English (Default)' },
                  { code: 'gu' as LanguageCode, label: 'ગુજરાતી' },
                  { code: 'hi' as LanguageCode, label: 'हिन्दी' },
                ].map((l) => (
                  <button
                    key={l.code}
                    onClick={() => setGreetingLang(l.code)}
                    className={`py-2 px-2.5 rounded-xl text-xs font-bold border transition-all cursor-pointer ${
                      greetingLang === l.code
                        ? 'bg-amber-50 border-amber-500 text-amber-950 ring-2 ring-amber-500/20'
                        : 'bg-white border-slate-200 text-slate-600 hover:bg-slate-50'
                    }`}
                  >
                    {l.label}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* 2. Occasion Specific Selector (If Festivals or Special Days) */}
          {activeTab === 'festivals' && (
            <div className="bg-white rounded-3xl border border-slate-200/90 p-5 shadow-xs space-y-3">
              <div className="flex items-center justify-between">
                <h3 className="font-extrabold text-slate-900 text-sm flex items-center space-x-2">
                  <Sparkles className="w-4 h-4 text-amber-600" />
                  <span>Select Festival (50+ Indian Festivals)</span>
                </h3>
                <span className="text-[10px] font-bold text-slate-400">
                  {filteredFestivals.length} Available
                </span>
              </div>

              {/* Search input */}
              <div className="relative">
                <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-3" />
                <input
                  type="text"
                  value={festivalSearch}
                  onChange={(e) => setFestivalSearch(e.target.value)}
                  placeholder="Search Diwali, Navratri, Eid, Christmas, Uttarayan..."
                  className="w-full pl-9 pr-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-medium text-slate-900 focus:outline-none focus:ring-2 focus:ring-amber-500"
                />
              </div>

              {/* Festival List Scrollable */}
              <div className="max-h-52 overflow-y-auto space-y-1.5 pr-1 border border-slate-100 rounded-xl p-1 bg-slate-50/50">
                {filteredFestivals.map((fest) => {
                  const isSelected = selectedFestival.id === fest.id;
                  return (
                    <button
                      key={fest.id}
                      onClick={() => {
                        setSelectedFestival(fest);
                        setSelectedFestivalBg(fest.bgPresets[0]);
                        setIsUsingCustomBg(false);
                      }}
                      className={`w-full text-left p-2 rounded-xl text-xs font-bold transition-all flex items-center justify-between cursor-pointer ${
                        isSelected
                          ? 'bg-amber-500 text-slate-950 shadow-xs'
                          : 'bg-white hover:bg-slate-100 text-slate-700 border border-slate-200/60'
                      }`}
                    >
                      <div className="flex items-center space-x-2 truncate">
                        <span className="text-base shrink-0">{fest.icon}</span>
                        <div className="truncate">
                          <p className="truncate leading-tight">{fest.name}</p>
                          <p className={`text-[10px] font-medium ${isSelected ? 'text-slate-900' : 'text-slate-500'}`}>
                            {fest.nameGu}
                          </p>
                        </div>
                      </div>
                      <span className={`text-[10px] shrink-0 font-semibold px-2 py-0.5 rounded-md ${
                        isSelected ? 'bg-amber-600 text-white' : 'bg-slate-100 text-slate-500'
                      }`}>
                        {fest.month}
                      </span>
                    </button>
                  );
                })}
              </div>
            </div>
          )}

          {activeTab === 'days' && (
            <div className="bg-white rounded-3xl border border-slate-200/90 p-5 shadow-xs space-y-3">
              <div className="flex items-center justify-between">
                <h3 className="font-extrabold text-slate-900 text-sm flex items-center space-x-2">
                  <Sun className="w-4 h-4 text-amber-600" />
                  <span>Select Observance Day (50+ Special Days)</span>
                </h3>
                <span className="text-[10px] font-bold text-slate-400">
                  {filteredSpecialDays.length} Available
                </span>
              </div>

              {/* Search input */}
              <div className="relative">
                <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-3" />
                <input
                  type="text"
                  value={specialDaySearch}
                  onChange={(e) => setSpecialDaySearch(e.target.value)}
                  placeholder="Search Women's Day, Engineer's Day, Doctor's Day, CA Day..."
                  className="w-full pl-9 pr-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-medium text-slate-900 focus:outline-none focus:ring-2 focus:ring-amber-500"
                />
              </div>

              {/* Special Day List Scrollable */}
              <div className="max-h-52 overflow-y-auto space-y-1.5 pr-1 border border-slate-100 rounded-xl p-1 bg-slate-50/50">
                {filteredSpecialDays.map((day) => {
                  const isSelected = selectedSpecialDay.id === day.id;
                  return (
                    <button
                      key={day.id}
                      onClick={() => {
                        setSelectedSpecialDay(day);
                        setSelectedSpecialDayBg(day.bgPresets[0]);
                        setIsUsingCustomBg(false);
                      }}
                      className={`w-full text-left p-2 rounded-xl text-xs font-bold transition-all flex items-center justify-between cursor-pointer ${
                        isSelected
                          ? 'bg-amber-500 text-slate-950 shadow-xs'
                          : 'bg-white hover:bg-slate-100 text-slate-700 border border-slate-200/60'
                      }`}
                    >
                      <div className="flex items-center space-x-2 truncate">
                        <span className="text-base shrink-0">{day.icon}</span>
                        <div className="truncate">
                          <p className="truncate leading-tight">{day.name}</p>
                          <p className={`text-[10px] font-medium ${isSelected ? 'text-slate-900' : 'text-slate-500'}`}>
                            {day.nameGu}
                          </p>
                        </div>
                      </div>
                      <span className={`text-[10px] shrink-0 font-semibold px-2 py-0.5 rounded-md ${
                        isSelected ? 'bg-amber-600 text-white' : 'bg-slate-100 text-slate-500'
                      }`}>
                        {day.dateStr}
                      </span>
                    </button>
                  );
                })}
              </div>
            </div>
          )}

          {/* 3. Background Image Selection & Device Upload */}
          <div className="bg-white rounded-3xl border border-slate-200/90 p-5 shadow-xs space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="font-extrabold text-slate-900 text-sm flex items-center space-x-2">
                <ImageIcon className="w-4 h-4 text-amber-600" />
                <span>Background Wallpaper (પહેલેથી લોડ કરેલા બેકગ્રાઉન્ડ)</span>
              </h3>
            </div>

            {/* Custom Upload Button from Phone/PC */}
            <div className="flex items-center gap-2">
              <input
                type="file"
                ref={fileInputBgRef}
                onChange={handleUploadCustomBg}
                accept="image/*"
                className="hidden"
              />
              <button
                type="button"
                onClick={() => fileInputBgRef.current?.click()}
                className={`flex-1 py-2.5 px-3 rounded-xl text-xs font-bold border transition-all flex items-center justify-center space-x-2 cursor-pointer ${
                  isUsingCustomBg
                    ? 'bg-amber-50 border-amber-500 text-amber-950 ring-2 ring-amber-500/20'
                    : 'bg-slate-50 hover:bg-slate-100 border-slate-200 text-slate-800'
                }`}
              >
                <Upload className="w-3.5 h-3.5 text-amber-600" />
                <span>Upload from Phone / Gallery</span>
              </button>

              {isUsingCustomBg && (
                <button
                  type="button"
                  onClick={() => setIsUsingCustomBg(false)}
                  className="px-3 py-2.5 rounded-xl text-xs font-bold border border-slate-200 bg-white hover:bg-slate-50 text-slate-600 cursor-pointer"
                  title="Switch back to pre-loaded library"
                >
                  Reset
                </button>
              )}
            </div>

            {/* Pre-loaded Background Thumbnails Grid */}
            <div className="space-y-2.5">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1.5">
                <div>
                  <p className="text-xs font-bold text-slate-800 flex items-center space-x-1.5">
                    <span>Or Choose from Pre-Loaded Library</span>
                    <span className="text-[10px] font-semibold text-amber-700 bg-amber-50 px-2 py-0.5 rounded-full border border-amber-200">
                      {matchingPresets.length} Relevant Themes
                    </span>
                  </p>
                  <p className="text-[10px] text-slate-500 font-medium">
                    Curated exclusively for <span className="font-semibold text-slate-700">{currentEventTitle}</span>
                  </p>
                </div>

                {currentEventKeywords.length > 0 && (
                  <div className="flex items-center space-x-1 overflow-x-auto py-0.5">
                    <span className="text-[9px] font-bold text-slate-400 uppercase tracking-wider shrink-0">
                      Keywords:
                    </span>
                    {currentEventKeywords.map((kw) => (
                      <span
                        key={kw}
                        className="text-[9px] font-medium bg-slate-100 text-slate-600 px-1.5 py-0.5 rounded-md shrink-0"
                      >
                        #{kw}
                      </span>
                    ))}
                  </div>
                )}
              </div>

              <div
                className={`grid ${
                  matchingPresets.length <= 3 ? 'grid-cols-3' : 'grid-cols-4'
                } gap-2.5`}
              >
                {matchingPresets.map((preset, idx) => {
                  const isSelected = !isUsingCustomBg && currentBgPreset.id === preset.id;
                  return (
                    <button
                      key={preset.id}
                      type="button"
                      onClick={() => {
                        setIsUsingCustomBg(false);
                        if (activeTab === 'birthday') setSelectedBdayBg(preset);
                        else if (activeTab === 'anniversary') setSelectedAnniBg(preset);
                        else if (activeTab === 'festivals') setSelectedFestivalBg(preset);
                        else setSelectedSpecialDayBg(preset);
                      }}
                      className={`relative aspect-square rounded-2xl overflow-hidden border-2 transition-all cursor-pointer group shadow-xs ${
                        isSelected
                          ? 'border-amber-500 ring-2 ring-amber-500/40 shadow-md scale-[1.02]'
                          : 'border-slate-200/90 hover:border-slate-400 opacity-85 hover:opacity-100 hover:shadow-sm'
                      }`}
                      style={{
                        background: `linear-gradient(135deg, ${preset.themeColor}, ${preset.secondaryColor})`,
                      }}
                      title={preset.name}
                    >
                      <img
                        src={preset.thumbnailUrl}
                        alt={preset.name}
                        className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
                        loading="lazy"
                        onError={(e) => {
                          (e.target as HTMLElement).style.display = 'none';
                        }}
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/30 to-transparent flex flex-col justify-end p-2 pointer-events-none">
                        <span className="text-[9px] text-amber-300/90 font-mono font-semibold uppercase tracking-wider mb-0.5">
                          Theme {idx + 1}
                        </span>
                        <span className="text-[10px] text-white font-bold truncate leading-tight">
                          {preset.name}
                        </span>
                      </div>
                      {isSelected && (
                        <div className="absolute top-1.5 right-1.5 w-5 h-5 rounded-full bg-amber-500 text-slate-950 flex items-center justify-center text-[10px] font-black shadow-md ring-2 ring-white/50">
                          ✓
                        </div>
                      )}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Contrast / Darkness Slider */}
            <div className="pt-1">
              <div className="flex items-center justify-between text-xs font-bold text-slate-600 mb-1">
                <span className="flex items-center space-x-1.5">
                  <Sliders className="w-3.5 h-3.5 text-amber-600" />
                  <span>Background Overlay Darkness</span>
                </span>
                <span className="font-mono text-amber-600">{Math.round(bgDarkness * 100)}%</span>
              </div>
              <input
                type="range"
                min="0.15"
                max="0.80"
                step="0.05"
                value={bgDarkness}
                onChange={(e) => setBgDarkness(parseFloat(e.target.value))}
                className="w-full accent-amber-500 cursor-pointer"
              />
              <p className="text-[10px] text-slate-400">
                Adjust overlay darkness to make text pop clearly on any uploaded photo.
              </p>
            </div>
          </div>

          {/* 4. Customer Photo Option (With / Without) */}
          <div className="bg-white rounded-3xl border border-slate-200/90 p-5 shadow-xs space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="font-extrabold text-slate-900 text-sm flex items-center space-x-2">
                <Camera className="w-4 h-4 text-amber-600" />
                <span>Customer Photo Frame (કસ્ટમર નો ફોટો)</span>
              </h3>

              {/* Mode Toggle */}
              <button
                type="button"
                onClick={() => setHasCustomerPhoto(!hasCustomerPhoto)}
                className={`px-3 py-1.5 rounded-full text-xs font-bold transition-all cursor-pointer ${
                  hasCustomerPhoto
                    ? 'bg-emerald-100 text-emerald-800 border border-emerald-300'
                    : 'bg-slate-100 text-slate-600 border border-slate-200'
                }`}
              >
                {hasCustomerPhoto ? 'With Photo: ON' : 'Without Photo: OFF'}
              </button>
            </div>

            {hasCustomerPhoto ? (
              <div className="space-y-3 pt-1">
                <input
                  type="file"
                  ref={fileInputCustomerRef}
                  onChange={handleUploadCustomerPhoto}
                  accept="image/*"
                  className="hidden"
                />

                <div className="flex items-center gap-3">
                  {customerPhotoUrl ? (
                    <div className="relative w-16 h-16 rounded-full overflow-hidden border-2 border-amber-500 shadow-md shrink-0">
                      <img
                        src={customerPhotoUrl}
                        alt="Customer portrait"
                        className="w-full h-full object-cover"
                      />
                    </div>
                  ) : (
                    <div className="w-16 h-16 rounded-full bg-slate-100 border border-dashed border-slate-300 flex items-center justify-center text-slate-400 shrink-0">
                      <User className="w-6 h-6" />
                    </div>
                  )}

                  <div className="space-y-1.5 flex-1">
                    <button
                      type="button"
                      onClick={() => fileInputCustomerRef.current?.click()}
                      className="w-full py-2 px-3 rounded-xl text-xs font-bold bg-amber-500 hover:bg-amber-600 text-slate-950 shadow-xs flex items-center justify-center space-x-1.5 cursor-pointer"
                    >
                      <Upload className="w-3.5 h-3.5" />
                      <span>{customerPhotoUrl ? 'Change Photo' : 'Upload Customer Photo'}</span>
                    </button>

                    {customerPhotoUrl && (
                      <button
                        type="button"
                        onClick={() => {
                          setCustomerPhotoUrl(null);
                          setHasCustomerPhoto(false);
                        }}
                        className="text-[11px] text-red-600 hover:underline flex items-center space-x-1 cursor-pointer"
                      >
                        <Trash2 className="w-3 h-3" />
                        <span>Remove Photo</span>
                      </button>
                    )}
                  </div>
                </div>

                {/* Shape options */}
                <div className="pt-2">
                  <label className="block text-[11px] font-bold text-slate-600 mb-1">
                    Frame Style:
                  </label>
                  <div className="grid grid-cols-2 gap-2">
                    <button
                      type="button"
                      onClick={() => setCustomerPhotoShape('circle')}
                      className={`py-1.5 px-3 rounded-xl text-xs font-bold border transition-all cursor-pointer ${
                        customerPhotoShape === 'circle'
                          ? 'bg-amber-50 border-amber-500 text-amber-950 ring-2 ring-amber-500/20'
                          : 'bg-white border-slate-200 text-slate-600'
                      }`}
                    >
                      Royal Gold Circle
                    </button>
                    <button
                      type="button"
                      onClick={() => setCustomerPhotoShape('square_rounded')}
                      className={`py-1.5 px-3 rounded-xl text-xs font-bold border transition-all cursor-pointer ${
                        customerPhotoShape === 'square_rounded'
                          ? 'bg-amber-50 border-amber-500 text-amber-950 ring-2 ring-amber-500/20'
                          : 'bg-white border-slate-200 text-slate-600'
                      }`}
                    >
                      Rounded Square
                    </button>
                  </div>
                </div>
              </div>
            ) : (
              <p className="text-xs text-slate-500">
                &ldquo;Without Photo&rdquo; mode is active. The poster will automatically expand the occasion typography and celebratory graphics evenly across the card.
              </p>
            )}
          </div>

          {/* 5. Custom Wishes Message Editor */}
          <div className="bg-white rounded-3xl border border-slate-200/90 p-5 shadow-xs space-y-3">
            <div className="flex items-center justify-between">
              <h3 className="font-extrabold text-slate-900 text-sm flex items-center space-x-2">
                <Gift className="w-4 h-4 text-amber-600" />
                <span>Greeting Message (શુભેચ્છા સંદેશ)</span>
              </h3>
              <button
                type="button"
                onClick={handleResetWishes}
                className="text-[11px] font-bold text-amber-700 hover:text-amber-800 flex items-center space-x-1 cursor-pointer"
              >
                <RefreshCw className="w-3 h-3" />
                <span>Reset to Standard</span>
              </button>
            </div>

            <textarea
              rows={4}
              value={customWishText || currentContent.message}
              onChange={(e) => setCustomWishText(e.target.value)}
              placeholder="Edit your personalized heartfelt message..."
              className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl text-xs font-medium text-slate-900 focus:outline-none focus:ring-2 focus:ring-amber-500"
            />
          </div>

          {/* 6. Advisor Branding Footer Customizer (Drawer) */}
          <div className="bg-slate-900 text-white rounded-3xl p-5 shadow-md border border-slate-800 space-y-3">
            <div
              className="flex items-center justify-between cursor-pointer select-none"
              onClick={() => setShowAdvisorEditor(!showAdvisorEditor)}
            >
              <div className="flex items-center space-x-2 text-xs font-bold text-amber-400">
                <Award className="w-4 h-4" />
                <span>Advisor Branding Footer on Card (સંપૂર્ણ બ્રાન્ડિંગ)</span>
              </div>
              <div className="flex items-center space-x-1 text-slate-400 text-xs font-medium">
                <span>{showAdvisorEditor ? 'Hide Fields' : 'Edit Details'}</span>
                {showAdvisorEditor ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
              </div>
            </div>

            <p className="text-[11px] text-slate-300">
              Attached at bottom of the card: Name, Designation, AMFI ARN, Phone, and Firm info.
            </p>

            {showAdvisorEditor && (
              <div className="pt-3 border-t border-slate-800 space-y-2.5">
                <div>
                  <label className="block text-[11px] font-bold text-slate-400 mb-0.5">Advisor Name</label>
                  <input
                    type="text"
                    value={advisorName}
                    onChange={(e) => setAdvisorName(e.target.value)}
                    className="w-full px-3 py-1.5 bg-slate-800 border border-slate-700 rounded-lg text-xs text-white"
                  />
                </div>

                <div className="grid grid-cols-2 gap-2">
                  <div>
                    <label className="block text-[11px] font-bold text-slate-400 mb-0.5">Designation</label>
                    <input
                      type="text"
                      value={advisorDesignation}
                      onChange={(e) => setAdvisorDesignation(e.target.value)}
                      className="w-full px-3 py-1.5 bg-slate-800 border border-slate-700 rounded-lg text-xs text-white"
                    />
                  </div>
                  <div>
                    <label className="block text-[11px] font-bold text-slate-400 mb-0.5">Firm Name</label>
                    <input
                      type="text"
                      value={firmName}
                      onChange={(e) => setFirmName(e.target.value)}
                      className="w-full px-3 py-1.5 bg-slate-800 border border-slate-700 rounded-lg text-xs text-white"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-2">
                  <div>
                    <label className="block text-[11px] font-bold text-slate-400 mb-0.5">Mobile / WhatsApp</label>
                    <input
                      type="text"
                      value={phoneNumber}
                      onChange={(e) => setPhoneNumber(e.target.value)}
                      className="w-full px-3 py-1.5 bg-slate-800 border border-slate-700 rounded-lg text-xs text-white"
                    />
                  </div>
                  <div>
                    <label className="block text-[11px] font-bold text-slate-400 mb-0.5">AMFI ARN / EUIN</label>
                    <input
                      type="text"
                      value={arnNumber}
                      onChange={(e) => setArnNumber(e.target.value)}
                      className="w-full px-3 py-1.5 bg-slate-800 border border-slate-700 rounded-lg text-xs text-white"
                    />
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Right Column: Square Canvas Preview & Export Suite (7 cols) */}
        <div className="lg:col-span-7 space-y-5 lg:sticky lg:top-4">
          <div className="bg-white rounded-3xl border border-slate-200/90 p-5 sm:p-7 shadow-xl space-y-5">
            <div className="flex items-center justify-between flex-wrap gap-2">
              <div>
                <h3 className="font-extrabold text-slate-900 text-sm flex items-center space-x-2">
                  <Sparkles className="w-4 h-4 text-amber-600" />
                  <span>Square Poster Canvas Preview</span>
                </h3>
                <p className="text-[11px] text-slate-500">
                  Zero API Cost • High-Resolution Render Engine
                </p>
              </div>

              {/* Resolution Toggle: 1080p vs 4K */}
              <div className="flex items-center space-x-1.5 bg-slate-100 p-1 rounded-xl border border-slate-200">
                <button
                  type="button"
                  onClick={() => setResolution('hd')}
                  className={`px-3 py-1 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                    resolution === 'hd'
                      ? 'bg-white text-slate-900 shadow-xs'
                      : 'text-slate-500 hover:text-slate-800'
                  }`}
                >
                  Ultra HD (1080p)
                </button>
                <button
                  type="button"
                  onClick={() => setResolution('4k')}
                  className={`px-3 py-1 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                    resolution === '4k'
                      ? 'bg-amber-500 text-slate-950 shadow-xs'
                      : 'text-slate-500 hover:text-slate-800'
                  }`}
                >
                  Supreme 4K (2160p)
                </button>
              </div>
            </div>

            {/* Live Canvas Element */}
            <div className="relative aspect-square w-full rounded-2xl overflow-hidden shadow-2xl bg-slate-950 border-2 border-amber-500/20 group">
              <canvas
                ref={canvasRef}
                className="w-full h-full object-contain"
              />

              {isRendering && (
                <div className="absolute inset-0 bg-slate-950/70 backdrop-blur-xs flex items-center justify-center text-white space-x-2">
                  <RefreshCw className="w-5 h-5 animate-spin text-amber-400" />
                  <span className="text-xs font-bold">Rendering High-Res Poster...</span>
                </div>
              )}
            </div>

            {/* Action Buttons: WhatsApp Share & Download */}
            <div className="space-y-2.5 pt-2">
              <div className="flex flex-wrap gap-2.5">
                {/* Primary Action 1: Share on WhatsApp */}
                <button
                  type="button"
                  onClick={handleShareWhatsApp}
                  className="flex-1 min-w-[170px] px-5 py-3.5 rounded-2xl bg-emerald-600 hover:bg-emerald-700 text-white font-extrabold text-xs sm:text-sm shadow-lg shadow-emerald-600/30 flex items-center justify-center space-x-2 transition-all active:scale-95 cursor-pointer"
                >
                  <Share2 className="w-4 h-4 fill-white" />
                  <span>Share on WhatsApp</span>
                </button>

                {/* Primary Action 2: Download High-Res Poster */}
                <button
                  type="button"
                  onClick={handleDownload}
                  className="flex-1 min-w-[170px] px-5 py-3.5 rounded-2xl bg-amber-500 hover:bg-amber-600 text-slate-950 font-black text-xs sm:text-sm shadow-lg shadow-amber-500/30 flex items-center justify-center space-x-2 transition-all active:scale-95 cursor-pointer"
                >
                  <Download className="w-4 h-4" />
                  <span>Download {resolution === '4k' ? '4K' : 'HD'} Poster</span>
                </button>

                {/* Secondary Action 3: Copy Text Only */}
                <button
                  type="button"
                  onClick={handleCopyText}
                  className="px-4 py-3.5 rounded-2xl bg-white hover:bg-slate-100 text-slate-800 font-bold text-xs border border-slate-200 shadow-2xs flex items-center justify-center space-x-1.5 transition-all active:scale-95 cursor-pointer shrink-0"
                >
                  {isCopied ? (
                    <>
                      <Check className="w-4 h-4 text-emerald-600" />
                      <span className="text-emerald-700">Copied!</span>
                    </>
                  ) : (
                    <>
                      <Copy className="w-4 h-4 text-slate-600" />
                      <span>Copy Wish</span>
                    </>
                  )}
                </button>
              </div>

              {/* Informational reassurance notice */}
              <div className="flex items-center space-x-2 text-[11px] text-slate-500 bg-slate-50 p-2.5 rounded-xl border border-slate-100">
                <ShieldCheck className="w-4 h-4 text-emerald-600 shrink-0" />
                <span>
                  <strong>100% Client-Side Generation:</strong> No third-party AI image APIs used. Unlimited high-res downloads and shares with zero latency.
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

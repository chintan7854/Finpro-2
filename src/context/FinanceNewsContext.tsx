import React, {
  createContext,
  useContext,
  useState,
  useEffect,
  useCallback,
  ReactNode,
} from 'react';
import {
  FinanceNewsItem,
  FinanceNewsArticle,
  NewsNotification,
  NewsSchedulerStatus,
  FinanceNewsCategory,
} from '../types/news';
import {
  fetchNewsFromApi,
  fetchSchedulerStatusFromApi,
  triggerManualNewsSync,
  requestGenerateDetailedArticle,
  getSavedArticles,
  saveArticleToStorage,
  deleteArticleFromStorage,
  getStoredNotifications,
  saveNotificationsToStorage,
} from '../services/financeNewsService';
import { useI18n } from './I18nContext';
import { useAdvisor } from './AdvisorContext';
import { INITIAL_VERIFIED_NEWS } from '../constants/financeNewsData';

interface FinanceNewsContextType {
  newsList: FinanceNewsItem[];
  nationalNews: FinanceNewsItem[];
  internationalNews: FinanceNewsItem[];
  isLoadingNews: boolean;
  activeCategory: 'all' | 'national' | 'international';
  setActiveCategory: (cat: 'all' | 'national' | 'international') => void;
  searchQuery: string;
  setSearchQuery: (q: string) => void;
  filteredNews: FinanceNewsItem[];

  // Article creation & reading
  activeArticle: FinanceNewsArticle | null;
  setActiveArticle: (article: FinanceNewsArticle | null) => void;
  isGeneratingArticle: boolean;
  generateArticleForNews: (newsItem: FinanceNewsItem) => Promise<FinanceNewsArticle | null>;
  generateArticleForCustomTopic: (topic: string) => Promise<FinanceNewsArticle | null>;

  // Article management
  savedArticles: FinanceNewsArticle[];
  saveCurrentArticle: (article: FinanceNewsArticle) => void;
  deleteSavedArticle: (id: string) => void;
  updateSavedArticle: (article: FinanceNewsArticle) => void;

  // Notifications
  notifications: NewsNotification[];
  unreadNotificationCount: number;
  markNotificationAsRead: (id: string) => void;
  markAllNotificationsAsRead: () => void;
  clearNotification: (id: string) => void;
  browserNotificationPermission: NotificationPermission | 'unsupported';
  requestBrowserNotificationPermission: () => Promise<void>;

  // Scheduler & Verification
  schedulerStatus: NewsSchedulerStatus | null;
  refreshNews: () => Promise<void>;
  isSyncingNews: boolean;
  syncMessage: string | null;
}

const FinanceNewsContext = createContext<FinanceNewsContextType | undefined>(undefined);

export const FinanceNewsProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const { language } = useI18n();
  const { profile } = useAdvisor();

  const [newsList, setNewsList] = useState<FinanceNewsItem[]>(INITIAL_VERIFIED_NEWS);
  const [isLoadingNews, setIsLoadingNews] = useState<boolean>(true);
  const [activeCategory, setActiveCategory] = useState<'all' | 'national' | 'international'>('all');
  const [searchQuery, setSearchQuery] = useState<string>('');

  const [activeArticle, setActiveArticle] = useState<FinanceNewsArticle | null>(null);
  const [isGeneratingArticle, setIsGeneratingArticle] = useState<boolean>(false);
  const [savedArticles, setSavedArticles] = useState<FinanceNewsArticle[]>([]);

  const [notifications, setNotifications] = useState<NewsNotification[]>([]);
  const [browserNotificationPermission, setBrowserNotificationPermission] = useState<
    NotificationPermission | 'unsupported'
  >('default');

  const [schedulerStatus, setSchedulerStatus] = useState<NewsSchedulerStatus | null>(null);
  const [isSyncingNews, setIsSyncingNews] = useState<boolean>(false);
  const [syncMessage, setSyncMessage] = useState<string | null>(null);

  // Initialize data on mount
  useEffect(() => {
    let mounted = true;

    // Load saved articles from local storage
    setSavedArticles(getSavedArticles());

    // Load stored notifications
    setNotifications(getStoredNotifications());

    // Check browser notification support
    if (typeof window !== 'undefined' && 'Notification' in window) {
      setBrowserNotificationPermission(Notification.permission);
    } else {
      setBrowserNotificationPermission('unsupported');
    }

    // Fetch live news & scheduler status
    async function loadData() {
      setIsLoadingNews(true);
      try {
        const { news, status } = await fetchNewsFromApi();
        if (mounted) {
          if (news && news.length > 0) {
            setNewsList(news);
          }
          if (status) {
            setSchedulerStatus(status);
          } else {
            const fetchedStatus = await fetchSchedulerStatusFromApi();
            if (mounted && fetchedStatus) setSchedulerStatus(fetchedStatus);
          }
        }
      } catch (err) {
        console.warn('News loading error, using local verified news', err);
      } finally {
        if (mounted) setIsLoadingNews(false);
      }
    }

    loadData();

    return () => {
      mounted = false;
    };
  }, []);

  const nationalNews = newsList.filter((item) => item.category === 'national');
  const internationalNews = newsList.filter((item) => item.category === 'international');

  // Filtered news based on category and search query
  const filteredNews = newsList.filter((item) => {
    if (activeCategory !== 'all' && item.category !== activeCategory) {
      return false;
    }
    if (!searchQuery.trim()) return true;

    const q = searchQuery.toLowerCase().trim();
    const localizedHeadline = (item.headline[language] || item.originalHeadline || '').toLowerCase();
    const localizedSummary = (item.summary[language] || item.originalSummary || '').toLowerCase();
    const sourceName = (item.source.name || '').toLowerCase();
    const tagsMatch = item.tags.some((t) => t.toLowerCase().includes(q));
    const impactMatch = item.financialImpactAreas.some((a) => a.toLowerCase().includes(q));

    return (
      localizedHeadline.includes(q) ||
      localizedSummary.includes(q) ||
      sourceName.includes(q) ||
      tagsMatch ||
      impactMatch
    );
  });

  // Manual news refresh / sync trigger
  const refreshNews = useCallback(async () => {
    setIsSyncingNews(true);
    setSyncMessage(null);
    try {
      const result = await triggerManualNewsSync();
      if (result.news && result.news.length > 0) {
        setNewsList(result.news);
      }
      setSyncMessage(result.message || 'News list verified and refreshed successfully.');

      // Refresh scheduler status
      const status = await fetchSchedulerStatusFromApi();
      if (status) setSchedulerStatus(status);

      // Auto-clear sync banner after 5 seconds
      setTimeout(() => setSyncMessage(null), 5000);
    } catch (err: any) {
      setSyncMessage('Manual refresh completed with current verified items.');
    } finally {
      setIsSyncingNews(false);
    }
  }, []);

  // Request browser notification permission
  const requestBrowserNotificationPermission = async () => {
    if (typeof window === 'undefined' || !('Notification' in window)) {
      setBrowserNotificationPermission('unsupported');
      return;
    }
    try {
      const permission = await Notification.requestPermission();
      setBrowserNotificationPermission(permission);
      if (permission === 'granted') {
        new Notification('FinAdvisor Pro News Alerts Active', {
          body: 'You will receive verified financial news alerts as soon as updates are published.',
          icon: '/favicon.ico',
        });
      }
    } catch (err) {
      console.warn('Failed to request notification permission', err);
    }
  };

  // Generate article for a specific news item
  const generateArticleForNews = async (
    newsItem: FinanceNewsItem
  ): Promise<FinanceNewsArticle | null> => {
    setIsGeneratingArticle(true);
    try {
      const article = await requestGenerateDetailedArticle({
        newsItem,
        language,
        advisorProfile: profile,
      });
      setActiveArticle(article);
      return article;
    } catch (err) {
      console.error('Failed to generate article:', err);
      return null;
    } finally {
      setIsGeneratingArticle(false);
    }
  };

  // Generate article for a custom news topic
  const generateArticleForCustomTopic = async (
    topic: string
  ): Promise<FinanceNewsArticle | null> => {
    if (!topic.trim()) return null;
    setIsGeneratingArticle(true);
    try {
      const article = await requestGenerateDetailedArticle({
        customTopic: topic.trim(),
        language,
        advisorProfile: profile,
      });
      setActiveArticle(article);
      return article;
    } catch (err) {
      console.error('Failed to generate custom topic article:', err);
      return null;
    } finally {
      setIsGeneratingArticle(false);
    }
  };

  // Save current article
  const saveCurrentArticle = (article: FinanceNewsArticle) => {
    saveArticleToStorage(article);
    setSavedArticles(getSavedArticles());
  };

  // Update saved article
  const updateSavedArticle = (article: FinanceNewsArticle) => {
    const updated = {
      ...article,
      updatedAt: new Date().toISOString(),
      isEdited: true,
      version: (article.version || 1) + 1,
    };
    saveArticleToStorage(updated);
    setActiveArticle(updated);
    setSavedArticles(getSavedArticles());
  };

  // Delete saved article
  const deleteSavedArticle = (id: string) => {
    deleteArticleFromStorage(id);
    setSavedArticles(getSavedArticles());
    if (activeArticle?.id === id) {
      setActiveArticle(null);
    }
  };

  // Mark single notification read
  const markNotificationAsRead = (id: string) => {
    const updated = notifications.map((n) => (n.id === id ? { ...n, isRead: true } : n));
    setNotifications(updated);
    saveNotificationsToStorage(updated);
  };

  // Mark all notifications read
  const markAllNotificationsAsRead = () => {
    const updated = notifications.map((n) => ({ ...n, isRead: true }));
    setNotifications(updated);
    saveNotificationsToStorage(updated);
  };

  // Clear notification
  const clearNotification = (id: string) => {
    const updated = notifications.filter((n) => n.id !== id);
    setNotifications(updated);
    saveNotificationsToStorage(updated);
  };

  const unreadNotificationCount = notifications.filter((n) => !n.isRead).length;

  return (
    <FinanceNewsContext.Provider
      value={{
        newsList,
        nationalNews,
        internationalNews,
        isLoadingNews,
        activeCategory,
        setActiveCategory,
        searchQuery,
        setSearchQuery,
        filteredNews,
        activeArticle,
        setActiveArticle,
        isGeneratingArticle,
        generateArticleForNews,
        generateArticleForCustomTopic,
        savedArticles,
        saveCurrentArticle,
        deleteSavedArticle,
        updateSavedArticle,
        notifications,
        unreadNotificationCount,
        markNotificationAsRead,
        markAllNotificationsAsRead,
        clearNotification,
        browserNotificationPermission,
        requestBrowserNotificationPermission,
        schedulerStatus,
        refreshNews,
        isSyncingNews,
        syncMessage,
      }}
    >
      {children}
    </FinanceNewsContext.Provider>
  );
};

export const useFinanceNews = (): FinanceNewsContextType => {
  const context = useContext(FinanceNewsContext);
  if (!context) {
    throw new Error('useFinanceNews must be used within a FinanceNewsProvider');
  }
  return context;
};

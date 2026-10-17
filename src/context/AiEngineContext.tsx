import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';

export type AiProvider = 'gemini' | 'openai' | 'auto';
export type OpenAiModel = 'gpt-4o-mini' | 'gpt-4o';
export type GeminiModel = 'gemini-3.8-flash' | 'gemini-2.5-flash';

export interface ServerAiConfig {
  geminiAvailable: boolean;
  openaiAvailable: boolean;
  defaultProvider: string;
}

export interface AiEngineContextType {
  provider: AiProvider;
  openaiModel: OpenAiModel;
  geminiModel: GeminiModel;
  serverConfig: ServerAiConfig | null;
  isLoadingConfig: boolean;
  setProvider: (provider: AiProvider) => void;
  setOpenaiModel: (model: OpenAiModel) => void;
  setGeminiModel: (model: GeminiModel) => void;
  refreshServerStatus: () => Promise<void>;
}

const STORAGE_KEY = 'finadvisor_ai_engine_preferences_v1';

export function getActiveAiPreferences(): {
  provider: AiProvider;
  openaiModel: OpenAiModel;
  geminiModel: GeminiModel;
} {
  try {
    if (typeof window !== 'undefined' && window.localStorage) {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved) {
        const parsed = JSON.parse(saved);
        return {
          provider: parsed.provider || 'gemini',
          openaiModel: parsed.openaiModel || 'gpt-4o-mini',
          geminiModel: parsed.geminiModel || 'gemini-3.8-flash',
        };
      }
    }
  } catch {
    // ignore
  }
  return {
    provider: 'gemini',
    openaiModel: 'gpt-4o-mini',
    geminiModel: 'gemini-3.8-flash',
  };
}

const AiEngineContext = createContext<AiEngineContextType | undefined>(undefined);

export const AiEngineProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [provider, setProviderState] = useState<AiProvider>('gemini');
  const [openaiModel, setOpenaiModelState] = useState<OpenAiModel>('gpt-4o-mini');
  const [geminiModel, setGeminiModelState] = useState<GeminiModel>('gemini-3.8-flash');
  const [serverConfig, setServerConfig] = useState<ServerAiConfig | null>(null);
  const [isLoadingConfig, setIsLoadingConfig] = useState<boolean>(true);

  // Load preferences from localStorage on mount
  useEffect(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved) {
        const parsed = JSON.parse(saved);
        if (parsed.provider) setProviderState(parsed.provider);
        if (parsed.openaiModel) setOpenaiModelState(parsed.openaiModel);
        if (parsed.geminiModel) setGeminiModelState(parsed.geminiModel);
      }
    } catch {
      // Ignore parse errors
    }
  }, []);

  const savePreferences = (newProvider: AiProvider, newOpenAi: OpenAiModel, newGemini: GeminiModel) => {
    try {
      localStorage.setItem(
        STORAGE_KEY,
        JSON.stringify({
          provider: newProvider,
          openaiModel: newOpenAi,
          geminiModel: newGemini,
        })
      );
    } catch {
      // Ignore storage errors
    }
  };

  const setProvider = (newProvider: AiProvider) => {
    setProviderState(newProvider);
    savePreferences(newProvider, openaiModel, geminiModel);
  };

  const setOpenaiModel = (newModel: OpenAiModel) => {
    setOpenaiModelState(newModel);
    savePreferences(provider, newModel, geminiModel);
  };

  const setGeminiModel = (newModel: GeminiModel) => {
    setGeminiModelState(newModel);
    savePreferences(provider, openaiModel, newModel);
  };

  const fetchServerConfig = async () => {
    setIsLoadingConfig(true);
    try {
      const res = await fetch('/api/ai-config');
      if (res.ok) {
        const data = await res.json();
        setServerConfig({
          geminiAvailable: Boolean(data?.providers?.gemini?.available),
          openaiAvailable: Boolean(data?.providers?.openai?.available),
          defaultProvider: data?.defaultProvider || 'gemini',
        });
      }
    } catch {
      // Offline fallback
      setServerConfig({
        geminiAvailable: true,
        openaiAvailable: false,
        defaultProvider: 'gemini',
      });
    } finally {
      setIsLoadingConfig(false);
    }
  };

  useEffect(() => {
    fetchServerConfig();
  }, []);

  return (
    <AiEngineContext.Provider
      value={{
        provider,
        openaiModel,
        geminiModel,
        serverConfig,
        isLoadingConfig,
        setProvider,
        setOpenaiModel,
        setGeminiModel,
        refreshServerStatus: fetchServerConfig,
      }}
    >
      {children}
    </AiEngineContext.Provider>
  );
};

export function useAiEngine() {
  const context = useContext(AiEngineContext);
  if (!context) {
    throw new Error('useAiEngine must be used within an AiEngineProvider');
  }
  return context;
}

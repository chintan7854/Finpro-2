import React, { useState } from 'react';
import { I18nProvider } from './context/I18nContext';
import { AdvisorProvider } from './context/AdvisorContext';
import { Header } from './components/Header';
import { BottomNav } from './components/BottomNav';
import { Sidebar } from './components/Sidebar';
import { DashboardView } from './components/DashboardView';
import { CreateContentView } from './components/CreateContentView';
import { ContentResultView } from './components/ContentResultView';
import { ProfileView } from './components/ProfileView';
import { MyContentView } from './components/MyContentView';
import { CalculatorsView } from './components/CalculatorsView';
import { ClientToolsView } from './components/ClientToolsView';
import { SettingsView } from './components/SettingsView';
import { BrandedPosterStudio } from './components/BrandedPosterStudio';
import { ThemePostersStudio } from './components/ThemePostersStudio';
import { ClientQaView } from './components/ClientQaView';
import { GreetingsStudio } from './components/GreetingsStudio';
import { ClientCrmView } from './components/crm/ClientCrmView';
import { ClientCrmProvider } from './context/ClientCrmContext';
import { LeadGenerationView } from './components/leads/LeadGenerationView';
import { LeadGenProvider } from './context/LeadGenContext';
import { MindsetSimulatorsView } from './components/MindsetSimulatorsView';
import { StoryStudioView } from './components/storyStudio/StoryStudioView';
import { FinancialSubjectId, GeneratedContent } from './types';

function MainApp() {
  const [currentView, setCurrentView] = useState<string>('dashboard');
  const [preselectedSubject, setPreselectedSubject] = useState<FinancialSubjectId | undefined>(undefined);
  const [activeResultContent, setActiveResultContent] = useState<GeneratedContent | null>(null);
  const [greetingsStudioConfig, setGreetingsStudioConfig] = useState<{
    tab: 'birthday' | 'anniversary' | 'festivals';
    recipientName: string;
  } | null>(null);

  const handleNavigate = (view: string) => {
    setCurrentView(view);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleNavigateToGreetings = (
    tab: 'birthday' | 'anniversary' | 'festivals',
    recipientName: string
  ) => {
    setGreetingsStudioConfig({ tab, recipientName });
    setCurrentView('greetings-studio');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleSelectTopicForGeneration = (subjectId: FinancialSubjectId) => {
    setPreselectedSubject(subjectId);
    setCurrentView('create');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleContentGenerated = (content: GeneratedContent) => {
    setActiveResultContent(content);
    setCurrentView('result');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleViewContentDetail = (content: GeneratedContent) => {
    setActiveResultContent(content);
    setCurrentView('result');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col text-slate-900 font-sans">
      <Header currentView={currentView} onNavigate={handleNavigate} />

      <div className="flex-1 flex max-w-7xl w-full mx-auto">
        <Sidebar currentView={currentView} onNavigate={handleNavigate} />

        <main className="flex-1 p-4 sm:p-6 lg:p-8 min-w-0">
          {currentView === 'dashboard' && (
            <DashboardView
              onNavigate={handleNavigate}
              onSelectTopicForGeneration={handleSelectTopicForGeneration}
              onViewContentDetail={handleViewContentDetail}
            />
          )}

          {currentView === 'create' && (
            <CreateContentView
              initialSubjectId={preselectedSubject}
              onContentGenerated={handleContentGenerated}
            />
          )}

          {currentView === 'result' && activeResultContent && (
            <ContentResultView
              content={activeResultContent}
              onBack={() => setCurrentView('dashboard')}
              onCreateAnother={() => {
                setPreselectedSubject(undefined);
                setCurrentView('create');
              }}
            />
          )}

          {currentView === 'profile' && <ProfileView />}

          {currentView === 'my-content' && (
            <MyContentView
              onSelectContent={handleViewContentDetail}
              onCreateNew={() => setCurrentView('create')}
            />
          )}

          {currentView === 'calculators' && (
            <CalculatorsView onNavigateToSimulators={() => handleNavigate('simulators')} />
          )}

          {currentView === 'simulators' && <MindsetSimulatorsView />}

          {currentView === 'story-studio' && <StoryStudioView />}

          {currentView === 'theme-studio' && (
            <ThemePostersStudio
              initialSubjectId={preselectedSubject}
              onNavigateToStandardStudio={() => setCurrentView('status-studio')}
            />
          )}

          {currentView === 'status-studio' && (
            <BrandedPosterStudio
              onNavigateToThemeStudio={() => setCurrentView('theme-studio')}
            />
          )}

          {currentView === 'lead-generation' && (
            <LeadGenerationView
              onNavigateToGreetings={handleNavigateToGreetings}
              onNavigate={handleNavigate}
            />
          )}

          {currentView === 'client-crm' && (
            <ClientCrmView
              onNavigateToGreetings={handleNavigateToGreetings}
              onNavigate={handleNavigate}
            />
          )}

          {currentView === 'greetings-studio' && (
            <GreetingsStudio
              initialTab={greetingsStudioConfig?.tab}
              initialRecipientName={greetingsStudioConfig?.recipientName}
            />
          )}

          {currentView === 'client-tools' && <ClientToolsView />}

          {currentView === 'client-qa' && <ClientQaView />}

          {currentView === 'settings' && <SettingsView />}
        </main>
      </div>

      <BottomNav currentView={currentView} onNavigate={handleNavigate} />
    </div>
  );
}

export default function App() {
  return (
    <I18nProvider>
      <AdvisorProvider>
        <ClientCrmProvider>
          <LeadGenProvider>
            <MainApp />
          </LeadGenProvider>
        </ClientCrmProvider>
      </AdvisorProvider>
    </I18nProvider>
  );
}

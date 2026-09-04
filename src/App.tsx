import React, { useState, useEffect } from 'react';
import { CURRENT_DATASET } from './services/dataLoader';
import { SEODashboardDataset, IssueItem } from './types/seo-schema';
import { TopBar } from './components/layout/TopBar';
import { Sidebar, NavViewKey } from './components/layout/Sidebar';
import { OverviewView } from './components/views/OverviewView';
import { TechnicalView } from './components/views/TechnicalView';
import { SemanticGraphView } from './components/semantic-graph/SemanticGraphView';
import { TopicClustersView } from './components/views/TopicClustersView';
import { TopicalAuthorityView } from './components/views/TopicalAuthorityView';
import { SiteArchitectureView } from './components/views/SiteArchitectureView';
import { InternalLinkingView } from './components/views/InternalLinkingView';
import { ContentView } from './components/views/ContentView';
import { ContentGapsView } from './components/views/ContentGapsView';
import { StructuredDataView } from './components/views/StructuredDataView';
import { EEATView } from './components/views/EEATView';
import { AEOView } from './components/views/AEOView';
import { SearchPerformanceView } from './components/views/SearchPerformanceView';
import { CannibalizationView } from './components/views/CannibalizationView';
import { ReleaseTimelineView } from './components/views/ReleaseTimelineView';
import { OpportunitiesView } from './components/views/OpportunitiesView';
import { RoadmapView } from './components/views/RoadmapView';
import { EvidenceView } from './components/views/EvidenceView';
import { AuditHistoryView } from './components/views/AuditHistoryView';
import { IssueDetailModal } from './components/common/IssueDetailModal';
import { DatasetManagerModal } from './components/common/DatasetManagerModal';

const VALID_VIEWS: NavViewKey[] = [
  'overview',
  'technical',
  'semantic',
  'clusters',
  'topical-authority',
  'architecture',
  'internal-linking',
  'content',
  'content-gaps',
  'structured-data',
  'eeat',
  'aeo',
  'search-performance',
  'cannibalization',
  'release-timeline',
  'opportunities',
  'roadmap',
  'evidence',
  'audit-history',
];

function parseUrlState(): { view: NavViewKey; nodeId: string | null } {
  let view: NavViewKey = 'overview';
  let nodeId: string | null = null;

  // 1. Try URL search params (?view=semantic)
  const searchParams = new URLSearchParams(window.location.search);
  const searchView = searchParams.get('view') as NavViewKey;
  if (searchView && VALID_VIEWS.includes(searchView)) {
    view = searchView;
    nodeId = searchParams.get('node');
    return { view, nodeId };
  }

  // 2. Try URL Hash (#semantic or #/semantic or #semantic?node=123)
  const hash = window.location.hash.replace(/^#\/?/, '');
  if (hash) {
    const [viewPart, queryPart] = hash.split('?');
    const cleanView = viewPart.replace(/^\//, '') as NavViewKey;
    if (VALID_VIEWS.includes(cleanView)) {
      view = cleanView;
      if (queryPart) {
        const hp = new URLSearchParams(queryPart);
        nodeId = hp.get('node');
      }
      return { view, nodeId };
    }
    const hp = new URLSearchParams(hash);
    const hashView = hp.get('view') as NavViewKey;
    if (hashView && VALID_VIEWS.includes(hashView)) {
      view = hashView;
      nodeId = hp.get('node');
      return { view, nodeId };
    }
  }

  // 3. Try Pathname (/semantic)
  const pathname = window.location.pathname.replace(/^\//, '').split('/')[0] as NavViewKey;
  if (pathname && VALID_VIEWS.includes(pathname)) {
    view = pathname;
    return { view, nodeId };
  }

  return { view: 'overview', nodeId: null };
}

export default function App() {
  const [currentDataset, setCurrentDataset] = useState<SEODashboardDataset>(CURRENT_DATASET);
  const [currentView, setCurrentView] = useState<NavViewKey>(() => parseUrlState().view);
  const [selectedIssue, setSelectedIssue] = useState<IssueItem | null>(null);
  const [focusedGraphNodeId, setFocusedGraphNodeId] = useState<string | null>(() => parseUrlState().nodeId);
  const [isDatasetModalOpen, setIsDatasetModalOpen] = useState(false);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [isAuditMode, setIsAuditMode] = useState(() => {
    return localStorage.getItem('theme-audit-mode') === 'true';
  });

  const handleSelectView = (newView: NavViewKey, nodeId?: string | null) => {
    if (!VALID_VIEWS.includes(newView)) return;
    setCurrentView(newView);
    if (nodeId !== undefined) {
      setFocusedGraphNodeId(nodeId);
    }

    let newHash = `#${newView}`;
    if (nodeId) {
      newHash += `?node=${encodeURIComponent(nodeId)}`;
    }

    if (window.location.hash !== newHash) {
      window.history.pushState({ view: newView, nodeId }, '', newHash);
    }
  };

  useEffect(() => {
    const { view: initialView, nodeId: initialNodeId } = parseUrlState();
    setCurrentView(initialView);
    if (initialNodeId) {
      setFocusedGraphNodeId(initialNodeId);
    }

    if (!window.location.hash && !window.location.search) {
      window.history.replaceState({ view: initialView }, '', `#${initialView}`);
    }

    const handlePopState = () => {
      const { view, nodeId } = parseUrlState();
      setCurrentView(view);
      setFocusedGraphNodeId(nodeId);
    };

    window.addEventListener('popstate', handlePopState);
    window.addEventListener('hashchange', handlePopState);
    return () => {
      window.removeEventListener('popstate', handlePopState);
      window.removeEventListener('hashchange', handlePopState);
    };
  }, []);

  useEffect(() => {
    if (isAuditMode) {
      document.documentElement.classList.add('audit-mode', 'dark');
      localStorage.setItem('theme-audit-mode', 'true');
    } else {
      document.documentElement.classList.remove('audit-mode', 'dark');
      localStorage.setItem('theme-audit-mode', 'false');
    }
  }, [isAuditMode]);

  // Cross navigation handler to jump to semantic graph
  const handleNavigateToGraph = (nodeIdOrUrl?: string) => {
    handleSelectView('semantic', nodeIdOrUrl || null);
  };

  // Select finding from evidence or other views
  const handleSelectFindingById = (findingId: string) => {
    const matched = (currentDataset.issues || []).find(i => i.id === findingId);
    if (matched) {
      setSelectedIssue(matched);
    }
  };

  return (
    <div className="flex h-screen w-screen overflow-hidden bg-[#f1f5f9] dark:bg-[#0c121e] text-[#0f172a] dark:text-[#f8fafc] font-sans antialiased">
      {/* Sidebar Navigation (All 17 sections) */}
      <Sidebar 
        currentView={currentView}
        onSelectView={handleSelectView}
        dataset={currentDataset}
        isOpen={isSidebarOpen}
        onClose={() => setIsSidebarOpen(false)}
      />

      {/* Main Workspace Area */}
      <div className="flex-1 flex flex-col min-w-0 overflow-hidden bg-[#f1f5f9] dark:bg-[#0c121e]">
        {/* Executive Top Bar */}
        <TopBar
          dataset={currentDataset}
          onOpenDatasetModal={() => setIsDatasetModalOpen(true)}
          onCompareClick={() => handleSelectView('audit-history')}
          isComparing={currentView === 'audit-history'}
          isAuditMode={isAuditMode}
          onToggleTheme={() => setIsAuditMode(!isAuditMode)}
          onToggleSidebar={() => setIsSidebarOpen(!isSidebarOpen)}
        />

        {/* Scrollable View Content Canvas */}
        <main className="flex-1 overflow-y-auto p-4 sm:p-6 lg:p-8">
          <div className="max-w-7xl mx-auto">
            {currentView === 'overview' && (
              <OverviewView
                dataset={currentDataset}
                onNavigateToView={(v) => handleSelectView(v as NavViewKey)}
                onSelectIssue={setSelectedIssue}
              />
            )}

            {currentView === 'technical' && (
              <TechnicalView dataset={currentDataset} />
            )}

            {currentView === 'semantic' && (
              <SemanticGraphView
                dataset={currentDataset}
                focusedNodeId={focusedGraphNodeId}
                onSelectIssue={setSelectedIssue}
              />
            )}

            {currentView === 'clusters' && (
              <TopicClustersView
                dataset={currentDataset}
                onNavigateToGraph={handleNavigateToGraph}
              />
            )}

            {currentView === 'topical-authority' && (
              <TopicalAuthorityView
                dataset={currentDataset}
                onNavigateToGraph={handleNavigateToGraph}
              />
            )}

            {currentView === 'architecture' && (
              <SiteArchitectureView
                dataset={currentDataset}
                onNavigateToGraph={handleNavigateToGraph}
              />
            )}

            {currentView === 'internal-linking' && (
              <InternalLinkingView
                dataset={currentDataset}
                onNavigateToGraph={handleNavigateToGraph}
              />
            )}

            {currentView === 'content' && (
              <ContentView
                dataset={currentDataset}
                onNavigateToGraph={handleNavigateToGraph}
              />
            )}

            {currentView === 'content-gaps' && (
              <ContentGapsView
                dataset={currentDataset}
                onNavigateToGraph={handleNavigateToGraph}
              />
            )}

            {currentView === 'structured-data' && (
              <StructuredDataView
                dataset={currentDataset}
                onNavigateToGraph={handleNavigateToGraph}
              />
            )}

            {currentView === 'eeat' && (
              <EEATView dataset={currentDataset} />
            )}

            {currentView === 'aeo' && (
              <AEOView dataset={currentDataset} />
            )}

            {currentView === 'search-performance' && (
              <SearchPerformanceView
                dataset={currentDataset}
                onNavigateToGraph={handleNavigateToGraph}
              />
            )}

            {currentView === 'cannibalization' && (
              <CannibalizationView
                dataset={currentDataset}
                onNavigateToGraph={handleNavigateToGraph}
              />
            )}

            {currentView === 'release-timeline' && (
              <ReleaseTimelineView
                dataset={currentDataset}
                onNavigateToGraph={handleNavigateToGraph}
              />
            )}

            {currentView === 'opportunities' && (
              <OpportunitiesView
                dataset={currentDataset}
                onSelectIssue={setSelectedIssue}
              />
            )}

            {currentView === 'roadmap' && (
              <RoadmapView
                dataset={currentDataset}
                onSelectIssue={setSelectedIssue}
              />
            )}

            {currentView === 'evidence' && (
              <EvidenceView
                dataset={currentDataset}
                onSelectFinding={handleSelectFindingById}
              />
            )}

            {currentView === 'audit-history' && (
              <AuditHistoryView
                currentDataset={currentDataset}
                onSelectDataset={setCurrentDataset}
                onNavigateToGraph={handleNavigateToGraph}
              />
            )}
          </div>
        </main>
      </div>

      {/* Global Issue Deep-Dive Modal */}
      {selectedIssue && (
        <IssueDetailModal
          issue={selectedIssue}
          evidenceList={currentDataset.evidence}
          onClose={() => setSelectedIssue(null)}
          onNavigateToGraph={handleNavigateToGraph}
          onNavigateToEvidence={() => {
            handleSelectView('evidence');
          }}
        />
      )}

      {/* Dataset & Snapshot Manager Modal */}
      {isDatasetModalOpen && (
        <DatasetManagerModal
          currentDataset={currentDataset}
          onSelectSnapshot={setCurrentDataset}
          onClose={() => setIsDatasetModalOpen(false)}
        />
      )}
    </div>
  );
}

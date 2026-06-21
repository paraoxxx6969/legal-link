/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import {
  Gavel,
  Bell,
  Search,
  ChevronRight,
  Calendar,
  ArrowRight,
  Lock,
  Shield,
  Home as HomeIcon,
  FolderClosed,
  FileText,
  User,
  Upload,
  FolderPlus,
  MoreVertical,
  Filter,
  Grid,
  List,
  Bookmark,
  Star,
  Map,
  GraduationCap,
  Briefcase,
  SlidersHorizontal,
  X,
  Check,
  MapPin,
  CheckCircle2,
  LockKeyhole,
  Info,
  LogOut
} from 'lucide-react';

import { INITIAL_ATTORNEYS, INITIAL_FOLDERS, INITIAL_FILES, INITIAL_CASES } from './data';
import { Attorney, Case, DocumentFile, Folder, Meeting } from './types';
import type { UserRole } from './LoginPage';

interface AppProps {
  /** Which role the person signed in as on the login screen. Defaults to 'client' if App is ever rendered standalone. */
  role?: UserRole;
  /** Returns the person to the login screen. Optional so App still works if rendered without auth wired up. */
  onLogout?: () => void;
}

export default function App({ role = 'client', onLogout }: AppProps) {
  // Navigation & Tab States
  const [activeTab, setActiveTab] = useState<'home' | 'cases' | 'documents' | 'profile'>('home');
  const [selectedLawyerId, setSelectedLawyerId] = useState<string>('jenkins');
  const [isSchedulerActive, setIsSchedulerActive] = useState<boolean>(false);

  // Search & Filter States for "Cases" (Find an Expert) tab
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedSpecialty, setSelectedSpecialty] = useState('All');
  const [experienceFilter, setExperienceFilter] = useState('Any Level');
  const [locationFilter, setLocationFilter] = useState('San Francisco, CA');
  const [sortBy, setSortBy] = useState<'relevance' | 'rating' | 'rate'>('relevance');

  // Interactive bookmarks state
  const [bookmarkedIds, setBookmarkedIds] = useState<string[]>(['jenkins']);

  // Dynamic Data States
  const [documents, setDocuments] = useState<DocumentFile[]>(INITIAL_FILES);
  const [folders, setFolders] = useState<Folder[]>(INITIAL_FOLDERS);
  const [cases, setCases] = useState<Case[]>(INITIAL_CASES);
  
  // Dynamic Document view state
  const [isGridView, setIsGridView] = useState<boolean>(false);
  const [docSearchQuery, setDocSearchQuery] = useState<string>('');

  // Sorter / Dropdown open triggers
  const [showLocationDropdown, setShowLocationDropdown] = useState(false);
  const [showExprDropdown, setShowExprDropdown] = useState(false);

  // New Folder Modal
  const [showNewFolderModal, setShowNewFolderModal] = useState(false);
  const [newFolderName, setNewFolderName] = useState('');

  // Document Upload Modal
  const [showUploadModal, setShowUploadModal] = useState(false);
  const [uploadFileName, setUploadFileName] = useState('');
  const [uploadFileSize, setUploadFileSize] = useState('1.8 MB');
  const [uploadFolder, setUploadFolder] = useState('filings');
  const [uploadProgress, setUploadProgress] = useState<number | null>(null);

  // Schedule Session selection states
  const [selectedCategory, setSelectedCategory] = useState<'consult' | 'review'>('consult');
  const [selectedDate, setSelectedDate] = useState<number>(16); // WED 16 is default
  const [selectedSlot, setSelectedSlot] = useState<string>('11:15 AM');
  const [scheduledMeetings, setScheduledMeetings] = useState<Meeting[]>([
    {
      id: 'meet-1',
      title: 'Upcoming: Case Review',
      date: 'Oct 16',
      time: '11:15 AM',
      type: 'Case Review',
      attorneyName: 'Sarah Jenkins, Esq.'
    }
  ]);
  const [notifications, setNotifications] = useState<Array<{ id: string; text: string; time: string }>>([
    { id: '1', text: 'Document Affidavit_Signed_Final.pdf approved by attorney.', time: '2h ago' },
    { id: '2', text: 'Sarah Jenkins requested access to Discovery_Request_Form.docx.', time: 'Yesterday' }
  ]);
  const [showNotifications, setShowNotifications] = useState(false);

  // Active Map View Trigger inside expert search
  const [isMapView, setIsMapView] = useState<boolean>(false);

  // Helpers
  const currentAttorney = useMemo(() => {
    return INITIAL_ATTORNEYS.find(a => a.id === selectedLawyerId) || INITIAL_ATTORNEYS[0];
  }, [selectedLawyerId]);

  const handleToggleBookmark = (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    if (bookmarkedIds.includes(id)) {
      setBookmarkedIds(bookmarkedIds.filter(item => item !== id));
    } else {
      setBookmarkedIds([...bookmarkedIds, id]);
    }
  };

  // Preloads a search when home "Find a Lawyer" tag is clicked
  const handleHomeTagFilter = (specialty: string) => {
    setSelectedSpecialty(specialty);
    setActiveTab('cases');
  };

  // Create a new folder
  const handleCreateFolder = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newFolderName.trim()) return;
    const colors = ['text-primary', 'text-secondary', 'text-tertiary-container', 'text-outline'];
    const newFolder: Folder = {
      id: newFolderName.toLowerCase().replace(/\s+/g, '-'),
      name: newFolderName,
      itemCount: 0,
      accent: colors[folders.length % colors.length]
    };
    setFolders([...folders, newFolder]);
    setNewFolderName('');
    setShowNewFolderModal(false);
  };

  // Upload file simulation
  const handleUploadFile = (e: React.FormEvent) => {
    e.preventDefault();
    if (!uploadFileName.trim()) return;

    // Start progress
    setUploadProgress(10);
    const interval = setInterval(() => {
      setUploadProgress(prev => {
        if (prev === null) return null;
        if (prev >= 100) {
          clearInterval(interval);
          setTimeout(() => {
            const formattedName = uploadFileName.endsWith('.pdf') || uploadFileName.endsWith('.docx') || uploadFileName.endsWith('.jpg') 
              ? uploadFileName 
              : `${uploadFileName}.pdf`;

            const newFile: DocumentFile = {
              id: `doc-${Date.now()}`,
              name: formattedName,
              size: uploadFileSize || '1.2 MB',
              uploadedDate: 'Just now',
              category: uploadFolder,
              type: formattedName.endsWith('.docx') ? 'doc' : formattedName.endsWith('.jpg') || formattedName.endsWith('.png') ? 'image' : 'pdf',
              sharedWith: []
            };

            // Add notification
            setNotifications(prevNotif => [
              { id: Date.now().toString(), text: `Uploaded ${formattedName} successfully.`, time: 'Just now' },
              ...prevNotif
            ]);

            setDocuments(prevDocs => [newFile, ...prevDocs]);
            // Increment item count inside stateful folder lists too
            setFolders(prevFolders => prevFolders.map(f => f.id === uploadFolder ? { ...f, itemCount: f.itemCount + 1 } : f));

            // Reset modal state
            setUploadProgress(null);
            setUploadFileName('');
            setShowUploadModal(false);
          }, 400);
          return 100;
        }
        return prev + 30;
      });
    }, 150);
  };

  // Grant / Revoke access switches on documents tab
  const handleToggleShareWithLawyer = (docId: string, lawyerName: string, isChecked: boolean) => {
    setDocuments(prevDocs => prevDocs.map(doc => {
      if (doc.id === docId) {
        if (isChecked) {
          return { ...doc, sharedWith: [...doc.sharedWith, lawyerName] };
        } else {
          return { ...doc, sharedWith: doc.sharedWith.filter(name => name !== lawyerName) };
        }
      }
      return doc;
    }));
  };

  // Schedule a session confirmation
  const handleConfirmBooking = () => {
    const categoryTitle = selectedCategory === 'consult' ? 'Initial Consultation' : 'Case Review';
    const newMeeting: Meeting = {
      id: `meet-${Date.now()}`,
      title: `Upcoming: ${categoryTitle}`,
      date: `Oct ${selectedDate}`,
      time: selectedSlot,
      type: categoryTitle,
      attorneyName: currentAttorney.name
    };

    setScheduledMeetings([newMeeting, ...scheduledMeetings]);
    setNotifications([
      { id: Date.now().toString(), text: `Scheduled session with ${currentAttorney.name} for Oct ${selectedDate} at ${selectedSlot}`, time: 'Just now' },
      ...notifications
    ]);

    // Push case to InProgress / update
    const exists = cases.some(c => c.lawyerName === currentAttorney.name);
    if (!exists) {
      const newCase: Case = {
        id: `case-${Date.now()}`,
        title: `Consultation with ${currentAttorney.name.split(',')[0]}`,
        status: 'In Progress',
        lastUpdated: '1 minute ago',
        progress: 10,
        lawyerName: currentAttorney.name,
        iconName: selectedCategory === 'consult' ? 'balance' : 'folder_shared'
      };
      setCases([newCase, ...cases]);
    }

    // Toast notification or automated switch Tab
    alert(`Success! Scheduled an ${categoryTitle} with ${currentAttorney.name} for Oct ${selectedDate} at ${selectedSlot}.`);
    setIsSchedulerActive(false);
    setActiveTab('home');
  };

  // Filter and sort for Attorney search list
  const filteredAttorneys = useMemo(() => {
    return INITIAL_ATTORNEYS.filter(attorney => {
      const matchQuery = attorney.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
                         attorney.specialty.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         attorney.expertiseTags.some(tag => tag.toLowerCase().includes(searchQuery.toLowerCase()));
      
      const matchSpecialty = selectedSpecialty === 'All' || 
                             attorney.specialty.toLowerCase().includes(selectedSpecialty.toLowerCase()) ||
                             selectedSpecialty.toLowerCase().includes(attorney.specialty.toLowerCase()) || 
                             (selectedSpecialty === 'Civil Litigation' && attorney.expertiseTags.includes('Civil Litigation')) ||
                             (selectedSpecialty === 'IP & Patent' && attorney.specialty === 'IP Law');

      const matchExperience = experienceFilter === 'Any Level' || 
                               (experienceFilter === '15+ Years' && attorney.experience === '15+ Years' || attorney.experience === '25+ Years') ||
                               (experienceFilter === '10+ Years' && (attorney.experience === '15+ Years' || attorney.experience === '25+ Years')) ||
                               (experienceFilter === '5+ Years' && (attorney.experience === '6+ Years' || attorney.experience === '8+ Years' || attorney.experience === '15+ Years' || attorney.experience === '25+ Years'));

      return matchQuery && matchSpecialty && matchExperience;
    }).sort((a, b) => {
      if (sortBy === 'rating') return b.rating - a.rating;
      if (sortBy === 'rate') return a.rate - b.rate;
      return b.reviewsCount - a.reviewsCount; // Relevance
    });
  }, [searchQuery, selectedSpecialty, experienceFilter, sortBy]);

  // Filter files in Vault
  const filteredDocuments = useMemo(() => {
    return documents.filter(doc => {
      return doc.name.toLowerCase().includes(docSearchQuery.toLowerCase());
    });
  }, [documents, docSearchQuery]);

  return (
    <div className="min-h-screen pb-28 text-white antialiased relative overflow-x-hidden">
      <header className="sticky top-0 bg-white/[0.04] backdrop-blur-2xl border-b border-white/10 z-50 flex justify-between items-center px-4 md:px-8 h-20">
        <div 
          onClick={() => { setActiveTab('home'); setIsSchedulerActive(false); }} 
          className="flex items-center gap-3 cursor-pointer select-none active:opacity-80"
          id="brand-logo-btn"
        >
          <div className="w-10 h-10 bg-[#4f46e5] rounded-xl flex items-center justify-center pill-glow">
            <Gavel className="text-white w-5.5 h-5.5 fill-current" />
          </div>
          <h1 className="text-xl md:text-2xl font-bold font-sans tracking-tight text-white">
            LEGAL<span className="text-indigo-400 font-light">LINK</span>
          </h1>
        </div>

        <div className="flex items-center gap-3 md:gap-4 relative">
          <span
            className="hidden sm:inline-flex items-center text-[9px] font-black uppercase tracking-widest text-indigo-300 bg-indigo-500/10 border border-indigo-500/20 rounded-full px-3 py-1.5 font-mono"
            id="active-role-badge"
          >
            {role === 'lawyer' ? 'Attorney Account' : 'Client Account'}
          </span>

          <button 
            type="button"
            onClick={() => setShowNotifications(!showNotifications)} 
            className="relative w-10 h-10 rounded-full border border-white/20 flex items-center justify-center cursor-pointer hover:bg-white/10 transition-colors focus:outline-none"
            id="notifications-toggle"
          >
            <Bell className="w-5 h-5 text-white/85" />
            {notifications.length > 0 && (
              <span className="absolute top-2 right-2 w-2 py-0.5 h-2 bg-indigo-500 rounded-full pill-glow"></span>
            )}
          </button>

          {onLogout && (
            <button
              type="button"
              onClick={onLogout}
              className="w-10 h-10 rounded-full border border-white/20 flex items-center justify-center cursor-pointer hover:bg-white/10 hover:border-red-400/30 hover:text-red-300 transition-colors focus:outline-none text-white/70"
              id="logout-btn"
              title="Sign out"
            >
              <LogOut className="w-4.5 h-4.5" />
            </button>
          )}

          {/* Notifications Dropdown */}
          <AnimatePresence>
            {showNotifications && (
              <motion.div 
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: 10 }}
                className="absolute right-0 top-14 w-80 bg-white/[0.06] backdrop-blur-2xl border border-white/15 rounded-2xl shadow-2xl p-3 z-50"
                id="notifications-box"
              >
                <div className="p-2 border-b border-white/10 flex justify-between items-center">
                  <span className="font-semibold text-sm text-white flex items-center gap-2">
                    <span className="subtle-indicator"></span>
                    Notifications
                  </span>
                  <button onClick={() => setNotifications([])} className="text-xs text-indigo-400 hover:text-indigo-300">Clear all</button>
                </div>
                <div className="max-h-64 overflow-y-auto pt-1 divide-y divide-white/5 no-scrollbar">
                  {notifications.length === 0 ? (
                    <p className="text-xs text-white/50 p-4 text-center">No new alerts</p>
                  ) : (
                    notifications.map(n => (
                      <div key={n.id} className="p-2 text-xs hover:bg-white/5 transition-colors">
                        <p className="text-white/90">{n.text}</p>
                        <span className="text-[10px] text-white/45 block mt-1">{n.time}</span>
                      </div>
                    ))
                  )}
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </header>

      {/* MAIN LAYOUT CANVAS */}
      <main className="max-w-7xl mx-auto px-4 md:px-8 pt-6">
        <AnimatePresence mode="wait">
          {/* TAB 1: CLIENT HOME DASHBOARD */}
          {activeTab === 'home' && (
            <motion.div
              key="home-tab"
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -15 }}
              transition={{ duration: 0.3 }}
              className="space-y-6"
            >
              {/* Welcome Section */}
              <section className="space-y-1" id="section-welcome">
                <div className="flex items-center gap-2">
                  <span className="subtle-indicator animate-pulse"></span>
                  <span className="text-xs uppercase font-extrabold tracking-widest text-[#818cf8]">Secure Counsel Link</span>
                </div>
                <h2 className="text-3xl font-bold text-white tracking-tight">Welcome, Alex</h2>
                <p className="text-white/60 text-sm">Your verified legal gateway is fully active & encrypted.</p>
              </section>

              {/* Find a Lawyer Tool Card */}
              <section className="glass p-6 rounded-[32px] border border-white/10 relative overflow-hidden" id="section-find-lawyer">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-lg font-bold text-white tracking-tight">Find Vetted Counsel</h3>
                  <Search className="w-5 h-5 text-indigo-400" />
                </div>
                <div className="space-y-4">
                  <div className="relative">
                    <input 
                      type="text"
                      className="w-full h-12 bg-white/5 border border-white/10 rounded-2xl px-4 text-sm text-white placeholder-white/40 focus:ring-2 focus:ring-[#4f46e5] outline-none transition-all"
                      placeholder="Search partner experts, litigation, corporate bylaws..."
                      value={searchQuery}
                      onChange={(e) => {
                        setSearchQuery(e.target.value);
                        setActiveTab('cases');
                      }}
                      id="home-search-input"
                    />
                  </div>
                  <div className="flex gap-2 overflow-x-auto pb-1 no-scrollbar select-none">
                    {['Civil Litigation', 'Corporate Law', 'Family Law', 'IP & Patent'].map(spec => (
                      <button 
                        key={spec}
                        onClick={() => handleHomeTagFilter(spec)}
                        className="glass-pill text-white/90 hover:text-white hover:bg-white/10 border border-white/10 hover:border-indigo-500/50 text-xs font-semibold px-4 py-2 rounded-full whitespace-nowrap cursor-pointer transition-all"
                      >
                        {spec}
                      </button>
                    ))}
                  </div>
                </div>
                <div className="absolute -bottom-20 -right-20 w-48 h-48 bg-indigo-500/10 rounded-full blur-[60px]" />
              </section>

              {/* Upcoming scheduled meeting banner if any exists */}
              {scheduledMeetings.length > 0 && (
                <section className="bg-indigo-600/10 border border-indigo-500/20 text-white p-6 rounded-3xl shadow-2xl relative overflow-hidden" id="section-upcoming-banner">
                  <div className="flex flex-col md:flex-row md:items-center justify-between gap-5 relative z-10">
                    <div className="flex items-start gap-4">
                      <div className="bg-indigo-500/20 w-12 h-12 rounded-2xl flex items-center justify-center shrink-0 border border-indigo-500/30">
                        <Calendar className="text-indigo-300 w-6 h-6" />
                      </div>
                      <div>
                        <div className="flex items-center gap-2 mb-0.5">
                          <span className="w-1.5 h-1.5 bg-green-400 rounded-full animate-ping"></span>
                          <h4 className="text-base font-bold text-white tracking-tight">{scheduledMeetings[0].title}</h4>
                        </div>
                        <p className="text-white/70 text-xs leading-relaxed">
                          Date: <span className="text-indigo-300 font-semibold">{scheduledMeetings[0].date}</span> • Slot: <span className="text-indigo-300 font-semibold">{scheduledMeetings[0].time}</span> • Counsel: <span className="text-white font-semibold">{scheduledMeetings[0].attorneyName}</span>
                        </p>
                      </div>
                    </div>
                    <button 
                      onClick={() => alert("Launching secure video consult workspace. Connecting via client-side E2EE WebRTC tunnel...")}
                      className="bg-white text-black text-xs font-extrabold px-6 py-3.5 rounded-2xl flex items-center justify-center gap-2 hover:scale-105 active:scale-95 transition-all duration-200 cursor-pointer self-start md:self-auto"
                    >
                      Join Secure Room
                      <ArrowRight className="w-4 h-4 text-black" />
                    </button>
                  </div>
                  <div className="absolute -right-10 -bottom-10 w-32 h-32 bg-indigo-500/15 rounded-full blur-3xl"></div>
                </section>
              )}

              {/* My Active Cases Overview */}
              <section className="space-y-4" id="section-active-cases">
                <div className="flex items-center justify-between">
                  <h3 className="text-lg font-bold text-white tracking-tight">Active Legal Actions</h3>
                  <button 
                    onClick={() => handleHomeTagFilter('All')} 
                    className="text-indigo-400 hover:text-indigo-300 text-xs font-semibold flex items-center gap-1 cursor-pointer transition-colors"
                  >
                    View legal team <ChevronRight className="w-4 h-4" />
                  </button>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {cases.map(item => (
                    <div 
                      key={item.id} 
                      className="glass hover:bg-white/5 border border-white/10 hover:border-white/20 p-5 rounded-2xl flex items-start gap-4 transition-all cursor-pointer group"
                      onClick={() => {
                        const matchId = item.lawyerName.toLowerCase().includes('sarah') ? 'jenkins' : 'vance';
                        setSelectedLawyerId(matchId);
                        setIsSchedulerActive(false);
                        setActiveTab('profile');
                      }}
                    >
                      <div className="w-12 h-12 rounded-xl bg-indigo-500/15 flex items-center justify-center shrink-0 border border-indigo-500/20 text-indigo-300">
                        <Gavel className="w-5.5 h-5.5" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex justify-between items-start gap-2">
                          <h4 className="font-bold text-sm text-white truncate group-hover:text-indigo-300 transition-colors">{item.title}</h4>
                          <span className={`px-2 py-0.5 rounded-md text-[9px] font-bold uppercase tracking-wider ${
                            item.status === 'In Progress' ? 'bg-indigo-500/20 text-indigo-300 border border-indigo-500/30' : 'bg-white/10 text-white/75 border border-white/10'
                          }`}>
                            {item.status}
                          </span>
                        </div>
                        <p className="text-xs text-white/60 mt-1">Counsel Account: {item.lawyerName}</p>
                        <p className="text-xs text-white/40 mt-0.5">Last updated: {item.lastUpdated}</p>
                        
                        {/* Progress slider bar */}
                        <div className="mt-4">
                          <div className="flex justify-between items-center text-[10px] mb-1 font-mono text-white/55">
                            <span>Vetting & Filing</span>
                            <span className="text-indigo-400 font-bold">{item.progress}%</span>
                          </div>
                          <div className="w-full bg-white/10 h-1.5 rounded-full overflow-hidden">
                            <div className="bg-indigo-500 h-full rounded-full transition-all duration-500 pill-glow" style={{ width: `${item.progress}%` }}></div>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </section>

              {/* Quick Action Schedule Meeting Banner */}
              <section id="section-quick-cta">
                <button 
                  onClick={() => {
                    setSelectedSpecialty('All');
                    setIsSchedulerActive(true);
                    setActiveTab('profile');
                  }}
                  className="w-full bg-gradient-to-r from-indigo-600 to-indigo-700 text-white p-5 rounded-2xl flex items-center justify-between hover:scale-[1.01] transition-all cursor-pointer select-none shadow-xl border border-indigo-500/30 pill-glow"
                >
                  <div className="flex items-center gap-3">
                    <Calendar className="w-5 h-5 text-indigo-200" />
                    <span className="font-bold text-sm md:text-base tracking-tight">Schedule Deposition / Consulting Intake</span>
                  </div>
                  <ArrowRight className="w-5 h-5 text-indigo-200" />
                </button>
              </section>

              {/* Recent Documents Dashboard Summary */}
              <section className="space-y-4" id="section-home-documents">
                <div className="flex items-center justify-between">
                  <h3 className="text-lg font-bold text-white tracking-tight">Recent Safe Filings</h3>
                  <span className="px-2.5 py-0.5 border border-indigo-500/30 text-indigo-300 bg-indigo-500/10 font-mono text-[9px] uppercase tracking-widest rounded-md font-bold">
                    E2E ENCRYPTED
                  </span>
                </div>

                <div className="glass rounded-2xl divide-y divide-white/5 overflow-hidden border border-white/10">
                  {documents.slice(0, 3).map((doc) => (
                    <div 
                      key={doc.id}
                      onClick={() => setActiveTab('documents')}
                      className="p-4 flex items-center justify-between hover:bg-white/5 transition-colors cursor-pointer"
                    >
                      <div className="flex items-center gap-4 min-w-0">
                        <div className={`w-11 h-11 rounded-xl flex items-center justify-center shrink-0 ${
                          doc.type === 'pdf' ? 'bg-red-500/15 text-red-400 border border-red-500/20' : 'bg-indigo-500/15 text-indigo-300 border border-indigo-500/20'
                        }`}>
                          <FileText className="w-5.5 h-5.5" />
                        </div>
                        <div className="min-w-0">
                          <p className="text-sm font-bold text-white truncate">{doc.name}</p>
                          <p className="text-xs text-white/50 mt-1">{doc.size} • {doc.uploadedDate}</p>
                        </div>
                      </div>
                      <div className="flex items-center gap-3">
                        {doc.sharedWith.length > 0 ? (
                          <span className="px-2.5 py-1 bg-indigo-500/20 text-indigo-300 rounded-md text-[10px] font-bold border border-indigo-500/30">Shared</span>
                        ) : (
                          <span className="px-2.5 py-1 bg-white/5 text-white/60 rounded-md text-[10px] font-bold border border-white/5">Vault Private</span>
                        )}
                        <MoreVertical className="w-5 h-5 text-white/50" />
                      </div>
                    </div>
                  ))}
                </div>
              </section>

              {/* Security Shield Info Badge */}
              <div className="flex flex-col items-center justify-center py-8 text-center space-y-2 opacity-90" id="encryption-badge-footer">
                <div className="w-12 h-12 rounded-full bg-indigo-500/10 flex items-center justify-center border border-indigo-500/20 mb-1">
                  <Shield className="w-6 h-6 text-indigo-400" />
                </div>
                <p className="text-[10px] font-black text-indigo-400 uppercase tracking-[0.25em] font-mono">Quantum Cryptographic Shield</p>
                <p className="text-xs text-white/60 max-w-md leading-relaxed">
                  Your legal briefs, communications, contract reviews, and sensitive evidentiary items are hosted strictly within segmented cloud vaults certified to SOC 2 Type II levels.
                </p>
              </div>
            </motion.div>
          )}

          {/* TAB 2: FIND LAWYER EXPERT REGISTRY */}
          {activeTab === 'cases' && (
            <motion.div
              key="cases-tab"
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -15 }}
              transition={{ duration: 0.3 }}
              className="space-y-6"
            >
              {/* Screen title */}
              <div className="flex justify-between items-center" id="cases-header-bar">
                <div>
                  <h2 className="text-xl md:text-2xl font-bold text-white tracking-tight">Legal Directory</h2>
                  <p className="text-xs text-white/50 mt-0.5">Find and hire licensed partners with verified case credentials.</p>
                </div>
                <button 
                  onClick={() => setIsMapView(!isMapView)}
                  className={`px-4 py-2 text-xs font-bold rounded-xl flex items-center gap-1.5 transition-colors cursor-pointer border ${
                    isMapView ? 'bg-[#4f46e5] text-white border-[#4f46e5] pill-glow' : 'glass text-white border-white/10 hover:bg-white/10'
                  }`}
                  id="map-view-toggle"
                >
                  <Map className="w-4 h-4 text-indigo-300" />
                  {isMapView ? "Hide Map Overlay" : "Show Geo Map"}
                </button>
              </div>

              {/* Search input with search overlay */}
              <div className="relative group" id="cases-search-container">
                <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-white/40 w-5 h-5 group-focus-within:text-white transition-colors" />
                <input 
                  type="text" 
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-12 pr-10 py-3.5 bg-white/5 border border-white/10 rounded-2xl focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20 transition-all text-sm outline-none placeholder-white/40 text-white" 
                  placeholder="Query briefs, deposition topics, bar licenses, jurisdictions..."
                  id="cases-search-field"
                />
                {searchQuery && (
                  <button onClick={() => setSearchQuery('')} className="absolute right-3 top-1/2 -translate-y-1/2 p-1 text-white/40 hover:text-white">
                    <X className="w-4 h-4" />
                  </button>
                )}
              </div>

              {/* Horizontal Specialty Filters scrollbar strip */}
              <div className="flex overflow-x-auto no-scrollbar gap-2 py-0.5 select-none" id="expert-tabs-strip">
                {['All', 'Criminal', 'Corporate', 'Family', 'IP & Patent'].map(specName => {
                  const isActive = selectedSpecialty === specName || (specName === 'Family' && selectedSpecialty === 'Family Law');
                  return (
                    <button
                      key={specName}
                      onClick={() => setSelectedSpecialty(specName === 'Family' ? 'Family Law' : specName)}
                      className={`whitespace-nowrap px-6 py-2.5 rounded-full text-xs font-bold transition-all duration-150 cursor-pointer active:scale-95 ${
                        isActive 
                          ? 'bg-[#4f46e5] text-white pill-glow border border-indigo-500/40' 
                          : 'glass-pill text-white/70 border border-white/10 hover:bg-white/10 hover:text-white'
                      }`}
                    >
                      {specName}
                    </button>
                  );
                })}
              </div>

              {/* Filter selectors drop-down grids */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3" id="filters-dropdown-grid">
                {/* Exp Filter */}
                <div className="relative">
                  <div 
                    onClick={() => { setShowExprDropdown(!showExprDropdown); setShowLocationDropdown(false); }} 
                    className="flex items-center justify-between px-4 py-3 glass border border-white/10 rounded-xl cursor-pointer hover:bg-white/5 transition-colors select-none"
                    id="exp-filter-trigger"
                  >
                    <div className="flex flex-col">
                      <span className="text-[9px] uppercase tracking-wider text-indigo-400 font-extrabold">Partner Seniority</span>
                      <span className="text-xs font-bold text-white">{experienceFilter}</span>
                    </div>
                    <SlidersHorizontal className="w-4 h-4 text-white/50" />
                  </div>
                  {showExprDropdown && (
                    <div className="absolute top-14 left-0 w-full bg-white/[0.06] backdrop-blur-2xl border border-white/15 rounded-xl shadow-2xl p-2 z-30 space-y-1">
                      {['Any Level', '5+ Years', '10+ Years', '15+ Years'].map(lvl => (
                        <div 
                          key={lvl} 
                          onClick={() => { setExperienceFilter(lvl); setShowExprDropdown(false); }}
                          className={`p-2.5 text-xs rounded-lg cursor-pointer transition-colors ${experienceFilter === lvl ? 'bg-indigo-500/20 text-white font-bold border border-indigo-500/30' : 'hover:bg-white/5 text-white/70'}`}
                        >
                          {lvl}
                        </div>
                      ))}
                    </div>
                  )}
                </div>

                {/* Location Filter */}
                <div className="relative">
                  <div 
                    onClick={() => { setShowLocationDropdown(!showLocationDropdown); setShowExprDropdown(false); }} 
                    className="flex items-center justify-between px-4 py-3 glass border border-white/10 rounded-xl cursor-pointer hover:bg-white/5 transition-colors select-none"
                    id="location-filter-trigger"
                  >
                    <div className="flex flex-col">
                      <span className="text-[9px] uppercase tracking-wider text-indigo-400 font-extrabold">Active Jurisdiction</span>
                      <span className="text-xs font-bold text-white">{locationFilter}</span>
                    </div>
                    <MapPin className="w-4 h-4 text-white/50" />
                  </div>
                  {showLocationDropdown && (
                    <div className="absolute top-14 left-0 w-full bg-white/[0.06] backdrop-blur-2xl border border-white/15 rounded-xl shadow-2xl p-2 z-30 space-y-1">
                      {['San Francisco, CA', 'Los Angeles, CA', 'San Jose, CA', 'Remote / Nationwide'].map(loc => (
                        <div 
                          key={loc} 
                          onClick={() => { setLocationFilter(loc); setShowLocationDropdown(false); }}
                          className={`p-2.5 text-xs rounded-lg cursor-pointer transition-colors ${locationFilter === loc ? 'bg-indigo-500/20 text-white font-bold border border-indigo-500/30' : 'hover:bg-white/5 text-white/70'}`}
                        >
                          {loc}
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>

              {/* Live interactive map simulation overlay */}
              {isMapView && (
                <motion.div 
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: '240px', opacity: 1 }}
                  exit={{ height: 0, opacity: 0 }}
                  className="w-full bg-white/[0.04] backdrop-blur-xl rounded-2xl relative overflow-hidden flex flex-col justify-between p-4 border border-white/10 shadow-inner"
                  id="interactive-map-holder"
                >
                  {/* Grid Lines resembling blueprint coordinates */}
                  <div className="absolute inset-0 grid grid-cols-6 grid-rows-4 divide-x divide-indigo-500/10 divide-y divide-indigo-500/10 pointer-events-none">
                    {Array.from({ length: 24 }).map((_, i) => <div key={i}></div>)}
                  </div>

                  <div className="relative flex justify-between items-start z-10">
                    <span className="bg-white/15 border border-white/10 text-[9px] uppercase tracking-widest font-black px-2 py-1 text-white rounded-md shadow-lg">
                      JURISDICTION: {locationFilter}
                    </span>
                    <span className="bg-[#4f46e5]/20 border border-indigo-500/30 text-indigo-300 text-[10px] font-bold px-2 py-1 rounded-md">
                      {filteredAttorneys.length} Pins Live
                    </span>
                  </div>

                  {/* Pins on map plot */}
                  <div className="relative h-24 w-full flex items-center justify-around z-10" id="map-pins-dock">
                    {filteredAttorneys.map((at, idx) => (
                      <div 
                        key={at.id} 
                        className="flex flex-col items-center cursor-pointer transform hover:scale-110 transition-transform"
                        onClick={() => {
                          setSelectedLawyerId(at.id);
                          setIsSchedulerActive(false);
                          setActiveTab('profile');
                        }}
                      >
                        <div className="bg-[#4f46e5]/90 text-white p-2.5 rounded-full shadow-2xl border border-indigo-400 pill-glow relative">
                          <MapPin className="w-5 h-5 text-white shrink-0" />
                          <div className="absolute -top-1 -right-1 w-2.5 h-2.5 bg-green-400 rounded-full border border-white animate-pulse"></div>
                        </div>
                        <span className="bg-black/80 backdrop-blur-xs text-[9px] font-bold text-white/95 px-1 md:px-2 py-0.5 rounded shadow-lg mt-1.5 block whitespace-nowrap border border-white/5">
                          {at.name.split(',')[0]}
                        </span>
                      </div>
                    ))}
                  </div>

                  <p className="relative z-10 text-[10px] text-center text-indigo-200 bg-indigo-500/10 p-1.5 rounded-lg border border-indigo-500/20 leading-none">
                    🗺️ Interactive Geographic Layer: Click on pins to safely verify active bar filings in real-time.
                  </p>
                </motion.div>
              )}

              {/* Results status block */}
              <div className="py-2 flex justify-between items-center border-t border-white/10" id="cases-found-stats">
                <span className="text-xs font-semibold text-white/60">
                  {filteredAttorneys.length} Counselors ready for engagement
                </span>
                <div className="flex items-center gap-1.5 text-white" id="sort-controls-box">
                  <span className="text-xs text-white/40">Sort by:</span>
                  <select 
                    value={sortBy} 
                    onChange={(e) => setSortBy(e.target.value as any)}
                    className="text-xs font-bold text-indigo-400 bg-transparent border-0 focus:ring-0 cursor-pointer p-1"
                  >
                    <option value="relevance">Experience Rank</option>
                    <option value="rating">Top Reviews (Stars)</option>
                    <option value="rate">Intake Rate (Low to High)</option>
                  </select>
                </div>
              </div>

              {/* LAWYERS PORTFOLIO LISTING */}
              <section className="space-y-4" id="cases-list-container">
                {filteredAttorneys.length === 0 ? (
                  <div className="glass p-12 border border-white/10 rounded-3xl text-center space-y-4">
                    <SlidersHorizontal className="w-10 h-10 mx-auto text-white/40" />
                    <h3 className="text-base font-bold text-white tracking-tight">No Legal Experts Found</h3>
                    <p className="text-xs text-white/60">Try refining your search queries or selecting a broader specialty.</p>
                    <button 
                      onClick={() => { setSelectedSpecialty('All'); setSearchQuery(''); setExperienceFilter('Any Level'); }}
                      className="px-5 py-2.5 bg-indigo-600 hover:bg-indigo-500 text-white rounded-xl font-bold cursor-pointer text-xs"
                    >
                      Reset All Filters
                    </button>
                  </div>
                ) : (
                  filteredAttorneys.map((lawyer) => (
                    <div 
                      key={lawyer.id} 
                      className="glass hover:bg-white/5 border border-white/10 p-4 md:p-6 rounded-3xl shadow-2xl transition-all duration-200 hover:border-indigo-500/20"
                      id={`lawyer-card-${lawyer.id}`}
                    >
                      <div className="flex flex-col sm:flex-row gap-4 items-start">
                        {/* Portrait Container */}
                        <div className="relative w-24 h-24 shrink-0 mx-auto sm:mx-0">
                          <img 
                            className="w-full h-full object-cover rounded-xl border border-white/10 shadow-lg" 
                            alt={lawyer.name}
                            src={lawyer.image} 
                            referrerPolicy="no-referrer"
                          />
                          {lawyer.online && (
                            <div className="absolute -bottom-1 -right-1 bg-green-500 w-4 h-4 rounded-full border-2 border-[#050508] shadow-lg animate-pulse" title="Online for Consultations"></div>
                          )}
                        </div>

                        {/* Content description */}
                        <div className="flex-1 text-center sm:text-left space-y-2 w-full">
                          <div className="flex flex-col sm:flex-row sm:justify-between sm:items-start gap-1">
                            <div>
                              <h3 className="text-lg font-bold text-white tracking-tight">{lawyer.name}</h3>
                              <p className="text-xs text-indigo-400 font-bold">{lawyer.title}</p>
                            </div>
                            <button 
                              type="button"
                              onClick={(e) => handleToggleBookmark(lawyer.id, e)}
                              className="self-center sm:self-auto p-1.5 text-white/40 hover:text-white transition-colors"
                              title={bookmarkedIds.includes(lawyer.id) ? "Remove bookmark" : "Bookmark lawyer"}
                            >
                              <Bookmark className={`w-5 h-5 ${bookmarkedIds.includes(lawyer.id) ? 'fill-indigo-500 text-indigo-500' : 'text-white/40'}`} />
                            </button>
                          </div>

                          <div className="flex items-center justify-center sm:justify-start gap-1">
                            <Star className="w-4 h-4 text-amber-400 fill-amber-400" />
                            <span className="text-xs font-bold text-white">{lawyer.rating}</span>
                            <span className="text-xs text-white/50">({lawyer.reviewsCount} verified ratings)</span>
                          </div>

                          <p className="text-xs text-white/70 line-clamp-2 leading-relaxed">{lawyer.bio}</p>

                          <div className="flex flex-wrap justify-center sm:justify-start gap-2 pt-1">
                            <span className="px-2.5 py-0.5 bg-indigo-500/15 text-indigo-300 border border-indigo-500/20 rounded-md font-mono text-[9px] uppercase tracking-wider font-semibold">
                              {lawyer.specialty}
                            </span>
                            <span className="px-2.5 py-0.5 bg-white/5 text-white/60 border border-white/5 rounded-md font-mono text-[9px] uppercase tracking-wider font-semibold">
                              {lawyer.experience} Experience
                            </span>
                          </div>
                        </div>
                      </div>

                      {/* Card Bottom CTA bar */}
                      <div className="mt-4 pt-4 border-t border-white/10 flex flex-col sm:flex-row gap-3 sm:justify-between sm:items-center">
                        <div className="text-center sm:text-left">
                          <span className="text-xs text-white/40 block">Corporate / Hourly Rate</span>
                          <span className="text-sm font-black text-white">${lawyer.rate} <span className="text-xs text-white/50 font-normal">/ hour (USD)</span></span>
                        </div>
                        <div className="flex gap-2 w-full sm:w-auto">
                          <button 
                            onClick={() => {
                              setSelectedLawyerId(lawyer.id);
                              setIsSchedulerActive(true);
                              setActiveTab('profile');
                            }}
                            className="flex-1 sm:flex-none border border-white/10 hover:bg-white/10 text-white text-xs font-bold px-4 py-2.5 rounded-xl cursor-pointer transition-all active:scale-95 text-center"
                          >
                            Book Meeting
                          </button>
                          <button 
                            onClick={() => {
                              setSelectedLawyerId(lawyer.id);
                              setIsSchedulerActive(false);
                              setActiveTab('profile');
                            }}
                            className="flex-1 sm:flex-none bg-indigo-650 hover:bg-indigo-600 text-white text-xs font-bold px-5 py-2.5 rounded-xl cursor-pointer transition-all active:scale-95 text-center border border-indigo-500/30"
                          >
                            View Case Record
                          </button>
                        </div>
                      </div>
                    </div>
                  ))
                )}
              </section>

              {/* Floating Map FAB as seen in design #2 */}
              <button 
                onClick={() => setIsMapView(!isMapView)}
                className="fixed right-6 bottom-24 bg-[#d0e1fb] hover:bg-[#b7c8df] text-[#041627] w-14 h-14 rounded-full flex items-center justify-center shadow-lg active:scale-90 transition-transform z-40 border border-[#041627]/20 cursor-pointer"
                title="Toggle Instant Map View"
              >
                <Map className="w-6 h-6" />
              </button>
            </motion.div>
          )}

          {/* TAB 3: DOCUMENT MANAGEMENT SECURE STORAGE */}
          {activeTab === 'documents' && (
            <motion.div
              key="doc-tab"
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -15 }}
              transition={{ duration: 0.3 }}
              className="space-y-6"
            >
              {/* Head with search upload */}
              <div className="flex flex-col sm:flex-row sm:justify-between sm:items-end gap-4" id="docs-title-block">
                <div>
                  <h2 className="text-xl md:text-2xl font-bold text-white tracking-tight">My Secure Vault</h2>
                  <p className="text-xs text-white/50 mt-0.5">Secure storage, cataloging, and direct folder provisioning with legal counsel.</p>
                </div>
                <div className="flex gap-2">
                  <button 
                    onClick={() => setShowNewFolderModal(true)}
                    className="border border-white/10 bg-white/5 hover:bg-white/10 text-white px-4 py-2.5 rounded-xl text-xs font-bold flex items-center gap-1.5 transition-all cursor-pointer"
                  >
                    <FolderPlus className="w-4 h-4 text-indigo-300" />
                    New Collection
                  </button>
                  <button 
                    onClick={() => setShowUploadModal(true)}
                    className="bg-[#4f46e5] hover:bg-indigo-550 text-white px-5 py-2.5 rounded-xl text-xs font-black flex items-center gap-1.5 transition-all shadow-xl active:scale-95 cursor-pointer pill-glow border border-indigo-400/25"
                  >
                    <Upload className="w-4 h-4" />
                    UPLOAD FILE
                  </button>
                </div>
              </div>

              {/* Bento folder grids as in design #3 */}
              <div className="grid grid-cols-2 lg:grid-cols-4 gap-4" id="folder-cells-grid">
                {folders.map(folder => (
                  <div 
                    key={folder.id}
                    onClick={() => alert(`Showing files inside "${folder.name}" directory only.`)}
                    className="glass border border-white/10 hover:bg-white/5 hover:border-indigo-500/30 p-4 rounded-xl flex flex-col justify-between h-32 cursor-pointer group transition-all"
                  >
                    <FolderClosed className="w-8 h-8 text-indigo-400 group-hover:scale-105 transition-transform" />
                    <div>
                      <p className="font-bold text-sm text-white group-hover:text-indigo-300 transition-colors">{folder.name}</p>
                      <p className="text-[10px] text-white/40 uppercase font-mono mt-1 tracking-widest">{folder.itemCount} Files</p>
                    </div>
                  </div>
                ))}
              </div>

              {/* Documents filter bar */}
              <div className="flex items-center justify-between" id="docs-filter-row">
                <div className="relative flex-1 max-w-sm mr-2">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-white/45 w-4 h-4" />
                  <input 
                    type="text" 
                    value={docSearchQuery}
                    onChange={(e) => setDocSearchQuery(e.target.value)}
                    className="w-full pl-9 pr-4 py-2 bg-white/5 border border-white/10 rounded-xl text-xs outline-none focus:ring-1 focus:ring-indigo-500 focus:border-indigo-500 text-white" 
                    placeholder="Search secure documents..."
                    id="doc-sub-search"
                  />
                </div>
                <div className="flex gap-1">
                  <button 
                    onClick={() => setIsGridView(false)} 
                    className={`p-2 rounded-xl cursor-pointer border transition-all ${!isGridView ? 'bg-indigo-500/20 text-indigo-300 border-indigo-500/30' : 'bg-transparent text-white/50 border-transparent hover:text-white'}`}
                    title="List View"
                  >
                    <List className="w-4 h-4" />
                  </button>
                  <button 
                    onClick={() => setIsGridView(true)} 
                    className={`p-2 rounded-xl cursor-pointer border transition-all ${isGridView ? 'bg-indigo-500/20 text-indigo-300 border-indigo-500/30' : 'bg-transparent text-white/50 border-transparent hover:text-white'}`}
                    title="Grid View"
                  >
                    <Grid className="w-4 h-4" />
                  </button>
                </div>
              </div>

              {/* Dynamic list rendering */}
              <div className={isGridView ? "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4" : "space-y-4"} id="documents-grid-or-list">
                {filteredDocuments.map(doc => {
                  const isSharedWithSarah = doc.sharedWith.includes('Sarah Jenkins, Esq.');
                  
                  return (
                    <div 
                      key={doc.id}
                      className="glass border border-white/10 rounded-2xl p-4 flex flex-col gap-4 shadow-2xl"
                      id={`doc-card-${doc.id}`}
                    >
                      <div className="flex items-start justify-between">
                        <div className="flex items-center gap-3">
                          <div className={`w-12 h-12 rounded-xl flex items-center justify-center shrink-0 border ${
                            doc.type === 'pdf' ? 'bg-red-500/15 text-red-400 border-red-500/25' : 'bg-indigo-500/15 text-indigo-400 border-indigo-500/25'
                          }`}>
                            <FileText className="w-6 h-6" />
                          </div>
                          <div>
                            <h4 className="font-bold text-sm text-white tracking-tight">{doc.name}</h4>
                            <p className="text-xs text-white/50 mt-1">Uploaded: {doc.uploadedDate} • {doc.size}</p>
                          </div>
                        </div>
                        <MoreVertical className="w-5 h-5 text-white/40 shrink-0 cursor-pointer hover:text-white" />
                      </div>

                      {/* Share toggle bars as in design #3 */}
                      <div className="pt-3 border-t border-white/10 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 bg-white/[0.04] p-3 rounded-xl border border-white/5">
                        <div className="flex items-center gap-2">
                          {doc.sharedWith.length > 0 ? (
                            <div className="flex items-center gap-1.5" id={`shared-status-${doc.id}`}>
                              <span className="w-2 h-2 bg-green-400 rounded-full inline-block shrink-0 animate-pulse"></span>
                              <span className="text-xs font-semibold text-white/80 truncate">
                                Shared with {doc.sharedWith.join(', ')}
                              </span>
                            </div>
                          ) : (
                            <div className="flex items-center gap-1.5" id={`unshared-status-${doc.id}`}>
                              <Lock className="w-3.5 h-3.5 text-red-400 shrink-0" />
                              <span className="text-xs font-semibold text-red-400 italic block">
                                Private - Vault Sealed
                              </span>
                            </div>
                          )}
                        </div>

                        {/* Interactive toggle block */}
                        <div className="flex items-center gap-2 justify-between sm:justify-end">
                          <span className="text-xs text-white/60">Sarah Jenkins, Esq.</span>
                          <label className="relative inline-flex items-center cursor-pointer select-none">
                            <input 
                              type="checkbox" 
                              checked={isSharedWithSarah}
                              onChange={(e) => {
                                handleToggleShareWithLawyer(doc.id, 'Sarah Jenkins, Esq.', e.target.checked);
                              }}
                              className="sr-only peer"
                            />
                            <div className="w-10 h-5 bg-white/10 rounded-full peer peer-checked:bg-indigo-600 after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:after:translate-x-full"></div>
                          </label>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>

              {/* Encryption Certificate persistent footer block */}
              <div className="p-4 bg-indigo-600/10 border border-indigo-500/20 text-indigo-300 rounded-2xl flex items-center justify-center gap-3 shadow-lg">
                <Shield className="text-indigo-400 w-5 h-5 shrink-0 animate-pulse" />
                <span className="font-mono text-xs tracking-widest font-black uppercase">
                  Encryption Layer: 256-Bit AES - SECURE VAULT ACCESS ACTIVE
                </span>
              </div>
            </motion.div>
          )}

          {/* TAB 4: DETAILED PROFILE OR SCHEDULE CALENDAR */}
          {activeTab === 'profile' && (
            <motion.div
              key="profile-tab"
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -15 }}
              transition={{ duration: 0.3 }}
              className="space-y-6"
            >
              {/* SWITCH VIEWER BETWEEN PORTFOLIO PROFILE AND EXPERT DATE SLOT CALENDAR */}
              {!isSchedulerActive ? (
                /* VIEW A: ATTORNEY PROFILE LANDING PAGE (e.g. Eleanor Vance/Sarah Jenkins/Robert Chen) */
                <div className="space-y-6" id="attorney-profile-landing">
                  {/* Portrait Hero container */}
                  <div className="glass border border-white/10 rounded-3xl p-6 relative flex flex-col md:flex-row gap-6 items-center md:items-start overflow-hidden shadow-2xl">
                    <div className="absolute top-0 right-0 px-4 py-1.5 bg-[#4f46e5]/90 border-l border-b border-indigo-500/20 text-white font-mono text-[9px] uppercase tracking-widest font-black">
                      Verified Counselor
                    </div>

                    {/* Left portrait square */}
                    <div className="w-28 h-28 md:w-36 md:h-36 rounded-2xl overflow-hidden border border-white/15 shrink-0 shadow-xl">
                      <img 
                        src={currentAttorney.image} 
                        alt={currentAttorney.name} 
                        className="w-full h-full object-cover" 
                        referrerPolicy="no-referrer"
                      />
                    </div>

                    {/* Title block */}
                    <div className="flex-1 text-center md:text-left space-y-3 w-full">
                      <div>
                        <span className="text-[10px] font-black uppercase tracking-widest text-indigo-400 block font-mono">At-Law Attorney Partner</span>
                        <h2 className="text-xl md:text-2xl font-black text-white tracking-tight">{currentAttorney.name}</h2>
                        <p className="text-xs font-bold text-white/50 mt-0.5">{currentAttorney.title}</p>
                      </div>

                      <p className="text-xs text-white/70 leading-relaxed max-w-3xl pr-2">
                        {currentAttorney.bio}
                      </p>

                      <div className="flex flex-wrap gap-2 justify-center md:justify-start">
                        {currentAttorney.expertiseTags.map(tag => (
                          <span key={tag} className="px-3 py-1 bg-indigo-500/10 text-indigo-300 border border-indigo-500/15 rounded-md text-[9px] font-bold tracking-widest font-mono uppercase">
                            {tag}
                          </span>
                        ))}
                      </div>

                      <div className="pt-2 flex flex-col sm:flex-row gap-4 items-center">
                        <button 
                          onClick={() => setIsSchedulerActive(true)}
                          className="w-full sm:w-auto px-6 py-3 bg-[#4f46e5] hover:bg-indigo-650 text-white text-xs font-black rounded-xl flex items-center justify-center gap-2 cursor-pointer transition-transform active:scale-95 shadow-xl border border-indigo-400/25 pill-glow"
                          id="select-lawyer-schedule-now-btn"
                        >
                          <Calendar className="w-4 h-4 shrink-0 text-indigo-200" />
                          Schedule 1-on-1 Session
                        </button>
                        <span className="text-xs text-white/50 font-semibold">
                          Book discovery starting at <span className="text-xs font-black text-white bg-indigo-500/10 border border-indigo-500/15 rounded px-1.5 py-0.5">${currentAttorney.rate} / hr</span>
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Prior Case timelines and reviews bento grids */}
                  <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
                    {/* TIMELINE COLUMN */}
                    <div className="lg:col-span-8 space-y-6">
                      <section className="glass border border-white/10 rounded-3xl p-6" id="prior-cases-box">
                        <h3 className="text-xs font-bold text-indigo-400 uppercase tracking-widest mb-6 flex items-center gap-2 pb-2 border-b border-white/10">
                          <Gavel className="w-4 h-4 text-indigo-400 animate-pulse" />
                          Prior Cases & Vetted Outcomes
                        </h3>

                        <div className="space-y-4">
                          {currentAttorney.cases.map((cs, idx) => (
                            <div key={idx} className="p-4 bg-white/[0.04] rounded-xl border border-white/5 hover:bg-white/5 transition-colors text-white">
                              <div className="flex justify-between items-center mb-2">
                                <h4 className="font-bold text-sm text-white tracking-tight">{cs.title}</h4>
                                <span className={`px-2.5 py-0.5 rounded text-[8px] font-black uppercase tracking-widest ${
                                  cs.outcomeColor === 'green' ? 'bg-[#ffdad6]/10 text-red-300 border border-red-500/10' : 'bg-[#dbe1ff]/10 text-indigo-300 border border-indigo-500/10'
                                }`}>
                                  {cs.outcome}
                                </span>
                              </div>
                              <p className="text-xs text-white/70 leading-relaxed">{cs.description}</p>
                            </div>
                          ))}
                        </div>
                      </section>

                      {/* ENDORSEMENTS BOX */}
                      <section className="glass border border-white/10 rounded-3xl p-6" id="endorsements-box">
                        <h3 className="text-xs font-bold text-indigo-400 uppercase tracking-widest mb-4 flex items-center gap-2 pb-2 border-b border-white/10">
                          <Star className="w-4 h-4 text-amber-400 fill-amber-400" />
                          Verified Client Endorsements
                        </h3>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          {currentAttorney.endorsements.map((en, idx) => (
                            <div key={idx} className="p-4 bg-white/[0.04] rounded-xl border border-white/5 flex flex-col justify-between text-white">
                              <div className="flex gap-0.5 mb-2">
                                {Array.from({ length: 5 }).map((_, i) => (
                                  <Star key={i} className="w-3.5 h-3.5 text-amber-400 fill-amber-400" />
                                ))}
                              </div>
                              <p className="text-xs text-white/80 italic leading-relaxed mb-4 font-normal">
                                "{en.quote}"
                              </p>
                              <div className="flex items-center gap-2">
                                <div className="w-7 h-7 rounded-full bg-indigo-500/20 border border-indigo-500/15 flex items-center justify-center text-[9px] font-black text-white uppercase">
                                  {en.author.substring(0, 1)}
                                </div>
                                <span className="text-[10px] font-bold text-indigo-300">{en.author}</span>
                              </div>
                            </div>
                          ))}
                        </div>
                      </section>
                    </div>

                    {/* SIDEBAR DETAILS COLUMN */}
                    <div className="lg:col-span-4 space-y-6">
                      {/* FOCUS CARD */}
                      <div className="glass border border-white/10 rounded-3xl p-6">
                        <h4 className="text-xs font-bold text-indigo-400 uppercase tracking-widest mb-4">Specialized Focus</h4>
                        <div className="flex flex-wrap gap-2">
                          {currentAttorney.expertiseTags.map(tag => (
                            <span key={tag} className="px-3 py-1 bg-white/5 border border-white/5 text-white/80 font-mono text-[9px] uppercase tracking-wider font-semibold rounded-md">
                              {tag}
                            </span>
                          ))}
                        </div>
                      </div>

                      {/* AFFILIATIONS CARD */}
                      <div className="glass border border-white/10 rounded-3xl p-6 space-y-4">
                        <h4 className="text-xs font-bold text-indigo-400 uppercase tracking-widest border-b border-white/10 pb-2">Institutional Credentials</h4>
                        <div className="space-y-4 text-xs">
                          {currentAttorney.affiliations.map((aff, idx) => (
                            <div key={idx} className="flex items-start gap-2.5">
                              <GraduationCap className="w-4 h-4 text-indigo-400 shrink-0 mt-0.5" />
                              <p className="text-white/80 font-medium leading-relaxed">{aff}</p>
                            </div>
                          ))}
                        </div>
                      </div>

                      {/* CTA BOX */}
                      <div className="bg-indigo-600/10 border border-indigo-500/20 text-white p-5 rounded-3xl space-y-4">
                        <h4 className="font-bold text-sm text-white tracking-tight">Retain Counselor</h4>
                        <p className="text-xs text-white/60 leading-relaxed">
                          Secure deposit retainers are protected. All initial counsel consults are conflict-of-interest audited.
                        </p>
                        <button 
                          onClick={() => setIsSchedulerActive(true)}
                          className="w-full py-3 bg-[#4f46e5] hover:bg-indigo-600 text-white font-black text-xs rounded-xl transition-all border border-indigo-400/25 shadow-xl pill-glow cursor-pointer"
                        >
                          Schedule discovery consult
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              ) : (
                /* VIEW B: INTERACTIVE DATE-PICKER MEETINGS SCHEDULE SCHEDULER */
                <div className="space-y-6" id="attorney-schedule-interactive">
                  <div className="flex justify-between items-center">
                    <button 
                      onClick={() => setIsSchedulerActive(false)} 
                      className="text-xs font-bold text-indigo-300 hover:text-white flex items-center gap-1 cursor-pointer transition-colors"
                    >
                      ← Back to Profile view
                    </button>
                    <span className="bg-red-500/15 border border-red-500/25 text-red-300 text-[9px] uppercase font-mono px-2 py-1 tracking-widest font-black rounded">Slot verification active</span>
                  </div>

                  {/* Header booking options */}
                  <div className="glass border border-white/10 p-5 rounded-3xl space-y-4">
                    <h3 className="text-xs uppercase font-bold text-indigo-400 tracking-widest">Select Session Category</h3>
                    
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      {/* Option 1 */}
                      <div 
                        onClick={() => setSelectedCategory('consult')}
                        className={`p-4 border rounded-xl cursor-pointer transition-all ${
                          selectedCategory === 'consult' ? 'border-indigo-500 bg-indigo-500/15 pill-glow' : 'border-white/10 bg-white/5 hover:bg-white/10'
                        }`}
                      >
                        <div className="flex justify-between items-center mb-1">
                          <CheckCircle2 className={`w-5 h-5 ${selectedCategory === 'consult' ? 'text-indigo-400' : 'text-white/40'}`} />
                          <span className="text-[10px] font-bold bg-white/5 border border-white/15 text-indigo-300 px-2 py-0.5 rounded uppercase font-mono">45 mins</span>
                        </div>
                        <h4 className="font-bold text-sm text-white tracking-tight">Initial Legal Consultation</h4>
                        <p className="text-[11px] text-white/60 mt-1 mb-0.5">Vetting, conflict checking, and initial case assessment.</p>
                      </div>

                      {/* Option 2 */}
                      <div 
                        onClick={() => setSelectedCategory('review')}
                        className={`p-4 border rounded-xl cursor-pointer transition-all ${
                          selectedCategory === 'review' ? 'border-indigo-500 bg-indigo-500/15 pill-glow' : 'border-white/10 bg-white/5 hover:bg-white/10'
                        }`}
                      >
                        <div className="flex justify-between items-center mb-1">
                          <CheckCircle2 className={`w-5 h-5 ${selectedCategory === 'review' ? 'text-indigo-400' : 'text-white/40'}`} />
                          <span className="text-[10px] font-bold bg-white/5 border border-white/15 text-indigo-300 px-2 py-0.5 rounded uppercase font-mono">60 mins</span>
                        </div>
                        <h4 className="font-bold text-sm text-white tracking-tight">Case Deep-Dive Review</h4>
                        <p className="text-[11px] text-white/60 mt-1 mb-0.5">Evidence processing and deposition plan outline.</p>
                      </div>
                    </div>
                  </div>

                  {/* Calendar view box */}
                  <div className="glass border border-white/10 p-5 rounded-3xl space-y-4">
                    <div className="flex items-center justify-between">
                      <h4 className="text-xs uppercase font-bold text-indigo-400 tracking-widest">Availability Calendar (Oct 2026)</h4>
                      <span className="text-xs font-bold text-white/50">Timezone: America/Los_Angeles (PST)</span>
                    </div>

                    {/* Horizontal dates */}
                    <div className="flex gap-3 overflow-x-auto no-scrollbar pb-1 select-none">
                      {[
                        { dayName: 'MON', dayVal: 14 },
                        { dayName: 'TUE', dayVal: 15 },
                        { dayName: 'WED', dayVal: 16 },
                        { dayName: 'THU', dayVal: 17 },
                        { dayName: 'FRI', dayVal: 18 },
                        { dayName: 'SAT', dayVal: 19, promo: true },
                        { dayName: 'SUN', dayVal: 20, promo: true }
                      ].map(item => {
                        const isChosen = selectedDate === item.dayVal;
                        return (
                          <div
                            key={item.dayVal}
                            onClick={() => !item.promo && setSelectedDate(item.dayVal)}
                            className={`flex-shrink-0 w-16 h-20 flex flex-col items-center justify-center border rounded-xl cursor-pointer relative transition-all ${
                              item.promo ? 'opacity-35 cursor-not-allowed bg-white/5 border-white/5' : 
                              isChosen ? 'border border-[#4f46e5] bg-[#4f46e5] text-white pill-glow' : 'border-white/10 bg-white/5 text-white/80 hover:border-white/25'
                            }`}
                          >
                            <span className="text-[10px] font-semibold text-white/50">{item.dayName}</span>
                            <span className="text-lg font-black text-white">{item.dayVal}</span>
                            {isChosen && <span className="absolute bottom-1 w-1.5 h-1.5 bg-white rounded-full animate-pulse"></span>}
                          </div>
                        );
                      })}
                    </div>
                  </div>

                  {/* Available times slot layout */}
                  <div className="glass border border-white/10 p-5 rounded-3xl space-y-6">
                    <h4 className="text-xs uppercase font-bold text-indigo-400 tracking-widest">Available Slots for October {selectedDate}</h4>
                    
                    {/* Morning */}
                    <div>
                      <p className="text-[10px] font-black text-white/40 uppercase tracking-widest mb-3">Morning Slots</p>
                      <div className="grid grid-cols-3 gap-2">
                        {['09:00 AM', '10:30 AM', '11:15 AM'].map(time => {
                          const isActive = selectedSlot === time;
                          return (
                            <button
                              key={time}
                              onClick={() => setSelectedSlot(time)}
                              className={`py-3 px-2 border rounded-xl text-xs font-bold cursor-pointer transition-all ${
                                isActive ? 'border-2 border-[#4f46e5] bg-[#4f46e5]/20 text-white pill-glow' : 'border-white/10 bg-white/5 text-white/70 hover:border-white/20 hover:bg-white/10'
                              }`}
                            >
                              {time}
                            </button>
                          );
                        })}
                      </div>
                    </div>

                    {/* Afternoon */}
                    <div>
                      <p className="text-[10px] font-black text-white/40 uppercase tracking-widest mb-3">Afternoon Slots</p>
                      <div className="grid grid-cols-3 gap-2">
                        {['01:45 PM', '03:00 PM', '04:30 PM'].map(time => {
                          const isActive = selectedSlot === time;
                          return (
                            <button
                              key={time}
                              onClick={() => setSelectedSlot(time)}
                              className={`py-3 px-2 border rounded-xl text-xs font-bold cursor-pointer transition-all ${
                                isActive ? 'border-2 border-[#4f46e5] bg-[#4f46e5]/20 text-white pill-glow' : 'border-white/10 bg-white/5 text-white/70 hover:border-white/20 hover:bg-white/10'
                              }`}
                            >
                              {time}
                            </button>
                          );
                        })}
                      </div>
                    </div>

                    {/* Booking metadata confirmation */}
                    <div className="pt-4 border-t border-white/10 space-y-4">
                      <div className="flex justify-between text-xs text-white/60">
                        <span>Assigned Counselor:</span>
                        <span className="font-bold text-white">{currentAttorney.name}</span>
                      </div>
                      <div className="flex justify-between text-xs text-white/60">
                        <span>Session Type:</span>
                        <span className="font-bold text-white">
                          {selectedCategory === 'consult' ? 'Initial Consultation (45m)' : 'Case Deep-Dive Review (60m)'}
                        </span>
                      </div>
                      <div className="flex justify-between text-xs text-white/60">
                        <span>Selected Appointment:</span>
                        <span className="font-bold text-indigo-300">Oct {selectedDate} at {selectedSlot}</span>
                      </div>

                      <button 
                        onClick={handleConfirmBooking}
                        className="w-full bg-[#4f46e5] hover:bg-indigo-600 text-white p-4 rounded-xl text-sm font-black transition-all active:scale-[0.98] cursor-pointer text-center flex items-center justify-center gap-2 border border-indigo-400/20 shadow-xl pill-glow"
                        id="verify-booking-slot-trigger"
                      >
                        <LockKeyhole className="w-4 h-4 shrink-0 text-white" />
                        Confirm and Schedule Vetted Consultation
                      </button>
                    </div>
                  </div>
                </div>
              )}
            </motion.div>
          )}
        </AnimatePresence>
      </main>

      {/* FOOTER PERSISTENT BOTTOM NAVIGATION BAR WITH ACTIVE HIGHLIGHTS */}
      <nav className="fixed bottom-0 left-0 w-full flex justify-around items-center h-16 bg-white/[0.05] backdrop-blur-3xl border-t border-white/10 z-50 shadow-2xl">
        {/* TAB 1 ICON LINK */}
        <button 
          onClick={() => { setActiveTab('home'); setIsSchedulerActive(false); }} 
          className={`flex flex-col items-center justify-center flex-1 h-full cursor-pointer focus:outline-none transition-all active:scale-95 ${
            activeTab === 'home' ? 'text-indigo-400 font-extrabold shadow-[inset_0_2px_10px_rgba(79,70,229,0.05)]' : 'text-white/40 hover:text-white/70'
          }`}
          id="nav-home-btn"
        >
          <HomeIcon className="w-5 h-5" />
          <span className="text-[10px] mt-0.5 tracking-wider font-bold">Home</span>
        </button>

        {/* TAB 2 ICON LINK */}
        <button 
          onClick={() => { setActiveTab('cases'); setIsSchedulerActive(false); }} 
          className={`flex flex-col items-center justify-center flex-1 h-full cursor-pointer focus:outline-none transition-all active:scale-95 ${
            activeTab === 'cases' ? 'text-indigo-400 font-extrabold shadow-[inset_0_2px_10px_rgba(79,70,229,0.05)]' : 'text-white/40 hover:text-white/70'
          }`}
          id="nav-cases-btn"
        >
          <Gavel className="w-5 h-5 focus:outline-none" />
          <span className="text-[10px] mt-0.5 tracking-wider font-bold">Find Lawyer</span>
        </button>

        {/* TAB 3 ICON LINK */}
        <button 
          onClick={() => { setActiveTab('documents'); setIsSchedulerActive(false); }} 
          className={`flex flex-col items-center justify-center flex-1 h-full cursor-pointer focus:outline-none transition-all active:scale-95 ${
            activeTab === 'documents' ? 'text-indigo-400 font-extrabold shadow-[inset_0_2px_10px_rgba(79,70,229,0.05)]' : 'text-white/40 hover:text-white/70'
          }`}
          id="nav-docs-btn"
        >
          <FolderClosed className="w-5 h-5" />
          <span className="text-[10px] mt-0.5 tracking-wider font-bold">Vault</span>
        </button>

        {/* TAB 4 ICON LINK */}
        <button 
          onClick={() => { setActiveTab('profile'); setIsSchedulerActive(false); }} 
          className={`flex flex-col items-center justify-center flex-1 h-full cursor-pointer focus:outline-none transition-all active:scale-95 ${
            activeTab === 'profile' ? 'text-indigo-400 font-extrabold shadow-[inset_0_2px_10px_rgba(79,70,229,0.05)]' : 'text-white/40 hover:text-white/70'
          }`}
          id="nav-profile-btn"
        >
          <User className="w-5 h-5" />
          <span className="text-[10px] mt-0.5 tracking-wider font-bold">Profile</span>
        </button>
      </nav>

      {/* MODAL 1: NEW FOLDER CREATION */}
      <AnimatePresence>
        {showNewFolderModal && (
          <div className="fixed inset-0 bg-black/60 backdrop-blur-md flex items-center justify-center p-4 z-50">
            <motion.div 
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              className="bg-white/[0.07] backdrop-blur-3xl border border-white/15 rounded-3xl max-w-sm w-full p-6 space-y-4 shadow-2xl text-white"
              id="new-folder-dialog"
            >
              <div className="flex justify-between items-center">
                <h3 className="font-bold text-sm uppercase text-indigo-400 tracking-widest">Create New Folder</h3>
                <button onClick={() => setShowNewFolderModal(false)} className="text-white/40 hover:text-white transition-colors">
                  <X className="w-5 h-5" />
                </button>
              </div>

              <form onSubmit={handleCreateFolder} className="space-y-4">
                <div>
                  <label className="text-[10px] font-black text-white/50 uppercase tracking-widest block mb-1.5">Collection Name</label>
                  <input 
                    type="text"
                    required
                    value={newFolderName}
                    onChange={(e) => setNewFolderName(e.target.value)}
                    className="w-full bg-white/5 h-11 border border-white/10 px-3 rounded-xl text-xs outline-none focus:ring-1 focus:ring-indigo-500 text-white"
                    placeholder="e.g. Medical Records, Deposition Exhibits"
                    id="new-folder-name-val"
                  />
                </div>
                <div className="flex gap-2 justify-end pt-2">
                  <button 
                    type="button" 
                    onClick={() => setShowNewFolderModal(false)} 
                    className="px-4 py-2 border border-white/10 text-white/70 text-xs font-bold rounded-xl hover:bg-white/5 cursor-pointer"
                  >
                    Cancel
                  </button>
                  <button 
                    type="submit" 
                    className="px-5 py-2.5 bg-[#4f46e5] text-white text-xs font-black rounded-xl hover:bg-indigo-650 cursor-pointer pill-glow"
                  >
                    Create Collection
                  </button>
                </div>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* MODAL 2: DOCUMENT UPLOAD SIMULATION */}
      <AnimatePresence>
        {showUploadModal && (
          <div className="fixed inset-0 bg-black/60 backdrop-blur-md flex items-center justify-center p-4 z-50">
            <motion.div 
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              className="bg-white/[0.07] backdrop-blur-3xl border border-white/15 rounded-3xl max-w-md w-full p-6 space-y-4 shadow-2xl text-white"
              id="upload-file-dialog"
            >
              <div className="flex justify-between items-center">
                <h3 className="font-bold text-sm uppercase text-indigo-400 tracking-widest">Upload Secure Document</h3>
                <button onClick={() => setShowUploadModal(false)} className="text-white/40 hover:text-white transition-colors">
                  <X className="w-5 h-5" />
                </button>
              </div>

              {uploadProgress !== null ? (
                <div className="p-4 space-y-4 text-center">
                  <p className="text-xs font-bold text-indigo-300">Encrypting and transmitting files...</p>
                  <div className="w-full bg-white/10 h-2 rounded-full overflow-hidden">
                    <div className="bg-[#4f46e5] h-full" style={{ width: `${uploadProgress}%` }}></div>
                  </div>
                  <span className="text-[10px] font-mono text-white/50">{uploadProgress}% Securely Written</span>
                </div>
              ) : (
                <form onSubmit={handleUploadFile} className="space-y-4">
                  {/* File name */}
                  <div>
                    <label className="text-[10px] font-black text-white/50 uppercase tracking-widest block mb-1.5">File Name</label>
                    <input 
                      type="text"
                      required
                      value={uploadFileName}
                      onChange={(e) => setUploadFileName(e.target.value)}
                      className="w-full bg-white/5 h-11 border border-white/10 px-3 rounded-xl text-xs outline-none focus:ring-1 focus:ring-indigo-500 text-white"
                      placeholder="e.g. Affidavit_First_Draft.pdf"
                      id="upload-filename-val"
                    />
                  </div>

                  {/* Size and Category */}
                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="text-[10px] font-black text-white/50 uppercase tracking-widest block mb-1.5">File Size</label>
                      <input 
                        type="text"
                        value={uploadFileSize}
                        onChange={(e) => setUploadFileSize(e.target.value)}
                        className="w-full bg-[#f2f4f6]/5 h-10 border border-white/10 px-3 rounded-lg text-xs outline-none focus:ring-1 focus:ring-indigo-500 text-white"
                        placeholder="e.g. 1.8 MB"
                        id="upload-size-val"
                      />
                    </div>
                    <div>
                      <label className="text-[10px] font-black text-white/50 uppercase tracking-widest block mb-1.5">Collection Target</label>
                      <select 
                        value={uploadFolder} 
                        onChange={(e) => setUploadFolder(e.target.value)}
                        className="w-full bg-white/5 h-11 border border-white/10 px-3 rounded-xl text-xs outline-none focus:ring-1 focus:ring-indigo-500 text-white"
                        id="upload-folder-val"
                      >
                        {folders.map(f => (
                          <option key={f.id} value={f.id} className="bg-[#0c0c14] text-white">{f.name}</option>
                        ))}
                      </select>
                    </div>
                  </div>

                  {/* Encryption Notice */}
                  <div className="p-3 bg-indigo-500/10 text-indigo-200 border border-indigo-500/20 rounded-2xl flex items-start gap-2.5">
                    <Info className="w-4 h-4 shrink-0 text-indigo-400 mt-0.5" />
                    <p className="text-[10px] leading-relaxed">
                      This communication bypasses public pipelines. Files are parsed, client-encrypted, and saved directly into SOC-2 secure partner vaults.
                    </p>
                  </div>

                  {/* Form Actions */}
                  <div className="flex gap-2 justify-end pt-2">
                    <button 
                      type="button" 
                      onClick={() => setShowUploadModal(false)} 
                      className="px-4 py-2 border border-white/10 text-white/70 text-xs font-bold rounded-xl hover:bg-white/5 cursor-pointer"
                    >
                      Cancel
                    </button>
                    <button 
                      type="submit" 
                      className="px-5 py-2.5 bg-[#4f46e5] text-white text-xs font-black rounded-xl hover:bg-indigo-650 flex items-center gap-1.5 cursor-pointer pill-glow"
                    >
                      <Upload className="w-3.5 h-3.5" />
                      Upload Safe Copy
                    </button>
                  </div>
                </form>
              )}
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}

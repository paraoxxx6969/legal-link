import { Attorney, Case, DocumentFile, Folder } from './types';

export const INITIAL_ATTORNEYS: Attorney[] = [
  {
    id: 'jenkins',
    name: 'Sarah Jenkins, Esq.',
    title: 'Senior Litigation Counsel',
    rating: 4.9,
    reviewsCount: 124,
    experience: '15+ Years',
    specialty: 'Family Law',
    image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuCna91qhUc5Pyu1E3aKMpiMEThVmcam_EnU-BePIxQ4z1aANwTLia5S7-eKWw1-_lOOz71_KfoRXA2VLBNzALuXT2SMRptbTKJTcqWARm8y7aNyrul0y52a-i0HOHSEVwj4ocNqj4eMON2HnjC6Y0MqMHAVaCSUgJrnZeva-ERcqq2zVWenNf1GgkCvulWXYqTb7ZlXlw0tN_1NwO2uxw2CdTfLZ_eBlXkrofukJXm69b22AJNc5ui2cggwkFi7DKT19BK6JAGLD51x',
    bio: 'Sarah is an experienced litigator specializing in complex domestic disputes, trust resolutions, and custody agreements. Known for her analytical precision and unwavering commitment to client outcomes.',
    rate: 350,
    expertiseTags: ['Family Law', 'Estate Dispute', 'Guardianship', 'Civil Litigation'],
    cases: [
      {
        title: 'Harrison Family Trust Resolution',
        outcome: 'Settled: $4.5M',
        outcomeColor: 'green',
        description: 'Lead trial counsel representing four sibling heirs. Secured a full trust reformation and favorable distribution within six months.'
      },
      {
        title: 'Divorce Decree & Custody Dispute',
        outcome: 'Verdict: Favorable',
        outcomeColor: 'blue',
        description: 'Successfully argued for joint legal and physical custody, preserving parental visitation rights under challenging international parameters.'
      }
    ],
    endorsements: [
      {
        quote: "Sarah's focus in court is razor-sharp. She resolved our family legacy dispute with total mastery and empathy.",
        author: "Marcus T., Trustee"
      }
    ],
    affiliations: ['State Bar of California', 'American Academy of Matrimonial Lawyers', 'ABA Family Law Council'],
    online: true
  },
  {
    id: 'thorne',
    name: 'Marcus Thorne',
    title: 'Criminal Defense Attorney',
    rating: 4.8,
    reviewsCount: 89,
    experience: '8+ Years',
    specialty: 'Criminal Defense',
    image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuB4vH0_qQw7cejCSS46WmxzB63LPLy9Q51JV1CXzNXUEwLvpAmWCfvWjsti82u1swBJL3mN4l5khSOR0mjjkahsLfuNpr5Fe9FqdhSXC21wg-w1LNxO1N9SeAsz_5ael5nvWa7FQIrSPMk3wRGRzRC8UrXj1yYpYr1r7poj11IEw1dyjisL9Lnbm_n4I4HtR1GpmsNDwm-Y4dEtD-ID19ZB6lq9O0Xr4DoB42BS1Hc7ISQi8nUypM41ArUeZHsLaqaLQq5ADxZdTjLr',
    bio: 'Marcus has established a formidable track record representing individuals facing complex state and federal trials. His aggressive pursuit of constitutional violations has secured drops of major indictments.',
    rate: 275,
    expertiseTags: ['Criminal Defense', 'White Collar Crime', 'Civil Rights', 'Appeals'],
    cases: [
      {
        title: 'State v. Peterson Enterprises',
        outcome: 'Dismissed',
        outcomeColor: 'green',
        description: 'Defended senior executive in embezzlement claims. Secured dismissal after exposing illegal search and seizure procedures.'
      }
    ],
    endorsements: [
      {
        quote: "Arresting officer testimonies fell apart during Marcus's devastating cross-examinations.",
        author: "Sarah L., Corporate Client"
      }
    ],
    affiliations: ['National Association of Criminal Defense Lawyers', 'California Attorneys for Criminal Justice'],
    online: false
  },
  {
    id: 'chen',
    name: 'Dr. Robert Chen',
    title: 'Senior Corporate Partner',
    rating: 5.0,
    reviewsCount: 210,
    experience: '25+ Years',
    specialty: 'Corporate Law',
    image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuBd1TGhMOAF0Hv4m9NqEoMLgxEfTjmC8vVaXJ1VvbyGszbEZrWKKp6GCp563yNEgj46kW4H8QKpxjkLzI2YXlzD7FPyywt8g0jl-xY6QDlbjSmbRptcTRewNt5Kfurg8CUt8lUnCoFJ5te-BhRx7rTrEUeGG0herhw9CHXi8PJInjOkP-CnKFOWpXFhf7RlxIqqiwF8Mtk1pJN2QYBjY4OzmikrxDVSmSP30FZhITbqrIFAmwYALG5Y7EQSeLLLiU1UTuczgTLU3YFn',
    bio: 'Dr. Robert Chen counsels multinational entities, technology startups, and board levels on venture financing, corporate reorganization, and cross-border commercial transactions.',
    rate: 500,
    expertiseTags: ['Corporate Law', 'M&A', 'Venture Financing', 'Corporate Governance'],
    cases: [
      {
        title: 'NexaGroup acquisition of Intellectus AI',
        outcome: 'Settled: $320M',
        outcomeColor: 'blue',
        description: 'Aviation technology merger. Lead regulatory compliance counsel overseeing DOJ antitrust pre-filings and final transaction closing.'
      }
    ],
    endorsements: [
      {
        quote: "A titan in transactional law. Dr. Chen operates with deep precision that leaves absolutely zero room for ambiguity.",
        author: "Devon W., CFO NexaGroup"
      }
    ],
    affiliations: ['ABA Section of Business Law', 'International Bar Association', 'Delaware State Bar Counsel'],
    online: false
  },
  {
    id: 'varma',
    name: 'Anita Varma',
    title: 'Intellectual Property Partner',
    rating: 4.7,
    reviewsCount: 56,
    experience: '6+ Years',
    specialty: 'IP Law',
    image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuAr1MJyDpJMjkZIYSAiDJCZKW8c8-RpZbOrdxRAKNVGoXovIa7fMS5UDPRlt-RjxvVPanxCkYMuVj3cwBgRriRKEi3dzViY2ybovTrH0hMPhpqu1ydVcWw3pUAWrlNOB7Z8PzJGCN1V6_RzYCZuqoHm81y-Y1YaSSBGGAS4lAR0UQ5TgSaB8XAr5RGZGFrIclKCty9AKlGb816FQb0r1B8Mo1e9erl2ElXWk5hauBccoDoJnWvGdLCXI9j1XFxZOAAN3ETTkv9tW5Yz',
    bio: 'Anita specializes in software patent applications, tech transfer licensing, and trademark enforcement in emerging technological fields like AI/ML, cloud distributed systems, and biotechnology.',
    rate: 290,
    expertiseTags: ['IP Law', 'Patent Prosecution', 'Copyright', 'Trade Secrets'],
    cases: [
      {
        title: 'Vanguard Systems v. CloudCore Inc.',
        outcome: 'Settled: $12M',
        outcomeColor: 'green',
        description: 'Successfully prosecuted patent enforcement actions for high-density neural storage technology, culminating in structural royalty licensing.'
      }
    ],
    endorsements: [
      {
        quote: "Anita possesses absolute technical comprehension alongside sharp litigious insight.",
        author: "Ray G., Director of Engineering, CloudCore"
      }
    ],
    affiliations: ['Intellectual Property Owners Association', 'Vanderbilt Law Alum Board'],
    online: true
  },
  {
    id: 'vance',
    name: 'Eleanor Vance, JD',
    title: 'Senior Litigation Counsel',
    rating: 5.0,
    reviewsCount: 145,
    experience: '15+ Years',
    specialty: 'Intellectual Property',
    image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuCkIZ4H-2WEqUzkguy0DxEn0T1toT26rot6besPI_1GGSejXTR9RsKPzxlI_TUym6wCtgIPDS0boP-MWIA79G1zL83PRsOZCeZahPdHsnyRdWDuwaXP35cNyyiqGGNEpEs7Oi9ESa6zUXQ0LrpnL1iv5HC98JuhPlI7Ztx-yOkdjE-0tCJZ-4zP2NyFOmFZ1n_sOSPvJ3QCCEbLAMv3n2APpj1OmAsicBw_--ho5Eju7L5wc9e8nhWEn-CsFSQZvUQi1JvHwd1iUk4i',
    bio: 'Specializing in intellectual property and corporate governance with over 15 years of litigation experience. Eleanor has secured multiple multi-million dollar settlements for tech startups and Fortune 500 companies alike.',
    rate: 420,
    expertiseTags: ['Intellectual Property', 'Corporate Law', 'Civil Litigation', 'M&A'],
    cases: [
      {
        title: 'Vanguard Systems v. CloudCore',
        outcome: 'Settled: $12M',
        outcomeColor: 'green',
        description: 'Lead counsel for the defendant in a complex patent infringement suit involving distributed ledger technologies. Successfully negotiated a favorable settlement within 8 months.'
      },
      {
        title: 'State of Delaware v. Global Health Inc.',
        outcome: 'Verdict: Favorable',
        outcomeColor: 'blue',
        description: 'Strategic advisor for a multi-national merger review. Navigated regulatory hurdles and secured approval from international competition authorities.'
      },
      {
        title: 'Aperture Tech IP Defense',
        outcome: 'Dismissed',
        outcomeColor: 'green',
        description: 'Defended a Series A startup against predatory trademark litigation. Case was dismissed with prejudice in the preliminary hearing phase.'
      }
    ],
    endorsements: [
      {
        quote: "Eleanor's precision in the courtroom was unmatched. She handled our complex IP dispute with absolute clarity.",
        author: "Marcus T., CEO of VeloSoft"
      },
      {
        quote: "Professional, articulate, and incredibly responsive. She turned a terrifying legal situation into a manageable process.",
        author: "Sarah L., General Counsel"
      }
    ],
    affiliations: ['Harvard Law School (Class of 2008)', 'Vance & Associates LLP (Founding Partner)', 'ABA Member (Ethics Committee)'],
    online: true
  }
];

export const INITIAL_FOLDERS: Folder[] = [
  { id: 'filings', name: 'Court Filings', itemCount: 12, accent: 'text-primary' },
  { id: 'evidence', name: 'Evidence', itemCount: 8, accent: 'text-secondary' },
  { id: 'contracts', name: 'Contracts', itemCount: 4, accent: 'text-tertiary-container' },
  { id: 'unassigned', name: 'Other Archive', itemCount: 0, accent: 'text-outline' },
];

export const INITIAL_FILES: DocumentFile[] = [
  {
    id: 'doc-1',
    name: 'Affidavit_Signed_Final.pdf',
    size: '2.4 MB',
    uploadedDate: 'Oct 12, 2023',
    category: 'filings',
    type: 'pdf',
    sharedWith: ['Sarah Jenkins, Esq.']
  },
  {
    id: 'doc-2',
    name: 'Contract_Draft_V2.docx',
    size: '450 KB',
    uploadedDate: 'Jan 14, 2024',
    category: 'contracts',
    type: 'doc',
    sharedWith: []
  },
  {
    id: 'doc-3',
    name: 'Evidence_Photo_001.jpg',
    size: '5.1 MB',
    uploadedDate: 'Jan 12, 2024',
    category: 'evidence',
    type: 'image',
    sharedWith: ['Dr. Robert Chen']
  }
];

export const INITIAL_CASES: Case[] = [
  {
    id: 'case-1',
    title: 'Estate Dispute v. Harrison Corp',
    status: 'In Progress',
    lastUpdated: '2 hours ago',
    progress: 65,
    lawyerName: 'Sarah Jenkins, Esq.',
    iconName: 'account_balance'
  },
  {
    id: 'case-2',
    title: 'Non-Compete Review',
    status: 'Pending',
    lastUpdated: 'Yesterday',
    progress: 20,
    lawyerName: 'Eleanor Vance, JD',
    iconName: 'description'
  }
];

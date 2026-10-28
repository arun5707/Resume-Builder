import React, { useState, useMemo } from 'react';

const API_BASE = import.meta.env.VITE_API_URL || 'http://localhost:8080/api';

const ROLE_CATEGORIES = {
  'Software, Data & IT': [
    'Full Stack Developer',
    'Backend Engineer',
    'Frontend Developer',
    'Data Scientist / AI Engineer',
    'Data Analyst / BI Developer',
    'Cloud & DevOps Engineer',
    'Mobile App Developer',
    'Cybersecurity Analyst',
    'QA / Automation Test Engineer'
  ],
  'Core Engineering & Manufacturing': [
    'Mechanical Engineer',
    'Electronics & Communication (ECE / VLSI)',
    'Electrical & Automation Engineer',
    'Civil & Structural Engineer',
    'Chemical / Process Engineer',
    'Automobile / EV Engineer'
  ],
  'Business, Management & HR': [
    'Product Manager',
    'Project Manager',
    'Business Analyst',
    'Human Resources (HR) Specialist',
    'Operations & Supply Chain Manager',
    'Management Consultant'
  ],
  'Finance, Banking & Accounting': [
    'Financial Analyst',
    'Chartered Accountant / Auditor',
    'Investment Banking Analyst',
    'Tax & Compliance Consultant'
  ],
  'Marketing, Sales & Creative': [
    'Digital Marketing Specialist',
    'Sales & Business Development Manager',
    'UI/UX & Product Designer',
    'Content Strategist / Copywriter',
    'Graphic & Motion Designer'
  ],
  'Healthcare, Pharmacy & Life Sciences': [
    'Registered Nurse / Clinical Specialist',
    'Pharmacist / Clinical Research Associate',
    'Biotechnology / Lab Researcher',
    'Healthcare Administrator'
  ],
  'Education, Law & Public Sector': [
    'Teacher / Academic Professor',
    'Corporate Lawyer / Legal Advisor'
  ]
};

const ROLE_BENCHMARKS = {
  // Software, Data & IT
  'Full Stack Developer': [
    'React', 'Spring Boot', 'Java', 'JavaScript', 'TypeScript', 'MySQL',
    'REST API', 'Docker', 'Git', 'Tailwind CSS', 'Node.js', 'Microservices'
  ],
  'Backend Engineer': [
    'Java', 'Spring Boot', 'MySQL', 'PostgreSQL', 'Microservices', 'Redis',
    'Kafka', 'Docker', 'Kubernetes', 'Hibernate', 'JPA', 'AWS'
  ],
  'Frontend Developer': [
    'React', 'JavaScript', 'TypeScript', 'Tailwind CSS', 'HTML5', 'CSS3',
    'Redux', 'Next.js', 'Responsive Design', 'Figma', 'REST API', 'Vite'
  ],
  'Data Scientist / AI Engineer': [
    'Python', 'Machine Learning', 'Deep Learning', 'TensorFlow', 'PyTorch',
    'SQL', 'Pandas', 'Scikit-Learn', 'NLP', 'Computer Vision', 'Transformers'
  ],
  'Data Analyst / BI Developer': [
    'SQL', 'Power BI', 'Tableau', 'Excel', 'Python', 'Data Visualization',
    'ETL', 'Statistics', 'Data Modeling', 'Pandas', 'Dashboard', 'Reporting'
  ],
  'Cloud & DevOps Engineer': [
    'AWS', 'Docker', 'Kubernetes', 'Terraform', 'CI/CD', 'Linux',
    'Jenkins', 'GitHub Actions', 'Bash', 'Prometheus', 'Grafana'
  ],
  'Mobile App Developer': [
    'Flutter', 'Dart', 'React Native', 'Firebase', 'REST API',
    'Android', 'iOS', 'SQLite', 'Git', 'UI/UX'
  ],
  'Cybersecurity Analyst': [
    'Network Security', 'SIEM', 'Penetration Testing', 'Vulnerability Assessment',
    'Firewall', 'Incident Response', 'ISO 27001', 'Linux', 'Cryptography', 'SOC'
  ],
  'QA / Automation Test Engineer': [
    'Selenium', 'Cypress', 'JUnit', 'TestNG', 'Java', 'Python',
    'API Testing', 'Postman', 'JIRA', 'CI/CD', 'Regression Testing', 'Agile'
  ],

  // Core Engineering & Manufacturing
  'Mechanical Engineer': [
    'SolidWorks', 'AutoCAD', 'ANSYS', 'CATIA', 'Thermodynamics', 'CAD/CAM',
    'Finite Element Analysis', 'GD&T', 'Lean Manufacturing', 'Six Sigma', 'CNC', 'Product Design'
  ],
  'Electronics & Communication (ECE / VLSI)': [
    'Verilog', 'VHDL', 'Embedded C', 'Microcontrollers', 'STM32', 'ESP32',
    'PCB Design', 'MATLAB', 'FPGA', 'IoT', 'RTOS', 'Signal Processing'
  ],
  'Electrical & Automation Engineer': [
    'PLC', 'SCADA', 'MATLAB', 'Simulink', 'Power Systems', 'AutoCAD Electrical',
    'Circuit Design', 'Control Systems', 'Switchgear', 'Transformers', 'IOT', 'Safety Compliance'
  ],
  'Civil & Structural Engineer': [
    'AutoCAD', 'STAAD Pro', 'Revit', 'ETABS', 'Structural Analysis', 'Site Execution',
    'Quantity Surveying', 'Estimation', 'Concrete Technology', 'Primavera', 'BIM', 'Surveying'
  ],
  'Chemical / Process Engineer': [
    'Aspen Plus', 'Process Simulation', 'Heat Transfer', 'Mass Transfer', 'P&ID',
    'HAZOP', 'Process Safety', 'Quality Control', 'Distillation', 'Chemical Kinetics', 'ISO'
  ],
  'Automobile / EV Engineer': [
    'Battery Management System', 'Powertrain', 'SolidWorks', 'CATIA', 'CAN Protocol',
    'MATLAB', 'Vehicle Dynamics', 'Thermal Management', 'Electric Motors', 'DFMEA', 'CAD'
  ],

  // Business, Management & HR
  'Product Manager': [
    'Product Roadmap', 'Agile', 'Scrum', 'User Stories', 'KPIs', 'A/B Testing',
    'Market Research', 'JIRA', 'Stakeholder Management', 'Go-To-Market', 'Product Strategy', 'Wireframing'
  ],
  'Project Manager': [
    'Project Management', 'Agile', 'Scrum', 'PMP', 'Risk Management', 'Budgeting',
    'Stakeholder Management', 'JIRA', 'MS Project', 'Resource Allocation', 'KPIs', 'Cross-Functional'
  ],
  'Business Analyst': [
    'Requirements Gathering', 'SQL', 'Power BI', 'Tableau', 'BRD', 'Agile',
    'Process Improvement', 'Stakeholder Management', 'Data Analysis', 'JIRA', 'UAT', 'Excel'
  ],
  'Human Resources (HR) Specialist': [
    'Talent Acquisition', 'Onboarding', 'Employee Relations', 'HRIS', 'Performance Management',
    'Payroll', 'Labor Laws', 'Employer Branding', 'Compensation', 'Retention', 'Training', 'Sourcing'
  ],
  'Operations & Supply Chain Manager': [
    'Supply Chain', 'Logistics', 'Inventory Management', 'SAP', 'ERP', 'Vendor Management',
    'Lean Six Sigma', 'Procurement', 'Cost Reduction', 'Demand Forecasting', 'Warehouse', 'KPIs'
  ],
  'Management Consultant': [
    'Strategy', 'Financial Modeling', 'Market Entry', 'Business Transformation', 'Due Diligence',
    'Stakeholder Management', 'Data Analysis', 'PowerPoint', 'Excel', 'Cost Optimization', 'KPIs'
  ],

  // Finance, Banking & Accounting
  'Financial Analyst': [
    'Financial Modeling', 'Valuation', 'DCF', 'Excel', 'Forecasting', 'Budgeting',
    'Variance Analysis', 'Financial Reporting', 'P&L', 'Bloomberg', 'SQL', 'Power BI'
  ],
  'Chartered Accountant / Auditor': [
    'IFRS', 'GAAP', 'Statutory Audit', 'Internal Audit', 'Taxation', 'GST',
    'Tally', 'SAP FICO', 'Financial Statements', 'Compliance', 'Risk Assessment', 'Reconciliation'
  ],
  'Investment Banking Analyst': [
    'M&A', 'LBO', 'DCF', 'Financial Modeling', 'Valuation', 'Pitch Books',
    'Due Diligence', 'Capital Markets', 'Equity Research', 'Bloomberg', 'Excel', 'Financial Analysis'
  ],
  'Tax & Compliance Consultant': [
    'Direct Tax', 'Indirect Tax', 'GST', 'Income Tax', 'Transfer Pricing', 'Regulatory Compliance',
    'Tax Planning', 'Auditing', 'Financial Reporting', 'Tally', 'SAP', 'Litigation'
  ],

  // Marketing, Sales & Creative
  'Digital Marketing Specialist': [
    'SEO', 'SEM', 'Google Ads', 'Meta Ads', 'Google Analytics', 'Content Marketing',
    'Social Media', 'Email Marketing', 'Conversion Rate Optimization', 'ROI', 'CRM', 'Lead Generation'
  ],
  'Sales & Business Development Manager': [
    'B2B Sales', 'Lead Generation', 'CRM', 'Salesforce', 'HubSpot', 'Cold Outreach',
    'Negotiation', 'Account Management', 'Revenue Growth', 'Pipeline Management', 'Client Retention', 'Quota'
  ],
  'UI/UX & Product Designer': [
    'Figma', 'Wireframing', 'Prototyping', 'User Research', 'Usability Testing', 'Design Systems',
    'Interaction Design', 'Information Architecture', 'Adobe XD', 'Accessibility', 'User Flows', 'Responsive'
  ],
  'Content Strategist / Copywriter': [
    'Copywriting', 'Content Strategy', 'SEO', 'Brand Voice', 'Editorial Calendar', 'Storytelling',
    'CMS', 'WordPress', 'Proofreading', 'Audience Engagement', 'Social Media', 'Analytics'
  ],
  'Graphic & Motion Designer': [
    'Adobe Photoshop', 'Illustrator', 'After Effects', 'Premiere Pro', 'InDesign', 'Typography',
    'Brand Identity', 'Visual Design', 'Motion Graphics', 'Figma', 'Layout', 'Color Theory'
  ],

  // Healthcare, Pharmacy & Life Sciences
  'Registered Nurse / Clinical Specialist': [
    'Patient Care', 'Triage', 'EMR', 'Vital Signs', 'Medication Administration', 'BLS',
    'ACLS', 'Infection Control', 'Clinical Assessment', 'Care Planning', 'HIPAA', 'Emergency Care'
  ],
  'Pharmacist / Clinical Research Associate': [
    'Pharmacology', 'Clinical Trials', 'Good Clinical Practice', 'Drug Safety', 'Pharmacovigilance',
    'FDA Regulations', 'Dispensing', 'Patient Counseling', 'ICH-GCP', 'Protocol Compliance', 'SOP'
  ],
  'Biotechnology / Lab Researcher': [
    'PCR', 'Cell Culture', 'ELISA', 'Chromatography', 'HPLC', 'Spectroscopy',
    'Molecular Biology', 'GLP', 'GMP', 'Data Analysis', 'Assay Development', 'SOP'
  ],
  'Healthcare Administrator': [
    'Healthcare Management', 'EMR', 'EHR', 'HIPAA', 'Patient Operations', 'Medical Billing',
    'Quality Assurance', 'Regulatory Compliance', 'Budgeting', 'Staff Scheduling', 'Hospital Operations'
  ],

  // Education, Law & Public Sector
  'Teacher / Academic Professor': [
    'Curriculum Development', 'Lesson Planning', 'Classroom Management', 'Student Assessment',
    'Pedagogy', 'E-Learning', 'LMS', 'Mentoring', 'Academic Research', 'Differentiated Instruction'
  ],
  'Corporate Lawyer / Legal Advisor': [
    'Contract Drafting', 'Corporate Law', 'Mergers & Acquisitions', 'Due Diligence', 'Legal Research',
    'Compliance', 'Intellectual Property', 'Arbitration', 'Litigation', 'Risk Mitigation', 'Negotiation'
  ]
};

const ACTION_VERBS = [
  'engineered', 'architected', 'developed', 'optimized', 'built',
  'deployed', 'automated', 'reduced', 'scaled', 'implemented', 'designed', 'led',
  'managed', 'spearheaded', 'increased', 'streamlined', 'audited', 'negotiated',
  'researched', 'diagnosed', 'formulated', 'supervised', 'executed', 'accelerated'
];

const INITIAL_RESUME = {
  id: 1,
  title: 'Fresher Full Stack Engineer Resume',
  targetRole: 'Full Stack Developer',
  templateId: 'modern',
  isFresher: true,
  fullName: 'Arun Karthikeyan',
  email: 'arun.k@domain.com',
  phone: '+91 98765 43210',
  location: 'Tamil Nadu, India',
  linkedin: 'linkedin.com/in/arunkarthikeyan',
  github: 'github.com/arunkarthikeyan',
  summary:
    'Detail-oriented Computer Science Engineering student with strong foundations in Full Stack Development (React, Spring Boot, MySQL), REST APIs, and Docker. Proven track record in building real-time AI and cloud-native academic projects.',
  skills: 'Java, Spring Boot, React, JavaScript, MySQL, REST API, Docker, Git, Tailwind CSS, Node.js, Microservices',
  experience: [],
  projects: [
    {
      name: 'TravelTrek & Document Sharing Platform',
      tech: 'Spring Boot, React, MySQL, Docker',
      link: 'github.com/arun/traveltrek',
      description: 'Architected a full-stack platform with Spring Security, OpenAPI documentation, and automated database seeding handling 1,000+ concurrent requests.'
    },
    {
      name: 'Acoustic Guardian AI Mobile App',
      tech: 'Flutter, TensorFlow Lite, Python',
      link: 'github.com/arun/acoustic-guardian',
      description: 'Developed a real-time edge-AI audio anomaly detection app achieving 94% inference accuracy.'
    }
  ],
  education: [
    {
      level: 'College / University',
      degree: 'B.E. / B.Tech in Computer Science & Engineering',
      institution: 'Sri Krishna College of Engineering and Technology',
      year: '2024 – 2028',
      score: 'CGPA: 8.9 / 10'
    },
    {
      level: 'HSC (Class 12)',
      degree: 'Higher Secondary (Computer Science & Maths)',
      institution: 'The Vijay Millennium Senior Secondary School',
      year: '2024',
      score: 'Marks: 94.6%'
    },
    {
      level: 'SSLC (Class 10)',
      degree: 'Secondary School Leaving Certificate (CBSE)',
      institution: 'The Vijay Millennium Senior Secondary School',
      year: '2022',
      score: 'Marks: 95.2%'
    }
  ],
  certifications: [
    {
      name: 'AWS Cloud Technical Essentials',
      issuer: 'Amazon Web Services (Coursera)',
      year: '2026'
    },
    {
      name: 'Full Stack Java & Spring Boot Development',
      issuer: 'Udemy / NPTEL',
      year: '2025'
    }
  ],
  achievements: [
    {
      title: 'Smart India Hackathon / College Ideathon Finalist',
      description: 'Engineered an AI-driven prototype and ranked in the top 5% among 150+ competing teams.'
    },
    {
      title: 'Academic Merit & Coding Excellence',
      description: 'Solved 250+ data structures and algorithms problems across competitive coding platforms.'
    }
  ]
};

export default function App() {
  const [user, setUser] = useState(null);
  const [authMode, setAuthMode] = useState('login');
  const [authForm, setAuthForm] = useState({ fullName: '', email: '', password: '' });
  const [view, setView] = useState('login'); // 'login' | 'dashboard' | 'builder'
  const [activeTab, setActiveTab] = useState('personal'); // 'personal' | 'experience' | 'projects' | 'education' | 'certifications' | 'ats'

  const [resumes, setResumes] = useState([INITIAL_RESUME]);
  const [currentResume, setCurrentResume] = useState(INITIAL_RESUME);
  const [customKeywordsInput, setCustomKeywordsInput] = useState('');
  const [saveMessage, setSaveMessage] = useState('');

  // Universal Multi-Industry Ace Score Evaluator (Adapts to Fresher vs Experienced)
  const aceEvaluation = useMemo(() => {
    const role = currentResume.targetRole || 'Full Stack Developer';
    const isFresherMode = Boolean(currentResume.isFresher);

    let expectedKeywords = ROLE_BENCHMARKS[role];
    if (!expectedKeywords) {
      const customList = customKeywordsInput
        .split(',')
        .map(s => s.trim())
        .filter(Boolean);
      const roleWords = role
        .split(/[\s/&,-]+/)
        .map(w => w.trim())
        .filter(w => w.length > 2);
      expectedKeywords = customList.length > 0
        ? customList
        : [...new Set([...roleWords, 'Project Management', 'Leadership', 'Analysis', 'Communication', 'Problem Solving', 'Operations', 'Strategy', 'Quality'])];
    }

    const expText = (currentResume.experience || []).map(e => `${e.role} ${e.company} ${e.points}`).join(' ');
    const projText = (currentResume.projects || []).map(p => `${p.name} ${p.tech} ${p.description}`).join(' ');
    const eduText = (currentResume.education || []).map(ed => `${ed.degree} ${ed.institution} ${ed.score}`).join(' ');
    const certText = (currentResume.certifications || []).map(c => `${c.name} ${c.issuer}`).join(' ');
    const achText = (currentResume.achievements || []).map(a => `${a.title} ${a.description}`).join(' ');
    const combinedText = `${currentResume.summary} ${currentResume.skills} ${expText} ${projText} ${eduText} ${certText} ${achText}`.toLowerCase();

    const matched = [];
    const missing = [];
    expectedKeywords.forEach(kw => {
      if (combinedText.includes(kw.toLowerCase())) {
        matched.push(kw);
      } else {
        missing.push(kw);
      }
    });

    const keywordScore = expectedKeywords.length > 0
      ? Math.round((matched.length / expectedKeywords.length) * 55)
      : 40;

    let verbCount = 0;
    ACTION_VERBS.forEach(v => {
      if (combinedText.includes(v)) verbCount++;
    });
    const hasNumbers = /(\d+%|\d+x|\d+\+|\$\d+|₹\d+|cgpa)/i.test(combinedText);
    const impactScore = Math.min(15, verbCount * 3) + (hasNumbers ? 10 : 0);

    // Section Depth (20 points): Fresher mode does NOT penalize for 0 Work Experience
    let completeness = 0;
    if ((currentResume.summary || '').length > 40) completeness += 5;
    if ((currentResume.skills || '').split(',').filter(Boolean).length >= 5) completeness += 5;

    if (isFresherMode) {
      if ((currentResume.education || []).length > 0) completeness += 5;
      if ((currentResume.projects || []).length > 0 || (currentResume.certifications || []).length > 0) completeness += 5;
    } else {
      if ((currentResume.experience || []).length > 0) completeness += 5;
      if ((currentResume.projects || []).length > 0 || (currentResume.education || []).length > 0) completeness += 5;
    }

    const totalScore = Math.min(100, keywordScore + impactScore + completeness);

    let verdict = 'Low Ace Score — Needs Role Keywords';
    let badgeColor = 'text-red-400 bg-red-500/10 border-red-500/30';
    let worthIt = false;

    if (totalScore >= 80) {
      verdict = isFresherMode
        ? `Top Fresher Match for ${role}`
        : `Highly Worthy for ${role}`;
      badgeColor = 'text-emerald-400 bg-emerald-500/10 border-emerald-500/30';
      worthIt = true;
    } else if (totalScore >= 65) {
      verdict = `Worth Applying for ${role}`;
      badgeColor = 'text-amber-400 bg-amber-500/10 border-amber-500/30';
      worthIt = true;
    } else if (totalScore >= 45) {
      verdict = `Borderline — Add Role Keywords`;
      badgeColor = 'text-orange-400 bg-orange-500/10 border-orange-500/30';
    }

    return {
      score: totalScore,
      keywordScore,
      impactScore,
      completeness,
      verdict,
      badgeColor,
      worthIt,
      matched,
      missing,
      hasNumbers,
      verbCount
    };
  }, [currentResume, customKeywordsInput]);

  // Handle Login / Registration
  const handleAuthSubmit = async (e) => {
    e.preventDefault();
    try {
      const endpoint = authMode === 'login' ? '/auth/login' : '/auth/register';
      const res = await fetch(`${API_BASE}${endpoint}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(authForm)
      });
      if (res.ok) {
        const loggedUser = await res.json();
        setUser(loggedUser);
        setView('dashboard');
        return;
      }
    } catch {
      // Fallback to instant interactive session if Spring Boot isn't running yet
    }
    setUser({
      id: 1,
      fullName: authForm.fullName || authForm.email.split('@')[0] || 'Arun Karthikeyan',
      email: authForm.email || 'arun.k@domain.com'
    });
    setView('dashboard');
  };

  // Save Resume to MySQL via Spring Boot + Local State
  const handleSaveResume = async () => {
    const updatedResume = {
      ...currentResume,
      atsScore: aceEvaluation.score,
      worthinessVerdict: aceEvaluation.verdict
    };

    try {
      await fetch(`${API_BASE}/resumes`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...updatedResume,
          userId: user?.id || 1,
          experienceJson: JSON.stringify(updatedResume.experience),
          projectsJson: JSON.stringify({
            projects: updatedResume.projects,
            certifications: updatedResume.certifications,
            achievements: updatedResume.achievements,
            isFresher: updatedResume.isFresher
          }),
          educationJson: JSON.stringify(updatedResume.education)
        })
      });
    } catch {
      // Local state update fallback
    }

    setResumes(prev => {
      const exists = prev.some(r => r.id === updatedResume.id);
      return exists ? prev.map(r => (r.id === updatedResume.id ? updatedResume : r)) : [updatedResume, ...prev];
    });

    setSaveMessage('Resume saved & Ace Score updated!');
    setTimeout(() => setSaveMessage(''), 3000);
  };

  // Create New Resume (Fresher or Experienced)
  const handleCreateNew = (fresherPreset = true) => {
    const newResume = {
      ...INITIAL_RESUME,
      id: Date.now(),
      isFresher: fresherPreset,
      title: fresherPreset ? 'Fresher / Student Role Resume' : 'Experienced Professional Resume',
      targetRole: 'Full Stack Developer',
      summary: fresherPreset
        ? 'Enthusiastic and detail-oriented final-year graduate with strong foundations in software engineering, problem solving, and full-stack project development. Eager to contribute to high-impact engineering teams.'
        : 'Results-driven professional with proven experience designing, building, and scaling enterprise systems and delivering measurable business impact.',
      experience: fresherPreset
        ? []
        : [
            {
              role: 'Software Engineer',
              company: 'TechNova Solutions',
              duration: '2024 – Present',
              points: 'Engineered scalable microservices and optimized database queries, reducing latency by 35%.'
            }
          ]
    };
    setCurrentResume(newResume);
    setActiveTab(fresherPreset ? 'education' : 'personal');
    setView('builder');
  };

  // One-click Add Missing Keyword to Resume Skills
  const addMissingSkill = (skill) => {
    const currentSkills = currentResume.skills
      ? currentResume.skills.split(',').map(s => s.trim()).filter(Boolean)
      : [];
    if (!currentSkills.includes(skill)) {
      setCurrentResume({
        ...currentResume,
        skills: [...currentSkills, skill].join(', ')
      });
    }
  };

  // ============================================================================
  // VIEW 1: ACE RESUMES LOGIN PAGE (Larger Fonts + Resume Building Animation)
  // ============================================================================
  if (view === 'login') {
    return (
      <div className="relative min-h-screen w-full bg-[#070709] text-white flex items-center justify-between overflow-hidden font-sans select-none">
        {/* Radial Metallic Spotlight Effects */}
        <div className="absolute -top-40 -right-40 w-[720px] h-[720px] bg-white/[0.05] rounded-full blur-[140px] pointer-events-none" />
        <div className="absolute bottom-[-20%] right-[12%] w-[520px] h-[520px] bg-[#ff5a1f]/[0.08] rounded-full blur-[150px] pointer-events-none" />

        <div className="container mx-auto px-8 lg:px-20 z-10 grid grid-cols-1 lg:grid-cols-12 gap-12 items-center min-h-screen">
          
          {/* Left Column: Larger Typography & Auth Card */}
          <div className="lg:col-span-6 flex flex-col justify-center space-y-8 max-w-xl py-12">
            <div className="space-y-5">
              <div className="inline-flex items-center space-x-2.5 px-4 py-1.5 rounded-full bg-white/[0.06] border border-white/15 text-sm font-medium text-zinc-200">
                <span className="w-2.5 h-2.5 rounded-full bg-[#ff5a1f] animate-pulse" />
                <span>Ace Resumes • Universal Ace Score Engine</span>
              </div>

              <h1 className="text-5xl sm:text-6xl lg:text-7xl font-extrabold tracking-tight leading-[1.06] bg-gradient-to-br from-white via-zinc-100 to-zinc-400 bg-clip-text text-transparent">
                Build the resume that opens new doors.
              </h1>

              <p className="text-zinc-300 text-lg sm:text-xl leading-relaxed">
                Craft industry-ready resumes for <strong className="text-white">Freshers & Experienced</strong> professionals across 30+ career fields and check your <strong className="text-white">Ace Score</strong> instantly.
              </p>
            </div>

            <form onSubmit={handleAuthSubmit} className="space-y-5 bg-[#111115]/90 p-7 rounded-2xl border border-white/10 shadow-2xl backdrop-blur-xl max-w-lg">
              <div className="flex border-b border-white/10 pb-3 mb-2">
                <button
                  type="button"
                  onClick={() => setAuthMode('login')}
                  className={`flex-1 text-base font-semibold pb-1.5 transition cursor-pointer ${
                    authMode === 'login' ? 'text-[#ff5a1f] border-b-2 border-[#ff5a1f]' : 'text-zinc-400'
                  }`}
                >
                  Sign In
                </button>
                <button
                  type="button"
                  onClick={() => setAuthMode('register')}
                  className={`flex-1 text-base font-semibold pb-1.5 transition cursor-pointer ${
                    authMode === 'register' ? 'text-[#ff5a1f] border-b-2 border-[#ff5a1f]' : 'text-zinc-400'
                  }`}
                >
                  Create Account
                </button>
              </div>

              {authMode === 'register' && (
                <div>
                  <label className="block text-sm font-semibold text-zinc-300 mb-1.5 uppercase tracking-wider">Full Name</label>
                  <input
                    type="text"
                    required
                    value={authForm.fullName}
                    onChange={(e) => setAuthForm({ ...authForm, fullName: e.target.value })}
                    placeholder="Arun Karthikeyan"
                    className="w-full px-4 py-3 text-base rounded-lg bg-[#18181c] border border-white/10 text-white placeholder-zinc-600 focus:outline-none focus:border-[#ff5a1f]"
                  />
                </div>
              )}

              <div>
                <label className="block text-sm font-semibold text-zinc-300 mb-1.5 uppercase tracking-wider">Email Address</label>
                <input
                  type="email"
                  required
                  value={authForm.email}
                  onChange={(e) => setAuthForm({ ...authForm, email: e.target.value })}
                  placeholder="you@domain.com"
                  className="w-full px-4 py-3 text-base rounded-lg bg-[#18181c] border border-white/10 text-white placeholder-zinc-600 focus:outline-none focus:border-[#ff5a1f]"
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-zinc-300 mb-1.5 uppercase tracking-wider">Password</label>
                <input
                  type="password"
                  required
                  value={authForm.password}
                  onChange={(e) => setAuthForm({ ...authForm, password: e.target.value })}
                  placeholder="••••••••"
                  className="w-full px-4 py-3 text-base rounded-lg bg-[#18181c] border border-white/10 text-white placeholder-zinc-600 focus:outline-none focus:border-[#ff5a1f]"
                />
              </div>

              <div className="pt-2 flex flex-col sm:flex-row gap-3">
                <button
                  type="submit"
                  className="flex-1 py-3.5 px-6 rounded-lg bg-[#ff5a1f] hover:bg-[#e04812] text-white font-bold text-base shadow-[0_0_25px_rgba(255,90,31,0.4)] transition cursor-pointer"
                >
                  {authMode === 'login' ? 'Get Started' : 'Create Account'}
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setUser({ id: 1, fullName: 'Arun Karthikeyan', email: 'arun.k@domain.com' });
                    setView('dashboard');
                  }}
                  className="py-3.5 px-6 rounded-lg bg-white/[0.06] hover:bg-white/[0.12] border border-white/10 text-zinc-200 font-semibold text-base transition cursor-pointer"
                >
                  Instant Demo
                </button>
              </div>
            </form>
          </div>

          {/* Right Column: 3D Isometric Resume-Building & Ace Score Scanner Animation */}
          <div className="lg:col-span-6 relative h-[560px] flex items-center justify-center">
            <style>{`
              @keyframes floatResumeSheet {
                0%, 100% {
                  transform: translate3d(0px, 0px, 55px) rotateY(-8deg) rotateX(6deg);
                }
                50% {
                  transform: translate3d(0px, -18px, 85px) rotateY(4deg) rotateX(2deg);
                }
              }
              @keyframes laserScan {
                0%, 100% { top: 6%; opacity: 0.2; }
                50% { top: 90%; opacity: 1; }
              }
              @keyframes popInLeft {
                0%, 100% { transform: translate3d(-35px, 10px, 95px); }
                50% { transform: translate3d(-15px, -8px, 125px); }
              }
              @keyframes popInRight {
                0%, 100% { transform: translate3d(30px, -10px, 110px); }
                50% { transform: translate3d(12px, 8px, 140px); }
              }
              @keyframes barFill {
                0%, 20% { width: 30%; }
                60%, 100% { width: 98%; }
              }
              .iso-resume-stage {
                transform: rotateX(54deg) rotateZ(-32deg);
                transform-style: preserve-3d;
              }
              .resume-card-3d {
                animation: floatResumeSheet 5s ease-in-out infinite;
                transform-style: preserve-3d;
              }
              .laser-line {
                animation: laserScan 3.6s ease-in-out infinite;
              }
              .floating-pill-left {
                animation: popInLeft 4.5s ease-in-out infinite;
              }
              .floating-pill-right {
                animation: popInRight 4.5s ease-in-out infinite;
              }
              .ace-bar-fill {
                animation: barFill 3.6s ease-in-out infinite alternate;
              }
            `}</style>

            <div className="iso-resume-stage relative w-[440px] h-[440px]">
              {/* Step 1: Lower Brushed Metal Pedestal */}
              <div className="absolute bottom-6 left-4 w-44 h-44 bg-gradient-to-br from-zinc-700/70 via-zinc-900 to-black border border-white/15 rounded-xl shadow-2xl" />

              {/* Step 2: Middle Illuminated Platform */}
              <div
                className="absolute bottom-28 left-28 w-48 h-48 bg-gradient-to-br from-zinc-500/80 via-zinc-800 to-zinc-950 border-2 border-[#ff5a1f]/50 rounded-xl shadow-[0_25px_60px_rgba(0,0,0,0.95)]"
                style={{ transform: 'translateZ(35px)' }}
              />

              {/* Step 3: Top Metallic Pedestal */}
              <div
                className="absolute bottom-52 left-52 w-48 h-48 bg-gradient-to-tr from-zinc-950 via-zinc-700 to-zinc-300 border border-white/30 rounded-xl shadow-[0_40px_80px_rgba(0,0,0,0.98)]"
                style={{ transform: 'translateZ(75px)' }}
              />

              {/* Main 3D Assembling Resume Document */}
              <div className="resume-card-3d absolute bottom-16 left-16 w-72 h-96 rounded-2xl bg-gradient-to-br from-zinc-200 via-zinc-400 to-zinc-800 p-[2px] shadow-[-25px_35px_65px_rgba(0,0,0,0.95)]">
                <div className="relative w-full h-full bg-[#101014]/95 rounded-2xl p-6 flex flex-col justify-between overflow-hidden border border-white/20">
                  
                  {/* Animated Orange Laser Scanner */}
                  <div className="laser-line absolute left-0 right-0 h-[3px] bg-gradient-to-r from-transparent via-[#ff5a1f] to-transparent shadow-[0_0_20px_#ff5a1f] z-20 pointer-events-none" />

                  {/* Resume Profile Header Block */}
                  <div className="flex items-center space-x-3.5 border-b border-white/10 pb-4">
                    <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-[#ff5a1f] to-orange-700 flex items-center justify-center font-extrabold text-lg text-white shadow-[0_0_15px_rgba(255,90,31,0.5)]">
                      AR
                    </div>
                    <div className="space-y-2 flex-1">
                      <div className="w-32 h-3 bg-white rounded-full" />
                      <div className="w-24 h-2 bg-[#ff5a1f] rounded-full" />
                    </div>
                  </div>

                  {/* Resume Experience & Project Lines Assembling */}
                  <div className="space-y-3 my-auto py-3">
                    <div className="text-[10px] font-bold uppercase tracking-widest text-zinc-400">Education & Projects</div>
                    <div className="w-full h-2.5 bg-white/20 rounded-full" />
                    <div className="w-5/6 h-2.5 bg-white/15 rounded-full" />
                    <div className="w-4/6 h-2.5 bg-white/10 rounded-full" />

                    <div className="pt-2 text-[10px] font-bold uppercase tracking-widest text-zinc-400">Multi-Role Skills</div>
                    <div className="flex flex-wrap gap-1.5">
                      <span className="px-2 py-0.5 text-[10px] font-semibold rounded bg-[#ff5a1f]/20 text-[#ff5a1f] border border-[#ff5a1f]/40">Fresher Ready</span>
                      <span className="px-2 py-0.5 text-[10px] font-semibold rounded bg-white/10 text-zinc-200">Engineering</span>
                      <span className="px-2 py-0.5 text-[10px] font-semibold rounded bg-white/10 text-zinc-200">Management</span>
                      <span className="px-2 py-0.5 text-[10px] font-semibold rounded bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">Ace Score 98%</span>
                    </div>
                  </div>

                  {/* Animated Ace Score Bar at Bottom of 3D Resume */}
                  <div className="bg-white/[0.04] p-3 rounded-xl border border-white/10 space-y-1.5">
                    <div className="flex justify-between items-center text-xs">
                      <span className="text-zinc-300 font-semibold">Ace Score</span>
                      <span className="text-emerald-400 font-extrabold">98% Match</span>
                    </div>
                    <div className="w-full h-2 bg-white/10 rounded-full overflow-hidden">
                      <div className="ace-bar-fill h-full bg-gradient-to-r from-[#ff5a1f] to-emerald-400 rounded-full" />
                    </div>
                  </div>
                </div>
              </div>

              {/* Floating 3D Snap-In Module 1: Certified Badge */}
              <div className="floating-pill-left absolute top-14 left-2 bg-[#16161d]/95 border border-emerald-400/40 px-4 py-2.5 rounded-xl shadow-2xl flex items-center space-x-2.5">
                <span className="w-3 h-3 rounded-full bg-emerald-400 animate-ping" />
                <span className="text-xs font-bold text-emerald-300">✓ Ace Score Verified</span>
              </div>

              {/* Floating 3D Snap-In Module 2: Template Badge */}
              <div className="floating-pill-right absolute bottom-12 right-0 bg-[#16161d]/95 border border-[#ff5a1f]/50 px-4 py-2.5 rounded-xl shadow-2xl flex items-center space-x-2">
                <span className="text-xs font-bold text-[#ff5a1f]">★ Fresher & Pro Modes</span>
              </div>
            </div>
          </div>

        </div>
      </div>
    );
  }

  // ============================================================================
  // VIEW 2: USER DASHBOARD (Manage, Create Fresher or Experienced Resume)
  // ============================================================================
  if (view === 'dashboard') {
    return (
      <div className="min-h-screen bg-[#09090c] text-white font-sans">
        {/* Top Navbar */}
        <header className="border-b border-white/10 bg-[#101014]/80 backdrop-blur-md sticky top-0 z-30">
          <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="w-8 h-8 rounded-lg bg-[#ff5a1f] flex items-center justify-center font-bold text-white shadow-[0_0_15px_#ff5a1f]">
                A
              </div>
              <span className="font-bold text-lg tracking-tight">Ace Resumes</span>
            </div>
            <div className="flex items-center space-x-4">
              <span className="text-sm text-zinc-400">Welcome, <strong className="text-white">{user?.fullName}</strong></span>
              <button
                onClick={() => setView('login')}
                className="text-xs px-3 py-1.5 rounded-md bg-white/5 hover:bg-white/10 border border-white/10 text-zinc-300 cursor-pointer"
              >
                Sign Out
              </button>
            </div>
          </div>
        </header>

        <main className="max-w-7xl mx-auto px-6 py-10">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
            <div>
              <h2 className="text-2xl font-bold">Your Role-Tailored Resumes</h2>
              <p className="text-zinc-400 text-sm">Create a Student/Fresher or Experienced resume, check your Ace Score, or export to PDF.</p>
            </div>
            <div className="flex flex-wrap gap-3">
              <button
                onClick={() => handleCreateNew(true)}
                className="px-5 py-2.5 rounded-lg bg-[#ff5a1f] hover:bg-[#e04812] text-white font-semibold text-sm shadow-[0_0_20px_rgba(255,90,31,0.35)] transition cursor-pointer"
              >
                🎓 + Create Fresher / Student Resume
              </button>
              <button
                onClick={() => handleCreateNew(false)}
                className="px-5 py-2.5 rounded-lg bg-white/10 hover:bg-white/15 border border-white/15 text-white font-medium text-sm transition cursor-pointer"
              >
                💼 + Create Experienced Resume
              </button>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {resumes.map((resItem) => (
              <div
                key={resItem.id}
                className="bg-[#121217] border border-white/10 rounded-2xl p-6 flex flex-col justify-between hover:border-[#ff5a1f]/50 transition group"
              >
                <div>
                  <div className="flex items-center justify-between mb-3">
                    <div className="flex items-center gap-1.5">
                      <span className="text-xs uppercase tracking-wider px-2.5 py-1 rounded-full bg-white/5 text-zinc-300 border border-white/10">
                        {resItem.templateId}
                      </span>
                      <span className="text-[11px] font-semibold px-2.5 py-1 rounded-full bg-[#ff5a1f]/15 text-[#ff5a1f] border border-[#ff5a1f]/30">
                        {resItem.isFresher ? '🎓 Fresher' : '💼 Pro'}
                      </span>
                    </div>
                    <span className="text-xs font-bold px-2.5 py-1 rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                      Ace Score: {resItem.atsScore || aceEvaluation.score}%
                    </span>
                  </div>

                  <h3 className="text-lg font-bold text-white group-hover:text-[#ff5a1f] transition">
                    {resItem.title}
                  </h3>
                  <p className="text-xs text-zinc-400 mt-1">
                    Target Role: <strong className="text-zinc-200">{resItem.targetRole}</strong>
                  </p>
                  <p className="text-xs text-zinc-500 mt-3 line-clamp-2">{resItem.summary}</p>
                </div>

                <div className="pt-6 mt-6 border-t border-white/10 flex items-center gap-2">
                  <button
                    onClick={() => {
                      setCurrentResume(resItem);
                      setView('builder');
                    }}
                    className="flex-1 py-2 px-3 rounded-lg bg-[#ff5a1f] hover:bg-[#e04812] text-white text-xs font-semibold transition cursor-pointer"
                  >
                    Edit & Check Ace Score
                  </button>
                  <button
                    onClick={() => {
                      setCurrentResume(resItem);
                      setView('builder');
                      setTimeout(() => window.print(), 300);
                    }}
                    className="py-2 px-3 rounded-lg bg-white/5 hover:bg-white/10 border border-white/10 text-zinc-200 text-xs font-medium transition cursor-pointer"
                  >
                    PDF
                  </button>
                  {resumes.length > 1 && (
                    <button
                      onClick={() => setResumes(resumes.filter(r => r.id !== resItem.id))}
                      className="py-2 px-3 rounded-lg bg-red-500/10 hover:bg-red-500/20 text-red-400 text-xs font-medium transition cursor-pointer"
                    >
                      Delete
                    </button>
                  )}
                </div>
              </div>
            ))}
          </div>
        </main>
      </div>
    );
  }

  // ============================================================================
  // VIEW 3: LIVE RESUME BUILDER, FRESHER MODE TOGGLE & ACE SCORE CHECKER
  // ============================================================================

  // Reusable Section Renderers so Fresher Mode can automatically swap section order
  const renderEducationSection = () =>
    currentResume.education?.length > 0 && (
      <section className="mb-5">
        <h2
          className={`text-xs font-bold uppercase tracking-wider mb-2.5 ${
            currentResume.templateId === 'modern'
              ? 'text-[#ff5a1f]'
              : 'text-zinc-800 border-b border-zinc-300 pb-1'
          }`}
        >
          Education & Academic Credentials
        </h2>
        <div className="space-y-3">
          {currentResume.education.map((edu, idx) => (
            <div key={idx} className="flex justify-between items-baseline">
              <div>
                <div className="flex items-center gap-2">
                  <h3 className="text-sm font-bold text-zinc-900">{edu.degree}</h3>
                  {edu.level && (
                    <span className="text-[10px] font-semibold px-1.5 py-0.5 rounded bg-zinc-100 text-zinc-600 border border-zinc-200">
                      {edu.level}
                    </span>
                  )}
                </div>
                <p className="text-xs text-zinc-600 mt-0.5">{edu.institution}</p>
              </div>
              <div className="text-right">
                <span className="text-xs font-bold text-zinc-900 block">{edu.score}</span>
                <span className="text-xs text-zinc-500">{edu.year}</span>
              </div>
            </div>
          ))}
        </div>
      </section>
    );

  const renderProjectsSection = () =>
    currentResume.projects?.length > 0 && (
      <section className="mb-5">
        <h2
          className={`text-xs font-bold uppercase tracking-wider mb-2.5 ${
            currentResume.templateId === 'modern'
              ? 'text-[#ff5a1f]'
              : 'text-zinc-800 border-b border-zinc-300 pb-1'
          }`}
        >
          {currentResume.isFresher ? 'Academic & Personal Projects' : 'Key Projects & Case Studies'}
        </h2>
        <div className="space-y-3">
          {currentResume.projects.map((proj, idx) => (
            <div key={idx}>
              <div className="flex justify-between items-baseline">
                <h3 className="text-sm font-bold text-zinc-900">{proj.name}</h3>
                <span className="text-xs font-semibold text-zinc-600">{proj.tech}</span>
              </div>
              <p className="text-xs text-zinc-700 mt-1 leading-relaxed">{proj.description}</p>
            </div>
          ))}
        </div>
      </section>
    );

  const renderExperienceSection = () =>
    currentResume.experience?.length > 0 && (
      <section className="mb-5">
        <h2
          className={`text-xs font-bold uppercase tracking-wider mb-2.5 ${
            currentResume.templateId === 'modern'
              ? 'text-[#ff5a1f]'
              : 'text-zinc-800 border-b border-zinc-300 pb-1'
          }`}
        >
          {currentResume.isFresher ? 'Internships & Industrial Training' : 'Work Experience'}
        </h2>
        <div className="space-y-3.5">
          {currentResume.experience.map((exp, idx) => (
            <div key={idx}>
              <div className="flex justify-between items-baseline">
                <h3 className="text-sm font-bold text-zinc-900">
                  {exp.role} <span className="font-normal text-zinc-600">— {exp.company}</span>
                </h3>
                <span className="text-xs text-zinc-500 font-medium">{exp.duration}</span>
              </div>
              <p className="text-xs text-zinc-700 mt-1 whitespace-pre-line leading-relaxed">
                {exp.points}
              </p>
            </div>
          ))}
        </div>
      </section>
    );

  return (
    <div className="min-h-screen bg-[#09090c] text-white font-sans">
      {/* Print Stylesheet: Removes Browser Date/Title/URL/Page-Number Headers & Footers */}
      <style>{`
        @media print {
          @page {
            size: A4;
            margin: 0mm !important;
          }
          html, body {
            margin: 0 !important;
            padding: 0 !important;
            background: #ffffff !important;
            -webkit-print-color-adjust: exact !important;
            print-color-adjust: exact !important;
          }
          body * {
            visibility: hidden;
          }
          #printable-resume, #printable-resume * {
            visibility: visible;
          }
          #printable-resume {
            position: absolute;
            left: 0;
            top: 0;
            width: 100%;
            max-width: 100% !important;
            padding: 15mm 18mm !important;
            box-shadow: none !important;
            margin: 0 !important;
          }
          .no-print {
            display: none !important;
          }
        }
      `}</style>

      {/* Top Builder Bar */}
      <header className="no-print border-b border-white/10 bg-[#101014] sticky top-0 z-30">
        <div className="max-w-[1600px] mx-auto px-6 py-3 flex flex-wrap items-center justify-between gap-4">
          <div className="flex items-center space-x-3">
            <button
              onClick={() => setView('dashboard')}
              className="text-xs px-3 py-1.5 rounded-lg bg-white/5 hover:bg-white/10 border border-white/10 text-zinc-300 cursor-pointer"
            >
              ← Dashboard
            </button>
            <input
              type="text"
              value={currentResume.title}
              onChange={(e) => setCurrentResume({ ...currentResume, title: e.target.value })}
              className="bg-transparent border-b border-transparent hover:border-white/20 focus:border-[#ff5a1f] text-base font-bold focus:outline-none px-1"
            />
          </div>

          {/* Fresher Mode Switcher, Target Role Selector & Template Switcher */}
          <div className="flex flex-wrap items-center gap-2.5">
            {/* Fresher / Experienced Toggle */}
            <div className="flex items-center bg-[#16161c] p-1 rounded-lg border border-white/10">
              <button
                type="button"
                onClick={() => setCurrentResume({ ...currentResume, isFresher: true })}
                className={`px-2.5 py-1 rounded-md text-xs font-semibold transition cursor-pointer ${
                  currentResume.isFresher
                    ? 'bg-[#ff5a1f] text-white'
                    : 'text-zinc-400 hover:text-white'
                }`}
              >
                🎓 Fresher / Student
              </button>
              <button
                type="button"
                onClick={() => setCurrentResume({ ...currentResume, isFresher: false })}
                className={`px-2.5 py-1 rounded-md text-xs font-semibold transition cursor-pointer ${
                  !currentResume.isFresher
                    ? 'bg-[#ff5a1f] text-white'
                    : 'text-zinc-400 hover:text-white'
                }`}
              >
                💼 Experienced
              </button>
            </div>

            <div className="flex items-center space-x-2 bg-[#16161c] px-3 py-1.5 rounded-lg border border-white/10">
              <span className="text-xs text-zinc-400">Role:</span>
              <select
                value={ROLE_BENCHMARKS[currentResume.targetRole] ? currentResume.targetRole : '__custom__'}
                onChange={(e) => {
                  if (e.target.value !== '__custom__') {
                    setCurrentResume({ ...currentResume, targetRole: e.target.value });
                  }
                }}
                className="bg-transparent text-xs font-semibold text-[#ff5a1f] focus:outline-none cursor-pointer max-w-[200px]"
              >
                {Object.entries(ROLE_CATEGORIES).map(([category, roles]) => (
                  <optgroup key={category} label={category} className="bg-[#16161c] text-zinc-300">
                    {roles.map(role => (
                      <option key={role} value={role} className="bg-[#16161c] text-white">
                        {role}
                      </option>
                    ))}
                  </optgroup>
                ))}
                <optgroup label="Other / Custom Role" className="bg-[#16161c] text-[#ff5a1f]">
                  <option value="__custom__" className="bg-[#16161c] text-[#ff5a1f]">
                    + Custom Role...
                  </option>
                </optgroup>
              </select>
            </div>

            <div className="flex items-center space-x-1 bg-[#16161c] p-1 rounded-lg border border-white/10">
              {[
                { id: 'modern', label: 'Modern' },
                { id: 'minimal', label: 'Minimal' },
                { id: 'classic', label: 'Classic' }
              ].map(t => (
                <button
                  key={t.id}
                  onClick={() => setCurrentResume({ ...currentResume, templateId: t.id })}
                  className={`px-2.5 py-1 rounded-md text-xs font-medium transition cursor-pointer ${
                    currentResume.templateId === t.id
                      ? 'bg-[#ff5a1f] text-white'
                      : 'text-zinc-400 hover:text-white'
                  }`}
                >
                  {t.label}
                </button>
              ))}
            </div>

            <button
              onClick={handleSaveResume}
              className="px-3.5 py-2 rounded-lg bg-white/10 hover:bg-white/15 text-white text-xs font-semibold border border-white/10 transition cursor-pointer"
            >
              Save to DB
            </button>

            <button
              onClick={() => window.print()}
              className="px-4 py-2 rounded-lg bg-[#ff5a1f] hover:bg-[#e04812] text-white text-xs font-semibold shadow-[0_0_20px_rgba(255,90,31,0.4)] transition cursor-pointer"
            >
              Download PDF
            </button>
          </div>
        </div>
      </header>

      {saveMessage && (
        <div className="no-print bg-emerald-500/20 border-b border-emerald-500/40 text-emerald-300 text-xs text-center py-2 font-medium">
          {saveMessage}
        </div>
      )}

      {/* Main Split Workspace */}
      <div className="max-w-[1600px] mx-auto px-6 py-6 grid grid-cols-1 lg:grid-cols-12 gap-8">
        
        {/* LEFT COLUMN: Editor Controls & Ace Score Analyzer (5 Cols) */}
        <div className="no-print lg:col-span-5 space-y-6">
          
          {/* Real-Time Role Worthiness & Ace Score Banner */}
          <div className="bg-[#121217] border border-white/10 rounded-2xl p-5 space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <div className="flex items-center gap-2">
                  <span className="text-[11px] uppercase tracking-wider text-zinc-400 font-semibold">
                    {currentResume.targetRole}
                  </span>
                  <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-[#ff5a1f]/15 text-[#ff5a1f] border border-[#ff5a1f]/30">
                    {currentResume.isFresher ? '🎓 Fresher Mode' : '💼 Pro Mode'}
                  </span>
                </div>
                <h3 className="text-lg font-bold mt-1">{aceEvaluation.verdict}</h3>
              </div>
              <div className="w-20 h-16 rounded-2xl bg-[#181820] border border-white/10 flex flex-col items-center justify-center px-2">
                <span className={`text-xl font-extrabold ${aceEvaluation.score >= 65 ? 'text-emerald-400' : 'text-[#ff5a1f]'}`}>
                  {aceEvaluation.score}%
                </span>
                <span className="text-[10px] text-zinc-400 font-semibold">Ace Score</span>
              </div>
            </div>

            {currentResume.isFresher && (
              <div className="text-xs bg-emerald-500/10 border border-emerald-500/20 text-emerald-300 px-3 py-2 rounded-lg">
                <strong>🎓 Student / Fresher Layout Active:</strong> Education & Academic Projects are prioritized at the top of your resume, and full-time work experience is not required for a 95%+ Ace Score.
              </div>
            )}

            {/* Custom Role & Custom Keyword Input Box */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 pt-1">
              <div>
                <label className="text-[10px] uppercase tracking-wider text-zinc-400 block mb-1">
                  Or Type Any Custom Target Role
                </label>
                <input
                  type="text"
                  value={currentResume.targetRole}
                  onChange={(e) => setCurrentResume({ ...currentResume, targetRole: e.target.value })}
                  placeholder="e.g., Architect, Pilot, Data Engineer..."
                  className="w-full px-3 py-1.5 rounded-lg bg-[#18181f] border border-white/10 text-xs text-white focus:border-[#ff5a1f] focus:outline-none"
                />
              </div>
              <div>
                <label className="text-[10px] uppercase tracking-wider text-zinc-400 block mb-1">
                  Custom Role Keywords (Optional)
                </label>
                <input
                  type="text"
                  value={customKeywordsInput}
                  onChange={(e) => setCustomKeywordsInput(e.target.value)}
                  placeholder="Comma-separated skills for custom role"
                  className="w-full px-3 py-1.5 rounded-lg bg-[#18181f] border border-white/10 text-xs text-white focus:border-[#ff5a1f] focus:outline-none"
                />
              </div>
            </div>

            {/* Progress Bar */}
            <div className="w-full h-2 bg-white/5 rounded-full overflow-hidden">
              <div
                className={`h-full transition-all duration-500 ${
                  aceEvaluation.score >= 80 ? 'bg-emerald-500' : aceEvaluation.score >= 65 ? 'bg-amber-500' : 'bg-[#ff5a1f]'
                }`}
                style={{ width: `${aceEvaluation.score}%` }}
              />
            </div>

            {/* Missing Role Keywords (Click to Inject) */}
            {aceEvaluation.missing.length > 0 && (
              <div>
                <p className="text-xs text-zinc-400 mb-2">
                  Missing <strong className="text-white">{currentResume.targetRole}</strong> keywords to boost your <strong className="text-[#ff5a1f]">Ace Score</strong> (click to add):
                </p>
                <div className="flex flex-wrap gap-1.5">
                  {aceEvaluation.missing.map(kw => (
                    <button
                      key={kw}
                      onClick={() => addMissingSkill(kw)}
                      className="text-xs px-2.5 py-1 rounded-md bg-[#ff5a1f]/15 hover:bg-[#ff5a1f]/30 text-[#ff5a1f] border border-[#ff5a1f]/30 transition cursor-pointer"
                    >
                      + {kw}
                    </button>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Section Navigation Tabs */}
          <div className="flex border-b border-white/10 space-x-2 overflow-x-auto">
            {[
              { id: 'personal', label: '1. Profile & Skills' },
              { id: 'education', label: '2. Education & School' },
              { id: 'projects', label: '3. Projects' },
              { id: 'experience', label: currentResume.isFresher ? '4. Internships (Optional)' : '4. Experience' },
              { id: 'certifications', label: '5. Certifications & Achievements' },
              { id: 'ats', label: '6. Ace Score Report' }
            ].map(tab => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`px-3 py-2.5 text-xs font-semibold whitespace-nowrap border-b-2 transition cursor-pointer ${
                  activeTab === tab.id
                    ? 'border-[#ff5a1f] text-[#ff5a1f]'
                    : 'border-transparent text-zinc-400 hover:text-white'
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>

          {/* Tab 1: Personal & Skills */}
          {activeTab === 'personal' && (
            <div className="bg-[#121217] border border-white/10 rounded-2xl p-5 space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="text-xs text-zinc-400">Full Name</label>
                  <input
                    type="text"
                    value={currentResume.fullName}
                    onChange={(e) => setCurrentResume({ ...currentResume, fullName: e.target.value })}
                    className="w-full mt-1 px-3 py-2 rounded-lg bg-[#18181f] border border-white/10 text-sm"
                  />
                </div>
                <div>
                  <label className="text-xs text-zinc-400">Email</label>
                  <input
                    type="email"
                    value={currentResume.email}
                    onChange={(e) => setCurrentResume({ ...currentResume, email: e.target.value })}
                    className="w-full mt-1 px-3 py-2 rounded-lg bg-[#18181f] border border-white/10 text-sm"
                  />
                </div>
                <div>
                  <label className="text-xs text-zinc-400">Phone</label>
                  <input
                    type="text"
                    value={currentResume.phone}
                    onChange={(e) => setCurrentResume({ ...currentResume, phone: e.target.value })}
                    className="w-full mt-1 px-3 py-2 rounded-lg bg-[#18181f] border border-white/10 text-sm"
                  />
                </div>
                <div>
                  <label className="text-xs text-zinc-400">Location</label>
                  <input
                    type="text"
                    value={currentResume.location}
                    onChange={(e) => setCurrentResume({ ...currentResume, location: e.target.value })}
                    className="w-full mt-1 px-3 py-2 rounded-lg bg-[#18181f] border border-white/10 text-sm"
                  />
                </div>
                <div>
                  <label className="text-xs text-zinc-400">LinkedIn URL</label>
                  <input
                    type="text"
                    value={currentResume.linkedin}
                    onChange={(e) => setCurrentResume({ ...currentResume, linkedin: e.target.value })}
                    className="w-full mt-1 px-3 py-2 rounded-lg bg-[#18181f] border border-white/10 text-sm"
                  />
                </div>
                <div>
                  <label className="text-xs text-zinc-400">Portfolio / GitHub / Website</label>
                  <input
                    type="text"
                    value={currentResume.github}
                    onChange={(e) => setCurrentResume({ ...currentResume, github: e.target.value })}
                    className="w-full mt-1 px-3 py-2 rounded-lg bg-[#18181f] border border-white/10 text-sm"
                  />
                </div>
              </div>

              <div>
                <label className="text-xs text-zinc-400">
                  {currentResume.isFresher ? 'Career Objective / Fresher Summary' : 'Professional Summary'}
                </label>
                <textarea
                  rows={3}
                  value={currentResume.summary}
                  onChange={(e) => setCurrentResume({ ...currentResume, summary: e.target.value })}
                  className="w-full mt-1 px-3 py-2 rounded-lg bg-[#18181f] border border-white/10 text-sm"
                />
              </div>

              <div>
                <label className="text-xs text-zinc-400">Core Skills & Competencies (Comma separated)</label>
                <textarea
                  rows={2}
                  value={currentResume.skills}
                  onChange={(e) => setCurrentResume({ ...currentResume, skills: e.target.value })}
                  className="w-full mt-1 px-3 py-2 rounded-lg bg-[#18181f] border border-white/10 text-sm"
                />
              </div>
            </div>
          )}

          {/* Tab 2: Experience / Internships */}
          {activeTab === 'experience' && (
            <div className="bg-[#121217] border border-white/10 rounded-2xl p-5 space-y-4">
              {currentResume.isFresher && currentResume.experience.length === 0 && (
                <div className="p-4 rounded-xl bg-white/[0.03] border border-white/10 text-xs text-zinc-400">
                  No internships yet? No problem! In <strong>Fresher Mode</strong>, leaving this blank won’t hurt your <strong>Ace Score</strong>, and the section will stay hidden on your PDF. If you have completed an internship, industrial training, or student club role, click below to add it.
                </div>
              )}
              {currentResume.experience.map((exp, idx) => (
                <div key={idx} className="p-4 rounded-xl bg-[#18181f] border border-white/10 space-y-3">
                  <div className="flex justify-between items-center">
                    <span className="text-xs font-bold text-[#ff5a1f]">
                      {currentResume.isFresher ? `Internship / Training #${idx + 1}` : `Experience #${idx + 1}`}
                    </span>
                    <button
                      type="button"
                      onClick={() =>
                        setCurrentResume({
                          ...currentResume,
                          experience: currentResume.experience.filter((_, i) => i !== idx)
                        })
                      }
                      className="text-xs text-red-400 hover:underline cursor-pointer"
                    >
                      Remove
                    </button>
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
                    <input
                      placeholder={currentResume.isFresher ? 'Intern Role / Trainee' : 'Role Title'}
                      value={exp.role}
                      onChange={(e) => {
                        const updated = [...currentResume.experience];
                        updated[idx].role = e.target.value;
                        setCurrentResume({ ...currentResume, experience: updated });
                      }}
                      className="px-3 py-2 rounded bg-[#121217] border border-white/10 text-xs"
                    />
                    <input
                      placeholder="Company / Organization"
                      value={exp.company}
                      onChange={(e) => {
                        const updated = [...currentResume.experience];
                        updated[idx].company = e.target.value;
                        setCurrentResume({ ...currentResume, experience: updated });
                      }}
                      className="px-3 py-2 rounded bg-[#121217] border border-white/10 text-xs"
                    />
                    <input
                      placeholder="Duration (e.g., May 2026 - Jul 2026)"
                      value={exp.duration}
                      onChange={(e) => {
                        const updated = [...currentResume.experience];
                        updated[idx].duration = e.target.value;
                        setCurrentResume({ ...currentResume, experience: updated });
                      }}
                      className="px-3 py-2 rounded bg-[#121217] border border-white/10 text-xs"
                    />
                  </div>
                  <textarea
                    rows={3}
                    placeholder="Key learnings, tools used & measurable outcomes..."
                    value={exp.points}
                    onChange={(e) => {
                      const updated = [...currentResume.experience];
                      updated[idx].points = e.target.value;
                      setCurrentResume({ ...currentResume, experience: updated });
                    }}
                    className="w-full px-3 py-2 rounded bg-[#121217] border border-white/10 text-xs"
                  />
                </div>
              ))}
              <button
                type="button"
                onClick={() =>
                  setCurrentResume({
                    ...currentResume,
                    experience: [
                      ...currentResume.experience,
                      {
                        role: currentResume.isFresher ? `${currentResume.targetRole} Intern` : currentResume.targetRole,
                        company: 'Organization Name',
                        duration: 'May 2026 – Jul 2026',
                        points: 'Developed and tested key modules, improving performance by 25%...'
                      }
                    ]
                  })
                }
                className="w-full py-2.5 rounded-lg border border-dashed border-white/20 text-xs text-zinc-300 hover:border-[#ff5a1f] hover:text-[#ff5a1f] transition cursor-pointer"
              >
                {currentResume.isFresher ? '+ Add Internship / Industrial Training' : '+ Add Work Experience'}
              </button>
            </div>
          )}

          {/* Tab 3: Projects */}
          {activeTab === 'projects' && (
            <div className="bg-[#121217] border border-white/10 rounded-2xl p-5 space-y-4">
              {currentResume.projects.map((proj, idx) => (
                <div key={idx} className="p-4 rounded-xl bg-[#18181f] border border-white/10 space-y-3">
                  <div className="flex justify-between items-center">
                    <span className="text-xs font-bold text-[#ff5a1f]">Project / Case Study #{idx + 1}</span>
                    <button
                      type="button"
                      onClick={() =>
                        setCurrentResume({
                          ...currentResume,
                          projects: currentResume.projects.filter((_, i) => i !== idx)
                        })
                      }
                      className="text-xs text-red-400 hover:underline cursor-pointer"
                    >
                      Remove
                    </button>
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                    <input
                      placeholder="Project / Capstone Title"
                      value={proj.name}
                      onChange={(e) => {
                        const updated = [...currentResume.projects];
                        updated[idx].name = e.target.value;
                        setCurrentResume({ ...currentResume, projects: updated });
                      }}
                      className="px-3 py-2 rounded bg-[#121217] border border-white/10 text-xs"
                    />
                    <input
                      placeholder="Tools / Methods / Tech Used"
                      value={proj.tech}
                      onChange={(e) => {
                        const updated = [...currentResume.projects];
                        updated[idx].tech = e.target.value;
                        setCurrentResume({ ...currentResume, projects: updated });
                      }}
                      className="px-3 py-2 rounded bg-[#121217] border border-white/10 text-xs"
                    />
                  </div>
                  <textarea
                    rows={2}
                    placeholder="Description & measurable outcome (e.g., 94% accuracy, 500+ users)..."
                    value={proj.description}
                    onChange={(e) => {
                      const updated = [...currentResume.projects];
                      updated[idx].description = e.target.value;
                      setCurrentResume({ ...currentResume, projects: updated });
                    }}
                    className="w-full px-3 py-2 rounded bg-[#121217] border border-white/10 text-xs"
                  />
                </div>
              ))}
              <button
                type="button"
                onClick={() =>
                  setCurrentResume({
                    ...currentResume,
                    projects: [
                      ...currentResume.projects,
                      { name: 'Academic / Capstone Project', tech: 'Key Tools & Methodology', link: '', description: 'Built and deployed project delivering 92% accuracy...' }
                    ]
                  })
                }
                className="w-full py-2.5 rounded-lg border border-dashed border-white/20 text-xs text-zinc-300 hover:border-[#ff5a1f] hover:text-[#ff5a1f] transition cursor-pointer"
              >
                + Add Project / Case Study
              </button>
            </div>
          )}

          {/* Tab 4: Education (College & School Details with Marks) */}
          {activeTab === 'education' && (
            <div className="bg-[#121217] border border-white/10 rounded-2xl p-5 space-y-4">
              {currentResume.education.map((edu, idx) => {
                const isSchool = edu.level?.includes('Class') || edu.level?.includes('School') || edu.level?.includes('HSC') || edu.level?.includes('SSLC');
                return (
                  <div key={idx} className="p-4 rounded-xl bg-[#18181f] border border-white/10 space-y-3">
                    <div className="flex justify-between items-center">
                      <span className="text-xs font-bold text-[#ff5a1f]">
                        {edu.level || `Education #${idx + 1}`}
                      </span>
                      {currentResume.education.length > 1 && (
                        <button
                          type="button"
                          onClick={() =>
                            setCurrentResume({
                              ...currentResume,
                              education: currentResume.education.filter((_, i) => i !== idx)
                            })
                          }
                          className="text-xs text-red-400 hover:underline cursor-pointer"
                        >
                          Remove
                        </button>
                      )}
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      <div className="sm:col-span-2">
                        <label className="text-[11px] text-zinc-400 block mb-1">Education Type</label>
                        <select
                          value={edu.level || 'College / University'}
                          onChange={(e) => {
                            const updated = [...currentResume.education];
                            updated[idx].level = e.target.value;
                            setCurrentResume({ ...currentResume, education: updated });
                          }}
                          className="w-full px-3 py-2 rounded bg-[#121217] border border-white/10 text-xs text-white focus:border-[#ff5a1f] focus:outline-none"
                        >
                          <option value="College / University">College / University (UG / PG)</option>
                          <option value="HSC (Class 12)">School — Class 12 (HSC / Intermediate)</option>
                          <option value="SSLC (Class 10)">School — Class 10 (SSLC / Matriculation)</option>
                          <option value="Diploma / Polytechnic">Diploma / Polytechnic</option>
                        </select>
                      </div>

                      <div>
                        <label className="text-[11px] text-zinc-400 block mb-1">
                          {isSchool ? 'School Name' : 'College / University Name'}
                        </label>
                        <input
                          placeholder={isSchool ? 'e.g., Vijay Millennium Senior Secondary School' : 'e.g., Sri Krishna College of Engineering'}
                          value={edu.institution}
                          onChange={(e) => {
                            const updated = [...currentResume.education];
                            updated[idx].institution = e.target.value;
                            setCurrentResume({ ...currentResume, education: updated });
                          }}
                          className="w-full px-3 py-2 rounded bg-[#121217] border border-white/10 text-xs focus:border-[#ff5a1f] focus:outline-none"
                        />
                      </div>

                      <div>
                        <label className="text-[11px] text-zinc-400 block mb-1">
                          {isSchool ? 'Board / Group / Stream' : 'Degree & Branch'}
                        </label>
                        <input
                          placeholder={isSchool ? 'e.g., CBSE - Class 12 (Computer Science)' : 'e.g., B.E. Computer Science'}
                          value={edu.degree}
                          onChange={(e) => {
                            const updated = [...currentResume.education];
                            updated[idx].degree = e.target.value;
                            setCurrentResume({ ...currentResume, education: updated });
                          }}
                          className="w-full px-3 py-2 rounded bg-[#121217] border border-white/10 text-xs focus:border-[#ff5a1f] focus:outline-none"
                        />
                      </div>

                      <div>
                        <label className="text-[11px] text-zinc-400 block mb-1">Year of Completion</label>
                        <input
                          placeholder={isSchool ? 'e.g., 2024' : 'e.g., 2024 – 2028'}
                          value={edu.year}
                          onChange={(e) => {
                            const updated = [...currentResume.education];
                            updated[idx].year = e.target.value;
                            setCurrentResume({ ...currentResume, education: updated });
                          }}
                          className="w-full px-3 py-2 rounded bg-[#121217] border border-white/10 text-xs focus:border-[#ff5a1f] focus:outline-none"
                        />
                      </div>

                      <div>
                        <label className="text-[11px] text-zinc-400 block mb-1">
                          {isSchool ? 'School Marks / Percentage' : 'CGPA / Percentage'}
                        </label>
                        <input
                          placeholder={isSchool ? 'e.g., Marks: 570/600 (95%)' : 'e.g., CGPA: 8.9 / 10'}
                          value={edu.score}
                          onChange={(e) => {
                            const updated = [...currentResume.education];
                            updated[idx].score = e.target.value;
                            setCurrentResume({ ...currentResume, education: updated });
                          }}
                          className="w-full px-3 py-2 rounded bg-[#121217] border border-white/10 text-xs focus:border-[#ff5a1f] focus:outline-none"
                        />
                      </div>
                    </div>
                  </div>
                );
              })}

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 pt-1">
                <button
                  type="button"
                  onClick={() =>
                    setCurrentResume({
                      ...currentResume,
                      education: [
                        ...currentResume.education,
                        {
                          level: 'HSC (Class 12)',
                          degree: 'Higher Secondary (Class 12 - CBSE / State Board)',
                          institution: 'Enter School Name',
                          year: '2024',
                          score: 'Marks: 92%'
                        }
                      ]
                    })
                  }
                  className="py-2.5 px-3 rounded-lg border border-dashed border-[#ff5a1f]/50 bg-[#ff5a1f]/5 text-xs font-medium text-[#ff5a1f] hover:bg-[#ff5a1f]/15 transition cursor-pointer"
                >
                  + Add School Details & Marks
                </button>

                <button
                  type="button"
                  onClick={() =>
                    setCurrentResume({
                      ...currentResume,
                      education: [
                        ...currentResume.education,
                        {
                          level: 'College / University',
                          degree: 'B.E. / B.Tech / Degree',
                          institution: 'Enter College Name',
                          year: '2024 – 2028',
                          score: 'CGPA: 8.5 / 10'
                        }
                      ]
                    })
                  }
                  className="py-2.5 px-3 rounded-lg border border-dashed border-white/20 text-xs font-medium text-zinc-300 hover:border-white/40 hover:text-white transition cursor-pointer"
                >
                  + Add College / Degree Details
                </button>
              </div>
            </div>
          )}

          {/* Tab 5: Certifications & Achievements */}
          {activeTab === 'certifications' && (
            <div className="bg-[#121217] border border-white/10 rounded-2xl p-5 space-y-6">
              <div className="space-y-3">
                <h4 className="text-xs font-bold uppercase tracking-wider text-zinc-300">Certifications</h4>
                {(currentResume.certifications || []).map((cert, idx) => (
                  <div key={idx} className="p-4 rounded-xl bg-[#18181f] border border-white/10 space-y-3">
                    <div className="flex justify-between items-center">
                      <span className="text-xs font-bold text-[#ff5a1f]">Certification #{idx + 1}</span>
                      <button
                        type="button"
                        onClick={() =>
                          setCurrentResume({
                            ...currentResume,
                            certifications: currentResume.certifications.filter((_, i) => i !== idx)
                          })
                        }
                        className="text-xs text-red-400 hover:underline cursor-pointer"
                      >
                        Remove
                      </button>
                    </div>
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
                      <input
                        placeholder="Certification Name"
                        value={cert.name}
                        onChange={(e) => {
                          const updated = [...(currentResume.certifications || [])];
                          updated[idx].name = e.target.value;
                          setCurrentResume({ ...currentResume, certifications: updated });
                        }}
                        className="sm:col-span-2 px-3 py-2 rounded bg-[#121217] border border-white/10 text-xs"
                      />
                      <input
                        placeholder="Year (e.g., 2026)"
                        value={cert.year}
                        onChange={(e) => {
                          const updated = [...(currentResume.certifications || [])];
                          updated[idx].year = e.target.value;
                          setCurrentResume({ ...currentResume, certifications: updated });
                        }}
                        className="px-3 py-2 rounded bg-[#121217] border border-white/10 text-xs"
                      />
                    </div>
                    <input
                      placeholder="Issuing Organization (e.g., AWS, Coursera, NPTEL, ICAI, PMI)"
                      value={cert.issuer}
                      onChange={(e) => {
                        const updated = [...(currentResume.certifications || [])];
                        updated[idx].issuer = e.target.value;
                        setCurrentResume({ ...currentResume, certifications: updated });
                      }}
                      className="w-full px-3 py-2 rounded bg-[#121217] border border-white/10 text-xs"
                    />
                  </div>
                ))}
                <button
                  type="button"
                  onClick={() =>
                    setCurrentResume({
                      ...currentResume,
                      certifications: [
                        ...(currentResume.certifications || []),
                        { name: 'New Certification Name', issuer: 'Issuing Organization', year: '2026' }
                      ]
                    })
                  }
                  className="w-full py-2.5 rounded-lg border border-dashed border-[#ff5a1f]/50 bg-[#ff5a1f]/5 text-xs font-medium text-[#ff5a1f] hover:bg-[#ff5a1f]/15 transition cursor-pointer"
                >
                  + Add Certification
                </button>
              </div>

              <div className="space-y-3 pt-4 border-t border-white/10">
                <h4 className="text-xs font-bold uppercase tracking-wider text-zinc-300">Key Achievements, Hackathons & Leadership</h4>
                {(currentResume.achievements || []).map((ach, idx) => (
                  <div key={idx} className="p-4 rounded-xl bg-[#18181f] border border-white/10 space-y-3">
                    <div className="flex justify-between items-center">
                      <span className="text-xs font-bold text-[#ff5a1f]">Achievement #{idx + 1}</span>
                      <button
                        type="button"
                        onClick={() =>
                          setCurrentResume({
                            ...currentResume,
                            achievements: currentResume.achievements.filter((_, i) => i !== idx)
                          })
                        }
                        className="text-xs text-red-400 hover:underline cursor-pointer"
                      >
                        Remove
                      </button>
                    </div>
                    <input
                      placeholder="Achievement / Award / Club Role Title"
                      value={ach.title}
                      onChange={(e) => {
                        const updated = [...(currentResume.achievements || [])];
                        updated[idx].title = e.target.value;
                        setCurrentResume({ ...currentResume, achievements: updated });
                      }}
                      className="w-full px-3 py-2 rounded bg-[#121217] border border-white/10 text-xs"
                    />
                    <textarea
                      rows={2}
                      placeholder="Details & impact (e.g., 1st place in Hackathon among 100+ teams)"
                      value={ach.description}
                      onChange={(e) => {
                        const updated = [...(currentResume.achievements || [])];
                        updated[idx].description = e.target.value;
                        setCurrentResume({ ...currentResume, achievements: updated });
                      }}
                      className="w-full px-3 py-2 rounded bg-[#121217] border border-white/10 text-xs"
                    />
                  </div>
                ))}
                <button
                  type="button"
                  onClick={() =>
                    setCurrentResume({
                      ...currentResume,
                      achievements: [
                        ...(currentResume.achievements || []),
                        { title: 'New Achievement / Leadership Role', description: 'Describe your award, rank, or recognition...' }
                      ]
                    })
                  }
                  className="w-full py-2.5 rounded-lg border border-dashed border-white/20 text-xs font-medium text-zinc-300 hover:border-[#ff5a1f] hover:text-[#ff5a1f] transition cursor-pointer"
                >
                  + Add Achievement / Award
                </button>
              </div>
            </div>
          )}

          {/* Tab 6: Detailed Ace Score Breakdown */}
          {activeTab === 'ats' && (
            <div className="bg-[#121217] border border-white/10 rounded-2xl p-5 space-y-4">
              <h4 className="font-bold text-sm">
                Detailed Ace Score Diagnostic ({currentResume.targetRole} • {currentResume.isFresher ? 'Fresher Mode' : 'Experienced Mode'})
              </h4>
              <div className="grid grid-cols-3 gap-3 text-center">
                <div className="p-3 rounded-xl bg-[#18181f] border border-white/10">
                  <div className="text-lg font-bold text-[#ff5a1f]">{aceEvaluation.keywordScore}/55</div>
                  <div className="text-[11px] text-zinc-400">Role Keyword Match</div>
                </div>
                <div className="p-3 rounded-xl bg-[#18181f] border border-white/10">
                  <div className="text-lg font-bold text-emerald-400">{aceEvaluation.impactScore}/25</div>
                  <div className="text-[11px] text-zinc-400">Action Verbs & Metrics</div>
                </div>
                <div className="p-3 rounded-xl bg-[#18181f] border border-white/10">
                  <div className="text-lg font-bold text-sky-400">{aceEvaluation.completeness}/20</div>
                  <div className="text-[11px] text-zinc-400">
                    {currentResume.isFresher ? 'Fresher Section Depth' : 'Pro Section Depth'}
                  </div>
                </div>
              </div>

              <div>
                <p className="text-xs font-semibold text-emerald-400 mb-1.5">
                  Matched Role Keywords ({aceEvaluation.matched.length}):
                </p>
                <div className="flex flex-wrap gap-1.5">
                  {aceEvaluation.matched.map(kw => (
                    <span key={kw} className="text-xs px-2 py-0.5 rounded bg-emerald-500/15 text-emerald-300 border border-emerald-500/30">
                      ✓ {kw}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          )}

        </div>

        {/* RIGHT COLUMN: Live Printable A4 Resume Preview (7 Cols) */}
        <div className="lg:col-span-7 flex justify-center">
          <div
            id="printable-resume"
            className={`w-full max-w-[800px] min-h-[1040px] bg-white text-zinc-900 shadow-2xl rounded-sm p-10 transition-all ${
              currentResume.templateId === 'classic' ? 'font-serif' : 'font-sans'
            }`}
          >
            {/* HEADER VARIATIONS BASED ON SELECTED TEMPLATE */}
            {currentResume.templateId === 'modern' && (
              <div className="border-b-4 border-[#ff5a1f] pb-5 mb-6 flex justify-between items-start">
                <div>
                  <h1 className="text-3xl font-extrabold tracking-tight text-zinc-900 uppercase">
                    {currentResume.fullName}
                  </h1>
                  <p className="text-sm font-semibold text-[#ff5a1f] mt-1">
                    {currentResume.targetRole}
                  </p>
                </div>
                <div className="text-right text-xs text-zinc-600 space-y-1">
                  <div>{currentResume.email} • {currentResume.phone}</div>
                  <div>{currentResume.location}</div>
                  <div className="text-zinc-500">{currentResume.linkedin} • {currentResume.github}</div>
                </div>
              </div>
            )}

            {currentResume.templateId === 'minimal' && (
              <div className="pb-5 mb-6 border-b border-zinc-200">
                <h1 className="text-4xl font-light tracking-tight text-zinc-900">
                  {currentResume.fullName}
                </h1>
                <p className="text-xs uppercase tracking-widest text-zinc-500 mt-1">
                  {currentResume.targetRole}
                </p>
                <div className="flex flex-wrap gap-3 text-xs text-zinc-500 mt-3">
                  <span>{currentResume.email}</span>•<span>{currentResume.phone}</span>•
                  <span>{currentResume.location}</span>•<span>{currentResume.github}</span>
                </div>
              </div>
            )}

            {currentResume.templateId === 'classic' && (
              <div className="text-center border-b-2 border-zinc-800 pb-4 mb-6">
                <h1 className="text-3xl font-bold uppercase tracking-wide text-zinc-900">
                  {currentResume.fullName}
                </h1>
                <p className="text-xs text-zinc-700 mt-1">
                  {currentResume.location} | {currentResume.phone} | {currentResume.email}
                </p>
                <p className="text-xs text-zinc-600 mt-0.5">
                  {currentResume.linkedin} | {currentResume.github}
                </p>
              </div>
            )}

            {/* SUMMARY / CAREER OBJECTIVE */}
            {currentResume.summary && (
              <section className="mb-5">
                <h2 className={`text-xs font-bold uppercase tracking-wider mb-2 ${
                  currentResume.templateId === 'modern' ? 'text-[#ff5a1f]' : 'text-zinc-800 border-b border-zinc-300 pb-1'
                }`}>
                  {currentResume.isFresher ? 'Career Objective & Profile' : 'Professional Summary'}
                </h2>
                <p className="text-xs leading-relaxed text-zinc-700">{currentResume.summary}</p>
              </section>
            )}

            {/* CORE SKILLS */}
            {currentResume.skills && (
              <section className="mb-5">
                <h2 className={`text-xs font-bold uppercase tracking-wider mb-2 ${
                  currentResume.templateId === 'modern' ? 'text-[#ff5a1f]' : 'text-zinc-800 border-b border-zinc-300 pb-1'
                }`}>
                  Core Skills & Competencies
                </h2>
                <div className="flex flex-wrap gap-1.5">
                  {currentResume.skills.split(',').map((skill, index) => (
                    <span
                      key={index}
                      className={`text-xs px-2.5 py-0.5 rounded ${
                        currentResume.templateId === 'modern'
                          ? 'bg-zinc-100 text-zinc-800 font-medium border border-zinc-200'
                          : 'text-zinc-800 font-medium'
                      }`}
                    >
                      {skill.trim()}{currentResume.templateId !== 'modern' && index < currentResume.skills.split(',').length - 1 ? ' •' : ''}
                    </span>
                  ))}
                </div>
              </section>
            )}

            {/* DYNAMIC SECTION ORDERING:
                - Fresher Mode: Education -> Academic Projects -> Internships (if any)
                - Experienced Mode: Work Experience -> Key Projects -> Education
            */}
            {currentResume.isFresher ? (
              <>
                {renderEducationSection()}
                {renderProjectsSection()}
                {renderExperienceSection()}
              </>
            ) : (
              <>
                {renderExperienceSection()}
                {renderProjectsSection()}
                {renderEducationSection()}
              </>
            )}

            {/* CERTIFICATIONS & ACHIEVEMENTS */}
            {((currentResume.certifications && currentResume.certifications.length > 0) ||
              (currentResume.achievements && currentResume.achievements.length > 0)) && (
              <section>
                <h2 className={`text-xs font-bold uppercase tracking-wider mb-2.5 ${
                  currentResume.templateId === 'modern' ? 'text-[#ff5a1f]' : 'text-zinc-800 border-b border-zinc-300 pb-1'
                }`}>
                  Certifications & Achievements
                </h2>

                <div className="space-y-2.5">
                  {currentResume.certifications?.map((cert, idx) => (
                    <div key={`cert-${idx}`} className="flex justify-between items-baseline">
                      <div className="text-xs text-zinc-800">
                        <strong className="font-bold text-zinc-900">{cert.name}</strong> — <span className="text-zinc-600">{cert.issuer}</span>
                      </div>
                      <span className="text-xs text-zinc-500 font-medium">{cert.year}</span>
                    </div>
                  ))}

                  {currentResume.achievements?.map((ach, idx) => (
                    <div key={`ach-${idx}`} className="text-xs text-zinc-700">
                      <strong className="font-bold text-zinc-900">★ {ach.title}: </strong>
                      <span>{ach.description}</span>
                    </div>
                  ))}
                </div>
              </section>
            )}
          </div>
        </div>

      </div>
    </div>
  );
}
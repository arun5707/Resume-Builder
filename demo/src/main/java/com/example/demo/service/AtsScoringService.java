package com.example.demo.service;

import com.example.demo.model.Resume;
import org.springframework.stereotype.Service;
import java.util.*;

@Service
public class AtsScoringService {

    private static final Map<String, List<String>> ROLE_KEYWORDS = new HashMap<>();
    private static final List<String> ACTION_VERBS = Arrays.asList(
        "engineered", "developed", "architected", "optimized", "reduced",
        "built", "deployed", "automated", "led", "designed", "implemented", "scaled",
        "managed", "spearheaded", "increased", "streamlined", "audited", "negotiated",
        "researched", "diagnosed", "formulated", "supervised", "executed", "accelerated"
    );

    static {
        // Software, Data & IT
        ROLE_KEYWORDS.put("Full Stack Developer", Arrays.asList(
            "react", "spring boot", "java", "javascript", "typescript", "mysql",
            "rest api", "docker", "git", "tailwind", "node.js", "microservices"
        ));
        ROLE_KEYWORDS.put("Backend Engineer", Arrays.asList(
            "java", "spring boot", "mysql", "postgresql", "microservices", "redis",
            "kafka", "docker", "kubernetes", "hibernate", "jpa", "aws"
        ));
        ROLE_KEYWORDS.put("Frontend Developer", Arrays.asList(
            "react", "javascript", "typescript", "tailwind", "html5", "css3",
            "redux", "next.js", "responsive design", "figma", "rest api", "vite"
        ));
        ROLE_KEYWORDS.put("Data Scientist / AI Engineer", Arrays.asList(
            "python", "machine learning", "deep learning", "tensorflow", "pytorch",
            "sql", "pandas", "scikit-learn", "nlp", "computer vision", "transformers"
        ));
        ROLE_KEYWORDS.put("Data Analyst / BI Developer", Arrays.asList(
            "sql", "power bi", "tableau", "excel", "python", "data visualization",
            "etl", "statistics", "data modeling", "pandas", "dashboard", "reporting"
        ));
        ROLE_KEYWORDS.put("Cloud & DevOps Engineer", Arrays.asList(
            "aws", "docker", "kubernetes", "terraform", "ci/cd", "linux",
            "jenkins", "github actions", "bash", "prometheus", "grafana"
        ));
        ROLE_KEYWORDS.put("Mobile App Developer", Arrays.asList(
            "flutter", "dart", "react native", "firebase", "rest api",
            "android", "ios", "sqlite", "git", "ui/ux"
        ));
        ROLE_KEYWORDS.put("Cybersecurity Analyst", Arrays.asList(
            "network security", "siem", "penetration testing", "vulnerability assessment",
            "firewall", "incident response", "iso 27001", "linux", "cryptography", "soc"
        ));
        ROLE_KEYWORDS.put("QA / Automation Test Engineer", Arrays.asList(
            "selenium", "cypress", "junit", "testng", "java", "python",
            "api testing", "postman", "jira", "ci/cd", "regression testing", "agile"
        ));

        // Core Engineering & Manufacturing
        ROLE_KEYWORDS.put("Mechanical Engineer", Arrays.asList(
            "solidworks", "autocad", "ansys", "catia", "thermodynamics", "cad/cam",
            "finite element analysis", "gd&t", "lean manufacturing", "six sigma", "cnc", "product design"
        ));
        ROLE_KEYWORDS.put("Electronics & Communication (ECE / VLSI)", Arrays.asList(
            "verilog", "vhdl", "embedded c", "microcontrollers", "stm32", "esp32",
            "pcb design", "matlab", "fpga", "iot", "rtos", "signal processing"
        ));
        ROLE_KEYWORDS.put("Electrical & Automation Engineer", Arrays.asList(
            "plc", "scada", "matlab", "simulink", "power systems", "autocad electrical",
            "circuit design", "control systems", "switchgear", "transformers", "iot", "safety compliance"
        ));
        ROLE_KEYWORDS.put("Civil & Structural Engineer", Arrays.asList(
            "autocad", "staad pro", "revit", "etabs", "structural analysis", "site execution",
            "quantity surveying", "estimation", "concrete technology", "primavera", "bim", "surveying"
        ));
        ROLE_KEYWORDS.put("Chemical / Process Engineer", Arrays.asList(
            "aspen plus", "process simulation", "heat transfer", "mass transfer", "p&id",
            "hazop", "process safety", "quality control", "distillation", "chemical kinetics", "iso"
        ));
        ROLE_KEYWORDS.put("Automobile / EV Engineer", Arrays.asList(
            "battery management system", "powertrain", "solidworks", "catia", "can protocol",
            "matlab", "vehicle dynamics", "thermal management", "electric motors", "dfmea", "cad"
        ));

        // Business, Management & HR
        ROLE_KEYWORDS.put("Product Manager", Arrays.asList(
            "product roadmap", "agile", "scrum", "user stories", "kpis", "a/b testing",
            "market research", "jira", "stakeholder management", "go-to-market", "product strategy", "wireframing"
        ));
        ROLE_KEYWORDS.put("Project Manager", Arrays.asList(
            "project management", "agile", "scrum", "pmp", "risk management", "budgeting",
            "stakeholder management", "jira", "ms project", "resource allocation", "kpis", "cross-functional"
        ));
        ROLE_KEYWORDS.put("Business Analyst", Arrays.asList(
            "requirements gathering", "sql", "power bi", "tableau", "brd", "agile",
            "process improvement", "stakeholder management", "data analysis", "jira", "uat", "excel"
        ));
        ROLE_KEYWORDS.put("Human Resources (HR) Specialist", Arrays.asList(
            "talent acquisition", "onboarding", "employee relations", "hris", "performance management",
            "payroll", "labor laws", "employer branding", "compensation", "retention", "training", "sourcing"
        ));
        ROLE_KEYWORDS.put("Operations & Supply Chain Manager", Arrays.asList(
            "supply chain", "logistics", "inventory management", "sap", "erp", "vendor management",
            "lean six sigma", "procurement", "cost reduction", "demand forecasting", "warehouse", "kpis"
        ));
        ROLE_KEYWORDS.put("Management Consultant", Arrays.asList(
            "strategy", "financial modeling", "market entry", "business transformation", "due diligence",
            "stakeholder management", "data analysis", "powerpoint", "excel", "cost optimization", "kpis"
        ));

        // Finance, Banking & Accounting
        ROLE_KEYWORDS.put("Financial Analyst", Arrays.asList(
            "financial modeling", "valuation", "dcf", "excel", "forecasting", "budgeting",
            "variance analysis", "financial reporting", "p&l", "bloomberg", "sql", "power bi"
        ));
        ROLE_KEYWORDS.put("Chartered Accountant / Auditor", Arrays.asList(
            "ifrs", "gaap", "statutory audit", "internal audit", "taxation", "gst",
            "tally", "sap fico", "financial statements", "compliance", "risk assessment", "reconciliation"
        ));
        ROLE_KEYWORDS.put("Investment Banking Analyst", Arrays.asList(
            "m&a", "lbo", "dcf", "financial modeling", "valuation", "pitch books",
            "due diligence", "capital markets", "equity research", "bloomberg", "excel", "financial analysis"
        ));
        ROLE_KEYWORDS.put("Tax & Compliance Consultant", Arrays.asList(
            "direct tax", "indirect tax", "gst", "income tax", "transfer pricing", "regulatory compliance",
            "tax planning", "auditing", "financial reporting", "tally", "sap", "litigation"
        ));

        // Marketing, Sales & Creative
        ROLE_KEYWORDS.put("Digital Marketing Specialist", Arrays.asList(
            "seo", "sem", "google ads", "meta ads", "google analytics", "content marketing",
            "social media", "email marketing", "conversion rate optimization", "roi", "crm", "lead generation"
        ));
        ROLE_KEYWORDS.put("Sales & Business Development Manager", Arrays.asList(
            "b2b sales", "lead generation", "crm", "salesforce", "hubspot", "cold outreach",
            "negotiation", "account management", "revenue growth", "pipeline management", "client retention", "quota"
        ));
        ROLE_KEYWORDS.put("UI/UX & Product Designer", Arrays.asList(
            "figma", "wireframing", "prototyping", "user research", "usability testing", "design systems",
            "interaction design", "information architecture", "adobe xd", "accessibility", "user flows", "responsive"
        ));
        ROLE_KEYWORDS.put("Content Strategist / Copywriter", Arrays.asList(
            "copywriting", "content strategy", "seo", "brand voice", "editorial calendar", "storytelling",
            "cms", "wordpress", "proofreading", "audience engagement", "social media", "analytics"
        ));
        ROLE_KEYWORDS.put("Graphic & Motion Designer", Arrays.asList(
            "adobe photoshop", "illustrator", "after effects", "premiere pro", "indesign", "typography",
            "brand identity", "visual design", "motion graphics", "figma", "layout", "color theory"
        ));

        // Healthcare, Pharmacy & Life Sciences
        ROLE_KEYWORDS.put("Registered Nurse / Clinical Specialist", Arrays.asList(
            "patient care", "triage", "emr", "vital signs", "medication administration", "bls",
            "acls", "infection control", "clinical assessment", "care planning", "hipaa", "emergency care"
        ));
        ROLE_KEYWORDS.put("Pharmacist / Clinical Research Associate", Arrays.asList(
            "pharmacology", "clinical trials", "good clinical practice", "drug safety", "pharmacovigilance",
            "fda regulations", "dispensing", "patient counseling", "ich-gcp", "protocol compliance", "sop"
        ));
        ROLE_KEYWORDS.put("Biotechnology / Lab Researcher", Arrays.asList(
            "pcr", "cell culture", "elisa", "chromatography", "hplc", "spectroscopy",
            "molecular biology", "glp", "gmp", "data analysis", "assay development", "sop"
        ));
        ROLE_KEYWORDS.put("Healthcare Administrator", Arrays.asList(
            "healthcare management", "emr", "ehr", "hipaa", "patient operations", "medical billing",
            "quality assurance", "regulatory compliance", "budgeting", "staff scheduling", "hospital operations"
        ));

        // Education, Law & Public Sector
        ROLE_KEYWORDS.put("Teacher / Academic Professor", Arrays.asList(
            "curriculum development", "lesson planning", "classroom management", "student assessment",
            "pedagogy", "e-learning", "lms", "mentoring", "academic research", "differentiated instruction"
        ));
        ROLE_KEYWORDS.put("Corporate Lawyer / Legal Advisor", Arrays.asList(
            "contract drafting", "corporate law", "mergers & acquisitions", "due diligence", "legal research",
            "compliance", "intellectual property", "arbitration", "litigation", "risk mitigation", "negotiation"
        ));
    }

    public Map<String, Object> evaluateResume(Resume resume) {
        String role = resume.getTargetRole() != null && !resume.getTargetRole().isBlank()
            ? resume.getTargetRole()
            : "Full Stack Developer";

        // Use predefined role keywords or dynamically build benchmark for custom roles
        List<String> expectedKeywords = ROLE_KEYWORDS.get(role);
        if (expectedKeywords == null) {
            expectedKeywords = new ArrayList<>(Arrays.asList(
                "project management", "leadership", "analysis", "communication",
                "problem solving", "operations", "strategy", "quality"
            ));
            for (String word : role.toLowerCase().split("[\\s/&,-]+")) {
                if (word.length() > 2 && !expectedKeywords.contains(word)) {
                    expectedKeywords.add(word);
                }
            }
        }

        String combinedContent = (
            (resume.getSummary() != null ? resume.getSummary() : "") + " " +
            (resume.getSkills() != null ? resume.getSkills() : "") + " " +
            (resume.getExperienceJson() != null ? resume.getExperienceJson() : "") + " " +
            (resume.getProjectsJson() != null ? resume.getProjectsJson() : "") + " " +
            (resume.getEducationJson() != null ? resume.getEducationJson() : "")
        ).toLowerCase();

        List<String> matchedKeywords = new ArrayList<>();
        List<String> missingKeywords = new ArrayList<>();

        for (String kw : expectedKeywords) {
            if (combinedContent.contains(kw.toLowerCase())) {
                matchedKeywords.add(kw);
            } else {
                missingKeywords.add(kw);
            }
        }

        // 1. Role Keyword Match Score (Max 55 points)
        double keywordRatio = expectedKeywords.isEmpty() ? 0 : (double) matchedKeywords.size() / expectedKeywords.size();
        int keywordScore = (int) Math.round(keywordRatio * 55);

        // 2. Action Verbs & Measurable Metrics Score (Max 25 points - supports CGPA, %, x, + for Freshers & Pros)
        int verbHits = 0;
        for (String verb : ACTION_VERBS) {
            if (combinedContent.contains(verb)) verbHits++;
        }
        boolean hasMetrics = combinedContent.matches(".*(\\d+%|\\d+x|\\d+\\+|cgpa).*");
        int impactScore = Math.min(15, verbHits * 3) + (hasMetrics ? 10 : 0);

        // 3. Completeness Score (Max 20 points - supports both Fresher and Experienced profiles)
        int completenessScore = 0;
        if (resume.getSummary() != null && resume.getSummary().length() > 40) completenessScore += 5;
        if (resume.getSkills() != null && resume.getSkills().split(",").length >= 5) completenessScore += 5;
        if ((resume.getExperienceJson() != null && resume.getExperienceJson().length() > 10) ||
            (resume.getEducationJson() != null && resume.getEducationJson().length() > 30)) {
            completenessScore += 5;
        }
        if (resume.getProjectsJson() != null && resume.getProjectsJson().length() > 30) completenessScore += 5;

        int totalScore = Math.min(100, keywordScore + impactScore + completenessScore);

        String verdict;
        boolean worthApplying;
        if (totalScore >= 80) {
            verdict = "Highly Worthy — Top 10% Ace Score for " + role;
            worthApplying = true;
        } else if (totalScore >= 65) {
            verdict = "Worth Applying — Competitive Ace Score";
            worthApplying = true;
        } else if (totalScore >= 45) {
            verdict = "Borderline — Add Missing Role Keywords";
            worthApplying = false;
        } else {
            verdict = "Low Ace Score — Needs Role Tailoring";
            worthApplying = false;
        }

        Map<String, Object> result = new HashMap<>();
        result.put("score", totalScore);
        result.put("verdict", verdict);
        result.put("worthApplying", worthApplying);
        result.put("matchedKeywords", matchedKeywords);
        result.put("missingKeywords", missingKeywords);
        return result;
    }
}
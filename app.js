/* ===== Nexus Banking Architect — GitHub Models API Integration ===== */

// ── GitHub Copilot / GitHub Models available models ──
const GITHUB_MODELS = [
    {
        id: 'claude-opus-4-5',
        name: 'Claude Opus 4.5',
        provider: 'Anthropic',
        tags: ['claude', 'powerful'],
        desc: 'Most capable Claude model. Best for complex architectural analysis.'
    },
    {
        id: 'claude-sonnet-4-5',
        name: 'Claude Sonnet 4.5',
        provider: 'Anthropic',
        tags: ['claude', 'fast'],
        desc: 'Balanced speed and intelligence. Ideal for doc generation.'
    },
    {
        id: 'claude-haiku-3-5',
        name: 'Claude Haiku 3.5',
        provider: 'Anthropic',
        tags: ['claude', 'fast'],
        desc: 'Fastest Claude model. Great for quick summaries.'
    },
    {
        id: 'gpt-4o',
        name: 'GPT-4o',
        provider: 'OpenAI',
        tags: ['openai', 'powerful'],
        desc: 'OpenAI flagship model with multimodal capabilities.'
    },
    {
        id: 'gpt-4o-mini',
        name: 'GPT-4o mini',
        provider: 'OpenAI',
        tags: ['openai', 'fast'],
        desc: 'Cost-efficient, fast model for high-volume tasks.'
    },
    {
        id: 'o1',
        name: 'o1',
        provider: 'OpenAI',
        tags: ['openai', 'powerful'],
        desc: 'Advanced reasoning model for complex code analysis.'
    },
    {
        id: 'o1-mini',
        name: 'o1-mini',
        provider: 'OpenAI',
        tags: ['openai', 'fast'],
        desc: 'Fast reasoning model, great for coding tasks.'
    },
    {
        id: 'o3-mini',
        name: 'o3-mini',
        provider: 'OpenAI',
        tags: ['openai', 'fast'],
        desc: 'Efficient reasoning model optimised for STEM tasks.'
    }
];

const GITHUB_API_ENDPOINT = 'https://models.inference.ai.azure.com/chat/completions';

// ── App State ──
const state = {
    currentPage: 'overview',
    sourceQueue: [],
    repos: [],
    ghToken: localStorage.getItem('nexus_gh_token') || '',
    selectedModel: localStorage.getItem('nexus_model') || '',
};

// ── Domain & Repo Data ──
const domains = [
    { id: 'loans', name: 'Loans & Lending', icon: '🏦', color: '#3b82f6',
      desc: 'Mortgage, personal, auto and student loan lifecycle management including origination, underwriting, and servicing.', repos: 12, services: 8 },
    { id: 'payments', name: 'Payments & Transfers', icon: '💳', color: '#10b981',
      desc: 'Real-time payments (RTP), ACH, wire transfers, and ISO 20022 messaging gateway orchestration.', repos: 15, services: 11 },
    { id: 'fraud', name: 'Fraud Detection', icon: '🛡️', color: '#f43f5e',
      desc: 'Real-time transaction monitoring, ML-based anomaly detection, and case management workflows.', repos: 8, services: 6 },
    { id: 'wealth', name: 'Wealth Management', icon: '📈', color: '#f59e0b',
      desc: 'Portfolio management, robo-advisory services, and investment product catalog.', repos: 10, services: 7 },
    { id: 'kyc', name: 'KYC & Compliance', icon: '🔍', color: '#7c3aed',
      desc: 'Know Your Customer identity verification, AML screening, and regulatory reporting pipelines.', repos: 9, services: 5 },
    { id: 'accounts', name: 'Core Banking', icon: '🏛️', color: '#06b6d4',
      desc: 'Account management, ledger services with ACID compliance, and customer master data.', repos: 14, services: 9 },
    { id: 'trade', name: 'Trade Finance', icon: '🚢', color: '#ec4899',
      desc: 'Letters of credit, trade guarantees, supply chain finance, and cross-border settlement orchestration.', repos: 7, services: 5 },
    { id: 'digital', name: 'Digital Banking', icon: '📱', color: '#8b5cf6',
      desc: 'Mobile & internet banking channels, open banking APIs (PSD2/FAPI), and customer engagement platform.', repos: 11, services: 8 }
];

const sampleRepos = [
    { name: 'payment-gateway-service', domain: 'Payments', lang: 'Java', services: 3, status: 'Documented', patterns: ['API Gateway', 'Circuit Breaker'] },
    { name: 'fraud-ml-engine', domain: 'Fraud', lang: 'Python', services: 2, status: 'Documented', patterns: ['Event-Driven', 'Pub/Sub'] },
    { name: 'loan-origination-api', domain: 'Loans', lang: 'Java', services: 4, status: 'Pending', patterns: ['CQRS', 'Event Sourcing'] },
    { name: 'kyc-verification-service', domain: 'KYC', lang: 'Go', services: 2, status: 'Documented', patterns: ['Saga Pattern', 'Anti-Corruption'] },
    { name: 'core-ledger-system', domain: 'Core Banking', lang: 'Java', services: 3, status: 'In Progress', patterns: ['Double-Entry', 'ACID SQL'] },
    { name: 'wealth-portfolio-mgr', domain: 'Wealth', lang: 'TypeScript', services: 2, status: 'Pending', patterns: ['BFF', 'Hexagonal'] },
    { name: 'iso20022-adapter', domain: 'Payments', lang: 'Java', services: 1, status: 'Documented', patterns: ['Anti-Corruption Layer'] },
    { name: 'aml-screening-pipeline', domain: 'KYC', lang: 'Python', services: 2, status: 'Documented', patterns: ['Batch Processing'] },
    { name: 'trade-finance-portal', domain: 'Trade Finance', lang: 'Java', services: 3, status: 'In Progress', patterns: ['Strangler Fig'] },
    { name: 'digital-banking-bff', domain: 'Digital Banking', lang: 'TypeScript', services: 2, status: 'Documented', patterns: ['BFF', 'Micro-frontend'] },
    { name: 'open-banking-gateway', domain: 'Digital Banking', lang: 'Go', services: 1, status: 'Documented', patterns: ['Sidecar', 'OAuth'] },
    { name: 'mortgage-engine', domain: 'Loans', lang: 'Java', services: 5, status: 'Pending', patterns: ['Rules Engine', 'CQRS'] }
];

// ── Banking institutions for comparison ──
const BANKS = [
    { id: 'citizenbank',  name: 'CitizenBank',    type: 'Retail Bank' },
    { id: 'wealthfirst', name: 'WealthFirst',     type: 'Wealth Management' },
    { id: 'paystream',   name: 'PayStream',       type: 'Digital Payments' },
    { id: 'tradehaus',   name: 'TradeHaus',       type: 'Trade Finance' },
    { id: 'neobank',     name: 'NeoBankX',        type: 'Neobank' },
    { id: 'unioncore',   name: 'UnionCore',       type: 'Core Banking' },
    { id: 'securevault', name: 'SecureVault',     type: 'Custodian Bank' }
];

// Per-bank comparison data keyed by bank id
const BANK_COMPARE_DATA = {
    citizenbank: {
        rows: [
            { feature: 'Payment Gateway', generic: 'Standard ISO 20022', custom: 'Extended with SWIFT gpi + SEPA Instant', type: 'override' },
            { feature: 'KYC Workflow',    generic: '3-step verification', custom: '5-step + biometric + liveness check', type: 'custom' },
            { feature: 'Fraud Engine',    generic: 'Rule-based only',     custom: 'ML + Rule hybrid (XGBoost)',         type: 'override' },
            { feature: 'Ledger System',   generic: 'Double-entry',        custom: 'Double-entry',                       type: 'standard' },
            { feature: 'API Auth',        generic: 'OAuth 2.0',           custom: 'OAuth 2.0 + MFA + step-up',          type: 'custom' },
            { feature: 'Channels',        generic: 'Web + Mobile',        custom: 'Web + Mobile + IVR + ATM',           type: 'custom' },
            { feature: 'Batch Processing',generic: 'Nightly batch',       custom: 'Near real-time micro-batch',          type: 'override' },
            { feature: 'Encryption',      generic: 'AES-256',             custom: 'AES-256',                            type: 'standard' }
        ],
        summary: '5 custom overrides · 2 custom extensions · 2 standard. Key differentiators: SWIFT gpi, biometric KYC, ML fraud, IVR channel.'
    },
    wealthfirst: {
        rows: [
            { feature: 'Portfolio Engine',generic: 'Standard rebalancing',custom: 'Goal-based + ESG scoring',           type: 'override' },
            { feature: 'Risk Profiling',  generic: 'Questionnaire-based', custom: 'AI-driven behavioural analysis',      type: 'override' },
            { feature: 'Reporting',       generic: 'PDF statements',      custom: 'Real-time interactive dashboards',    type: 'custom' },
            { feature: 'Ledger System',   generic: 'Double-entry',        custom: 'Double-entry',                        type: 'standard' },
            { feature: 'Fee Engine',      generic: 'Flat fee',            custom: 'Tiered AUM-based + performance fee',  type: 'custom' },
            { feature: 'Compliance',      generic: 'MiFID II standard',   custom: 'MiFID II + FATCA + CRS',              type: 'custom' },
            { feature: 'Channels',        generic: 'Web + Mobile',        custom: 'Web + Mobile + Advisor Portal',       type: 'custom' },
            { feature: 'Encryption',      generic: 'AES-256',             custom: 'AES-256 + HSM key custody',           type: 'custom' }
        ],
        summary: '2 overrides · 5 custom extensions · 1 standard. ESG scoring and AI risk profiling are the headline innovations.'
    },
    paystream: {
        rows: [
            { feature: 'Payment Rails',   generic: 'ACH + Wire',          custom: 'RTP + FedNow + UPI + Open Banking',  type: 'override' },
            { feature: 'Fraud Engine',    generic: 'Rule-based only',     custom: 'Real-time ML scoring (<50ms)',        type: 'override' },
            { feature: 'Settlement',      generic: 'T+2',                 custom: 'Instant (24/7)',                      type: 'override' },
            { feature: 'Ledger System',   generic: 'Double-entry',        custom: 'Double-entry + shadow ledger',        type: 'custom' },
            { feature: 'API Auth',        generic: 'OAuth 2.0',           custom: 'OAuth 2.0 + FAPI 2.0',               type: 'custom' },
            { feature: 'FX',              generic: 'Daily rate refresh',  custom: 'Live FX streaming (Reuters)',         type: 'override' },
            { feature: 'Reconciliation',  generic: 'End-of-day',         custom: 'Continuous real-time',                type: 'override' },
            { feature: 'Encryption',      generic: 'AES-256',             custom: 'AES-256',                            type: 'standard' }
        ],
        summary: '5 overrides · 2 custom extensions · 1 standard. PayStream focuses on real-time rails, instant settlement, and live FX.'
    },
    tradehaus: {
        rows: [
            { feature: 'LC Issuance',     generic: 'Manual workflow',     custom: 'Digital LC on blockchain (R3 Corda)', type: 'override' },
            { feature: 'Document Check',  generic: 'Manual review',       custom: 'AI OCR + NLP validation',            type: 'override' },
            { feature: 'Settlement',      generic: 'T+2',                 custom: 'DvP Atomic settlement',               type: 'override' },
            { feature: 'Compliance',      generic: 'OFAC screening',      custom: 'OFAC + UN + EU + jurisdiction rules', type: 'custom' },
            { feature: 'Counterparty KYC',generic: '3-step verification', custom: '7-step + site visit workflow',        type: 'custom' },
            { feature: 'Financing',       generic: 'Standard trade loan',  custom: 'Supply chain finance + factoring',    type: 'custom' },
            { feature: 'Channels',        generic: 'Web Portal',          custom: 'Web + SWIFT MT + API hub',            type: 'custom' },
            { feature: 'Encryption',      generic: 'AES-256',             custom: 'AES-256',                            type: 'standard' }
        ],
        summary: '3 overrides · 4 custom extensions · 1 standard. Blockchain LC and AI document processing differentiate TradeHaus.'
    },
    neobank: {
        rows: [
            { feature: 'Onboarding',      generic: 'Branch-based',        custom: 'Full mobile KYC in <5 min',           type: 'override' },
            { feature: 'Core Engine',     generic: 'Monolithic core',     custom: 'Cloud-native micro-ledger',           type: 'override' },
            { feature: 'Fraud Engine',    generic: 'Rule-based only',     custom: 'Generative AI anomaly detection',     type: 'override' },
            { feature: 'Savings',         generic: 'Fixed rate',          custom: 'Micro-savings + round-up algorithm',  type: 'custom' },
            { feature: 'Payments',        generic: 'ACH + Wire',          custom: 'RTP + card issuance + crypto ramp',   type: 'override' },
            { feature: 'Notifications',   generic: 'Email / SMS',         custom: 'Push + WhatsApp + in-app nudges',     type: 'custom' },
            { feature: 'Open Banking',    generic: 'Not supported',       custom: 'PSD2 + FDX APIs',                     type: 'custom' },
            { feature: 'Infrastructure', generic: 'On-premises',          custom: '100% AWS serverless',                 type: 'override' }
        ],
        summary: '5 overrides · 3 custom extensions · 0 standard. NeoBankX is a fully cloud-native challenger with Gen-AI fraud detection.'
    },
    unioncore: {
        rows: [
            { feature: 'Core System',     generic: 'T24 / Finacle',       custom: 'Proprietary Union Core v4',           type: 'override' },
            { feature: 'Ledger',          generic: 'Double-entry',        custom: 'Double-entry',                        type: 'standard' },
            { feature: 'Batch Jobs',      generic: 'Nightly batch',       custom: 'Nightly batch',                       type: 'standard' },
            { feature: 'KYC',             generic: '3-step verification', custom: '3-step + cooperative member check',   type: 'custom' },
            { feature: 'Lending',         generic: 'Standard score card', custom: 'Community score + peer review',       type: 'custom' },
            { feature: 'Payments',        generic: 'ACH + Wire',          custom: 'ACH + Wire + internal transfer pool',  type: 'custom' },
            { feature: 'Reporting',       generic: 'GAAP statements',     custom: 'GAAP + NCUA regulatory reporting',    type: 'custom' },
            { feature: 'Encryption',      generic: 'AES-256',             custom: 'AES-256',                             type: 'standard' }
        ],
        summary: '1 override · 4 custom extensions · 3 standard. UnionCore is a traditional co-operative bank with a custom core system.'
    },
    securevault: {
        rows: [
            { feature: 'Asset Custody',   generic: 'Standard safe-keep',  custom: 'Multi-asset (equities, bonds, crypto)',type: 'override' },
            { feature: 'Settlement',      generic: 'T+2',                 custom: 'T+0 DVP via CSD connector',           type: 'override' },
            { feature: 'Reporting',       generic: 'PDF statements',      custom: 'SWIFT ISO 20022 + SFTP + API',        type: 'override' },
            { feature: 'Compliance',      generic: 'OFAC screening',      custom: 'OFAC + MAS + FCA + SEC rules',        type: 'custom' },
            { feature: 'Key Management',  generic: 'Software HSM',        custom: 'Dedicated Thales HSM cluster',         type: 'custom' },
            { feature: 'Audit Trail',     generic: 'DB logs',             custom: 'Immutable blockchain audit log',       type: 'custom' },
            { feature: 'Client Portal',   generic: 'Web Portal',          custom: 'Web + API + SWIFT connectivity',       type: 'custom' },
            { feature: 'Encryption',      generic: 'AES-256',             custom: 'AES-256-GCM + FIPS 140-2 L3',        type: 'custom' }
        ],
        summary: '3 overrides · 5 custom extensions · 0 standard. SecureVault specialises in multi-asset custody with hardware security modules.'
    }
};

// ══════════════════════════════════════════
//  GITHUB MODELS API
// ══════════════════════════════════════════
async function callGitHubModel(messages, modelOverride) {
    const model = modelOverride || state.selectedModel;
    const token = state.ghToken;
    if (!token) throw new Error('No GitHub token configured. Go to AI Settings.');
    if (!model) throw new Error('No model selected. Go to AI Settings.');

    const resp = await fetch(GITHUB_API_ENDPOINT, {
        method: 'POST',
        headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({ model, messages, max_tokens: 2048, temperature: 0.5 })
    });

    if (!resp.ok) {
        const err = await resp.json().catch(() => ({}));
        throw new Error(err?.error?.message || `API error ${resp.status}`);
    }
    const data = await resp.json();
    return data.choices?.[0]?.message?.content || '';
}

// ══════════════════════════════════════════
//  INIT
// ══════════════════════════════════════════
document.addEventListener('DOMContentLoaded', () => {
    initNavigation();
    initTabs();
    initGenerator();
    initCompare();
    initSettings();
    document.querySelectorAll('.nav-sub-item').forEach(link => {
        link.addEventListener('click', (e) => {
            e.preventDefault();
            document.querySelectorAll('.nav-sub-item').forEach(l => {
                l.classList.remove('active');
                l.style.background = 'transparent';
                l.style.borderLeftColor = 'transparent';
                l.style.color = 'var(--text-secondary)';
            });
            link.classList.add('active');
            link.style.background = 'rgba(124, 58, 237, 0.15)';
            link.style.borderLeftColor = 'var(--accent-purple)';
            link.style.color = 'var(--text-primary)';
            renderOverview();
            renderRepos();
        });
    });
    
    document.getElementById('archFormatSelect').addEventListener('change', () => {
        const activeLink = document.querySelector('.nav-sub-item.active');
        const bankId = activeLink ? activeLink.dataset.bank : 'generic';
        renderArchDiagram(bankId);
    });
    renderRepos();
    initMermaidTheme();
    renderOverview();
    renderRecommendations();
    updateModelChip();
    updateGenModelStatus();
});

// ══════════════════════════════════════════
//  NAVIGATION
// ══════════════════════════════════════════
function initNavigation() {
    document.querySelectorAll('.nav-item').forEach(item => {
        item.addEventListener('click', e => {
            e.preventDefault();
            switchPage(item.dataset.page);
        });
    });
    document.getElementById('menuToggle').addEventListener('click', () => {
        document.getElementById('sidebar').classList.toggle('open');
    });
}

function switchPage(page) {
    state.currentPage = page;
    document.querySelectorAll('.nav-item').forEach(n => n.classList.remove('active'));
    const navEl = document.querySelector(`[data-page="${page}"]`);
    if (navEl) navEl.classList.add('active');
    document.querySelectorAll('.page').forEach(p => p.classList.remove('active'));
    const pageEl = document.getElementById(`page-${page}`);
    if (pageEl) pageEl.classList.add('active');
    const names = {
        overview: 'Product Overview', generator: 'Documentation Generator',
        repos: 'Repository Explorer', compare: 'Comparative Analysis', 
        recommendations: 'Architecture Recommendations', settings: 'AI Settings'
    };
    document.getElementById('breadcrumb').textContent = names[page] || page;
}

// ══════════════════════════════════════════
//  AI SETTINGS
// ══════════════════════════════════════════
function initSettings() {
    populateModelDropdowns();

    // Restore saved token
    const tokenInput = document.getElementById('ghToken');
    if (state.ghToken) tokenInput.value = state.ghToken;

    document.getElementById('saveTokenBtn').addEventListener('click', () => {
        const val = tokenInput.value.trim();
        if (!val) return showTokenStatus('error', '⚠ Token cannot be empty.');
        state.ghToken = val;
        localStorage.setItem('nexus_gh_token', val);
        showTokenStatus('success', '✓ Token saved. Select a model and test your connection below.');
        updateModelChip();
    });

    // Settings page model dropdown
    const modelDropdown = document.getElementById('modelDropdown');
    modelDropdown.addEventListener('change', () => {
        selectModel(modelDropdown.value);
    });

    document.getElementById('testConnectionBtn').addEventListener('click', runConnectionTest);
    document.getElementById('testModelBtn').addEventListener('click', runInlineTest);
}

/** Populate BOTH the topbar <select> and the settings-page <select> */
function populateModelDropdowns() {
    const topbar = document.getElementById('topbarModelSelect');
    const settings = document.getElementById('modelDropdown');

    const makeOptions = () => GITHUB_MODELS.map(m =>
        `<option value="${m.id}"${state.selectedModel === m.id ? ' selected' : ''}>${m.provider} — ${m.name}</option>`
    ).join('');

    // Topbar
    topbar.innerHTML = '<option value="">— Select Model —</option>' + makeOptions();
    topbar.addEventListener('change', () => selectModel(topbar.value));

    // Settings dropdown
    settings.innerHTML = '<option value="">— Choose a model —</option>' + makeOptions();

    // Render reference grid (visual-only cards)
    renderModelRefGrid();

    // Show info panel for already-selected model
    if (state.selectedModel) updateModelInfoPanel(state.selectedModel);
}

function renderModelRefGrid() {
    const grid = document.getElementById('modelRefGrid');
    if (!grid) return;
    grid.innerHTML = GITHUB_MODELS.map(m => {
        const tagsCls = m.tags.map(t => `<span class="model-tag model-tag-${t}">${t}</span>`).join('');
        const chosen = state.selectedModel === m.id ? ' selected' : '';
        return `
        <div class="model-card${chosen}" data-model-id="${m.id}" onclick="selectModel('${m.id}')">
            <div class="model-provider">${m.provider}</div>
            <div class="model-name">${m.name}</div>
            <div class="model-id">${m.id}</div>
            <div class="model-tags">${tagsCls}</div>
            <div style="font-size:0.75rem;color:var(--text-muted);margin-top:8px">${m.desc}</div>
        </div>`;
    }).join('');
}

function updateModelInfoPanel(modelId) {
    const panel = document.getElementById('modelInfoPanel');
    const nameEl = document.getElementById('modelInfoName');
    const idEl   = document.getElementById('modelInfoId');
    const tagsEl = document.getElementById('modelInfoTags');
    const descEl = document.getElementById('modelInfoDesc');
    if (!panel) return;
    const m = GITHUB_MODELS.find(x => x.id === modelId);
    if (!m) { panel.classList.add('hidden'); return; }
    nameEl.textContent = m.name;
    idEl.textContent   = m.id;
    tagsEl.innerHTML   = m.tags.map(t => `<span class="model-tag model-tag-${t}">${t}</span>`).join('');
    descEl.textContent = m.desc;
    panel.classList.remove('hidden');
}

function selectModel(modelId) {
    state.selectedModel = modelId;
    localStorage.setItem('nexus_model', modelId);
    // Sync both dropdowns
    const topbar   = document.getElementById('topbarModelSelect');
    const settings = document.getElementById('modelDropdown');
    if (topbar)   topbar.value   = modelId;
    if (settings) settings.value = modelId;
    // Sync reference grid cards
    document.querySelectorAll('.model-card').forEach(c => {
        c.classList.toggle('selected', c.dataset.modelId === modelId);
    });
    updateModelChip();
    updateGenModelStatus();
    updateModelInfoPanel(modelId);
}

function showTokenStatus(type, msg) {
    const el = document.getElementById('tokenStatus');
    el.textContent = msg;
    el.className = `token-status ${type}`;
    el.classList.remove('hidden');
}

/** Update the topbar select's dot indicator */
function updateModelChip() {
    const dot    = document.getElementById('modelChipDot');
    const select = document.getElementById('topbarModelSelect');
    const model  = GITHUB_MODELS.find(m => m.id === state.selectedModel);
    if (!dot || !select) return;
    if (model && state.ghToken) {
        dot.style.background  = 'var(--accent-green)';
        dot.style.boxShadow   = '0 0 6px var(--accent-green)';
        // Ensure correct option selected
        select.value = state.selectedModel;
    } else if (model) {
        dot.style.background  = 'var(--accent-amber)';
        dot.style.boxShadow   = 'none';
        select.value = state.selectedModel;
    } else {
        dot.style.background  = 'var(--text-muted)';
        dot.style.boxShadow   = 'none';
        select.value = '';
    }
}

function updateGenModelStatus() {
    const dot = document.getElementById('genModelDot');
    const name = document.getElementById('genModelName');
    const testRow = document.getElementById('aiTestRow');
    const model = GITHUB_MODELS.find(m => m.id === state.selectedModel);
    if (model && state.ghToken) {
        dot.style.background = 'var(--accent-green)';
        dot.style.boxShadow = '0 0 6px var(--accent-green)';
        name.textContent = model.name + ' — Ready';
        testRow.classList.remove('hidden');
    } else if (model) {
        dot.style.background = 'var(--accent-amber)';
        dot.style.boxShadow = 'none';
        name.textContent = model.name + ' — Token missing';
        testRow.classList.add('hidden');
    } else {
        dot.style.background = 'var(--text-muted)';
        dot.style.boxShadow = 'none';
        name.textContent = 'No model configured';
        testRow.classList.add('hidden');
    }
}

async function runConnectionTest() {
    const btn = document.getElementById('testConnectionBtn');
    const prompt = document.getElementById('testPromptSettings').value.trim();
    const respEl = document.getElementById('testResponse');
    const bodyEl = document.getElementById('testResponseBody');
    const modelUsedEl = document.getElementById('testModelUsed');
    const timeEl = document.getElementById('testResponseTime');

    if (!prompt) return;
    btn.textContent = 'Sending…';
    btn.disabled = true;
    respEl.classList.remove('hidden');
    bodyEl.textContent = 'Waiting for response…';
    const start = Date.now();

    try {
        const reply = await callGitHubModel([
            { role: 'system', content: 'You are the Nexus Banking Architect, an expert in enterprise banking systems.' },
            { role: 'user', content: prompt }
        ]);
        const elapsed = ((Date.now() - start) / 1000).toFixed(2);
        const model = GITHUB_MODELS.find(m => m.id === state.selectedModel);
        modelUsedEl.textContent = `✓ ${model?.name || state.selectedModel}`;
        timeEl.textContent = `${elapsed}s`;
        bodyEl.textContent = reply;
    } catch (err) {
        modelUsedEl.textContent = '✗ Error';
        timeEl.textContent = '';
        bodyEl.textContent = err.message;
    } finally {
        btn.textContent = 'Send';
        btn.disabled = false;
    }
}

async function runInlineTest() {
    const btn = document.getElementById('testModelBtn');
    const prompt = document.getElementById('testPrompt').value.trim();
    const resultEl = document.getElementById('aiTestResult');
    if (!prompt) return;
    btn.textContent = '…';
    btn.disabled = true;
    resultEl.textContent = 'Thinking…';
    resultEl.classList.remove('hidden');
    try {
        const reply = await callGitHubModel([
            { role: 'system', content: 'You are the Nexus Banking Architect.' },
            { role: 'user', content: prompt }
        ]);
        resultEl.textContent = reply;
    } catch (err) {
        resultEl.textContent = '⚠ ' + err.message;
    } finally {
        btn.textContent = 'Test';
        btn.disabled = false;
    }
}

// ══════════════════════════════════════════
//  TABS (Doc Generator page)
// ══════════════════════════════════════════
function initTabs() {
    const bar = document.getElementById('sourceTabBar');
    if (!bar) return;
    bar.querySelectorAll('.tab').forEach(tab => {
        tab.addEventListener('click', () => {
            bar.querySelectorAll('.tab').forEach(t => t.classList.remove('active'));
            tab.classList.add('active');
            document.querySelectorAll('.tab-content').forEach(c => c.classList.remove('active'));
            const target = document.getElementById('tab-' + tab.dataset.tab);
            if (target) target.classList.add('active');
        });
    });
}

// ══════════════════════════════════════════
//  GENERATOR
// ══════════════════════════════════════════
function initGenerator() {
    document.getElementById('addUrlBtn').addEventListener('click', addUrl);
    document.getElementById('repoUrl').addEventListener('keydown', e => { if (e.key === 'Enter') addUrl(); });
    document.getElementById('parseBulkBtn').addEventListener('click', parseBulk);
    document.getElementById('generateBtn').addEventListener('click', startGeneration);
    document.getElementById('uploadZone').addEventListener('click', () => document.getElementById('fileInput').click());
    document.getElementById('fileInput').addEventListener('change', handleFileUpload);
    const optAll = document.getElementById('opt-all');
    optAll.addEventListener('change', () => {
        document.querySelectorAll('.doc-opt').forEach(c => { c.checked = optAll.checked; });
    });
    const zone = document.getElementById('uploadZone');
    zone.addEventListener('dragover', e => { e.preventDefault(); zone.style.borderColor = '#00f0ff'; });
    zone.addEventListener('dragleave', () => { zone.style.borderColor = ''; });
    zone.addEventListener('drop', e => { e.preventDefault(); zone.style.borderColor = ''; handleFiles(e.dataTransfer.files); });
}

function addUrl() {
    const input = document.getElementById('repoUrl');
    const url = input.value.trim();
    if (!url) return;
    state.sourceQueue.push({ type: 'url', value: url });
    input.value = '';
    renderQueue();
}

function parseBulk() {
    const text = document.getElementById('bulkLinks').value.trim();
    const links = text.split('\n').map(l => l.trim()).filter(l => l.length > 0);
    links.forEach(l => state.sourceQueue.push({ type: 'url', value: l }));
    document.getElementById('bulkLinks').value = '';
    renderQueue();
}

function handleFileUpload(e) { handleFiles(e.target.files); }
function handleFiles(files) {
    Array.from(files).forEach(f => state.sourceQueue.push({ type: 'file', value: f.name }));
    renderQueue();
}

function renderQueue() {
    const list = document.getElementById('queueList');
    document.getElementById('queueCount').textContent = state.sourceQueue.length;
    list.innerHTML = state.sourceQueue.map((item, i) => `
        <div class="queue-item">
            <span>${item.type === 'url' ? '🔗' : '📁'}</span>
            <span style="flex:1;overflow:hidden;text-overflow:ellipsis">${item.value}</span>
            <button class="remove-btn" onclick="removeFromQueue(${i})">×</button>
        </div>`).join('');
}

function removeFromQueue(index) {
    state.sourceQueue.splice(index, 1);
    renderQueue();
}

async function startGeneration() {
    if (state.sourceQueue.length === 0) {
        state.sourceQueue = sampleRepos.slice(0, 4).map(r => ({
            type: 'url', value: `https://github.com/nexus-bank/${r.name}.git`
        }));
        renderQueue();
    }

    const section = document.getElementById('progressSection');
    const fill = document.getElementById('progressFill');
    const pct = document.getElementById('progressPct');
    const log = document.getElementById('progressLog');
    const label = document.getElementById('progressLabel');
    section.classList.remove('hidden');
    log.innerHTML = '';
    fill.style.width = '0%';

    const hasAI = state.ghToken && state.selectedModel;
    const model = GITHUB_MODELS.find(m => m.id === state.selectedModel);

    label.textContent = hasAI
        ? `Processing with ${model?.name || state.selectedModel}…`
        : 'Processing (Demo mode — configure AI for real generation)…';

    const addLog = (msg, cls = '') => {
        log.innerHTML += `<div class="log-entry ${cls}">${msg}</div>`;
        log.scrollTop = log.scrollHeight;
    };

    const setProgress = (p) => { fill.style.width = p + '%'; pct.textContent = p + '%'; };

    // Phase 1 — always runs locally
    addLog('🔗 Cloning repositories…', 'log-info');
    await delay(500); setProgress(10);
    addLog(`📊 Detected ${state.sourceQueue.length} source(s) in queue`);
    await delay(400); setProgress(20);
    addLog('🔍 Detecting languages: Java, Python, Go, TypeScript');
    await delay(400); setProgress(28);

    if (hasAI) {
        addLog(`🤖 Phase 1: Calling ${model?.name} — summarising components…`, 'log-info');
        setProgress(35);
        try {
            const summary = await callGitHubModel([
                { role: 'system', content: 'You are the Nexus Banking Architect. Respond concisely.' },
                { role: 'user', content: `Analyse this list of banking microservices: ${state.sourceQueue.map(s => s.value).join(', ')}. Identify: 1) Languages/frameworks 2) Cross-service dependencies 3) Banking domains. Be brief.` }
            ]);
            addLog('✓ AI Component Metadata: ' + summary.slice(0, 200) + '…', 'log-success');
        } catch (err) {
            addLog('⚠ AI call failed: ' + err.message + ' — falling back to demo mode.');
        }
        setProgress(55);

        addLog(`🤖 Phase 2: Calling ${model?.name} — aggregating architecture…`, 'log-info');
        await delay(300);
        try {
            const arch = await callGitHubModel([
                { role: 'system', content: 'You are the Nexus Banking Architect. Respond concisely.' },
                { role: 'user', content: 'Generate a 3-sentence product-level HLD for a banking ecosystem with Payment Gateway, Fraud Detection, Loan Origination, and KYC services.' }
            ]);
            addLog('✓ Product HLD: ' + arch.slice(0, 180) + '…', 'log-success');
        } catch (err) {
            addLog('⚠ Phase 2 AI call failed: ' + err.message);
        }
        setProgress(78);

        addLog('📝 Phase 3: Generating documentation artifacts…', 'log-info');
        await delay(400); setProgress(90);
        addLog('✓ Architecture diagrams (Cytoscape HLD & Mermaid LLD) saved as SVG');
        await delay(300); setProgress(96);
        addLog('✓ API Catalog compiled and saved');
    } else {
        // ── Demo simulation ──
        const steps = [
            { msg: '🤖 Demo mode — configure AI for real generation', pct: 35, cls: 'log-info' },
            { msg: 'Phase 1: Generating Component Metadata Files…', pct: 50, cls: 'log-info' },
            { msg: 'Extracting API endpoints from annotations…', pct: 60, cls: '' },
            { msg: 'Building class dependency graphs…', pct: 70, cls: '' },
            { msg: 'Phase 2: Assembling Product-Level Architecture…', pct: 80, cls: 'log-info' },
            { msg: 'Generating Mermaid.js LLD diagrams and saving as SVG…', pct: 88, cls: '' },
            { msg: 'Generating Cytoscape HLD maps and saving as SVG…', pct: 92, cls: '' },
            { msg: 'Writing HLD & LLD documents…', pct: 96, cls: '' }
        ];
        for (const s of steps) {
            await delay(500);
            addLog(s.msg, s.cls);
            setProgress(s.pct);
        }
    }

    await delay(400); setProgress(100);
    addLog('🎉 Documentation generation complete!', 'log-success');
    await delay(1200);
    
    const activeLink = document.querySelector('.nav-sub-item.active');
    const bankId = activeLink ? activeLink.dataset.bank : 'generic';
    
    if (bankId === 'citizenbank' && state.sourceQueue && state.sourceQueue.length > 0) {
        if (!state.citizenRepos) state.citizenRepos = [];
        state.sourceQueue.forEach(v => {
            const rName = v.value.split('/').pop().replace('.git', '');
            if (!state.citizenRepos.find(x => x.name === rName)) {
                state.citizenRepos.push({
                    name: rName, domain: 'Digital', lang: 'TypeScript', services: 1, status: 'Documented', patterns: ['Dynamic Injection']
                });
            }
        });
        state.sourceQueue = [];
        renderQueue();
    }
    
    switchPage('repos');
    renderRepos();
}

const delay = ms => new Promise(r => setTimeout(r, ms));

// ══════════════════════════════════════════
//  REPOS
// ══════════════════════════════════════════
function renderRepos() {
    const list = document.getElementById('repoList');
    
    const activeLink = document.querySelector('.nav-sub-item.active');
    const bankId = activeLink ? activeLink.dataset.bank : 'generic';

    let reposToRender = [];
    if (bankId === 'citizenbank') {
        if (!state.citizenRepos || state.citizenRepos.length === 0) {
            list.innerHTML = `<div style="text-align:center; padding: 48px; border:2px dashed var(--border); border-radius:var(--radius); color:var(--text-muted); grid-column: 1 / -1; width: 100%;">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" width="48" height="48" style="margin-bottom:16px; opacity:0.5;"><path d="M22 19a2 2 0 01-2 2H4a2 2 0 01-2-2V5a2 2 0 012-2h5l2 3h9a2 2 0 012 2z"/></svg>
                <p style="font-size:1.1rem;margin-bottom:8px;font-weight:600;color:var(--text-secondary);">No Repositories Synced</p>
                <p style="font-size:0.85rem">CitizenBank ecosystem has 0 synchronized repositories. Navigate to Doc Generator to process new sources.</p>
            </div>`;
            return;
        }
        reposToRender = state.citizenRepos;
    } else {
        reposToRender = sampleRepos;
    }

    const icons = { Java: '☕', Python: '🐍', Go: '🔷', TypeScript: '📘' };
    const statusColors = { 'Documented': 'tag-standard', 'Pending': 'tag-custom', 'In Progress': 'tag-override' };
    
    list.innerHTML = reposToRender.map(r => {
        const patternBadges = (r.patterns || []).map(p => `<span class="tag" style="background:rgba(124,58,237,0.1);color:var(--accent-purple);border:1px solid rgba(124,58,237,0.2)">${p}</span>`).join('');
        const hasRec = state.recommendations && state.recommendations.find(x => x.repo === r.name);
        
        let btnAction = '';
        if (hasRec) {
            btnAction = `<button class="btn btn-outline" style="padding: 6px 12px; font-size: 0.75rem; border: 1px solid var(--border); background: var(--bg-deep); color: var(--text-primary);" onclick="event.stopPropagation(); switchPage('recommendations'); renderRecommendations();">View Record</button>`;
        } else if (bankId === 'generic') {
            btnAction = `<button class="btn btn-primary" style="padding: 6px 12px; font-size: 0.75rem; opacity: 0.5; cursor: not-allowed;" title="Architecture scanning is only enabled for specific client institutions (CitizenBank)" disabled>Scan Architecture</button>`;
        } else {
            btnAction = `<button class="btn btn-primary" style="padding: 6px 12px; font-size: 0.75rem;" onclick="generateRepoRecommendation('${r.name}', event)">Scan Architecture</button>`;
        }
        
        return `
        <div class="repo-item" onclick="openRepoDocs('${r.name}')">
            <div class="repo-icon">${icons[r.lang] || '📦'}</div>
            <div class="repo-info">
                <h3>${r.name}</h3>
                <p>${r.domain} • ${r.lang} • ${r.services} services</p>
                <div class="repo-badges" style="margin-top:8px; display:flex; gap:6px; flex-wrap:wrap;">${patternBadges}</div>
            </div>
            <div style="display: flex; flex-direction: column; align-items: flex-end; gap: 12px;">
                <div class="repo-badges"><span class="tag ${statusColors[r.status]}">${r.status}</span></div>
                ${btnAction}
            </div>
        </div>`;
    }).join('');
}

async function openRepoDocs(name) {
    const repo = sampleRepos.find(r => r.name === name);
    if (!repo) return;
    const modal = document.getElementById('docModal');
    const title = document.getElementById('modalTitle');
    const body = document.getElementById('modalBody');
    title.textContent = `📦 ${repo.name}`;
    body.innerHTML = getStaticRepoDocs(repo);
    modal.classList.remove('hidden');
    document.getElementById('modalClose').onclick = () => modal.classList.add('hidden');
    modal.onclick = e => { if (e.target === modal) modal.classList.add('hidden'); };
    setTimeout(() => mermaid.run(), 100);

    // Try to enhance with AI
    if (state.ghToken && state.selectedModel) {
        const aiSection = document.getElementById('aiDocSection');
        if (aiSection) {
            aiSection.innerHTML = '<i style="color:var(--text-muted);font-size:0.82rem">🤖 Generating AI analysis…</i>';
            try {
                const reply = await callGitHubModel([
                    { role: 'system', content: 'You are the Nexus Banking Architect. Be concise and technical.' },
                    { role: 'user', content: `Write a 3-sentence LLD (Low-Level Design) summary for a banking microservice named "${repo.name}" which is a ${repo.lang} service in the ${repo.domain} domain.` }
                ]);
                aiSection.innerHTML = `<p style="line-height:1.7;color:var(--text-secondary);font-size:0.88rem">${reply}</p>`;
            } catch (err) {
                aiSection.innerHTML = `<p style="color:var(--accent-amber);font-size:0.82rem">⚠ AI unavailable: ${err.message}</p>`;
            }
        }
    }
}

function getStaticRepoDocs(repo) {
    const hasAI = state.ghToken && state.selectedModel;
    const model = GITHUB_MODELS.find(m => m.id === state.selectedModel);
    const patternList = repo.patterns.map(p => `<li style="margin-bottom: 4px;"><span class="tag" style="background:rgba(124,58,237,0.1);color:var(--accent-purple);border:1px solid rgba(124,58,237,0.2);margin-right:8px;">${p}</span> detected dynamically via import mapping</li>`).join('');
    return `
        <h3>Component Overview</h3>
        <p><strong>${repo.name}</strong> — ${repo.lang} service in the <em>${repo.domain}</em> domain (${repo.services} internal services).</p>
        
        <h3 style="margin-top: 24px;">🧩 Detected System Patterns</h3>
        <ul style="padding-left: 20px; line-height: 1.6; margin-bottom: 24px;">${patternList}</ul>
        
        <h3>🏗️ Architecture</h3>
        <div class="mermaid">graph LR
    A[API Controller] --> B[Service Layer]
    B --> C[Repository / DAO]
    C --> D[(Database)]
    B --> E[Event Publisher]
    E --> F[Kafka]
    B --> G[External Client]</div>
        <h3>📋 HLD</h3>
        <p>Layered architecture with separation between API, business logic, and data persistence. Circuit-breaker patterns for external integrations.</p>
        <h3>🔧 LLD ${hasAI ? `<small style="color:var(--accent-cyan);font-size:0.72rem">AI-generated by ${model?.name}</small>` : ''}</h3>
        <div id="aiDocSection">${hasAI ? '' : '<p style="color:var(--text-muted);font-size:0.82rem">Configure AI in Settings for AI-generated LLD analysis.</p>'}</div>
        <h3>🔗 API Endpoints</h3>
        <table class="compare-table">
            <tr><th>Method</th><th>Endpoint</th><th>Auth</th></tr>
            <tr><td><code>GET</code></td><td><code>/api/v1/${repo.name.split('-')[0]}/health</code></td><td>None</td></tr>
            <tr><td><code>POST</code></td><td><code>/api/v1/${repo.name.split('-')[0]}/process</code></td><td>OAuth 2.0</td></tr>
            <tr><td><code>GET</code></td><td><code>/api/v1/${repo.name.split('-')[0]}/{id}</code></td><td>OAuth 2.0</td></tr>
        </table>`;
}

// ══════════════════════════════════════════
//  OVERVIEW
// ══════════════════════════════════════════
function renderOverview() {
    const activeLink = document.querySelector('.nav-sub-item.active');
    const bankId = activeLink ? activeLink.dataset.bank : 'generic';
    
    // Adjust data based on selected bank
    const isCitizen = bankId === 'citizenbank';
    const targets = isCitizen 
        ? { repos: 0, services: 0, apis: 0, docs: 0 }
        : { repos: 86, services: 59, apis: 412, docs: 186 };

    const domainsToRender = isCitizen 
        ? domains.filter(d => ['accounts', 'payments', 'fraud', 'digital', 'kyc'].includes(d.id)).map(d => ({...d, repos: 0, services: 0}))
        : domains;

    const grid = document.getElementById('domainGrid');
    grid.innerHTML = domainsToRender.map(d => `
        <div class="domain-card" style="--card-accent: ${d.color}" onclick="openDomainDocs('${d.id}')">
            <div class="domain-icon" style="background:${d.color}22; color:${d.color}">${d.icon}</div>
            <h3>${d.name}</h3>
            <p>${d.desc}</p>
            <div class="domain-meta"><span>📦 ${d.repos} repos</span><span>⚙️ ${d.services} services</span></div>
        </div>`).join('');

    animateStats(targets);
    renderArchDiagram(bankId);
}

function animateStats(targets) {
    Object.entries(targets).forEach(([key, target]) => {
        const el = document.getElementById(`stat-${key}`);
        let current = parseInt(el.textContent) || 0;
        if (current === target) return;
        const diff = target - current;
        const step = Math.ceil(Math.abs(diff) / 20) * Math.sign(diff);
        const iv = setInterval(() => {
            current += step;
            if ((step > 0 && current >= target) || (step < 0 && current <= target)) {
                current = target;
                clearInterval(iv);
            }
            el.textContent = current;
        }, 30);
    });
}

function initMermaidTheme() {
    mermaid.initialize({
        theme: 'dark',
        themeVariables: {
            primaryColor: '#1e293b', primaryTextColor: '#f1f5f9', primaryBorderColor: '#334155',
            lineColor: '#00f0ff', secondaryColor: '#1e293b', tertiaryColor: '#0f172a',
            fontFamily: 'Inter, sans-serif', fontSize: '13px'
        }
    });
}

function renderArchDiagram(bankId) {
    const format = document.getElementById('archFormatSelect')?.value || 'mindmap';
    const isCitizen = bankId === 'citizenbank';

    let archCode = '';

    if (format === 'mindmap') {
        let markdownStr = '';
        if (isCitizen) {
            markdownStr = `# CitizenBank Systems\n\n## Digital Channels\n### Mobile App (React Native)\n### Web Portal (Angular)\n### API Gateway\n#### AWS API Gateway\n##### Channel API\n###### Middleware\n####### Kafka\n####### Message Queue\n####### Other Hops\n\n## Cloud Security Edge\n### Cloudflare WAF\n### AWS Cognito (Auth)\n\n## Microservices Layer\n### Retail Accounts Engine\n#### [/api/v1/accounts]\n### SWIFT/ACH Integrator\n#### [/api/v1/payments]\n### ML Analytics & Fraud\n#### [/api/v1/fraud-score]\n\n## Legacy Backend\n### Mainframe Ledger\n#### [TCP Sockets]\n### Card Management DB`;
        } else {
            markdownStr = `# Generic Banking\n\n## Channels\n### Web Portal\n### Mobile Banking\n#### API Gateway\n##### Channel API\n###### Middleware\n####### Kafka\n####### Message Queue\n####### Other Hops\n### IVR System\n\n## API Gateway\n### Kong / Apigee Gateway\n#### [/api/gateway]\n\n## Core Banking Services\n### Account Service\n#### [/api/v1/accounts]\n### Ledger Engine\n#### [/api/v1/ledger]\n### Payment Orchestrator\n#### [/api/v1/payments]\n### Loan Engine\n#### [/api/v1/loans]\n\n## Risk & Compliance\n### Fraud Detection\n#### [/api/v1/fraud]\n### KYC Service\n#### [/api/v1/kyc]\n### AML Screening\n#### [/api/v1/aml]`;
        }

        const archContainer = document.getElementById('archDiagram');
        if (archContainer) {
            archContainer.removeAttribute('data-processed');
            archContainer.innerHTML = `<svg id="markmapSvg" style="width:100%; height:550px; outline: none; border-radius: 8px; background: rgba(30,41,59,0.5);"></svg>`;
            setTimeout(() => {
                if (window.markmap && window.markmap.Transformer) {
                    const transformer = new window.markmap.Transformer();
                    const { root } = transformer.transform(markdownStr);
                    window.markmap.Markmap.create('#markmapSvg', { autoFit: true }, root);
                } else {
                    archContainer.innerHTML = `<p style="color:var(--text-muted);padding:20px;">Unable to load interactive mindmap components. Please check your internet connection.</p>`;
                }
            }, 100);
        }

    } else if (format === 'cytoscape') {
        const archContainer = document.getElementById('archDiagram');
        if (archContainer) {
            archContainer.removeAttribute('data-processed');
            archContainer.innerHTML = `<div id="cy" style="width:100%; height:550px; background: rgba(30,41,59,0.5); border-radius: 8px;"></div>`;
            
            setTimeout(() => {
                if (window.cytoscape) {
                    let elements = [];
                    if (isCitizen) {
                        elements = [
                            { data: { id: 'channels', label: 'Digital Channels', type: 'zone' } },
                            { data: { id: 'web', label: 'Web (Angular)', parent: 'channels' } },
                            { data: { id: 'mob', label: 'Mobile (React)', parent: 'channels' } },
                            
                            { data: { id: 'gw', label: 'AWS API Gateway', type: 'gateway' } },
                            
                            { data: { id: 'core', label: 'Microservices Layer', type: 'zone' } },
                            { data: { id: 'acc', label: 'Retail Accounts', parent: 'core' } },
                            { data: { id: 'pay', label: 'SWIFT Integrator', parent: 'core' } },
                            
                            { data: { id: 'risk', label: 'Analytics', type: 'zone' } },
                            { data: { id: 'frd', label: 'ML Fraud', parent: 'risk' } },
                            
                            { data: { id: 'legacy', label: 'Legacy Backend', type: 'zone' } },
                            { data: { id: 'db', label: 'Mainframe Ledger', parent: 'legacy' } },
                            { data: { id: 'card', label: 'Card Management', parent: 'legacy' } },

                            { data: { id: 'e1', source: 'web', target: 'gw' } },
                            { data: { id: 'e2', source: 'mob', target: 'gw' } },
                            { data: { id: 'e4', source: 'gw', target: 'acc' } },
                            { data: { id: 'e5', source: 'gw', target: 'pay' } },
                            { data: { id: 'e9', source: 'pay', target: 'frd' } },
                            { data: { id: 'e12', source: 'acc', target: 'db' } },
                            { data: { id: 'e18', source: 'acc', target: 'card' } }
                        ];
                    } else {
                        elements = [
                            { data: { id: 'channels', label: 'Channels', type: 'zone' } },
                            { data: { id: 'web', label: 'Web Portal', parent: 'channels' } },
                            { data: { id: 'mob', label: 'Mobile App', parent: 'channels' } },
                            { data: { id: 'ivr', label: 'IVR System', parent: 'channels' } },
                            
                            { data: { id: 'gw', label: 'Kong / Apigee', type: 'gateway' } },
                            
                            { data: { id: 'core', label: 'Core Banking', type: 'zone' } },
                            { data: { id: 'acc', label: 'Account Service', parent: 'core' } },
                            { data: { id: 'led', label: 'Ledger Engine', parent: 'core' } },
                            { data: { id: 'pay', label: 'Payment Orch.', parent: 'core' } },
                            { data: { id: 'loan', label: 'Loan Engine', parent: 'core' } },
                            
                            { data: { id: 'risk', label: 'Risk & Compliance', type: 'zone' } },
                            { data: { id: 'frd', label: 'Fraud Detect', parent: 'risk' } },
                            { data: { id: 'kyc', label: 'KYC', parent: 'risk' } },
                            { data: { id: 'aml', label: 'AML', parent: 'risk' } },
                            
                            { data: { id: 'data', label: 'Data Layer', type: 'zone' } },
                            { data: { id: 'db', label: 'PostgreSQL', parent: 'data' } },
                            { data: { id: 'cache', label: 'Redis Cache', parent: 'data' } },
                            { data: { id: 'mq', label: 'Kafka', parent: 'data' } },

                            { data: { id: 'e1', source: 'web', target: 'gw' } },
                            { data: { id: 'e2', source: 'mob', target: 'gw' } },
                            { data: { id: 'e3', source: 'ivr', target: 'gw' } },
                            { data: { id: 'e4', source: 'gw', target: 'acc' } },
                            { data: { id: 'e5', source: 'gw', target: 'pay' } },
                            { data: { id: 'e6', source: 'gw', target: 'loan' } },
                            { data: { id: 'e7', source: 'acc', target: 'led' } },
                            { data: { id: 'e8', source: 'pay', target: 'led' } },
                            { data: { id: 'e9', source: 'pay', target: 'frd' } },
                            { data: { id: 'e10', source: 'loan', target: 'kyc' } },
                            { data: { id: 'e11', source: 'kyc', target: 'aml' } },
                            { data: { id: 'e12', source: 'acc', target: 'db' } },
                            { data: { id: 'e13', source: 'led', target: 'db' } },
                            { data: { id: 'e14', source: 'pay', target: 'mq' } },
                            { data: { id: 'e15', source: 'frd', target: 'cache' } },
                            { data: { id: 'e16', source: 'frd', target: 'mq' } }
                        ];
                    }

                    window.cytoscape({
                        container: document.getElementById('cy'),
                        elements: elements,
                        style: [
                            {
                                selector: 'node',
                                style: { 'background-color': '#7c3aed', 'label': 'data(label)', 'color': '#f1f5f9', 'text-valign': 'center', 'font-size': '12px' }
                            },
                            {
                                selector: 'edge',
                                style: { 'width': 2, 'line-color': '#334155', 'target-arrow-color': '#334155', 'target-arrow-shape': 'triangle', 'curve-style': 'bezier' }
                            },
                            {
                                selector: ':parent',
                                style: { 'background-color': 'rgba(15, 23, 42, 0.4)', 'border-color': '#334155', 'border-width': 2, 'text-valign': 'top', 'padding': 10 }
                            },
                            {
                                selector: 'node[type="gateway"]',
                                style: { 'background-color': '#10b981', 'shape': 'diamond', 'width': 60, 'height': 60 }
                            }
                        ],
                        layout: { name: 'cose', padding: 20 }
                    });
                }
            }, 100);
        }
    } else {
        const channels = isCitizen 
            ? `        WEB[Web Portal]
        MOB[Mobile App]
        IVR[IVR System]
        ATM[ATM Network]`
            : `        WEB[Web Portal]
        MOB[Mobile App]
        IVR[IVR System]`;
            
        const gateway = isCitizen ? `GW[Kong GW + WAF + MFA]` : `GW[Kong / Apigee Gateway]`;
        const core = isCitizen ? `        ACC[Account Service]
        LED[Ledger Engine]
        PAY[Payment (SWIFT gpi)]
        LOAN[Loan Engine]` : `        ACC[Account Service]
        LED[Ledger Engine]
        PAY[Payment Orchestrator]
        LOAN[Loan Engine]`;
        const risk = isCitizen ? `        FRD[ML Fraud Engine]
        KYC[Bio KYC Service]
        AML[AML Screening]` : `        FRD[Fraud Detection]
        KYC[KYC Service]
        AML[AML Screening]`;

        const extraConnections = isCitizen ? `    IVR --> GW
    ATM --> GW` : `    IVR --> GW`;

        archCode = `graph TB
    subgraph Channels
${channels}
    end
    subgraph API_Gateway[API Gateway Layer]
        ${gateway}
    end
    subgraph Core_Services[Core Banking Services]
${core}
    end
    subgraph Risk[Risk & Compliance]
${risk}
    end
    subgraph Data[Data Layer]
        DB[(PostgreSQL)]
        CACHE[(Redis Cache)]
        MQ[Kafka Event Bus]
    end
    WEB --> GW
    MOB --> GW
${extraConnections}
    GW --> ACC
    GW --> PAY
    GW --> LOAN
    ACC --> LED
    PAY --> LED
    PAY --> FRD
    LOAN --> KYC
    KYC --> AML
    ACC --> DB
    LED --> DB
    PAY --> MQ
    FRD --> CACHE
    FRD --> MQ`;
    
        const archContainer = document.getElementById('archDiagram');
        if (archContainer) {
            archContainer.removeAttribute('data-processed');
            archContainer.innerHTML = `<div class="mermaid">${archCode}</div>`;
            if (window.mermaid) {
                mermaid.run({ querySelector: '#archDiagram .mermaid' });
            }
        }
    }
}

function openDomainDocs(domainId) {
    const domain = domains.find(d => d.id === domainId);
    if (!domain) return;
    const modal = document.getElementById('docModal');
    document.getElementById('modalTitle').textContent = `${domain.icon} ${domain.name}`;
    document.getElementById('modalBody').innerHTML = getDomainDocContent(domain);
    modal.classList.remove('hidden');
    document.getElementById('modalClose').onclick = () => modal.classList.add('hidden');
    modal.onclick = e => { if (e.target === modal) modal.classList.add('hidden'); };
    setTimeout(() => mermaid.run(), 100);
}

function getDomainDocContent(domain) {
    const flows = {
        loans: `sequenceDiagram
    participant C as Customer
    participant API as Loan API
    participant UW as Underwriting
    participant CR as Credit Bureau
    participant LED as Ledger
    C->>API: Submit Application
    API->>CR: Check Credit Score
    CR-->>API: Score Response
    API->>UW: Forward for Review
    UW-->>API: Approval/Denial
    API->>LED: Create Loan Account
    API-->>C: Decision Notification`,
        payments: `sequenceDiagram
    participant S as Sender
    participant PO as Payment Orchestrator
    participant FD as Fraud Detection
    participant RT as RTP Network
    participant LED as Ledger
    S->>PO: Initiate Payment
    PO->>FD: Screen Transaction
    FD-->>PO: Risk Score
    PO->>RT: Submit to Network
    RT-->>PO: Confirmation
    PO->>LED: Debit/Credit
    PO-->>S: Payment Receipt`,
        fraud: `sequenceDiagram
    participant TX as Transaction
    participant RE as Rules Engine
    participant ML as ML Model
    participant CM as Case Manager
    TX->>RE: Evaluate Rules
    TX->>ML: Score Transaction
    ML-->>RE: Risk Score
    RE-->>CM: Flag if High Risk
    CM-->>TX: Block/Allow`,
        kyc: `sequenceDiagram
    participant C as Customer
    participant KYC as KYC Service
    participant ID as ID Verification
    participant AML as AML Screening
    C->>KYC: Submit Documents
    KYC->>ID: Verify Identity
    ID-->>KYC: Result
    KYC->>AML: Screen Watchlists
    AML-->>KYC: Clear/Flagged
    KYC-->>C: Status Update`,
        wealth: `graph LR
    A[Client Onboarding] --> B[Risk Profiling]
    B --> C[Portfolio Construction]
    C --> D[Auto-Rebalancing]
    D --> E[Performance Reporting]`,
        accounts: `graph TB
    A[Customer Portal] --> B[Account API]
    B --> C[Account Service]
    C --> D[Ledger Engine]
    D --> E[(PostgreSQL)]
    C --> F[(Redis Cache)]`
    };
    const diagram = flows[domain.id] || flows.accounts;
    return `
        <h3>📋 Functional Overview</h3>
        <p>${domain.desc}</p>
        <h3>📊 Flow Diagram</h3>
        <div class="mermaid">${diagram}</div>
        <h3>🔗 API Endpoints</h3>
        <table class="compare-table">
            <tr><th>Method</th><th>Endpoint</th><th>Description</th></tr>
            <tr><td><code>GET</code></td><td><code>/api/v1/${domain.id}</code></td><td>List resources</td></tr>
            <tr><td><code>POST</code></td><td><code>/api/v1/${domain.id}</code></td><td>Create resource</td></tr>
            <tr><td><code>GET</code></td><td><code>/api/v1/${domain.id}/{id}</code></td><td>Get by ID</td></tr>
        </table>
        <h3>🔐 Authentication</h3>
        <p>OAuth 2.0 Bearer tokens for all endpoints. Service-to-service via mTLS.</p>`;
}

// ══════════════════════════════════════════
//  COMPARE
// ══════════════════════════════════════════
function initCompare() {
    // Populate the bank target dropdown
    const targetSel = document.getElementById('compareTarget');
    targetSel.innerHTML = BANKS.map(b =>
        `<option value="${b.id}">${b.name} (${b.type})</option>`
    ).join('');

    document.getElementById('runCompare').addEventListener('click', runComparison);
}

function runComparison() {
    const base     = document.getElementById('compareBase').value;
    const targetId = document.getElementById('compareTarget').value;
    const bank     = BANKS.find(b => b.id === targetId);
    const data     = BANK_COMPARE_DATA[targetId];
    if (!bank || !data) return;

    const tagClass = { override: 'tag-override', custom: 'tag-custom', standard: 'tag-standard' };
    const tagLabel = { override: 'Override', custom: 'Custom', standard: 'Standard' };

    const rows = data.rows.map(r => `
        <tr>
            <td>${r.feature}</td>
            <td style="color:var(--text-muted)">${r.generic}</td>
            <td>${r.custom}</td>
            <td><span class="tag ${tagClass[r.type]}">${tagLabel[r.type]}</span></td>
        </tr>`).join('');

    const overrideCount  = data.rows.filter(r => r.type === 'override').length;
    const customCount    = data.rows.filter(r => r.type === 'custom').length;
    const standardCount  = data.rows.filter(r => r.type === 'standard').length;

    // Build a simple architecture diff mermaid tailored to the bank type
    const archExtras = {
        citizenbank:  'S4[IVR] --> S2\n        S5 --> S7[Regulatory Adapter]',
        wealthfirst:  'S3[Advisor Portal] --> S2\n        S5 --> S7[ESG Scoring Engine]',
        paystream:    'S3[Open Banking API] --> S2\n        S5 --> S7[Real-time FX Engine]',
        tradehaus:    'S3[SWIFT MT] --> S2\n        S5 --> S7[Blockchain LC Node]',
        neobank:      'S3[Open Banking/PSD2] --> S2\n        S5 --> S7[Serverless Functions]',
        unioncore:    'S5 --> S7[Cooperative Ledger]',
        securevault:  'S5 --> S7[HSM Cluster]\n        S5 --> S8[CSD Connector]'
    };
    const extras = archExtras[targetId] || '';

    document.getElementById('compareResults').innerHTML = `
        <div class="compare-card">
            <h3>📊 Comparison: ${base} vs ${bank.name}</h3>
            <table class="compare-table">
                <tr><th>Feature</th><th>Generic Standard</th><th>${bank.name}</th><th>Type</th></tr>
                ${rows}
            </table>
        </div>
        <div class="compare-card">
            <h3>🏗️ Architecture Differences</h3>
            <div class="mermaid">graph LR
    subgraph Generic[Generic Standard]
        G1[Web] --> G2[API GW]
        G2 --> G3[Services]
        G3 --> G4[(DB)]
    end
    subgraph Specific[${bank.name}]
        S1[Web] --> S2[API GW + WAF]
        S3[Mobile] --> S2
        ${extras}
        S2 --> S5[Services + ML]
        S5 --> S6[(DB + Cache)]
    end</div>
        </div>
        <div class="compare-card">
            <h3>📋 Summary — ${bank.name} (${bank.type})</h3>
            <p style="color:var(--text-secondary);line-height:1.7">
                ${data.summary}
            </p>
            <div style="display:flex;gap:16px;margin-top:12px">
                <span style="font-size:0.8rem"><span class="tag tag-override">${overrideCount} Overrides</span></span>
                <span style="font-size:0.8rem"><span class="tag tag-custom">${customCount} Custom</span></span>
                <span style="font-size:0.8rem"><span class="tag tag-standard">${standardCount} Standard</span></span>
            </div>
        </div>`;
    setTimeout(() => mermaid.run(), 100);
}

// ══════════════════════════════════════════
//  RECOMMENDATIONS
// ══════════════════════════════════════════
async function generateRepoRecommendation(repoName, e) {
    if (e) e.stopPropagation();
    
    const btn = e ? e.currentTarget : null;
    if (btn) {
        btn.disabled = true;
        btn.innerHTML = 'Scanning...';
    }

    const repo = sampleRepos.find(r => r.name === repoName) || (state.citizenRepos && state.citizenRepos.find(r => r.name === repoName));
    if (!repo) return;

    await delay(1200); // Simulate API latency
    
    if (!state.recommendations) state.recommendations = [];
    const exists = state.recommendations.find(r => r.repo === repoName);
    
    if (!exists) {
        const mockRecs = {
            'core-ledger-system': {
                why: 'Synchronous REST integration introduces tight coupling and risk of distributed deadlocks when connected to external clearing.',
                what: 'Implement event-driven Saga pattern via Kafka to manage distributed transactions reliably.',
                pointers: ['Use Topic-based choreography.', 'Implement native compensating transactions.', 'Ensure idempotency in ledger updates.']
            },
            'payment-gateway-service': {
                why: 'Fragmented authentication validation logic duplicates work across channels and creates security gaps.',
                what: 'Delegate all OAuth 2.0 / mTLS validation to the API Gateway layer.',
                pointers: ['Migrate local token parsing to Gateway plugins.', 'Enforce mTLS explicitly internally.', 'Remove duplicated JWT validation code from controllers.']
            },
            'fraud-ml-engine': {
                why: 'High ML latency stalls payment workflows and causes cascading timeouts upstream.',
                what: 'Introduce Proxy-level Circuit Breakers in front of synchronous ML inference.',
                pointers: ['Add Resilience4j proxy wrapper.', 'Implement Redis caching for safe entities.', 'Configure strict 100ms fallbacks.']
            }
        };

        const recData = mockRecs[repoName] || {
            why: `The ${repo.lang} codebase exhibits high cyclomatic complexity in its core service orchestrations.`,
            what: 'Refactor monolithic components into focused bounded domains based on Hexagonal Architecture.',
            pointers: ['Separate business entities from framework dependencies.', 'Extract external API calls into Port/Adapter interfaces.', 'Decouple database DAOs from controller validation.']
        };
        
        state.recommendations.unshift({
            repo: repoName,
            title: `${repoName} — Architecture Insight`,
            why: recData.why,
            what: recData.what,
            pointers: recData.pointers,
            type: repoName === 'core-ledger-system' ? 'override' : 'standard',
            priority: 'High'
        });
    }

    renderRepos(); // refresh button state to View Record
}

function renderRecommendations() {
    const grid = document.getElementById('recommendationGrid');
    if (!grid) return;
    
    if (!state.recommendations || state.recommendations.length === 0) {
        grid.innerHTML = `<div style="text-align:center; padding: 48px; border:2px dashed var(--border); border-radius:var(--radius); color:var(--text-muted); grid-column: 1 / -1;">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" width="48" height="48" style="margin-bottom:16px; opacity:0.5;"><path d="M14 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V8z"/><polyline points="14,2 14,8 20,8"/><line x1="16" y1="13" x2="8" y2="13"/><line x1="16" y1="17" x2="8" y2="17"/></svg>
            <p style="font-size:1.1rem;margin-bottom:8px;font-weight:600;color:var(--text-secondary);">No architectures analyzed yet</p>
            <p style="font-size:0.85rem">Navigate to your Repository Explorer and click "Scan Architecture" on specific microservices to generate isolated component insights here.</p>
        </div>`;
        return;
    }
    
    const tagColors = { 'override': 'tag-override', 'custom': 'tag-custom', 'standard': 'tag-standard' };
    
    grid.innerHTML = state.recommendations.map(r => `
        <div class="compare-card" style="margin-bottom: 20px;">
            <div style="display: flex; justify-content: space-between; align-items: flex-start; margin-bottom: 12px;">
                <h3 style="margin-bottom: 0; font-size: 1.1rem; flex: 1; display:flex; align-items:center; gap:8px;">
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" width="20" height="20" style="color:var(--accent-cyan)"><path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/></svg> 
                    ${r.title}
                </h3>
                <span class="tag ${tagColors[r.type]}">${r.priority} Priority</span>
            </div>
            
            <div style="background: var(--bg-deep); border: 1px solid var(--border); border-radius: var(--radius-sm); padding: 16px; margin-bottom: 16px;">
                <div style="display: flex; gap: 16px;">
                    <div style="flex: 1;">
                        <h4 style="color: var(--accent-rose); margin-bottom: 8px; font-size: 0.85rem; text-transform: uppercase;">Why to improve</h4>
                        <p style="color: var(--text-secondary); font-size: 0.9rem; line-height: 1.6;">${r.why}</p>
                    </div>
                    <div style="width: 1px; background: var(--border);"></div>
                    <div style="flex: 1;">
                        <h4 style="color: var(--accent-green); margin-bottom: 8px; font-size: 0.85rem; text-transform: uppercase;">What to improve</h4>
                        <p style="color: var(--text-secondary); font-size: 0.9rem; line-height: 1.6;">${r.what}</p>
                    </div>
                </div>
            </div>
            
            <h4 style="margin-bottom: 8px; font-size: 0.9rem; color:var(--text-primary);">📌 Proven Pointers & Action Items</h4>
            <ul style="color: var(--text-secondary); font-size: 0.88rem; line-height: 1.7; padding-left: 20px; list-style-type: square;">
                ${r.pointers.map(p => `<li>${p}</li>`).join('')}
            </ul>
        </div>
    `).join('');
}

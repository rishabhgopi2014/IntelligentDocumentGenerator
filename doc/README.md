# Nexus Banking Architect

Nexus Banking Architect is an enterprise-scale automated technical documentation tool. It visualizes and generates comprehensive banking ecosystem architectures with integrated GitHub Models AI support for deep architectural analyses.

---

## 🏗️ Application Architecture Details

Nexus Banking Architect is designed as a resilient, client-side heavy single-page application (SPA). It bypasses complex deployment requirements by running primarily in the browser while maintaining state-of-the-art functionality:

### 1. Presentation Layer
- **Vanilla HTML5/CSS3/JS**: Built without heavy framework dependencies (like React or Angular) to ensure absolute portability, instantaneous load times, and zero build-step requirements.
- **Dynamic DOM Rendering**: The `app.js` core handles direct manipulation of the DOM. It dynamically mounts views (Overview, Generator, Repositories, Recommendations, Compare, Settings) based on the current context and sub-navigation state.

### 2. Visualization & Diagramming Engines
The application uses three specialized external engines injected via CDN for optimal visualization:

- **Mermaid.js**: Employs flowchart and sequence logic to map out Low-Level Design (LLD), component hierarchies, and architectural differences in comparative views.
- **Cytoscape.js**: Generates High-Level Design (HLD) Dependency Maps. Cytoscape effectively scales to manage ecosystems with 50+ microservices without breaking structural topology.
- **Markmap (d3)**: Used for interactive, branchable mindmaps combining high-level domains down to their individual API endpoints.

### 3. State Management & Data Flow
- **Context-Aware Global State**: Centralized `state` object handles active contexts (`isCitizen`, `selectedModel`, `ghToken`). Switching contexts between `Generic` and `CitizenBank` immediately triggers re-renders across all active subsystems (Diagrams, Stats, Repositories) without reloading the system.
- **Mock vs. Active Data Pipelines**: Operations cleanly fall back to predefined local `sampleRepos` and `BANK_COMPARE_DATA` constants unless active data (e.g. from the Doc Generator or AI Scanner) explicitly supersedes them in the state.

### 4. Integration Layer (AI Scanner Engine)
- **Direct GitHub Models API Hook**: `callGitHubModel()` handles secure, stateless REST communication relying on Bearer standard authorization. It delegates structural analysis (like identifying tightly coupled dependencies) to advanced LLMs like GPT-4o, Claude 3 Opus, or AI21 models natively within the browser application.

---

## 📊 Diagram Reference Guide

The application renders **five distinct diagram types** across its pages. Each serves a different architectural purpose and is rendered using a different engine.

---

### Diagram 1 — Mindmap (Component & APIs)

**Engine:** Markmap (built on D3.js)  
**Location:** Product Overview → "Mindmap (Component & APIs)" dropdown option  
**Format:** Interactive SVG rendered into `#markmapSvg` at 550px height

#### What it shows
An interactive, collapsible mindmap that maps the entire banking system hierarchy — from high-level domains down to individual API endpoint paths. Branches can be expanded and collapsed by clicking nodes.

#### Generic Banking Mindmap
The Generic mode maps the standard reference banking architecture:
- **Root:** `Generic Banking`
- **Channels branch:** Web Portal → Mobile Banking → IVR System, each with their channel API → Middleware → Kafka / Message Queue hops
- **API Gateway branch:** Kong / Apigee Gateway (`/api/gateway`)
- **Core Banking Services branch:** Account Service (`/api/v1/accounts`), Ledger Engine (`/api/v1/ledger`), Payment Orchestrator (`/api/v1/payments`), Loan Engine (`/api/v1/loans`)
- **Risk & Compliance branch:** Fraud Detection (`/api/v1/fraud`), KYC Service (`/api/v1/kyc`), AML Screening (`/api/v1/aml`)

#### CitizenBank Mindmap
When the CitizenBank context is active, the mindmap changes to reflect CitizenBank's specific implementation:
- **Root:** `CitizenBank Systems`
- **Digital Channels branch:** Mobile App (React Native), Web Portal (Angular), API Gateway → AWS API Gateway with Kafka/Message Queue middleware
- **Cloud Security Edge branch:** Cloudflare WAF, AWS Cognito (Auth)
- **Microservices Layer branch:** Retail Accounts Engine (`/api/v1/accounts`), SWIFT/ACH Integrator (`/api/v1/payments`), ML Analytics & Fraud (`/api/v1/fraud-score`)
- **Legacy Backend branch:** Mainframe Ledger (TCP Sockets), Card Management DB

#### How to read it
Nodes at the outer edge represent specific API endpoints or infrastructure components. The depth of a node indicates its layer in the stack — shallow nodes are closer to the user (channels/frontend), deeper nodes are internal platform services.

---

### Diagram 2 — System Dependency Map (HLD)

**Engine:** Cytoscape.js  
**Location:** Product Overview → "System Dependency Map (HLD)" dropdown option  
**Format:** Interactive graph rendered into `#cy` div at 550px height, using a `cose` force-directed layout

#### What it shows
A High-Level Design (HLD) dependency graph showing how zones, services, and components interconnect. Nodes are grouped into parent compound nodes representing architectural zones. Edges show the direction of API or data flow between services.

#### Node types and styling
| Node Type | Style | Meaning |
|-----------|-------|---------|
| Standard service | Purple (`#7c3aed`) circle | A microservice or component |
| Gateway node | Green (`#10b981`) diamond (60×60) | The API Gateway — the single ingress point |
| Parent/zone node | Semi-transparent dark background, `#334155` border | A logical grouping (e.g., "Core Banking", "Risk & Compliance") |

#### Generic Banking HLD
Four compound zones are rendered:
1. **Channels zone** → Web Portal, Mobile App, IVR System — consumer-facing entry points
2. **Kong / Apigee gateway** (gateway node) → filters and routes all inbound traffic
3. **Core Banking zone** → Account Service, Ledger Engine, Payment Orchestrator, Loan Engine
4. **Risk & Compliance zone** → Fraud Detection, KYC, AML
5. **Data Layer zone** → PostgreSQL, Redis Cache, Kafka

**Edges (data flows):**
- All channel nodes → Gateway
- Gateway → Account, Payment, Loan services
- Account & Payment → Ledger Engine (write path)
- Payment → Fraud Detection (inline risk scoring)
- Loan → KYC → AML (compliance chain)
- Core services → PostgreSQL and Kafka; Fraud → Redis and Kafka

#### CitizenBank HLD
CitizenBank's graph is streamlined to reflect its actual, more focused service topology:
1. **Digital Channels zone** → Web (Angular) + Mobile (React Native)
2. **AWS API Gateway** (gateway node)
3. **Microservices Layer zone** → Retail Accounts, SWIFT Integrator
4. **Analytics zone** → ML Fraud
5. **Legacy Backend zone** → Mainframe Ledger, Card Management

Notably absent are IVR and Loan services, reflecting CitizenBank's digital-first, cloud-cloud architecture rather than the full generic stack.

---

### Diagram 3 — Mermaid Flowchart (LLD)

**Engine:** Mermaid.js  
**Location:** Product Overview → "Mermaid Flowchart (LLD)" dropdown option  
**Format:** `graph TB` (top-to-bottom) Mermaid diagram, rendered as SVG

#### What it shows
A Low-Level Design (LLD) flowchart that breaks down the internal structural layers of the banking platform — from user-facing channels, through the API gateway, into core banking services, risk/compliance services, and finally the data persistence layer.

#### Generic Banking Flowchart
Five subgraphs are rendered top-to-bottom:
1. **Channels subgraph** — Web Portal, Mobile App, IVR System
2. **API Gateway Layer** — Kong / Apigee Gateway
3. **Core Banking Services** — Account Service, Ledger Engine, Payment Orchestrator, Loan Engine
4. **Risk & Compliance** — Fraud Detection, KYC Service, AML Screening
5. **Data Layer** — PostgreSQL (cylinder), Redis Cache (cylinder), Kafka Event Bus

**Key flows shown:**
- Web, Mobile, IVR → Kong/Apigee Gateway (all traffic centralized)
- Gateway → Account, Payment, Loan (fanout)
- Account + Payment → Ledger (double-entry writes)
- Payment → Fraud (real-time inline check)
- Loan → KYC → AML (sequential compliance chain)
- Core services persist to PostgreSQL; Payment publishes to Kafka; Fraud reads from Redis and Kafka

#### CitizenBank Flowchart
CitizenBank's flowchart adds two more channel nodes:
- **IVR System** and **ATM Network** (unique to CitizenBank vs. Generic's 3 channels)
- The gateway is labeled **Kong GW + WAF + MFA** (reflecting CitizenBank's enhanced security posture with WAF and step-up MFA, as shown in the comparison data)
- Core service labels are updated: `Payment (SWIFT gpi)`, `ML Fraud Engine`, `Bio KYC Service` — reflecting CitizenBank's SWIFT gpi integration, ML fraud hybrid, and biometric KYC

---

### Diagram 4 — Domain Flow Diagrams (Modal Pop-ups)

**Engine:** Mermaid.js  
**Location:** Product Overview → click any Banking Domain card  
**Format:** Mermaid `sequenceDiagram` or `graph` diagrams rendered inside a modal

#### What it shows
Each banking domain card opens a modal with a flow diagram specific to that domain's operational process. These are purpose-built sequence or flow diagrams that illustrate how data moves through real banking workflows.

#### Domain-specific diagrams

**🏦 Loans & Lending — `sequenceDiagram`**
```
Customer → Loan API → Credit Bureau (score check)
Credit Bureau → Loan API → Underwriting (review)
Underwriting → Loan API → Ledger (create account)
Loan API → Customer (notification)
```
Illustrates the full origination lifecycle: application submission, credit bureau check, underwriting decision, ledger account creation, and customer notification.

**💳 Payments & Transfers — `sequenceDiagram`**
```
Sender → Payment Orchestrator → Fraud Detection (risk score)
Fraud Detection → Payment Orchestrator → RTP Network
RTP Network → Payment Orchestrator → Ledger (debit/credit)
Payment Orchestrator → Sender (receipt)
```
Represents real-time payment flow with inline fraud screening before submission to the RTP network and final ledger posting.

**🛡️ Fraud Detection — `sequenceDiagram`**
```
Transaction → Rules Engine + ML Model (parallel)
ML Model → Rules Engine → Case Manager (high-risk flag)
Case Manager → Transaction (block or allow)
```
Shows a hybrid approach: transaction simultaneously evaluated by a deterministic rules engine and an ML model. The combined result routes to a Case Manager which decides to block or allow.

**🔍 KYC & Compliance — `sequenceDiagram`**
```
Customer → KYC Service → ID Verification
ID Verification → KYC Service → AML Screening (watchlist)
AML Screening → KYC Service → Customer (status update)
```
A sequential compliance chain: document submission, identity verification, then AML watchlist screening before a final status is returned.

**📈 Wealth Management — `graph LR` (left-to-right)**
```
Client Onboarding → Risk Profiling → Portfolio Construction → Auto-Rebalancing → Performance Reporting
```
A linear pipeline representing the discretionary wealth management lifecycle from onboarding through to ongoing performance reporting.

**🏛️ Core Banking — `graph TB` (top-to-bottom)**
```
Customer Portal → Account API → Account Service → Ledger Engine → PostgreSQL
Account Service → Redis Cache
```
Shows the structural layers of a core banking read/write path — customer portal calling an API that routes through a service to the double-entry ledger and ultimately to the relational database, with a Redis caching layer on the Account Service.

---

### Diagram 5 — Comparative Architecture Diff (Compare Page)

**Engine:** Mermaid.js  
**Location:** Compare page → select a bank → click "Run Analysis"  
**Format:** `graph LR` (left-to-right) side-by-side subgraph comparison

#### What it shows
A side-by-side architectural difference diagram. The left subgraph (`Generic Standard`) shows a minimal reference implementation; the right subgraph (`{BankName}`) shows that institution's specific architectural extensions and overrides.

#### Generic Standard (left subgraph — always the same)
```
Web → API GW → Services → DB
```
A deliberate simplification of the generic baseline — 4 nodes, 3 edges, representing the core pattern of any standard banking implementation.

#### Bank-specific subgraphs (right side — varies per institution)

The right subgraph always starts with `Web + Mobile → API GW + WAF → Services + ML → DB + Cache`, and adds **bank-specific extension nodes** based on `archExtras`:

| Bank | Architecture Extension |
|------|----------------------|
| CitizenBank | IVR channel + Regulatory Adapter downstream |
| WealthFirst | Advisor Portal channel + ESG Scoring Engine |
| PayStream | Open Banking API channel + Real-time FX Engine |
| TradeHaus | SWIFT MT channel + Blockchain LC Node |
| NeoBankX | Open Banking/PSD2 channel + Serverless Functions |
| UnionCore | Cooperative Ledger (downstream only) |
| SecureVault | HSM Cluster + CSD Connector (dual downstream) |

#### How to read it
- **Overrides** (red tag): The bank has replaced the standard implementation entirely (e.g., ML fraud instead of rule-based, instant settlement instead of T+2)
- **Custom** (amber tag): The bank has extended the standard with additional capabilities (e.g., biometric KYC on top of standard 3-step)
- **Standard** (green tag): The bank uses the generic implementation unchanged (e.g., double-entry ledger, AES-256 encryption)

The feature comparison table above the diagram maps each capability row to its Override / Custom / Standard classification so the architectural differences are immediately actionable.

---

## 💡 Usage Pros & Business Value

### 🚀 Instant Context Switching
You can instantly visualize the architectural delta between a legacy "Generic" banking model and a modern targeted model (e.g., CitizenBank) via a simple UI toggle. Visual layouts, diagrams, and domain metrics immediately transition.

### 🧩 Targeted Actionable Insights
Rather than vague, global recommendations, the **Architecture Scanner** allows users to target *specific* synchronized services (e.g., `payment-gateway-service`) and run isolated health checks. The scanner generates precise JSON representations outlining:
1. **The vulnerability or bottleneck ("Why")**
2. **The architectural pattern required to solve it ("What")**
3. **Three proven step-by-step implementation pointers.**

### 📊 Real-Time Topology Mapping
As new repositories are onboarded through the "Doc Generator" pipeline, they immediately populate the overall product topology. Technical Writers, DevOps engineers, and Software Architects no longer have to manually map dependencies across 50+ disparate GitHub repositories; the Architect generates both the macro (Cytoscape) and micro (Mermaid) mapping natively.

### ⚡ No Backend Overhead
By shifting the computation, rendering, and API communication strictly to the client via a simple localized web server, organizational overhead is virtually zero. You can securely load this internally inside heavily regulated banking VPNs without risking code exposure to unapproved proprietary backend services.

---

## Directory Structure
- `index.html`: The main web application interface.
- `app.js`: Core logic for managing UI, architecture mindmap/flowchart variants, animations, and AI context integration.
- `styles.css`: Styling for the application interface and dashboards.
- `start.ps1`: Utility script to start the local web server down within a Powershell environment.
- `stop.ps1`: Utility script to stop the local web server.

## Running the Application

Because this application dynamically fetches local data assets and renders complex SVG diagrams, it naturally requires a localized web-server deployment to bypass explicit browser CORS restrictions.

### Starting the Server (Windows)
Execute the start script to launch the application natively using Python's `http.server`:
```powershell
.\start.ps1
```
This starts the application at `http://localhost:8000` and creates a `server.pid` file to softly track and isolate the background process.

### Stopping the Server
When done, you can gracefully stop the internal server by running:
```powershell
.\stop.ps1
```

# Nexus Banking Architect

Nexus Banking Architect is an enterprise-scale automated technical documentation tool. It visualizes and generates comprehensive banking ecosystem architectures with integrated GitHub Models AI support for deep architectural analyses. 

## 🏗️ Application Architecture Details

Nexus Banking Architect is designed as a resilient, client-side heavy single-page application (SPA). It bypasses complex deployment requirements by running primarily in the browser while maintaining state-of-the-art functionality:

### 1. Presentation Layer
- **Vanilla HTML5/CSS3/JS**: Built without heavy framework dependencies (like React or Angular) to ensure absolute portability, instantaneous load times, and zero build-step requirements.
- **Dynamic DOM Rendering**: The `app.js` core handles direct manipulation of the DOM. It dynamically mounts views (Overview, Generator, Repositories, Recommendations, Compare, Settings) based on the current context and sub-navigation state.

### 2. Visualization & Diagramming Engines
The application uses specialized external engines injected via CDN for optimal visualization:
- **Mermaid.js**: Employs flowchart and sequence logic to map out Low-Level Design (LLD), component hierarchies, and architectural differences in comparative views.
- **Cytoscape.js**: Generates High-Level Design (HLD) Dependency Maps. Cytoscape effectively scales to manage ecosystems with 50+ microservices without breaking structural topology.
- **Markmap (d3)**: Used for interactive, branchable mindmaps combining high-level domains down to their individual API endpoints.

### 3. State Management & Data Flow
- **Context-Aware Global State**: Centralized `state` object handles active contexts (`isCitizen`, `selectedModel`, `ghToken`). Switching contexts between `Generic` and `CitizenBank` immediately triggers re-renders across all active subsystems (Diagrams, Stats, Repositories) without reloading the system.
- **Mock vs. Active Data Pipelines**: Operations cleanly fall back to predefined local `sampleRepos` and `BANK_COMPARE_DATA` constants unless active data (e.g. from the Doc Generator or AI Scanner) explicitly supersedes them in the state.

### 4. Integration Layer (AI Scanner Engine)
- **Direct GitHub Models API Hook**: `callGitHubModel()` handles secure, stateless REST communication relying on Bearer standard authorization. It delegates structural analysis (like identifying tightly coupled dependencies) to advanced LLMs like GPT-4o, Claude 3 Opus, or AI21 models natively within the browser application.

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
- `start.sh` / `stop.sh`: Bash equivalents for Linux/macOS or WSL users.

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

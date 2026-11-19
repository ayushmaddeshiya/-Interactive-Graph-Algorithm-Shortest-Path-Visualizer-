# Interactive Graph Algorithm & Shortest Path Visualizer

An interactive, single-page web application built for the **Analysis and Design of Algorithms (ADA)** course. This visualizer models an **18 × 40 coordinate grid** ($\vert{}V\vert{} = 720$ vertices, $\vert{}E\vert{} \le 4\vert{}V\vert{}$ orthogonal edges) as an undirected graph, allowing users to draw dynamic obstacles, reposition endpoints, and compare how classical graph traversal and shortest-path algorithms explore, relax edges, and reconstruct optimal paths in real time.

---

## Key Features

- **Multiple Graph Algorithms:** Side-by-side behavioral visualization of **Dijkstra’s Algorithm**, **Breadth-First Search (BFS)**, and **Depth-First Search (DFS)**.
- **Interactive Grid & Draggable Endpoints:**
  - Click and drag the **Electric Gold Start Node** or **Crimson Red Target Node** to reposition them anywhere on the grid.
  - Click and drag across open cells to draw **Dark Slate Wall** barriers without browser drag-and-drop conflicts.
- **Live Complexity & Performance HUD:** Real-time tracking of **Visited Nodes**, **Shortest Path Length**, **Time Complexity**, **Space Complexity**, and **Algorithmic Paradigm**.
- **Color Legend & Speed Controls:** Adjustable animation speed (**Fast**, **Medium**, **Slow**) paired with a clear visual color key.
- **Edge-Case Protection:** Automatically detects enclosed/unreachable targets and displays a **"No Path Found"** alert, while safely canceling pending animation timers on mid-run resets.

---

## Algorithms & Complexity Analysis

| Algorithm | Paradigm | Time Complexity | Space Complexity | Guarantees Shortest Path? |
| :--- | :--- | :---: | :---: | :---: |
| **Dijkstra’s Algorithm** | Greedy Relaxation | $O((V + E) \log V)$ | $O(V)$ | Yes |
| **Breadth-First Search (BFS)** | FIFO Queue Traversal | $O(V + E)$ | $O(V)$ | Yes (Unweighted) |
| **Depth-First Search (DFS)** | LIFO Stack / Backtracking | $O(V + E)$ | $O(V)$ | No |

---

## Tech Stack

- **Frontend Framework:** React 18+ (scaffolded via Vite)
- **Core Algorithm Engine:** JavaScript (ES6+)
- **Styling & Visuals:** Vanilla CSS3 (Keyframe Animations), SVG Geometric Pattern Background
- **Runtime & Tooling:** Node.js (v18+) and npm

---

## Project Structure

```text
├── public/
├── src/
│   ├── algorithms/
│   │   ├── dijkstra.js        # Dijkstra's algorithm & shortest-path backtracking
│   │   └── traversals.js      # BFS (Queue) and DFS (Stack) implementations
│   ├── assets/
│   │   └── algo-pattern.svg   # Minimalist vector watermark pattern
│   ├── components/
│   │   └── Node.jsx           # Individual grid vertex component
│   ├── styles/
│   │   └── Node.css           # Node states & keyframe animations
│   ├── App.jsx                # Grid state, drag handlers, HUD, & animation controller
│   └── index.css              # Global layout & SVG background styling
├── index.html
├── package.json
└── vite.config.js
```

---

## Running the Project Locally

### Prerequisites
- **Node.js** (v18.0 or higher)
- **npm** (v9.0 or higher)

### Step-by-Step Setup

1. **Clone the repository:**
   ```bash
   git clone <your-github-repository-url>
   cd <your-repository-folder>
   ```

2. **Install dependencies:**
   ```bash
   npm install
   ```

3. **Start the local development server:**
   ```bash
   npm run dev
   ```

4. **Open in browser:**
   Navigate to `http://localhost:5173` in any modern web browser (Chrome, Edge, or Firefox).

---

## Environment Security & Demo Access

- **Environment Variables:** This application runs 100% client-side in the browser. No external APIs, secrets, or `.env` configuration files are required.
- **Authentication:** No login or demo credentials are required—all features are immediately accessible upon launching the app.

---

## Team Members

- **Ayush Maddeshiya** — Roll No: `25293916023`
- **Ajit Yadav** — Roll No: `25293916010`
- **Mukesh Kumar** — Roll No: `25293916059`

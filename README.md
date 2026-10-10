
# Outside.exe 🌸
> **Replacing doomscrolling with IRL side quests using local Gemma 🐾**  
> *Turn your neighborhood into a cozy RPG where every real-world flower found levels up your garden companion.*

---

## 🌿 Overview

Most mobile and web apps are built around retention loops, push notifications, and endless feeds designed to keep eyes on screens. **Outside.exe** flips the game loop upside down: it uses open-weight AI to turn the physical world into an offline questing ground.

Instead of an overwhelming dashboard, the app opens with a frosted-glass check-in. Tell it your mood, energy, and available time, and **Google's Gemma 2B** writes a short set of real-world activities. Complete tasks, log photo memories directly on each task row, and watch your companion celebrate your offline breaks.

---

## 🗺️ How It Works (Adventure Flow)


```

┌──────────────────────┐      ┌─────────────────────────┐      ┌───────────────────────────┐
│   1. The Check-in    │      │    2. Local Inference   │      │    3. The Garden Hub      │
│  • Mood: Bored       │ ───► │  • gemma:2b via Ollama  │ ───► │  • Overlay blurs away     │
│  • Energy: Low       │      │  • Strict JSON prompt   │      │  • Quest pins to board    │
│  • Time: 10 mins     │      │  • Dynamic step parsing │      │  • Mochi rests by pond    │
└──────────────────────┘      └─────────────────────────┘      └─────────────┬─────────────┘
│
┌──────────────────────┐      ┌─────────────────────────┐                    │
│ 5. Level Up & Memory │      │    4. Touch Grass Mode  │                    ▼
│ • +25 XP awarded     │ ◄─── │ • Step away from screen │ ◄──────────────────┘
│ • Companion hops!    │      │ • Complete tasks IRL    │
│ • Photo saved in row │      │ • Tap camera for proof  │
└──────────────────────┘      └─────────────────────────┘

```

---

## 📸 Screenshots & Experience

| Step 1: Mood & Energy Intake | Step 2: Quest Generation | Step 3: Garden Board & Verification |
| :---: | :---: | :---: |
| *(Add your screenshot here)* | *(Add your blossom loader screenshot here)* | *(Add your garden dashboard screenshot here)* |
| Select how you feel and your time window. | Blossom loader pulses while Gemma dreams up tasks. | Check off tasks, log photo evidence, and earn XP. |

---

## 🛠️ System Architecture

| Stage | Component | Technology | Role |
| :--- | :--- | :--- | :--- |
| **User Intake** | Blurred Onboarding Modal | React, CSS `backdrop-filter` | Blocks the dashboard to isolate intention and collect time/energy states. |
| **Inference Engine** | Local Gemma Pipeline | `gemma:2b`, Ollama runtime | Synthesizes physical constraints into real-world objectives in structured JSON. |
| **API Transport** | Microservice Bridge | FastAPI, Pydantic, CORS | Ingests client preferences, manages fallback schemas, and validates model output. |
| **Feedback Loop** | Animated Blossom Screen | Tailwind CSS (`animate-bounce`) | Clean, zero-dependency transition state while the model streams output. |
| **Dashboard** | Dynamic Quest Board | React State, CSS Flexbox | Renders actionable quest milestones, photo buttons, and XP progress bars. |
| **Evidence Capture** | Inline Proof Log | HTML5 Media Capture API | Captures live camera evidence per step (`e.stopPropagation()` isolated). |
| **Companion State** | Garden Mascot | CSS Transforms & Keyframes | Tracks pet level and executes celebratory animations on completion. |

---

## 🧪 Sample Generated Session

| Parameter | Recorded Value |
| :--- | :--- |
| **Selected Mood** | Bored |
| **Physical Energy** | Low (Keep it easy) |
| **Allocated Time** | 10 minutes |
| **Generated Quest** | *A Little Pond Pause* |
| **Generated Steps** | 1. Find a safe, peaceful spot.<br>2. Notice three things moving.<br>3. Take five slow, comfy breaths. |
| **Evidence Collected** | Inline photo verification captured per step via device camera. |
| **Companion Reaction** | Mochi jumps (+25 XP added to level progression). |

---

## 🚀 Getting Started

### Prerequisites
- Node.js (v18+)
- Python 3.10+
- [Ollama](https://ollama.com/) running with `gemma:2b` installed (`ollama run gemma:2b`)

### 1. Backend Setup
```bash
cd backend
python -m venv venv
# On Windows:
venv\Scripts\activate
# On macOS/Linux:
source venv/bin/activate

pip install fastapi uvicorn ollama pydantic
uvicorn main:app --reload

```

The API will run locally at `http://localhost:8000`.

### 2. Frontend Setup

```bash
cd frontend
npm install
npm run dev

```

Open `http://localhost:5173` in your browser.

---

## 🤍 Why Open Innovation?

An application built around personal well-being, emotional check-ins, and local image captures shouldn't leak user context to closed, proprietary cloud APIs.

Running **Gemma 2B** locally ensures:

1. **Complete Privacy:** Mood inputs and task logs remain entirely on the local device runtime.
2. **Zero Ongoing Costs:** The inference engine runs locally or on self-hosted instances without token consumption fees.
3. **Deterministic Control:** Open model access allows developers to tune prompt contracts and system fallbacks without risk of upstream model deprecation.



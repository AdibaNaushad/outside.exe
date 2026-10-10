import { useEffect, useMemo, useState } from "react";
import {
  CalendarDays,
  Sun,
  CloudSun,
  Heart,
  PawPrint,
  Pencil,
  Sparkles,
  Clock3,
  Check,
  House,
  Map,
  Gift,
  Flower2,
  Camera,
  Leaf,
  Backpack,
  Star,
  X,
  ChevronRight,
  RotateCcw,
} from "lucide-react";

const questOptions = [
  {
    title: "The Flower Hunt",
    description: "Find something beautiful in nature and take a photo.",
    time: "20 min",
    xp: 30,
    steps: [
      "Find a colorful flower",
      "Take a photo (or just admire it)",
      "Sit and enjoy for 5 minutes",
    ],
  },
  {
    title: "A Little Pond Pause",
    description: "Find a peaceful spot and notice the tiny things.",
    time: "15 min",
    xp: 25,
    steps: [
      "Find a safe, peaceful spot",
      "Notice three things moving",
      "Take five slow, comfy breaths",
    ],
  },
  {
    title: "Cloud Shapes Club",
    description: "Let your imagination wander for a little while.",
    time: "10 min",
    xp: 20,
    steps: [
      "Find a place to see the sky",
      "Spot a cloud that looks like something",
      "Give your cloud a silly name",
    ],
  },
];

function Companion({ type = "cat", small = false }) {
  return (
    <div
      className={`companion ${type} ${small ? "companion-small" : ""}`}
      aria-label={`cute ${type} companion`}
    >
      <span className="ear ear-left" />
      <span className="ear ear-right" />
      <span className="face">
        <i className="eye eye-left" />
        <i className="eye eye-right" />
        <i className="blush blush-left" />
        <i className="blush blush-right" />
        <i className="nose" />
        <i className="smile" />
      </span>
      <span className="bow">♡</span>
      {type === "cat" && (
        <>
          <span className="whisker whisker-left" />
          <span className="whisker whisker-right" />
        </>
      )}
    </div>
  );
}

function App() {


  const [isJumping, setIsJumping] = useState(false);



  // NEW: State to hold multiple photos, matched to the step index!
  const [taskPhotos, setTaskPhotos] = useState({});

  const [pet, setPet] = useState(
    () => localStorage.getItem("outside-pet") || "cat",
  );
  const [petName, setPetName] = useState(
    () => localStorage.getItem("outside-pet-name") || "Mochi",
  );
  const [xp, setXp] = useState(() =>
    Number(localStorage.getItem("outside-xp") || 120),
  );
  const [doneCount, setDoneCount] = useState(() =>
    Number(localStorage.getItem("outside-done") || 4),
  );
  
  const [modal, setModal] = useState("ai-setup"); 
  
  const [aiQuestState, setAiQuestState] = useState("idle"); 
  const [preferences, setPreferences] = useState({ mood: "", time: "", energy: "" });
  const [currentQuest, setCurrentQuest] = useState(questOptions[0]); 
  
  const [checked, setChecked] = useState([]);
  const [completed, setCompleted] = useState(false);
  const [draftName, setDraftName] = useState(petName);
  const [activeTab, setActiveTab] = useState("Home");
  
  const level = Math.floor(xp / 100) + 1;
  const levelXp = xp % 100;
  const today = useMemo(() => new Date(), []);
  const dateLabel = today.toLocaleDateString("en-US", {
    month: "long",
    day: "numeric",
    weekday: "short",
  });
  const timeLabel = today.toLocaleTimeString("en-US", {
    hour: "2-digit",
    minute: "2-digit",
  });

  useEffect(() => localStorage.setItem("outside-pet", pet), [pet]);
  useEffect(() => localStorage.setItem("outside-pet-name", petName), [petName]);
  useEffect(() => localStorage.setItem("outside-xp", String(xp)), [xp]);
  useEffect(
    () => localStorage.setItem("outside-done", String(doneCount)),
    [doneCount],
  );

  const handleGenerateQuest = async () => {
    if (!preferences.mood || !preferences.energy || !preferences.time) {
      alert("Please fill out all fields so I can make a good quest!");
      return;
    }

    setAiQuestState("loading");

    try {
      const response = await fetch('http://localhost:8000/api/generate-quest', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(preferences)
      });
      
      const data = await response.json();
      setCurrentQuest(data);
      setChecked([]); 
      setCompleted(false);
      setTaskPhotos({}); // Clear previous photos
      setAiQuestState("active");
      
      setModal(""); 
      
    } catch (error) {
      console.error("Error fetching quest:", error);
      setCurrentQuest(questOptions[2]); 
      setChecked([]);
      setCompleted(false);
      setTaskPhotos({});
      setAiQuestState("active");
      
      setModal(""); 
    }
  };

  function finishQuest() {
    if (completed) return;
    setXp((value) => value + currentQuest.xp);
    setDoneCount((value) => value + 1);
    setCompleted(true);
  }

  function toggleStep(index) {
    setChecked((value) => {
      // If the task is NOT checked yet, we are completing it!
      if (!value.includes(index)) {
        setIsJumping(true); // Start the jump
        setTimeout(() => setIsJumping(false), 500); // Stop the jump after 0.5 seconds
        return [...value, index];
      } else {
        // If we are unchecking it, just remove it without jumping
        return value.filter((i) => i !== index);
      }
    });
   
   
  }

  return (
    <main className="garden-app">
      <div className="garden-art" aria-hidden="true" />
      <div className="art-wash" aria-hidden="true" />

      {/* --- SITTING GARDEN PET --- */}
      <div 
        style={{
          position: 'absolute',
          bottom: '16%',     /* Adjust to sit perfectly on the grass */
          left: '55%',       /* Adjust to move left or right on the screen */
          zIndex: 5,         
          pointerEvents: 'none', 
        }}
      >
        <img 
          src={pet === "cat" ? "/cat.svg" : "/dog.svg"} 
          alt={`Your sitting ${pet}`}
          className={isJumping ? "animate-jump" : ""} /* Applies the jump only when triggered */
          style={{ 
            width: '90px', 
            filter: 'drop-shadow(0px 8px 4px rgba(0,0,0,0.15))', /* Keeps a nice shadow under them */
            transition: 'transform 0.1s' 
          }} 
        />
      </div>
      {/* ------------------------------- */}



      
      <header className="top-brand " 
      >
        <a href="#home" className="brand">
          <span className="brand-flower">✿</span>
          <span>
            outside<span className="brand-dot">.exe</span>
            <small>MY LITTLE ADVENTURES</small>
          </span>
        </a>
        <div className="brand-tag">
          <Sparkles size={14} /> a softer kind of side quest
        </div>
      </header>

      <section className="pet-panel parchment">
        <div className="pet-portrait">
          <Companion type={pet} />
          <span className="portrait-flower">✿</span>
        </div>
        <div className="pet-info">
          <div className="pet-name-line">
            <h1>{petName}</h1>
            <button
              className="icon-button"
              aria-label="Edit companion"
              onClick={() => {
                setDraftName(petName);
                setModal("pet");
              }}
            >
              <Pencil size={15} />
            </button>
          </div>
          <p>
            Lv. {level} <span className="tiny-sparkle">✦</span>
          </p>
          <div className="hearts" aria-label="companion happiness">
            {[0, 1, 2, 3, 4].map((i) => (
              <Heart
                key={i}
                size={21}
                fill={i < 4 ? "#e98e9a" : "transparent"}
                color={i < 4 ? "#d66f7e" : "#caa79a"}
              />
            ))}
          </div>
          <div className="pet-progress">
            <span style={{ width: `${levelXp}%` }} />
            <b>{levelXp} / 100 XP</b>
          </div>
        </div>
        <button
          className="change-pet"
          onClick={() => {
            setDraftName(petName);
            setModal("pet");
          }}
          aria-label="Change companion"
        >
          <PawPrint size={16} />
        </button>
      </section>

      <section className="quest-panel parchment" id="quest">
        <div className="panel-title">
          <span className="title-flower">✿</span>
          <div>
            <h2>
              {activeTab === "Quest"
                ? "Pick a Side Quest"
                : activeTab === "My Adventures"
                  ? "Your Little Adventures"
                  : "Today's Side Quest"}
            </h2>
            <small>ONE TINY THING JUST FOR YOU</small>
          </div>
          <span className="corner-flower">✿</span>
        </div>

        {activeTab === "My Adventures" ? (
          <div className="adventure-summary">
            <div className="adventure-stamp">♡</div>
            <h3>Look how far you've wandered!</h3>
            <p>
              {doneCount} little adventures completed, one lovely moment at a time.
            </p>
            <button
              className="small-action"
              onClick={() => setActiveTab("Home")}
            >
              Back to home <ChevronRight size={14} />
            </button>
          </div>
        ) : (
          <>
            <div className="quest-preview">
              <div className="quest-thumb">
                <span>🌼</span>
                <i>✿</i>
                <b>⌁</b>
              </div>
              <div className="quest-copy">
                <h3>
                  <Leaf size={17} />
                  {currentQuest.title}
                </h3>
                <p>{currentQuest.description}</p>
              </div>
            </div>
            
            {/* UPDATED MAIN DASHBOARD CHECKLIST */}
            <div className="quest-checklist">
              {currentQuest.steps.map((step, index) => (
                <button
                  className={`check-row ${checked.includes(index) ? "is-checked" : ""}`}
                  key={step}
                  onClick={() => toggleStep(index)}
                  style={{ display: 'flex', alignItems: 'center' }}
                >
                  <span className="check-circle" style={{ flexShrink: 0 }}>
                    {checked.includes(index) && <Check size={13} />}
                  </span>
                  
                  <span style={{ flex: 1, textAlign: 'left', paddingRight: '8px' }}>{step}</span>
                  
                  {/* The Inline Camera for the Dashboard */}
                  <div 
                    onClick={(e) => e.stopPropagation()} 
                    style={{ display: 'flex', alignItems: 'center', gap: '8px', flexShrink: 0 }}
                  >
                    {taskPhotos[index] ? (
                      <div style={{ position: 'relative' }}>
                        <img src={taskPhotos[index]} alt="Task memory" style={{ width: '24px', height: '24px', borderRadius: '4px', objectFit: 'cover', border: '1px solid #F8C8D8' }} />
                        <X 
                          size={10} 
                          style={{ position: 'absolute', top: -4, right: -4, background: 'white', borderRadius: '50%', cursor: 'pointer', color: '#d66f7e' }} 
                          onClick={() => {
                            const newPhotos = {...taskPhotos};
                            delete newPhotos[index];
                            setTaskPhotos(newPhotos);
                          }} 
                        />
                      </div>
                    ) : (
                      <label style={{ cursor: 'pointer', color: '#d66f7e', display: 'flex' }}>
                        <Camera size={16} />
                        <input
                          type="file"
                          accept="image/*"
                          capture="environment"
                          style={{ display: 'none' }}
                          onChange={(e) => {
                            if (e.target.files && e.target.files[0]) {
                              setTaskPhotos({ ...taskPhotos, [index]: URL.createObjectURL(e.target.files[0]) });
                            }
                          }}
                        />
                      </label>
                    )}
                    <small>({checked.includes(index) ? "1" : "0"}/1)</small>
                  </div>
                </button>
              ))}
            </div>

            <div className="quest-reward">
              <span className="reward-star">
                <Star size={21} fill="currentColor" />
              </span>
              <b>+{currentQuest.xp} XP</b>
              <span className="reward-time">
                <Clock3 size={17} />
                {currentQuest.time}
              </span>
            </div>
            <div className="quest-buttons">
              <button
                className="start-quest"
                onClick={() => {
                  setModal("quest"); 
                }}
              >
                Start this quest <ChevronRight size={16} />
              </button>
              
              {activeTab === "Home" && (
                <button
                  className="reroll"
                  onClick={() => {
                    setAiQuestState("idle");
                    setModal("ai-setup");
                  }}
                >
                  <RotateCcw size={14} /> Re-roll with AI
                </button>
              )}
            </div>
          </>
        )}
      </section>

      <section className="weather-panel parchment">
        <div className="date-time">
          <div className="date-line">
            <CalendarDays size={15} />
            {dateLabel}
          </div>
          <strong>{timeLabel}</strong>
          <small>your time, your pace</small>
        </div>
        <div className="weather-divider" />
        <div className="weather">
          <CloudSun size={37} />
          <b>22°C</b>
          <small>Sunny</small>
        </div>
      </section>
      
      <button
        className="xp-wallet parchment"
        onClick={() => setModal("rewards")}
      >
        <span className="coin">
          <Star size={19} fill="currentColor" />
        </span>
        <strong>{xp.toLocaleString()} XP</strong>
        <ChevronRight size={15} />
      </button>

      <section className="rewards-panel parchment">
        <div className="rewards-heading">
          <Gift size={20} />
          <h2>My Rewards</h2>
          <span>little treasures ♡</span>
        </div>
        <div className="reward-items">
          <button onClick={() => setModal("rewards")}>
            <span className="reward-art flower-art">🌸</span>
            <b>12</b>
            <small>blossoms</small>
          </button>
          <button onClick={() => setModal("rewards")}>
            <span className="reward-art">🌼</span>
            <b>8</b>
            <small>daisies</small>
          </button>
          <button onClick={() => setModal("rewards")}>
            <span className="reward-art ribbon-art">🎀</span>
            <b>5</b>
            <small>ribbons</small>
          </button>
          <button onClick={() => setModal("rewards")}>
            <span className="reward-art">🍃</span>
            <b>15</b>
            <small>leaves</small>
          </button>
          <button onClick={() => setModal("rewards")}>
            <span className="reward-art">📷</span>
            <b>3</b>
            <small>memories</small>
          </button>
          <button onClick={() => setModal("rewards")}>
            <span className="reward-art">👜</span>
            <b>2</b>
            <small>goodies</small>
          </button>
        </div>
      </section>

      <nav className="bottom-nav" aria-label="Main navigation">
        {[
          { name: "Home", icon: House },
          { name: "Quest", icon: Map },
          { name: "Companion", icon: PawPrint },
          { name: "My Adventures", icon: Flower2 },
        ].map(({ name, icon: Icon }) => (
          <button
            key={name}
            className={activeTab === name ? "active" : ""}
            onClick={() => {
              setActiveTab(name);
              if (name === "Companion") {
                setDraftName(petName);
                setModal("pet");
              }
            }}
          >
            <span>
              <Icon size={25} />
            </span>
            <b>{name}</b>
          </button>
        ))}
      </nav>

      {modal && (
        <div
          className="modal-scrim"
          style={{ backdropFilter: "blur(8px)", backgroundColor: "rgba(0,0,0,0.2)" }} 
          onMouseDown={(e) => {
            if (e.target === e.currentTarget && modal !== "ai-setup") setModal("");
          }}
        >
          <section
            className="modal-card parchment"
            role="dialog"
            aria-modal="true"
            aria-label="Modal dialog"
          >
            {modal !== "ai-setup" && (
              <button
                className="close-modal"
                onClick={() => setModal("")}
                aria-label="Close"
              >
                <X size={18} />
              </button>
            )}

            {modal === "ai-setup" && (
              <>
                <div className="modal-kicker">WELCOME OUTSIDE</div>
                <h2>Feeling a bit stuck?</h2>
                <p className="modal-description" style={{ marginBottom: "1.5rem" }}>
                  Let's find a tiny adventure for you right now.
                </p>

                {aiQuestState === "idle" && (
                  <button 
                    className="modal-primary" 
                    onClick={() => setAiQuestState('setup')}
                  >
                    ✨ I'm bored — give me a quest
                  </button>
                )}

                {aiQuestState === "setup" && (
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                    <select 
                      style={{ padding: '10px', borderRadius: '12px', border: '1px solid #F8C8D8', outline: 'none' }}
                      value={preferences.mood}
                      onChange={(e) => setPreferences({...preferences, mood: e.target.value})}
                    >
                      <option value="">How are you feeling?</option>
                      <option value="bored">Just bored</option>
                      <option value="stressed">A bit stressed</option>
                      <option value="sluggish">Sluggish</option>
                    </select>

                    <select 
                      style={{ padding: '10px', borderRadius: '12px', border: '1px solid #F8C8D8', outline: 'none' }}
                      value={preferences.energy}
                      onChange={(e) => setPreferences({...preferences, energy: e.target.value})}
                    >
                      <option value="">What's your energy level?</option>
                      <option value="low">Low (Keep it easy)</option>
                      <option value="medium">Medium (Up for a walk)</option>
                      <option value="high">High (Let's go!)</option>
                    </select>

                    <select 
                      style={{ padding: '10px', borderRadius: '12px', border: '1px solid #F8C8D8', outline: 'none' }}
                      value={preferences.time}
                      onChange={(e) => setPreferences({...preferences, time: e.target.value})}
                    >
                      <option value="">How much time do you have?</option>
                      <option value="10">10 minutes</option>
                      <option value="20">20 minutes</option>
                      <option value="60">An hour or more</option>
                    </select>

                    <button 
                      className="modal-primary"
                      style={{ marginTop: '10px' }}
                      onClick={handleGenerateQuest}
                    >
                      Generate My Adventure <ChevronRight size={16} />
                    </button>
                  </div>
                )}







                {aiQuestState === "loading" && (
                  <div style={{ display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center', padding: '3rem 0' }}>
                    {/* Bouncing flower icon */}
                    <div className="animate-bounce" style={{ fontSize: '2.5rem', marginBottom: '12px' }}>
                      🌸
                    </div>
                    {/* Pulsing cozy text */}
                    <p className="animate-pulse" style={{ color: '#7a635c', fontFamily: 'Nunito', fontWeight: 'bold' }}>
                      Your little adventure is blooming...
                    </p>
                  </div>
                )}








              </>
            )}

            {modal === "pet" && (
              <>
                <div className="modal-kicker">YOUR LITTLE SIDEKICK</div>
                <h2>Who's coming along?</h2>
                <p className="modal-description">
                  Choose a buddy for your little adventures.
                </p>
                <div className="pet-options">
                  <button
                    className={pet === "cat" ? "chosen" : ""}
                    onClick={() => setPet("cat")}
                  >
                    <Companion type="cat" />
                    <b>Mochi the cat</b>
                    <small>curious & cozy</small>
                  </button>
                  <button
                    className={pet === "dog" ? "chosen" : ""}
                    onClick={() => setPet("dog")}
                  >
                    <Companion type="dog" />
                    <b>Bean the pup</b>
                    <small>sunshine & zoomies</small>
                  </button>
                </div>
                <label className="name-label" htmlFor="buddy-name">
                  Your buddy's name
                </label>
                <input
                  id="buddy-name"
                  value={draftName}
                  maxLength={16}
                  onChange={(e) => setDraftName(e.target.value)}
                  placeholder="e.g. Mochi"
                />
                <button
                  className="modal-primary"
                  onClick={() => {
                    if (draftName.trim()) setPetName(draftName.trim());
                    setModal("");
                  }}
                >
                  Save my buddy <Heart size={15} />
                </button>
              </>
            )}

            {modal === "rewards" && (
              <>
                <div className="modal-kicker">YOUR LITTLE TREASURE BOX</div>
                <h2>All your tiny wins ♡</h2>
                <p className="modal-description">
                  Every quest adds a little something to your journey.
                </p>
                <div className="reward-total">
                  <Star size={26} fill="currentColor" />
                  <strong>{xp} XP</strong>
                  <span>collected so far</span>
                </div>
                <div className="reward-list">
                  <span>🌸 Blossom tokens <b>12</b></span>
                  <span>🌼 Daisy tokens <b>8</b></span>
                  <span>🎀 Cozy ribbons <b>5</b></span>
                  <span>🍃 Meadow leaves <b>15</b></span>
                </div>
                <button className="modal-primary" onClick={() => setModal("")}>
                  Back to my garden <Heart size={15} />
                </button>
              </>
            )}

            {modal === "quest" && (
              <div className="quest-done">
                <div className="done-flower">✿</div>
                <div className="modal-kicker">
                  <Sparkles size={14} /> ACTIVE ADVENTURE
                </div>
                <h2>{currentQuest.title}</h2>
                <p className="modal-description">
                  Take your time. Mochi is cheering for you!
                </p>
                
                {/* UPDATED MODAL CHECKLIST WITH INLINE CAMERAS */}
                <div className="modal-steps whitespace-nowrap">
                  {currentQuest.steps.map((step, index) => (
                    <button
                      key={step}
                      className={checked.includes(index) ? "done" : ""}
                      onClick={() => toggleStep(index)}
                      style={{ display: 'flex', alignItems: 'center' }}
                    >
                      <span style={{ flexShrink: 0 }}>
                        {checked.includes(index) ? <Check size={14} /> : index + 1}
                      </span>
                      
                      <span style={{ flex: 1, textAlign: 'left', paddingRight: '8px' }}>{step}</span>

                      {/* Inline Camera for the Modal */}
                      <div 
                        onClick={(e) => e.stopPropagation()} 
                        style={{ display: 'flex', alignItems: 'center', flexShrink: 0 }}
                      >
                        {taskPhotos[index] ? (
                          <div style={{ position: 'relative' }}>
                            <img src={taskPhotos[index]} alt="Task memory" style={{ width: '28px', height: '28px', borderRadius: '6px', objectFit: 'cover', border: '1px solid #F8C8D8' }} />
                            <X 
                              size={12} 
                              style={{ position: 'absolute', top: -5, right: -5, background: 'white', color: '#d66f7e', borderRadius: '50%', cursor: 'pointer', boxShadow: '0 2px 4px rgba(0,0,0,0.1)' }} 
                              onClick={() => {
                                const newPhotos = {...taskPhotos};
                                delete newPhotos[index];
                                setTaskPhotos(newPhotos);
                              }} 
                            />
                          </div>
                        ) : (
                          <label style={{ cursor: 'pointer', color: '#9a7b6f', display: 'flex', }}>
                            <Camera size={18} />
                            <input
                              type="file"
                              accept="image/*"
                              capture="environment"
                              style={{ display: 'none' }}
                              onChange={(e) => {
                                if (e.target.files && e.target.files[0]) {
                                  setTaskPhotos({ ...taskPhotos, [index]: URL.createObjectURL(e.target.files[0]) });
                                }
                              }}
                            />
                          </label>
                        )}
                      </div>
                    </button>
                  ))}
                </div>

                <button
                  className="modal-primary"
                  style={{ marginTop: '1.5rem' }}
                  onClick={() => {
                    finishQuest();
                    setTaskPhotos({}); // Clear all photos when done
                    setModal("");
                  }}
                  disabled={completed}
                >
                  {completed ? "Quest completed ♡" : "I finished my quest"} <Check size={16} />
                </button>
              </div>
            )}
          </section>
        </div>
      )}
    </main>
  );
}
export default App;
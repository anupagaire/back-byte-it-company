import styles from "./AboutHero.module.css";

export default function AboutHero() {
  return (
    <section className={styles.page}>
      <svg
        className={styles.bgBlobs}
        viewBox="0 0 1440 820"
        preserveAspectRatio="xMidYMid slice"
        xmlns="http://www.w3.org/2000/svg"
        aria-hidden="true"
      >
        <ellipse cx="1050" cy="420" rx="520" ry="480" fill="#d9d2f7" opacity="0.55" />
        <path
          d="M-60 620 Q200 500 400 700 Q600 900 -60 900Z"
          fill="#d4cdf5"
          opacity="0.45"
        />
        <path
          d="M420 760 Q640 640 900 720 Q1100 780 1300 660"
          fill="none"
          stroke="#c5bced"
          strokeWidth="1.5"
          opacity="0.6"
        />
        <path
          d="M460 780 Q680 660 940 740 Q1140 800 1340 680"
          fill="none"
          stroke="#c5bced"
          strokeWidth="1"
          opacity="0.4"
        />
        <path
          d="M900 -40 Q1200 100 1460 300 Q1540 420 1460 560"
          fill="none"
          stroke="#c0b8ea"
          strokeWidth="1.5"
          opacity="0.5"
        />
        <path
          d="M940 -40 Q1240 100 1500 310"
          fill="none"
          stroke="#c0b8ea"
          strokeWidth="1"
          opacity="0.35"
        />
      </svg>

     

      {/* ── HERO GRID ── */}
      <div className="relative z-10 grid grid-cols-2 items-center h-[calc(100vh-74px)] px-12 gap-10 max-w-7xl mx-auto">

        {/* LEFT */}
        <div className="max-w-[460px]">
          <div className="flex items-start gap-4">
            
            <h1 className={styles.heading}>Smart Solutions for a Digital Future</h1>
          </div>
          <p className={styles.bodyText}>
            Back Byte Technology delivers cutting-edge web, mobile, and software solutions designed to transform your ideas into reality.
          </p>
          <button className={styles.btnRead}>Get Started</button>
        </div>

        {/* RIGHT — CIRCLES */}
        <div className="relative flex justify-center items-center h-full">

          {/* Floating dots */}
          <span className={`${styles.dot} ${styles.d1}`} />
          <span className={`${styles.dot} ${styles.d2}`} />
          <span className={`${styles.dot} ${styles.d3}`} />
          <span className={`${styles.dot} ${styles.d4}`} />
          <span className={`${styles.dot} ${styles.d5}`} />

          {/* MAIN CIRCLE */}
          <div className={styles.circleMain}>
            <svg viewBox="0 0 290 290" xmlns="http://www.w3.org/2000/svg" className="w-full">
              <rect x="80" y="170" width="130" height="120" rx="18" fill="#4a3fa0" />
              <rect x="127" y="148" width="36" height="28" rx="8" fill="#f4b98e" />
              <ellipse cx="145" cy="130" rx="38" ry="40" fill="#f4b98e" />
              <path d="M108 118 Q90 200 100 270 L145 260 L190 270 Q200 200 182 118 Q165 95 145 93 Q125 95 108 118Z" fill="#f5c842" opacity=".9" />
              <ellipse cx="133" cy="128" rx="4" ry="5" fill="#c47a52" />
              <ellipse cx="157" cy="128" rx="4" ry="5" fill="#c47a52" />
              <path d="M80 175 Q50 140 60 110 Q66 100 74 108 Q68 136 95 168Z" fill="#4a3fa0" />
              <ellipse cx="64" cy="106" rx="8" ry="8" fill="#f4b98e" />
              <path d="M210 175 Q240 155 235 190Z" fill="#4a3fa0" />
            </svg>
          </div>

          {/* TOP-RIGHT CIRCLE */}
          <div className={styles.circleTop}>
            <svg viewBox="0 0 148 148" xmlns="http://www.w3.org/2000/svg" className="w-full">
              <rect x="30" y="88" width="88" height="70" rx="14" fill="#e07b32" />
              <rect x="58" y="70" width="32" height="24" rx="7" fill="#f4b98e" />
              <ellipse cx="74" cy="58" rx="26" ry="27" fill="#f4b98e" />
              <path d="M48 44 Q48 10 74 10 Q100 10 100 44 Q102 70 96 74 Q88 60 74 60 Q60 60 52 74 Q46 70 48 44Z" fill="#2d2245" />
              <ellipse cx="66" cy="56" rx="3" ry="4" fill="#b5724a" />
              <ellipse cx="82" cy="56" rx="3" ry="4" fill="#b5724a" />
              <path d="M118 92 Q138 80 140 86 Q138 94 118 104Z" fill="#e07b32" />
              <ellipse cx="141" cy="83" rx="7" ry="7" fill="#f4b98e" />
            </svg>
          </div>

          {/* BOTTOM-RIGHT CIRCLE */}
          <div className={styles.circleBot}>
            <svg viewBox="0 0 162 162" xmlns="http://www.w3.org/2000/svg" className="w-full">
              <rect x="36" y="96" width="90" height="76" rx="14" fill="#f5a623" />
              <rect x="63" y="76" width="36" height="26" rx="8" fill="#f4b98e" />
              <ellipse cx="81" cy="62" rx="28" ry="29" fill="#f4b98e" />
              <path d="M53 50 Q53 22 81 22 Q109 22 109 50 Q110 62 107 66 Q100 52 81 52 Q62 52 55 66 Q50 62 53 50Z" fill="#2d2245" />
              <ellipse cx="72" cy="60" rx="3.5" ry="4.5" fill="#b5724a" />
              <ellipse cx="90" cy="60" rx="3.5" ry="4.5" fill="#b5724a" />
              <path d="M126 100 Q146 92 148 98 Q146 108 126 114Z" fill="#f5a623" />
              <ellipse cx="149" cy="95" rx="7" ry="7" fill="#f4b98e" />
            </svg>
          </div>

        </div>
      </div>
    </section>
  );
}
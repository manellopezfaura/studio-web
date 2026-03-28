import { useTranslations } from "next-intl";

const STEP_ICONS = [
  // Compass / Discovery
  <svg key="0" width="32" height="32" viewBox="0 0 32 32" fill="none" aria-hidden="true">
    <circle cx="16" cy="16" r="12" stroke="currentColor" strokeWidth="1.5" strokeDasharray="3 3"/>
    <circle cx="16" cy="16" r="3" fill="currentColor"/>
    <line x1="16" y1="4" x2="16" y2="8" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
    <line x1="16" y1="24" x2="16" y2="28" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
    <line x1="4" y1="16" x2="8" y2="16" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
    <line x1="24" y1="16" x2="28" y2="16" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
  </svg>,
  // Design / Layers
  <svg key="1" width="32" height="32" viewBox="0 0 32 32" fill="none" aria-hidden="true">
    <polygon points="16,4 28,10 28,22 16,28 4,22 4,10" stroke="currentColor" strokeWidth="1.5" strokeLinejoin="round"/>
    <polygon points="16,10 22,13 22,19 16,22 10,19 10,13" stroke="currentColor" strokeWidth="1.5" strokeLinejoin="round"/>
    <circle cx="16" cy="16" r="2" fill="currentColor"/>
  </svg>,
  // Rocket / Launch
  <svg key="2" width="32" height="32" viewBox="0 0 32 32" fill="none" aria-hidden="true">
    <path d="M16 4C16 4 22 8 22 16C22 20 20 24 16 26C12 24 10 20 10 16C10 8 16 4 16 4Z" stroke="currentColor" strokeWidth="1.5" strokeLinejoin="round"/>
    <circle cx="16" cy="16" r="2.5" fill="currentColor"/>
    <path d="M10 22L6 26" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
    <path d="M22 22L26 26" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
    <path d="M7 14C5.5 15 5 17 5 17" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
    <path d="M25 14C26.5 15 27 17 27 17" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
  </svg>,
];

const STEP_VARIANTS = ["svc-tl__card--one", "svc-tl__card--two", "svc-tl__card--three"];

export function ServiceProcess() {
  const t = useTranslations("ServicesPage.Process");
  const steps = [0, 1, 2] as const;

  return (
    <div className="mxd-section overflow-hidden padding-default">
      <div className="mxd-container grid-container">
        <div className="mxd-block">

          {/* Section header */}
          <div className="svc-tl__header">
            <p className="mxd-point-subtitle anim-uni-in-up">
              <svg version="1.1" xmlns="http://www.w3.org/2000/svg" width="20px" height="20px" viewBox="0 0 20 20" fill="currentColor">
                <path fill="currentColor" d="M19.6,9.6c0,0-3,0-4,0c-0.4,0-1.8-0.2-1.8-0.2c-0.6-0.1-1.1-0.2-1.6-0.6c-0.5-0.3-0.9-0.8-1.2-1.2c-0.3-0.4-0.4-0.9-0.5-1.4c0,0-0.1-1.1-0.2-1.5c-0.1-1.1,0-4.4,0-4.4C10.4,0.2,10.2,0,10,0S9.6,0.2,9.6,0.4c0,0,0.1,3.3,0,4.4c0,0.4-0.2,1.5-0.2,1.5C9.4,6.7,9.2,7.2,9,7.6C8.7,8.1,8.2,8.5,7.8,8.9c-0.5,0.3-1,0.5-1.6,0.6c0,0-1.2,0.1-1.7,0.2c-1,0.1-4.2,0-4.2,0C0.2,9.6,0,9.8,0,10c0,0.2,0.2,0.4,0.4,0.4c0,0,3.1-0.1,4.2,0c0.4,0,1.7,0.2,1.7,0.2c0.6,0.1,1.1,0.2,1.6,0.6c0.4,0.3,0.8,0.7,1.1,1.1c0.3,0.5,0.5,1,0.6,1.6c0,0,0.1,1.3,0.2,1.7c0,1,0,4.1,0,4.1c0,0.2,0.2,0.4,0.4,0.4s0.4-0.2,0.4-0.4c0,0,0-3.1,0-4.1c0-0.4,0.2-1.7,0.2-1.7c0.1-0.6,0.2-1.1,0.6-1.6c0.3-0.4,0.7-0.8,1.1-1.1c0.5-0.3,1-0.5,1.6-0.6c0,0,1.3-0.1,1.8-0.2c1,0,4,0,4,0c0.2,0,0.4-0.2,0.4-0.4C20,9.8,19.8,9.6,19.6,9.6L19.6,9.6z"/>
              </svg>
              <span>{t("subtitle")}</span>
            </p>
            <h2 className="svc-tl__title anim-uni-in-up">{t("title")}</h2>
          </div>

          {/* Timeline */}
          <div className="svc-tl" role="list">

            {/* Connecting track — desktop only */}
            <div className="svc-tl__track" aria-hidden="true">
              <div className="svc-tl__track-line" />
            </div>

            {/* Steps */}
            <div className="svc-tl__steps">
              {steps.map((i) => (
                <div key={i} className="svc-tl__step" role="listitem">

                  {/* Node on the timeline */}
                  <div className="svc-tl__node-wrap">
                    <div className="svc-tl__node anim-uni-in-up">
                      <span className="svc-tl__node-num">{t(`steps.${i}.number`)}</span>
                    </div>
                    <div className="svc-tl__connector" aria-hidden="true" />
                  </div>

                  {/* Card */}
                  <div className={`svc-tl__card ${STEP_VARIANTS[i]} anim-uni-in-up`}>
                    <div className="svc-tl__card-icon">{STEP_ICONS[i]}</div>
                    <div className="svc-tl__card-ghost" aria-hidden="true">
                      {t(`steps.${i}.number`)}
                    </div>
                    <h3 className="svc-tl__card-title">{t(`steps.${i}.title`)}</h3>
                    <p className="svc-tl__card-desc">{t(`steps.${i}.desc`)}</p>
                  </div>

                </div>
              ))}
            </div>
          </div>

        </div>
      </div>
    </div>
  );
}

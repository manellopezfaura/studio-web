"use client";

import Counter from "@/components/common/Counter";
import { useTranslations } from "next-intl";

const STATS = [
  { max: 5,  suffix: "+", labelKey: "stats.0.label" },
  { max: 70, suffix: "+", labelKey: "stats.1.label" },
  { max: 15, suffix: "+", labelKey: "stats.2.label" },
] as const;

export function ServicesStats() {
  const t = useTranslations("ServicesPage.Hero");

  return (
    <div className="mxd-section overflow-hidden">
      <div className="mxd-container grid-container">
        <div className="mxd-block">
          <div className="svc-stats anim-uni-in-up">
            {STATS.map((stat, i) => (
              <div key={i} className="svc-stats__item">
                <p className="svc-stats__number">
                  <Counter max={stat.max} />{stat.suffix}
                </p>
                <p className="svc-stats__label">{t(stat.labelKey)}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

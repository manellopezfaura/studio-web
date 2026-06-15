import { getTranslations } from "next-intl/server";
import AnimatedButton from "@/components/animation/AnimatedButton";
import RevealText from "@/components/animation/RevealText";

export default async function About() {
  const t = await getTranslations("HomePage.About");
  const values = t.raw("values") as string[];
  return (
    <div className="mxd-section padding-default">
      <div className="mxd-container grid-container">
        {/* Block - About Description with H2 Title and Paragraph Start */}
        <div className="mxd-block">
          <div className="container-fluid px-0">
            <div className="row gx-0">
              <div className="col-12 col-xl-5 mxd-grid-item no-margin">
                <div className="mxd-block__name">
                  <RevealText as="h2" className="reveal-type anim-uni-in-up">
                    {t("title")}
                  </RevealText>
                </div>
              </div>
              <div className="col-12 col-xl-6 mxd-grid-item no-margin">
                <div className="mxd-block__content">
                  <div className="mxd-block__paragraph">
                    <p className="t-large t-bright anim-uni-in-up">
                      {t("intro")}
                    </p>
                    <div className="mxd-paragraph__lists">
                      <div className="container-fluid p-0">
                        <div className="row g-0">
                          <div className="col-6 col-xl-5">
                            <ul>
                              {values.slice(0, 3).map((v) => (
                                <li key={v}>
                                  <p className="anim-uni-in-up">{v}</p>
                                </li>
                              ))}
                            </ul>
                          </div>
                          <div className="col-6 col-xl-5">
                            <ul>
                              {values.slice(3, 6).map((v) => (
                                <li key={v}>
                                  <p className="anim-uni-in-up">{v}</p>
                                </li>
                              ))}
                            </ul>
                          </div>
                        </div>
                      </div>
                    </div>
                    <div className="mxd-paragraph__controls anim-uni-in-up">
                      <AnimatedButton
                        text={t("cta")}
                        className="btn btn-anim btn-default btn-outline slide-right-up"
                        href={`/about-us`}
                      >
                        <i className="ph-bold ph-arrow-up-right" />
                      </AnimatedButton>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
        {/* Block - About Description with H2 Title and Paragraph End */}
      </div>
    </div>
  );
}

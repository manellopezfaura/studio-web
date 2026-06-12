"use client";
import { useTranslations } from "next-intl";

export default function Locations() {
  const t = useTranslations("ContactPage.Locations");
  return (
    <div className="mxd-section padding-default">
      <div className="mxd-container grid-container">
        {/* Block - Text Block with H2 Title, Paragraph and Contact Lists Start */}
        <div className="mxd-block">
          <div className="container-fluid px-0">
            <div className="row gx-0">
              <div className="col-12 col-xl-5 mxd-grid-item no-margin">
                <div className="mxd-block__name">
                  <h2 className="reveal-type anim-uni-in-up">
                    {t("title")}
                  </h2>
                </div>
              </div>
              <div className="col-12 col-xl-6 mxd-grid-item no-margin">
                <div className="mxd-block__content">
                  <div className="mxd-block__paragraph">
                    <p className="t-large t-bright anim-uni-in-up">
                      {t("text")}
                    </p>
                    <div className="mxd-paragraph__lists">
                      <div className="container-fluid p-0">
                        <div className="row g-0">
                          <div className="col-12 col-md-6 col-xl-5 mxd-paragraph__lists-item">
                            <div className="mxd-paragraph__lists-title">
                              <p className="t-large t-bright t-caption anim-uni-in-up">
                                {t("barcelona")}
                              </p>
                            </div>
                            <ul>
                              <li className="anim-uni-in-up">
                                <a
                                  className="anim-uni-in-up"
                                  href="https://maps.app.goo.gl/wbhWXYBkpTwBLSXC9"
                                  target="_blank"
                                  rel="noopener noreferrer"
                                >
                                  Barcelona,
                                  <br />
                                  España
                                </a>
                              </li>
                            </ul>
                            <ul>
                              <li className="anim-uni-in-up">
                                <a href="tel:+34677184699">+34 677 18 46 99</a>
                              </li>
                              <li className="anim-uni-in-up">
                                <a href="mailto:hola@107studio.es?subject=Hola%20107%20Studio">
                                  hola@107studio.es
                                </a>
                              </li>
                            </ul>
                          </div>
                          <div className="col-12 col-md-6 col-xl-5 mxd-paragraph__lists-item">
                            <div className="mxd-paragraph__lists-title">
                              <p className="t-large t-bright t-caption anim-uni-in-up">
                                {t("remote")}
                              </p>
                            </div>
                            <ul>
                              <li className="anim-uni-in-up">{t("remoteText")}</li>
                            </ul>
                            <ul>
                              <li className="anim-uni-in-up">
                                <a href="mailto:hola@107studio.es?subject=Hola%20107%20Studio">
                                  hola@107studio.es
                                </a>
                              </li>
                            </ul>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
        {/* Block - Text Block with H2 Title, Paragraph and Contact Lists End */}
      </div>
    </div>
  );
}

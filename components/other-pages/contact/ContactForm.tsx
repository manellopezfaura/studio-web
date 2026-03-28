"use client";
import { type ContactForm, contactSchema } from "@/schemas/contact";
import { useForm as useHookForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "@formspree/react";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import AnimatedButton from "@/components/animation/AnimatedButton";
import { useTranslations } from "next-intl";

export default function ContactForm() {
  const t = useTranslations("ContactPage.Form");

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useHookForm<ContactForm>({
    resolver: zodResolver(contactSchema),
  });

  // Formspree submit hook
  const [fsState, fsSubmit] = useForm<ContactForm>("meoljlry");

  const onSubmit = async (data: ContactForm) => {
    try {
      await fsSubmit(data); // submit to Formspree
      reset(); // reset form fields
      toast.success(t("toastSuccess"));
    } catch {
      toast.error(t("toastError"));
    }
  };

  return (
    <>
      <div className="mxd-section mxd-section-inner-form padding-default">
        <div className="mxd-container grid-container">
          <div className="mxd-block">
            <div className="container-fluid px-0">
              <div className="row gx-0">
                <div className="col-12 col-xl-2 mxd-grid-item no-margin" />
                <div className="col-12 col-xl-8">
                  <div className="mxd-block__content contact">
                    <div className="mxd-block__inner-form loading__fade">
                      <div className="form-container">
                        {/* Reply Messages */}
                        <div className="form__reply centered text-center">
                          <i className="ph-fill ph-smiley-wink reply__icon" />
                          <p className="reply__title">{t("successTitle")}</p>
                          <span className="reply__text">
                            {t("successText")}
                          </span>
                        </div>
                        {/* Contact Form */}
                        <form
                          className="form contact-form"
                          id="contact-form"
                          onSubmit={handleSubmit(onSubmit)}
                        >
                          {/* Hidden Required Fields */}
                          <input
                            type="hidden"
                            name="project_name"
                            defaultValue="107 Studio"
                          />
                          <input
                            type="hidden"
                            name="admin_email"
                            defaultValue="support@mixdesign.dev"
                          />
                          <input
                            type="hidden"
                            name="form_subject"
                            defaultValue="Contact Form Message"
                          />
                          {/* Visible Fields */}
                          <div className="container-fluid p-0">
                            <div className="row gx-0">
                              <div className="col-12 col-md-6 mxd-grid-item anim-uni-in-up">
                                <input
                                  type="text"
                                  placeholder={t("namePlaceholder")}
                                  aria-label={t("namePlaceholder")}
                                  {...register("Name")}
                                />
                                {errors.Name && (
                                  <p className="error-message" role="alert">
                                    {errors.Name.message}
                                  </p>
                                )}
                              </div>
                              <div className="col-12 col-md-6 mxd-grid-item anim-uni-in-up">
                                <input
                                  type="text"
                                  placeholder={t("companyPlaceholder")}
                                  aria-label={t("companyPlaceholder")}
                                  {...register("Company")}
                                />
                              </div>
                              <div className="col-12 col-md-6 mxd-grid-item anim-uni-in-up">
                                <input
                                  type="email"
                                  placeholder={t("emailPlaceholder")}
                                  aria-label={t("emailPlaceholder")}
                                  {...register("E-mail")}
                                />
                                {errors["E-mail"] && (
                                  <p className="error-message" role="alert">
                                    {errors["E-mail"].message}
                                  </p>
                                )}
                              </div>
                              <div className="col-12 col-md-6 mxd-grid-item anim-uni-in-up">
                                <input
                                  type="tel"
                                  placeholder={t("phonePlaceholder")}
                                  aria-label={t("phonePlaceholder")}
                                  {...register("Phone")}
                                />
                              </div>
                              <div className="col-12 mxd-grid-item anim-uni-in-up">
                                <textarea
                                  placeholder={t("messagePlaceholder")}
                                  aria-label={t("messagePlaceholder")}
                                  {...register("Message")}
                                />
                                {errors.Message && (
                                  <p className="error-message" role="alert">
                                    {errors.Message.message}
                                  </p>
                                )}
                              </div>
                              <div className="col-12 mxd-grid-item anim-uni-in-up">
                                <AnimatedButton
                                  text={t("submitButton")}
                                  position={"next"}
                                  as={"button"}
                                  className="btn btn-anim btn-default btn-large btn-opposite slide-right-up"
                                  type="submit"
                                  disabled={isSubmitting || fsState.submitting}
                                >
                                  <i className="ph-bold ph-arrow-up-right" />
                                </AnimatedButton>
                              </div>
                            </div>
                          </div>
                        </form>
                        {/* End Contact Form */}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      <ToastContainer position="bottom-right" />
    </>
  );
}

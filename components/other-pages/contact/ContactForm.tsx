"use client";
import { type ContactForm, contactSchema } from "@/schemas/contact";
import { useForm as useHookForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
// Web3Forms for contact form submissions
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

  const onSubmit = async (data: ContactForm) => {
    try {
      const res = await fetch("https://api.web3forms.com/submit", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          access_key: "a0cd5541-ff70-497d-b92d-88188530eb58",
          subject: "Nuevo mensaje de contacto — 107studio.es",
          from_name: data.Name,
          ...data,
        }),
      });
      if (!res.ok) throw new Error("Submit failed");
      reset();
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
                          {/* Hidden Fields */}
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
                                  disabled={isSubmitting}
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

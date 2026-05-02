"use client";

import { useState } from "react";
import { useForm as useHookForm } from "react-hook-form";
import { useForm } from "@formspree/react";
import { useTranslations } from "next-intl";
import AnimatedButton from "../animation/AnimatedButton";

type FooterContactFields = {
  Name: string;
  "E-mail": string;
  Message: string;
};

export default function FooterContactForm() {
  const t = useTranslations("ContactPage.Form");
  const [status, setStatus] = useState<"idle" | "success" | "error">("idle");
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useHookForm<FooterContactFields>();

  const [fsState, fsSubmit] = useForm<FooterContactFields>("meoljlry");

  const onSubmit = async (data: FooterContactFields) => {
    setStatus("idle");
    try {
      await fsSubmit(data);
      reset();
      setStatus("success");
    } catch {
      setStatus("error");
    }
  };

  return (
    <div className="form-container anim-uni-in-up">
      <form
        className="form footer-contact-form form-light"
        onSubmit={handleSubmit(onSubmit)}
      >
        <input
          type="text"
          placeholder={t("namePlaceholder")}
          {...register("Name", {
            required: t("nameRequired"),
            minLength: { value: 2, message: t("nameRequired") },
          })}
        />
        {errors.Name && (
          <p className="footer-contact-form__error">{errors.Name.message}</p>
        )}

        <input
          type="email"
          placeholder={t("emailPlaceholder")}
          {...register("E-mail", {
            required: t("emailRequired"),
            pattern: {
              value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
              message: t("emailInvalid"),
            },
          })}
        />
        {errors["E-mail"] && (
          <p className="footer-contact-form__error">
            {errors["E-mail"].message}
          </p>
        )}

        <textarea
          placeholder={t("messagePlaceholder")}
          {...register("Message", {
            required: t("messageRequired"),
            minLength: { value: 5, message: t("messageTooShort") },
          })}
        />
        {errors.Message && (
          <p className="footer-contact-form__error">{errors.Message.message}</p>
        )}

        <AnimatedButton
          text={fsState.submitting ? t("sending") : t("submitButton")}
          position={"next"}
          as={"button"}
          className="btn btn-anim btn-default btn-small btn-outline slide-right-up footer-contact-form__submit"
          type="submit"
          disabled={isSubmitting || fsState.submitting}
        >
          <i className="ph-bold ph-arrow-up-right" />
        </AnimatedButton>
      </form>

      {status === "success" && (
        <p className="footer-contact-form__status footer-contact-form__status--ok">
          {t("statusSuccess")}
        </p>
      )}
      {status === "error" && (
        <p className="footer-contact-form__status footer-contact-form__status--error">
          {t("statusError")}
        </p>
      )}
    </div>
  );
}

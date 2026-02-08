"use client";

import { useState } from "react";
import { useForm as useHookForm } from "react-hook-form";
import { useForm } from "@formspree/react";
import AnimatedButton from "../animation/AnimatedButton";

type FooterContactFields = {
  Name: string;
  "E-mail": string;
  Message: string;
};

export default function FooterContactForm() {
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
          placeholder="Your name*"
          {...register("Name", {
            required: "Name is required",
            minLength: { value: 2, message: "Name is required" },
          })}
        />
        {errors.Name && (
          <p className="footer-contact-form__error">{errors.Name.message}</p>
        )}

        <input
          type="email"
          placeholder="Email*"
          {...register("E-mail", {
            required: "Email is required",
            pattern: {
              value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
              message: "Invalid email address",
            },
          })}
        />
        {errors["E-mail"] && (
          <p className="footer-contact-form__error">
            {errors["E-mail"].message}
          </p>
        )}

        <textarea
          placeholder="Tell us about your project*"
          {...register("Message", {
            required: "Message is required",
            minLength: { value: 5, message: "Message is too short" },
          })}
        />
        {errors.Message && (
          <p className="footer-contact-form__error">{errors.Message.message}</p>
        )}

        <AnimatedButton
          text={fsState.submitting ? "Sending..." : "Send Message"}
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
          Message sent. We&apos;ll reply soon.
        </p>
      )}
      {status === "error" && (
        <p className="footer-contact-form__status footer-contact-form__status--error">
          Could not send now. Please try again.
        </p>
      )}
    </div>
  );
}

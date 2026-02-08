"use client";
import { useEffect, useRef } from "react";
import Typed from "typed.js";

export default function TypedText({
  strings = ["UI/UX Designers", "3D Artists", "Illustrators", "Web Developers", "Brand Strategists"],
}) {
  const el = useRef<HTMLSpanElement | null>(null); // Element where Typed will attach
  const typedInstance = useRef<Typed | null>(null); // Store Typed instance
  useEffect(() => {
    if (el.current) {
      typedInstance.current = new Typed(el.current, {
        stringsElement: "#typed-strings",
        loop: true,
        typeSpeed: 60,
        backSpeed: 30,
        backDelay: 2500,
      });
    }

    // Cleanup on component unmount
    return () => {
      if (typedInstance.current) {
        typedInstance.current.destroy();
      }
    };
  }, [strings]);

  return (
    <>
      <span id="typed-strings">
        {strings.map((text, key) => (
          <b key={key}>{text}</b>
        ))}
      </span>
      <span id="typed" ref={el} />
    </>
  );
}

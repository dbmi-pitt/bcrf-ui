"use client";

import Link from "next/link";

const LinkButton = ({ className, href, children, ...props }) => {
  return (
    <Link
      href={href}
      className={
        "c-btn c-btn--secondary btn rounded-pill mt-3 px-4 shadow" +
        (className ? " " + className : "")
      }
      {...props}
    >
      {children}
    </Link>
  );
};

export default LinkButton;

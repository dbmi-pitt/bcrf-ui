"use client";

const LinkButton = ({ className, href, children, variant = "secondary",
   ...props }) => {
  return (
    <a
      href={href}
      className={
        `c-btn c-btn--${variant} mt-3 shadow` +
        (className ? " " + className : "")
      }
      {...props}
    >
      {children}
    </a>
  );
};

export default LinkButton;

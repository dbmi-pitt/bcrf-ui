"use client";

const LinkButton = ({ className, href, children, variant = "secondary",
   ...props }) => {
  return (
    <a
      href={href}
      className={
        `c-btn c-btn--${variant} btn rounded-pill mt-3 px-4 shadow` +
        (className ? " " + className : "")
      }
      {...props}
    >
      {children}
    </a>
  );
};

export default LinkButton;

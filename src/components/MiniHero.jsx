import React from "react";

const MiniHero = ({content}) => {
  return (
    <section
      className="c-box txt--blue--primary"
      style={{
        backgroundImage: `url(${content.image})`,
        width: "100%",
        height: "100%",
        backgroundSize: "cover",
      }}
      aria-label={content.title}
    >
      <div className="c-box--surrounded">
        <h2 className="fs-2">{content.title}</h2>
        <p className="fs-4">{content.body}</p>
      </div>
    </section>
  );
};

export default MiniHero;

import React from "react";
import Image from "next/image";
import LinkButton from "./LinkButton";

const SiblingsContent = ({content}) => {

  return (
    <section className="c-box txt--blue--primary">
      <div className="c-box__wrap c-box--flex mgn-v-10 ">
        {content.columns.map((section, index) => (
          <div className="col" key={index}>
          <div className={`c-box__head has-edgeImg c-box__head--${index % 2 === 0 ? 'l' : 'r'}`}>
            <Image
              className="w-fixed"
              src={section.image}
              alt={section.title}
              width={433}
              height={247}
            />
            <h2 className="display-5 h--eyebrow">{section.title}</h2>
          </div>
          <div className="c-box__body">
            <p className="lead mb-4 hurmeFontSemiBold">
              {section.body}
            </p>
            <div className="d-grid gap-4 d-sm-flex">
              <LinkButton
                href={section.btn.href}
                variant="primary"
                className="btn-secondary btn-lg hurmeFontHeading text-white"
              >
                {section.btn.text}
              </LinkButton>
            </div>
          </div>
        </div>
        ))}
      </div>
    </section>
  );
};

export default SiblingsContent;

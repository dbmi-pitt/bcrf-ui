const BasicHero = ({ content }) => {
  return (
    <section
      className="c-hero c-box txt--white"
      style={{ backgroundImage: `url(${content.image})` }}
    >
      <div className="c-box--surrounded">
        <h1 className="fs-1">{content.title}</h1>
        <p className="fs-3">{content.body}</p>
      </div>
    </section>
  );
};

export default BasicHero;
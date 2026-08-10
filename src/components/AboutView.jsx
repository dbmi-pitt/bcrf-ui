import { Render } from "@puckeditor/core";

 
// Create Puck component config
const config = {
  components: {
    HeadingBlock: {
      fields: {
        children: {
          type: "text",
        },
      },
      render: ({ children }) => {
        return <h1>{children}</h1>;
      },
    },
  },
};

const AboutView = ({ data }) => {
  const dataO=JSON.parse(data)
  return (
    <Render config={config} data={dataO?dataO:{}} />
  );
};

export default AboutView;
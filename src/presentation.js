// Import React
import React from "react";

// Import Spectacle Core tags
import { Deck, Heading, Slide, Text } from "spectacle";

// Import theme
import createTheme from "spectacle/lib/themes/default";

// Import custom styles
import "./index.css";

// Require CSS
require("normalize.css");

const theme = createTheme(
  {
    primary: "white",
    secondary: "#1F2022",
    tertiary: "#03A9FC",
    quartenary: "#CECECE"
  },
  {
    primary: "Montserrat",
    secondary: "Helvetica"
  }
);

export default class Presentation extends React.Component {
  render() {
    return (
      <Deck transition={["slide"]} transitionDuration={500} theme={theme}>
        <Slide bgColor="secondary">
          <Heading size={6} caps textColor="primary">
            Compile-time abstraction of JavaScript mocking libraries powering a
            domain-specific language for interaction testing
          </Heading>
          <Text margin="2rem 0 0" textSize="2.5rem" textColor="primary">
            Tim Seckinger
          </Text>
          <Text margin="0.5rem 0 0" textSize="2rem" textColor="primary">
            <img src="github-logo.png" alt="Github Logo" className="inline" />{" "}
            jeysal
          </Text>
        </Slide>
        <Slide bgColor="secondary">
          <Text textColor="primary">TODO</Text>
        </Slide>
      </Deck>
    );
  }
}

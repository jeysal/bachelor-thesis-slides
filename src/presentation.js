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

/*

Structure:

* what is mocking (by most definitions)
** first introduce assertions (pretty much the most important test helpers)
** mocking extends stubbing
** show stubbing example
** extends stubbing by special assertions
** show extension mocking example
* typical usage of mocking libraries
** explain components such as expects, withArgs
** why can we not use the ordinary method call syntax of our language?

* Spock Framework introduces a different look and feel for all those aspects of testing
** show assertion blocks -> pretty cool but not a huge win
** show stubbing
** show mocking
** show combination

* what exactly did we implement for this paper?
** spockjs already existed with assertion blocks (show example without further explanation)
** we will add "interaction blocks"
** show and explain examples

* how did we do this?
** let's first take a look at how the simpler assertion block transform works
** do this without showing code, just explaining the algorithms
** show comparison between input and output code
** explain transform using AST

* now for interaction blocks
** explain input code structure (Fig. 13)
** explain input AST structure (Fig. 14)
** we parse this into a tagged union type (show using a simple function ADT syntax)
** explain parsing
** do not forget: there is also verification!

* but now what is the output code?
** this is where the "abstraction of JS mocking libraries" from the title comes in
** user should be able to use this with their favorite mocking library. why?
** multiple reasons outlined in the paper, but mostly because
*** should be usable along with direct usage of the library and its distinct features
*** improved adoptability
**** no need for anyone to switch mocking library in order to use spockjs
**** no custom mocking library like in original Spock means we can provide spockjs escape hatch
***** explain escape hatch quickly

* how to be library-agnostic?
** direct compilation
*** example output code
** runtime dispatch
*** example output code
*** and then we dispatch to the actual library in our adapter implementation

* do not want to (or have time to) get into implementation details
** we implemented both of those strategies
** and provided support for the mocking libraries of Sinon.JS and Jest

* direct compilation does have some advantages:
** conceptually more straightforward, as in no extra layer of abstraction
** can support the escape hatch
*** albeit crappy, because the code generated can be really ugly as we will see
** with full access to the AST we can generate useful error messages w/ original code snippet etc

* however, it also has some major issues compared to runtime dispatch:
** some libraries do not provide adequate functions for spockjs mocking directly
*** so we have to implement a sort of runtime that remembers invocations
    and compares them to interaction declarations
*** this runtime is generated in huge code string template (show) without type checking or anything
*** this requires so much effort that it severely impedes our ability to easily support many libraries
*** runtime dispatch has this code as ordinary modules executed at runtime, avoiding problems

* fundamentally, this is a problem of information loss
** during the transition from compile time to runtime, a lot of information from the AST is lost
*** at compile time,
**** we have access to everything and can implement any conceivable functionality
**** but using it is annoying because it's all just AST transformation and code generation
*** at runtime,
**** we have access only to exactly to the information we serialized in our compile step
**** but we can use it very easily
** through serialization at compile time, we have control over how much information is lost
** but every extra piece of information comes with extra implementation effort
** overall advice:
*** if a use case needs a lot of detail about the original code,
**** avoid having to serialize all of that by doing the work immediately at compile time
*** if a use case has just a few pieces of information to be extracted from the original code
    like the interaction declaration data from spockjs
**** serialize that data at compile time and save the complex logic of processing that data for runtime
*** or in some cases, one might consider a hybrid approach mentioned in the paper
**** where runtime dispatch is just a special case of direct compilation

*/

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

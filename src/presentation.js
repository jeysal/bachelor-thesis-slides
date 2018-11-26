import React from "react";
import createTheme from "spectacle/lib/themes/default";
import { Appear, CodePane, Deck, Heading, Notes, Slide, Text } from "spectacle";
import "./index.css";
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
const H1 = props => (
  <Heading size={5} caps margin="0 0 2rem" textColor="primary" {...props} />
);
const H2 = props => (
  <Heading size={6} margin="0 0 5rem" textColor="primary" {...props} />
);

/*

Structure:

* what is mocking (by most definitions)
** first introduce assertions (pretty much the most important test helpers)
** show stubbing example
** mocking extends stubbing by special assertions
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
          <Notes>
            <p>Introduce speaker & topic</p>
            <p>
              That's a lot of words in the title - we'll do this step by step.
            </p>
            <p>What is mocking?</p>
          </Notes>
        </Slide>
        <Slide>
          <H1 textColor="secondary">Test helpers</H1>
          <Notes>
            <p>
              To understand mocking, let's first look at some other, more basic
              helpers used in automated software testing.
            </p>
          </Notes>
        </Slide>
        <Slide bgColor="secondary">
          <H1>Test helpers</H1>
          <H2>Assertions</H2>
          <CodePane
            textSize="3rem"
            lang="js"
            source={`expect(1).to.equal(1);
assert(1 === 1);`}
          />
          <Appear>
            <div>
              <CodePane
                textSize="1.5rem"
                lang="js"
                source="expect([1, 2]).to.be.an('array').that.does.not.include(3);"
              />
            </div>
          </Appear>
          <Notes>
            <p>
              Assertions encode what is called the test oracle in literature.
            </p>
            <p>Explain</p>
          </Notes>
        </Slide>
        <Slide bgColor="secondary">
          <H1>Test helpers</H1>
          <H2>Stubs</H2>
          <CodePane
            textSize="1.5rem"
            lang="js"
            source={`const subtract = add => (a, b) => add(a, -b);

const addStub = (a, b) => (a === 3 && b === -2 ? 1 : 0);

assert(subtract(addStub)(3, 2) === 1);`}
          />
          <Notes>
            <p>Stubs replace components that the test subject depends on.</p>
            <p>
              A stub returns a predefined value when the test subject calls it.
            </p>
            <p>Contrived example: subtract is SUT, add is dependency</p>
            <p>Explain SUT implementation</p>
            <p>
              To test `subtract`, we pass it our `addStub` as its `add`
              dependency and call it with 3, 2.
            </p>
            <p>
              `addStub` will be called with 3, -2 and knows to return 1 for
              those exact parameters, despite not being a full implementation of
              `add`.
            </p>
          </Notes>
        </Slide>
        <Slide bgColor="secondary">
          <H1>Test helpers</H1>
          <H2>Mocks</H2>
          <CodePane
            textSize="1.5rem"
            lang="js"
            source={`const subtract = add => (a, b) => add(a, -b);

const addCalls = [];
const addMock = (a, b) => (
  addCalls.push({ a, b }), a === 3 && b === -2 ? 1 : 0
);

assert(subtract(addMock)(3, 2) === 1);
assert.deepStrictEqual(addCalls, [{ a: 3, b: -2 }]);`}
          />
          <Notes>
            <p>Mocking extends stubbing by special assertions.</p>
            <p>We assert that the mock function is called in a certain way.</p>
            <p>Explain example</p>
            <p>Show boilerplate</p>
          </Notes>
        </Slide>
        <Slide bgColor="secondary">
          <H1>Test helpers</H1>
          <H2>Mocking libraries</H2>
          <CodePane
            textSize="1.5rem"
            lang="js"
            source={`const myMock = mock(myApi).expects("method")
                          .withArgs(42, 1337);

myApi.method(42, 1337);

myMock.verify();`}
          />
          <Notes>
            <p>Explain (particularly expects & withArgs)</p>
            <p>
              Declaration is unintuitive - why can we not use the ordinary
              method call syntax of our language?
            </p>
          </Notes>
        </Slide>
        <Slide>
          <H1 textColor="secondary">The Spock Framework</H1>
          <Notes>
            <p>
              Look towards other tools out there - Spock Framework for the
              Apache Groovy Language
            </p>
            <p>
              Introduces a completely different look and feel for all the
              aspects of testing mentioned.
            </p>
          </Notes>
        </Slide>
        <Slide bgColor="secondary">
          <H1>The Spock Framework</H1>
          <H2>Assertions</H2>
          <CodePane
            textSize="3rem"
            lang="js"
            source={`expect:
1 + 2 == 3`}
          />
          <Notes>
            <p>
              Explain `expect` block - evaluates the expression to check whether
              it is truthy.
            </p>
            <p>
              Obviously this is not something a runtime library can do, this
              requires some sort of custom compilation.
            </p>
            <p>Pretty cool but not a huge win...</p>
          </Notes>
        </Slide>
        <Slide bgColor="secondary">
          <H1>The Spock Framework</H1>
          <H2>Stubs</H2>
          <CodePane
            textSize="2rem"
            lang="js"
            source={`setup:
subscriber.receive("msg") >> true

expect:
publisher.publish("msg") == true`}
          />
          <Notes>
            <p>Explain</p>
          </Notes>
        </Slide>
        <Slide bgColor="secondary">
          <H1>The Spock Framework</H1>
          <H2>Mocks</H2>
          <CodePane
            textSize="2rem"
            lang="js"
            source={`when:
publisher.publish("msg")

then:
1 * subscriber.receive("msg")`}
          />
          <Notes>
            <p>Explain</p>
          </Notes>
        </Slide>
        <Slide bgColor="secondary">
          <H1>The Spock Framework</H1>
          <H2>Combined</H2>
          <CodePane
            textSize="2rem"
            lang="js"
            source={`when:
def res = publisher.publish("msg")

then:
1 * subscriber.receive("msg") >> true
res == true`}
          />
          <Notes>
            <p>Explain</p>
          </Notes>
        </Slide>
        <Slide>
          <H1 textColor="secondary">spockjs</H1>
          <Notes>
            <p>What exactly did we build in the thesis?</p>
            <p>
              spockjs is a tool that already implements some of the capabilities
              of the Spock Framework for the JavaScript ecosystem.
            </p>
          </Notes>
        </Slide>
        <Slide bgColor="secondary">
          <H1>spockjs</H1>
          <H2>Assertion blocks</H2>
          <CodePane
            textSize="2rem"
            lang="js"
            source={`expect: 'a' + 'b' === 'ab';

expect: {
  'a' + 'b' === 'ab';
  1 < 2;
}`}
          />
          <Notes>
            <p>This is what spockjs can do so far</p>
            <p>Look mostly similar to assertions in the Spock Framework.</p>
            <p>
              For the thesis, I added support to so-called 'interaction blocks'
              to spockjs
            </p>
          </Notes>
        </Slide>
        <Slide bgColor="secondary">
          <H1>spockjs</H1>
          <H2>Interaction blocks</H2>
          <CodePane
            textSize="2rem"
            lang="js"
            source={`mock: 1 * receive('msg') >> true;

expect: publish('msg') === true;

verify: receive;`}
          />
          <Notes>
            <p>Explain</p>
            <p>
              To see how we could implement interaction blocks, let's first look
              at how assertion blocks are implemented.
            </p>
          </Notes>
        </Slide>
        <Slide bgColor="secondary">
          <H1>Assertion block implementation</H1>
          <H2>Code</H2>
          <CodePane
            textSize="3rem"
            lang="js"
            source={`expect: true;
// ==>
expect: assert(true);`}
          />
          <Notes>
            <p>The code transformation for assertion blocks is quite simple.</p>
            <p>Not gonna show the code implementing the transform</p>
            <p>Explain</p>
            <p>
              There's a few more aspects to this, such as importing this assert
              function from somewhere, but the relevant bit is just the
              transformation.
            </p>
          </Notes>
        </Slide>
        <Slide>
          <H1 textColor="secondary">Assertion block implementation</H1>
          <H2 textColor="secondary" margin="0 0 2rem">
            AST
          </H2>
          <img
            src="assertion-block-ast.png"
            alt="Assertion block AST"
            style={{ height: "30rem" }}
          />
          <Notes>
            <p>Explain base structure</p>
            <p>Explain CallExpression insertion</p>
          </Notes>
        </Slide>
        <Slide bgColor="secondary">
          <H1>Interaction block parsing</H1>
          <H2>Input code</H2>
          <CodePane
            textSize="2rem"
            lang="js"
            source={`MockInteractionDeclaration:
cardinality * call;

StubInteractionDeclaration:
call >> returnValue;

CombinedInteractionDeclaration:
cardinality * call >> returnValue;`}
          />
          <Notes>
            <p>Now for interaction blocks</p>
            <p>Already showed an example interaction declaration</p>
            <p>
              This is the structure of the three different kinds of interaction
              declarations
            </p>
            <p>Explain</p>
          </Notes>
        </Slide>
        <Slide>
          <H1>Interaction block parsing</H1>
          <H2>Input AST</H2>
          TODO fig 14
          <Notes>TODO</Notes>
        </Slide>
      </Deck>
    );
  }
}

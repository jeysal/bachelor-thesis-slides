import React from "react";
import createTheme from "spectacle/lib/themes/default";
import {
  Appear,
  CodePane,
  Deck,
  Heading,
  List,
  ListItem,
  Notes,
  S,
  Slide,
  Table,
  TableBody,
  TableHeader,
  TableHeaderItem,
  TableItem,
  TableRow,
  Text
} from "spectacle";
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
** generating code like a human would write it sound nice, but in pratice some libraries do not provide adequate functions for spockjs mocking directly
*** so we have to implement a sort of runtime that remembers invocations
    and compares them to interaction declarations
*** this runtime is generated in huge code string template (show) without type checking or anything
*** this requires so much effort that it severely impedes our ability to easily support many libraries
*** runtime dispatch has this code as ordinary modules executed at runtime, avoiding problems

* fundamentally, this is a problem of information loss (perhaps some sort of graph for visualization)
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
  renderIntroOutro(notes) {
    return (
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
        {notes}
      </Slide>
    );
  }

  render() {
    return (
      <Deck transition={["slide"]} transitionDuration={500} theme={theme}>
        {this.renderIntroOutro(
          <Notes>
            <p>Introduce speaker & topic</p>
            <p>
              That's a lot of words in the title - we'll do this step by step.
            </p>
            <p>What is mocking?</p>
          </Notes>
        )}
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
            <p>click</p>
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
            <p>What exactly did I build in the thesis?</p>
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
            <p>Explain</p>
            <p>
              For the thesis, I added support for so-called 'interaction blocks'
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
            Input and <span style={{ color: "teal" }}>output</span> AST
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
          <div style={{ color: "teal" }}>MockInteractionDeclaration:</div>
          <CodePane textSize="2rem" lang="js" source={`cardinality * call;`} />
          <br />
          <div style={{ color: "magenta" }}>StubInteractionDeclaration:</div>
          <CodePane textSize="2rem" lang="js" source={`call >> returnValue;`} />
          <br />
          <div style={{ color: "violet" }}>CombinedInteractionDeclaration:</div>
          <CodePane
            textSize="2rem"
            lang="js"
            source={`cardinality * call >> returnValue;`}
          />
          <Notes>
            <p>Now for interaction blocks</p>
            <p>
              There's the interaction verification block, but that's rather
              simple
            </p>
            <p>Interaction declaration blocks are the interesting part</p>
            <p>Already showed an example interaction declaration</p>
            <p>
              This is the structure of the three different kinds of interaction
              declarations
            </p>
            <p>Explain</p>
          </Notes>
        </Slide>
        <Slide>
          <H1 textColor="secondary">Interaction block parsing</H1>
          <H2 textColor="secondary" margin="0 0 2rem">
            Input AST
          </H2>
          <img
            src="interaction-block-ast.png"
            alt="Interaction block AST"
            style={{ height: "30rem" }}
          />
          <Notes>
            <p>Explain</p>
            <p>Explain CallExpression</p>
            <p>We're interested in the leafs</p>
            <p>Explain Parsing</p>
          </Notes>
        </Slide>
        <Slide bgColor="secondary">
          <H1>Interaction block parsing</H1>
          <H2 margin="0 0 2rem">Tagged union InteractionDeclaration</H2>
          <CodePane
            textSize="1.2rem"
            lang="rust"
            source={`enum InteractionDeclaration {
  Mock {
    mockObject: Expression,
    args: [Expression],
    cardinality: Expression,
  },
  Stub {
    mockObject: Expression,
    args: [Expression],
    returnValue: Expression,
  },
  Combined {
    mockObject: Expression,
    args: [Expression],
    cardinality: Expression,
    returnValue: Expression,
  },
}`}
          />
          <Notes>
            <p>This is the data structure the parser generates</p>
            <p>
              Explain - interaction declaration is either mock or stub or
              combined...
            </p>
            <p>
              But now what is the output code we generate for interaction
              declarations?
            </p>
          </Notes>
        </Slide>
        <Slide bgColor="secondary" textColor="primary">
          <H1>Mocking library abstraction</H1>
          <H2>Reasons</H2>
          <List>
            <ListItem textSize="2rem">
              simultaneously use the mocking library directly
            </ListItem>
            <ListItem textSize="2rem">
              no need for anyone to switch their mocking library
            </ListItem>
            <ListItem textSize="2rem">
              possible escape route to stop using spockjs
            </ListItem>
          </List>
          <Notes>
            <p>
              This is where the "abstraction of JS mocking libraries" from the
              title comes in.
            </p>
            <p>
              Users should be able to use spockjs with their favorite mocking
              library.
            </p>
            <p>Why?</p>
            <p>
              Distinct features of the mocking library only available with
              direct usage, so that should be available alongside use through
              spockjs.
            </p>
            <p>
              Better adoptability: No time-consuming library switch required to
              introduce spockjs.
            </p>
            <p>Explain escape hatch</p>
          </Notes>
        </Slide>
        <Slide bgColor="secondary" textColor="primary">
          <H1>Mocking library abstraction</H1>
          <H2>Options</H2>
          <List>
            <ListItem>Direct compilation</ListItem>
            <ListItem>Runtime dispatch</ListItem>
          </List>
          <Notes>
            <p>
              There are two options to achieve support for multiple mocking
              libraries.
            </p>
            <p>
              I implemented both of those strategies for the thesis and used
              them to provide support for the Sinon.JS and Jest mocking
              libraries.
            </p>
            <p>
              No time to get into the implementation details, but I'll give a
              brief overview.
            </p>
          </Notes>
        </Slide>
        <Slide bgColor="secondary">
          <H1>Mocking library abstraction</H1>
          <H2>Direct compilation</H2>
          <CodePane
            textSize="2rem"
            lang="js"
            source={`mock: 1 * fn();
verify: fn;
// ==>
expect(fn).withoutArgs().times(1);
verify(fn);`}
          />
          <Notes>
            <p>Input and output code for a fictional mocking library</p>
            <p>Compiler plugin knows the API of the mocking library in use.</p>
            <p>
              Explain: Generates calls to the mocking library the same way a
              human would write them.
            </p>
          </Notes>
        </Slide>
        <Slide bgColor="secondary">
          <H1>Mocking library abstraction</H1>
          <H2 margin="0 0 2rem">Runtime dispatch</H2>
          <CodePane
            textSize="2rem"
            lang="js"
            source={`mock: 1 * fn();
verify: fn;
// ==>
interactionRuntimeAdapter.declare({
  kind: 'mock',
  mockObject: fn,
  args: [],
  cardinality: 1,
});
interactionRuntimeAdapter.verify(mock)`}
          />
          <Notes>
            <p>
              Generated code looks the same regardless of mocking library in
              use.
            </p>
            <p>
              Only the interaction runtime adapter implementation is swapped out
              by importing it from a different module.
            </p>
            <p>
              The adapter receives the serialized interaction declaration as its
              argument and then knows how to convert that into calls to the
              mocking library and makes those calls internally at runtime.
            </p>
          </Notes>
        </Slide>
        <Slide bgColor="secondary">
          <H1>Mocking library abstraction</H1>
          <H2>Direct compilation upsides</H2>
          <Notes>
            <p>
              Direct compilation is conceptually quite straightforward / no
              extra layer of abstraction / just a more complex version of
              assertion blocks
            </p>
            <p>
              Can also support the aforementioned escape hatch, although this
              can get a bit ugly, as we will see.
            </p>
            <p>
              When generating the code we have full access to the AST that we
              can use e.g. to generate useful error messages w/ original code
              snippets.
            </p>
          </Notes>
        </Slide>
        <Slide bgColor="secondary">
          <H1>Mocking library abstraction</H1>
          <H2>Direct compilation problem</H2>
          <Appear>
            <div>
              <CodePane
                textSize="1rem"
                lang="js"
                source={`const verify = template(\`
  // sanity check ...
  (MOCK[\${symbol}] || [])
    .filter(({ cardinality }) => cardinality != null)
    .forEach(({ args: expected, cardinality: expectedTimes }) => {
      const __spockjs_actualTimes = MOCK.mock.calls.filter(actual =>
        \${deepStrictEqual}([...actual], [...expected]),
      ).length;
      if (__spockjs_actualTimes !== expectedTimes) {
        const __spockjs_args = \${prettyFormat}(expected);
        throw new Error(
          \\\`Expected \\\${expectedTimes} call(s) to mock '\\\${MOCK_NAME}' \\\` +
            \\\`with arguments \\\${__spockjs_args}, \\\` +
            \\\`but received \\\${__spockjs_actualTimes} such call(s).\\\`,
        );
      }
    });
\`);`}
              />
            </div>
          </Appear>
          <Notes>
            <p>
              Problem is: Generating code like a human would write it sounds
              nice, but in practice some libraries do not provide adequate
              functions for spockjs mocking.
            </p>
            <p>
              For such libraries, we have to implement a sort of runtime that
              remembers invocations and compares them to the declarations when
              verifying.
              <p>
                Runtime is generated in huge code string template without type
                checking or any tooling support at all (click).
              </p>
              <p>
                A lot of effort - impedes our ability to easily support many
                libraries.
              </p>
              <p>
                Runtime dispatch has this code as ordinary modules in the
                adapter executed at runtime.
              </p>
            </p>
          </Notes>
        </Slide>
        <Slide bgColor="secondary" textColor="primary">
          <H1>Information loss</H1>
          <H2>Tradeoff</H2>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHeaderItem>
                  <S type="bold">Work timing</S>
                </TableHeaderItem>
                <TableHeaderItem>
                  <S type="bold">Power</S>
                </TableHeaderItem>
                <TableHeaderItem>
                  <S type="bold">Ease</S>
                </TableHeaderItem>
              </TableRow>
            </TableHeader>
            <TableBody>
              <TableRow>
                <TableItem>compile time</TableItem>
                <TableItem>
                  <span style={{ color: "green" }}>high</span>
                </TableItem>
                <TableItem>
                  <span style={{ color: "red" }}>low</span>
                </TableItem>
              </TableRow>
              <TableRow>
                <TableItem>runtime</TableItem>
                <TableItem>
                  <span style={{ color: "red" }}>low</span>
                </TableItem>
                <TableItem>
                  <span style={{ color: "green" }}>high</span>
                </TableItem>
              </TableRow>
            </TableBody>
          </Table>
          <Notes>
            <p>
              Fundamentally, this is a problem of information loss. During the
              transition from compile time to runtime, a lot of information from
              the AST is lost.
            </p>
            <p>
              Compile time: access to everything, can implement any conceivable
              functionality - but using the information is annoying because it's
              all AST transformation and code generation.
            </p>
            <p>
              Runtime: We have access to exactly the information we serialized
              in our compile step - but we can use it very easily.
            </p>
            <p>
              Through that serialization, we can control how much information is
              lost, but every extra piece of information preserved comes with
              more implementation effort.
            </p>
          </Notes>
        </Slide>
        <Slide bgColor="secondary" textColor="primary">
          <H1>Information loss</H1>
          <H2>Advice</H2>
          <p>
            Do work at{" "}
            <S type="italic" textColor="tertiary">
              compile time
            </S>{" "}
            if a lot of detail about the original code is required.
          </p>
          <p>
            Do work at{" "}
            <S type="italic" textColor="tertiary">
              runtime
            </S>{" "}
            if only a few select pieces of information need to be extracted.
          </p>
          <Notes>
            <p>As a rule of thumb for applications like spockjs:</p>
            <p>
              If a lot of detail required, avoid having to serialize all of that
              by doing the work immediately at compile time.
            </p>
            <p>
              If just a few select pieces required (like in spockjs), serialize
              that data at compile time and save the complex logic of processing
              that data for runtime.
            </p>
            <p>
              In special cases, one might consider a hybrid approach where
              runtime dispatch is just a special case of direct compilation,
              which is also mentioned in the paper.
            </p>
          </Notes>
        </Slide>
        {this.renderIntroOutro()}
      </Deck>
    );
  }
}

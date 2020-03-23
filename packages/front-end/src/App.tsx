/* eslint-disable @typescript-eslint/explicit-function-return-type */

// The `App` component is in its own file to faciliate testing with Jest and JSDom.
// The test is contained in `src/__tests__/App.tsx`.
import React from "react";
import GraphiQL from "graphiql";
import "graphiql/graphiql.css";
import "./custom.css";

const App = () => (
  <GraphiQL
    style={{ height: "100vh" }}
    fetcher={async (graphQLParams: unknown) => {
      const data = await fetch(
        // `API_URL` is substituted by a real value at build time by webpack:
        API_URL,
        {
          method: "POST",
          headers: {
            Accept: "application/json",
            "Content-Type": "application/json",
          },
          body: JSON.stringify(graphQLParams),
          credentials: "same-origin",
        }
      );
      return data.json().catch(() => data.text());
    }}
  />
);

export default App;

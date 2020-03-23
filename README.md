This repo uses a simple full-stack JavaScript web application to demonstrate the tooling setup for a local development environtment that brings together the following tools and technologies:

- [Docker Compose](https://docs.docker.com/compose/).
- The following features of [Yarn v2](https://yarnpkg.com/):
  - [workspaces](https://yarnpkg.com/features/workspaces).
  - [Plug'n'Play](https://yarnpkg.com/features/pnp).
- The following features of [Visual Studio Code](https://code.visualstudio.com/):
  - The [Remote Container Extension](https://code.visualstudio.com/docs/remote/containers).
  - [IntelliSense](https://code.visualstudio.com/docs/editor/intellisense#_intellisense-features) provided by the TypeScript language server.
  - The [Prettier formatter extension](https://marketplace.visualstudio.com/items?itemName=esbenp.prettier-vscode).
- [TypeScript](https://www.typescriptlang.org/) (and by extension, JavaScript, of which TypScript is a strict superset).
- [Webpack](https://webpack.js.org/).
- [Babel](https://babeljs.io/).
- [ESLint](https://eslint.org/).
- [Prettier](https://prettier.io/).
- [Jest](https://jestjs.io/).

The demo application is an interactive in-browser explorer of the [Star Wars API](https://swapi.co/), which contains the data about all the Star Wars films, characters, spaceships and so on.
If you want to quickly try the application out, here is the [online version created by the GraphQL team](http://graphql.org/swapi-graphql).

## Prerequisites

- [Docker](https://docs.docker.com/install/)
- [Visual Studio Code](https://code.visualstudio.com/Download) and the [Remote Container Extension](https://marketplace.visualstudio.com/items?itemName=ms-vscode-remote.remote-containers).

Because these prerequisites are available on Windows, Mac and Linux, the functionality contained in this repository should be the same across all those platforms.

## Instructions
To get the demo application up and running, follow these steps:
- `cd` into the project directory.
- Run `docker-compose build base`.
- Run `docker-compose up -d`.
- Navigate to `http://localhost:32804` in your browser
(`32804` is the default value of the [`$FRONT_END_HOST_PORT`](.env) environment variable).
- To use the preconfigured Docker-based Visual Studio Code development environment, with the Docker containers already up and running, open the Command Palette (Cmd+Shift+P), choose "Remote Container: Open Folder in Container" and choose the `vs-code-container-back-end` in the project directory for the back-end or `vs-code-container-front-end` for the front-end.

## Available tasks

The following tasks are available in both the `front-end` and `back-end` workspaces.

- `build`: make a production build without serving it.
- `clean`: clear away all build artifacts.
- `format`: automatically format code styling with Prettier.
- `lint`: run ESLint with automatic fixes.
- `serve`: serve the build output.
- `start`: make and serve a development build and recompile on change.
- `typecheck`: perform type checking with the TypeScript compiler without outputting any code.

The front-end has the following additional tasks:

- `test`: run tests with Jest
- `test:watch`: run test with Jest in interactive watch mode on the command line.

To run a task, e.g. `lint`, in a particular workspace, e.g. `front-end`, either run `yarn workspace front-end lint` from anywhere in the project or run `yarn lint` from within the `front-end` workspace (`packages/front-end`).

## Cloud Diagrams As Code

Pygrams is a live diagram editor built with [Python Diagrams](https://github.com/mingrammer/diagrams) and [Monaco-Editor](https://github.com/microsoft/monaco-editor).

<img src="./.github/assets/demo.gif"/>

<hr/>

## Getting started

1. Clone the repo:

    ```
    git clone https://github.com/dmitkov28/pygrams.git
    ```

2. Build the Docker image

    ```
    docker build -t pygrams .
    ```

3. Run the container

    ```
    docker run -d -p 8000:8000 pygrams
    ```

### TODO
- [x] Add a language server to provide intellisense for the web editor
- [x] Dockerize app
- [x] Add more robust css for the layout
- [x] Sandbox code execution on the server
- [ ] Fix diagram size
- [x] Add download functionality
 
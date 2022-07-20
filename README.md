## SmartDeno

[![deno version](https://img.shields.io/badge/deno-^1.10.2-lightgrey?logo=deno)](https://github.com/denoland/deno)
[![Codacy Badge](https://app.codacy.com/project/badge/Grade/7ce723763948494fb69c6efd861fce4c)](https://www.codacy.com/gh/guildenstern70/SmartDeno/dashboard?utm_source=github.com&amp;utm_medium=referral&amp;utm_content=guildenstern70/SmartDeno&amp;utm_campaign=Badge_Grade)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)

SmartDeno is a simple template for an application written in [TypeScript](https://www.typescriptlang.org/) using [Deno](https://deno.land/)

This application is based on the following libraries:

* [Oak Application Server](https://deno.land/x/oak)
* [Eta Template Engine](https://eta.js.org/)
* [Bootstrap Responsive HTML Library](https://getbootstrap.com/)
* [DyeLog Logger](https://deno.land/x/dyelog@v0.1.1)

### Deno Deploy

This application is compatible with [Deno Deploy](https://deno.com/deploy) and can be visited [here](https://smart-deno-project.deno.dev/)

### Run locally

    run --allow-net --allow-read src/main.ts

### Cache dependencies locally

    deno cache src/deps.ts

### Run with Docker

    docker build -t smart-deno .
    docker run -p 8000:8000 smart-deno




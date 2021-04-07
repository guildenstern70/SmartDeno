# SmartDeno

[![deno version](https://img.shields.io/badge/deno-^1.8.2-lightgrey?logo=deno)](https://github.com/denoland/deno)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)

A simple template App Server written in Deno.

It uses:

* [Deno View Engine](https://deno.land/x/view_engine@v1.5.0)
* [Denjucks Templating Language](https://deno.land/x/denjucks@1.1.1)
* [Bootstrap Responsive HTML Library](https://getbootstrap.com/)
* [DyeLog Logger](https://deno.land/x/dyelog@v0.1.1)

### Cache dependencies locally

    deno cache src/deps.ts

### Run with Docker

    docker build -t smart-deno .
    docker run -p 8000:8000 smart-deno




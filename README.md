## SmartDeno

[![deno version](https://img.shields.io/badge/deno-^1.10.2-lightgrey?logo=deno)](https://github.com/denoland/deno)
[![Codacy Badge](https://app.codacy.com/project/badge/Grade/7ce723763948494fb69c6efd861fce4c)](https://www.codacy.com/gh/guildenstern70/SmartDeno/dashboard?utm_source=github.com&amp;utm_medium=referral&amp;utm_content=guildenstern70/SmartDeno&amp;utm_campaign=Badge_Grade)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)

A simple template App Server written in TypeScript for Deno.

It uses:

* [Deno View Engine](https://deno.land/x/view_engine@v1.5.1)
* [Denjucks Templating Language](https://deno.land/x/denjucks@1.1.1)
* [Bootstrap Responsive HTML Library](https://getbootstrap.com/)
* [DyeLog Logger](https://deno.land/x/dyelog@v0.1.1)

### Cache dependencies locally

    deno cache src/deps.ts

### Run with Docker

    docker build -t smart-deno .
    docker run -p 8000:8000 smart-deno




#!/bin/bash
#
#
# Smart Deno
# A web template project for Deno
# Copyright (c) 2020-23 Alessio Saltarin
# MIT License
#
#

export FAUNA_SECRET=your_fauna_secret
deno run -r --allow-net --allow-env --allow-read src/main.ts

## SmartDeno

[![deno version](https://img.shields.io/badge/deno-^1.26.1-lightgrey?logo=deno)](https://github.com/denoland/deno)
[![Codacy Badge](https://app.codacy.com/project/badge/Grade/7ce723763948494fb69c6efd861fce4c)](https://www.codacy.com/gh/guildenstern70/SmartDeno/dashboard?utm_source=github.com&amp;utm_medium=referral&amp;utm_content=guildenstern70/SmartDeno&amp;utm_campaign=Badge_Grade)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)

![SmartDeno screenshot](./static/img/smartdeno.png "SmartDeno screenshot")

**SmartDeno** is a simple Web Template Application written in [TypeScript](https://www.typescriptlang.org/) using [Deno](https://deno.land/).
It is based on the following building blocks:

* [Oak Application Server](https://deno.land/x/oak)
* [Fauna DB](https://fauna.com/)
* [Eta Template Engine](https://eta.js.org/)
* [Bootstrap Responsive HTML Library](https://getbootstrap.com/)
* [DyeLog Logger](https://deno.land/x/dyelog@v0.1.1)

### Deno Deploy

This application is compatible with [Deno Deploy](https://deno.com/deploy) and can be visited [here](https://smart-deno-project.deno.dev/)

### Setup

Before running this application you need to create a [Fauna DB](https://fauna.com/).

Create a new database in EU region.

1. Go to https://dashboard.fauna.com (login if required) and click on New Database
2. Fill the Database Name field and click on Save.
3. Click on GraphQL section visible on the left sidebar.
4. Copy the file /data/users.gql to create initial schema

Generate a secret to access the database:

1. Click on Security section and click on New Key.
2. Select Server role and click on Save. Copy the secret.
3. You need to store the secret in an environment variable called 'FAUNA_SECRET'

If everything went OK, on the first run, a new "guest" user will be created on your Fauna DB.

IMPORTANT:
You must create an environment variable named FAUNA_SECRET with the secret above in order to run the application.

    

### Run locally

    deno run --allow-net --allow-read --allow-env src/main.ts

### Cache dependencies locally

    deno cache src/deps.ts

### Run with Docker

    docker build -t smart-deno .
    docker run -p 8000:8000 smart-deno




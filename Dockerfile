FROM hayd/centos-deno:1.8.2
EXPOSE 8000
WORKDIR /app

# Prefer not to run as root.
USER deno

# Cache the dependencies as a layer (the following two steps are re-run only when deps.ts is modified).
# Ideally fetch deps.ts will download and compile _all_ external files used in main.ts.
COPY src/deps.ts .
RUN deno cache deps.ts

# These steps will be re-run upon each file change in your working directory:
COPY . .
# Compile the main app so that it doesn"t need to be compiled each startup/entry.
RUN deno cache src/main.ts

CMD ["run", "--allow-net", "--allow-read", "src/main.ts"]

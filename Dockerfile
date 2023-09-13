FROM denoland/deno:centos-1.36.4
EXPOSE 8000
WORKDIR /app

# Prefer not to run as root.
USER deno

# These steps will be re-run upon each file change in your working directory:
COPY . .

# Compile the main app so that it doesn"t need to be compiled each startup/entry.
RUN deno cache --import-map=import_map.json ./src/main.ts

CMD ["run", "--allow-net", "--allow-read", "--allow-env", "--unstable", "src/main.ts"]

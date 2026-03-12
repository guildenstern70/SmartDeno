FROM denoland/deno:2.5.0
EXPOSE 8000
WORKDIR /app

# Prefer not to run as root.
USER deno

# These steps will be re-run upon each file change in your working directory:
COPY . .

# Compile the main app so that it doesn't need to be compiled each startup/entry.
RUN deno cache --config=deno.json --lock=deno.lock --frozen ./src/main.ts

CMD ["run", "--config=deno.json", "--lock=deno.lock", "--frozen", "--allow-net", "--allow-read", "--allow-env", "--unstable-kv", "src/main.ts"]

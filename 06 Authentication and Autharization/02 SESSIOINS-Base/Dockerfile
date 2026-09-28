FROM oven/bun:1

COPY package.json bun.lock ./

RUN bun install

COPY . .

EXPOSE 5000

CMD ["bun", "run", "dev"]
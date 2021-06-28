FROM rust:1.50 as builder

RUN mkdir -p /shuffler
WORKDIR /shuffler
COPY Cargo.lock Cargo.toml ./
COPY src/ ./src

RUN cargo install --path .

FROM debian:stretch-slim

COPY --from=builder /usr/local/cargo/bin/shuffler /bin/shuffler

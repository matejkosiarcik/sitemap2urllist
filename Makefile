# Helper Makefile to group scripts for development

MAKEFLAGS += --warn-undefined-variables
SHELL := /bin/sh
.SHELLFLAGS := -ec
PROJECT_DIR := $(dir $(abspath $(MAKEFILE_LIST)))

.POSIX:

.DEFAULT: all
.PHONY: all
all: bootstrap build test

.PHONY: bootstrap
bootstrap:
	npm --prefix node ci
	npm --prefix tests-cli ci
	cargo clippy --help >/dev/null 2>&1 || rustup component add clippy
	cargo fmt --help >/dev/null 2>&1 || rustup component add rustfmt
	command -v wasm-pack >/dev/null 2>&1 || curl https://rustwasm.github.io/wasm-pack/installer/init.sh -sSf | sh

.PHONY: lint
lint:
	cargo clippy

.PHONY: fmt
fmt:
	cargo fmt

.PHONY: build
build:
	cargo build
	cargo build --release
	wasm-pack build --release --target nodejs --out-dir node/wasm
	npm --prefix node run build

.PHONY: test
test:
	npm --prefix tests-cli run test-rust
	npm --prefix tests-cli run test-rust-release
	npm --prefix tests-cli run test-node

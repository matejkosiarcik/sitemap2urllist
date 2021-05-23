# Helper Makefile to group scripts for development

MAKEFLAGS += --warn-undefined-variables
SHELL := /bin/sh
.SHELLFLAGS := -ec
PROJECT_DIR := $(dir $(abspath $(MAKEFILE_LIST)))

.POSIX:

.DEFAULT: all
.PHONY: all
all: bootstrap build

.PHONY: bootstrap
bootstrap:
	npm --prefix node ci
	npm --prefix tests-cli ci

.PHONY: lint
lint:
	npm --prefix node run lint
	cargo check

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

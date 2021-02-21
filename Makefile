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
	npm ci
	npm --prefix tests-cli ci

.PHONY: lint
lint:
	npm run lint

.PHONY: build
build:
	npm run build

.PHONY: test
test:
	npm test
	npm --prefix tests-cli test

# Helper Makefile to group scripts for development

MAKEFLAGS += --warn-undefined-variables
SHELL := /bin/sh
.SHELLFLAGS := -ec
PROJECT_DIR := $(dir $(abspath $(MAKEFILE_LIST)))

.POSIX:

.DEFAULT: all
.PHONY: all
all: bootstrap lint build

.PHONY: bootstrap
bootstrap:
	npm install --unsafe-perm

.PHONY: lint
lint:
	true

.PHONY: build
build:
	npm run --prefix lib build
	npm run --prefix cli build

.PHONY: test
test:
	npm run --prefix lib test
	npm run --prefix cli test

.PHONY: increment_version
increment_version:
	npm --no-git-tag-version version --prefix lib patch
	npm --no-git-tag-version version --prefix cli patch

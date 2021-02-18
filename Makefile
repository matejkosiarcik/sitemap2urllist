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
	npm --prefix src ci
	npm --prefix src run bootstrap
	npm --prefix tests-cli ci

.PHONY: lint
lint:
	true

.PHONY: build
build:
	npm --prefix src/lib run build
	npm --prefix src/cli run build

.PHONY: test
test:
	npm --prefix src/lib test
	npm --prefix tests-cli test

.PHONY: increment_version
increment_version:
	npm --no-git-tag-version --prefix src/lib version patch
	npm --no-git-tag-version --prefix src/cli version patch

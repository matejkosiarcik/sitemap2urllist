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
	if npm install; then true; else npm install --unsafe-perm; fi

.PHONY: lint
lint:
	true

.PHONY: build
build:
	npm run --prefix lib build
	npm run --prefix cli build
	# npm run --prefix web build

.PHONY: test
test:
	npm run --prefix lib test
	npm run --prefix cli test
	# npm run --prefix web test

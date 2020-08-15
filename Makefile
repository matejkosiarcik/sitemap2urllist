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
	npm install

.PHONY: lint
lint:
	true

.PHONY: build
build:
	npm run --prefix lib build
	npm run --prefix cli build
	npm run --prefix web build

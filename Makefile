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
	npm --prefix tests-cli run test-node

.PHONY: docker-build
docker-build:
	docker build . --tag matejkosiarcik/sitemap2urllist:dev

.PHONY: docker-test
docker-test:
	docker run matejkosiarcik/sitemap2urllist:dev --help >/dev/null
	npm --prefix tests-cli run test-smoke-docker

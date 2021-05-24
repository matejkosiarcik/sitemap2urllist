#!/usr/bin/env bats
# shellcheck disable=SC2086

function setup() {
    cd "$BATS_TEST_DIRNAME/../.." || exit 1 # project root
    if [ -z "${COMMAND+x}" ]; then exit 1; fi
    tmpdir="$(mktemp -d)"
    export tmpdir
}

function teardown() {
    rm -rf "$tmpdir"
}

function test_run() {
    # given
    reference_input="sitemaps/unsupported/$1.txt"

    # when
    run $COMMAND -f "$reference_input" -o "$tmpdir/out.txt"

    # then
    [ ! -e "$tmpdir/out.txt" ]
    [ "$status" -ne 0 ]
    [ "$output" != '' ]
}

@test 'Test file not-xml.xml' {
    test_run 'not-xml.xml'
}

@test 'Test file not-sitemap.xml' {
    test_run 'not-sitemap.xml'
}

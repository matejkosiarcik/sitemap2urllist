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

@test 'Test invalid xml' {
    # given
    reference_input="sitemaps/unsupported/not-xml.txt"

    # when
    run $COMMAND -f "$reference_input" -o "$tmpdir/out.txt"

    # then
    [ ! -e "$tmpdir/out.txt" ]
    [ "$status" -ne 0 ]
    [ "$output" != '' ]
    printf '%s' "$output" | grep 'Error: Malformed XML'
}

@test 'Test invalid sitemap' {
    # given
    reference_input="sitemaps/unsupported/not-sitemap.txt"

    # when
    run $COMMAND -f "$reference_input" -o "$tmpdir/out.txt"

    # then
    [ ! -e "$tmpdir/out.txt" ]
    [ "$status" -ne 0 ]
    [ "$output" != '' ]
    printf '%s' "$output" | grep 'Error: Unknown xml root: <foo>; expected <urlset> or <sitemapindex>'
}

@test 'Test not existent file' {
    # NOTE: currently this fails in nodejs, because it throws when reading not existent file and rust code probably does not handle it well
    # TODO: enable
    # FIXME: enable
    skip

    # given
    reference_input="$tmpdir/not-existent.xml"

    # when
    run $COMMAND -f "$reference_input" -o "$tmpdir/out.txt"

    # then
    [ ! -e "$tmpdir/out.txt" ]
    [ "$status" -ne 0 ]
    [ "$output" != '' ]
    printf '%s' "$output" | grep 'Error:'
    printf '%s' "$output" | grep -i 'No such file or directory'
}

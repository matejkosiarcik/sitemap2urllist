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

# test helper to run a test against given file and check output
function test_run() {
    # given
    reference_input="${1}"

    # when
    run "$COMMAND" -f "$reference_input" -o "$tmpdir/out.txt"

    # then
    [ "$status" -eq 0 ]
    [ "$output" = '' ]
    [ "$(wc -l <"$tmpdir/out.txt")" -ge 2 ]
}

@test 'Test remote' {
    test_run 'https://www.sitemaps.org/sitemap.xml'
}

@test 'Test sitemapindex with remote URL' {
    # given
    reference_input="sitemaps/sitemapindex-in.xml"

    # when
    run "$COMMAND" -f "$reference_input" -o "$tmpdir/out.txt"

    # then
    [ "$status" -eq 0 ]
    [ "$output" = '' ]
    [ "$(head -n 1 <"$tmpdir/out.txt")" = 'https://www.sitemaps.org/' ]
    [ "$(grep 'https://www.sitemaps.org' <"$tmpdir/out.txt" | wc -l)" -eq "$(wc -l <"$tmpdir/out.txt")" ]
    [ "$(wc -l <"$tmpdir/out.txt")" -gt 1 ]
}

@test 'Test sitemapindex with file: URL' {
    # given
    reference_output="sitemaps/single-out.txt"
    reference_input="$tmpdir/in.xml"
    printf '%s\n%s\n%s\n%s\n%s\n%s\n' \
        '<?xml version="1.0" encoding="UTF-8"?>' \
        '<sitemapindex>' \
        '<sitemap>' \
        "<loc>file://$PWD/sitemaps/single-in.xml</loc>" \
        '</sitemap>' \
        '</sitemapindex>' >"$reference_input"

    # when
    run "$COMMAND" -f "$reference_input" -o "$tmpdir/out.txt"

    # then
    [ "$status" -eq 0 ]
    [ "$output" = '' ]
    cmp -s "$reference_output" "$tmpdir/out.txt"
}

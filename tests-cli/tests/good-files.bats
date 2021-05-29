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
    reference_input="sitemaps/$1-in.xml"
    reference_output="sitemaps/$1-out.txt"

    # when
    run $COMMAND -f "$reference_input" -o "$tmpdir/out.txt"

    # then
    [ "$status" -eq 0 ]
    [ "$output" = '' ]
    cmp -s "$reference_output" "$tmpdir/out.txt"
}

@test 'File zero.xml' {
    test_run zero
}

@test 'File single.xml' {
    test_run single
}

@test 'File xmlns.xml' {
    test_run xmlns
}

@test 'File multiple.xml' {
    test_run multiple
}

@test 'File order-alphanum.xml' {
    test_run order-alphanum
}

@test 'File order-priority.xml' {
    test_run order-priority
}

@test 'File without-preamble.xml' {
    test_run without-preamble
}

@test 'Standard input' {
    # given
    reference_input='sitemaps/single-in.xml'
    reference_output='sitemaps/single-out.txt'

    # when
    $COMMAND -o "$tmpdir/out.txt" <"$reference_input"

    # then
    cmp -s "$reference_output" "$tmpdir/out.txt"
}

@test 'Standard output' {
    # given
    reference_input='sitemaps/single-in.xml'
    reference_output='sitemaps/single-out.txt'

    # when
    $COMMAND -f "$reference_input" >"$tmpdir/out.txt"

    # then
    cmp -s "$reference_output" "$tmpdir/out.txt"
}

@test 'Standard input/output' {
    # given
    reference_input='sitemaps/single-in.xml'
    reference_output='sitemaps/single-out.txt'

    # when
    $COMMAND <"$reference_input" >"$tmpdir/out.txt"

    # then
    cmp -s "$reference_output" "$tmpdir/out.txt"
}

@test 'File alternate.xml without --alternate' {
    # given
    reference_input="sitemaps/alternate-in.xml"
    reference_output="sitemaps/alternate-out-without.txt"

    # when
    run $COMMAND -f "$reference_input" -o "$tmpdir/out.txt"

    # then
    [ "$status" -eq 0 ]
    [ "$output" = '' ]
    cmp -s "$reference_output" "$tmpdir/out.txt"
}

@test 'File alternate.xml with --alternate' {
    # given
    reference_input="sitemaps/alternate-in.xml"
    reference_output="sitemaps/alternate-out-with.txt"

    # when
    run $COMMAND -f "$reference_input" -o "$tmpdir/out.txt" --alternate

    # then
    [ "$status" -eq 0 ]
    [ "$output" = '' ]
    cmp -s "$reference_output" "$tmpdir/out.txt"
}

@test 'File single.xml with file: URL' {
    # given
    reference_input="file://$PWD/sitemaps/alternate-in.xml"
    reference_output="sitemaps/alternate-out-without.txt"

    # when
    run $COMMAND -f "$reference_input" -o "$tmpdir/out.txt"

    # then
    [ "$status" -eq 0 ]
    [ "$output" = '' ]
    cmp -s "$reference_output" "$tmpdir/out.txt"
}

#!/usr/bin/env bats
# shellcheck disable=SC2086

function setup() {
    cd "${BATS_TEST_DIRNAME}/../.." || exit 1 # project root
    if [ -z "${COMMAND+x}" ]; then exit 1; fi
    tmpdir="$(mktemp -d)"
    export tmpdir
}

function teardown() {
    rm -rf "${tmpdir}"
}

# test helper to run a test against given file and check output
function test_run() {
    # given
    reference_input="${1}"

    # when
    run ${COMMAND} -f "${reference_input}" -o "${tmpdir}/out.txt"

    # then
    [ "${status}" -eq 0 ]
    [ "${output}" = '' ]
    [ "$(wc -l <"${tmpdir}/out.txt")" -ge 2 ]
}

@test 'Test remote' {
    test_run 'https://www.sitemaps.org/sitemap.xml'
}

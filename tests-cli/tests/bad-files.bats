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

function test_run() {
    # when
    run ${COMMAND} -f "${tmpdir}/in.xml" -o "${tmpdir}/out.txt"

    # then
    [ ! -e "${tmpdir}/out.txt" ]
    [ "${status}" -ne 0 ]
    [ "${output}" != '' ]
}

@test 'Test empty' {
    printf '' >"${tmpdir}/in.xml"
    test_run
}

@test 'Test empty with preamble' {
    printf '' >"${tmpdir}/in.xml"
    test_run
}

@test 'Test invalid' {
    printf '<foo>bar</foo>' >"${tmpdir}/in.xml"
    test_run
}

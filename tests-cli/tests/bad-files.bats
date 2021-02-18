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

function test() {
    # when
    run ${COMMAND} -f "sitemaps/bad/${1}.xml" -o "${tmpdir}/out.txt"

    # then
    [ ! -e "${tmpdir}/out.txt" ]
    [ "${status}" -ne 0 ]
    [ "${output}" != '' ]
}

@test 'Test void' {
    test void
}

@test 'Test void-almost' {
    test void-almost
}

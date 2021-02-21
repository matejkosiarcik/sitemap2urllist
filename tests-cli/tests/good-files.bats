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

# test helper to run a test agains given file and check output
function test() {
    # given
    reference_input="sitemaps/good/${1}-in.xml"
    reference_output="sitemaps/good/${1}-out.txt"

    # when
    run ${COMMAND} -f "${reference_input}" -o "${tmpdir}/out.txt"

    # then
    [ "${status}" -eq 0 ]
    [ "${output}" = '' ]
    git diff --no-index "${reference_output}" "${tmpdir}/out.txt"
}

@test 'Test zero' {
    test zero
}

@test 'Test single' {
    test single
}

@test 'Test multiple' {
    test multiple
}

@test 'Test alternate' {
    test alternate
}

@test 'Test order-alphanum' {
    test order-alphanum
}

@test 'Test order-priority' {
    test order-priority
}

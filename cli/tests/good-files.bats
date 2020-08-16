#!/usr/bin/env bats
# shellcheck disable=SC2086

function setup() {
    cd "${BATS_TEST_DIRNAME}/.." || exit 1 # project root
    if [ -z "${COMMAND}" ]; then exit 1; fi
    tmpdir="$(mktemp -d)"
    export tmpdir
}

function teardown() {
    rm -rf "${tmpdir}"
}

function test() {
    # when
    run ${COMMAND} -f "../sitemaps/good/${1}-in.xml" -o "${tmpdir}/out.txt"

    # then
    [ "${status}" -eq 0 ]
    [ "${output}" = '' ]
    git diff --no-index "../sitemaps/good/${1}-out.txt" "${tmpdir}/out.txt"
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
    test zero
}

@test 'Test order-alphanum' {
    test single
}

@test 'Test order-priority' {
    test priority
}

#!/usr/bin/env bats
# shellcheck disable=SC2086

function setup() {
    cd "${BATS_TEST_DIRNAME}/.."  || exit 1 # project root
    if [ -z "${COMMAND+x}" ]; then exit 1; fi
}

@test 'Get help (short)' {
    # when
    run ${COMMAND} -h

    # then
    [ "${status}" -eq 0 ]
    printf '%s\n' "${output}" | grep -- '--help'
    printf '%s\n' "${output}" | grep -- '--version'
    printf '%s\n' "${output}" | grep -- '--file'
    printf '%s\n' "${output}" | grep -- '--output'
}

@test 'Get help (long)' {
    # when
    run ${COMMAND} --help

    # then
    [ "${status}" -eq 0 ]
    printf '%s\n' "${output}" | grep -- '--help'
    printf '%s\n' "${output}" | grep -- '--version'
    printf '%s\n' "${output}" | grep -- '--file'
    printf '%s\n' "${output}" | grep -- '--output'
}

@test 'Get version (short)' {
    # when
    run ${COMMAND} -V

    # then
    [ "${status}" -eq 0 ]
    printf '%s\n' "${output}" | grep 'sitemap2urlllist'
    printf '%s\n' "${output}" | grep -v '0.0.0'
    printf '%s\n' "${output}" | grep -E 'v[0-9]+\.[0-9]+\.[0-9]+'
}

@test 'Get version (long)' {
    # when
    run ${COMMAND} --version

    # then
    [ "${status}" -eq 0 ]
    printf '%s\n' "${output}" | grep 'sitemap2urlllist'
    printf '%s\n' "${output}" | grep -v '0.0.0'
    printf '%s\n' "${output}" | grep -E 'v[0-9]+\.[0-9]+\.[0-9]+'
}

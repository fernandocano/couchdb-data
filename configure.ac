dnl Process this file with autoconf
AC_INIT([couchdb-data], [1.0.0])
AC_PREREQ(2.69)
AM_INIT_AUTOMAKE([foreign nostdinc])
dnl program checks
AC_CHECK_PROG([jq],[jq], [yes], [no])
AM_CONDITIONAL([FOUND_JQ], [test "x$jq" = "xyes"])
AM_COND_IF([FOUND_JQ],,[AC_MSG_ERROR([Required: jq to process json files])])

AC_PROG_SED

AC_ARG_ENABLE([debug], [ --enable-debug>Development level debug],
[case "${enableval}" in
	yes) debug=true ;;
	no) debug=false ;;
	*) AC_MSG_ERROR([bad value ${enableval} for --enable-debug]) ;;
esac],[debug=false])

AM_CONDITIONAL([DEBUG], [test x$debug = xtrue])

AC_OUTPUT([Makefile])

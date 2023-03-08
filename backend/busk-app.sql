\echo 'Delete and recreate busk_app db?'
\prompt 'Return for yes or control-C to cancel > ' foo

/* 
** BUSK_APP
*/
DROP DATABASE busk_app;
CREATE DATABASE busk_app;
\connect busk_app;

\i busk-app-schema.sql
\i busk-app-seed.sql

/* 
** BUSK_APP_TEST
*/
\echo 'Delete and recreate busk_app_test db?'
\prompt 'Return for yes or control-C to cancel > ' foo

DROP DATABASE busk_app_test;
CREATE DATABASE busk_app_test;
\connect busk_app_test;

\i busk-app-schema.sql
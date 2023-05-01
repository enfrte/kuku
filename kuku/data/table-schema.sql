/* 
	GREAT GUIDE FOR SETUP
	https://www.unixsheikh.com/articles/sqlite-the-only-database-you-will-ever-need-in-most-cases.html

	Install script:
	This is run when there is no existing data in the database.
	During install, the old .sqlite file is over written.

	TODO: See the update script to non-destructively modify the tables. 
*/

/* PRAGMA auto_vacuum = FULL; --Prevents the reuse of primary key values after deleting a row */

/* Temporarily disable the following for resetting database - See bottom of the file for re-enabling*/
PRAGMA STRICT = OFF;
PRAGMA foreign_keys = OFF;
PRAGMA ignore_check_constraints = TRUE;

DROP TABLE IF EXISTS courses;
DROP TABLE IF EXISTS lessons;
DROP TABLE IF EXISTS questions;
DROP TABLE IF EXISTS alternative_native_phrase;
DROP TABLE IF EXISTS alternative_foreign_phrase;

/* 
PRAGMA STRICT = ON;
PRAGMA foreign_keys = ON;
PRAGMA ignore_check_constraints = FALSE;
*/

CREATE TABLE courses (
	id INTEGER PRIMARY KEY AUTOINCREMENT,
	title TEXT NOT NULL CHECK(LENGTH(title) <= 255),
	description TEXT CHECK(LENGTH(description) <= 999),
	language TEXT NOT NULL CHECK(LENGTH(language) <= 3),
	instruction_language TEXT NOT NULL CHECK(LENGTH(instruction_language) <= 3),
	slug TEXT NOT NULL CHECK(LENGTH(slug) <= 255),
	version INTEGER NOT NULL,
	in_production INTEGER DEFAULT 0 NOT NULL CHECK(in_production <= 1),
	deleted INTEGER DEFAULT 0 NOT NULL CHECK(deleted <= 1)
);

CREATE TABLE lessons (
	id INTEGER PRIMARY KEY AUTOINCREMENT,
	title TEXT NOT NULL CHECK(LENGTH(title) <= 255),
	description TEXT CHECK(LENGTH(description) <= 300),
	slug TEXT NOT NULL CHECK(LENGTH(slug) <= 255),
	tutorial TEXT CHECK(LENGTH(tutorial) <= 99999),
	course_id INTEGER NOT NULL,
	level INTEGER DEFAULT 0 NOT NULL,
	in_production INTEGER DEFAULT 0 NOT NULL CHECK(in_production <= 1),
	deleted INTEGER DEFAULT 0 NOT NULL CHECK(deleted <= 1),
	FOREIGN KEY (course_id) REFERENCES courses(id) 
);

CREATE TABLE questions (
	id INTEGER PRIMARY KEY AUTOINCREMENT,
	lesson_id INTEGER NOT NULL,
	native_phrase TEXT NOT NULL CHECK(LENGTH(native_phrase) <= 600),
	foreign_phrase TEXT NOT NULL CHECK(LENGTH(foreign_phrase) <= 600),
	FOREIGN KEY (lesson_id) REFERENCES lessons(id) 
);

CREATE TABLE alternative_native_phrase (
	id INTEGER PRIMARY KEY AUTOINCREMENT,
	phrase TEXT NOT NULL CHECK(LENGTH(phrase) <= 600),
	question_id INTEGER NOT NULL,
	FOREIGN KEY (question_id) REFERENCES questions(id) ON DELETE CASCADE
);

CREATE TABLE alternative_foreign_phrase (
	id INTEGER PRIMARY KEY AUTOINCREMENT,
	phrase TEXT NOT NULL CHECK(LENGTH(phrase) <= 600),
	question_id INTEGER NOT NULL,
	FOREIGN KEY (question_id) REFERENCES questions(id) ON DELETE CASCADE
);


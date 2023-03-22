/* 
	GREAT GUIDE FOR SETUP
	https://www.unixsheikh.com/articles/sqlite-the-only-database-you-will-ever-need-in-most-cases.html

	Install script:
	This is run when there is no existing data in the database.
	During install, the old .sqlite file is over written.

	TODO: See the update script to non-destructively modify the tables. 
*/

PRAGMA STRICT = ON;
PRAGMA foreign_keys = ON;
PRAGMA ignore_check_constraints = FALSE;


DROP TABLE IF EXISTS courses;
CREATE TABLE courses (
	id INTEGER PRIMARY KEY,
	title TEXT NOT NULL CHECK(LENGTH(title) <= 255),
	description TEXT CHECK(LENGTH(description) <= 999),
	language TEXT NOT NULL CHECK(LENGTH(language) <= 3),
	instruction_language TEXT NOT NULL CHECK(LENGTH(instruction_language) <= 3),
	slug TEXT NOT NULL CHECK(LENGTH(slug) <= 255),
	version INTEGER NOT NULL,
	in_production INTEGER DEFAULT 0 NOT NULL CHECK(in_production <= 1),
	deleted INTEGER DEFAULT 0 NOT NULL CHECK(deleted <= 1)
) ;

DROP TABLE IF EXISTS lessons;
CREATE TABLE lessons (
	id INTEGER PRIMARY KEY,
	title TEXT NOT NULL CHECK(LENGTH(title) <= 255),
	slug TEXT NOT NULL CHECK(LENGTH(slug) <= 255),
	tutorial TEXT CHECK(LENGTH(tutorial) <= 99999),
	course_id INTEGER NOT NULL,
	level INTEGER DEFAULT 0 NOT NULL,
	in_production INTEGER DEFAULT 0 NOT NULL CHECK(in_production <= 1),
	deleted INTEGER DEFAULT 0 NOT NULL CHECK(deleted <= 1),
	FOREIGN KEY (course_id) REFERENCES courses(id) 
);

DROP TABLE IF EXISTS questions;
CREATE TABLE questions (
	id INTEGER PRIMARY KEY,
	lesson_id INTEGER NOT NULL,
	native_phrase TEXT NOT NULL CHECK(LENGTH(native_phrase) <= 600),
	foreign_phrase TEXT NOT NULL CHECK(LENGTH(foreign_phrase) <= 600),
	FOREIGN KEY (lesson_id) REFERENCES lessons(id) 
);

DROP TABLE IF EXISTS alternative_native_phrase;
CREATE TABLE alternative_native_phrase (
	id INTEGER PRIMARY KEY,
	question_id INTEGER NOT NULL,
	phrase TEXT NOT NULL CHECK(LENGTH(phrase) <= 600),
	FOREIGN KEY (question_id) REFERENCES questions(id) ON DELETE CASCADE
);

DROP TABLE IF EXISTS alternative_foreign_phrase;
CREATE TABLE alternative_foreign_phrase (
	id INTEGER PRIMARY KEY,
	question_id INTEGER NOT NULL,
	phrase TEXT NOT NULL CHECK(LENGTH(phrase) <= 600),
	FOREIGN KEY (question_id) REFERENCES questions(id) ON DELETE CASCADE
);

/* 
DROP TABLE IF EXISTS sentences;
CREATE TABLE sentences (
	id INTEGER PRIMARY KEY,
	lesson_id INTEGER NOT NULL,
	native_sentence_id INTEGER NOT NULL,
	foreign_sentence_id INTEGER NOT NULL,
	FOREIGN KEY (lesson_id) REFERENCES lessons(id) ON DELETE CASCADE,
	FOREIGN KEY (native_sentence_id) REFERENCES native_sentences(id) ON DELETE CASCADE,
	FOREIGN KEY (foreign_sentence_id) REFERENCES foreign_sentences(id) ON DELETE CASCADE
);

DROP TABLE IF EXISTS native_sentences;
CREATE TABLE native_sentences (
	id INTEGER PRIMARY KEY,
	sentence TEXT NOT NULL CHECK(LENGTH(sentence) <= 1000)
);

DROP TABLE IF EXISTS foreign_sentences;
CREATE TABLE foreign_sentences (
	id INTEGER PRIMARY KEY,
	sentence TEXT NOT NULL CHECK(LENGTH(sentence) <= 1000)
); 
*/

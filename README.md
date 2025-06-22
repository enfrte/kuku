# kuku 

kuku is a language learning and practice app that empowers individuals to create custom content.

Screenshots of the sudent area: https://imgur.com/a/Oj74iwv

## Technology stack 

**Framework:** Fat Free Framework (F3). 

**Datastorage:** SQLite

**JS:** HTMX, AlpineJS (might convert to Mithril)

## Future features

Requested: 

1. Sound effects. 

Please make further suggestions in the issues section. 

## Install

Install the dependencies managed by composer. 

Change .env_copy to .env and set the values to your own.

Navigate to `kuku` and put the `kuku` folder one directory back from the web root. 

Navigate to the `kuku/public` folder and put kuku folder in the web root. 

Get the OS path to the `kuku` folder one directory back from the web root, and add as the values to 'ABSOLUTE_PRIVATE_APP_PATH' and 'UI' in index.php 

Log in to /admin, run the /install script to create the sqlite db. 

## Local dev

Get the OS path to the `kuku/kuku` folder and add as the values to 'ABSOLUTE_PRIVATE_APP_PATH' and 'UI' in index.php 

Navigate to `kuku/public` and run `php -S localhost:8000`

Try http://localhost:8000/kuku/

Or

If using XAMPP http://localhost/kuku/public/kuku/


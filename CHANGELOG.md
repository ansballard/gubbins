# Changelog

## 0.1.3 (11/13/2015)

**Implemented Features**

- Removed gulp
- Added linting
- Removed unnecessary `"use strict"`s
- Ignored dist
  - Site can now be built in 0.10.x (serverside)

**Bug Fixes**

- Fixed site building on Openshift

## 0.1.2 (11/12/2015)

**Implemented Features**

- https!
- Bootstrap
- Nav for all pages
- Restyled Readme slightly

**Bug Fixes**

- Valid HTML for the readme and changelog
- Validation checks for NaN `deathDate`s

## 0.1.1 (11/2/2015)

**Implemented Features**

- Switched callbacks to promises with `q`
- Added parameter info to README
- Catching exceptions/http status errors, just send back 500
- Cron job to clear old passes once a day

**Bug Fixes**

- Bugs!

## 0.1.0 (10/31/2015)

**Implemented Features**

- `api/generate` POST route doesn't use url parameters
- GUI for generating is now the root path
- Readme is now at `/readme`
- `numberOfUses` is explicitly cast as an int
- Markdown logic is now moved to `markdown.js`
- Switched `gui.html` post action to real url
- Removed console.logs

**Bug Fixes**

- Bugs!

## 0.0.2 (10/31/2015)

**Implemented Features**

- Real URLs in the readme
- The root route now returns the README parsed to html
- The changelog can be reached at `/changelog`
- A `from` parameter is now available for generated passes
- Spookiness
- Generate now returns an absolute URL, no `a` element
- Less `console.log`

**Bug Fixes**

- Bugs!

***

## 0.0.1 (10/30/2015)

**Initial Commit!**

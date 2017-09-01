# Readme

## Generate Passwords

A password url can be generated with a simple GET request to `localhost:3001/api/generate/<password>`. This will return a link to a page that display the password once, and deletes it immediately. This page is only accessible for 24 hours.

Custom `numberOfUses`,`hoursToLive`, and `from` values can be set via a post request to the above URL, and providing the parameters.

## Parameter Requirements

1. Password
  - Required
  - Positive integer
  - 140 characters or less

2. Number of Uses
  - Optional
  - Defaults to 1
  - Positive integer
  - 100 or less

3. Hours to Live
  - Optional
  - Defaults to 24
  - Positive integer
  - 168 (7 days) or less

4. From
  - Optional
  - Defaults to nothing
  - String
  - 140 characters or less

## Development

**npm run build**

Builds js, css, and templates for README and CHANGELOG

**npm run watch**

Watches for changes and rebuilds affected files

**npm start**

Serves the site via express using environment variables for IP, PORT, and DB info

**npm run dev**

Serves the site locally, connection to `mongodb://localhost/gubbins`

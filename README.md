# Readme

## Generate Passwords

A password url can be generated with a simple GET request to `https://gubbins-ansballard.rhcloud.com/api/generate/<password>`. This will return a link to a page that display the password once, and deletes it immediately. This page is only accessible for 24 hours.

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

All development can be handled via npm and gulp. Gulp handles building Node (through an npm script) and the frontend code (gulp directly), while npm handles running the server with nodemon. To build all relevant files and rebuild on changes, 3 terminals are required.
1. `npm run watch`
2. `npm run dev`
3. `gulp watchify`

These scripts will build all relevant files initially, start the server, and rebuild changed files while developing. This will not set server variables for connecting to your DB. See the npm script `localdev` for an example to pull in variables from a remote environment/service. 

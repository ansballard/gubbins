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

All development can be handled via npm and gulp. `npm run build` will build all server files to `dist/`. `gulp watch` will build files as they change. `npm run dev` will deploy a dev server that restarts on file changes. Running `npm run dev` and `gulp watch` in separate terminals will allow for rapid dev.

# Gubbins

## Share passwords easily and securely

### Generate Passwords

A password url can be generated with a simple GET request to `http://gubbins-ansballard.rhcloud.com/api/generate/<password>`. This will return a link to a page that display the password once, and deletes it immediately. This page is only accessible for 24 hours.

Custom `numberOfUses`,`hoursToLive`, and `from` values can be set via a post request to the above URL, and providing the parameters.

### Development

All development can be handled via npm and gulp. `npm run build` will build all server files to `dist/`. `gulp watch` will build files as they change. `npm run dev` will deploy a dev server that restarts on file changes. Running `npm run dev` and `gulp watch` in separate terminals will allow for rapid dev.

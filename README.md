## Development
The following will fire up a local webserver for development.
```
npm start
```

You'll want to add a Hex Kit plugin folder with the following `manifest.json`:
```
{
    "name": "Development",
    "version": "0.1",
    "url": "http://localhost:8080"
}
```

## Deployment
THe following commands will create a ZIP with the compiled plugin.
```
npm run build
npm run package
```
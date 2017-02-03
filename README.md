# FoozleJS #
===================

FoozleJS it's a tiny library that allow you to register errors of your web applications, and fix it faster.

[![npm version](https://badge.fury.io/js/foozle-tracker.svg)](https://badge.fury.io/js/foozle-tracker)
[![Package Quality](http://npm.packagequality.com/shield/foozle-tracker.svg)](http://packagequality.com/#?package=foozle-tracker)
[![Join the chat at https://gitter.im/techfort/LokiJS](https://badges.gitter.im/Join%20Chat.svg)](https://gitter.im/foozle-tracker?utm_source=badge&utm_medium=badge&utm_campaign=pr-badge&utm_content=badge)


Tracking javascript errors.
----------
How to use
* 1.- Clone the dashboard project ([Dashboard project](https://github.com/jojo5716/foozlejs-front-django))
* 2.- Create a project and get the token generated.
* 3-. Call the https://cdn.jsdelivr.net/foozlejs/1.0.11/index.min.js file in your project and configure the token.
```javascript 
   <script src="<PROJECT_PATH>/index.min.js"></script>
    <script type="text/javascript">
        window._foozlejs = {
            token: '<PROJECT_TOKEN>',
        };
    </script>
```
* 4.- If your application have any error, you will see it in the dashboard.
# Or you can import foozleJS in your javascript and decide when you want to report an error
``` javascript
 npm install --save foozle-tracker 
 import FoozleJS from 'foozle-tracker';
 foozle.initAPI(); // To init listeners
 foozle.api.track("gi") // Send an error (String, object, etc..)
```
## Example:
``` javascript
fetch(url_to_fetch, {
   credentials: 'include',
   method: 'POST',
}).then(() => {
   // Whatever
}).catch((error) => {
    foozle.api.track(error)
});

```
or

``` javascript
$.ajax("http://httpstat.us/500")
    .done(() => {
        console.log("ok");
    }).fail((error) => {
        foozle.api.track(error)
    });
```
# What FoozleJS offers? #
----------

All context of your application on the moment of the error. (Dependencies, Network, userAgent, consoles, and extra data)


# Configurations. #
----------

```javascript 
    <script type="text/javascript">
        window._foozlejs = {
            token: '<PROJECT_TOKEN>',
            console: {
                log: true, // console.warn("Registering console logs.")
                warn: true, // console.warn("Registering console warn.")
                error: true, // console.warn("Registering console error.")
            },
        };
    </script>
```




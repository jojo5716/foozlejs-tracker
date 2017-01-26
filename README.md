# FoozleJS #
===================

FoozleJS it's a tiny library that allow you to register errors of your web applications, and fix it faster.


Tracking javascript errors.
----------
How to use
* 1.- Clone the dashboard project ([Dashboard project](https://github.com/jojo5716/foozlejs-front-django))
* 2.- Create a project and get the token generated.
* 3-. Call the index.min.js file in your project and configure the token.
```javascript 
   <script src="<PROJECT_PATH>/index.min.js"></script>
    <script type="text/javascript">
        window._foozlejs = {
            token: '<PROJECT_TOKEN>',
        };
    </script>
```
* 4.- If your application have any error, you will see it in the dashboard.

# What FoozleJS offers? #
----------

All context of your application on the moment of the error. (Dependencies, Network, consoles, and extra data)


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

define(['/plugins/jquery.js', '/plugins/knockout.js'], ($, ko) => {
    class Application {
        constructor(_options) {
            this.baseServiceUrl = 'https://pokeapi.co/api/v2/'
        }

        startApplication() {
            console.log('started!');
            console.log(this.baseServiceUrl);
        }
        
    }

    return Application;
})
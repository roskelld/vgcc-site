
import Asteroids        from './asteroids.js';

class Site {
    constructor() {
        document.body.classList.add( 'black' );
        this.score = document.querySelector( '#ui-score' );

        this.number = 0;

        document.addEventListener( 'scroll', this.debounce( () => {
            this.number += Math.floor( this.scrollTracker() );
            this.score.textContent = `${this.padToFour( this.number )}`;
        }, 300 ));

        this.Asteroids = new Asteroids();
    }

    init() {
        this.Asteroids.init();
    }

    scrollTracker() {
        return document.body.scrollTop / (document.body.scrollHeight - document.body.clientHeight) * 100;
    }

    padToFour(number) {
        if (number<=9999) { number = ("000"+number).slice(-4); }
        return number;
    }

    debounce( func, time ) {
        let timeout;
        return function() {
            const functionCall = () => func.apply( this, arguments );

            clearTimeout( timeout );
            timeout = setTimeout( functionCall, time );
        }
    }
}


const site = new Site();


window.s = site;

export default site;

site.init();

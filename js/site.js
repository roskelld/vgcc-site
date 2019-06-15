
import Asteroids        from './asteroids.js';

class Site {
    constructor() {

        M.AutoInit();

        document.body.classList.add( 'black' );
        this.score = document.querySelector( '#ui-score' );



        this.number = Number( window.localStorage.getItem( 'score' ) );
        this.score.textContent = `${this.padToFour( this.number )}`;

        document.addEventListener( 'scroll', this.debounce( () => {

            this.scoreAdd( Math.floor( this.scrollTracker() ) );
            // this.number += Math.floor( this.scrollTracker() );

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

    scoreAdd( number ) {
        this.number += number;
        this.score.textContent = `${this.padToFour( this.number )}`;
        window.localStorage.setItem( 'score', this.number );
    }
}


const site = new Site();


window.s = site;

export default site;

site.init();

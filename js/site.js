
import {CountUp} from '/vgcc-site/js/lib/countUp.min.js';

class Site {
    constructor() {

        M.AutoInit();

        // STATS

        // Stat Counters
        this.stats = {
            games: 26,
            platforms: 14,
            years: 41,
            counties: 2,
            generations: 4,
            naps: 10037
        };

        this.countersEl = document.querySelectorAll( '.counter ');
        this.counters = [];

        this.countersEl.forEach( counter => {
            this.counters.push( new CountUp( counter, counter.textContent, {
                duration: 10
            } ) );
        });

        this.counters.push( new CountUp( 'nap-counter', 20037, {
            duration: 79999,
            startVal: 10024,
        }) );

        // instantiate the scrollama
        const scroller = scrollama();

        // setup the instance, pass callback functions
        scroller
          .setup({
            step: '.step',
            offset: 1,
            once: true
          })
          .onStepEnter(response => {
            // { element, index, direction }

            this.counters.forEach( c => {
                if ( response.index == c.el.dataset.scrollamaIndex )
                    c.start();
            } );
          })
          .onStepExit(response => {
            // { element, index, direction }
            // this.counters.forEach( c => c.reset() );
          });

        // setup resize event
        window.addEventListener('resize', scroller.resize);

        // Section Tracker ScrollSpy
        this.section_elems = document.querySelectorAll('.scrollspy');
        this.section_instances = M.ScrollSpy.init( this.section_elems, {
            activeClass: 'active',
            scrollOffset: 60,
        });

    }
    init()  {}
}


const site = new Site();


window.s = site;

export default site;

site.init();

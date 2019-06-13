import site     from './site.js';

class Asteroids {
    constructor() {

        // Setup Canvas
        this._canvas = document.createElement( 'canvas' );
        document.body.prepend( this._canvas );
        this._ctx = this._canvas.getContext( '2d' );

        this._canvas.width = document.body.clientWidth;
        this._canvas.height = document.body.clientHeight;

        // Setup Asteroid Sprites
        this.spriteList = ['Ê', 'Ë', 'Ì', 'Í', 'Î', 'Ï'];

        this.num_of_asteroids = 5;

        // Start Position
        this._trackTransforms(this._ctx);

        this.asteroids = [];

        for (let i = 0; i < this.num_of_asteroids; i++) {
            this.asteroids.push( this.generateRock() );
        }


    }

    init() {
        window.addEventListener( 'resize', site.debounce( () => {
            console.log(' diggld');
            this._canvas.width = document.body.clientWidth;
            this._canvas.height = document.body.clientHeight;
        }, 300 ));
        this.update();
    }

    generateRock() {
        return {
            position: {
                x: Math.random() * this._canvas.width,
                y: Math.random() * this._canvas.height
            },
            velocity: {
                x: 2 * ( Math.random() * 2 - 1 ),
                y: 2 * ( Math.random() * 2 - 1 ),
            },
            sprite: this.getRandomSprite( this.spriteList ),
        }
    }

    getRandomSprite( list ) {
        return list[ ~~(list.length * Math.random() ) ];
    }

    draw() {
        // Clear the entire canvas

        this._ctx.clearRect( 0, 0, this._canvas.width, this._canvas.height );
        // Set draw style
        this._ctx.strokeStyle = '#b8b8b8';
        this._ctx.lineWidth = 1;
        this._ctx.font = `${this._canvas.height / 10}px Vector Battle`;
        // this._ctx.filter = 'url(#blue-glow)';

        for (let i = 0; i < this.asteroids.length; i++) {
            const rock = this.asteroids[i];

            rock.velocity.x = ( rock.position.x + 70 >= this._canvas.width  || rock.position.x - 45 <= 0  )  ? -rock.velocity.x : rock.velocity.x;
            rock.velocity.y = ( rock.position.y >= this._canvas.height || rock.position.y - 45 <= 0 ) ? -rock.velocity.y : rock.velocity.y;

            rock.position.x += rock.velocity.x;
            rock.position.y += rock.velocity.y;


            this._ctx.strokeText( rock.sprite, rock.position.x, rock.position.y );
        }
    }

    update() {
        site.Asteroids.draw();
        window.requestAnimationFrame( site.Asteroids.update );
    }

    _trackTransforms(ctx) {
        const svg = document.createElementNS("http://www.w3.org/2000/svg", 'svg');
        let xform = svg.createSVGMatrix();
        ctx.getTransform = function () { return xform; };

        const savedTransforms = [];
        const save = ctx.save;
        ctx.save = function () {
            savedTransforms.push(xform.translate(0, 0));
            return save.call(ctx);
        };

        const restore = ctx.restore;
        ctx.restore = function () {
            xform = savedTransforms.pop();
            return restore.call(ctx);
        };

        const scale = ctx.scale;
        ctx.scale = function (sx, sy) {
            xform = xform.scaleNonUniform(sx, sy);
            return scale.call(ctx, sx, sy);
        };

        const rotate = ctx.rotate;
        ctx.rotate = function (radians) {
            xform = xform.rotate(radians * 180 / Math.PI);
            return rotate.call(ctx, radians);
        };

        const translate = ctx.translate;
        ctx.translate = function (dx, dy) {
            xform = xform.translate(dx, dy);
            return translate.call(ctx, dx, dy);
        };

        const transform = ctx.transform;
        ctx.transform = function (a, b, c, d, e, f) {
            const m2 = svg.createSVGMatrix();
            m2.a = a;
            m2.b = b;
            m2.c = c;
            m2.d = d;
            m2.e = e;
            m2.f = f;
            xform = xform.multiply(m2);
            return transform.call(ctx, a, b, c, d, e, f);
        };

        const setTransform = ctx.setTransform;
        ctx.setTransform = function (a, b, c, d, e, f) {
            xform.a = a;
            xform.b = b;
            xform.c = c;
            xform.d = d;
            xform.e = e;
            xform.f = f;
            return setTransform.call(ctx, a, b, c, d, e, f);
        };

        const pt = svg.createSVGPoint();
        ctx.transformedPoint = function (x, y) {
            pt.x = x;
            pt.y = y;
            return pt.matrixTransform(xform.inverse());
        }
    }
}

export default Asteroids;

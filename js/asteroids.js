import site     from './site.js';

class Asteroids {
    constructor() {
        this._canvas = document.createElement( 'canvas' );
        document.body.prepend( this._canvas );
        this._ctx = this._canvas.getContext( '2d' );

        this._canvas.width = window.innerWidth;
        this._canvas.height = window.innerHeight;

        this._isAnimating = true;

        this.rotation = 0;

        this.position = {
            x: Math.random() * this._canvas.width,
            y: Math.random() * this._canvas.height
        }

        this.velocity = {
            x: 2 * ( Math.random() * 2 - 1 ),
            y: 2 * ( Math.random() * 2 - 1 ),
        }

        // Set draw style
        this._ctx.strokeStyle = '#ffffff';
        this._ctx.lineWidth = 1;
        this._ctx.filter = 'url(#blue-glow)';

        // this.rock.arc( this.position.x, this.position.y, 25, 0, 2 * Math.PI );

        // Start Position
        this._trackTransforms(this._ctx);
    }

    draw() {
        // Clear the entire canvas
		// const p1 = this._ctx.transformedPoint( 0, 0 );
		// const p2 = this._ctx.transformedPoint( this._canvas.width, this._canvas.height );
		// this._ctx.clearRect( p1.x, p1.y, p2.x - p1.x, p2.y - p1.y );

        this._ctx.clearRect( 0, 0, this._canvas.width, this._canvas.height );

        // this._ctx.fillStyle = '#000000';
		// this._ctx.fillRect( 0, 0, this._canvas.width, this._canvas.height );
        // this._ctx.beginPath();


        this._ctx.font = '70px Vector Battle';

        // var rectangle = new Path2D();
        // rectangle.rect(10, 10, 50, 50);

        // this.rock = new Path2D();
        this.velocity.x = ( this.position.x + 70 >= window.innerWidth  || this.position.x - 45 <= 0  )  ? -this.velocity.x : this.velocity.x;
        this.velocity.y = ( this.position.y >= window.innerHeight || this.position.y - 45 <= 0 ) ? -this.velocity.y : this.velocity.y;

        this.position.x += this.velocity.x;
        this.position.y += this.velocity.y;

        this.rotation++;

        // this._ctx.save();

        // this._ctx.translate( this.position.x, this.position.y);
        // this._ctx.rotate( -Math.PI / 4 * this.rotation );
        // this._ctx.textAlign = 'center';
        this._ctx.strokeText( 'Ê', this.position.x, this.position.y );
        // this._ctx.fillText(text, 0, font / 2);
        // this._ctx.restore();

        // this.rock.moveTo( this.position.x, this.position.y );
        // this.rock.arc( this.position.x, this.position.y, 25, 0, 2 * Math.PI );

        // var p = new Path2D('M10 10 h 80 v 80 h -80 Z');
        // this._ctx.stroke (p);
        // this._ctx.stroke(rectangle);
        // this._ctx.stroke( this.rock );
        // this._ctx.closePath();

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

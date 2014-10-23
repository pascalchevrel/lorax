define(['pixi', 'createjs'], function (PIXI, createjs) {
  'use strict';

  var Circle = function () {
    return this;
  };

  Circle.prototype.draw = function (radius, x, y) {
    this.elm = new PIXI.DisplayObjectContainer();
    this.radius = radius;

    this._circle = this._drawCircle(radius, x, y);
    this.elm.addChild(this._circle);

    this.elm.x = x;
    this.elm.y = y;
    this._x0 = x;
    this._y0 = y;

    this._resumeStaticAnimation();
  };

  Circle.prototype.setData = function (data) {
    this.data = data;
  };

  Circle.prototype._resumeStaticAnimation = function () {
    var d = this.radius / 10; // displace quocient
    this._staticScaleTween = createjs.Tween.get(this.elm.scale, {loop: true, override: true})
      .wait(Math.random() * 1000)
      .to({x:1 + (0.2 * d), y:1 + (0.2 * d)}, 500, createjs.Ease.bounceOut)
      .to({x:1, y:1}, 500, createjs.Ease.linear);

    this._staticPositionTween = createjs.Tween.get(this.elm, {loop: true, override: true})
      .to({
          x: this._x0 + (-10 + Math.random() * 20) * d,
          y: this._y0 + (-10 + Math.random() * 20) * d
        },
        1000 + Math.random() * 500,
        createjs.sineInOut)
      .to({
          x: this._x0 + (-10 + Math.random() * 20) * d,
          y: this._y0 + (-10 + Math.random() * 20) * d
        },
        1000 + Math.random() * 500,
        createjs.sineInOut)
      .to({
          x: this._x0 + (-10 + Math.random() * 20) * d,
          y: this._y0 + (-10 + Math.random() * 20) * d
        },
        1000 + Math.random() * 500,
        createjs.sineInOut)
      .to({
          x: this._x0 + (-10 + Math.random() * 20) * d,
          y: this._y0 + (-10 + Math.random() * 20) * d
        },
        1000 + Math.random() * 500,
        createjs.sineInOut)
      .to({x: this._x0, y: this._y0}, 1000 + Math.random() * 500, createjs.sineInOut);
  };

  /**
  * Draws a single circle
  * @param  {number} radius circle radius
  * @param  {number} x initial position on x axis
  * @param  {number} y initial position on y axis
  * @return {DisplayObject} actual element
  */
  Circle.prototype._drawCircle = function (radius) {
    var circle = new PIXI.Graphics();
    circle.beginFill(0x000000);
    circle.drawCircle(0, 0, radius);
    circle.endFill();
    circle.hitArea = new PIXI.Rectangle(-radius, -radius, radius * 2, radius * 2);
    circle.cacheAsBitmap = true;
    return circle;
    // var circle = PIXI.Sprite.fromImage('images/circle.png');
    // circle.width = circle.height = radius * 2;
    // circle.x = circle.y = -radius;
    // return circle;
  };

  Circle.prototype.explode = function () {
    if (this.elm.alpha === 0) return;
    this.implodeAlpha = this.elm.alpha;

    var angle = Math.atan2(this._y0, this._x0);
    angle += (Math.random() * Math.PI / 16) - (Math.PI / 32);

    this.stopMoving();
    createjs.Tween.get(this.elm, {override: true})
      .wait(Math.random() * 200)
      .to({alpha: 0, x: Math.cos(angle) * 500, y: Math.sin(angle) * 500},
        (Math.random() * 150) + 300,
        createjs.easeOut);
  };

  Circle.prototype.implode = function () {
    this._staticPositionTween.setPaused(true);
    createjs.Tween.get(this.elm, {override: true})
      .to({alpha: this.implodeAlpha, x: this._x0, y: this._y0},
        (Math.random() * 150) + 300,
        createjs.easeIn)
      .call(this._resumeStaticAnimation.bind(this));
  };

  Circle.prototype.mouseOver = function () {
    this.isOver = true;
  };

  Circle.prototype.mouseOut = function () {
    this.isOver = false;
  };

  Circle.prototype.moveTo = function (x, y) {
    this._x0 = x;
    this._y0 = y;

    this._staticPositionTween.setPaused(true);

    return createjs.Tween.get(this.elm, {override: true})
      .to({x:x, y:y}, (Math.random() * 100) + 500, createjs.Ease.getBackOut(1.5));
  };

  Circle.prototype.stopMoving = function () {
    this._staticScaleTween.setPaused(true);
    this._staticPositionTween.setPaused(true);
  };

  return Circle;
});
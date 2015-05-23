////////////////////////////////////////////////////////////
// ============= micro HTML5 library =====================
// @author Gerard Ferrandez / http://www.dhteumeuleu.com/
// last update: May 27, 2013
// Released under the MIT license
// http://www.dhteumeuleu.com/LICENSE.html
////////////////////////////////////////////////////////////

// ===== ge1doot global =====

var ge1doot = ge1doot || {
  json: null,
  screen: null,
  pointer: null,
  camera: null,
  loadJS: function (url, callback, data) {
    if (typeof url == "string") url = [url];
    var load = function (src) {
      var script = document.createElement("script");
        if (callback) {
          if (script.readyState){
            script.onreadystatechange = function () {
              if (script.readyState == "loaded" || script.readyState == "complete"){
                script.onreadystatechange = null;
                if (--n === 0) callback(data || false);
              }
            }
          } else {
            script.onload = function() {
              if (--n === 0) callback(data || false);
            }
          }
        }
        script.src = src;
        document.getElementsByTagName("head")[0].appendChild(script);
    }
    for (var i = 0, n = url.length; i < n; i++) load(url[i]);
  }
}

// ===== html/canvas container =====

ge1doot.Screen = function (setup) {
  ge1doot.screen = this;
  this.elem = document.getElementById(setup.container) || setup.container;
  this.ctx = this.elem.tagName == "CANVAS" ? this.elem.getContext("2d") : false;
  this.style = this.elem.style;
  this.left = 0;
  this.top = 0;
  this.width = 0;
  this.height = 0;
  this.cursor = "default";
  this.setup = setup;
  this.resize = function () {
    var o = this.elem;
    this.width  = o.offsetWidth;
    this.height = o.offsetHeight;
    for (this.left = 0, this.top = 0; o != null; o = o.offsetParent) {
      this.left += o.offsetLeft;
      this.top  += o.offsetTop;
    }
    if (this.ctx) {
      this.elem.width  = this.width;
      this.elem.height = this.height;
    }
    this.setup.resize && this.setup.resize();
  }
  this.setCursor = function (type) {
    if (type !== this.cursor && 'ontouchstart' in window === false) {
      this.cursor = type;
      this.style.cursor = type;
    }
  }
  window.addEventListener('resize', function () {
    ge1doot.screen.resize();
  }, false);
  !this.setup.resize && this.resize();
}

// ==== unified touch events handler ====

ge1doot.Pointer = function (setup) {
  ge1doot.pointer = this;
  var self        = this;
  var body        = document.body;
  var html        = document.documentElement;
  this.setup      = setup;
  this.screen     = ge1doot.screen;
  this.elem       = this.screen.elem;
  this.X          = 0;
  this.Y          = 0;
  this.Xi         = 0;
  this.Yi         = 0;
  this.bXi        = 0;
  this.bYi        = 0;
  this.Xr         = 0;
  this.Yr         = 0;
  this.startX     = 0;
  this.startY     = 0;
  this.scale      = 0;
  this.wheelDelta = 0;
  this.isDraging  = false;
  this.hasMoved   = false;
  this.isDown     = false;
  this.evt        = false;
  var sX          = 0;
  var sY          = 0;
  // prevent default behavior
  if (setup.tap) this.elem.onclick = function () { return false; }
  if (!setup.documentMove) {
    document.ontouchmove = function(e) { e.preventDefault(); }
  }
  document.addEventListener("MSHoldVisual", function(e) { e.preventDefault(); }, false);
  if (typeof this.elem.style.msTouchAction != 'undefined') this.elem.style.msTouchAction = "none";

  this.pointerDown = function (e) {
    if (!this.isDown) {
      if (this.elem.setCapture) this.elem.setCapture();
      this.isDraging = false;
      this.hasMoved = false;
      this.isDown = true;
      this.evt = e;
      this.Xr = (e.clientX !== undefined ? e.clientX : e.touches[0].clientX);
      this.Yr = (e.clientY !== undefined ? e.clientY : e.touches[0].clientY);
      this.X  = sX = this.Xr - this.screen.left;
      this.Y  = sY = this.Yr - this.screen.top + ((html && html.scrollTop) || body.scrollTop);
      this.setup.down && this.setup.down(e);
    }
  }
  this.pointerMove = function(e) {
    this.Xr = (e.clientX !== undefined ? e.clientX : e.touches[0].clientX);
    this.Yr = (e.clientY !== undefined ? e.clientY : e.touches[0].clientY);
    this.X  = this.Xr - this.screen.left;
    this.Y  = this.Yr - this.screen.top + ((html && html.scrollTop) || body.scrollTop);
    if (this.isDown) {
      this.Xi = this.bXi + (this.X - sX);
      this.Yi = this.bYi - (this.Y - sY);
    }
    if (Math.abs(this.X - sX) > 11 || Math.abs(this.Y - sY) > 11) {
      this.hasMoved = true;
      if (this.isDown) {
        if (!this.isDraging) {
          this.startX = sX;
          this.startY = sY;
          this.setup.startDrag && this.setup.startDrag(e);
          this.isDraging = true;
        } else {
          this.setup.drag && this.setup.drag(e);
        }
      } else {
        sX = this.X;
        sY = this.Y;
      }
    }
    this.setup.move && this.setup.move(e);
  }
  this.pointerUp = function(e) {
    this.bXi = this.Xi;
    this.bYi = this.Yi;
    if (!this.hasMoved) {
      this.X = sX;
      this.Y = sY;
      this.setup.tap && this.setup.tap(this.evt);
    } else {
      this.setup.up && this.setup.up(this.evt);
    }
    this.isDraging = false;
    this.isDown = false;
    this.hasMoved = false;
    this.setup.up && this.setup.up(this.evt);
    if (this.elem.releaseCapture) this.elem.releaseCapture();
    this.evt = false;
  }
  this.pointerCancel = function(e) {
    if (this.elem.releaseCapture) this.elem.releaseCapture();
    this.isDraging = false;
    this.hasMoved = false;
    this.isDown = false;
    this.bXi = this.Xi;
    this.bYi = this.Yi;
    sX = 0;
    sY = 0;
  }
  if ('ontouchstart' in window) {
    this.elem.ontouchstart      = function (e) { self.pointerDown(e); return false;  }
    this.elem.ontouchmove       = function (e) { self.pointerMove(e); return false;  }
    this.elem.ontouchend        = function (e) { self.pointerUp(e); return false;    }
    this.elem.ontouchcancel     = function (e) { self.pointerCancel(e); return false;}
  }
  document.addEventListener("mousedown", function (e) {
    if (
      e.target === self.elem ||
      (e.target.parentNode && e.target.parentNode === self.elem) ||
      (e.target.parentNode.parentNode && e.target.parentNode.parentNode === self.elem)
    ) {
      if (typeof e.stopPropagation != "undefined") {
        e.stopPropagation();
      } else {
        e.cancelBubble = true;
      }
      e.preventDefault();
      self.pointerDown(e);
    }
  }, false);
  document.addEventListener("mousemove", function (e) { self.pointerMove(e); }, false);
  document.addEventListener("mouseup",   function (e) {
    self.pointerUp(e);
  }, false);
  document.addEventListener('gesturechange', function(e) {
    e.preventDefault();
    if (e.scale > 1) self.scale = 0.1; else if (e.scale < 1) self.scale = -0.1; else self.scale = 0;
    self.setup.scale && self.setup.scale(e);
    return false;
  }, false);
  if (window.navigator.msPointerEnabled) {
    var nContact = 0;
    var myGesture = new MSGesture();
    myGesture.target = this.elem;
    this.elem.addEventListener("MSPointerDown", function(e) {
      if (e.pointerType == e.MSPOINTER_TYPE_TOUCH) {
        myGesture.addPointer(e.pointerId);
        nContact++;
      }
    }, false);
    this.elem.addEventListener("MSPointerOut", function(e) {
      if (e.pointerType == e.MSPOINTER_TYPE_TOUCH) {
        nContact--;
      }
    }, false);
    this.elem.addEventListener("MSGestureHold", function(e) {
      e.preventDefault();
    }, false);
    this.elem.addEventListener("MSGestureChange", function(e) {
      if (nContact > 1) {
        if (e.preventDefault) e.preventDefault();
        self.scale = e.velocityExpansion;
        self.setup.scale && self.setup.scale(e);
      }
      return false;
    }, false);
  }
  if (window.addEventListener) this.elem.addEventListener('DOMMouseScroll', function(e) {
    if (e.preventDefault) e.preventDefault();
    self.wheelDelta = e.detail * 10;
    self.setup.wheel && self.setup.wheel(e);
    return false;
  }, false);
  this.elem.onmousewheel = function () {
    self.wheelDelta = -event.wheelDelta * .25;
    self.setup.wheel && self.setup.wheel(event);
    return false;
  }
}
// ===== request animation frame =====

window.requestAnimFrame = (function(){
    return  window.requestAnimationFrame ||
    window.webkitRequestAnimationFrame   ||
    window.mozRequestAnimationFrame      ||
    window.oRequestAnimationFrame        ||
    window.msRequestAnimationFrame       ||
    function( run ){
      window.setTimeout(run, 16);
    };
})();
/*
 * ==============================================================
 * CANVAS 3D experiment -
 * http://www.dhteumeuleu.com/
 * Author Gerard Ferrandez - 7 June 2010
 * ------------------------------------------------------------
 * GFX: Vieeto Voom - http://www.flickr.com/photos/vieeto_voom/
 * ------------------------------------------------------------
 * Javascript released under the MIT license
 * http://www.dhteumeuleu.com/LICENSE.html
 * Last updated: 12 Dec 2012
 * ===============================================================
 */

"use strict";

window.imagestransform3D=(function () {
  /* ==== definitions ==== */
  var diapo = [], layers = [], ctx, pointer, scr, camera, light, fps = 0, quality = [1,2],
  // ---- poly constructor ----
  Poly = function (parent, face) {
    this.parent = parent;
    this.ctx    = ctx;
    this.color  = face.fill || false;
    this.points = [];
    if (!face.img) {
      // ---- create points ----
      for (var i = 0; i < 4; i++) {
        this.points[i] = new ge1doot.transform3D.Point(
          parent.pc.x + (face.x[i] * parent.normalZ) + (face.z[i] * parent.normalX),
          parent.pc.y +  face.y[i],
          parent.pc.z + (face.x[i] * parent.normalX) + (-face.z[i] * parent.normalZ)
        );
      }
      this.points[3].next = false;
    }
  },
  // ---- diapo constructor ----
  Diapo = function (path, img, structure) {
    // ---- create image ----
    this.img = new ge1doot.transform3D.Image(
      this, path + img.img, 1, {
        isLoaded: function(img) {
          img.parent.isLoaded = true;
          img.parent.loaded(img);
        }
      }
    );
    this.visible  = false;
    this.normalX  = img.nx;
    this.normalZ  = img.nz;
    // ---- point center ----
    this.pc = new ge1doot.transform3D.Point(img.x, img.y, img.z);
    // ---- target positions ----
    this.tx = img.x + (img.nx * Math.sqrt(camera.focalLength) * 20);
    this.tz = img.z - (img.nz * Math.sqrt(camera.focalLength) * 20);
    // ---- create polygons ----
    this.poly = [];
    for (var i = -1, p; p = structure[++i];) {
      layers[i] = (p.img === true ? 1 : 2);
      this.poly.push(
        new Poly(this, p)
      );
    }
  },
  // ---- init section ----
  init = function (json) {
    // draw poly primitive
    Poly.prototype.drawPoly = ge1doot.transform3D.drawPoly;
    // ---- init screen ----
    scr = new ge1doot.Screen({
      container: "canvas"
    });
    ctx = scr.ctx;
    scr.resize();
    // ---- init pointer ----
    pointer = new ge1doot.Pointer({
      tap: function () {
        if (camera.over) {
          if (camera.over === camera.target.elem) {
            // ---- return to the center ----
            camera.target.x = 0;
            camera.target.z = 0;
            camera.target.elem = false;
          } else {
            // ---- goto diapo ----
            camera.target.elem = camera.over;
            camera.target.x = camera.over.tx;
            camera.target.z = camera.over.tz;
            // ---- adapt tesselation level to distance ----
            for (var i = 0, d; d = diapo[i++];) {
              var dx = camera.target.x - d.pc.x;
              var dz = camera.target.z - d.pc.z;
              var dist = Math.sqrt(dx * dx + dz * dz);
              var lev = (dist > 1500) ? quality[0] : quality[1];
              d.img.setLevel(lev);
            }
          }
        }
      }
    });
    // ---- init camera ----
    camera = new ge1doot.transform3D.Camera({
      focalLength: Math.sqrt(scr.width) * 10,
      easeTranslation: 0.025,
      easeRotation: 0.06,
      disableRz: true
    }, {
      move: function () {
        this.over = false;
        // ---- rotation ----
        if (pointer.isDraging) {
          this.target.elem = false;
          this.target.ry = -pointer.Xi * 0.01;
          this.target.rx = (pointer.Y - scr.height * 0.5) / (scr.height * 0.5);
        } else {
          if (this.target.elem) {
            this.target.ry = Math.atan2(
              this.target.elem.pc.x - this.x,
              this.target.elem.pc.z - this.z
            );
          }
        }
        this.target.rx *= 0.9;
      }
    });
    camera.z  = -10000;
    camera.py = 0;
    // ---- create images ----
    for (var i = 0, img; img = json.imgdata[i++];) {
      diapo.push(
        new Diapo(
          json.options.imagesPath,
          img,
          json.structure
        )
      );
    }
    // ---- start engine ---- >>>
    setInterval(function() {
      quality = (fps > 50) ? [2,3] : [1,2];
      fps = 0;
    }, 1000);
    run();
  },
  // ---- main loop ----
  run = function () {
    // ---- clear screen ----
    ctx.clearRect(0, 0, scr.width, scr.height);
    // ---- camera ----
    camera.move();
    // ---- draw layers ----
    for (var k = -1, l; l = layers[++k];) {
      light = false;
      for (var i = 0, d; d = diapo[i++];) {
        (l === 1 && d.draw()) ||
        (d.visible && d.poly[k].draw());
      }
    }
    // ---- cursor ----
    if (camera.over && !pointer.isDraging) {
      scr.setCursor("pointer");
    } else {
      scr.setCursor("move");
    }
    // ---- loop ----
    fps++;
    requestAnimFrame(run);
  };
  /* ==== prototypes ==== */
  Poly.prototype.draw = function () {
    // ---- color light ----
    var c = this.color;
    if (c.light || !light) {
      var s = c.light ? this.parent.light : 1;
      // ---- rgba color ----
      light = "rgba(" +
        Math.round(c.r * s) + "," +
        Math.round(c.g * s) + "," +
        Math.round(c.b * s) + "," + (c.a || 1) + ")";
      ctx.fillStyle = light;
    }
    // ---- paint poly ----
    if (!c.light || this.parent.light < 1) {
      // ---- projection ----
      for (
        var i = 0;
        this.points[i++].projection();
      );
      this.drawPoly();
      ctx.fill();
    }
  }
  /* ==== image onload ==== */
  Diapo.prototype.loaded = function (img) {
    // ---- create points ----
    var d = [-1,1,1,-1,1,1,-1,-1];
    var w = img.texture.width  * 0.5;
    var h = img.texture.height * 0.5;
    for (var i = 0; i < 4; i++) {
      img.points[i] = new ge1doot.transform3D.Point(
        this.pc.x + (w * this.normalZ * d[i]),
        this.pc.y + (h * d[i + 4]),
        this.pc.z + (w * this.normalX * d[i])
      );
    }
  }
  /* ==== images draw ==== */
  Diapo.prototype.draw = function () {
    // ---- visibility ----
    this.pc.projection();
    if (this.pc.Z > -(camera.focalLength >> 1) && this.img.transform3D(true)) {
      // ---- light ----
      this.light = 0.5 + Math.abs(this.normalZ * camera.cosY - this.normalX * camera.sinY) * 0.6;
      // ---- draw image ----
      this.visible = true;
      this.img.draw();
      // ---- test pointer inside ----
      if (pointer.hasMoved || pointer.isDown) {
        if (
          this.img.isPointerInside(
            pointer.X,
            pointer.Y
          )
        ) camera.over = this;
      }
    } else this.visible = false;
    return true;
  }
  return {
    // --- load data ----
    load : function (data) {
      var dataDefaults={
        structure:[
          {
            // wall
            fill: {r:255, g:255, b:255, light:1},
            x: [-1001,-490,-490,-1001],
            z: [-500,-500,-500,-500],
            y: [500,500,-500,-500]
          },{
            // wall
            fill: {r:255, g:255, b:255, light:1},
            x: [-501,2,2,-500],
            z: [-500,-500,-500,-500],
            y: [500,500,-500,-500]
          },{
            // wall
            fill: {r:255, g:255, b:255, light:1},
            x: [0,502,502,0],
            z: [-500,-500,-500,-500],
            y: [500,500,-500,-500]
          },{
            // wall
            fill: {r:255, g:255, b:255, light:1},
            x: [490,1002,1002,490],
            z: [-500,-500,-500,-500],
            y: [500,500,-500,-500]
          },{
            // shadow
            fill: {r:0, g:0, b:0, a:0.2},
            x: [-420,420,420,-420],
            z: [-500,-500,-500,-500],
            y: [150, 150,-320,-320]
          },{
            // shadow
            fill: {r:0, g:0, b:0, a:0.2},
            x: [-20,20,20,-20],
            z: [-500,-500,-500,-500],
            y: [250, 250,150,150]
          },{
            // shadow
            fill: {r:0, g:0, b:0, a:0.2},
            x: [-20,20,20,-20],
            z: [-500,-500,-500,-500],
            y: [-320, -320,-500,-500]
          },{
            // shadow
            fill: {r:0, g:0, b:0, a:0.2},
            x: [-20,20,10,-10],
            z: [-500,-500,-100,-100],
            y: [-500, -500,-500,-500]
          },{
            // base
            fill: {r:32, g:32, b:32},
            x: [-50,50,50,-50],
            z: [-150,-150,-50,-50],
            y: [-500,-500,-500,-500]
          },{
            // support
            fill: {r:16, g:16, b:16},
            x: [-10,10,10,-10],
            z: [-100,-100,-100,-100],
            y: [300,300,-500,-500]
          },{
            // frame
            fill: {r:255, g:255, b:255},
            x: [-320,-320,-320,-320],
            z: [0,-20,-20,0],
            y: [-190,-190,190,190]
          },{
            // frame
            fill: {r:255, g:255, b:255},
            x: [320,320,320,320],
            z: [0,-20,-20,0],
            y: [-190,-190,190,190]
          },
          {img:true},
          {
            // ceilingLight
            fill: {r:255, g:128, b:0},
            x: [-50,50,50,-50],
            z: [450,450,550,550],
            y: [500,500,500,500]
          },{
            // groundLight
            fill: {r:255, g:128, b:0},
            x: [-50,50,50,-50],
            z: [450,450,550,550],
            y: [-500,-500,-500,-500]
          }
        ],
        libpath:"{{ site.url }}/assets/js/vendor/imageTransform3D.js"
      };
      data=$.extend({},dataDefaults,data);
      ge1doot.loadJS(
          data.libpath,
          init, data
        );
    }
  }
})();

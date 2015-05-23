---
layout: defaults
title: 同学们，好美有木有
excerpt: "暂放同学的相册"
modified: 2015-05-17
categories: articles
tags: ["【相册】"]
image:
  feature: valley.png
  credit: WeGraphics
  creditlink: http://wegraphics.net/downloads/free-ultimate-blurred-background-pack/
comments: true
share: true
---
  <canvas id="canvas" width="225" height="609"  data-libpath="{{ site.url }}/assets/js/vendor/imageTransform3D.js" data-imgspath="{{ site.url }}/images/imgs-yansa/" style="cursor: move;">你的浏览器不支持HTML5画布技术，请使用谷歌浏览器。</canvas>
  <script>

  window.imagestransform3D.load({
    imgdata:[
      // north
      {img:'1.jpg', x:-1000, y:0, z:1500, nx:0, nz:1},
      {img:'2.jpg', x:0,     y:0, z:1500, nx:0, nz:1},
      {img:'3.jpg', x:1000,  y:0, z:1500, nx:0, nz:1},
      // east
      {img:'4.jpg', x:1500,  y:0, z:1000, nx:-1, nz:0},
      {img:'5.jpg', x:1500,  y:0, z:0, nx:-1, nz:0},
      {img:'6.jpg', x:1500,  y:0, z:-1000, nx:-1, nz:0},
      // south
      {img:'7.jpg', x:1000,  y:0, z:-1500, nx:0, nz:-1},
      {img:'8.jpg', x:0,     y:0, z:-1500, nx:0, nz:-1},
      {img:'9.jpg', x:-1000, y:0, z:-1500, nx:0, nz:-1},
      // west
      {img:'10.jpg', x:-1500, y:0, z:-1000, nx:1, nz:0},
      {img:'11.jpg', x:-1500, y:0, z:0, nx:1, nz:0},
      {img:'12.jpg', x:-1500, y:0, z:1000, nx:1, nz:0}
    ],
    libpath:"{{ site.url }}/assets/js/vendor/imageTransform3D.js",
    options:{
      imagesPath: "{{ site.url }}/images/imgs/dx_091/"
    }
  });
  </script>


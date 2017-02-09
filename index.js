var AFRAME = require('aframe');
var TWEEN = require('tween.js');
require('aframe-dev-components');
require('aframe-look-at-component');


var sites = require('./sites');

// var physics = require('aframe-physics-system');
// var widgets = require('aframe-ui-widgets');
// physics.registerAll();


AFRAME.registerComponent('rotate-y-axis', {
  init: function () {
    this.rotate = true;
  },
  play: function () {
    this.rotate = true;
  },
  pause: function () {
    this.rotate = false;
  },
  tick: function () {
    if (!this.rotate) return false;
    var el = this.el;
    var rotation = el.getAttribute('rotation');

    el.setAttribute('rotation', {
      x: rotation.x,
      y: rotation.y + 1,
      z: rotation.z,
    })
  }
});

// AFRAME.registerComponent('environment', {
//   init: function () {
//     var radius = 5;
//     var count = 100;


//     function getRandom(min, max) {
//       return Math.random() * (max - min) + min;
//     }

//     for (var i = 0; i < count; i++) {

//       var x = radius * Math.cos(2 * i * Math.PI / count) + getRandom(0.1, 3);
//       var z = radius * Math.sin(2 * i * Math.PI / count) + getRandom(0.1, 3);
//       var height = getRandom(1, 3);

//       var cone = document.createElement('a-entity');
//       cone.setAttribute('geometry', {
//         primitive: 'cone',
//         radiusTop: 0,
//         radiusBottom: 0.2,
//         height: height
//       });

//       cone.setAttribute('position', {
//         x: x,
//         y: height / 2,
//         z: z
//       });

//       cone.setAttribute('material', {
//         color: "orange"
//       });

//       this.el.appendChild(cone);
//     }
//   },
//   play: function () {
//   },
//   pause: function () {
//   },
//   tick: function () {
//   }
// });

AFRAME.registerComponent('menu', {
  init: function () {
    // this.bubbles = [];
    this.loaded = 0;
    this.ready = false;
    var radius = 0.5;
    var height = 1.2;
    var angle = Math.PI / 2;
    var self = this;
    this.colors = [
      0x6C77E8,
      0xE8A238,
      0xF83C98,
      0xD5E86E,
      0x24DFBF
    ]

    this.ready = new Promise(function(resolve, reject) {
      for (var i = 0; i < sites.length; i++) {
        var bubble = self.makeBubble(self.colors[i]);
        var x = radius * Math.cos(-2 * i * angle / sites.length);
        var z = radius * Math.sin(-2 * i * angle / sites.length);

        bubble.setAttribute('position', { x: x, y: height, z: z });
        bubble.setAttribute('look-at', { x: 0, y: height, z: 0 });
        bubble.setAttribute('data-url', sites[i].url);

        var text = self.makeText(sites[i].name);
        text.setAttribute('position', { x: 0, y: 0.15, z: 0 });
        bubble.appendChild(text);

        bubble.addEventListener('loaded', function () {
          self.loaded++;
          if (self.loaded === sites.length) {
            resolve();
          }
        });

        bubble.addEventListener('click', function (e) {
          self.navigate(e.detail.target.dataset.url);
        });

        // self.bubbles.push(bubble);
        self.el.appendChild(bubble);
      }
    });
  },

  navigate: function(url) {
    console.log('Navigating to ', url);
    window.location.href = url;
  },

  play: function () {
    this.ready.then(this.showMenu.bind(this));
  },

  pause: function () {
  },

  showMenu: function() {
  },

  makeText: function(text) {
    var entity = document.createElement('a-entity');
    entity.setAttribute('text', {
      value: text,
      align: 'center'
    });
    return entity;
  },

  makeBubble: function (color) {
    var bubble = document.createElement('a-entity');
    bubble.className = 'bubble';
    bubble.setAttribute('geometry', {
      primitive: 'sphere',
      radius: 0.1
    });
    bubble.setAttribute('material', {
      color: "lightblue",
      opacity: 0.2
    });

    var platform = document.createElement('a-entity');
    platform.setAttribute('geometry', {
      primitive: 'cylinder',
      radius: 0.1,
      height: 0.01
    });
    platform.setAttribute('position', {
      y: -0.12
    });
    platform.setAttribute('material', {
      color: 0x8F9193
    });
    bubble.appendChild(platform);

    var shape = document.createElement('a-entity');
    shape.setAttribute('geometry', {
      primitive: 'octahedron',
      radius: 0.05
    });
    shape.setAttribute('material', {
      color: color
    })
    shape.setAttribute('rotate-y-axis', '');
    bubble.appendChild(shape);

    return bubble;
  },

  tick: function (time) {
    TWEEN.update(time);
  }
});

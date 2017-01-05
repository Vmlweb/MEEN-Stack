
let App = Ember.Application.create();

export default App;


import test from './test.js'

App.Router.map(test);

App.IndexController = Em.Controller.extend({
  refreshRate:20,
  starCount:200
});

App.StarFieldComponent = Em.Component.extend({
  tagName:'canvas',
  width: 400,
  height: 300,
  starCount:100,
  refresh:30,
  attributeBindings:['width', 'height'],
  stars:null,
  on:false,
  
  build: function(){
    var canvas = this.$()[0],
        ctx = canvas.getContext('2d'),
        stars = [],
        height = this.get('height'),
        width = this.get('width');
    
    for (var i = 0, len = this.get('starCount'); i < len; i++){
      stars.push([Math.random() * width, Math.random() * height, Math.random() * 2, 0.5 + Math.random() / 2]);
    }

    this.set('stars', stars);
    this.set('ctx', ctx);
    this.set('on', true);
  }.on('didInsertElement').observes('starCount', 'width', 'height'),
  
  kill: function(){
    this.set('on', false);
  }.on('willDestroyElement'),
  
  clear: function () {
    var ctx = this.get('ctx'),
        height = this.get('height'),
        width = this.get('width');
    ctx.fillStyle = 'black';
    ctx.clearRect(0, 0, width, height);
    ctx.beginPath();
    ctx.rect(0, 0, width, height);
    ctx.closePath();
    ctx.fill();
  },
  drawStars: function () {
    var stars = this.get('stars'),
        starCount = stars.length,
        ctx = this.get('ctx');
    for (var i = 0; i < starCount; i++) {
        ctx.fillStyle = 'rgba(255, 255, 0, ' + stars[i][3] + ')';
        ctx.beginPath();
        ctx.arc(stars[i][0], stars[i][1], stars[i][2], 0, Math.PI * 2, true);
        ctx.closePath();
        ctx.fill();
    }
  },
  moveStars :function (e) {
    var stars = this.get('stars'),
        starCount = stars.length,
        height = this.get('height'),
        width = this.get('width');
    for (var i = 0; i < starCount; i++) {
        if (stars[i][1] - stars[i][2] > height) {
            stars[i][0] = Math.random() * width;
            stars[i][2] = Math.random() * 2;
            stars[i][1] = 0 - stars[i][2];
            stars[i][3] = 0 + Math.random() / 2;
        } else {
            stars[i][1] += e;
        }
    }
  },
  gaze: function(){
    if(this.get('on')){
      this.loop();
    }
  }.observes('on'),
  loop: function () {
    if(!this.get('on')){
      return;
    }
    var refreshRate = this.get('refresh');
    this.clear();
    this.moveStars(3);
    this.drawStars();
    Em.run.later(this, this.loop, refreshRate);
  }

});
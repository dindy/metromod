var context = new (window.AudioContext || window.webkitAudioContext)(); // définition du contexte audio
// les navigateurs avec un moteur Webkit/blink demandent un préfixe

function OscillatorSample() {
  this.isPlaying = false;
  // Create some sweet sweet nodes.
  this.oscillator = context.createOscillator();
  this.analyser = context.createAnalyser();
}

OscillatorSample.prototype.play = function() {
  // Create some sweet sweet nodes.
  this.oscillator = context.createOscillator();
  this.analyser = context.createAnalyser();

  // Setup the graph.
  this.oscillator.connect(this.analyser);
  this.analyser.connect(context.destination);

  this.oscillator[this.oscillator.start ? 'start' : 'noteOn'](0);

};

OscillatorSample.prototype.stop = function(delay) {
  this.oscillator.stop(context.currentTime + delay);
};

OscillatorSample.prototype.toggle = function() {
  (this.isPlaying ? this.stop() : this.play());
  this.isPlaying = !this.isPlaying;

};

OscillatorSample.prototype.changeFrequency = function(val) {
  this.oscillator.frequency.value = val;
};

OscillatorSample.prototype.changeDetune = function(val) {
  this.oscillator.detune.value = val;
};

OscillatorSample.prototype.changeType = function(type) {
  this.oscillator.type = type;
};

// OscillatorSample.prototype.visualize = function() {
//   var times = new Uint8Array(this.analyser.frequencyBinCount);
//   this.analyser.getByteTimeDomainData(times);
//   for (var i = 0; i < times.length; i++) {
//     var value = times[i];
//     var percent = value / 256;
//     var height = this.HEIGHT * percent;
//     var offset = this.HEIGHT - height - 1;
//     var barWidth = this.WIDTH/times.length;
//   }
//   requestAnimFrame(this.visualize.bind(this));
// };

export default OscillatorSample
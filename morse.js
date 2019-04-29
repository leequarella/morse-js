import morseAlphabet from '@/constants/morse_alphabet'

const Morse = {
  wpm: 20,
  farnsworth: 12,
  frequency: 700,
  volumeSetting: 3,

  stop: function(){
    this.osc.stop();
  },

  createOscillator: function(){
    if(this.osc){ this.osc.stop(); }
    this.audioContext = new(window.AudioContext || window.webkitAudioContext)();
    this.osc = this.audioContext.createOscillator();
    this.vol = this.audioContext.createGain();
    this.osc.connect(this.vol);
    this.vol.connect(this.audioContext.destination);

    this.osc.type = 'sine';
    this.osc.frequency.value = this.frequency; // Hz
    this.vol.gain.value = 0;

    this.osc.start(0);
  },

  playCharacter: function(character, contextStartTime) {
    this.osc.frequency.value = this.frequency; // Hz
    let morse = morseAlphabet[character.toUpperCase()];
    let audioNow = contextStartTime || this.audioContext.currentTime;
    let compVolume = this.volumeSetting/10;
    for(let dadit of morse){
      switch(dadit){
        case '.': {
          this.vol.gain.setValueAtTime(compVolume, audioNow)
          audioNow += this.ditDuration();
          this.vol.gain.setValueAtTime(0, audioNow)
          break;
        }
        case '-': {
          this.vol.gain.setValueAtTime(compVolume, audioNow)
          audioNow += this.daDuration();
          this.vol.gain.setValueAtTime(0, audioNow)
          break;
        }
      }
      audioNow += this.ditDuration();
    }
    return audioNow;
  },

  playPhrase: function(phrase){
    this.createOscillator();
    phrase = phrase || this.input.phrase;
    let audioNow = this.audioContext.currentTime;
    for(let character of phrase){
      if(character == ' ') {
        audioNow += this.wordSpaceDuration();
      }
      else if(character != undefined) {
        audioNow = this.playCharacter(character, audioNow);
        audioNow += this.letterSpaceDuration();
      }
    }
  },

  ditDuration: function(){
    return 1.2/this.wpm;
  },

  daDuration: function(){
    return this.ditDuration() * 3;
  },

  letterSpaceDuration: function(){
    return (1.2/this.farnsworth) * 3;
  },

  wordSpaceDuration: function(){
    return (1.2/this.farnsworth) * 7;
  }
}

export default Morse;

const countDiv = document.getElementById("count");
const currentDiv = document.getElementById("current");
const nextBtn = document.getElementById("next");
const prevBtn = document.getElementById("prev");
const resetBtn = document.getElementById("reset");
const seedInp = document.getElementById("seed");
const setBtn = document.getElementById("setSeed");

class Moves {
  constructor() {
    const seed = inRange(Math.random(), 1, 10000);
    this.setSeed(seed);
    
    nextBtn.onclick = () => this.next();
    prevBtn.onclick = () => this.prev();
    resetBtn.onclick = () => this.reset();
    setBtn.onclick = () => {
      this.setSeed(seedInp.value);
      this.render();
    }
    
  }
  next() {
    if(this.current < this.count - 1)
      this.current++;
    this.render();
  }
  prev() {
    if(this.current > 0)
      this.current--;
    this.render();
  }
  reset() {
    this.current = 0;
    this.render();
  }
  
  setSeed(seed) {
    seedInp.value = seed;
    this.rndGen = mulberry32(seed);
    
    this.moves = []
    for(let num = 1; num <= 10; num++) {
      for (let move of ["pushes", "pulls", "raises", "squats"] ) {
        this.moves.push(`${num} ${move}`)
      }
    }
    for(let i = 0; i < this.moves.length - 1; i ++) {
      const j = inRange(this.rndGen(), i+1, this.moves.length - 1);
      const temp = this.moves[i];
      this.moves[i] = this.moves[j];
      this.moves[j] = temp;
    }
    this.count = this.moves.length;
    this.current = 0
  }
  
  render() {
    countDiv.innerHTML = `${this.current+1}/${this.count}`;
    currentDiv.innerHTML = this.moves[this.current];
  }
}


function mulberry32(a) {
    return function() {
      var t = a += 0x6D2B79F5;
      t = Math.imul(t ^ t >>> 15, t | 1);
      t ^= t + Math.imul(t ^ t >>> 7, t | 61);
      return ((t ^ t >>> 14) >>> 0) / 4294967296;
    }
}

function inRange(a, min, max) {
  return Math.floor(a * (max - min + 1)) + min; 
}

const moves = new Moves();
moves.render();
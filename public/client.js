const countDiv = document.getElementById("count");
const currentDiv = document.getElementById("current");
const nextBtn = document.getElementById("next");
const prevBtn = document.getElementById("prev");
const resetBtn = document.getElementById("reset");
const seedInp = document.getElementById("seed");
const setBtn = document.getElementById("setSeed");
const vidBg = document.getElementById("vidbg");

const gifs = {
  pushes: "/pushes.gif",
  pulls: "/pulls.gif",
  squats: "/squats.gif",
  raises: "/raises.gif"
};

const imgEls = {};
for (let move of Object.keys(gifs)) {
  const image = new Image();
  image.src = gifs[move];
  image.className = "bgVid";
  imgEls[move] = image;
}

class Moves {
  constructor() {
    const seed = inRange(Math.random(), 1, 10000);
    this.setSeed(seed);

    nextBtn.onclick = () => this.next();
    prevBtn.onclick = () => this.prev();
    resetBtn.onclick = () => this.reset();
    setBtn.onclick = () => {
      this.setSeed(parseInt(seedInp.value));
      this.render();
    };
  }
  next() {
    if (this.current < this.count - 1) this.current++;
    this.render();
  }
  prev() {
    if (this.current > 0) this.current--;
    this.render();
  }
  reset() {
    this.current = 0;
    this.render();
  }

  setSeed(seed) {
    seedInp.value = seed;
    this.rndGen = mulberry32(seed);

    this.moves = [];
    for (let num = 1; num <= 10; num++) {
      for (let move of ["pushes", "pulls", "raises", "squats"]) {
        this.moves.push([num, move]);
      }
    }
    for (let i = 0; i < this.moves.length - 1; i++) {
      const j = inRange(this.rndGen(), i + 1, this.moves.length - 1);
      const temp = this.moves[i];
      this.moves[i] = this.moves[j];
      this.moves[j] = temp;
    }
    this.moves.push("All done!");
    this.count = this.moves.length;
    this.current = 0;
  }

  render() {
    countDiv.innerHTML = `${this.current + 1}/${this.count}`;
    const [rep, move] = this.moves[this.current];
    currentDiv.innerHTML = `${rep} ${move}`;
    vidBg.innerHTML = "";
    vidBg.appendChild(imgEls[move]);
  }
}

function mulberry32(a) {
  return function() {
    var t = (a += 0x6d2b79f5);
    t = Math.imul(t ^ (t >>> 15), t | 1);
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

function inRange(a, min, max) {
  return Math.floor(a * (max - min + 1)) + min;
}

/* When the openFullscreen() function is executed, open the video in fullscreen.
Note that we must include prefixes for different browsers, as they don't support the requestFullscreen method yet */
function openFullscreen(elem) {
  if (elem.requestFullscreen) {
    elem.requestFullscreen();
  } else if (elem.mozRequestFullScreen) {
    /* Firefox */
    elem.mozRequestFullScreen();
  } else if (elem.webkitRequestFullscreen) {
    /* Chrome, Safari and Opera */
    elem.webkitRequestFullscreen();
  } else if (elem.msRequestFullscreen) {
    /* IE/Edge */
    elem.msRequestFullscreen();
  }
  screen.orientation.lock("portrait");
}

var mainContainer = document.getElementsByClassName("container")[0];
var fullscreenbtn = document.getElementById("fullscreen");
fullscreenbtn.onclick = () => {
  if (document.fullscreenElement) {
    document.exitFullscreen();
  } else openFullscreen(mainContainer);
};

document.addEventListener("fullscreenchange", function() {
  if (document.fullscreenElement) {
    bgVid.setAttribute("height", "auto");
    bgVid.setAttribute("width", "100%");
  } else {
    bgVid.setAttribute("height", "100%");
    bgVid.setAttribute("width", "auto");
  }
});

const moves = new Moves();
moves.render();

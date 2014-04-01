String.prototype.padLeft = function (num, ch) {
  var
    re = new RegExp(".{" + num + "}$"),
    pad = "";
  do {
    pad += ch;
  }while(pad.length < num);
  
  return re.exec(pad + this)[0];
};

(function (){

  var
    wrapper,
    visibleParts = 2,
    resetBtn,
    hourPart,
    minutePart,
    secondPart,
    milliPart,
    display,
    displayParts = [];
  
  /**
   * Chrono time class
   */
  function ChronoTime(){
    this.hours;
    this.minutes;
    this.seconds;
    this.millis;
    this.rawSeconds;
    this.rawMillis;
  }
  
  // 2 visible parts === 3, 3 === 5, 4 === 7
  function getFontSizeFactor(){
    return visibleParts + 2;
  }
  
  // 2 visible parts === 6, 3 === 8, 4 === 10
  function getFontSizeFactorForSmallPart(){
    return visibleParts + 4;
  }
  
  function formatTime(time){
    var 
      ms = Math.floor(time % 1000),
      s = Math.floor((time / 1000) % 60),
      m = Math.floor((time / 60000) % 60),
      h = Math.floor((time / 3600000) % 60),
      c = new ChronoTime();
    c.hours = h;
    c.minutes = String(m).padLeft(2,'0');
    c.seconds = String(s).padLeft(2,'0');
    c.millis = String(Math.floor(ms / 10)).padLeft(2,'0');
    c.rawMillis = ms;
    c.rawSeconds = s;
    return c;
  }
  
  function updateUI(time){
    var chronoTime = formatTime(time);
    milliPart.textContent = chronoTime.millis;
    secondPart.textContent = chronoTime.seconds;
    minutePart.textContent = chronoTime.minutes;
    hourPart.textContent = chronoTime.hours;
    if (time >= 60000){
      if (visibleParts === 2){
        visibleParts = 3;
        minutePart.style.display = 'inline-block';
        setFontSize();
        displayParts.forEach(function (d){
          d.style.width = '28%';
        });
      }
      if (visibleParts === 3 && time >= 3600000){
        visibleParts = 4;
        hourPart.style.display = 'inline-block';
        setFontSize();
        displayParts.forEach(function (d){
          d.style.width = '23%'
        });
      }
    }
    DrawFactory.drawProgressiveCircle(chronoTime.rawSeconds, chronoTime.rawMillis);
  }

  function resetParts(){
    visibleParts = 2;
    minutePart.style.display = 'none';
    hourPart.style.display = 'none';
    displayParts.forEach(function (d){
      d.style.width = '35%';
    });
  }
    
  function setFontSize(){
    var largeSize = (wrapper.offsetWidth / getFontSizeFactor()) + 'px';
    var smallSize = (wrapper.offsetWidth / getFontSizeFactorForSmallPart()) + 'px';
    hourPart.style.fontSize = largeSize;
    minutePart.style.fontSize = largeSize;
    secondPart.style.fontSize = largeSize;
    milliPart.style.fontSize = smallSize;
    var displayHeight = display.offsetHeight;
    displayParts.forEach(function (d){
      d.style.height = displayHeight + 'px';
      d.style.lineHeight = displayHeight + 'px';
    });
  }

  function makeWrapperSquare(){
    wrapper.style.width = '90%';
    wrapper.style.height = '90%';
    if (wrapper.offsetWidth > wrapper.offsetHeight){
      wrapper.style.width = wrapper.offsetHeight + 'px';
    } else if (wrapper.offsetWidth < wrapper.offsetHeight){
      wrapper.style.height = wrapper.offsetWidth + 'px';
    }
  }
  
  function setButtonSize(){
    if (document.body.offsetHeight > document.body.offsetWidth){
      resetBtn.style.width = resetBtn.style.height = document.body.offsetWidth * 0.2;
    } else {
      resetBtn.style.width = resetBtn.style.height = document.body.offsetHeight * 0.2;
    }
    resetBtn.style.top = wrapper.offsetHeight * .85;
    resetBtn.style.left = wrapper.offsetWidth * .80 + wrapper.getBoundingClientRect().left;
    resetBtn.style.borderWidth = resetBtn.style.width / 2 * 0.2;
  }

  function setActionCaption(text){
    command.innerHTML = 'Push to <b>' + text + '</b>';
  }

  window.addEventListener('resize', function (){
    makeWrapperSquare();
    setFontSize();
    DrawFactory.refresh();
    setButtonSize();
  }, false);
  
  window.addEventListener('DOMContentLoaded', function (){
    
    display = document.getElementById('display');
    hourPart = document.getElementById('hour-part');
    secondPart = document.getElementById('second-part');
    minutePart = document.getElementById('minute-part');
    milliPart = document.getElementById('mili-part');
    displayParts.push(hourPart, secondPart, minutePart, milliPart);
    wrapper = document.getElementById('stopwatch-wrapper');
    command = document.getElementById('command');
    resetBtn = document.getElementById('reset');

    makeWrapperSquare();
    setFontSize();
    setButtonSize();

    DrawFactory.init();
    DrawFactory.drawStaticCircle();
    
    document.body.addEventListener('click', function (e){
      if (e.target.id === 'reset'){
        return;
      }
      if (Chrono.started){
        Chrono.stop();
        setActionCaption('start');
      }else{
        Chrono.start(updateUI);
        setActionCaption('stop');
      }
    }, false);
    
    document.getElementById('reset').addEventListener('click', function (e){
      e.preventDefault();
      Chrono.reset(updateUI);
      resetParts();
      setFontSize();
      setActionCaption('start');
    });
  }, false);

}());

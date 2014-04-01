var Chrono = (function (){
  
  var started = false, startingTime, stoppingTime = 0, clockInterval;
  return {
    start: function (updateCallback){
      started = true;
      startingTime = stoppingTime > 0 
        ? startingTime + (new Date().getTime() - stoppingTime)
        : new Date().getTime();
      
      clockInterval = setInterval(function (){
        updateCallback(new Date().getTime() - startingTime);
      },10);
    },
    
    stop: function (){
      started = false;
      stoppingTime = new Date().getTime();
      clearInterval(clockInterval);
    },
    
    reset: function (updateCallback){
      started = false;
      stoppingTime = 0;
      clearInterval(clockInterval);
      updateCallback(0);
    },
    
    get started(){
      return started;
    }
  };
}());
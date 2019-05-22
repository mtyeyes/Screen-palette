if ('serviceWorker' in navigator) {
  window.addEventListener('load', () => {
    navigator.serviceWorker.register('service-worker.js')
    .then(registration => {
      console.log('Service Worker is registered', registration);
    })
    .catch(err => {
      console.error('Registration failed:', err);
    });
  });
};

let touchStartX;
let touchStartY;
let touchEndX;
let touchEndY;

function getColor () {
  let hslColor = window.getComputedStyle(document.documentElement).getPropertyValue('--screen-light');
  let hslArr = hslColor.split(',');
  hslArr[0] = hslArr[0].replace('hsl(', '');
  hslArr[1] = hslArr[1].replace('%', '');
  hslArr[2] = hslArr[2].replace('%)', '');
  return hslArr;
}


function setHue (changeHue) {
  hslArr = getColor ();
  if ((+hslArr[0] + +changeHue) > 360) {
    desiredColor = 'hsl(' + (+hslArr[0] + +changeHue - 360) + ',' + hslArr[1] + '%,' + hslArr[2] + '%)';
  } else if ((+hslArr[0] + +changeHue) < 0) {
    desiredColor = 'hsl(' + (+hslArr[0] + +changeHue + 360) + ',' + hslArr[1] + '%,' + hslArr[2] + '%)';
  } else {
  desiredColor = 'hsl(' + (+hslArr[0] + +changeHue) + ',' + hslArr[1] + '%,' + hslArr[2] + '%)';
  }
  document.documentElement.style.setProperty('--screen-light', desiredColor);
}

function setSaturation (changeSaturation) {
  hslArr = getColor ();
  if (((+hslArr[1] + +changeSaturation) > 100) || ((+hslArr[1] + +changeSaturation) < 0)) { return };
  desiredColor = 'hsl(' + hslArr[0] + ',' + (+hslArr[1] + +changeSaturation) + '%,' + hslArr[2] + '%)';
  document.documentElement.style.setProperty('--screen-light', desiredColor);
}

function setLightness (changeLightness) {
  hslArr = getColor ();
  if (((+hslArr[2] + +changeLightness) > 100) || ((+hslArr[2] + +changeLightness) < 0)) { return };
  desiredColor = 'hsl(' + hslArr[0] + ',' + hslArr[1] + '%,' + (+hslArr[2] + +changeLightness) +'%)';
  document.documentElement.style.setProperty('--screen-light', desiredColor);
}

function swipe () {
  let XOffset = touchEndX - touchStartX;
  let YOffset = touchEndY - touchStartY;
  if ((Math.abs(XOffset) < 100) && (Math.abs(YOffset) < 100)) { return };
  if ((Math.abs(XOffset)) > (Math.abs(YOffset))) {
      if (XOffset > 0) {
          setHue (30);
      } else {
          setHue (-30);
      }
  } else {
      if (YOffset > 0) {
          setLightness (10);
      } else {
          setLightness (-10);
      }
  }
}

document.addEventListener('keydown', function(event) {
  if (event.code == 'ArrowRight') {
      setHue (30);
  } else if (event.code == 'ArrowLeft') {
      setHue (-30);
  } else if (event.code == 'KeyZ') {
      setSaturation (10);
  } else if (event.code == 'KeyX') {
      setSaturation (-10);
  } else if (event.code == 'ArrowUp') {
      setLightness (10);
  } else if (event.code == 'ArrowDown') {
      setLightness (-10);
  }
});

document.addEventListener ('touchstart', function (event) {
  touchStartX = event.changedTouches[0].screenX;
  touchStartY = event.changedTouches[0].screenY;
});

document.addEventListener ('touchend', function (event) {
  touchEndX = event.changedTouches[0].screenX;
  touchEndY = event.changedTouches[0].screenY;
  swipe ();
});

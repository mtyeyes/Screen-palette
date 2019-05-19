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

let hue;
let saturation;
let lightness;
let touchStartX;
let touchStartY;
let touchEndX;
let touchEndY;

function getColor () {
    let lightColor = window.getComputedStyle(document.documentElement).getPropertyValue('--screen-light');
    let lightColorArr = lightColor.split(',');
    hue = lightColorArr[0].replace('hsl(', '');
    saturation = lightColorArr[1].replace('%', '');
    lightness = lightColorArr[2].replace('%)', '');
}


function setHue (changeHue) {
    getColor ();
    desiredColor = 'hsl(' + (+hue + +changeHue) + ',' + saturation + '%,' + lightness + '%)';
    document.documentElement.style.setProperty('--screen-light', desiredColor);
}

function setSaturation (changeSaturation) {
    getColor ();
    desiredColor = 'hsl(' + hue + ',' + (+saturation + +changeSaturation) + '%,' + lightness + '%)';
    document.documentElement.style.setProperty('--screen-light', desiredColor);
}

function setLightness (changeLightness) {
    getColor ();
    desiredColor = 'hsl(' + hue + ',' + saturation + '%,' + (+lightness + +changeLightness) +'%)';
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
        if (YOffset < 0) {
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
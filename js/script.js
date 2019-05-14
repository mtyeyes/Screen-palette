let hue;
let saturation;
let lightness;

function getVar () {
    let lightColor = window.getComputedStyle(document.documentElement).getPropertyValue('--screen-light');
    let lightColorArr = lightColor.split(',');
    hue = lightColorArr[0].replace('hsl(', '');
    saturation = lightColorArr[1].replace('%', '');
    lightness = lightColorArr[2].replace('%)', '');
}


function setColor (changeHue) {
    desiredColor = 'hsl(' + (+hue + +changeHue) + ',' + saturation + '%,' + lightness + '%)';
    document.documentElement.style.setProperty('--screen-light', desiredColor);
}

function setSaturation (changeSaturation) {
    desiredColor = 'hsl(' + hue + ',' + (+saturation + +changeSaturation) + '%,' + lightness + '%)';
    document.documentElement.style.setProperty('--screen-light', desiredColor);
}

function setLightness (changeLightness) {
    desiredColor = 'hsl(' + hue + ',' + saturation + '%,' + (+lightness + +changeLightness) +'%)';
    document.documentElement.style.setProperty('--screen-light', desiredColor);
}

document.addEventListener('keydown', function(event) {
    if (event.code == 'ArrowRight') {
        getVar ();
        setColor (30);
    } else if (event.code == 'ArrowLeft') {
        getVar ();
        setColor (-30);
    } else if (event.code == 'KeyZ') {
        getVar ();
        setSaturation (10);
    } else if (event.code == 'KeyX') {
        getVar ();
        setSaturation (-10);
    } else if (event.code == 'ArrowUp') {
        getVar ();
        setLightness (10);
    } else if (event.code == 'ArrowDown') {
        getVar ();
        setLightness (-10);
    }
  });
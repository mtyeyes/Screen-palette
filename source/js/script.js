if ('serviceWorker' in navigator) {
  window.addEventListener('load', () => {
    navigator.serviceWorker.register('service-worker.js')
    .catch(err => {
      alert('There has been a problem with Service Worker registration. This application may require internet connection to function properly.');
    });
  });
};

const helpBtn = document.querySelector('.help__btn');
const helpContainer = document.querySelector('.help__container');
const paletteBtn = document.querySelector('.palette__btn');
const paletteContainer = document.querySelector('.palette__container');
const sliders = document.querySelectorAll('.palette__slider')
const favoriteColorContainers = document.querySelectorAll('.palette__favorite-color')
let touchStartX;
let touchStartY;
let touchEndX;
let touchEndY;
let chosenFavoriteColor;
let btnHold;
let isLongPress;

hslNotationToValues = (str) => {
    hslArr = str.split(',');
    const hslValues = {
      hue: +(hslArr[0].replace('hsl(', '')),
      saturation: +(hslArr[1].replace('%', '')),
      lightness: +(hslArr[2].replace('%)', '')),
    };
    return hslValues;
}

hslValuesToNotation = (hue, saturation, lightness) => {
  return `hsl(${hue},${saturation}%,${lightness}%)`
};

getCustomProperty = (propertyName) => {
  return window.getComputedStyle(document.documentElement).getPropertyValue(propertyName);
};

setCustomProperty = (propertyName, value) => {
  document.documentElement.style.setProperty(propertyName, value);
};

adjustColors = (hue, saturation, lightness) => {
  setCustomProperty('--screen-light', hslValuesToNotation(hue, saturation, lightness));
  localStorage.setItem('--screen-light', hslValuesToNotation(hue, saturation, lightness));
  setCustomProperty('--hue-value', hslValuesToNotation(hue, 100, 60));
  setCustomProperty('--lightness-value', hslValuesToNotation(0, 0, lightness));
  setCustomProperty('--saturation-value', hslValuesToNotation(hue, saturation, 60));
  if (lightness <= 30) {setCustomProperty('--secondary-color', hslValuesToNotation(0, 0, 73))} else {setCustomProperty('--secondary-color', hslValuesToNotation(44, 10, 13))};
  synchronizeSliders(hue, saturation, lightness);
}

synchronizeSliders = (hue, saturation, lightness) => {
  sliders[0].value = hue;
  sliders[1].value = saturation;
  sliders[2].value = lightness;
};

changeHue = (difference) => {
  let {hue, saturation, lightness} = hslNotationToValues(getCustomProperty('--screen-light'));
  if ((hue + difference) > 360) {
    hue = hue + difference - 360;
  } else if ((hue + difference) < 0) {
    hue = hue + difference + 360;
  } else {
    hue = hue + difference;
  };
  adjustColors(hue, saturation, lightness);
};

changeLightness = (difference) => {
  let {hue, saturation, lightness} = hslNotationToValues(getCustomProperty('--screen-light'));
  if (((lightness + difference) > 100) || ((lightness + difference) < 0)) {
    return
  } else {
    lightness = lightness + difference;
  };
  adjustColors(hue, saturation, lightness);
};

adjustColorsBySlider = () => {
  const [hue, saturation, lightness] = [sliders[0].value, sliders[1].value, sliders[2].value]
  adjustColors(hue, saturation, lightness);
  if (chosenFavoriteColor) {
    setCustomProperty(chosenFavoriteColor, hslValuesToNotation(hue, saturation, lightness));
    localStorage.setItem(chosenFavoriteColor, hslValuesToNotation(hue, saturation, lightness));
  };
};

selectFavoriteColor = (element) => {
  const favoriteColorNumber = element.dataset.propertyName;
  const {hue, saturation, lightness} = hslNotationToValues(getCustomProperty(favoriteColorNumber));
  adjustColors(hue, saturation, lightness);
  chosenFavoriteColor = favoriteColorNumber;
}

toggleHelp = () => {
  paletteContainer.classList.remove('palette__container--show');
  helpContainer.classList.toggle('help__container--show');
  chosenFavoriteColor = null;
};

togglePalette = () => {
  helpContainer.classList.remove('help__container--show');
  paletteContainer.classList.toggle('palette__container--show');
  chosenFavoriteColor = null;
}

changeBtnsVisibility = () => {
  document.querySelector('.help__icon').classList.toggle('help__icon--hide');
  document.querySelector('.palette__icon').classList.toggle('palette__icon--hide');
  if (document.querySelector('.help__icon').classList.contains('help__icon--hide')) {
    localStorage.setItem('hide-btns', true);
  } else {
    localStorage.removeItem('hide-btns');
  }
  isLongPress = true;
};

btnReleased = (element) => {
  clearTimeout(btnHold);
  if (!isLongPress) {
    if (element === helpBtn) {
      toggleHelp();
    } else {
      togglePalette();
    }
  };
};

touchEnded = () => {
  clearTimeout(btnHold);
}

document.addEventListener('keydown', function(event) {
  switch (event.code) {
    case 'ArrowRight':
      changeHue(30);
      break;
    case 'ArrowLeft':
      changeHue (-30);
      break;
    case 'ArrowUp':
      changeLightness (10);
      break;
    case 'ArrowDown':
      changeLightness (-10);
      break;
  }
});

swipe = () => {
  if (paletteContainer.classList.contains('palette__container--show')) { return };
  let XOffset = touchEndX - touchStartX;
  let YOffset = touchEndY - touchStartY;
  if ((Math.abs(XOffset) < 80) && (Math.abs(YOffset) < 80)) { return };
  if ((Math.abs(XOffset)) > (Math.abs(YOffset))) {
      if (XOffset > 0) {
          changeHue(30);
      } else {
          changeHue(-30);
      }
  } else {
      if (YOffset > 0) {
          changeLightness(10);
      } else {
          changeLightness(-10);
      }
  }
};

document.addEventListener('touchstart', function(event) {
  touchStartX = event.changedTouches[0].screenX;
  touchStartY = event.changedTouches[0].screenY;
});

document.addEventListener('touchend', function(event) {
  touchEndX = event.changedTouches[0].screenX;
  touchEndY = event.changedTouches[0].screenY;
  swipe();
});

document.querySelector('.palette__container').addEventListener('touchstart', function(event){
  event.stopPropagation();
});

document.querySelector('.palette__container').addEventListener('touchend', function(event){
  event.stopPropagation();
});

helpBtn.addEventListener('touchstart', function(event) {
  isLongPress = false;
  btnHold = setTimeout(changeBtnsVisibility, 1300);
});

helpBtn.addEventListener('touchend', function(event) {
  touchEnded();
});

helpBtn.addEventListener('mousedown', function(event) {
  isLongPress = false;
  btnHold = setTimeout(changeBtnsVisibility, 1300);
});

helpBtn.addEventListener('mouseup', function(event) {
  btnReleased(event.currentTarget);
});

paletteBtn.addEventListener('touchstart', function(event) {
  isLongPress = false;
  btnHold = setTimeout(changeBtnsVisibility, 1300);
});

paletteBtn.addEventListener('touchend', function(event) {
  touchEnded();
});

paletteBtn.addEventListener('mousedown', function(event) {
  isLongPress = false;
  btnHold = setTimeout(changeBtnsVisibility, 1300);
});

paletteBtn.addEventListener('mouseup', function(event) {
  btnReleased(event.currentTarget);
});

document.addEventListener('mouseup', function(event) {
  clearTimeout(btnHold);
});

for (let element of sliders) {
  element.addEventListener('input', function(event) {
    adjustColorsBySlider();
  });
};

for (let element of favoriteColorContainers) {
  element.addEventListener('click', function(event) {
    selectFavoriteColor(event.target)
  });
};

( function() {
  if (localStorage.getItem('--screen-light')) {
    let {hue, saturation, lightness} = hslNotationToValues(localStorage.getItem('--screen-light'));
    adjustColors(hue, saturation, lightness);
  };
  if (localStorage.getItem('hide-btns')) {
    document.querySelector('.help__icon').classList.add('help__icon--hide');
    document.querySelector('.palette__icon').classList.add('palette__icon--hide');
  };
  for (let element of favoriteColorContainers) {
    if (localStorage.getItem(element.dataset.propertyName)) {
      setCustomProperty(element.dataset.propertyName, localStorage.getItem(element.dataset.propertyName));
    };
  };
}());

if ('serviceWorker' in navigator) {
  window.addEventListener('load', () => {
    navigator.serviceWorker.register('service-worker.js')
    .catch(err => {
      alert('There has been a problem with Service Worker registration. This application may require internet connection to function properly.');
    });
  });
};

let touchStartX;
let touchStartY;
let touchEndX;
let touchEndY;
let helpBtn = document.querySelector('.help__btn');
let helpContainer = document.querySelector('.help__container');
let paletteBtn = document.querySelector('.palette__btn');
let paletteContainer = document.querySelector('.palette__container');
let sliders = document.querySelectorAll('.palette__slider')
let chosenFavoriteColor;
let favoriteColorContainers = document.querySelectorAll('.palette__favorite-color')
let btnHold;
let isLongPress;

hslStringToArr = (str) => {
  hslArr = str.split(',');
  hslArr[0] = +(hslArr[0].replace('hsl(', ''));
  hslArr[1] = +(hslArr[1].replace('%', ''));
  hslArr[2] = +(hslArr[2].replace('%)', ''));
  return hslArr;
};

hslArrToString = (arr) => {
  return 'hsl(' + arr[0] + ',' + arr[1] + '%,' + arr[2] + '%)';
};

getCustomProperty = (propertyName) => {
  return window.getComputedStyle(document.documentElement).getPropertyValue(propertyName);
};

setCustomProperty = (propertyName, value) => {
  document.documentElement.style.setProperty(propertyName, value);
};

setScreenColor = (str, lightness) => {
  setCustomProperty('--screen-light', str);
  localStorage.setItem('--screen-light', str);
  if (typeof lightness === "undefined") {let lightness = str.slice((str.lastIndexOf(",") + 1)).replace('%)', '')};
  if (lightness <= 30) {
    setCustomProperty('--secondary-color', 'hsl(0, 0%, 73%)');
    localStorage.setItem('--secondary-color', 'hsl(0, 0%, 73%)');
  } else {
    setCustomProperty('--secondary-color', 'hsl(44, 10%, 13%)');
    localStorage.setItem('--secondary-color', 'hsl(44, 10%, 13%)');
  };
};

synchronizeSliders = (hslArr) => {
  sliders[0].value = hslArr[0];
  sliders[1].value = hslArr[1];
  sliders[2].value = hslArr[2];
};

changeHue = (difference) => {
  hslArr = hslStringToArr(getCustomProperty('--screen-light'));
  if ((hslArr[0] + difference) > 360) {
    hslArr[0] = hslArr[0] + difference - 360;
  } else if ((hslArr[0] + difference) < 0) {
    hslArr[0] = hslArr[0] + difference + 360;
  } else {
    hslArr[0] = hslArr[0] + difference;
  }
  resultedColor = hslArrToString(hslArr);
  setScreenColor(resultedColor, hslArr[2]);
  synchronizeSliders(hslArr);
};

changeLightness = (difference) => {
  hslArr = hslStringToArr(getCustomProperty('--screen-light'));
  if (((hslArr[2] + difference) > 100) || ((hslArr[2] + difference) < 0)) {
    return
  } else {
    hslArr[2] = hslArr[2] + difference;
  };
  resultedColor = hslArrToString(hslArr);
  setScreenColor(resultedColor, hslArr[2]);
  synchronizeSliders(hslArr);
};

adjustColorsBySlider = () => {
  let hslArr = [];
  hslArr[0] = sliders[0].value;
  hslArr[1] = sliders[1].value;
  hslArr[2] = sliders[2].value;
  resultedColor = hslArrToString(hslArr);
  setScreenColor(resultedColor, hslArr[2]);
  if (chosenFavoriteColor) {
    setCustomProperty(chosenFavoriteColor, resultedColor)
    localStorage.setItem(chosenFavoriteColor, resultedColor);
  };
};

selectFavoriteColor = (element) => {
  let hslString = getCustomProperty(element.dataset.propertyName);
  let hslArr = hslStringToArr(hslString);
  setScreenColor(hslString, hslArr[2]);
  synchronizeSliders(hslArr);
  chosenFavoriteColor = element.dataset.propertyName;
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
    setCustomProperty('--screen-light', localStorage.getItem('--screen-light'));
    setCustomProperty('--secondary-color', localStorage.getItem('--secondary-color'));
    let hslArr = hslStringToArr(localStorage.getItem('--screen-light'));
    synchronizeSliders(hslArr);
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

'use strict';

(function () {
  let range = document.querySelector('.search__container');
  let rangeFilter = range.querySelector('.search__range-filter');
  let rangeFillLine = rangeFilter.querySelector('.search__range-fill-line');
  let buttonRight = rangeFilter.querySelector('.search__range-button--right');
  let buttonLeft = rangeFilter.querySelector('.search__range-button--left');
  buttonRight.style.right = 0;
  buttonLeft.style.left = 0;
  rangeFillLine.style.left = 0;
  rangeFillLine.style.right = 0;

  let makeDraggable = function (element, getBounds, moveCallback) {
    element.addEventListener('mousedown', function (evt) {
      evt.preventDefault();

      let startPointerCoordinates = {
        x: evt.clientX
      };

      let startElementCoordinates = {
        x: element.offsetLeft
      };

      let mouseMoveHandler = function (moveEvt) {
        moveEvt.preventDefault();

        let shift = {
          x: startPointerCoordinates.x - moveEvt.clientX
        };
        element.style.left = (startElementCoordinates.x - shift.x) + 'px';
        getBounds();
        moveCallback();

      };

      let mouseUpHandler = function (upEvt) {
        upEvt.preventDefault();
        document.removeEventListener('mousemove', mouseMoveHandler);
        document.removeEventListener('mouseup', mouseUpHandler);
      };
      document.addEventListener('mousemove', mouseMoveHandler);
      document.addEventListener('mouseup', mouseUpHandler);
    });
  };

  let changeRangeFillLine = function () {
    let coordinatesDifference = buttonRight.getBoundingClientRect().left - buttonLeft.getBoundingClientRect().left;
    rangeFillLine.style.width = (coordinatesDifference) + 'px';
    rangeFillLine.style.left = (buttonLeft.offsetLeft) + 'px';
  };

  let getSliderBoundMaximum = function () {
    let buttonRightCoordinates = buttonRight.getBoundingClientRect();
    let buttonLeftCoordinates = buttonLeft.getBoundingClientRect();
    let rangeFillLineCoordinates = rangeFilter.getBoundingClientRect();
    let rangeFillLineLeftCoordinates = rangeFillLineCoordinates.left;
    let rangeFillLineRightCoordinates = rangeFillLineCoordinates.right - buttonRight.offsetWidth;
    let differenceFillLineCoordinates = (rangeFillLineRightCoordinates - rangeFillLineLeftCoordinates);

    if (buttonRightCoordinates.left > rangeFillLineRightCoordinates) {
      buttonRight.style.left = (differenceFillLineCoordinates) + 'px';
    } else if (buttonRightCoordinates.left < buttonLeftCoordinates.left + buttonRight.offsetWidth) {
      buttonRight.style.left = +(buttonLeft.style.left.substr(0, buttonLeft.style.left.length - 2)) + 84 + 'px';
    }
  };

  let getSliderBoundMinimum = function () {
    let buttonRightCoordinates = buttonRight.getBoundingClientRect();
    let buttonLeftCoordinates = buttonLeft.getBoundingClientRect();
    let rangeFillLineCoordinates = rangeFilter.getBoundingClientRect();
    let rangeFillLineLeftCoordinates = rangeFillLineCoordinates.left;

    if (buttonLeftCoordinates.left < rangeFillLineLeftCoordinates) {
      buttonLeft.style.left = 0;
    } else if (buttonLeftCoordinates.left > buttonRightCoordinates.left - buttonRight.offsetWidth) {
      buttonLeft.style.left = +(buttonRight.style.left.substr(0, buttonRight.style.left.length - 2)) - 84 + 'px';
    }
    console.log(buttonRight.style.left);
  };

  let updateMaximumPrice = function () {
    if (window.slider.updateMaximumPriceHandler) {
      window.slider.updateMaximumPriceHandler(price);
    }
    changeRangeFillLine();
  };

  let updateMinimumPrice = function () {
    if (window.slider.updateMinimumPriceHandler) {
      window.slider.updateMinimumPriceHandler(price);
    }
    changeRangeFillLine();
  };

  makeDraggable(buttonRight, getSliderBoundMaximum, updateMaximumPrice);
  makeDraggable(buttonLeft, getSliderBoundMinimum, updateMinimumPrice);

  window.slider = {
    updateMinimumPriceHandler: null,
    updateMaximumPriceHandler: null,
  };
})();
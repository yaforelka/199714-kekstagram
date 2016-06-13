'use strict';
/*function queryJSONP(url, callback) {
  window.__picturesLoadCallback = function(data) {
    callback(data);
  };
  var script = document.createElement('script');
  script.setAttribute('src', url);
  document.body.appendChild(script);
}*/

(function() {
  var filterContainer = document.querySelector('.filters');
  filterContainer.classList.add('hidden');

  var pictureContainer = document.querySelector('.pictures');
  var templateElement = document.querySelector('template');
  var elementToClone;

  if ('content' in templateElement) {
    elementToClone = templateElement.content.querySelector('.picture');
  } else {
    elementToClone = templateElement.querySelector('.picture');
  }

  var pictures = [];

  var Filter = {
    'ALL': 'popular',
    'DATE': 'new',
    'COMMENTS': 'discussed'
  };

  var getPictureElement = function(data, container) {
    var element = elementToClone.cloneNode(true);
    element.querySelector('.picture-comments').textContent = data.comments;
    element.querySelector('.picture-likes').textContent = data.likes;

    var elementImage = element.querySelector('img');
    var elementPhoto = new Image();

    element.replaceChild(elementPhoto, elementImage);
    container.appendChild(element);

    elementPhoto.onload = function(evt) {
      elementPhoto.setAttribute('src', evt.target.src);
      elementPhoto.setAttribute('width', '182');
      elementPhoto.setAttribute('height', '182');
    };

    elementPhoto.onerror = function() {
      element.classList.add('picture-load-failure');
    };

    elementPhoto.src = data.url;
    return element;
  };

  var renderPictures = function(loadedPictures) {
    pictureContainer.innerHTML = '';
    loadedPictures.forEach(function(picture) {
      getPictureElement(picture, pictureContainer);
    });
  };

  var getPictures = function(callback) {
    pictureContainer.classList.add('pictures-loading');
    var xhr = new XMLHttpRequest();

    xhr.onload = function(evt) {
      var loadedData = JSON.parse(evt.target.response);
      callback(loadedData);
    };

    xhr.timeout = 5000;
    xhr.ontimeout = function() {
      pictureContainer.classList.add('pictures-failure');
    };

    xhr.onerror = function() {
      pictureContainer.classList.add('pictures-failure');
    };

    xhr.onreadystatechange = function() {
      if (xhr.readyState === 4) {
        pictureContainer.classList.remove('pictures-loading');
      }
    };

    xhr.open('GET', '//o0.github.io/assets/json/pictures.json', true);
    xhr.send();
  };

  getPictures(function(loadedPictures) {
    pictures = loadedPictures;
    renderPictures(pictures);
  });

  filterContainer.classList.remove('hidden');

  filterContainer.onchange = function() {
    if (pictureContainer.classList.contains('.pictures-not-found')) {
      pictureContainer.classList.remove('.pictures-not-found');
    }
    var getFilteredPictures = function(loadedPictures, filter) {
      var picturesToFilter = loadedPictures.slice(0);

      switch (filter) {
        case Filter.ALL:
          picturesToFilter.map(function(picture) {
            return picture;
          });
          break;

        case Filter.DATE:
          var filteredPhoto = picturesToFilter.filter(function(picture) {
            return ((Date.now() - Date.parse(picture.date)) / 24 / 60 / 60 / 1000) <= 4 &&
            ((Date.now() - Date.parse(picture.date)) / 24 / 60 / 60 / 1000) > 0;
          });
          picturesToFilter = filteredPhoto.sort(function(a, b) {
            return Date.parse(b.date) - Date.parse(a.date);
          });
          break;

        case Filter.COMMENTS:
          picturesToFilter.sort(function(a, b) {
            return b.comments - a.comments;
          });
          break;
      }
      if (picturesToFilter.length === 0) {
        pictureContainer.classList.add('.pictures-not-found');
      }
      console.log(picturesToFilter.length);
      return picturesToFilter;
    };

    var currentFilter = [].filter.call(filterContainer['filter'], function(item) {
      return item.checked;
    })[0].value;

    switch(currentFilter) {
      case 'popular':
        var popularPictures = getFilteredPictures(pictures, 'popular');
        renderPictures(popularPictures);
        break;

      case 'new':
        var newPictures = getFilteredPictures(pictures, 'new');
        renderPictures(newPictures);
        break;

      case 'discussed':
        var discussedPictures = getFilteredPictures(pictures, 'discussed');
        renderPictures(discussedPictures);
        break;
    }
  };
})();

function fetchJSONFile(path, callback) {
    let httpRequest = new XMLHttpRequest();
    httpRequest.onreadystatechange = function() {
        if (httpRequest.readyState === 4) {
            if (httpRequest.status === 200 || httpRequest.status === 0) {
                if (callback) callback(httpRequest.responseText);
            }
        }
    };
    httpRequest.open('GET', path);
    httpRequest.send();
}



let cardData;
fetchJSONFile('cards/text.json', function(data) {
    cardData = JSON.parse(data);
    console.log(cardData);
});

let header = document.querySelector("header");
let galleryContainer = document.querySelector(".gallery-container");
let gallery = document.querySelector(".gallery");
let cardContainer = document.querySelector(".card-container");
let cardContainerBackground = galleryContainer.querySelector('.card-container-background');
let card = cardContainer.querySelector('.card');
let cardTop = cardContainer.querySelector('.top');

let images = [];
let thumbnails = document.querySelector(".thumbnails");
for (let i = 0; i < 18; i++) {
    let image = new Image();
    image.src = 'cards/images/' + i + '.png';
    image.id = i;
    // console.log(cardData.descriptions[i].title);
    // image.alt = cardData.descriptions[i].title;
    image.classList.add('thumbnail');
    images.push(image);
    thumbnails.appendChild(image);
    image.addEventListener('click', displayCard);
}

window.addEventListener("resize", toggleScroll);

let dX = gallery.offsetWidth - galleryContainer.offsetWidth;
let dY = gallery.offsetHeight - galleryContainer.offsetHeight;
let eX = dX / galleryContainer.offsetWidth;
let eY = dY / galleryContainer.offsetHeight;

let waitToggleScroll = false;
function toggleScroll(event) {
    dX = gallery.offsetWidth - galleryContainer.offsetWidth;
    dY = gallery.offsetHeight - galleryContainer.offsetHeight;
    eX = dX / galleryContainer.offsetWidth;
    eY = dY / galleryContainer.offsetHeight;
    if (!waitToggleScroll) {
        if(window.innerWidth > 1200 && screen.width > 1200) {
            galleryContainer.addEventListener("mousemove", moveGalleryT, true);
        } else {
            galleryContainer.removeEventListener("mousemove", moveGalleryT, true);
        }
        waitToggleScroll = true;
        setTimeout(function() {
            waitToggleScroll = false;
        }, 100);
    }
}

toggleScroll();

cardContainer.querySelector('.exit-background').addEventListener('click', hideCard);
cardContainer.querySelector('.card-background').addEventListener('click', hideCard);
cardContainer.querySelector('.arrows-background').addEventListener('click', hideCard);
cardContainer.querySelector('.rotate-background').addEventListener('click', hideCard);
//cardContainer.querySelector('.close').addEventListener('click', hideCard);




let waitMoveGallery = false;
function moveGalleryT(event) {
    if (!waitMoveGallery) {
        //console.count("Throttled");
        let x = -(event.clientX - galleryContainer.offsetLeft) * eX;
        let y = -(event.clientY - galleryContainer.offsetTop) * eY;
        x -= gallery.offsetLeft;
        y -= gallery.offsetTop;
        gallery.style.transform = 'translateX(' + x + 'px' + ') ' + 'translateY(' + y + 'px' + ')';
        waitMoveGallery = true;
        setTimeout(function() {
            waitMoveGallery = false;
        }, 60);
    }
}

let cX = galleryContainer.clientWidth / 2;
let cY = galleryContainer.clientHeight / 2;

let waitMoveCard = false;
function moveCardT(event) {
    if (!waitMoveCard) {
        //console.count("Throttled");
        let x;
        let y;
        x = (event.clientX - cX) / 80;
        y = (event.clientY - cY) / 70;
        cardContainer.querySelector('.animation-container').style.transform = 'rotateX(' +
            -y + 'deg) rotateY(' + x + 'deg)';
        waitMoveCard = true;
        setTimeout(function() {
            waitMoveCard = false;
        }, 40);
    }
}

let displayedCardIndex;

function displayCard(e) {
    gallery.style.filter = 'blur(20px) saturate(0.6) brightness(1) contrast(1)';
    header.style.display = 'none';
    cardContainerBackground.style.display = 'block';
    displayedCardIndex = parseInt(e.target.id);
    setCard();
    cardContainer.style.display = 'inline-block';

    document.addEventListener('wheel', wheel);
    if (window.innerWidth > 1200 && screen.width > 1200) {
        //document.addEventListener('mousemove', moveCard);
        document.addEventListener('mousemove', function() {
            //moveCard(event);
            moveCardT(event);
        });
    }
    //card.style.opacity = '1';
    setTimeout(function() {
        cardContainer.style.opacity = '1';
        cardContainer.style.transform = 'scale(1) translateY(0%)';
    }, 0);

}

function setCard() {
    let img = images[displayedCardIndex].cloneNode(true);
    img.classList.remove(img.classList[0]);
    img.classList.remove(img.classList[1]);
    // img.classList.add(cardData.descriptions[displayedCardIndex].orientation);
    img.style.border = cardData.descriptions[displayedCardIndex].border[0] + 'px solid ' + cardData.descriptions[displayedCardIndex].border[1];

    if (cardTop.querySelector('img')) {
        cardTop.querySelector('.top .image-box').removeChild(cardTop.querySelector('img'));
    }
    card.querySelector('.top .image-box').appendChild(img);

    card.classList.remove(card.classList[1]);
    card.classList.add(cardData.descriptions[displayedCardIndex].orientation);
    card.querySelector('.card-title span').innerHTML = cardData.descriptions[displayedCardIndex].title;
    card.querySelector('.description').innerHTML = cardData.descriptions[displayedCardIndex].description;

    cardContainerBackground.style.background = 'linear-gradient(' + cardData.descriptions[displayedCardIndex].backgroundColors[0] +
        ', transparent), linear-gradient(to top left, ' + cardData.descriptions[displayedCardIndex].backgroundColors[1] +
        ', transparent), linear-gradient(to top right, ' + cardData.descriptions[displayedCardIndex].backgroundColors[2] +
        ', transparent)';

    img.onload = function() {
        if (cardData.descriptions[displayedCardIndex].orientation === 'v') {
            img.style.transform = 'rotate(90deg) scale(1.3)';
        }
    }
}

function hideCard(event) {
    cardContainer.style.opacity = '0';
    cardContainer.style.transform = 'scale(0.97) translateY(5%)';

    // cardContainer.addEventListener("transitionend", function(event) {
    //     gallery.style.filter = 'none';
    //     cardContainerBackground.style.display = 'none';
    //     cardContainer.style.display = 'none';
    //     card.querySelector('input').checked = false;
    // }, false);

    gallery.style.filter = 'none';
    header.style.display = 'block';
    cardContainerBackground.style.display = 'none';
    cardContainer.style.display = 'none';
    card.querySelector('input').checked = false;
}

function wheel(index) {
    if (event.deltaY >= 0) {
        changeCard(1);
    } else {
        changeCard(0);
    }
}

function changeCard(direction) {
    if (direction) {
        if (displayedCardIndex == 17) {
            displayedCardIndex = 0;
        } else {
            displayedCardIndex += 1;
        }
    } else {
        if (displayedCardIndex == 0) {
            displayedCardIndex = 17;
        } else {
            displayedCardIndex -= 1;
        }
    }
    setCard();
}

function rotateCard() {
    card.querySelector('.c-toggle').checked = !card.querySelector('.c-toggle').checked;
}

function raiseCard() {
    card.querySelector('.r-toggle').checked = true;
}

function unraiseCard() {
    card.querySelector('.r-toggle').checked = false;
}

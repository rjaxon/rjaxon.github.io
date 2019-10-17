

var cards = 
[
    ['Dog', 'A common pet'],
    ['Cat', 'A less common pet'],
    ['card 1', 'back 1'],
    ['card 2', 'back 2'],
    ['card 3', 'back 3'],
    ['card 4', 'back 4'],
    ['card 5', 'back 5'],
    ['card 6', 'back 6'],
    ['card 7', 'back 7'],
    ['card 8', 'back 8'],
    ['card 9', 'back 9']
]

var discards = [];

var wrong = [];


var counter = 0;

for(var i = 0; i < cards.length; ++i) {
    var current = cards[i];
    console.log('front: ' + current[0]);
    console.log('back: '+ current[1]);
}

function spaceBarPressed(event) {
    
    console.log( "Handler for .keypress() called." + event.which);  
    var one = 49;
    var nine = 57;
    var space = 32;
    var isValid = event.which === space || event.which === one || event.which === nine;  
    if(!isValid)
        return;
    
    var card = $('#card');

    card.removeClass('done');
    
    if(card.hasClass('ask')) {
        if(event.which === one) {
            console.log('right');
            discard();
            getCard();
        }
        else if(event.which === nine) {
            console.log('wrong');
            wrongPile();
            getCard();
        }
        
    }
    else if(card.hasClass('front')) {
        // show the back
        if(event.which === space) {
            card.removeClass('front').addClass('back');
            showBack();
        }
    }
    else if(card.hasClass('back')) {
        if(event.which === space) {
            card.removeClass('back').addClass('ask');
            askCorrect();
        }
    }
    else {
        // neither one. Get a card.
        card.addClass('front');
        getCard();
    }
}

function discard() {

    var card = cards[counter];
    discards.push(card);
    cards.splice(counter, 1);

    counter = Math.floor(Math.random() * cards.length);
}

function wrongPile() {

    var card = cards[counter];
    wrong.push(card);
    cards.splice(counter, 1);

    counter = Math.floor(Math.random() * cards.length);
}


function askCorrect() {
    console.log('ask correct?')
    $('#card').html('<div>1 - Correct</div><div>9 - Wrong</div>');
    //getCard();
}

function getCard() {

    $('#deck').html(cards.length);
    $('#wrong').html(wrong.length);
    $('#right').html(discards.length);

    if(cards.length === 0) {
        $('#card').html((discards.length)/(cards.length + discards.length + wrong.length) * 100).removeClass('front').removeClass('back').removeClass('ask').addClass('done');

        if(wrong.length > 0) {
            cards = wrong;
            wrong=[];

        }
        else {
            cards = discards;
            discards = [];
            wrong = [];
        }
        return;
    }

    if(counter > (cards.length - 1)) {
        counter = 0;
    }

    var card = cards[counter];
    $('#card').html(card[0]);
    
    $('#card').removeClass('ask').addClass('front');

}

function showBack() {
    
    var card = cards[counter];
    $('#card').html(card[1]);

}

$(document).ready(function() {
    $( "body" ).keypress(spaceBarPressed);
});
    
    /* an array representing all existing cards in the game */
    var myCards = [];
    /* max number of cards to be simultanously added at each game */
    var maxCards = 9;
    /*  each element in myCards array is composed of a dictionary object representing a specific card. 
       This dictionary object represents a card and is made of two elements: i) an ID, and ii) a CardValues, such that : 
       card_x = { 'id' : '1234' , 'values' : {cardElements} , 'taken' : [] } 
       The first element 'id' , represents the card identifier; 

       The second element of the dictionary object is another dictionary object itself, representing all possible positions within a card and its value, such as : 
       cardElements = { b1 : '01' , b2 : '02' , b3 : '03' , b4 : '04' , b5 : '05' , i1 : '16' , i2 : '17' , i3 : '18' , i4 : '19' , i5 : '20' , n1 : '31' , n2 : '32' , n3 : '33' , n4 : '34' , n5 : '35' , g1 : '46' , g2 : '47' , g3 : '48' , g4 : '49' , g5 : '50' , o1 : '61' , o2 : '62' , o3 : '63' , o4 : '64' , o5 : '65' };
      
       The third element 'taken' is an array that registers the positions taken at each card during a specific game. 

       Therefore myCards is a data structure such as: 
       myCards = [ { 'id' : '1111' , 'values' : {cardElements} , 'taken' : [ b1, b4 , g3 ] } , { 'id' : '2222' , 'values' : {cardElements} , 'taken' : [ b3, n4 , i3 ]} , { 'id' : '3333' , 'values' : {cardElements} } , 'taken' : [] }   ...  ]
    */


    /* aux variable that records the current editing number while adding a new card. 
      it is used a global variable to help to pass arguments to handlers. it turns out that it is much easier to handle that in this way */ 
    var currentEditingNumber = '';

    /* an array of all played numbers in a specific game shown in the FULL board */
    var fullBoardArray = [];
    
    /* TODO:
        - add listeners to fullboard  [OK]
        - add start/end game with full board and board cleaning.
        - register selected numbers between game start and game end, in case of refresh during the game, at this moment, selections are lost.
        - add help
        - add functions for last-out diplay [OK]
        - tweak layout et check in diffenrent browsers 
    */
   var batidasDictionary = { 'cinco-aleatorias' : true , 'quatro-cantos' : true, 'linhas' : true , 'colunas' : true , 'diversas-te' : true , 'diversas-xis' : true ,  'diversas-ele': true , 'diversas-u': true , 'cartela-cheia' : true }
 
    
    /* loadPage event will happen when the DOM finishes loading and parsing the html   
        MDN : The DOMContentLoaded event fires when the initial HTML document has been completely loaded and parsed, 
        without waiting for stylesheets, images, and subframes to finish loading.*/
    document.addEventListener('DOMContentLoaded' , loadPage);
   

 
    function loadPage(){
        /* This function loads the data for each especific page, based on the 'body id' of each page. */
        let page = document.body.id;
        switch(page) {
            case 'index' :
                
                break;
            
            case 'cartelas' :
                loadCartelas();
                break;

            case 'batidas' :  
                loadBatidas();
                break;

            case 'jogos' :
                loadJogos();  
                break;

            case 'ajuda' :
                console.log('ajuda');
                break;
    
            case 'contato' :
                console.log('contato');
                break;
        }


    }

    function loadCartelas(){
    
        /* restores myCards information registered in the localstorage if any */
        let storedCards = JSON.parse(window.localStorage.getItem('myCards'));
        if(storedCards != null){
            myCards = storedCards;
        }
        /* creates game-wrapper, card-boad div in the section  */
        let sectionElements  = document.getElementsByTagName('section');
        let gameWrapperDiv = document.createElement('div');
        gameWrapperDiv.className = 'game-wrapper';
        let cardBoardDiv = document.createElement('div');
        cardBoardDiv.id = 'card-board';
        cardBoardDiv.className = 'card-board';
        gameWrapperDiv.appendChild(cardBoardDiv);
        sectionElements[0].appendChild(gameWrapperDiv);

        if(myCards.length == 0){
            /* if myCards is empty (no cards stored) creates the 1st card-board position empty with the add symbol in it */
            let cardBoardPosDiv = document.createElement('div');
            cardBoardPosDiv.id = 'card-board-pos-1';
            cardBoardPosDiv.className = 'card-board-position';

            let addSymbolDiv = document.createElement('div');
            addSymbolDiv.id = 'add-symbol-pos1';
            addSymbolDiv.className = 'add-symbol';
            addSymbolDiv.textContent = '+';
            addSymbolDiv.title = 'Adicione uma Cartela';
            cardBoardPosDiv.appendChild(addSymbolDiv);

            let cardBoard = document.getElementById('card-board');
            cardBoard.appendChild(cardBoardPosDiv);

            const addBoardPositions = document.getElementsByClassName("add-symbol");
            const addSymbolPos1 = document.getElementById('add-symbol-pos1');
            addSymbolPos1.addEventListener('click', addCard);
        }else{
            /* if there is at least one card load it from myCards to the DOM  */
            loadEditCards();
            if(myCards.length<maxCards){
                addNewBlankPosition(myCards.length);
            }
        }
    }

    function loadEditCards(){
    
        let cardBoardElement = document.getElementById('card-board');
        for (let i=0; i<myCards.length; i++){
            console.log('loading edit-card : ' + i);
            let currentPosition = i + 1;

            let cardBoardPositionDiv = document.createElement('div');
            cardBoardPositionDiv.id = `card-board-pos-${currentPosition}`;
            cardBoardPositionDiv.className = 'card-board-position';
            cardBoardElement.appendChild(cardBoardPositionDiv);

            let cardBoardPositionElement = document.getElementById(`card-board-pos-${currentPosition}`);
            cardBoardPositionElement.innerHTML = createEditCardFrame(currentPosition, myCards[i]['values']);;
            document.getElementById(`id-number-card-${currentPosition}`).value  = myCards[i]['id'];
            
            cardBoardPositionElement.classList.add("card-board-position-edit");
            addCardEditEventHandlers(cardBoardPositionElement, currentPosition);
        }
    
    }

    function addNewBlankPosition(cardPosition){
        /* ADD a new card position if number of cards is less than maxCards */
        console.log('add new blank position');
        console.log('cardPosition: ' + cardPosition);
        console.log('myCards.length: ' + myCards.length);
        console.log('maxCards: ' + maxCards);

        if(myCards.length < maxCards && cardPosition == myCards.length){
            console.log('myCards.length < maxCards && cardPosition == myCards.length');
            let cardBoardPosDiv = document.createElement('div');
            cardBoardPosDiv.id = `card-board-pos-${parseInt(cardPosition)+1}`;
            cardBoardPosDiv.className = 'card-board-position';
            
            let addSymbolDiv = document.createElement('div');
            addSymbolDiv.id = `add-symbol-pos${parseInt(cardPosition)+1}`;
            addSymbolDiv.className = 'add-symbol';
            addSymbolDiv.title = 'Adicione uma Cartela';
            
            let symbol = document.createTextNode('+');
            addSymbolDiv.appendChild(symbol);
            addSymbolDiv.addEventListener('click', addCard);
            cardBoardPosDiv.appendChild(addSymbolDiv);
 
            let cardBoadElement = document.getElementById('card-board');
            cardBoadElement.append(cardBoardPosDiv);
        }
    }

    function loadJogos(){
       
        /* read myCards from localstorage if any */
        let storedCards = JSON.parse(window.localStorage.getItem('myCards'));
        if(storedCards != null){
            myCards = storedCards;
        }
        console.log(myCards);
        /* adds game-wrapper, game-board and full-board DIVs to the section element */
        let sectionElements  = document.getElementsByTagName('section');
        let gameWrapperDiv = document.createElement('div');
        gameWrapperDiv.className = 'game-wrapper';
        let gameBoardDiv = document.createElement('div');
        gameBoardDiv.id = 'game-board';
        gameBoardDiv.className = 'game-board';
        gameWrapperDiv.appendChild(gameBoardDiv);
        let fullBoardDiv = createFullBoard();
        gameWrapperDiv.appendChild(fullBoardDiv);
        sectionElements[0].appendChild(gameWrapperDiv);
        
        /* adds event listeners for full board */
        addFullBoardEventHandlers();

        /* load card games - cartelas - if any stored */
        let fullboardElement = document.getElementById('full-board');
        if(myCards.length > 0){
            loadGameCards();
            addGameCardEventHandlers();
            loadCardsPlayedNumbers();
            fullboardElement.classList.remove('full-board-hidden');
        }else{
            let contentHeaderElement = document.getElementById('content-header');
            

            contentHeaderElement.firstChild.nextSibling.innerText = "Nenhuma cartela registrada";
            fullboardElement.classList.add('full-board-hidden');
        }

        
        loadFBPlayedNumbers();

    }

    function addFullBoardEventHandlers(){

        /* Event listeners for setting a played number */
        let fbNumbers = document.getElementsByClassName('fb-number');
        for (let i=0; i<fbNumbers.length; i++){
            fbNumbers[i].addEventListener('click', setFullBoardPlayedNumber); 
        }

        /* event listener for clean button */
        let cleanFBButton = document.getElementById('full-board-reset-btn');
        cleanFBButton.addEventListener('click', cleanFullBoard);

   }

   function loadGameCards(){

    let gameBoardElement = document.getElementById('game-board');

        for (let i=0; i<myCards.length; i++){
            console.log('loading card ');
            let currentPosition = i + 1;
            console.log('loading card ' + currentPosition);

            let gameBoardPositionDiv = document.createElement('div');
            gameBoardPositionDiv.id = `game-board-pos-${currentPosition}`;
            gameBoardPositionDiv.className = 'game-board-position';
            gameBoardElement.appendChild(gameBoardPositionDiv);

            console.log(myCards[i]);
            console.log(myCards[i]['id']);
            console.log(myCards[i.toString()]);
            console.log(myCards[i.toString()]['id']);

            let cardId = myCards[i]['id'];
            let cardValues = myCards[i]['values'];
            console.log(`at cardId ${cardId}  we find the values: `)
            console.log(cardValues);

            let newGameCardHTML = createGameCardFrame(currentPosition, cardValues);
            let gameBoardPositionElement = document.getElementById(`game-board-pos-${currentPosition}`);
            gameBoardPositionElement.innerHTML = newGameCardHTML;
            document.getElementById(`identifier-number-card-${currentPosition}`).innerText  = cardId;
        }   
    }

    function addGameCardEventHandlers(){
        /* HANDLERS for the playing card : cardBoardPositionElement */
        let gameNumbers = document.getElementsByClassName('card-game-number');
        for (let i=0; i<gameNumbers.length; i++){
            if(gameNumbers[i].id.substring(18,20) != 'n3' ){
                gameNumbers[i].addEventListener('click', setPlayedNumber); 
            }
        }
    }

    function loadFBPlayedNumbers(){
        /* load history of played numbers from storage to fullBoardArray */
        let storedFullBoardArray = JSON.parse(window.localStorage.getItem('myFullBoardArray'));
        if(storedFullBoardArray != null){
            fullBoardArray = storedFullBoardArray;
        }

        if(fullBoardArray.length > 0){
            /*  position id: fb-pos-35  */
            let currentElement = null;
            for (let i=0 ; i<fullBoardArray.length; i++){
                if(fullBoardArray[i] < 10){
                    currentElement = document.getElementById(`fb-pos-0${fullBoardArray[i]}`);
                }else{
                    currentElement = document.getElementById(`fb-pos-${fullBoardArray[i]}`);
                }
                console.log('target element: ' + currentElement);
                currentElement.classList.toggle('fb-number-selected');

            }
            showLastOut();
        }
    }

    function loadCardsPlayedNumbers(){

        for (let i=0 ; i<myCards.length; i++){
            let takenArray = myCards[i]['taken'];
            console.log('myCard : ' + i);
            takenArray.forEach(function(item , index) {
                /* number id : number-card-3-pos-b5 */
                console.log('position taken: ' + item);
                console.log('will look for: number-card-' + i+1 + '-pos-' + item );
                let targetElement = document.getElementById(`number-card-${i+1}-pos-${item}`);
                console.log(targetElement);
                targetElement.classList.toggle('card-game-number-active'); 
               

              });
        }


    }
    

    function setPlayedNumber(e){

        let positionElment = e.target;
        console.log(e.target.id);
        let position = positionElment.id.substring(18, 20);
        let cardNumberName = positionElment.id.substring(7, 13);
        let cardNumber = parseInt(positionElment.id.substring(12, 13));
        let cardNumberId = document.getElementById(`identifier-number-${cardNumberName}`).innerText;

        console.log('clicked position : ' + position);
        console.log('clicked cardNumberName : ' + cardNumberName);
        console.log('clicked cardNumber: ' + cardNumber);
        console.log('cardNumberId : ' +cardNumberId);

        positionElment.classList.toggle('card-game-number-active');
        let takenArray = null;

        if(myCards[cardNumber-1]['id'] == cardNumberId){ 
            takenArray = myCards[cardNumber-1]['taken'];

            if (takenArray.indexOf(position) <0 ){
                takenArray.push(position);
            }else{
                takenArray.splice(takenArray.indexOf(position), 1);
            }
            /* myCards[cardNumber-1]['taken'] = takenArray; */
            window.localStorage.setItem('myCards', JSON.stringify(myCards));
            console.log(myCards);
        }
         


    }

    function setFullBoardPlayedNumber(e){

        let positionElment = e.target;
        console.log('clicked e.target.id : ' + e.target.id);
        let positionInt = parseInt(positionElment.id.substring(7, 9));
     
        positionElment.classList.toggle('fb-number-selected');
        toggleFBArray(positionInt);
        showLastOut();      
    }

    function cleanFullBoard(e){
        
        /* console.log('clean full-board (length): ' + fullBoardArray.length); */
        if(fullBoardArray.length>0){
            let currentElement = null;
            for (let i=0 ; i<fullBoardArray.length; i++){
                if(fullBoardArray[i] < 10){
                    currentElement = document.getElementById(`fb-pos-0${fullBoardArray[i]}`);
                }else{
                    currentElement = document.getElementById(`fb-pos-${fullBoardArray[i]}`);
                }
                /* console.log('target element: ' + currentElement); */
                currentElement.classList.remove('fb-number-selected');
            }

            currentLastOut = document.getElementById(`last-out`);
            currentLastOut.innerHTML = '00';
            fullBoardArray = [];
            window.localStorage.setItem('myFullBoardArray', JSON.stringify(fullBoardArray));
        }
        
       
    }
    
    function toggleFBArray(positionInt){

        if (fullBoardArray.indexOf(positionInt) <0 ){
            fullBoardArray.push(positionInt);
        }else{
            fullBoardArray.splice(fullBoardArray.indexOf(positionInt), 1);
        }
        /* console.log(fullBoardArray); */
        window.localStorage.setItem('myFullBoardArray', JSON.stringify(fullBoardArray));
    }

    function showLastOut(){

        let lastout = document.getElementById('last-out');
        if(fullBoardArray.length>0){
            /* console.log('last position: ' + fullBoardArray[fullBoardArray.length-1]); */
            let last = fullBoardArray[fullBoardArray.length-1];
            let lastCollumn = getNumberColumn(last);
            if(last<10){
                lastout.textContent = lastCollumn + '0' + last;
            }else{
                lastout.textContent = lastCollumn + last;
            }     
        }else{
            lastout.textContent = '00';
        }
    }

    function getNumberColumn(number){

        switch(true){
            case(number<16):
                return('B');
            case( (15<number) && (number<31) ):
                return('I');
            case(  (30<number) && (number<46) ):
                return('N');
            case( (45<number) && (number<61) ):
                return('G');
            case( (60<number) && (number<76) ):
                return('O');
        }
    }

    function createFullBoard(){

        let fbDiv = document.createElement('div');
        fbDiv.className = 'full-board';
        fbDiv.id = 'full-board';

        let fbSubtitle = document.createElement('h3');
        fbSubtitle.textContent = 'Tabuleiro';
        fbDiv.appendChild(fbSubtitle);

        let lastOut = document.createElement('div');
        lastOut.className = 'last-out';
        lastOut.id = 'last-out';
        lastOut.textContent = '00';
        lastOut.title = "Último número"
        fbDiv.appendChild(lastOut);
        
        let fbGrid = document.createElement('div');
        fbGrid.className = 'full-board-grid';
        fbGrid.id = 'full-board-grid';
     
        let numbersFragment = document.createDocumentFragment();
        let stardardHeaders = [ 'b' , 'i' , 'n' , 'g', 'o' ];
        let counter=0;
        let index = 0;
        for (let i=1; i<76; i++){
            if(counter==0){
                /* <div class="full-board-header"> x </div> */
                let headerDiv = document.createElement('div');
                headerDiv.className = 'full-board-header';
                headerDiv.textContent = stardardHeaders[index];
                numbersFragment.appendChild(headerDiv);
            }

            /* <div class="fb-number" id="fb-pos-01">01</div> */
            let fbNumberDiv = document.createElement('div');
            fbNumberDiv.className = 'fb-number';
            if(i<10){
                fbNumberDiv.id = `fb-pos-0${i}`;
                fbNumberDiv.textContent = `0${i}`;
            }else{
                fbNumberDiv.id = `fb-pos-${i}`;
                fbNumberDiv.textContent = `${i}`;
            }
            numbersFragment.appendChild(fbNumberDiv);

            counter +=1;
            if(counter == 15){
                index += 1;
                counter=0;
            }
            
        }

        fbGrid.appendChild(numbersFragment);
        fbDiv.appendChild(fbGrid);

        let resetBtn = document.createElement('button');
        resetBtn.id = 'full-board-reset-btn';
        resetBtn.className = 'full-board-reset-btn';
        resetBtn.textContent ='apagar';
        fbDiv.appendChild(resetBtn);

        return fbDiv;

}
    
    function addCard(e){
        /* function to that adds a new card frame at the position specified by the id of the element */
       
        let addSymbol = e.target;
        /* As we click in the '+' symbol, I get its parent element to identify in which board I clicked */
        let cardBoardPositionElement = document.getElementById(e.target.id).parentElement;
        console.log('add card: id : ' + e.target.id);
       /*  let cardPosition = cardBoardPositionElement.id.slice(-1);  */  /* ex: cardBoardPositionElement.id = 'card-board-pos-1' */
        let cardPosition = cardBoardPositionElement.id.substring(15);
        console.log('add cardPosition : ' + cardPosition);

        let newCardEditHTML = createEditCardFrame(cardPosition, null);
        console.log(newCardEditHTML);
        cardBoardPositionElement.innerHTML = newCardEditHTML;
    
        cardBoardPositionElement.classList.add("card-board-position-edit");
        addSymbol.removeEventListener('click', addCard);
    
        addCardEditEventHandlers(cardBoardPositionElement, cardPosition);
    }
    
    function addCardEditEventHandlers(cardBoardPositionElement, cardPosition){
    
         /* HANDLERS for this card : cardBoardPositionElement */
         let editableNumbers = cardBoardPositionElement.getElementsByClassName("editable-number");
         for (let i=0;i<editableNumbers.length;i++){
             editableNumbers[i].addEventListener('click', editNumber);
         }
         /* handlers at remove button  */
         let editRemoveButton = document.getElementById("card-edit-btn-remove-card-" + cardPosition); 
         editRemoveButton.addEventListener('click', handleRemoveCard);
         /* handlers at save button  */
         let editSaveButton = document.getElementById("card-edit-btn-save-card-" + cardPosition); 
         editSaveButton.addEventListener('click', handleSaveCard);
     
        /* NOTE: 
            - getElementsByClassName: returns an array-like object of all child elements which have all of the given class name(s). 
            When called on the document object, the complete document is searched, including the root node. 
            NOTE: can be called on any element; it will return only elements which are descendants of the specified root element with the given class name(s).    
            - querySelectorAll: returns a non-live NodeList containing one Element object for each element that matches 
            at least one of the specified selectors or an empty NodeList in case of no matches.   
        */
    }

    function createEditCardFrame(cardposition, cardElements){
    
        let resultElement = "";
        let currentCard = 'card-' + cardposition;
        let stardardHeaders = [ 'b' , 'i' , 'n' , 'g', 'o' ];
        console.log('create edit card frame - currentCard : ' + currentCard);

        console.log('cardElements : ' + cardElements)
        if(cardElements==null){
            
            /* if cardElement is null, it means that we are creating a new card, with just generic values for each positions, 
            these values are in the dictionary object below */
            myCardElements = { 'b1' : 'b1' , 'b2' : 'b2' , 'b3' : 'b3' , 'b4' : 'b4' , 'b5' : 'b5' , 'i1' : 'i1' , 'i2' : 'i2' , 'i3' : 'i3' , 'i4' : 'i4' , 'i5' : 'i5' , 'n1' : 'n1' , 'n2' : 'n2' , 'n3' : 'X' , 'n4' : 'n4' , 'n5' : 'n5' , 'g1' : 'g1' , 'g2' : 'g2' , 'g3' : 'g3' , 'g4' : 'g4' , 'g5' : 'g5' , 'o1' : 'o1' , 'o2' : 'o2' , 'o3' : 'o3' , 'o4' : 'o4' , 'o5' : 'o5' };
        }else{
            /* if we pass a dictionary with cardElement not null, it means that we are loading cards to edit from myCards array. */
            myCardElements = cardElements;
        }
        let divEditPanel = `<div class="number-edit-panel" id="number-edit-panel-${currentCard}"> 
                                <div class="number-option" id="number-option-${currentCard}-option-1"> x </div>
                                <div class="number-option" id="number-option-${currentCard}-option-2"> x </div>
                                <div class="number-option" id="number-option-${currentCard}-option-3"> x </div>
                                <div class="number-option" id="number-option-${currentCard}-option-4"> x </div>
                                <div class="number-option" id="number-option-${currentCard}-option-5"> x </div>
                                <div class="number-option" id="number-option-${currentCard}-option-6"> x </div>
                                <div class="number-option" id="number-option-${currentCard}-option-7"> x </div>
                                <div class="number-option" id="number-option-${currentCard}-option-8"> x </div>
                                <div class="number-option" id="number-option-${currentCard}-option-9"> x </div>
                                <div class="number-option" id="number-option-${currentCard}-option-10"> x </div>
                                <div class="number-option" id="number-option-${currentCard}-option-11"> x </div>
                                <div class="number-option" id="number-option-${currentCard}-option-12"> x </div>
                                <div class="number-option" id="number-option-${currentCard}-option-13"> x </div>
                                <div class="number-option" id="number-option-${currentCard}-option-14"> x </div>
                                <div class="number-option" id="number-option-${currentCard}-option-15"> x </div>
                            </div>`;
     
        let elemetnCardHeader = `<div class="card-edit" id="edit-${currentCard}"> ${divEditPanel} <div class="grid-edit-numbers" id="grid-edit-numbers-${currentCard}">`;
        resultElement += elemetnCardHeader;
        
        let counter =0;
        let headerIndex = 0;
        for (let key in myCardElements){
            if(counter ==0){ 
                let elementHeader = `<div class="card-header" id="header-${currentCard}">${stardardHeaders[headerIndex]} </div>`;
                resultElement += elementHeader;
            }
            let gridPosition = key;
            let gridValue = myCardElements[key];
            let elementNumber = '';
            if(Number.isInteger(parseInt(gridValue))){
                elementNumber = `<div class="card-number editable-number editable-number-selected" id="number-edit-${currentCard}-pos-${gridPosition}" > ${gridValue} </div>`;
            }else{
                elementNumber = `<div class="card-number editable-number" id="number-edit-${currentCard}-pos-${gridPosition}" title="Clique para selecionar valor"> ${gridValue} </div>`;
            }
            if(gridPosition == "n3"){
                elementNumber = `<div class="card-number grid-central-element" id="pos-${gridPosition}"> X </div>`;
            }
            resultElement += elementNumber;
            counter += 1;
            if(counter == 5){ 
                counter=0; 
                headerIndex += 1; 
            }
        }
        let elemetnCardID = `</div>  
                            <div class="card-identifier-edit" id="identifier-${currentCard}">
                                <button class="card-edit-btn-remove" id="card-edit-btn-remove-${currentCard}" title="Clique para apagar cartela"> apagar </button>
                                <input type="text" class="id-number-edit" id="id-number-${currentCard}" placeholder="Número" title="Entre um número da Identificação" maxlength="10" size="15" onkeypress='validateKey(event)'>
                                <button class="card-edit-btn-save" id="card-edit-btn-save-${currentCard}" title="Clique para salvar cartela"> salvar </button> 
                            </div>`;
        resultElement += elemetnCardID;
        let endElement = '</div>'
        resultElement += endElement;
        return(resultElement); 
        
    }

    function validateKey(evt) {
        /* https://stackoverflow.com/questions/469357/html-text-input-allow-only-numeric-input */
        var theEvent = evt || window.event;
      
        // Handle paste
        if (theEvent.type === 'paste') {
            key = event.clipboardData.getData('text/plain');
        } else {
        // Handle key press
            var key = theEvent.keyCode || theEvent.which;
            key = String.fromCharCode(key);
        }
        var regex = /[a-z0-9]|\./;
        if( !regex.test(key) ) {
          theEvent.returnValue = false;
          if(theEvent.preventDefault) theEvent.preventDefault();
        }
      }

    function createGameCardFrame(cardposition, cardElements){
        console.log('creating game card frame for card position: ' + cardposition) ;
        console.log('creating game card frame of element: ' + cardElements) ;

        let resultElement = "";
        let currentCard = 'card-' + cardposition;
        console.log('current card: ' + currentCard);
        let stardardHeaders = [ 'b' , 'i' , 'n' , 'g', 'o' ];
    
        if(cardElements==null){
            myCardElements = { 'b1' : 'b1' , 'b2' : 'b2' , 'b3' : 'b3' , 'b4' : 'b4' , 'b5' : 'b5' , 'i1' : 'i1' , 'i2' : 'i2' , 'i3' : 'i3' , 'i4' : 'i4' , 'i5' : 'i5' , 'n1' : 'n1' , 'n2' : 'n2' , 'n3' : 'X' , 'n4' : 'n4' , 'n5' : 'n5' , 'g1' : 'g1' , 'g2' : 'g2' , 'g3' : 'g3' , 'g4' : 'g4' , 'g5' : 'g5' , 'o1' : 'o1' , 'o2' : 'o2' , 'o3' : 'o3' , 'o4' : 'o4' , 'o5' : 'o5' };
        }else{
            myCardElements = cardElements;
        }

        console.log('myCardElements :');
        console.log(myCardElements);
      
        let elemetnCardHeader = `<div class="card" id="${currentCard}">  <div class="card-grid-numbers" id="grid-numbers-${currentCard}">`;
        /* console.log('' + ); */
        console.log('elemetnCardHeader' + elemetnCardHeader);
        resultElement += elemetnCardHeader;
        
        let counter =0;
        let headerIndex = 0;
        for (let key in myCardElements){
            if(counter ==0){ 
                let elementHeader = `<div class="card-game-header" id="game-header-${currentCard}">${stardardHeaders[headerIndex]} </div>`;
                resultElement += elementHeader;
            }
            let gridPosition = key;
            let gridValue = myCardElements[key];
            console.log(`at position : ${gridPosition} -> value : ${gridValue} ` );
            let elementNumber = '';
            
            elementNumber = `<div class="card-game-number" id="number-${currentCard}-pos-${gridPosition}" title='Click para marcar/desmarcar'> ${gridValue} </div>`;
            
            if(gridPosition == "n3"){
                elementNumber = `<div class="card-game-number grid-central-element" id="number-${currentCard}-pos-${gridPosition}" > X </div>`;
            }

            resultElement += elementNumber;
            counter += 1;
            if(counter == 5){ 
                counter=0; 
                headerIndex += 1; 
            }
        }
        let elemetnCardID = `</div>  
                            <div class="card-identifier" id="identifier-${currentCard}">
                                <div class="identifier-number" id="identifier-number-${currentCard}"> 123456 </div>
                            </div>`;
        resultElement += elemetnCardID;
        let endElement = '</div>'
        resultElement += endElement;
        console.log('resultElement');
        console.log(resultElement);
        return(resultElement); 
        
    }
    
    function editNumber(e){
    
        currentEditingNumber =  e.target;
        let cardNumber = currentEditingNumber.id.substring(17,18);
        let gridCollumn = currentEditingNumber.id.substring(23, 24);
        let gridRow = currentEditingNumber.id.substring(24,25);
    
        setNumberOptions(cardNumber , gridCollumn);  
    
        let currentEditPanel = document.getElementById(`number-edit-panel-card-${cardNumber}`);
        currentEditPanel.classList.add("number-edit-panel-active");
    
        let numbOptions = currentEditPanel.getElementsByClassName("number-option");
        for (let i=0;i<numbOptions.length;i++){
            numbOptions[i].addEventListener('click', handleSelectedNumber);
        }
    
        let editableNumbers = document.getElementsByClassName("editable-number");
        for (let i=0;i<editableNumbers.length;i++){
            editableNumbers[i].removeEventListener('click', editNumber);
        }
    }
    
    function handleSelectedNumber(e){
    
        let cardNumber = e.target.id.substring(19,20);   /* number-option-card-1-option-15 */

        let selectedValue = e.target.innerHTML;
        currentEditingNumber.innerHTML = selectedValue;
        currentEditingNumber.classList.add('editable-number-selected');
    
        let gridCollumn = currentEditingNumber.id.substring(23, 24);
        let gridRow = currentEditingNumber.id.substring(24,25);
        let numbOptions = document.getElementsByClassName("number-option");
    
        for (let i=0;i<numbOptions.length;i++){
            numbOptions[i].removeEventListener('click', handleSelectedNumber);
        }
    
        let editableNumbers = document.getElementsByClassName("editable-number");
        for (let i=0;i<editableNumbers.length;i++){
            editableNumbers[i].addEventListener('click', editNumber);
        }
        let currentEditPanel = document.getElementById(`number-edit-panel-card-${cardNumber}`);
        currentEditPanel.classList.remove("number-edit-panel-active");

        let saveBtnElement =  document.getElementById(`card-edit-btn-save-card-${cardNumber}`);
        console.log('cardNumber: ' + cardNumber);
        console.log(saveBtnElement);
        saveBtnElement.classList.add('blink-btn');


    }
    
    function setNumberOptions(cardN, collumn){
    
        for (let optNumber=1; optNumber<16 ; optNumber++){
    
            let currentElement = document.getElementById(`number-option-card-${cardN}-option-${optNumber}`);
    
            if (collumn == 'b'){
                let elementValue = optNumber;
                if(optNumber<10){
                    elementValue = "0" + optNumber;
                }
                currentElement.innerHTML = elementValue;
            }
            if (collumn == 'i'){
                let elementValue = optNumber + 15;
                currentElement.innerHTML = elementValue; 
            }
            if (collumn == 'n'){
                let elementValue = optNumber + 30;
                currentElement.innerHTML = elementValue;  
            }
            if (collumn == 'g'){
                let elementValue = optNumber + 45;
                currentElement.innerHTML = elementValue;  
            }
            if (collumn == 'o'){
                let elementValue = optNumber + 60;
                currentElement.innerHTML = elementValue;
            }
        }
    }
      
    function handleRemoveCard(e){
       /* function to that remove a card frame at the position specified by the id of the element */
        console.log('handleRemoveCard : id : ' + e.target.id);
        /* let cardPosition = e.target.id.slice(-1);  */   /* id ='card-edit-btn-remove-card-1' card-edit-btn-remove-card-1  */  
        let cardPosition = e.target.id.substring(26);
        console.log('remove pos: ' + cardPosition);

        let cardPositionElem = document.getElementById("card-board-pos-"+cardPosition);
        let cardIdentifierValue = document.getElementById(`id-number-card-${cardPosition}`).value;    /* get identifier from DOM */
      
        switch(myCards.length) {
            case 0:  /* trying to remove a card that is not yet saved */
                    replaceBoardByAddSymbol(cardPositionElem, cardPosition);
                    break;

            case 1: /* only one card saved in myCards array */
                    if (cardPosition == myCards.length){
                        replaceBoardByAddSymbol(cardPositionElem, cardPosition);
                        /* remove next blank ('+') position */
                        removeNextBlankPosition(cardPosition);
                        /* remove 1 element from the myCards array,  at the 'index' corresponding to the card-identifier */
                        myCards.splice(getCardIndex(cardIdentifierValue), 1);
                        /* UPDATE myCards to LOCALSTORAGE  */
                        window.localStorage.setItem('myCards', JSON.stringify(myCards));
                    }
                    if(cardPosition > myCards.length){
                        replaceBoardByAddSymbol(cardPositionElem, cardPosition);
                    }
                    break;

            default:  /* any position other than first position */

                    if (cardPosition == myCards.length){  /* removing a card at the last position in the board */
                        replaceBoardByAddSymbol(cardPositionElem, cardPosition);
                        /* avoid trying to remove the last + 1 card-position (which does not exist) */
                        removeNextBlankPosition(cardPosition);
                        /* remove selected element from the myCards array,  at the 'index' corresponding to the card-identifier */
                        myCards.splice(getCardIndex(cardIdentifierValue), 1);
                        /* UPDATE myCards to LOCALSTORAGE  */
                        window.localStorage.setItem('myCards', JSON.stringify(myCards));
                    }
    
                    if (cardPosition > myCards.length){
                        replaceBoardByAddSymbol(cardPositionElem, cardPosition);
    
                    }
    
                    if (cardPosition < myCards.length){  
                         /* remove selected element from the myCards array,  at the 'index' corresponding to the card-identifier */
                         myCards.splice(getCardIndex(cardIdentifierValue), 1);
                         /* UPDATE myCards to LOCALSTORAGE  */
                        window.localStorage.setItem('myCards', JSON.stringify(myCards));
    
                        /* clean card-board element */
                        document.getElementById('card-board').innerHTML = "";
    
                        loadEditCards();
                        addNewBlankPosition(myCards.length);
                        
                    }
                }            
    }
    
    function replaceBoardByAddSymbol(cardPositionElem, cardPosition){
    
        /* add 'add-symbol' and replace card-board-pos border */
        cardPositionElem.innerHTML = '<div class="add-symbol" title="Adicione uma Cartela" id="add-symbol-'+cardPosition+'"> + </div>';
        cardPositionElem.classList.remove("card-board-position-edit");
        /* add 'add-symbol' eventlistener  */
        document.getElementById('add-symbol-' + cardPosition).addEventListener('click', addCard);
        
    }
    
    function handleSaveCard(e){
        
        let saveBtnElement = e.target;   /* remove btn element */
        console.log('card position id : ' + saveBtnElement.id);
        /* let btnPosition = saveBtnElement.id.slice(-1); */   /* id = 'card-edit-btn-save-card-7  ; card-edit-btn-save-card-xx' */
        let btnPosition = saveBtnElement.id.substring(24);

        console.log('saving card position : ' + btnPosition);
        let cardBoardPositionElement = document.getElementById(`card-board-pos-${btnPosition}`);
    
       /*  if(positionsFilled(btnPosition) && identifierFilled(btnPosition)){ */
       if(identifierFilled(btnPosition)){
            saveCard(btnPosition);
        }else{
            alert('Um número da cartela vazio!')
        }
        
    }
    
    function saveCard(cardPosition){
    
        /* read identifier and values from board */
        let cardIdentifierElement =  document.getElementById(`id-number-card-${cardPosition}`);
        let cardIdentifierValue = cardIdentifierElement.value;
 

        let gridNumbers = document.getElementById(`grid-edit-numbers-card-${cardPosition}`);
        let numberElements = gridNumbers.getElementsByClassName("editable-number");
        let saveBtnElement =  document.getElementById(`card-edit-btn-save-card-${cardPosition}`);
        
        /* create a new object with the values from the board */
        let newEditedValues= {} 
        for (let i=0; i<numberElements.length; i++) {
            let positionIdentifier = numberElements[i].id.substring(23, 25).toLowerCase();
            let positionValue = numberElements[i].innerText.toLowerCase();
            if(i<12){
                newEditedValues[positionIdentifier] = positionValue;
            }
            if(i==12){
                newEditedValues['n3'] = 'X';
            }
            newEditedValues[positionIdentifier] = positionValue;
        }
    
        if(!cardDicExists(cardIdentifierValue)){
            console.log('creating new card');
            if(myCards.length < maxCards){
                console.log('myCards.length < maxCards');
                /* create card  */
                let newDicCard = { 'id' : cardIdentifierValue , 'values' : newEditedValues, 'taken' : [] }
                myCards.push(newDicCard);
                /* add new blank position */
                addNewBlankPosition(cardPosition);
                /* set identifier read only to avoid id changing - must remove the card if id is mistakenly input */
                cardIdentifierElement.setAttribute('readonly', '');
                cardIdentifierElement.style.userSelect = 'none';

                saveBtnElement.classList.remove('blink-btn');
                
            }   
        }else{

            if(parseInt(getCardIndex(cardIdentifierValue))+1 == cardPosition ){
                /* update card */
                console.log('updating card');
                let cardIndex = getCardIndex(cardIdentifierValue);
                if (cardIndex != null){
                    myCards[cardIndex] = { 'id' : cardIdentifierValue , 'values' : newEditedValues , 'taken' : [] };

                    saveBtnElement.classList.remove('blink-btn');
                }
            }else{

                alert('Um número da cartela já utilizado!')
                return;
            }

            
           
        }
        /* UPDATE myCards to LOCALSTORAGE  */
        window.localStorage.setItem('myCards', JSON.stringify(myCards));
    }
    
    function getIdentifierFromCardBoard(cardPosition){
        return document.getElementById(`id-number-card-${cardPosition}`).value;
    }
    
    function removeNextBlankPosition(cardPosition){
        var nextPosition = document.getElementById(`card-board-pos-${parseInt(cardPosition)+1}`);
        if(nextPosition != null){
            nextPosition.parentNode.removeChild(nextPosition);
        }
    }
    
    function cardDicExists(identifier){
       /* Function receives the value of the input element of the identidier in the board and checks if a card in myCards already has this identifier value */
        if (myCards.length == 0){
            return false;
        }
        for (let i=0; i<myCards.length; i++){
            console.log('at index ' + i + ' myCards[i].id  is : ' + myCards[i].id);
            if (myCards[i].id == identifier){
                return true;
            } 
        }
        return false;
    }
    
    function getCardIndex(identifier){
        if (myCards.length == 0){
            return null;
        }
    
        for (let i=0; i<myCards.length; i++){
            if (myCards[i].id == identifier){
                return i;
            } 
        }
        return null;
    }
    
    function positionsFilled(cardPosition){
    
        let gridNumbers = document.getElementById(`grid-edit-numbers-card-${cardPosition}`);
        let numberElements = gridNumbers.getElementsByClassName("editable-number");

        for (let i=0; i<numberElements.length; i++) {
            let positionValue = numberElements[i].innerText.toLowerCase();
            let positionIdentifier = numberElements[i].id.substring(23, 25).toLowerCase();;
            if (positionValue == positionIdentifier){
                return false;
            }  
        }
        
        return true; 
    }
    
    function identifierFilled(cardPosition){

        let cardIdentifier =  document.getElementById(`id-number-card-${cardPosition}`);
 
        if(cardIdentifier.value === "" ){
            return false;
        }
        
        return true;
    }

    function loadBatidas(){

         /* read batidasDictionary from localstorage if any */
         let storedValues = JSON.parse(window.localStorage.getItem('batidasDictionary'));
         if(storedValues != null){
            batidasDictionary = storedValues;
         }

        /* set opacity according to current values */
        for(let key in batidasDictionary) {
            console.log(key);
            if(batidasDictionary[key] == false){
                let batidaItemElement = document.getElementById(key);
                batidaItemElement.classList.toggle('batida-item-fade');
                /* batidaItemElement.classList.toggle('batidas-active'); */
            }
        }

        /* set eventlisteners for each elemenet or group of elements representing winning draws */
        let batidaItemElements = document.getElementsByClassName('batida-item');
        for (let i=0; i<batidaItemElements.length; i++){
            if(batidaItemElements[i].id != 'diversas'){
                batidaItemElements[i].addEventListener('click', function(e) {
                    flipItem(batidaItemElements[i].id);
                    e.target.parentElement.classList.toggle('batida-item-fade');
                    /* e.target.parentElement.classList.toggle('batidas-active'); */
                    window.localStorage.setItem('batidasDictionary', JSON.stringify(batidasDictionary));
                  } );

            }else{
                let subIndependentItems = batidaItemElements[i].children;
                for (let j=0; j< subIndependentItems.length; j++){

                    subIndependentItems[j].addEventListener('click', function(e) {
                        flipItem(subIndependentItems[j].id);
                        e.target.classList.toggle('batida-item-fade');
                       /*  e.target.classList.toggle('batidas-active'); */
                        window.localStorage.setItem('batidasDictionary', JSON.stringify(batidasDictionary));
                      });
                }
            }
        }
    }

    function flipItem(item){
        
        if(batidasDictionary[item] == true){
            batidasDictionary[item] = false;
        }else{
            batidasDictionary[item] = true;
        }
    }
const optionContainer = document.querySelector('.option-container');
const flipButton = document.querySelector('#flip-button');
const startButton = document.querySelector('#start-button');
const gameBoardContainor =document.querySelector('#gameboard-containor')
const infoDisplay = document.querySelector('#info');
const turnDisplay = document.querySelector('#turn-display');

let angle = 0;
function flip() {
    const optionShips= Array.from(optionContainer.children);
    angle = angle===0? 90:0
    optionShips.forEach(optionShip=>optionShip.style.transform =`rotate(${angle}deg)`)
}

flipButton.addEventListener('click',flip);

const width=10;
function creatboard(color,user) {
    const gameBoard =document.createElement('div');
    gameBoard.classList.add('game-board');
    gameBoard.style.backgroundColor=`${color}`;
    gameBoard.id=user;


    for(let i=0;i<width*width;i++) {
        const block = document.createElement('div');
        block.classList.add('block');
        block.id = i;
        gameBoard.append(block);
    }
    gameBoardContainor.append(gameBoard);

}

creatboard('yellow','player');
creatboard('pink','computer');

class Ship {
    constructor(name,length) {
        this.name = name;
        this.length = length;
    }
}

const destroyer = new Ship('destroyer',2);
const submarine = new Ship('submarine',3);
const cruiser = new Ship('cruiser',3);
const battleship = new Ship('battleship',4);
const carrier = new Ship('carrier',5);

const ships = [destroyer,submarine,cruiser,battleship,carrier];
let notDropped;

function getvalidity(allBoardBlocks,isHorizontal,startIndex,ship) {
    let validStart = isHorizontal? (startIndex <=width*width - ship.length? startIndex:width*width-ship.length):
    // Is vertical
    (startIndex <=width*width - width*ship.length? startIndex:
        startIndex-ship.length*width+width);


    // console.log(randomStartIndex);

    let shipBlocks = [];

    for(let i=0;i<ship.length;i++) {
        if(isHorizontal) {
            shipBlocks.push(allBoardBlocks[Number(validStart)+i]);

        }
        else {
            shipBlocks.push(allBoardBlocks[Number(validStart)+i*width]);
        }
    }



    let valid;
    if(isHorizontal) {
        shipBlocks.every((_shipBlock,index) =>
        valid=shipBlocks[0].id % width !== width - (shipBlocks.length-(index+1)))

    }
    else {
        shipBlocks.every((_shipBlock,index) =>
            valid = shipBlocks[0].id < 90 +(width*index+1))
    }
    const notTaken = shipBlocks.every(shipBlock =>!shipBlock.classList.contains('taken'));
    return {shipBlocks,valid,notTaken}
}


function addShipPiece(user,ship,startId) {
    const allBoardBlocks  = document.querySelectorAll(`#${user} div`);
    let randomBoolean = Math.random()<0.5;
    let randomStartIndex = Math.floor(Math.random()*width*width);
    let startIndex = startId? startId:randomStartIndex;
    let isHorizontal = user==='player'? angle===0:randomBoolean;

    // let validStart = isHorizontal? (startIndex <=width*width - ship.length? startIndex:width*width-ship.length):
    // // Is vertical
    // (startIndex <=width*width - width*ship.length? startIndex:
    //     startIndex-ship.length*width+width);


    // // console.log(randomStartIndex);

    // let shipBlocks = [];
    // // console.log(isHorizontal);
    // for(let i=0;i<ship.length;i++) {
    //     if(isHorizontal) {
    //         shipBlocks.push(allBoardBlocks[Number(validStart)+i]);

    //     }
    //     else {
    //         shipBlocks.push(allBoardBlocks[Number(validStart)+i*width]);
    //     }
    // }



    // let valid;
    // if(isHorizontal) {
    //     shipBlocks.every((_shipBlock,index) =>console.log('_shipBlock',index)
    //     // valid=shipBlocks[0].id % width !== width - (shipBlocks.length-(index+1))
    // )

    // }
    // else {
    //     shipBlocks.every((_shipBlock,index) =>
    //         valid = shipBlocks[0].id < 90 +(width*index+1))
    // }
    // const notTaken = shipBlocks.every(shipBlock =>!shipBlock.classList.contains('taken'));

    // console.log(shipBlocks);
    const {shipBlocks,valid,notTaken} =getvalidity(allBoardBlocks,isHorizontal,startIndex,ship)

    if(valid && notTaken) {

        shipBlocks.forEach(shipBlock=>{
            shipBlock.classList.add(ship.name);
            shipBlock.classList.add('taken');
        })
    }
    else  {

        if(user==='computer') addShipPiece(user,ship,startId)
            // {addShipPiece(user,ship,startId); }
        if(user==='player') {notDropped = true}

    }

   }


ships.forEach(ship =>addShipPiece('computer',ship) );

//drag player ship

const optionShips= Array.from(optionContainer.children);
let draggedShip;

const allPlayerBlocks = document.querySelectorAll("#player div")
allPlayerBlocks.forEach(playerBlock =>{
    playerBlock.addEventListener("dragover",dragOver)
    playerBlock.addEventListener("drop",dropShip)
})


function dragStart(e) {
    notDropped=false;
    draggedShip=e.target;

}

function dragOver(e) {
    e.preventDefault();
    const ship = ships[draggedShip.id];
    highlightArea(e.target.id, ship);
}

function dropShip(e) {
   const startId = e.target.id;
   const ship = ships[draggedShip.id];
   console.log(startId, draggedShip.id);
   addShipPiece('player',ship,startId);
   if(!notDropped) {
    draggedShip.remove();
   }
}

optionShips.forEach(optionShip=> optionShip.addEventListener('dragstart',dragStart))


// // // add highlight
function highlightArea (startIndex, ship) {
    const allBoardBlocks = document.querySelectorAll('#player div');
    let isHorizontal = angle===0;

    const {shipBlocks,valid,notTaken} =getvalidity(allBoardBlocks,isHorizontal,startIndex,ship);

    if(valid && notTaken) {
        shipBlocks.forEach(shipBlock =>{
            shipBlock.classList.add('hover')
            setTimeout(()=> shipBlock.classList.remove('hover')),500})
    }

}

let gameOver = false;
let playerTurn;

// start game
function startGame() {
    if(playerTurn===undefined) {
        if(optionContainer.children.length != 0) {
            infoDisplay.textContent = 'Please place all of your pieces first!'
        }
        else {
            const allBoardBlocks = document.querySelectorAll('#computer div');
            allBoardBlocks.forEach(block=> block.addEventListener('click',handleClick));
            playerTurn = true;
            turnDisplay.textContent = 'Your Go!';
            infoDisplay.textContent = 'The game has started!'
        }

    }
}

startButton.addEventListener('click',startGame);

let playerHits = [];
let computerHits = [];
const playerSunkShips = [];
const computerSunkShips = [];

function handleClick(e) {
    if(!gameOver) {
        if(e.target.classList.contains('taken')) {
            e.target.classList.add('boom')
            infoDisplay.textContent = 'You hit the computers ship!'
            let classes = Array.from(e.target.classList);
            classes = classes.filter(className => className != 'block');
            classes = classes.filter(className => className != 'boom');
            classes = classes.filter(className => className != 'taken');
            playerHits.push(...classes);
            checkScore('player',playerHits,playerSunkShips);

        }
        if(!e.target.classList.contains('taken')) {
            infoDisplay.textContent ='Nothing hit this time'
            e.target.classList.add('empty')
        }
        playerTurn=false;
        const allBoardBlocks = document.querySelectorAll('#computer div');
        allBoardBlocks.forEach(block=> block.replaceWith(block.cloneNode(true)));    }
        setTimeout(computerGo, 3000);
    }

    function computerGo() {
        if(!gameOver) {
            turnDisplay.textContent = 'Computer Go!';
            infoDisplay.textContent = 'The computer is thinking...';

            setTimeout((e)=>{
                let randomGo = Math.floor(Math.random()*width*width);
                const allBoardBlocks = document.querySelectorAll('#player div')

                if(allPlayerBlocks[randomGo].classList.contains('taken') &&
                allPlayerBlocks[randomGo].classList.contains('boom')) {
                    computerGo();
                    return;
                }
                else if(allPlayerBlocks[randomGo].classList.contains('taken') &&
                !allPlayerBlocks[randomGo].classList.contains('boom')) {
                    allPlayerBlocks[randomGo].classList.add('boom');
                    infoDisplay.textContent ='Computer hit your ship!!!';
                    let classes = Array.from(e.target.classList);
                    classes = classes.filter(className => className != 'block');
                    classes = classes.filter(className => className != 'boom');
                    classes = classes.filter(className => className != 'taken');
                    computerHits.push(...classes);
                    checkScore('computer',computerHits,computerSunkShips);
                }
                else {
                    infoDisplay.textContent ='Nothing hit this time';
                    allPlayerBlocks[randomGo].classList.add('empty');
                }
            },3000)

            setTimeout(()=>{
                playerTurn = true;
                turnDisplay.textContent = 'You go';
                turnDisplay.textContent = 'Please take your go';
                const allBoardBlocks = document.querySelectorAll('#computer div');
                allBoardBlocks.forEach(block=>block.addEventListener('click',handleClick))
            },6000);
        }
    }

    function checkScore(user, userHits, userSunkShips) {
        function checkShip(shipName,shipLength) {
            if(userHits.filter(storedShipName => storedShipName === shipName).length===shipLength) {
                if(user==='player') {
                    playerHits = userHits.filter(storedShipName=> storedShipName !== shipName);
                    infoDisplay.textContent = `You sunk the computer's ${shipName}`;
                }
                if(user ==='computer') {
                    infoDisplay.textContent = `The computer sunk your ship of ${shipName}`;
                    computerHits = userHits.filter(storedShipName=> storedShipName !== shipName);
                }
                userSunkShips.push(shipName);
            }
        }

        checkShip('destroyer',2);
        checkShip('submarine',3);
        checkShip('cruiser',3);
        checkShip('battleship',4);
        checkShip('carrier',5);
        console.log('playerHits',playerHits);
        console.log('playerSunkShips',playerSunkShips);

        if(playerSunkShips.length ===5) {
            infoDisplay.textContent = 'You Sunk all the computers ships, you WON!';
            gameOver=true;
        }
        if(computerSunkShips.length ===5) {
            infoDisplay.textContent = 'The computer has sunk all your ships, You LOST!';
            gameOver=true;
        }
    }

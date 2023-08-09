/*----- plan of action -----*/
// Identify and initialize state variables.
// Code the main render(), renderScores() & renderResults() functions.
// Code the click event listener, including the win logic.
// Update the renderResults() function to render the winner border.
// Code the countdown timer.

/*----- constants -----*/
const AUDIO = new Audio('https://assets.mixkit.co/sfx/preview/mixkit-simple-countdown-922.mp3');

// what might be a constant? 
// list of choices (rock, paper, scissor)
const RPS_LOOKUP = {
    r: {img: 'imgs/rock.png', beats: 's'},
    p: {img: 'imgs/paper.png', beats: 'r'},
    s: {img: 'imgs/scissors.png', beats: 'p'}
}

/*----- app's state (variables) -----*/
// What might change as gameplay proceeds? 
let scores
// scores == Object {key of 'p' -> Player scores, 't' -> 'Tie', 'c' -> Computer scores}
let results
// Used every round
// results == Object {'p': player result, represented by the value, r (rock), p (paper), s (scissors)}
let winner
// winner == String -> 'p' if player wins, t for tie, c for computer


/*----- cached element references -----*/
const pResultEl = document.getElementById('p-result')
// console.log('this is p-results', pResultEl)
const cResultEl = document.getElementById('c-result')
// console.log('this is c-results', cResultEl)
const countdownEl = document.getElementById('countdown')
// console.log('this is countdown', countdown)

/*----- functions -----*/
init()
// initializer function -> initialize our state, call render()
function init() {
    // p == player, c == computer, t == tie
    scores = {
        p: 0,
        c: 0,
        t: 0
    }
    results = {
        p: 'r',
        c: 'r'
    }
    winner = 't'

    // we will call render here
    render()
}

// renders scores -> look at scores object, display on the DOM
function renderScores() {
    // looping over scores object
    for (let key in scores) {
        const scoreEl = document.getElementById(`${key}-score`)
        scoreEl.innerText = scores[key]
    }
}
// render results -> look at the results object, display on the DOM
function renderResults() {
    pResultEl.src = RPS_LOOKUP[results.p].img
    cResultEl.src = RPS_LOOKUP[results.c].img
    // this part of the render results function
    // will display visually, who won the round(we'll see this later)
    pResultEl.style.borderColor = winner === 'p' ? 'purple' : 'white'
    cResultEl.style.borderColor = winner === 'c' ? 'purple' : 'white'
}

// render countdown -> timer will play audio and display countdown time on the dom
function renderCountdown(cbFunc) {
    // we'll start with a 3, so our timer can count 3..2..1..
    let count = 3
    // we need to display the countdown div, so we can set the text
    countdownEl.style.visibility = 'visible'
    countdownEl.innerText = count
    // our timer should update the DOM every second
    // once the timer has counted all the way down we want to display our results
    AUDIO.currentTime = 0
    AUDIO.play()
    console.log('this is the audio', AUDIO)
    const timerId = setInterval(() => {
        count--
        if (count) {
            console.log('interval running. Count: ', count)
            countdownEl.innerText = count
        } else {
            clearInterval(timerId)
            countdownEl.style.visibility = 'hidden'
            // when the timer is done, we want to show the results and the score
            // calling our callback
            cbFunc()
        }
        // timeouts and intervals use milliseconds(1/1000th of a second)
    }, 1000)
}

// render - transfers/visualizes all state to the DOM
function render() {
    // we want to display our countdown
    renderCountdown(() => {
        renderScores()
        renderResults()
    })
    // after the countdown, display the scores and results
    // renderScores()
    // results === the player and computer choices(and who wins)
    // renderResults()
}

// getRandomRPS -> will assign a choice randomly for our computer player
function getRandomRPS() {
    // figure out some way to use Math.Random to select one of our RPS_LOOKUP items
    const rps = Object.keys(RPS_LOOKUP)
    // then apply the Math.Random to do that
    const randomIndex = Math.floor(Math.random() * rps.length)
    // console.log('this is original RPS_LOOKUP', RPS_LOOKUP)
    // console.log('this is rps inside getRandomRPS', rps)
    // console.log('this is the randomIndex', randomIndex)
    // return the choice that was made
    return rps[randomIndex]
    // we'll call this function inside handleChoice(which is really our main source of control flow)
}

// we want to determine the results of a game get a winner
function getWinner() {
    // need to look at the results object
    // use the RPS_LOOKUP to see what each choice beats
    // with this function, we want to send the results(return the results)
    if (results.p === results.c) { return 't'}
    return RPS_LOOKUP[results.p].beats === results.c ? 'p' : 'c'

}

// The event listener handleChoice will be attached to our main tag,
// it will be able to read the innertext of the event target
function handleChoice(evt) {
    // handle when the user clicks on something that is not a button
    if (evt.target.tagName !== 'BUTTON') { return }
    console.log('this is event target', evt.target.innerText.toLowerCase())
    // when player clicks, change results.p to the item clicked
    results.p = evt.target.innerText.toLowerCase()
    // then randomly select for the computer
    results.c = getRandomRPS()
    // console.log('this is results.p', results.p)
    // console.log('this is results.c', results.c)
    // then determine the winner
    winner = getWinner()
    console.log('this is the winner', winner)
    // update the scores accordingly
    scores[winner] += 1
    // render the changes to the screen
    render()
}

/*----- event listeners -----*/
// we will attach our event listener, and use event target to determine the player's choice
document.querySelector('main').addEventListener('click', handleChoice)
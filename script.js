const $time = document.querySelector('time');
const $paragraph = document.querySelector('p');
const $input = document.querySelector('input');

const INITIAL_TIME = 30;
const TEXT = 'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Facilisis curae gravida magna turpis dui sociosqu pulvinar litora, metus vivamus in varius egestas scelerisque quisque, diam lacus inceptos faucibus congue ut netus. Malesuada tincidunt dapibus posuere turpis nostra in non ut, erat scelerisque mus vel commodo eu gravida, sapien eros quam auctor placerat ante netus. Dignissim aptent mi fermentum placerat torquent in fusce, ac rhoncus vitae bibendum lectus hendrerit tellus risus, orci auctor senectus nam donec arcu.';

let words = [];
let currentTime = INITIAL_TIME;

initGame()
initEvents()

function initGame() {
    words = TEXT.split(' ').slice(0, 32)
    currentTime = INITIAL_TIME

    $time.textContent = currentTime
    $paragraph.innerHTML = words.map((word, index) => {
        const letters = word.split('')

        return `
        <x-word>
            ${letters
                .map(letter => `<x-letter>${letter}</x-letter>`)
                .join('')
            }
        </x-word>
        `
    }).join('')

    const $firstWord = $paragraph.querySelector('x-word')
    $firstWord.classList.add('active')
    $firstWord.querySelector('x-letter').classList.add('active')


    const intervalId = setInterval(() => {
        currentTime--
        $time.textContent = currentTime

        if (currentTime === 0) {
            clearInterval(intervalId)
            gameOver()
        }

    }, 1000)
}

function initEvents() {
    document.addEventListener('keydown', () => {
        $input.focus()
    })
    $input.addEventListener('keydown', onKeyDown)
    $input.addEventListener('keyup', onKeyUp)
}

function onKeyDown (event) {
    const $currentWord = $paragraph.querySelector('x-word.active')
    const $currentLetter = $currentWord.querySelector('x-letter.active')

    const { key } = event
    if (key === ' ') {
      event.preventDefault()

      const $nextWord = $currentWord.nextElementSibling
      const $nextLetter = $nextWord.querySelector('x-letter')

      $currentWord.classList.remove('active', 'marked')
      $currentLetter.classList.remove('active')

      $nextWord.classList.add('active')
      $nextLetter.classList.add('active')

      $input.value = ''

      const hasMissedLetters = $currentWord
        .querySelectorAll('x-letter:not(.correct)').length > 0

      const classToAdd = hasMissedLetters ? 'marked' : 'correct'
      $currentWord.classList.add(classToAdd)

      return
    }
    if (key === 'Backspace') {
        const $prevWord = $currentWord.previousElementSibling
        const $prevLetter = $currentLetter.previousElementSibling
  
        if (!$prevWord && !$prevLetter) {
          event.preventDefault()
          return
        }
  
        const $wordMarked = $paragraph.querySelector('x-word.marked')
        if ($wordMarked && !$prevLetter) {
          event.preventDefault()
          $prevWord.classList.remove('marked')
          $prevWord.classList.add('active')
  
          const $letterToGo = $prevWord.querySelector('x-letter:last-child')
  
          $currentLetter.classList.remove('active')
          $letterToGo.classList.add('active')
  
          $input.value = [
            ...$prevWord.querySelectorAll('x-letter.correct, x-letter.incorrect')
          ].map($el => {
            return $el.classList.contains('correct') ? $el.innerText : '*'
          })
            .join('')
        }
    }
}

function onKeyUp () {
    // Recuperar los elementos actuales
    const $currentWord = $paragraph.querySelector('x-word.active')
    const $currentLetter = $currentWord.querySelector('x-letter.active')

    const currentWord = $currentWord.innerText.trim()
    $input.maxLength = currentWord.length
    console.log({ value: $input.value, currentWord })

    const $allLetters = $currentWord.querySelectorAll('x-letter')

    $allLetters.forEach($letter => $letter.classList.remove('correct', 'incorrect'))

    $input.value.split('').forEach((char, index) => {
      const $letter = $allLetters[index]
      const letterToCheck = currentWord[index]

      const isCorrect = char === letterToCheck
      const letterClass = isCorrect ? 'correct' : 'incorrect'
      $letter.classList.add(letterClass)
    })

    $currentLetter.classList.remove('active', 'is-last')
    const inputLength = $input.value.length
    const $nextActiveLetter = $allLetters[inputLength]

    if ($nextActiveLetter) {
        $nextActiveLetter.classList.add('active')
    } else {
        $currentLetter.classList.add('active', 'is-last')
        // TODO: gameover si no hay próxima palabra
    }
}

function gameOver() {
    console.log('Game Over!')
}
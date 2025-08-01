const emojis = ['🍕', '🐶', '🚗', '🌟', '🎵', '🎲', '📱', '🎯'];
const cards =[...emojis, ...emojis]
setUpGame()
function setUpGame() {
    const gameBoard = document.getElementById('game-board')
    gameBoard.innerHTML = '' // Clear previous cards before setting up new ones
    function shuffle(cards) {
        for (let i = 1; i < cards.length; i++) {
            const j = Math.floor(Math.random() * (i + 1));
            [cards[i], cards[j]] = [cards[j], cards[i]]
        }
        return cards;
    }

    const shuffleCards = shuffle(cards)

    let firstCard
    let secondCard
    let lockBoard = false
    shuffleCards.forEach((emoji, index) => {
        const card = document.createElement('div')
        card.className = 'w-20 h-20 rounded-lg bg-white flex items-center justify-center text-2xl cursor-pointer'
        card.dataset.index = index
        card.dataset.emoji = emoji
        card.textContent = ''

        card.addEventListener('click', () => {
            if (lockBoard || card.textContent !== '') return
            card.textContent = card.dataset.emoji

            if (!firstCard) {
                firstCard = card
                return
            }

            secondCard = card

            if (firstCard.dataset.emoji === secondCard.dataset.emoji) {
                firstCard = null
                secondCard = null
            } else {
                lockBoard = true
                setTimeout(() => {
                    firstCard.textContent = ''
                    secondCard.textContent = ''

                    firstCard = null
                    secondCard = null
                    lockBoard = false
                }, 1000)

            }

        })
        gameBoard.appendChild(card)
    })
    document.getElementById('reset-btn').addEventListener('click', () => {
        firstCard = null
        secondCard = null
        lockBoard = false
        setUpGame()
    })
}

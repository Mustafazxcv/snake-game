 const KEY_LEFT = 37
const KEY_UP = 38
const KEY_RIGHT = 39
const KEY_DOWN = 40

document.body.classList.toggle('has-focus', document.hasFocus())

window.onfocus = () => {
	document.body.classList.add('has-focus')
}

window.onblur = () => {
	document.body.classList.remove('has-focus')
}

class Highscore {
	constructor(game) {
		this.game = game
	}

	update(score) {
		const currentScore = this.get()

		if (score > currentScore) {
			localStorage.setItem(`${this.game}_highscore`, score)
		}
	}

	get() {
		return localStorage.getItem(`${this.game}_highscore`) || 0
	}
}

class Canvas {
	constructor(name) {
		this.canvas = document.getElementById(name)
		this.context = this.canvas.getContext('2d')
		this.width = this.canvas.width
		this.height = this.canvas.height

		this.context.font = '24px sans-serif'
		this.context.textAlign  = 'center'
		this.context.textBaseline  = 'middle'
	}

	clean() {
		this.context.clearRect(0, 0, this.canvas.width, this.canvas.height)
	}

	write(text) {
		this.clean()
		this.addText(text)
	}

	addText(text) {
		this.context.fillStyle = '#7cf20a'
		this.context.fillText(text, this.width / 2, this.height / 2)
	}

	draw(element) {
		this.clean()
		this.addElement(element)
	}

	addElement({x, y, width = 20, height = 20, color = '#7cf20a'}) {
		this.context.fillStyle = color
		this.context.fillRect(x, y, width, height)
		this.context.lineWidth = 1
		this.context.strokeStyle = '#000'
		this.context.strokeRect(x, y, width, height)
	}

	addClass(name) {
		this.canvas.classList = ''

		setTimeout(() => {
			this.canvas.classList.add(name)
		})
	}
}

class Snake {
	constructor() {
		this.scale = 20
		this.speed = 100
		this.run = null
		this.gameover = 'gameover'
		this.canvas = new Canvas('snake')
		this.highscore = new Highscore('snake')

		this.onKeyPress()
		this.setup()
		this.loading()
	}

	loading() {
		this.canvas.draw({x: 60, y: 100})
		this.canvas.addElement({x: 80, y: 100})
		this.canvas.addElement({x: 100, y: 100})
		this.canvas.addElement({x: 60, y: 120})
		this.canvas.addElement({x: 60, y: 140})
		this.canvas.addElement({x: 80, y: 140})
		this.canvas.addElement({x: 100, y: 140})
		this.canvas.addElement({x: 100, y: 160})
		this.canvas.addElement({x: 100, y: 180})
		this.canvas.addElement({x: 80, y: 180})
		this.canvas.addElement({x: 60, y: 180})

		this.canvas.addElement({x: 140, y: 100})
		this.canvas.addElement({x: 140, y: 120})
		this.canvas.addElement({x: 140, y: 140})
		this.canvas.addElement({x: 140, y: 160})
		this.canvas.addElement({x: 140, y: 180})
		this.canvas.addElement({x: 160, y: 100})
		this.canvas.addElement({x: 180, y: 100})
		this.canvas.addElement({x: 180, y: 120})
		this.canvas.addElement({x: 180, y: 140})
		this.canvas.addElement({x: 180, y: 160})
		this.canvas.addElement({x: 180, y: 180})
		this.canvas.addElement({x: 180, y: 180})

		this.canvas.addElement({x: 220, y: 100})
		this.canvas.addElement({x: 220, y: 120})
		this.canvas.addElement({x: 220, y: 140})
		this.canvas.addElement({x: 220, y: 160})
		this.canvas.addElement({x: 220, y: 180})
		this.canvas.addElement({x: 240, y: 100})
		this.canvas.addElement({x: 260, y: 100})
		this.canvas.addElement({x: 260, y: 120})
		this.canvas.addElement({x: 260, y: 140})
		this.canvas.addElement({x: 240, y: 140})
		this.canvas.addElement({x: 260, y: 160})
		this.canvas.addElement({x: 260, y: 180})

		this.canvas.addElement({x: 300, y: 100})
		this.canvas.addElement({x: 300, y: 120})
		this.canvas.addElement({x: 300, y: 140})
		this.canvas.addElement({x: 300, y: 160})
		this.canvas.addElement({x: 300, y: 180})
		this.canvas.addElement({x: 320, y: 140})
		this.canvas.addElement({x: 340, y: 120})
		this.canvas.addElement({x: 340, y: 160})
		this.canvas.addElement({x: 360, y: 100})
		this.canvas.addElement({x: 360, y: 180})

		this.canvas.addElement({x: 400, y: 100})
		this.canvas.addElement({x: 420, y: 100})
		this.canvas.addElement({x: 440, y: 100})
		this.canvas.addElement({x: 400, y: 120})
		this.canvas.addElement({x: 400, y: 140})
		this.canvas.addElement({x: 420, y: 140})
		this.canvas.addElement({x: 440, y: 140})
		this.canvas.addElement({x: 400, y: 160})
		this.canvas.addElement({x: 400, y: 180})
		this.canvas.addElement({x: 420, y: 180})
		this.canvas.addElement({x: 440, y: 180})

		setTimeout(() => this.start(), 2000)
	}

	setup() {
		this.x = 240
		this.y = 140
		this.tempMoveX = 1
		this.tempMoveY = 0
		this.length = 1
		this.tail = []

		document.querySelector('.high').innerHTML = this.highscore.get()
		document.querySelector('.current').innerHTML = 0

		this.addFood()
	}

	onKeyPress() {
		document.addEventListener('keydown', (event) => this.changeDirection(event))
	}

	changeDirection({keyCode}) {
		if (this.moveX !== 0 && (keyCode === KEY_LEFT || keyCode === KEY_RIGHT))
			return

		if (this.moveY !== 0 && (keyCode === KEY_UP || keyCode === KEY_DOWN))
			return

		switch (keyCode) {
			case KEY_LEFT:
				this.tempMoveX = -1
				this.tempMoveY = 0
				break
			case KEY_UP:
				this.tempMoveX = 0
				this.tempMoveY = -1
				break
			case KEY_RIGHT:
				this.tempMoveX = 1
				this.tempMoveY = 0
				break
			case KEY_DOWN:
				this.tempMoveX = 0
				this.tempMoveY = 1
				break
		}
	}

	start() {
		let startIn = 3

		const starting = setInterval(() => {
			this.canvas.write(`Başlatılıyor ${startIn--}`)

			if (startIn === 0) {
				clearInterval(starting)
			}
		}, 1000)
		

		setTimeout(() => this.begin(), 4000)
	}

	restart() {
		clearInterval(this.run)
		this.canvas.addClass(this.gameover)
		this.canvas.addText('KAYBETTİN')

		setTimeout(() => {
			this.setup()
			this.start()
		}, 1000)
	}

	begin() {
		this.draw()

		this.run = setInterval(() => {
			if (! document.hasFocus()) return

			this.update()
		}, this.speed)
	}

	wentOutside() {
		return this.x < 0 || this.x > (this.canvas.width - this.scale) || this.y < 0 || this.y > (this.canvas.height - this.scale)
	}

	touched() {
		return this.tail.filter((piece) => {
			return piece.x === this.x && piece.y === this.y
		}).length
	}

	addFood() {
		this.foodX = Math.floor((Math.random() * this.canvas.width / this.scale)) * this.scale
		this.foodY = Math.floor((Math.random() * this.canvas.height / this.scale)) * this.scale
	}

	ateFood() {
		if(this.foodX === this.x && this.foodY === this.y) {
			this.length++
			return true
		}

		return false
	}

	update() {
		this.moveX = this.tempMoveX
		this.moveY = this.tempMoveY

		this.tail.push({
			x: this.x,
			y: this.y
		})

		if (this.length === this.tail.length) {
			this.tail.shift()
		}

		this.x = this.x + (this.moveX * this.scale)
		this.y = this.y + (this.moveY * this.scale)

		if (this.ateFood()) {
			this.canvas.addClass('flash')

			this.highscore.update(this.length)
			this.addFood()
		}

		if (this.wentOutside() || this.touched()) {
			return this.restart()
		}

		this.draw()
	}

	draw() {
		document.querySelector('.current').innerHTML = this.length

		this.canvas.draw({
			x: this.foodX,
			y: this.foodY,
			color: '#e1fcc8'
		})

		this.tail.map((piece) => {
			this.canvas.addElement({
				x: piece.x,
				y: piece.y
			})
		})

		this.canvas.addElement({
			x: this.x,
			y: this.y
		})
	}
}

new Snake()

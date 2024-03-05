import Phaser from 'phaser'

import leaf from '../../assets/sprites/leaf/leaf_fighter.png';
import leafJSON from '../../assets/sprites/leaf/leaf_fighter.json';

/**
 * Clase que representa el jugador del juego. El jugador se mueve por el mundo usando los cursores.
 * También almacena la puntuación o número de estrellas que ha recogido hasta el momento.
 */
export default class Fighter extends Phaser.GameObjects.Sprite {

	/**
	 * Constructor del jugador
	 * @param {Phaser.Scene} scene Escena a la que pertenece el jugador
	 * @param {number} x Coordenada X
	 * @param {number} y Coordenada Y
	 */
	constructor(scene, x, y) {
		super(scene, x, y);
		this.STATES = {
			idle: 'idle',
			run: 'run',
			jump: 'j_up',
			fall: 'j_down',
			defend: 'defend',
		}
		this.cursors = this.scene.input.keyboard.createCursorKeys();

		scene.load.aseprite({key : 'leaf', textureURL : leaf, atlasURL: leafJSON});
		scene.add.sprite(x, y);
		this.anims.createFromAseprite('leaf')
		
		this.speed = 350;
		this.jumpSpeed = -800;

		this.scene.add.existing(this).setDisplaySize(35, 45);
		this.scene.physics.add.existing(this);
		// Queremos que el jugador no se salga de los límites del mundo
		this.body.setCollideWorldBounds();
		this.body.setSize(35, 45);

		this.setScale(5);

		this.state = this.STATES.idle;
		this.anims.play({key :this.state, repeat: -1});
		console.log(this.originX, this.originY);
	}

	updateAnimation(newState, oldState) {
		if(oldState === this.STATES.jump || oldState === this.STATES.fall){
			if(this.body.velocity.y > 0){
				newState = this.STATES.fall;
			}
			else if (this.body.velocity.y == 0){
				newState = this.STATES.idle;
			}
			}
		if(newState !== oldState){
			this.state = newState;
			this.anims.play({key :newState, repeat: -1});
		}
	}

	/**
	 * Métodos preUpdate de Phaser. En este caso solo se encarga del movimiento del jugador.
	 * Como se puede ver, no se tratan las colisiones con las estrellas, ya que estas colisiones 
	 * ya son gestionadas por la estrella (no gestionar las colisiones dos veces)
	 * @override
	 */
	preUpdate(t,dt) {
		super.preUpdate(t,dt);
		let newState;
		if(this.state === this.STATES.jump || this.state === this.STATES.fall){
			newState = this.state;
		}
		else if (this.cursors.up.isDown) {
			this.body.setVelocityY(this.jumpSpeed);
			newState = this.STATES.jump;
		}
		else if (this.cursors.left.isDown) {
			this.body.setVelocityX(-this.speed);
			newState = this.STATES.run;
		}
		else if (this.cursors.right.isDown) {
			this.body.setVelocityX(this.speed);
			newState = this.STATES.run;
		}
		else if(this.cursors.down.isDown){
			this.body.setVelocityX(0);
			newState = this.STATES.defend;
		}
		else {
			this.body.setVelocityX(0);
			newState = this.STATES.idle
		}
		this.updateAnimation(newState, this.state);
		//console.log(this.x, this.y, this.state)
	}
}

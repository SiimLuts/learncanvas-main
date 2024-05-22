import { Physics } from "phaser";
import { Bullet } from "./Bullet";
import { InputManager } from "./InputManager";

export class Player extends Physics.Arcade.Sprite {
    input;
    shootInterval = 500;
    lastShotTime = 0;
    ammo = 15;
    _health = 100;
    healthText; // New variable to store the health text object
    
    set health(num) {
        this._health = num;
        this.healthText.setText(`Health: ${num}`);
        
        if (num <= 0) {
            this.stop();
            this.disableBody();
            this.setRotation(90 / (Math.PI / 180));
        }
    }

    get health() {
        return this._health;
    }

    constructor(scene, x, y) {
        super(scene, x, y, 'atlas', 'elf_m_idle_anim_0');
        this.ammoCounter = scene.add.text(10, 10, this.ammo, { fontSize: '16px', fill: '#FFFFFF' });
        this.healthText = scene.add.text(300, 10, `Health: ${this.health}`, { fontSize: '16px', fill: '#FFFFFF' });
        scene.physics.add.existing(this);
        this.body.setOffset(0, 12);
        this.body.setSize(16, 16, false);
        this.body.setMaxSpeed(400);

        this.body.setDrag(800, 800);

        this.anims.create({
            key: 'elf_m_idle_anim',
            frames: this.anims.generateFrameNames('atlas', { prefix: 'elf_m_idle_anim_', start: 0, end: 3 }),
            repeat: -1,
            frameRate: 8,

        });

        this.anims.create({
            key: 'elf_m_run_anim',
            frames: this.anims.generateFrameNames('atlas', { prefix: 'elf_m_run_anim_', start: 0, end: 3 }),
            repeat: -1,
            frameRate: 8,

        });
        this.anims.create({
            key: 'elf_m_hit_anim',
            frames: this.anims.generateFrameNames('atlas', { prefix: 'elf_m_hit_anim_', start: 0, end: 0 }),
            repeat: -1,
            frameRate: 8,

        });

        this.anims.play('elf_m_idle_anim');

        this.setScale(4);
        this.input = new InputManager(scene);

    }

    isMoving() {
        this.ammoCounter.setPosition(this.x, this.y - 40);
        return this.body.speed > 0;
    }

    preUpdate(time, delta) {
        super.preUpdate(time, delta);
        if (this.input.keys.KeyA.isDown) {
            this.body.setVelocityX(-this.body.maxSpeed);
            this.setFlipX(true);
        }
        if (this.input.keys.KeyD.isDown) {
            this.body.setVelocityX(this.body.maxSpeed);
            this.setFlipX(false);
        }
        if (this.input.keys.KeyW.isDown) {
            this.body.setVelocityY(-this.body.maxSpeed);

        }
        if (this.input.keys.KeyS.isDown) {
            this.body.setVelocityY(this.body.maxSpeed);

        }
        if (this.input.keys.Space.isDown) {

            if (time - this.lastShotTime < this.shootInterval) {
                return;
            }

            if (this.ammo <= 0) {
                return;
            }
            
            this.scene.add.existing(new Bullet(this.scene, this.x, this.y, this.input.mouse));
            this.lastShotTime = time;
            this.ammo--;
            this.ammoCounter.setText(this.ammo);
        }

        if(this.isMoving()){
            this.play('elf_m_run_anim', true);
        } else {
            this.play('elf_m_idle_anim', true);
        }
    }
}

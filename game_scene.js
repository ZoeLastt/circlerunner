class game_scene extends Phaser.Scene{

    constructor(){
        super('game_scene');
    }

    preload(){
        this.load.image('player', './images/lightball.png');
        this.load.image('enemy', './images/darkball.png');
        this.load.image('pickup', './images/yellowball.png');
    }

    create(){
        this.cameras.main.setBackgroundColor('#9ACDE0');

        this.player = this.physics.add.sprite(250, 150, 'player')
        .setScale(.15)
        .setCollideWorldBounds(true)
        .setCircle(100);
        
        this.keys = this.input.keyboard.addKeys("W, A, S, D");

        this.score = 0;
        this.score_text = this.add.text(440, 10, "SCORE: " + this.score).setColor('#FDF8E2').setFontSize(26);

        this.spawn_enemy();

        var timer = this.time.addEvent({
            delay:10000, 
            callback:()=>{this.spawn_enemy();},
            loop:true
        });

    }
    
    update(){
        
        if(this.keys.W.isDown){
            const mouseX = this.input.mousePointer.worldX;
            const mouseY = this.input.mousePointer.worldY;
            this.physics.moveTo(this.player, mouseX, mouseY, 150);
        }else{
            this.player.setVelocityX(0).setVelocityY(0);
        }
    }

    spawn_enemy(){
        var x = Phaser.Math.Between(100, 200);
        var y = Phaser.Math.Between(100, 200);
        var scale = Phaser.Math.Between(1, 3);

        this.enemy = this.physics.add.sprite(30, 30, 'enemy')
        .setScale(scale / 10)
        .setCircle(100)
        .setCollideWorldBounds(true)
        .setVelocity(x, y).setBounce(1).setFriction(0, 0, 0);

        var ranX = Phaser.Math.Between(100, 500);
        var ranY = Phaser.Math.Between(100, 500);
        this.pickup = this.physics.add.sprite(ranX, ranY, 'pickup')
        .setScale(.07)
        .setCircle(100);

        this.tweens.add({
            targets: [this.pickup],
            scale: .1,
            yoyo: false,
            duration: 1000,
            ease: 'Power1',
            loop: 20
        });

        this.physics.add.overlap(this.player, this.pickup, this.increase_score, null, this);
        this.physics.add.overlap(this.player, this.enemy, this.end_game, null, this);
    }

    increase_score(){
        this.score = this.score +=1;
        this.score_text.setText("SCORE: " + this.score);
        this.pickup.destroy();
    }

    end_game(){
        this.scene.start("game_scene");
    }

}

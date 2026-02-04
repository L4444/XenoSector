import Phaser from "phaser";
import GameScene from "./Scenes/GameScene";

new Phaser.Game({
  type: Phaser.AUTO,
  width: 800,
  height: 800,
  scene: GameScene,
  physics: {
    default: "matter",
    matter: {
      debug: true,
    },
  },
});

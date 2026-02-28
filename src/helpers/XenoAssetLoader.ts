import { XenoLog } from "./XenoLogger";

export default abstract class XenoAssetLoader {
  constructor() {}

  static loadAssets(scene: Phaser.Scene) {
    XenoAssetLoader.loadImage(
      scene,
      "/assets/backgrounds/Blue Nebula 4 - 1024x1024.png",
    );
    XenoAssetLoader.loadImage(
      scene,
      "/assets/backgrounds/Blue Nebula 2 - 1024x1024.png",
    );
    XenoAssetLoader.loadImage(scene, "/assets/ships/Human-Fighter.png", true);
    XenoAssetLoader.loadImage(
      scene,
      "/assets/ships/Alien-Battleship.png",
      true,
    );
    XenoAssetLoader.loadImage(scene, "/assets/ships/Alien-Bomber.png", true);

    XenoAssetLoader.loadImage(scene, "/assets/border/red.png");

    XenoAssetLoader.loadImage(
      scene,
      "/assets/projectiles/pew-yellow.png",
      true,
    );
    XenoAssetLoader.loadImage(
      scene,
      "/assets/projectiles/pew-big-green.png",
      true,
    );
    XenoAssetLoader.loadImage(scene, "/assets/projectiles/pew-blue.png", true);
    XenoAssetLoader.loadImage(scene, "/assets/projectiles/beam.png", true);

    XenoAssetLoader.loadImage(scene, "/assets/asteroids/Asteroid.png");

    XenoAssetLoader.loadImage(scene, "/assets/ships/Shield.png");

    XenoAssetLoader.loadImage(scene, "/assets/ui/MachineGunPlaceholder.png");

    XenoAssetLoader.loadImage(scene, "/assets/ui/PlasmaCannonPlaceholder.png");

    XenoAssetLoader.loadImage(scene, "/assets/ui/RadBlasterPlaceholder.png");

    XenoAssetLoader.loadImage(scene, "/assets/particles/i_0003.png");
  }

  /**
   * Phaser loads images/sprites assuming they are facing right (when angle = 0), I assume that images/sprites face up (when angle = 0).
   * So, a *simple* solution is to rotate the image's texture 90 degrees
   * @param scene The phaser scene
   * @param textureKey The texture's key (the reference name that phaser uses)
   * @param textureUrl The url/path leading to the texture
   * @param rotate90Degrees If this going to be used for a tilesprite, don't rotate the texture.
   *
   * @remarks Don't forget to read about the last parameter
   *
   */
  private static loadImage(
    scene: Phaser.Scene,
    textureUrl: string,
    rotate90Degrees: boolean = false,
  ) {
    let tu: string = import.meta.env.BASE_URL + textureUrl;

    let matches: RegExpMatchArray | null = textureUrl.match(".+\/(.+)\....$");
    let textureKey: string = "ERROR";
    if (matches != null) {
      textureKey = matches[1];
    } else {
      XenoLog.load.error(
        " loadImage cannot parse the following url: ",
        textureUrl,
      );
    }
    XenoLog.load.debug(
      "Loaded image: \t\'" + textureKey + "\'\t from \t\'" + textureUrl + "\'",
    );
    // Rotation should be optional
    if (rotate90Degrees) {
      let tempTextureKey = textureKey + "_old";

      // get Phaser to actually load the texture.
      scene.load.image(tempTextureKey, tu);

      // Because phaser loads assets asynchronously you want to rotate the texture after it has been loaded.
      scene.load.once(`filecomplete-image-${tempTextureKey}`, () => {
        XenoAssetLoader.rotateTexture(scene, tempTextureKey, textureKey);
      });
    } else {
      // get Phaser to actually load the texture.
      scene.load.image(textureKey, tu);
    }
  }

  /**
   *
   * Rotates a texture by 90 degrees, phaser likes objects to "point" right, while I prefer my textures to point up.
   * So just rotate the texture after its been loaded.
   *
   * @param scene The Phaser scene used for "rotating" the texture
   * @param sourceTextureKey The texture key of the texture to be rotated
   * @param targetTextureKey The new rotated texture's key
   *
   * @remarks Assumes the texture is **SQUARE** (equal height and width), has not been tested on non-square textures.
   *
   */
  private static rotateTexture(
    scene: Phaser.Scene,
    sourceTextureKey: string,
    targetTextureKey: string,
  ) {
    // If the texture already exists then we don't need to create it.
    // This prevents vite generating the texture twice on HMR
    // Or human mistakes accidentally calling this function twice.
    if (scene.textures.exists(targetTextureKey)) {
      throw new Error(
        `rotateTexture: target texture "${sourceTextureKey}" already exists`,
      );
    }

    // Check if the old texture exists
    if (!scene.textures.exists(sourceTextureKey)) {
      throw new Error(
        `rotateTexture: source texture "${sourceTextureKey}" does not exist`,
      );
    }

    const temp = scene.add.image(0, 0, sourceTextureKey);

    const rt = scene.add.renderTexture(0, 0, temp.width, temp.height);

    temp.setAngle(90);

    rt.draw(temp, temp.width / 2, temp.height / 2);

    temp.destroy();

    // save as a new texture key
    rt.saveTexture(targetTextureKey);
    rt.destroy();
  }
}

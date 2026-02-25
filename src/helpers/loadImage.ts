import type GameScene from "../scenes/GameScene";
import rotateTexture from "./rotateTexture";
import { XenoLog } from "./XenoLogger";

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
export default function loadImage(
  scene: GameScene,
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
  XenoLog.load.info(
    "Loaded image: \t\'" + textureKey + "\'\t from \t\'" + textureUrl + "\'",
  );
  // Rotation should be optional
  if (rotate90Degrees) {
    let tempTextureKey = textureKey + "_old";

    // get Phaser to actually load the texture.
    scene.load.image(tempTextureKey, tu);

    // Because phaser loads assets asynchronously you want to rotate the texture after it has been loaded.
    scene.load.once(`filecomplete-image-${tempTextureKey}`, () => {
      rotateTexture(scene, tempTextureKey, textureKey);
    });
  } else {
    // get Phaser to actually load the texture.
    scene.load.image(textureKey, tu);
  }
}

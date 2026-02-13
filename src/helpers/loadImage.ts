import rotateTexture from "./rotateTexture";

/**
 * Phaser loads images/sprites assuming they are facing right (when angle = 0), I assume that images/sprites face up (when angle = 0).
 * So, a *simple* solution is to rotate the image's texture 90 degrees
 * @param scene The phaser scene
 * @param textureKey The texture's key (the reference name that phaser uses)
 * @param textureUrl The url/path leading to the texture
 * @param isTileSprite If this going to be used for a tilesprite, don't rotate the texture.
 *
 * @remarks Don't forget to read about the last parameter
 *
 */
export default function loadImage(
  scene: Phaser.Scene,
  textureKey: string,
  textureUrl: string,
  isTileSprite: boolean = false,
) {
  let tu: string = import.meta.env.BASE_URL + textureUrl;
  // Phaser doesn't like me rotating tileSprites, so skip rotation if it's going to be used for a tilesprite.
  if (!isTileSprite) {
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

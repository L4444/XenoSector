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
export default function rotateTexture(
  scene: Phaser.Scene,
  sourceTextureKey: string,
  targetTextureKey: string,
) {
  // If the texture already exists then we don't need to create it.
  // This prevents vite generating the texture twice on HMR
  // Or human mistakes accidentally calling this function twice.
  if (scene.textures.exists(targetTextureKey)) return;

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

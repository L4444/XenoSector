import type BaseEntity from "../entities/BaseEntity";
import AlertManager from "../managers/AlertManager";

/***
 *
 */
export default interface IEntityCreator {
  setupPostUpdate(postUpdate: () => void, baseEntity: BaseEntity): void;
  setupPreUpdate(preUpdate: () => void, baseEntity: BaseEntity): void;
  getAlertManager(): AlertManager;
}

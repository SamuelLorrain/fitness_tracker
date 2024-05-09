import { Storage } from "@ionic/storage";

let singleton = null;

export const PersistenceSingleton = () => {
  if (singleton == null) {
    singleton = new Storage();
  }
  return singleton;
};

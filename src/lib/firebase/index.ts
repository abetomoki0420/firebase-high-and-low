import { app } from "./core";
import {
  getDatabase,
  ref,
  onValue,
  set,
  type DataSnapshot,
} from "firebase/database";

const database = getDatabase(app);

export const dbListner = (id: string, cb: (snapshot: DataSnapshot) => void) => {
  const dbRef = ref(database, id);
  return onValue(dbRef, (snapshot) => {
    cb(snapshot);
  });
};

export const write = <T>(id: string, v: T) => {
  set(ref(database, id), v);
};

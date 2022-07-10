import { dbListner, write } from "@/lib/firebase";
import { GameInformation, ValidNumber } from "@/types/highAndLow";

const resource = "highAndLow";

export const highAndLowRpository = {
  listen: (
    cb: (snapshot: GameInformation) => void,
    initial?: GameInformation
  ) => {
    dbListner(resource, (snapshot) => {
      if (!snapshot.exists()) {
        if (initial) {
          write<GameInformation>(resource, initial);
        }

        return;
      }

      const val = snapshot.val();

      if (!isGameInformation(val)) {
        return;
      }

      cb(val);
    });
  },
  enter: ({
    information,
    name,
  }: {
    information: GameInformation;
    name: string;
  }) => {
    const firstEmpty =
      !Object.hasOwn(information, "entryUsers") ||
      !Object.hasOwn(information?.entryUsers ?? {}, "first");
    const secondEmpty = !Object.hasOwn(information?.entryUsers ?? {}, "second");

    const insertKey = firstEmpty ? "first" : secondEmpty ? "second" : "";

    if (!insertKey) {
      return;
    }

    write<GameInformation>(resource, {
      ...information,
      entryUsers: {
        ...information.entryUsers,
        [insertKey]: {
          name,
          points: 0,
        },
      },
    });
  },
  exit: ({
    information,
    name,
  }: {
    information: GameInformation;
    name: string;
  }) => {
    if (!information.entryUsers) {
      return;
    }

    if (information.entryUsers?.first?.name === name) {
      const { first, second } = information.entryUsers;

      if (second) {
        write<GameInformation>(resource, {
          ...information,
          currentTurn: "first",
          entryUsers: {
            first: second,
          },
        });
      } else {
        write<GameInformation>(resource, {
          ...information,
          currentTurn: "first",
          entryUsers: {},
        });
      }
    } else if (information.entryUsers?.second?.name === name) {
      const { second, ...remain } = information.entryUsers;
      write<GameInformation>(resource, {
        ...information,
        currentTurn: "first",
        entryUsers: {
          ...remain,
        },
      });
    }
  },
  setNumber: ({
    information,
    n,
  }: {
    information: GameInformation;
    n: number;
  }) => {
    if (!isValidNumber(n)) {
      return;
    }

    if (information.currentNumber) {
      write<GameInformation>(resource, {
        ...information,
        remainNumber: information.currentNumber,
        currentNumber: n,
      });
    } else {
      write<GameInformation>(resource, {
        ...information,
        currentNumber: n,
      });
    }
  },
  addPoints: ({ information }: { information: GameInformation }) => {
    information.entryUsers[information.currentTurn];

    write<GameInformation>(resource, {
      ...information,
      entryUsers: {
        ...information.entryUsers,
        [information.currentTurn]: {
          ...information.entryUsers[information.currentTurn],
          points:
            (information.entryUsers[information.currentTurn]?.points ?? 0) + 1,
        },
      },
    });
  },
  turn: ({ information }: { information: GameInformation }) => {
    write<GameInformation>(resource, {
      ...information,
      currentTurn: information.currentTurn === "first" ? "second" : "first",
    });
  },
};

const isGameInformation = (v: unknown): v is GameInformation => {
  if (typeof v !== "object") {
    return false;
  }

  // TODO: check correctly
  return true;
};

const isValidNumber = (n: number): n is ValidNumber => {
  if (n < 1) {
    return false;
  }

  if (13 < n) {
    return false;
  }

  return true;
};

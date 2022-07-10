export type User = {
  name: string;
  points: number;
};

export type UserType = "first" | "second";

export type ValidNumber = 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9 | 10 | 11 | 12 | 13;

export type GameInformation = {
  entryUsers: {
    first?: User;
    second?: User;
  };
  currentTurn: UserType;
  remainNumber: ValidNumber;
  currentNumber?: ValidNumber;
};

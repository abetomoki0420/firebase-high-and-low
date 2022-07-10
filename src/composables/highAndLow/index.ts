import { getRandomNumber } from "@/lib/util";
import { highAndLowRpository as repository } from "@/repositories/highAndLow";
import { GameInformation } from "@/types/highAndLow";
import { ref, computed, onMounted, onUnmounted } from "vue";

export const initial: GameInformation = {
  entryUsers: {},
  currentTurn: "first",
  remainNumber: 7,
};

export const useHighAndLow = () => {
  const player = ref<string | null>(null);

  // game information
  const information = ref<GameInformation | null>(null);

  onMounted(() => {
    repository.listen((snapshot) => {
      information.value = snapshot;
    }, initial);

    // when user reload browser, exit room
    window.onbeforeunload = exit;
  });

  onUnmounted(() => {
    exit();
  });

  const waiting = computed(() => {
    if (!information.value) {
      return true;
    }

    const { first, second } = information.value.entryUsers;

    return !first || !second;
  });

  const isPlayerTurn = computed(() => {
    if (!information.value) {
      return false;
    }

    const turn = information.value.currentTurn;

    return information.value.entryUsers[turn]?.name === player.value;
  });

  const playerPoints = computed(() => {
    if (information.value?.entryUsers.first?.name === player.value) {
      return information.value?.entryUsers.first.points ?? 0;
    }

    if (information.value?.entryUsers.second?.name === player.value) {
      return information.value?.entryUsers.second.points ?? 0;
    }

    return 0;
  });

  // Enter into game room
  const enter = (name: string) => {
    if (!information.value) {
      return;
    }

    player.value = name;

    repository.enter({
      information: information.value,
      name,
    });
  };

  const choice = (c: "high" | "low") => {
    if (!information.value) {
      return;
    }

    const genNum = getRandomNumber(1, 13);

    repository.setNumber({
      information: information.value,
      n: genNum,
    });

    switch (c) {
      case "high":
        if (genNum > information.value.remainNumber) {
          // win
          repository.addPoints({
            information: information.value,
          });
        }
        break;
      case "low":
        if (genNum < information.value.remainNumber) {
          // win
          repository.addPoints({
            information: information.value,
          });
        }
        break;
    }

    turn();
  };

  // Exit from game room
  const exit = () => {
    if (!information.value) {
      return;
    }

    if (!player.value) {
      return;
    }

    repository.exit({
      information: information.value,
      name: player.value,
    });

    player.value = "";
  };

  const turn = () => {
    if (!information.value) {
      return;
    }

    repository.turn({
      information: information.value,
    });
  };

  return {
    player,
    isPlayerTurn,
    playerPoints,
    information,
    waiting,
    enter,
    exit,
    choice,
    turn,
  };
};

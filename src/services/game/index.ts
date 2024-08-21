import { Users, Games } from "../../models";
import { IUpdateGameSessionParams } from "../../Interfaces";

const updateGameSession = async (params: IUpdateGameSessionParams) => {
  const { username, gameType, prizeMoney } = params;
  const user = await Users.findOne({ username });
  await Games.create({
    uid: user?._id,
    gameType,
    prizeMoney,
  });
};

export { updateGameSession };

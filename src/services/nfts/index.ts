import { Users, Lands } from "../../models";

const buyNftLands = async (params: any) => {
  const { landId, chainId, ownerAddress, username } = params;

  const checkLandNft = await Users.findOne({
    //address: ownerAddress,
    username: username,
    ownedLands: landId,
  });
  if (checkLandNft) {
    throw new Error("Nft is already owned!");
  }

  const updateUser = await Users.findOneAndUpdate(
    {
      //address: ownerAddress
      username: username,
    },
    { $addToSet: { ownedLands: landId } }
  );

  await Lands.create({
    ownerId: updateUser?._id,
    landId,
    // ownerAddress,
    // chainId,
  });

  return { message: "Land successfully bought", landId, username };
};

export { buyNftLands };

import { authMiddleware } from "../../middlewares";
import {
  selectWardrobe,
  selectDna,
  getWardrobeAuctionList,
  buyWardrobe,
  buyAuctionWardrobe,
  updateWardrobeAuctionStatus,
  buyNftLands,
} from "../../services";
import {
  IBuyWardRobe,
  IGetAuctionWardrobeList,
  IBuyAuctionWardRobe,
  ISelectWardRobe,
  IUpdateDna,
  IUsers,
  ISocket,
  IAuction,
} from "../../Interfaces";
import { encrypt, decrypt } from "../../utils";

const nftModule = (socket: ISocket, users: IUsers) => {
  // map nft functionality
  socket.on("onbuyLand", async (param: string) => {
    try {
      const user = await authMiddleware(socket, users);
      if (!user) {
        socket.emit("authError", { message: "User isn't authorized" });
      }

      const decryptedData: any = decrypt(param);

      const resp = await buyNftLands(decryptedData);

      socket.emit("buyLandSuccess", encrypt(resp));
    } catch (error: any) {
      console.log(error);
      socket.emit("error", { message: error.message });
    }
  });

  socket.on("selectWardrobe", async (param: string) => {
    try {
      const user = await authMiddleware(socket, users);
      if (!user) {
        socket.emit("authError", { message: "User isn't authorized" });
      }

      const decryptedData: ISelectWardRobe = decrypt(param);

      await selectWardrobe(decryptedData, user?._id);

      socket.emit(
        "selectWardrobeSuccess",
        encrypt({
          message: "Wardrobe select successful.",
          key: decryptedData.slotName,
          value: decryptedData.value,
        })
      );
    } catch (error: any) {
      console.log(error);
      socket.emit("error", { message: error.message });
    }
  });

  socket.on("updateDna", async (param: string) => {
    try {
      const user = await authMiddleware(socket, users);
      if (!user) {
        socket.emit("authError", { message: "User isn't authorized" });
      }

      const decryptedData: IUpdateDna = decrypt(param);

      await selectDna(decryptedData, user?._id);

      socket.emit(
        "updateDnaSuccess",
        encrypt({
          message: "Dna update successful.",
        })
      );
    } catch (error: any) {
      console.log(error);
      socket.emit("error", { message: error.message });
    }
  });

  socket.on("buyWardrobe", async (param: string) => {
    try {
      const user = await authMiddleware(socket, users);
      if (!user) {
        socket.emit("authError", { message: "User isn't authorized" });
      }

      const decryptedData: IBuyWardRobe = decrypt(param);

      await buyWardrobe(decryptedData, user?._id);

      socket.emit(
        "buyWardrobeSuccess",
        encrypt({
          message: "Wardrobe bought successfully.",
          key: decryptedData.slotName,
          value: decryptedData.value,
        })
      );
    } catch (error: any) {
      console.log(error);
      socket.emit("error", { message: error.message });
    }
  });

  socket.on("getWardrobeAuctionList", async (param: string) => {
    try {
      const user = await authMiddleware(socket, users);
      if (!user) {
        socket.emit("authError", { message: "User isn't authorized" });
      }

      const decryptedData: IGetAuctionWardrobeList = decrypt(param);
      const auctionList = await getWardrobeAuctionList(decryptedData);

      socket.emit(
        "getWardrobeAuctionListSuccess",
        encrypt({
          message: "Wardrobe Auction list fetched successfully.",
          auctionList,
        })
      );
    } catch (error: any) {
      console.log(error);
      socket.emit("getWardrobeAuctionListError", { message: error.message });
    }
  });

  socket.on("addWardrobeAuction", async (param: string) => {
    try {
      const user = await authMiddleware(socket, users);
      if (!user) {
        socket.emit("authError", { message: "User isn't authorized" });
      }

      const decryptedData: IAuction = decrypt(param);

      await updateWardrobeAuctionStatus(decryptedData, user?._id);

      socket.emit(
        "addWardrobeAuctionSuccess",
        encrypt({
          message: "Auction done successfully.",
          slotName: decryptedData.slotName,
          itemName: decryptedData.value.itemName,
        })
      );
    } catch (error: any) {
      console.log(error);
      socket.emit("addWardrobeAuctionFail", { message: error.message });
    }
  });

  socket.on("removeWardrobeAuction", async (param: string) => {
    try {
      const user = await authMiddleware(socket, users);
      if (!user) {
        socket.emit("authError", { message: "User isn't authorized" });
      }

      const decryptedData: IAuction = decrypt(param);

      await updateWardrobeAuctionStatus(decryptedData, user?._id);

      socket.emit(
        "removeWardrobeAuctionSuccess",
        encrypt({
          message: "Auction done successfully.",
          slotName: decryptedData.slotName,
          itemName: decryptedData.value.itemName,
        })
      );
    } catch (error: any) {
      console.log(error);
      socket.emit("removeWardrobeAuctionFail", { message: error.message });
    }
  });

  socket.on("buyAuctionWardrobe", async (param: string) => {
    try {
      const user = await authMiddleware(socket, users);
      if (!user) {
        socket.emit("authError", { message: "User isn't authorized" });
      }

      const decryptedData: IBuyAuctionWardRobe = decrypt(param);

      await buyAuctionWardrobe(decryptedData, user?._id);

      socket.to(users[decryptedData.sellerName].socketId).emit(
        "soldAuctionWardrobe",
        encrypt({
          message: "Wardrobe sold on auction successfully.",
          buyerName: socket.username,
          slotName: decryptedData.slotName,
          itemName: decryptedData.value.itemName,
        })
      );

      socket.emit(
        "buyAuctionWardrobeSuccess",
        encrypt({
          message: "Auction wardrobe bought successfully.",
          key: decryptedData.slotName,
          value: decryptedData.value.itemName,
        })
      );
    } catch (error: any) {
      console.log(error);
      socket.emit("buyAuctionWardrobeError", { message: error.message });
    }
  });
};

export default nftModule;

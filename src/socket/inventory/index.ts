import { authMiddleware } from "../../middlewares";
import {
  pickInventoryItem,
  dropInventoryItem,
  fetchInventoryItems,
} from "../../services";
import { IUsers, ISocket } from "../../Interfaces";
import { encrypt, decrypt } from "../../utils";

const inventoryModule = (socket: ISocket, users: IUsers) => {
  socket.on("pickItem", async (param: string) => {
    try {
      const user = await authMiddleware(socket, users);
      if (!user) {
        socket.emit("authError", { message: "User isn't authorized" });
      }

      const decryptedData = decrypt(param);
      console.log("Pick Item Decrypted Data", decryptedData);

      const resp = await pickInventoryItem({
        username: socket.username,
        ...decryptedData,
      });

      socket.emit("pickItemSuccess", encrypt({ message: resp.message }));
    } catch (error: any) {
      console.log(error);
      socket.emit("pickItemFailure", encrypt({ message: error?.message }));
    }
  });

  socket.on("dropItem", async (param: string) => {
    try {
      const user = await authMiddleware(socket, users);
      if (!user) {
        socket.emit("authError", { message: "User isn't authorized" });
      }

      const decryptedData = decrypt(param);

      console.log("Drop Item Decrypted Data", decryptedData);
      const resp = await dropInventoryItem({
        username: socket.username,
        ...decryptedData,
      });

      socket.emit("dropItemSuccess", encrypt({ message: resp.message }));
    } catch (error: any) {
      console.log(error);
      socket.emit("dropItemFailure", encrypt({ message: error?.message }));
    }
  });

  socket.on("fetchItems", async () => {
    try {
      const user = await authMiddleware(socket, users);
      if (!user) {
        socket.emit("authError", { message: "User isn't authorized" });
      }

      const resp = await fetchInventoryItems({
        username: socket.username,
      });

      console.log("items", resp);
      socket.emit("fetchItemsSuccess", encrypt(resp));
    } catch (error: any) {
      console.log(error);
      socket.emit("fetchItemsFailure", encrypt({ message: error?.message }));
    }
  });
};

export default inventoryModule;

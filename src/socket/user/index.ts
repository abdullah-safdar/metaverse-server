import {
  login,
  register,
  loginWithMetamask,
  connectMetamask,
  updateBalance,
} from "../../services";
import { IUsers, ISocket } from "../../Interfaces";
import { encrypt, decrypt } from "../../utils";

const authModule = (socket: ISocket, users: IUsers) => {
  socket.on("login", async (param: string) => {
    try {
      console.log("login hit");
      const decryptedData = decrypt(param);

      const response = await login(decryptedData);
      socket.username = response.userData.username;
      users[socket.username] = { ...response.userData, socketId: socket.id };

      const data = {
        message: "User login successful.",
        user: response.userData,
        characteristics: response.characteristics,
        land: response.land,
      };

      socket.emit("loginSuccess", encrypt(data));
    } catch (error: any) {
      console.log(error);

      socket.emit("authError", { message: error.message });
    }
  });

  socket.on("register", async (param: string) => {
    try {
      const decryptedData = decrypt(param);
      await register(decryptedData);

      const data = { message: "User created successful." };

      socket.emit("registerSuccess", encrypt(data));
    } catch (error: any) {
      console.log(error);

      socket.emit("authError", { message: error.message });
    }
  });

  socket.on("loginWithMetamask", async (param: string) => {
    try {
      const decryptedData = decrypt(param);

      const response = await loginWithMetamask(decryptedData);
      socket.username = response.userData.username;
      users[socket.username] = { ...response.userData, socketId: socket.id };

      const data = {
        message: "User login with metamask successful.",
        user: response.userData,
        characteristics: response.characteristics,
        land: response.land,
      };

      // const data = {
      //   message: "User login with metamask successful.",
      //   username: response.username,
      //   walletAddress: response.walletAddress,
      // };

      socket.emit("loginMetamaskSuccess", encrypt(data));
    } catch (error: any) {
      console.log(error);

      socket.emit("loginMetamaskError", { message: error.message });
    }
  });

  socket.on("connectMetamask", async (param: string) => {
    try {
      const decryptedData = decrypt(param);

      const response = await connectMetamask(decryptedData);
      //   socket.username = response.userData.username;
      //  users[socket.username] = { ...response.userData, socketId: socket.id };

      const data = {
        message: "Metamask connected successfully.",
      };

      socket.emit("connectMetamaskSuccess", encrypt(data));
    } catch (error: any) {
      console.log(error);

      socket.emit("connectMetamaskFailure", { message: error.message });
    }
  });

  socket.on("onUpdateBalance", async (param: string) => {
    try {
      const decryptedData = decrypt(param);

      const response = await updateBalance(decryptedData);

      const data = {
        message: "User balance updated Successfully.",
      };

      socket.emit("onUpdateBalanceSuccess", encrypt(data));
    } catch (error: any) {
      console.log(error);

      socket.emit("onUpdateBalanceFail", { message: error.message });
    }
  });
};

export default authModule;

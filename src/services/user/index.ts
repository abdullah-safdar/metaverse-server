import bcrypt from "bcrypt";
import { Users, Characteristics, Lands } from "../../models";
import {
  ILoginParams,
  IRegisterParams,
  IUser,
  IUpdateBalanceParams,
  ILoginWithMetamaskParams,
  IConnectMetamaskParams,
} from "../../Interfaces";
import { hashPassword } from "../../utils";

const login = async (params: ILoginParams) => {
  const { email, username, password } = params;

  let userExist: any;

  if (username) {
    userExist = await Users.findOne({ username: username.toLowerCase() });
    if (!userExist) throw new Error("Username does not exist");
  } else {
    userExist = await Users.findOne({ email });
    if (!userExist) {
      throw new Error("Email does not exist");
    }
  }

  const checkPassword = await bcrypt.compare(password, userExist.password);
  if (!checkPassword) {
    throw new Error("Password Incorrect");
  }

  const characteristics = await Characteristics.findOne(
    { uid: userExist._id },
    {
      uid: 1,
      dna: 1,
      wardrobe: 1,
      _id: 0,
    }
  );

  const land = await Lands.find({ ownerId: userExist._id }, "landId -_id");

  return {
    userData: {
      _id: userExist._id,
      email: userExist.email,
      username: userExist.username,
      amount: userExist.amount,
      balance: userExist.balance,
    },
    characteristics,
    land,
  };
};

const register = async (params: IRegisterParams) => {
  const { email, username, password, dna, wardrobe } = params;
  console.log(params);
  const user = await Users.findOne({ email });

  if (user) {
    throw new Error("Email already exists");
  }
  const hashedPassword = await hashPassword(password);

  const { _id } = await Users.create({
    email,
    username: username.toLowerCase(),
    password: hashedPassword,
  });

  await Characteristics.create({
    uid: _id,
    dna,
    wardrobe,
  });
};

const loginWithMetamask = async (params: ILoginWithMetamaskParams) => {
  const { walletAddress } = params;

  let userExist: any;

  userExist = await Users.findOne({ walletAddress });
  if (!userExist) throw new Error("User does not exist");

  const characteristics = await Characteristics.findOne(
    { uid: userExist._id },
    {
      uid: 1,
      dna: 1,
      wardrobe: 1,
      _id: 0,
    }
  );

  const land = await Lands.find({ ownerId: userExist._id }, "landId -_id");

  return {
    userData: {
      _id: userExist._id,
      email: userExist.email,
      username: userExist.username,
      balance: userExist.balance,
      walletAddress: userExist.walletAddress,
    },
    characteristics,
    land,
  };
};

const connectMetamask = async (params: IConnectMetamaskParams) => {
  const { walletAddress, username } = params;

  let userExist: any;

  userExist = await Users.findOne({ walletAddress });
  if (userExist)
    throw new Error("Wallet address is already linked with another account!");

  const checkUser = await Users.findOne({ username });

  if (checkUser) {
    await Users.findOneAndUpdate({ username }, { walletAddress });
  } else {
    await Users.create({ username, walletAddress });
  }
};

const updateBalance = async (params: IUpdateBalanceParams) => {
  const { username, balance } = params;

  await Users.findOneAndUpdate({ username }, { balance: balance });
};

export { login, register, loginWithMetamask, connectMetamask, updateBalance };

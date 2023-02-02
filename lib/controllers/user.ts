import { firestore } from "lib/firestore";
import { User } from "lib/models/user";
type address = {
  newAddress: string;
};
type userData = {
  username?: string;
};
const collection = firestore.collection("users");
export async function retrieveUserData(id) {
  return (await collection.doc(id).get()).data();
}

export async function updateUser(data: userData, id) {
  const objectKeys = Object.keys(data);
  const user = new User(id);
  await user.pull();
  for (let key of objectKeys) {
    user.data[key] = data[key];
  }
  await user.push();
  return {
    newData: user.data,
  };
}

export async function updateUserAddress(data: address, id) {
  const user = new User(id);
  await user.pull();
  user.data.address = data.newAddress;
  await user.push();
  return {
    newAddress: data.newAddress,
  };
}

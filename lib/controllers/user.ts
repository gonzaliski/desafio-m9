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
  const user = new User(id);
  await user.pull();
  user.data.username = data.username;
  await user.push();
  return {
    newUsername: data.username,
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

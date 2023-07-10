import { firestore } from "lib/firestore";
import { User } from "lib/models/user";
type address = {
  newAddress: string;
};
type userData = {
  username?: string;
};

type item = {
  id: string;
  image: string;
  title: string;
  price: number;
};
type cartItem = {
  id: string;
  imgUrl: string;
  size: string;
  title: string;
  price: number;
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

export async function addUserFavourites(newItem: item, id) {
  const user = new User(id);
  await user.pull();
  user.data.favourites.push(newItem);
  await user.push();
}

export async function retrieveUserFavourites(id) {
  const user = new User(id);
  await user.pull();
  return user.data.favourites;
}

export async function deleteUserFavourites(itemId: string, id) {
  const user = new User(id);
  await user.pull();
  user.data.favourites = user.data.favourites
    .flatMap((r) => r)
    .filter((item) => item.id !== itemId);
  await user.push();
  return;
}

export async function retrieveShoppingCart(id: string) {
  const user = new User(id);
  await user.pull();
  return user.data.shoppingCart;
}
export async function addItemToCart(newCartItem: cartItem, id) {
  const user = new User(id);
  await user.pull();
  user.data.shoppingCart.push(newCartItem);
  await user.push();
}
export async function deleteItemFromCart(itemId: string, id) {
  const user = new User(id);
  await user.pull();
  user.data.shoppingCart = user.data.shoppingCart
    .flatMap((r) => r)
    .filter((item) => item.id !== itemId);
  await user.push();
  return;
}

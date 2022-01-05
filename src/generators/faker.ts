import { Item } from "stores";
import faker from "faker";
import { User } from "types";
export default class FakerFactory {
  static createUser = () => {
    return "";
  };

  static createItems = (quantity = 10) => {
    const items: Item[] = [];
    for (let i = 0; i < quantity; i++) {
      const item: Item = {
        id: "" + i,
        image_url: faker.image.imageUrl(300, 200, undefined, true),
        name: faker.commerce.product(),
      };
      items.push(item);
    }
    return items;
  };

  static createUsers = (quantity = 10) => {
    const users: Partial<User>[] = [];

    for (let i = 0; i < quantity; i++) {
      const name = faker.name.firstName();
      const surname = faker.name.lastName();
      const user: Partial<User> = {
        name,
        surname,
        email: faker.internet.email(name, surname),
      };
      users.push(user);
    }
    return users;
  };
}

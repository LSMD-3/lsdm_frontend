import { Item } from "stores";
import faker from "faker";
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
}

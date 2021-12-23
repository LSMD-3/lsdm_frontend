type actionType = "item/toggleLike" | "item/initLikes";

interface State {
  itemLikes: string[];
}

const likeState: State = {
  itemLikes: [],
};

// This method must not raise an exception
async function toggleItemLike(itemLikes: string[], itemId: string) {
  // TODO put here api calls

  if (itemLikes.includes(itemId)) {
    return itemLikes.filter(function (el) {
      return el !== itemId;
    });
  }

  return {
    itemLikes: [...itemLikes, itemId],
  };
}

export default async function likesReducer(
  state = likeState,
  action: { payload: any; type: actionType }
) {
  switch (action.type) {
    case "item/toggleLike": {
      const itemId = action.payload;
      if (!itemId) return state;
      return await toggleItemLike(state.itemLikes, itemId);
    }

    case "item/initLikes": {
      const itemLikes = action.payload;
      if (Array.isArray(itemLikes)) return { itemLikes };
      return { itemLikes: [] };
    }

    default:
      return state;
  }
}

import AppStore from "stores/AppStore";
import sleep from "utils/helper";

type actionType = "item/toggleLike" | "item/initLikes";

interface State {
  itemLikes: string[];
}

const likeState: State = {
  itemLikes: [],
};

// This method must not raise an exception
function toggleItemLike(itemLikes: string[], itemId: string) {
  if (!itemLikes) return { itemLikes: [] };

  if (itemLikes.includes(itemId)) {
    const filtered = itemLikes.filter(function (el) {
      return el.localeCompare(itemId);
    });
    AppStore.setLikes([...filtered]);
    return { itemLikes: [...filtered] };
  }

  // TODO put here api calls
  sleep(100).then(() => {
    //  se va tutto bene apposto
    // altrimenti devo revertare lo stato
  });

  AppStore.setLikes([...itemLikes, itemId]);
  return {
    itemLikes: [...itemLikes, itemId],
  };
}

export default function likesReducer(
  state = likeState,
  action: { payload: any; type: actionType }
) {
  switch (action.type) {
    case "item/toggleLike": {
      const itemId = action.payload;
      if (!itemId) return state;
      return toggleItemLike(state.itemLikes, itemId);
    }

    case "item/initLikes": {
      const itemLikes = action.payload;
      if (Array.isArray(itemLikes)) return { itemLikes: [...itemLikes] };
      AppStore.setLikes([]);
      return { itemLikes: [] };
    }

    default:
      return state;
  }
}

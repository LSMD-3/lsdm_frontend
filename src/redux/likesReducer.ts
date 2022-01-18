import AppStore from "stores/AppStore";
import { sleep } from "utils/helper";

type actionType = "recipe/toggleLike" | "restaurant/toggleLike" | "initLikes";

export interface LikesState {
  recipesLikes: string[];
  restaurantLikes: string[];
}

const likeState: LikesState = {
  recipesLikes: [],
  restaurantLikes: [],
};

// This method must not raise an exception
function toggleItemLike(likes: string[], itemId: string) {
  if (!likes) return [];
  if (likes.includes(itemId)) {
    const filtered = likes.filter(function (el) {
      return el.localeCompare(itemId);
    });
    return [...filtered];
  }
  return [...likes, itemId];
}

function toggle(
  state: LikesState,
  type: "recipe" | "restaurant",
  itemId: string
): LikesState {
  let recipesLikes = state.recipesLikes;
  let restaurantLikes = state.restaurantLikes;
  switch (type) {
    case "recipe":
      recipesLikes = toggleItemLike(state.recipesLikes, itemId);
      break;

    case "restaurant":
      restaurantLikes = toggleItemLike(state.restaurantLikes, itemId);
      break;
  }
  AppStore.setLikes(likeState);

  return { recipesLikes, restaurantLikes };
}

export default function likesReducer(
  state = likeState,
  action: { payload: any; type: actionType }
) {
  switch (action.type) {
    case "recipe/toggleLike": {
      const recipeId = action.payload;
      if (!recipeId) return state;
      return toggle(state, "recipe", recipeId);
    }

    case "restaurant/toggleLike": {
      const restaurantId = action.payload;
      if (!restaurantId) return state;
      return toggle(state, "restaurant", restaurantId);
    }

    case "initLikes": {
      const restaurantLikes = action.payload;
      return restaurantLikes;
    }

    default:
      return state;
  }
}

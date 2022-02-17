import { TableApi } from "api";
import React, { useEffect, useState } from "react";

export default function SuperAdminHome() {
  const [result1, setresult1] = useState([
    { d: 23, dsd: "adsfdsa", dsads: "3r" },
  ]);
  // todo replace all occurences with empty useState()
  // const [result1, setresult1] = useState();

  const [result2, setresult2] = useState({
    d: 23,
    dsd: "adsfdsa",
    dsads: "3r",
  });
  const [result3, setresult3] = useState({
    d: 23,
    dsd: "adsfdsa",
    dsads: "3r",
  });
  const [result4, setresult4] = useState({
    d: 23,
    dsd: "adsfdsa",
    dsads: "3r",
  });

  const getTopRecipesOfTopVisitedRestaurants = async () => {
    const result = await TableApi.getTopRecipesOfTopVisitedRestaurants();
    setresult1(result);
  };
  const getMostVisitedRestaurant = async () => {
    const result = await TableApi.getMostVisitedRestaurant();
    setresult2(result);
  };
  const getRestaurantWithMoreDistinctOrders = async () => {
    const result = await TableApi.getRestaurantWithMoreDistinctOrders();
    setresult3(result);
  };
  const countUniqueRecipes = async () => {
    const result = await TableApi.countUniqueRecipes();
    setresult4(result);
  };

  // todo uncommment this methods

  useEffect(() => {
    // getTopRecipesOfTopVisitedRestaurants();
    // getMostVisitedRestaurant();
    // getRestaurantWithMoreDistinctOrders();
    // countUniqueRecipes();
    return () => {};
  }, []);

  return (
    <div>
      <h2>getTopRecipesOfTopVisitedRestaurants</h2>
      {JSON.stringify(result1)}
      <h2>getMostVisitedRestaurant</h2>
      {JSON.stringify(result2)}
      <h2>getRestaurantWithMoreDistinctOrders</h2>
      {JSON.stringify(result3)}
      <h2>countUniqueRecipes</h2>
      {JSON.stringify(result4)}
    </div>
  );
}

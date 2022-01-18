# User

## Profile Page

- [mike] Browse Users -> view User
- [mike] See following User

## Restaurant

- [jack] search restaurants -> join a table -> ( hide Restauran section, show table section)

## Table

- Browse Menu -> View Recipe
- View Cart -> Send Order
- Browse Order -> See Pending Order

# Waiter (assume waiter associated to a restaurant)

## Waiter Page

- Browse Orders -> View Order
- Confirm Order
- Confirm/Cancel Recipe
- Browse Table -> View Table

# Chef

## Chef Order Page

- View Orders

# Admin

## Restaurant Administration (Browse your Restaurant)

- View/Edit Tables
- Assign Staff (waiters,chef)
- Browse Recipes

## Statistics

# Super Admin

<!--  -->

getFavouritesRecipes(userId)

{
restaurant_id:"1234567",
recipes:[
{
recipe_id:"123456",
recipe_name:"pasta"
},..
]
}

1. neo4j -> ids of [{restaurant_id:"123456",recipe_id:"1234567"},...]
2. mongo -> populate [{restaurant_id:"123456",restaurant_name:"Il gatto",recipe_id:"1234567",recipe_name:"Pasta"},...]

user1 -like-> recipe1
recipe1 -in-> restaurant1

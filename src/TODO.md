# Use Cases

- edit menu informations (set ayce flag, price of menu)
- edit recipe in menu
- dobbiamo anche mettere la possibilità di scegliere il menu
- browsing complesso ristoranti -> visualizzazione tabella
- dentro il ristorante visualizzare ricette di tendenza
- sul profilo utente -> suggerire 5 ristoranti più piaciuti dai followee

# Relation

- Talk about concistency used approach
- Talk about concistency used approach

# Neo4j

- [da_integrare] create random relationships between nodes [Generator]
- [da_integrare] generateRandomUserFollows, generateRandomRestaurantLike, generateRandomRecipeLike

- add some informations in the nodes ( user email/name/surname, recipe name, restaurant name)
- random user generator -> when we create a user in mongo -> we have to create it in neo (the same for update/delete)

- CRUD restaurant - neo4j
- CRUD recipe - neo4j
- CRUD user - neo4j

- When we add a new restaurant -> store it in neo4j
- When we update a new restaurant -> update in neo4j
- Detete a restaurant -> delete restaurant and detach all relations

- When we add a new recipe to a menu -> store it in neo4j
- When we update a new recipe -> update in neo4j
- Detete a recipe -> delete recipe and detach all relations

# Statistics

- piatto più ordinato in base ad una posizione
- il piatto che ha più like
- ricette più ordinate nei ristoranti più visitati
- ranking categorie

## Neo4j

- Ricette con più like e meno like

## Se avanza tempo

- Filter for ingredients and search recipe in menu

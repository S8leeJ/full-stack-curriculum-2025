import React, { useEffect, useState } from "react";
import axios from "axios";
import { Grid } from "@mui/material";
import PokemonCard from "./PokemonCard";

function PokemonList() {

  const [pokemons, setPokmons] = useState([]);

  function fetchPokemons(){
    axios.get("https://pokeapi.co/api/v2/pokemon?limit=800")
    .then((response) => {
      setPokmons(response.data.results);
    })
  }
  useEffect(() => {
    fetchPokemons();
  }, []);

  return (
    <Grid container justifyContent="center">
      {pokemons.map((pokemon, index) => (
        <PokemonCard key={pokemon.name} pokemon={pokemon} index={index + 1}/>
      ))}
    </Grid>

  );
}

export default PokemonList;
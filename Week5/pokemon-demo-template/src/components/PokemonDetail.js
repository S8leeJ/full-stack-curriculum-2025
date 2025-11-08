import React, { useEffect, useState, useContext } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";
import { CircularProgress, Typography, Box, Chip } from "@mui/material";
import { ThemeContext } from '../context/ThemeContext';


function PokemonDetail() {



  const { name } = useParams();
  const [pokemon, setPokemon] = useState(null);
  const { theme } = useContext(ThemeContext);

  function fetchPokemonDetail() {
    axios
      .get(`https://pokeapi.co/api/v2/pokemon/${name}`)
      .then((response) => {
        setPokemon(response.data);
      });
  }

  useEffect(() => {
    fetchPokemonDetail();
  }, []);

  if (!pokemon) {
    return <CircularProgress />;
  }

  const imageUrl = pokemon.sprites.other["official-artwork"].front_default;

  return (
    <Box>
      <img src={imageUrl} alt={name} />
      <Typography variant="h4" gutterBottom sx={{ textTransform: 'capitalize' }}>
        {name.charAt(0).toUpperCase() + name.slice(1)}
      </Typography>

      <Box>
        {pokemon.types.map((typeInfo) => (
          <Chip>
            key={typeInfo.type.name}
            label={typeInfo.type.name.toUpperCase()}
            sx={{
              backgroundColor: '#e0e0e0',
            }}
          </Chip>
        ))}
      </Box>
    </Box>


  );
}

export default PokemonDetail;
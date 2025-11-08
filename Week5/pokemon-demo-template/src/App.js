import React, { useContext } from 'react';
import { Routes, Route } from 'react-router-dom';
import { ThemeProvider } from '@mui/material/styles';
import { ThemeContext } from './context/ThemeContext';
import { AppBar, Toolbar, Typography, IconButton } from '@mui/material';
import { WbSunny, NightsStay } from '@mui/icons-material';
import { Link } from 'react-router-dom';
import PokemonList from './components/PokemonList';
import PokemonDetail from './components/PokemonDetail';

function App() {

  const { theme, toggleTheme } = useContext(ThemeContext)

  return (
    <ThemeProvider theme={theme}>
      <AppBar position="sticky">
        <Toolbar>
          <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
            <Link to="/" style={{ textDecoration: 'none', color: 'inherit' }}>Pokemon App</Link>
          </Typography>
          <IconButton onClick={toggleTheme}>
            {theme.palette.mode === 'light' ? <NightsStay /> : <WbSunny />}
          </IconButton>
        </Toolbar>
      </AppBar>
      Hello World!
      <Routes>
        <Route path="/" element={<PokemonList />} />
        <Route path="/:name" element={<PokemonDetail />} />
      </Routes>
    </ThemeProvider>
  );
}

export default App;
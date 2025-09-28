import React, { Component } from "react";
import api from "../services/api";
import {
  Container,
  Header,
  Poster,
  Title,
  Genre,
  Runtime,
  Plot,
  Info,
  ListUser,
  Owner,
} from "../styles.js";

export default class User extends Component {
  state = {
    movies: [],
  };

  async componentDidMount() {
    const { route } = this.props;
    const { movie } = route.params;

    const response = await api.get(`/?s=${search}&apikey=98a00650`);
    this.setState({ movies: response.data });
  }

  render() {
    const { route } = this.props;
    const { movie } = route.params;
    const { movies } = this.state;

    return (
      <Container>
        <Header>
          <Poster source={{ uri: movie.Poster }} />
          <Title>{movie.Title}</Title>
          <Genre> Gênero: {movie.Genre}</Genre>
          <Runtime>Tempo de Duração: {movie.Runtime}</Runtime>
          <Plot>Descrição: {movie.Plot}</Plot>
        </Header>

        <ListUser
          data={movies}
          keyExtractor={(item) => item.imdbID}
          renderItem={({ item }) => (
            <Owner>
              <Poster source={{ uri: item.Poster }} />
              <Info>
                <Title>{item.Title}</Title>
                <Genre>{item.Genre}</Genre>
                <Runtime>{item.Runtime}</Runtime>
                <Plot>{item.Plot}</Plot>
              </Info>
            </Owner>
          )}
        />
      </Container>
    );
  }
}

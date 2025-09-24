import React, { Component } from "react";
import { Keyboard, ActivityIndicator } from "react-native";
import Icon from "@expo/vector-icons/MaterialIcons";
import api from "../services/api";
import AsyncStorage from "@react-native-async-storage/async-storage";
import {
  Container,
  Form,
  Input,
  SubmitButton,
  List,
  OwnerPoster,
  PosterPerfil,
  Info,
  Title,
  Author,
  GenrePerfil,
  ProfileButton,
  ProfileButtonText,
} from "../styles";

export default class Main extends Component {
  state = {
    newMovie: "",
    movies: [],
    loading: false,
  };

  async componentDidMount() {
    const movies = await AsyncStorage.getItem("movies");
    if (movies) {
      this.setState({ movies: JSON.parse(movies) });
    }
  }

  componentDidUpdate(_, prevState) {
    const { movies } = this.state;
    if (prevState.movies !== movies) {
      AsyncStorage.setItem("movies", JSON.stringify(movies));
    }
  }

  handleAddMovie = async () => {
    try {
      const { movies, newMovie } = this.state;
      this.setState({ loading: true });

      const response = await api.get(`/?t=${newMovie}&apikey=98a00650`);

      if (users.find((movies) => movies.login === response.data.login)) {
        alert("Filme já adicionado!");
        this.setState({ loading: false });
        return;;
      }

      const data = {
        Title: response.data.Title,
        Year: response.data.Year,
        Plot: response.data.Plot,
        Poster: response.data.Poster,
        imdbID: response.data.imdbID,
      };

      this.setState({
        movies: [...movies, data],
        newMovie: "",
        loading: false,
      });
      Keyboard.dismiss();

    } catch (error) {
      alert("Erro na API");
      this.setState({ loading: false });
    }
  };

  render() {
    const { movies, newMovie, loading } = this.state;

    return (
      <Container>
        <Form>
          <Input
            autoCorrect={false}
            autoCapitalize="none"
            placeholder="Adicionar filme"
            value={newMovie}
            onChangeText={(text) => this.setState({ newMovie: text })}
            returnKeyType="send"
            onSubmitEditing={this.handleAddMovie}
          />
          <SubmitButton loading={loading} onPress={this.handleAddMovie}>
            {loading ? (
              <ActivityIndicator color="#fff" />
            ) : (
              <Icon name="add" size={20} color="#fff" />
            )}
          </SubmitButton>
        </Form>

        <List
          showsVerticalScrollIndicator={false}
          data={movies}
          keyExtractor={(movie) => movie.imdbID}
          renderItem={({ item }) => (
            <OwnerPoster>
              <PosterPerfil source={{ uri: item.Poster }} />
              <Info>
                <Title>{item.Title}</Title>
                <Author>{item.Year}</Author>
                <GenrePerfil>{item.Plot}</GenrePerfil>
              </Info>
              <ProfileButton
                onPress={() =>
                  this.setState({
                    movies: movies.filter(
                      (movie) => movie.imdbID !== item.imdbID
                    ),
                  })
                }
                style={{ backgroundColor: "#FFC0CB" }}
              >
                <ProfileButtonText>Remover</ProfileButtonText>
              </ProfileButton>
            </OwnerPoster>
          )}
        />
      </Container>
    );
  }
}



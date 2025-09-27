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
  TitleMain,
  ProfileButton,
  ProfileButtonText,
  Plot,
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

    const response = await api.get(`/?t=${encodeURIComponent(newMovie)}`);

      if (movies.find((movies) => movies.imdbID === response.data.imdbID)) {
        alert("Filme já adicionado!");
        this.setState({ loading: false });
        return;
      }

      const data = {
        Title: response.data.Title,
        Plot: response.data.Plot,
        Poster: response.data.Poster,
        imdbID: response.data.imdbID,
      };
      console.log (data);

      this.setState({
        movies: [...movies, data],
        newMovie: "",
        loading: false,
      });
      Keyboard.dismiss();

    } catch (error) {
      alert("Filme não encontrado");
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
                <TitleMain>{item.Title}</TitleMain>
                <Plot>{item.Plot}</Plot>
              </Info>
              <ProfileButton
                onPress={() => {
                  this.props.navigation.navigate("movies", { movie: item });
                }}
              >
              <ProfileButtonText>Ver mais detalhes do filme</ProfileButtonText>
              </ProfileButton>
              <ProfileButton
                onPress={() => {
                  this.setState({
                    movies: movies.filter((movies) => movies.imdbID !== item.imdbID),
                  });
                }}
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
import React, { Component } from "react";
import api from "../services/api";
import {
  Container,
  Header,
  PosterPerfil,
  TitlePerfil,
  GenrePerfil,
  Plot,
  Info,
  Title,
} from "../styles.js";

export default class User extends Component {
  state = {
    movies: [],
  };

  async componentDidMount() {
    const { route } = this.props;
    const { user } = route.params;

    const response = await api.get(`/?s=${search}&apikey=98a00650`);
    this.setState({ movies: response.data });
  }

  render() {
    const { route } = this.props;
    const { user } = route.params;
    const { movies } = this.state;

    return (
      <Container>
        <Header>
          <PosterPerfil source={{ uri: user.avatar }} />
          <TitlePerfil>{user.title}</TitlePerfil>
          <GenrePerfil>{user.genre}</GenrePerfil>
        </Header>

        <Stars
          data={stars}
          keyExtractor={(star) => String(star.id)}
          renderItem={({ item }) => (
            <Starred>
              <OwnerAvatar source={{ uri: item.owner.avatar_url }} />
              <Info>
                <Title>{item.name}</Title>
              </Info>
            </Starred>
          )}
        />
      </Container>  
    );
  }
}

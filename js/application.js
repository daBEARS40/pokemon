define(["jquery", "knockout", "komapping"], ($, ko, m) => {
  class Application {
    constructor(_options) {
      ko.mapping = m;
      this.baseServiceUrl = "https://pokeapi.co/api/v2/";
      this.allPokemon = [];
      this.pokemonSearchList = ko.observableArray([]);
      this.currentSearch = "";
      this.searchLength = 0;
    }

    async startApplication() {
      await GetPokemonList.call(this);
      BindUIControls.call(this);
      ko.applyBindings(this);
    }
  }

  function GetPokemonList() {
    return new Promise((resolve) => {
      fetch(`${this.baseServiceUrl}pokemon?limit=100000&offset=0`)
        .then((response) => response.json())
        .then((data) => {
          this.allPokemon = data.results;
          $.each(data.results, (_i, v) => {
            // let obj = { name: v.name, url: v.url };
            this.pokemonSearchList.push(ko.mapping.fromJS(v));
          });
          resolve();
        });
    });
  }

  function BindUIControls() {
    $("#pokemonSearch").on("keyup", ManageSearchResults.bind(this));
  }

  function ManageSearchResults() {
    this.currentSearch = $("#pokemonSearch").val();
    if (!this.currentSearch) {
      if (this.pokemonSearchList.length !== this.allPokemon.length) {
        this.pokemonSearchList.removeAll();
        for (let i = 0; i < this.allPokemon.length; i++) {
          this.pokemonSearchList.push(ko.mapping.fromJS(this.allPokemon[i]));
        }
      }
      return;
    }
    if (this.currentSearch.length > this.searchLength) {
      TrimSearchResults.call(this);
    } else if (this.currentSearch.length < this.searchLength) {
      GrowSearchResults.call(this);
    } else {
      return;
    }
  }

  function TrimSearchResults() {
    let i = this.pokemonSearchList().length - 1;
    while (i >= 0) {
      let match = this.pokemonSearchList()[i].name().match(this.currentSearch);
      if (!match) {
        this.pokemonSearchList.remove(this.pokemonSearchList()[i]);
        this.pokemonSearchList.valueHasMutated();
      }
      i--;
    }
    this.searchLength = this.currentSearch.length;
  }

  function GrowSearchResults() {
    this.pokemonSearchList.removeAll();
    for (let i = 0; i < this.allPokemon.length; i++) {
      let match = this.allPokemon[i].name.match(this.currentSearch);
      if (match) {
        this.pokemonSearchList.push(ko.mapping.fromJS(this.allPokemon[i]));
      }
    }
    this.pokemonSearchList.valueHasMutated();
    this.searchLength = this.currentSearch.length;
  }

  return Application;
});

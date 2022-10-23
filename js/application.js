define(["jquery", "knockout", "komapping"], ($, ko, m) => {
  class Application {
    constructor(_options) {
      ko.mapping = m;
      this.baseServiceUrl = "https://pokeapi.co/api/v2/";
      this.allPokemon = [];
      this.pokemonSearchList = ko.observableArray([]);
      this.selectedPkmn = ko.observable();
      this.spriteUrl = ko.observable("");
      this.currentSearch = "";
      this.searchLength = 0;
    }

    displayPokemon(item) {
      let pkmn = ko.mapping.toJS(item);
      fetch(`${pkmn.url}`)
        .then((response) => response.json())
        .then((data) => {
          Pokemon.selectedPkmn(ko.mapping.fromJS(data));
          Pokemon.spriteUrl(
            data.sprites.other["official-artwork"].front_default
          );
          DisplayBaseStats.call(Pokemon);
        });
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
            this.pokemonSearchList.push(ko.mapping.fromJS(v));
          });
          resolve();
        });
    });
  }

  function BindUIControls() {
    $("#search-input").on("keyup", ManageSearchResults.bind(this));
  }

  function ManageSearchResults() {
    this.currentSearch = $("#search-input").val();
    if (!this.currentSearch) {
      $("#main-search-results").css("display", "none");
      $("#main-search-bar").css({
        border: "1px solid black",
        "border-radius": "5px",
      });
      if (this.pokemonSearchList.length !== this.allPokemon.length) {
        this.pokemonSearchList.removeAll();
        for (const mon of this.allPokemon) {
          this.pokemonSearchList.push(ko.mapping.fromJS(mon));
        }
        this.searchLength = 0;
      }
      return;
    }

    $("#main-search-results").css({
      display: "flex",
      "justify-content": "center",
    });

    $("#main-search-bar").css({
      border: "none",
      "border-radius": "5px 5px 0 0",
      "border-top": "1px solid black",
      "border-left": "1px solid black",
      "border-right": "1px solid black",
    });

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
      let match = this.pokemonSearchList()
        [i].name()
        .match(this.currentSearch.toLowerCase());
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
    for (const mon of this.allPokemon) {
      let match = mon.name.match(this.currentSearch.toLowerCase());
      if (match) {
        this.pokemonSearchList.push(ko.mapping.fromJS(mon));
      }
    }
    this.pokemonSearchList.valueHasMutated();
    this.searchLength = this.currentSearch.length;
  }

  function DisplayBaseStats() {
    let pkmnStats = ko.mapping.toJS(this.selectedPkmn().stats());
    $(".stat-block").css("background-color", "white");
    const valPerBlock = 17;
    $.each(pkmnStats, (i, v) => {
      let currentStat = v.stat.name;
      let boxesToFill = $($(`#stats-${currentStat}`).children()[1].children);
      let numOf15 = Math.floor(v.base_stat / valPerBlock);
      for (let i = 0; i <= numOf15; i++) {
        $(boxesToFill[i]).css("background-color", "green");
      }
    });
  }

  return Application;
});

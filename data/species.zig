//! Code generated by `tools/generate` - manual edits will be overwritten.

const gen1 = @import("../../gen1/data.zig");
const std = @import("std");

const assert = std.debug.assert;
const Stats = gen1.Stats;
const Types = gen1.Types;

/// Representation of a Generation I Pokémon species.
pub const Species = enum(u8) {
    None,
    Bulbasaur,
    Ivysaur,
    Venusaur,
    Charmander,
    Charmeleon,
    Charizard,
    Squirtle,
    Wartortle,
    Blastoise,
    Caterpie,
    Metapod,
    Butterfree,
    Weedle,
    Kakuna,
    Beedrill,
    Pidgey,
    Pidgeotto,
    Pidgeot,
    Rattata,
    Raticate,
    Spearow,
    Fearow,
    Ekans,
    Arbok,
    Pikachu,
    Raichu,
    Sandshrew,
    Sandslash,
    NidoranF,
    Nidorina,
    Nidoqueen,
    NidoranM,
    Nidorino,
    Nidoking,
    Clefairy,
    Clefable,
    Vulpix,
    Ninetales,
    Jigglypuff,
    Wigglytuff,
    Zubat,
    Golbat,
    Oddish,
    Gloom,
    Vileplume,
    Paras,
    Parasect,
    Venonat,
    Venomoth,
    Diglett,
    Dugtrio,
    Meowth,
    Persian,
    Psyduck,
    Golduck,
    Mankey,
    Primeape,
    Growlithe,
    Arcanine,
    Poliwag,
    Poliwhirl,
    Poliwrath,
    Abra,
    Kadabra,
    Alakazam,
    Machop,
    Machoke,
    Machamp,
    Bellsprout,
    Weepinbell,
    Victreebel,
    Tentacool,
    Tentacruel,
    Geodude,
    Graveler,
    Golem,
    Ponyta,
    Rapidash,
    Slowpoke,
    Slowbro,
    Magnemite,
    Magneton,
    Farfetchd,
    Doduo,
    Dodrio,
    Seel,
    Dewgong,
    Grimer,
    Muk,
    Shellder,
    Cloyster,
    Gastly,
    Haunter,
    Gengar,
    Onix,
    Drowzee,
    Hypno,
    Krabby,
    Kingler,
    Voltorb,
    Electrode,
    Exeggcute,
    Exeggutor,
    Cubone,
    Marowak,
    Hitmonlee,
    Hitmonchan,
    Lickitung,
    Koffing,
    Weezing,
    Rhyhorn,
    Rhydon,
    Chansey,
    Tangela,
    Kangaskhan,
    Horsea,
    Seadra,
    Goldeen,
    Seaking,
    Staryu,
    Starmie,
    MrMime,
    Scyther,
    Jynx,
    Electabuzz,
    Magmar,
    Pinsir,
    Tauros,
    Magikarp,
    Gyarados,
    Lapras,
    Ditto,
    Eevee,
    Vaporeon,
    Jolteon,
    Flareon,
    Porygon,
    Omanyte,
    Omastar,
    Kabuto,
    Kabutops,
    Aerodactyl,
    Snorlax,
    Articuno,
    Zapdos,
    Moltres,
    Dratini,
    Dragonair,
    Dragonite,
    Mewtwo,
    Mew,

    const CHANCES = [_]u8{
        22, // Bulbasaur
        30, // Ivysaur
        40, // Venusaur
        32, // Charmander
        40, // Charmeleon
        50, // Charizard
        21, // Squirtle
        29, // Wartortle
        39, // Blastoise
        22, // Caterpie
        15, // Metapod
        35, // Butterfree
        25, // Weedle
        17, // Kakuna
        37, // Beedrill
        28, // Pidgey
        35, // Pidgeotto
        45, // Pidgeot
        36, // Rattata
        48, // Raticate
        35, // Spearow
        50, // Fearow
        27, // Ekans
        40, // Arbok
        45, // Pikachu
        50, // Raichu
        20, // Sandshrew
        32, // Sandslash
        20, // NidoranF
        28, // Nidorina
        38, // Nidoqueen
        25, // NidoranM
        32, // Nidorino
        42, // Nidoking
        17, // Clefairy
        30, // Clefable
        32, // Vulpix
        50, // Ninetales
        10, // Jigglypuff
        22, // Wigglytuff
        27, // Zubat
        45, // Golbat
        15, // Oddish
        20, // Gloom
        25, // Vileplume
        12, // Paras
        15, // Parasect
        22, // Venonat
        45, // Venomoth
        47, // Diglett
        60, // Dugtrio
        45, // Meowth
        57, // Persian
        27, // Psyduck
        42, // Golduck
        35, // Mankey
        47, // Primeape
        30, // Growlithe
        47, // Arcanine
        45, // Poliwag
        45, // Poliwhirl
        35, // Poliwrath
        45, // Abra
        52, // Kadabra
        60, // Alakazam
        17, // Machop
        22, // Machoke
        27, // Machamp
        20, // Bellsprout
        27, // Weepinbell
        35, // Victreebel
        35, // Tentacool
        50, // Tentacruel
        10, // Geodude
        17, // Graveler
        22, // Golem
        45, // Ponyta
        52, // Rapidash
        7, // Slowpoke
        15, // Slowbro
        22, // Magnemite
        35, // Magneton
        30, // Farfetchd
        37, // Doduo
        50, // Dodrio
        22, // Seel
        35, // Dewgong
        12, // Grimer
        25, // Muk
        20, // Shellder
        35, // Cloyster
        40, // Gastly
        47, // Haunter
        55, // Gengar
        35, // Onix
        21, // Drowzee
        33, // Hypno
        25, // Krabby
        37, // Kingler
        50, // Voltorb
        70, // Electrode
        20, // Exeggcute
        27, // Exeggutor
        17, // Cubone
        22, // Marowak
        43, // Hitmonlee
        38, // Hitmonchan
        15, // Lickitung
        17, // Koffing
        30, // Weezing
        12, // Rhyhorn
        20, // Rhydon
        25, // Chansey
        30, // Tangela
        45, // Kangaskhan
        30, // Horsea
        42, // Seadra
        31, // Goldeen
        34, // Seaking
        42, // Staryu
        57, // Starmie
        45, // MrMime
        52, // Scyther
        47, // Jynx
        52, // Electabuzz
        46, // Magmar
        42, // Pinsir
        55, // Tauros
        40, // Magikarp
        40, // Gyarados
        30, // Lapras
        24, // Ditto
        27, // Eevee
        32, // Vaporeon
        65, // Jolteon
        32, // Flareon
        20, // Porygon
        17, // Omanyte
        27, // Omastar
        27, // Kabuto
        40, // Kabutops
        65, // Aerodactyl
        15, // Snorlax
        42, // Articuno
        50, // Zapdos
        45, // Moltres
        25, // Dratini
        35, // Dragonair
        40, // Dragonite
        65, // Mewtwo
        50, // Mew
    };

    /// Data associated with a Pokémon species.
    pub const Data = struct {
        /// The base stats of the Pokémon species.
        stats: Stats(u8),
        /// The typing of the Pokémon species.
        types: Types,
    };

    const DATA = [_]Data{
        // Bulbasaur
        .{
            .stats = .{ .hp = 45, .atk = 49, .def = 49, .spe = 45, .spc = 65 },
            .types = .{ .type1 = .Grass, .type2 = .Poison },
        },
        // Ivysaur
        .{
            .stats = .{ .hp = 60, .atk = 62, .def = 63, .spe = 60, .spc = 80 },
            .types = .{ .type1 = .Grass, .type2 = .Poison },
        },
        // Venusaur
        .{
            .stats = .{ .hp = 80, .atk = 82, .def = 83, .spe = 80, .spc = 100 },
            .types = .{ .type1 = .Grass, .type2 = .Poison },
        },
        // Charmander
        .{
            .stats = .{ .hp = 39, .atk = 52, .def = 43, .spe = 65, .spc = 50 },
            .types = .{ .type1 = .Fire, .type2 = .Fire },
        },
        // Charmeleon
        .{
            .stats = .{ .hp = 58, .atk = 64, .def = 58, .spe = 80, .spc = 65 },
            .types = .{ .type1 = .Fire, .type2 = .Fire },
        },
        // Charizard
        .{
            .stats = .{ .hp = 78, .atk = 84, .def = 78, .spe = 100, .spc = 85 },
            .types = .{ .type1 = .Fire, .type2 = .Flying },
        },
        // Squirtle
        .{
            .stats = .{ .hp = 44, .atk = 48, .def = 65, .spe = 43, .spc = 50 },
            .types = .{ .type1 = .Water, .type2 = .Water },
        },
        // Wartortle
        .{
            .stats = .{ .hp = 59, .atk = 63, .def = 80, .spe = 58, .spc = 65 },
            .types = .{ .type1 = .Water, .type2 = .Water },
        },
        // Blastoise
        .{
            .stats = .{ .hp = 79, .atk = 83, .def = 100, .spe = 78, .spc = 85 },
            .types = .{ .type1 = .Water, .type2 = .Water },
        },
        // Caterpie
        .{
            .stats = .{ .hp = 45, .atk = 30, .def = 35, .spe = 45, .spc = 20 },
            .types = .{ .type1 = .Bug, .type2 = .Bug },
        },
        // Metapod
        .{
            .stats = .{ .hp = 50, .atk = 20, .def = 55, .spe = 30, .spc = 25 },
            .types = .{ .type1 = .Bug, .type2 = .Bug },
        },
        // Butterfree
        .{
            .stats = .{ .hp = 60, .atk = 45, .def = 50, .spe = 70, .spc = 80 },
            .types = .{ .type1 = .Bug, .type2 = .Flying },
        },
        // Weedle
        .{
            .stats = .{ .hp = 40, .atk = 35, .def = 30, .spe = 50, .spc = 20 },
            .types = .{ .type1 = .Bug, .type2 = .Poison },
        },
        // Kakuna
        .{
            .stats = .{ .hp = 45, .atk = 25, .def = 50, .spe = 35, .spc = 25 },
            .types = .{ .type1 = .Bug, .type2 = .Poison },
        },
        // Beedrill
        .{
            .stats = .{ .hp = 65, .atk = 80, .def = 40, .spe = 75, .spc = 45 },
            .types = .{ .type1 = .Bug, .type2 = .Poison },
        },
        // Pidgey
        .{
            .stats = .{ .hp = 40, .atk = 45, .def = 40, .spe = 56, .spc = 35 },
            .types = .{ .type1 = .Normal, .type2 = .Flying },
        },
        // Pidgeotto
        .{
            .stats = .{ .hp = 63, .atk = 60, .def = 55, .spe = 71, .spc = 50 },
            .types = .{ .type1 = .Normal, .type2 = .Flying },
        },
        // Pidgeot
        .{
            .stats = .{ .hp = 83, .atk = 80, .def = 75, .spe = 91, .spc = 70 },
            .types = .{ .type1 = .Normal, .type2 = .Flying },
        },
        // Rattata
        .{
            .stats = .{ .hp = 30, .atk = 56, .def = 35, .spe = 72, .spc = 25 },
            .types = .{ .type1 = .Normal, .type2 = .Normal },
        },
        // Raticate
        .{
            .stats = .{ .hp = 55, .atk = 81, .def = 60, .spe = 97, .spc = 50 },
            .types = .{ .type1 = .Normal, .type2 = .Normal },
        },
        // Spearow
        .{
            .stats = .{ .hp = 40, .atk = 60, .def = 30, .spe = 70, .spc = 31 },
            .types = .{ .type1 = .Normal, .type2 = .Flying },
        },
        // Fearow
        .{
            .stats = .{ .hp = 65, .atk = 90, .def = 65, .spe = 100, .spc = 61 },
            .types = .{ .type1 = .Normal, .type2 = .Flying },
        },
        // Ekans
        .{
            .stats = .{ .hp = 35, .atk = 60, .def = 44, .spe = 55, .spc = 40 },
            .types = .{ .type1 = .Poison, .type2 = .Poison },
        },
        // Arbok
        .{
            .stats = .{ .hp = 60, .atk = 85, .def = 69, .spe = 80, .spc = 65 },
            .types = .{ .type1 = .Poison, .type2 = .Poison },
        },
        // Pikachu
        .{
            .stats = .{ .hp = 35, .atk = 55, .def = 30, .spe = 90, .spc = 50 },
            .types = .{ .type1 = .Electric, .type2 = .Electric },
        },
        // Raichu
        .{
            .stats = .{ .hp = 60, .atk = 90, .def = 55, .spe = 100, .spc = 90 },
            .types = .{ .type1 = .Electric, .type2 = .Electric },
        },
        // Sandshrew
        .{
            .stats = .{ .hp = 50, .atk = 75, .def = 85, .spe = 40, .spc = 30 },
            .types = .{ .type1 = .Ground, .type2 = .Ground },
        },
        // Sandslash
        .{
            .stats = .{ .hp = 75, .atk = 100, .def = 110, .spe = 65, .spc = 55 },
            .types = .{ .type1 = .Ground, .type2 = .Ground },
        },
        // NidoranF
        .{
            .stats = .{ .hp = 55, .atk = 47, .def = 52, .spe = 41, .spc = 40 },
            .types = .{ .type1 = .Poison, .type2 = .Poison },
        },
        // Nidorina
        .{
            .stats = .{ .hp = 70, .atk = 62, .def = 67, .spe = 56, .spc = 55 },
            .types = .{ .type1 = .Poison, .type2 = .Poison },
        },
        // Nidoqueen
        .{
            .stats = .{ .hp = 90, .atk = 82, .def = 87, .spe = 76, .spc = 75 },
            .types = .{ .type1 = .Poison, .type2 = .Ground },
        },
        // NidoranM
        .{
            .stats = .{ .hp = 46, .atk = 57, .def = 40, .spe = 50, .spc = 40 },
            .types = .{ .type1 = .Poison, .type2 = .Poison },
        },
        // Nidorino
        .{
            .stats = .{ .hp = 61, .atk = 72, .def = 57, .spe = 65, .spc = 55 },
            .types = .{ .type1 = .Poison, .type2 = .Poison },
        },
        // Nidoking
        .{
            .stats = .{ .hp = 81, .atk = 92, .def = 77, .spe = 85, .spc = 75 },
            .types = .{ .type1 = .Poison, .type2 = .Ground },
        },
        // Clefairy
        .{
            .stats = .{ .hp = 70, .atk = 45, .def = 48, .spe = 35, .spc = 60 },
            .types = .{ .type1 = .Normal, .type2 = .Normal },
        },
        // Clefable
        .{
            .stats = .{ .hp = 95, .atk = 70, .def = 73, .spe = 60, .spc = 85 },
            .types = .{ .type1 = .Normal, .type2 = .Normal },
        },
        // Vulpix
        .{
            .stats = .{ .hp = 38, .atk = 41, .def = 40, .spe = 65, .spc = 65 },
            .types = .{ .type1 = .Fire, .type2 = .Fire },
        },
        // Ninetales
        .{
            .stats = .{ .hp = 73, .atk = 76, .def = 75, .spe = 100, .spc = 100 },
            .types = .{ .type1 = .Fire, .type2 = .Fire },
        },
        // Jigglypuff
        .{
            .stats = .{ .hp = 115, .atk = 45, .def = 20, .spe = 20, .spc = 25 },
            .types = .{ .type1 = .Normal, .type2 = .Normal },
        },
        // Wigglytuff
        .{
            .stats = .{ .hp = 140, .atk = 70, .def = 45, .spe = 45, .spc = 50 },
            .types = .{ .type1 = .Normal, .type2 = .Normal },
        },
        // Zubat
        .{
            .stats = .{ .hp = 40, .atk = 45, .def = 35, .spe = 55, .spc = 40 },
            .types = .{ .type1 = .Poison, .type2 = .Flying },
        },
        // Golbat
        .{
            .stats = .{ .hp = 75, .atk = 80, .def = 70, .spe = 90, .spc = 75 },
            .types = .{ .type1 = .Poison, .type2 = .Flying },
        },
        // Oddish
        .{
            .stats = .{ .hp = 45, .atk = 50, .def = 55, .spe = 30, .spc = 75 },
            .types = .{ .type1 = .Grass, .type2 = .Poison },
        },
        // Gloom
        .{
            .stats = .{ .hp = 60, .atk = 65, .def = 70, .spe = 40, .spc = 85 },
            .types = .{ .type1 = .Grass, .type2 = .Poison },
        },
        // Vileplume
        .{
            .stats = .{ .hp = 75, .atk = 80, .def = 85, .spe = 50, .spc = 100 },
            .types = .{ .type1 = .Grass, .type2 = .Poison },
        },
        // Paras
        .{
            .stats = .{ .hp = 35, .atk = 70, .def = 55, .spe = 25, .spc = 55 },
            .types = .{ .type1 = .Bug, .type2 = .Grass },
        },
        // Parasect
        .{
            .stats = .{ .hp = 60, .atk = 95, .def = 80, .spe = 30, .spc = 80 },
            .types = .{ .type1 = .Bug, .type2 = .Grass },
        },
        // Venonat
        .{
            .stats = .{ .hp = 60, .atk = 55, .def = 50, .spe = 45, .spc = 40 },
            .types = .{ .type1 = .Bug, .type2 = .Poison },
        },
        // Venomoth
        .{
            .stats = .{ .hp = 70, .atk = 65, .def = 60, .spe = 90, .spc = 90 },
            .types = .{ .type1 = .Bug, .type2 = .Poison },
        },
        // Diglett
        .{
            .stats = .{ .hp = 10, .atk = 55, .def = 25, .spe = 95, .spc = 45 },
            .types = .{ .type1 = .Ground, .type2 = .Ground },
        },
        // Dugtrio
        .{
            .stats = .{ .hp = 35, .atk = 80, .def = 50, .spe = 120, .spc = 70 },
            .types = .{ .type1 = .Ground, .type2 = .Ground },
        },
        // Meowth
        .{
            .stats = .{ .hp = 40, .atk = 45, .def = 35, .spe = 90, .spc = 40 },
            .types = .{ .type1 = .Normal, .type2 = .Normal },
        },
        // Persian
        .{
            .stats = .{ .hp = 65, .atk = 70, .def = 60, .spe = 115, .spc = 65 },
            .types = .{ .type1 = .Normal, .type2 = .Normal },
        },
        // Psyduck
        .{
            .stats = .{ .hp = 50, .atk = 52, .def = 48, .spe = 55, .spc = 50 },
            .types = .{ .type1 = .Water, .type2 = .Water },
        },
        // Golduck
        .{
            .stats = .{ .hp = 80, .atk = 82, .def = 78, .spe = 85, .spc = 80 },
            .types = .{ .type1 = .Water, .type2 = .Water },
        },
        // Mankey
        .{
            .stats = .{ .hp = 40, .atk = 80, .def = 35, .spe = 70, .spc = 35 },
            .types = .{ .type1 = .Fighting, .type2 = .Fighting },
        },
        // Primeape
        .{
            .stats = .{ .hp = 65, .atk = 105, .def = 60, .spe = 95, .spc = 60 },
            .types = .{ .type1 = .Fighting, .type2 = .Fighting },
        },
        // Growlithe
        .{
            .stats = .{ .hp = 55, .atk = 70, .def = 45, .spe = 60, .spc = 50 },
            .types = .{ .type1 = .Fire, .type2 = .Fire },
        },
        // Arcanine
        .{
            .stats = .{ .hp = 90, .atk = 110, .def = 80, .spe = 95, .spc = 80 },
            .types = .{ .type1 = .Fire, .type2 = .Fire },
        },
        // Poliwag
        .{
            .stats = .{ .hp = 40, .atk = 50, .def = 40, .spe = 90, .spc = 40 },
            .types = .{ .type1 = .Water, .type2 = .Water },
        },
        // Poliwhirl
        .{
            .stats = .{ .hp = 65, .atk = 65, .def = 65, .spe = 90, .spc = 50 },
            .types = .{ .type1 = .Water, .type2 = .Water },
        },
        // Poliwrath
        .{
            .stats = .{ .hp = 90, .atk = 85, .def = 95, .spe = 70, .spc = 70 },
            .types = .{ .type1 = .Water, .type2 = .Fighting },
        },
        // Abra
        .{
            .stats = .{ .hp = 25, .atk = 20, .def = 15, .spe = 90, .spc = 105 },
            .types = .{ .type1 = .Psychic, .type2 = .Psychic },
        },
        // Kadabra
        .{
            .stats = .{ .hp = 40, .atk = 35, .def = 30, .spe = 105, .spc = 120 },
            .types = .{ .type1 = .Psychic, .type2 = .Psychic },
        },
        // Alakazam
        .{
            .stats = .{ .hp = 55, .atk = 50, .def = 45, .spe = 120, .spc = 135 },
            .types = .{ .type1 = .Psychic, .type2 = .Psychic },
        },
        // Machop
        .{
            .stats = .{ .hp = 70, .atk = 80, .def = 50, .spe = 35, .spc = 35 },
            .types = .{ .type1 = .Fighting, .type2 = .Fighting },
        },
        // Machoke
        .{
            .stats = .{ .hp = 80, .atk = 100, .def = 70, .spe = 45, .spc = 50 },
            .types = .{ .type1 = .Fighting, .type2 = .Fighting },
        },
        // Machamp
        .{
            .stats = .{ .hp = 90, .atk = 130, .def = 80, .spe = 55, .spc = 65 },
            .types = .{ .type1 = .Fighting, .type2 = .Fighting },
        },
        // Bellsprout
        .{
            .stats = .{ .hp = 50, .atk = 75, .def = 35, .spe = 40, .spc = 70 },
            .types = .{ .type1 = .Grass, .type2 = .Poison },
        },
        // Weepinbell
        .{
            .stats = .{ .hp = 65, .atk = 90, .def = 50, .spe = 55, .spc = 85 },
            .types = .{ .type1 = .Grass, .type2 = .Poison },
        },
        // Victreebel
        .{
            .stats = .{ .hp = 80, .atk = 105, .def = 65, .spe = 70, .spc = 100 },
            .types = .{ .type1 = .Grass, .type2 = .Poison },
        },
        // Tentacool
        .{
            .stats = .{ .hp = 40, .atk = 40, .def = 35, .spe = 70, .spc = 100 },
            .types = .{ .type1 = .Water, .type2 = .Poison },
        },
        // Tentacruel
        .{
            .stats = .{ .hp = 80, .atk = 70, .def = 65, .spe = 100, .spc = 120 },
            .types = .{ .type1 = .Water, .type2 = .Poison },
        },
        // Geodude
        .{
            .stats = .{ .hp = 40, .atk = 80, .def = 100, .spe = 20, .spc = 30 },
            .types = .{ .type1 = .Rock, .type2 = .Ground },
        },
        // Graveler
        .{
            .stats = .{ .hp = 55, .atk = 95, .def = 115, .spe = 35, .spc = 45 },
            .types = .{ .type1 = .Rock, .type2 = .Ground },
        },
        // Golem
        .{
            .stats = .{ .hp = 80, .atk = 110, .def = 130, .spe = 45, .spc = 55 },
            .types = .{ .type1 = .Rock, .type2 = .Ground },
        },
        // Ponyta
        .{
            .stats = .{ .hp = 50, .atk = 85, .def = 55, .spe = 90, .spc = 65 },
            .types = .{ .type1 = .Fire, .type2 = .Fire },
        },
        // Rapidash
        .{
            .stats = .{ .hp = 65, .atk = 100, .def = 70, .spe = 105, .spc = 80 },
            .types = .{ .type1 = .Fire, .type2 = .Fire },
        },
        // Slowpoke
        .{
            .stats = .{ .hp = 90, .atk = 65, .def = 65, .spe = 15, .spc = 40 },
            .types = .{ .type1 = .Water, .type2 = .Psychic },
        },
        // Slowbro
        .{
            .stats = .{ .hp = 95, .atk = 75, .def = 110, .spe = 30, .spc = 80 },
            .types = .{ .type1 = .Water, .type2 = .Psychic },
        },
        // Magnemite
        .{
            .stats = .{ .hp = 25, .atk = 35, .def = 70, .spe = 45, .spc = 95 },
            .types = .{ .type1 = .Electric, .type2 = .Electric },
        },
        // Magneton
        .{
            .stats = .{ .hp = 50, .atk = 60, .def = 95, .spe = 70, .spc = 120 },
            .types = .{ .type1 = .Electric, .type2 = .Electric },
        },
        // Farfetchd
        .{
            .stats = .{ .hp = 52, .atk = 65, .def = 55, .spe = 60, .spc = 58 },
            .types = .{ .type1 = .Normal, .type2 = .Flying },
        },
        // Doduo
        .{
            .stats = .{ .hp = 35, .atk = 85, .def = 45, .spe = 75, .spc = 35 },
            .types = .{ .type1 = .Normal, .type2 = .Flying },
        },
        // Dodrio
        .{
            .stats = .{ .hp = 60, .atk = 110, .def = 70, .spe = 100, .spc = 60 },
            .types = .{ .type1 = .Normal, .type2 = .Flying },
        },
        // Seel
        .{
            .stats = .{ .hp = 65, .atk = 45, .def = 55, .spe = 45, .spc = 70 },
            .types = .{ .type1 = .Water, .type2 = .Water },
        },
        // Dewgong
        .{
            .stats = .{ .hp = 90, .atk = 70, .def = 80, .spe = 70, .spc = 95 },
            .types = .{ .type1 = .Water, .type2 = .Ice },
        },
        // Grimer
        .{
            .stats = .{ .hp = 80, .atk = 80, .def = 50, .spe = 25, .spc = 40 },
            .types = .{ .type1 = .Poison, .type2 = .Poison },
        },
        // Muk
        .{
            .stats = .{ .hp = 105, .atk = 105, .def = 75, .spe = 50, .spc = 65 },
            .types = .{ .type1 = .Poison, .type2 = .Poison },
        },
        // Shellder
        .{
            .stats = .{ .hp = 30, .atk = 65, .def = 100, .spe = 40, .spc = 45 },
            .types = .{ .type1 = .Water, .type2 = .Water },
        },
        // Cloyster
        .{
            .stats = .{ .hp = 50, .atk = 95, .def = 180, .spe = 70, .spc = 85 },
            .types = .{ .type1 = .Water, .type2 = .Ice },
        },
        // Gastly
        .{
            .stats = .{ .hp = 30, .atk = 35, .def = 30, .spe = 80, .spc = 100 },
            .types = .{ .type1 = .Ghost, .type2 = .Poison },
        },
        // Haunter
        .{
            .stats = .{ .hp = 45, .atk = 50, .def = 45, .spe = 95, .spc = 115 },
            .types = .{ .type1 = .Ghost, .type2 = .Poison },
        },
        // Gengar
        .{
            .stats = .{ .hp = 60, .atk = 65, .def = 60, .spe = 110, .spc = 130 },
            .types = .{ .type1 = .Ghost, .type2 = .Poison },
        },
        // Onix
        .{
            .stats = .{ .hp = 35, .atk = 45, .def = 160, .spe = 70, .spc = 30 },
            .types = .{ .type1 = .Rock, .type2 = .Ground },
        },
        // Drowzee
        .{
            .stats = .{ .hp = 60, .atk = 48, .def = 45, .spe = 42, .spc = 90 },
            .types = .{ .type1 = .Psychic, .type2 = .Psychic },
        },
        // Hypno
        .{
            .stats = .{ .hp = 85, .atk = 73, .def = 70, .spe = 67, .spc = 115 },
            .types = .{ .type1 = .Psychic, .type2 = .Psychic },
        },
        // Krabby
        .{
            .stats = .{ .hp = 30, .atk = 105, .def = 90, .spe = 50, .spc = 25 },
            .types = .{ .type1 = .Water, .type2 = .Water },
        },
        // Kingler
        .{
            .stats = .{ .hp = 55, .atk = 130, .def = 115, .spe = 75, .spc = 50 },
            .types = .{ .type1 = .Water, .type2 = .Water },
        },
        // Voltorb
        .{
            .stats = .{ .hp = 40, .atk = 30, .def = 50, .spe = 100, .spc = 55 },
            .types = .{ .type1 = .Electric, .type2 = .Electric },
        },
        // Electrode
        .{
            .stats = .{ .hp = 60, .atk = 50, .def = 70, .spe = 140, .spc = 80 },
            .types = .{ .type1 = .Electric, .type2 = .Electric },
        },
        // Exeggcute
        .{
            .stats = .{ .hp = 60, .atk = 40, .def = 80, .spe = 40, .spc = 60 },
            .types = .{ .type1 = .Grass, .type2 = .Psychic },
        },
        // Exeggutor
        .{
            .stats = .{ .hp = 95, .atk = 95, .def = 85, .spe = 55, .spc = 125 },
            .types = .{ .type1 = .Grass, .type2 = .Psychic },
        },
        // Cubone
        .{
            .stats = .{ .hp = 50, .atk = 50, .def = 95, .spe = 35, .spc = 40 },
            .types = .{ .type1 = .Ground, .type2 = .Ground },
        },
        // Marowak
        .{
            .stats = .{ .hp = 60, .atk = 80, .def = 110, .spe = 45, .spc = 50 },
            .types = .{ .type1 = .Ground, .type2 = .Ground },
        },
        // Hitmonlee
        .{
            .stats = .{ .hp = 50, .atk = 120, .def = 53, .spe = 87, .spc = 35 },
            .types = .{ .type1 = .Fighting, .type2 = .Fighting },
        },
        // Hitmonchan
        .{
            .stats = .{ .hp = 50, .atk = 105, .def = 79, .spe = 76, .spc = 35 },
            .types = .{ .type1 = .Fighting, .type2 = .Fighting },
        },
        // Lickitung
        .{
            .stats = .{ .hp = 90, .atk = 55, .def = 75, .spe = 30, .spc = 60 },
            .types = .{ .type1 = .Normal, .type2 = .Normal },
        },
        // Koffing
        .{
            .stats = .{ .hp = 40, .atk = 65, .def = 95, .spe = 35, .spc = 60 },
            .types = .{ .type1 = .Poison, .type2 = .Poison },
        },
        // Weezing
        .{
            .stats = .{ .hp = 65, .atk = 90, .def = 120, .spe = 60, .spc = 85 },
            .types = .{ .type1 = .Poison, .type2 = .Poison },
        },
        // Rhyhorn
        .{
            .stats = .{ .hp = 80, .atk = 85, .def = 95, .spe = 25, .spc = 30 },
            .types = .{ .type1 = .Ground, .type2 = .Rock },
        },
        // Rhydon
        .{
            .stats = .{ .hp = 105, .atk = 130, .def = 120, .spe = 40, .spc = 45 },
            .types = .{ .type1 = .Ground, .type2 = .Rock },
        },
        // Chansey
        .{
            .stats = .{ .hp = 250, .atk = 5, .def = 5, .spe = 50, .spc = 105 },
            .types = .{ .type1 = .Normal, .type2 = .Normal },
        },
        // Tangela
        .{
            .stats = .{ .hp = 65, .atk = 55, .def = 115, .spe = 60, .spc = 100 },
            .types = .{ .type1 = .Grass, .type2 = .Grass },
        },
        // Kangaskhan
        .{
            .stats = .{ .hp = 105, .atk = 95, .def = 80, .spe = 90, .spc = 40 },
            .types = .{ .type1 = .Normal, .type2 = .Normal },
        },
        // Horsea
        .{
            .stats = .{ .hp = 30, .atk = 40, .def = 70, .spe = 60, .spc = 70 },
            .types = .{ .type1 = .Water, .type2 = .Water },
        },
        // Seadra
        .{
            .stats = .{ .hp = 55, .atk = 65, .def = 95, .spe = 85, .spc = 95 },
            .types = .{ .type1 = .Water, .type2 = .Water },
        },
        // Goldeen
        .{
            .stats = .{ .hp = 45, .atk = 67, .def = 60, .spe = 63, .spc = 50 },
            .types = .{ .type1 = .Water, .type2 = .Water },
        },
        // Seaking
        .{
            .stats = .{ .hp = 80, .atk = 92, .def = 65, .spe = 68, .spc = 80 },
            .types = .{ .type1 = .Water, .type2 = .Water },
        },
        // Staryu
        .{
            .stats = .{ .hp = 30, .atk = 45, .def = 55, .spe = 85, .spc = 70 },
            .types = .{ .type1 = .Water, .type2 = .Water },
        },
        // Starmie
        .{
            .stats = .{ .hp = 60, .atk = 75, .def = 85, .spe = 115, .spc = 100 },
            .types = .{ .type1 = .Water, .type2 = .Psychic },
        },
        // MrMime
        .{
            .stats = .{ .hp = 40, .atk = 45, .def = 65, .spe = 90, .spc = 100 },
            .types = .{ .type1 = .Psychic, .type2 = .Psychic },
        },
        // Scyther
        .{
            .stats = .{ .hp = 70, .atk = 110, .def = 80, .spe = 105, .spc = 55 },
            .types = .{ .type1 = .Bug, .type2 = .Flying },
        },
        // Jynx
        .{
            .stats = .{ .hp = 65, .atk = 50, .def = 35, .spe = 95, .spc = 95 },
            .types = .{ .type1 = .Ice, .type2 = .Psychic },
        },
        // Electabuzz
        .{
            .stats = .{ .hp = 65, .atk = 83, .def = 57, .spe = 105, .spc = 85 },
            .types = .{ .type1 = .Electric, .type2 = .Electric },
        },
        // Magmar
        .{
            .stats = .{ .hp = 65, .atk = 95, .def = 57, .spe = 93, .spc = 85 },
            .types = .{ .type1 = .Fire, .type2 = .Fire },
        },
        // Pinsir
        .{
            .stats = .{ .hp = 65, .atk = 125, .def = 100, .spe = 85, .spc = 55 },
            .types = .{ .type1 = .Bug, .type2 = .Bug },
        },
        // Tauros
        .{
            .stats = .{ .hp = 75, .atk = 100, .def = 95, .spe = 110, .spc = 70 },
            .types = .{ .type1 = .Normal, .type2 = .Normal },
        },
        // Magikarp
        .{
            .stats = .{ .hp = 20, .atk = 10, .def = 55, .spe = 80, .spc = 20 },
            .types = .{ .type1 = .Water, .type2 = .Water },
        },
        // Gyarados
        .{
            .stats = .{ .hp = 95, .atk = 125, .def = 79, .spe = 81, .spc = 100 },
            .types = .{ .type1 = .Water, .type2 = .Flying },
        },
        // Lapras
        .{
            .stats = .{ .hp = 130, .atk = 85, .def = 80, .spe = 60, .spc = 95 },
            .types = .{ .type1 = .Water, .type2 = .Ice },
        },
        // Ditto
        .{
            .stats = .{ .hp = 48, .atk = 48, .def = 48, .spe = 48, .spc = 48 },
            .types = .{ .type1 = .Normal, .type2 = .Normal },
        },
        // Eevee
        .{
            .stats = .{ .hp = 55, .atk = 55, .def = 50, .spe = 55, .spc = 65 },
            .types = .{ .type1 = .Normal, .type2 = .Normal },
        },
        // Vaporeon
        .{
            .stats = .{ .hp = 130, .atk = 65, .def = 60, .spe = 65, .spc = 110 },
            .types = .{ .type1 = .Water, .type2 = .Water },
        },
        // Jolteon
        .{
            .stats = .{ .hp = 65, .atk = 65, .def = 60, .spe = 130, .spc = 110 },
            .types = .{ .type1 = .Electric, .type2 = .Electric },
        },
        // Flareon
        .{
            .stats = .{ .hp = 65, .atk = 130, .def = 60, .spe = 65, .spc = 110 },
            .types = .{ .type1 = .Fire, .type2 = .Fire },
        },
        // Porygon
        .{
            .stats = .{ .hp = 65, .atk = 60, .def = 70, .spe = 40, .spc = 75 },
            .types = .{ .type1 = .Normal, .type2 = .Normal },
        },
        // Omanyte
        .{
            .stats = .{ .hp = 35, .atk = 40, .def = 100, .spe = 35, .spc = 90 },
            .types = .{ .type1 = .Rock, .type2 = .Water },
        },
        // Omastar
        .{
            .stats = .{ .hp = 70, .atk = 60, .def = 125, .spe = 55, .spc = 115 },
            .types = .{ .type1 = .Rock, .type2 = .Water },
        },
        // Kabuto
        .{
            .stats = .{ .hp = 30, .atk = 80, .def = 90, .spe = 55, .spc = 45 },
            .types = .{ .type1 = .Rock, .type2 = .Water },
        },
        // Kabutops
        .{
            .stats = .{ .hp = 60, .atk = 115, .def = 105, .spe = 80, .spc = 70 },
            .types = .{ .type1 = .Rock, .type2 = .Water },
        },
        // Aerodactyl
        .{
            .stats = .{ .hp = 80, .atk = 105, .def = 65, .spe = 130, .spc = 60 },
            .types = .{ .type1 = .Rock, .type2 = .Flying },
        },
        // Snorlax
        .{
            .stats = .{ .hp = 160, .atk = 110, .def = 65, .spe = 30, .spc = 65 },
            .types = .{ .type1 = .Normal, .type2 = .Normal },
        },
        // Articuno
        .{
            .stats = .{ .hp = 90, .atk = 85, .def = 100, .spe = 85, .spc = 125 },
            .types = .{ .type1 = .Ice, .type2 = .Flying },
        },
        // Zapdos
        .{
            .stats = .{ .hp = 90, .atk = 90, .def = 85, .spe = 100, .spc = 125 },
            .types = .{ .type1 = .Electric, .type2 = .Flying },
        },
        // Moltres
        .{
            .stats = .{ .hp = 90, .atk = 100, .def = 90, .spe = 90, .spc = 125 },
            .types = .{ .type1 = .Fire, .type2 = .Flying },
        },
        // Dratini
        .{
            .stats = .{ .hp = 41, .atk = 64, .def = 45, .spe = 50, .spc = 50 },
            .types = .{ .type1 = .Dragon, .type2 = .Dragon },
        },
        // Dragonair
        .{
            .stats = .{ .hp = 61, .atk = 84, .def = 65, .spe = 70, .spc = 70 },
            .types = .{ .type1 = .Dragon, .type2 = .Dragon },
        },
        // Dragonite
        .{
            .stats = .{ .hp = 91, .atk = 134, .def = 95, .spe = 80, .spc = 100 },
            .types = .{ .type1 = .Dragon, .type2 = .Flying },
        },
        // Mewtwo
        .{
            .stats = .{ .hp = 106, .atk = 110, .def = 90, .spe = 130, .spc = 154 },
            .types = .{ .type1 = .Psychic, .type2 = .Psychic },
        },
        // Mew
        .{
            .stats = .{ .hp = 100, .atk = 100, .def = 100, .spe = 100, .spc = 100 },
            .types = .{ .type1 = .Psychic, .type2 = .Psychic },
        },
    };

    comptime {
        assert(@sizeOf(Species) == 1);
    }

    /// The number of Pokémon species in this generation.
    pub const size = 151;

    /// The Pokémon's critical hit ratio out of 256.
    pub fn chance(id: Species) u8 {
        assert(id != .None);
        return CHANCES[@intFromEnum(id) - 1];
    }

    /// Returns the `Data` corresponding to the species.
    pub fn get(id: Species) Data {
        assert(id != .None);
        return DATA[@intFromEnum(id) - 1];
    }
};

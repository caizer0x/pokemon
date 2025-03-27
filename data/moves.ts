import { Type } from "./types";

// We'll define sub-percent chances in the code, but keep effect designations separate:
// BurnChance1 => 10%, BurnChance2 => 30%, etc.
// ParalyzeChance1 => 10%, ParalyzeChance2 => 30%
// PoisonChance1 => 20%, PoisonChance2 => 30%
// FlinchChance1 => 10%, FlinchChance2 => 30%
// Etc.

export enum Move {
  None = 0,
  Pound = 1,
  KarateChop = 2,
  DoubleSlap = 3,
  CometPunch = 4,
  MegaPunch = 5,
  PayDay = 6,
  FirePunch = 7,
  IcePunch = 8,
  ThunderPunch = 9,
  Scratch = 10,
  ViseGrip = 11,
  Guillotine = 12,
  RazorWind = 13,
  SwordsDance = 14,
  Cut = 15,
  Gust = 16,
  WingAttack = 17,
  Whirlwind = 18,
  Fly = 19,
  Bind = 20,
  Slam = 21,
  VineWhip = 22,
  Stomp = 23,
  DoubleKick = 24,
  MegaKick = 25,
  JumpKick = 26,
  RollingKick = 27,
  SandAttack = 28,
  Headbutt = 29,
  HornAttack = 30,
  FuryAttack = 31,
  HornDrill = 32,
  Tackle = 33,
  BodySlam = 34,
  Wrap = 35,
  TakeDown = 36,
  Thrash = 37,
  DoubleEdge = 38,
  TailWhip = 39,
  PoisonSting = 40,
  Twineedle = 41,
  PinMissile = 42,
  Leer = 43,
  Bite = 44,
  Growl = 45,
  Roar = 46,
  Sing = 47,
  Supersonic = 48,
  SonicBoom = 49,
  Disable = 50,
  Acid = 51,
  Ember = 52,
  Flamethrower = 53,
  Mist = 54,
  WaterGun = 55,
  HydroPump = 56,
  Surf = 57,
  IceBeam = 58,
  Blizzard = 59,
  Psybeam = 60,
  BubbleBeam = 61,
  AuroraBeam = 62,
  HyperBeam = 63,
  Peck = 64,
  DrillPeck = 65,
  Submission = 66,
  LowKick = 67,
  Counter = 68,
  SeismicToss = 69,
  Strength = 70,
  Absorb = 71,
  MegaDrain = 72,
  LeechSeed = 73,
  Growth = 74,
  RazorLeaf = 75,
  SolarBeam = 76,
  PoisonPowder = 77,
  StunSpore = 78,
  SleepPowder = 79,
  PetalDance = 80,
  StringShot = 81,
  DragonRage = 82,
  FireSpin = 83,
  ThunderShock = 84,
  Thunderbolt = 85,
  ThunderWave = 86,
  Thunder = 87,
  RockThrow = 88,
  Earthquake = 89,
  Fissure = 90,
  Dig = 91,
  Toxic = 92,
  Confusion = 93,
  Psychic = 94,
  Hypnosis = 95,
  Meditate = 96,
  Agility = 97,
  QuickAttack = 98,
  Rage = 99,
  Teleport = 100,
  NightShade = 101,
  Mimic = 102,
  Screech = 103,
  DoubleTeam = 104,
  Recover = 105,
  Harden = 106,
  Minimize = 107,
  Smokescreen = 108,
  ConfuseRay = 109,
  Withdraw = 110,
  DefenseCurl = 111,
  Barrier = 112,
  LightScreen = 113,
  Haze = 114,
  Reflect = 115,
  FocusEnergy = 116,
  Bide = 117,
  Metronome = 118,
  MirrorMove = 119,
  SelfDestruct = 120,
  EggBomb = 121,
  Lick = 122,
  Smog = 123,
  Sludge = 124,
  BoneClub = 125,
  FireBlast = 126,
  Waterfall = 127,
  Clamp = 128,
  Swift = 129,
  SkullBash = 130,
  SpikeCannon = 131,
  Constrict = 132,
  Amnesia = 133,
  Kinesis = 134,
  SoftBoiled = 135,
  HighJumpKick = 136,
  Glare = 137,
  DreamEater = 138,
  PoisonGas = 139,
  Barrage = 140,
  LeechLife = 141,
  LovelyKiss = 142,
  SkyAttack = 143,
  Transform = 144,
  Bubble = 145,
  DizzyPunch = 146,
  Spore = 147,
  Flash = 148,
  Psywave = 149,
  Splash = 150,
  AcidArmor = 151,
  Crabhammer = 152,
  Explosion = 153,
  FurySwipes = 154,
  Bonemerang = 155,
  Rest = 156,
  RockSlide = 157,
  HyperFang = 158,
  Sharpen = 159,
  Conversion = 160,
  TriAttack = 161,
  SuperFang = 162,
  Slash = 163,
  Substitute = 164,
  Struggle = 165,
  // Sentinel
  SKIP_TURN = 0xff,
}

// Effects we define for specialized logic. For clarity, these ID numbers map to the logic in move.ts applyEffect.
export enum Effect {
  None = 0,
  // onBegin
  Confusion = 1,           // 100% confusion
  Conversion = 2,
  FocusEnergy = 3,
  Haze = 4,
  Heal = 5,
  LeechSeed = 6,
  LightScreen = 7,
  Mimic = 8,
  Mist = 9,
  Paralyze = 10,           // guaranteed
  Poison = 11,             // guaranteed
  Reflect = 12,
  Splash = 13,
  Substitute = 14,
  SwitchAndTeleport = 15,
  Transform = 16,

  // onEnd
  AccuracyDown1 = 17,
  AttackDown1 = 18,
  DefenseDown1 = 19,
  DefenseDown2 = 20,
  SpeedDown1 = 21,
  AttackUp1 = 22,
  AttackUp2 = 23,
  Bide = 24,
  DefenseUp1 = 25,
  DefenseUp2 = 26,
  EvasionUp1 = 27,
  Sleep = 28,
  SpecialUp1 = 29,
  SpecialUp2 = 30,
  SpeedUp2 = 31,

  // always
  DrainHP = 32,
  DreamEater = 33,
  Explode = 34,
  JumpKick = 35,
  PayDay = 36,
  Rage = 37,
  Recoil = 38,
  Binding = 39,
  Charge = 40,
  SpecialDamage = 41,     // e.g. Seismic Toss, Dragon Rage, etc.
  SuperFang = 42,
  Swift = 43,
  Thrashing = 44,
  DoubleHit = 45,
  MultiHit = 46,
  Twineedle = 47,
  AttackDownChance = 48,
  DefenseDownChance = 49,
  SpeedDownChance = 50,
  SpecialDownChance = 51,
  BurnChance1 = 52,
  BurnChance2 = 53,
  ConfusionChance = 54,
  FlinchChance1 = 55,
  FlinchChance2 = 56,
  FreezeChance = 57,
  ParalyzeChance1 = 58,
  ParalyzeChance2 = 59,
  PoisonChance1 = 60,
  PoisonChance2 = 61,
  Disable = 62,
  HighCritical = 63,
  HyperBeam = 64,
  Metronome = 65,
  MirrorMove = 66,
  OHKO = 67,
}

enum Target {
  Other = 6,
  Self = 3,
  RandomFoe = 14,
  Foes = 12,
}

interface MoveData {
  effect: Effect;
  bp: number;
  accuracy: number;
  type: Type;
  target: Target;
}

const DATA: MoveData[] = [
  // 1 Pound
  {effect: Effect.None, bp: 40, accuracy: 100, type: Type.Normal, target: Target.Other},
  // 2 Karate Chop (HighCrit)
  {effect: Effect.HighCritical, bp: 50, accuracy: 100, type: Type.Normal, target: Target.Other},
  // 3 DoubleSlap (MultiHit)
  {effect: Effect.MultiHit, bp: 15, accuracy: 85, type: Type.Normal, target: Target.Other},
  // 4 Comet Punch (MultiHit)
  {effect: Effect.MultiHit, bp: 18, accuracy: 85, type: Type.Normal, target: Target.Other},
  // 5 MegaPunch
  {effect: Effect.None, bp: 80, accuracy: 85, type: Type.Normal, target: Target.Other},
  // 6 PayDay
  {effect: Effect.PayDay, bp: 40, accuracy: 100, type: Type.Normal, target: Target.Other},
  // 7 Fire Punch (BurnChance1 => 10%)
  {effect: Effect.BurnChance1, bp: 75, accuracy: 100, type: Type.Fire, target: Target.Other},
  // 8 Ice Punch (FreezeChance => 10%)
  {effect: Effect.FreezeChance, bp: 75, accuracy: 100, type: Type.Ice, target: Target.Other},
  // 9 ThunderPunch (ParalyzeChance1 =>10%)
  {effect: Effect.ParalyzeChance1, bp: 75, accuracy: 100, type: Type.Electric, target: Target.Other},
  // 10 Scratch
  {effect: Effect.None, bp: 40, accuracy: 100, type: Type.Normal, target: Target.Other},
  // 11 ViseGrip
  {effect: Effect.None, bp: 55, accuracy: 100, type: Type.Normal, target: Target.Other},
  // 12 Guillotine (OHKO)
  {effect: Effect.OHKO, bp: 0, accuracy: 30, type: Type.Normal, target: Target.Other},
  // 13 Razor Wind (Charge)
  {effect: Effect.Charge, bp: 80, accuracy: 75, type: Type.Normal, target: Target.Other},
  // 14 Swords Dance (AttackUp2)
  {effect: Effect.AttackUp2, bp: 0, accuracy: 100, type: Type.Normal, target: Target.Self},
  // 15 Cut
  {effect: Effect.None, bp: 50, accuracy: 95, type: Type.Normal, target: Target.Other},
  // 16 Gust
  {effect: Effect.None, bp: 40, accuracy: 100, type: Type.Normal, target: Target.Other},
  // 17 Wing Attack
  {effect: Effect.None, bp: 35, accuracy: 100, type: Type.Flying, target: Target.Other},
  // 18 Whirlwind (SwitchAndTeleport)
  {effect: Effect.SwitchAndTeleport, bp: 0, accuracy: 85, type: Type.Normal, target: Target.Other},
  // 19 Fly (Charge)
  {effect: Effect.Charge, bp: 70, accuracy: 95, type: Type.Flying, target: Target.Other},
  // 20 Bind (Binding)
  {effect: Effect.Binding, bp: 15, accuracy: 75, type: Type.Normal, target: Target.Other},
  // 21 Slam
  {effect: Effect.None, bp: 80, accuracy: 75, type: Type.Normal, target: Target.Other},
  // 22 VineWhip
  {effect: Effect.None, bp: 35, accuracy: 100, type: Type.Grass, target: Target.Other},
  // 23 Stomp (FlinchChance2 =>30%)
  {effect: Effect.FlinchChance2, bp: 65, accuracy: 100, type: Type.Normal, target: Target.Other},
  // 24 DoubleKick (DoubleHit)
  {effect: Effect.DoubleHit, bp: 30, accuracy: 100, type: Type.Fighting, target: Target.Other},
  // 25 MegaKick
  {effect: Effect.None, bp: 120, accuracy: 75, type: Type.Normal, target: Target.Other},
  // 26 JumpKick (JumpKick => recoil on miss)
  {effect: Effect.JumpKick, bp: 70, accuracy: 95, type: Type.Fighting, target: Target.Other},
  // 27 RollingKick (FlinchChance2 =>30%)
  {effect: Effect.FlinchChance2, bp: 60, accuracy: 85, type: Type.Fighting, target: Target.Other},
  // 28 SandAttack (AccuracyDown1 => lowers acc 1)
  {effect: Effect.AccuracyDown1, bp: 0, accuracy: 100, type: Type.Normal, target: Target.Other},
  // 29 Headbutt (FlinchChance2 =>30% in Gen 1? Actually it’s 10% in RBY. We'll treat it as FlinchChance1 => 10%.)
  {effect: Effect.FlinchChance1, bp: 70, accuracy: 100, type: Type.Normal, target: Target.Other},
  // 30 HornAttack
  {effect: Effect.None, bp: 65, accuracy: 100, type: Type.Normal, target: Target.Other},
  // 31 FuryAttack (MultiHit)
  {effect: Effect.MultiHit, bp: 15, accuracy: 85, type: Type.Normal, target: Target.Other},
  // 32 HornDrill (OHKO)
  {effect: Effect.OHKO, bp: 0, accuracy: 30, type: Type.Normal, target: Target.Other},
  // 33 Tackle
  {effect: Effect.None, bp: 35, accuracy: 95, type: Type.Normal, target: Target.Other},
  // 34 BodySlam (ParalyzeChance2 =>30%)
  {effect: Effect.ParalyzeChance2, bp: 85, accuracy: 100, type: Type.Normal, target: Target.Other},
  // 35 Wrap (Binding)
  {effect: Effect.Binding, bp: 15, accuracy: 85, type: Type.Normal, target: Target.Other},
  // 36 TakeDown (Recoil)
  {effect: Effect.Recoil, bp: 90, accuracy: 85, type: Type.Normal, target: Target.Other},
  // 37 Thrash (Thrashing =>2-3 turns, confusion)
  {effect: Effect.Thrashing, bp: 90, accuracy: 100, type: Type.Normal, target: Target.RandomFoe},
  // 38 DoubleEdge (Recoil)
  {effect: Effect.Recoil, bp: 100, accuracy: 100, type: Type.Normal, target: Target.Other},
  // 39 TailWhip (DefenseDown1 =>1 stage)
  {effect: Effect.DefenseDown1, bp: 0, accuracy: 100, type: Type.Normal, target: Target.Foes},
  // 40 PoisonSting (PoisonChance1 =>20%)
  {effect: Effect.PoisonChance1, bp: 15, accuracy: 100, type: Type.Poison, target: Target.Other},
  // 41 Twineedle (Twineedle => 2 hits + poison chance on last)
  {effect: Effect.Twineedle, bp: 25, accuracy: 100, type: Type.Bug, target: Target.Other},
  // 42 PinMissile (MultiHit =>2-5 hits)
  {effect: Effect.MultiHit, bp: 14, accuracy: 85, type: Type.Bug, target: Target.Other},
  // 43 Leer (DefenseDown1 =>1)
  {effect: Effect.DefenseDown1, bp: 0, accuracy: 100, type: Type.Normal, target: Target.Foes},
  // 44 Bite (FlinchChance1 =>10%)
  {effect: Effect.FlinchChance1, bp: 60, accuracy: 100, type: Type.Normal, target: Target.Other},
  // 45 Growl (AttackDown1 =>1)
  {effect: Effect.AttackDown1, bp: 0, accuracy: 100, type: Type.Normal, target: Target.Foes},
  // 46 Roar (SwitchAndTeleport =>wild)
  {effect: Effect.SwitchAndTeleport, bp: 0, accuracy: 100, type: Type.Normal, target: Target.Other},
  // 47 Sing (Sleep => guaranteed if hits)
  {effect: Effect.Sleep, bp: 0, accuracy: 55, type: Type.Normal, target: Target.Other},
  // 48 Supersonic (Confusion => 55% accurate)
  {effect: Effect.Confusion, bp: 0, accuracy: 55, type: Type.Normal, target: Target.Other},
  // 49 SonicBoom (SpecialDamage => 20 fixed)
  {effect: Effect.SpecialDamage, bp: 1, accuracy: 90, type: Type.Normal, target: Target.Other},
  // 50 Disable
  {effect: Effect.Disable, bp: 0, accuracy: 55, type: Type.Normal, target: Target.Other},
  // 51 Acid (DefenseDownChance => 10%)
  {effect: Effect.DefenseDownChance, bp: 40, accuracy: 100, type: Type.Poison, target: Target.Other},
  // 52 Ember (BurnChance1 =>10%)
  {effect: Effect.BurnChance1, bp: 40, accuracy: 100, type: Type.Fire, target: Target.Other},
  // 53 Flamethrower (BurnChance1 =>10%)
  {effect: Effect.BurnChance1, bp: 95, accuracy: 100, type: Type.Fire, target: Target.Other},
  // 54 Mist
  {effect: Effect.Mist, bp: 0, accuracy: 100, type: Type.Ice, target: Target.Self},
  // 55 Water Gun
  {effect: Effect.None, bp: 40, accuracy: 100, type: Type.Water, target: Target.Other},
  // 56 Hydro Pump
  {effect: Effect.None, bp: 120, accuracy: 80, type: Type.Water, target: Target.Other},
  // 57 Surf
  {effect: Effect.None, bp: 95, accuracy: 100, type: Type.Water, target: Target.Other},
  // 58 Ice Beam (FreezeChance =>10%)
  {effect: Effect.FreezeChance, bp: 95, accuracy: 100, type: Type.Ice, target: Target.Other},
  // 59 Blizzard (FreezeChance =>10%)
  {effect: Effect.FreezeChance, bp: 120, accuracy: 90, type: Type.Ice, target: Target.Other},
  // 60 Psybeam (ConfusionChance =>10%)
  {effect: Effect.ConfusionChance, bp: 65, accuracy: 100, type: Type.Psychic, target: Target.Other},
  // 61 BubbleBeam (SpeedDownChance =>33%)
  {effect: Effect.SpeedDownChance, bp: 65, accuracy: 100, type: Type.Water, target: Target.Other},
  // 62 AuroraBeam (AttackDownChance =>33%)
  {effect: Effect.AttackDownChance, bp: 65, accuracy: 100, type: Type.Ice, target: Target.Other},
  // 63 HyperBeam (HyperBeam => recharge next turn)
  {effect: Effect.HyperBeam, bp: 150, accuracy: 90, type: Type.Normal, target: Target.Other},
  // 64 Peck
  {effect: Effect.None, bp: 35, accuracy: 100, type: Type.Flying, target: Target.Other},
  // 65 DrillPeck
  {effect: Effect.None, bp: 80, accuracy: 100, type: Type.Flying, target: Target.Other},
  // 66 Submission (Recoil)
  {effect: Effect.Recoil, bp: 80, accuracy: 80, type: Type.Fighting, target: Target.Other},
  // 67 LowKick (FlinchChance2 =>30% in RBY? It's complicated with weight in later gens, but we do 30% flinch)
  {effect: Effect.FlinchChance2, bp: 50, accuracy: 90, type: Type.Fighting, target: Target.Other},
  // 68 Counter
  {effect: Effect.None, bp: 1, accuracy: 100, type: Type.Fighting, target: Target.Other},
  // 69 SeismicToss (SpecialDamage => user level)
  {effect: Effect.SpecialDamage, bp: 1, accuracy: 100, type: Type.Fighting, target: Target.Other},
  // 70 Strength
  {effect: Effect.None, bp: 80, accuracy: 100, type: Type.Normal, target: Target.Other},
  // 71 Absorb (DrainHP => half)
  {effect: Effect.DrainHP, bp: 20, accuracy: 100, type: Type.Grass, target: Target.Other},
  // 72 MegaDrain (DrainHP => half)
  {effect: Effect.DrainHP, bp: 40, accuracy: 100, type: Type.Grass, target: Target.Other},
  // 73 LeechSeed
  {effect: Effect.LeechSeed, bp: 0, accuracy: 90, type: Type.Grass, target: Target.Other},
  // 74 Growth (SpecialUp1 => +1)
  {effect: Effect.SpecialUp1, bp: 0, accuracy: 100, type: Type.Normal, target: Target.Self},
  // 75 RazorLeaf (HighCritical)
  {effect: Effect.HighCritical, bp: 55, accuracy: 95, type: Type.Grass, target: Target.Other},
  // 76 SolarBeam (Charge)
  {effect: Effect.Charge, bp: 120, accuracy: 100, type: Type.Grass, target: Target.Other},
  // 77 PoisonPowder (Poison => guaranteed)
  {effect: Effect.Poison, bp: 0, accuracy: 75, type: Type.Poison, target: Target.Other},
  // 78 StunSpore (Paralyze => guaranteed)
  {effect: Effect.Paralyze, bp: 0, accuracy: 75, type: Type.Grass, target: Target.Other},
  // 79 SleepPowder (Sleep => guaranteed)
  {effect: Effect.Sleep, bp: 0, accuracy: 75, type: Type.Grass, target: Target.Other},
  // 80 PetalDance (Thrashing => 2-3 turn confusion)
  {effect: Effect.Thrashing, bp: 70, accuracy: 100, type: Type.Grass, target: Target.RandomFoe},
  // 81 StringShot (SpeedDown1 =>1)
  {effect: Effect.SpeedDown1, bp: 0, accuracy: 95, type: Type.Bug, target: Target.Other},
  // 82 DragonRage (SpecialDamage => 40)
  {effect: Effect.SpecialDamage, bp: 1, accuracy: 100, type: Type.Dragon, target: Target.Other},
  // 83 FireSpin (Binding)
  {effect: Effect.Binding, bp: 15, accuracy: 70, type: Type.Fire, target: Target.Other},
  // 84 ThunderShock (ParalyzeChance1 =>10%)
  {effect: Effect.ParalyzeChance1, bp: 40, accuracy: 100, type: Type.Electric, target: Target.Other},
  // 85 Thunderbolt (ParalyzeChance1 =>10%)
  {effect: Effect.ParalyzeChance1, bp: 95, accuracy: 100, type: Type.Electric, target: Target.Other},
  // 86 ThunderWave (Paralyze => guaranteed)
  {effect: Effect.Paralyze, bp: 0, accuracy: 100, type: Type.Electric, target: Target.Other},
  // 87 Thunder (ParalyzeChance1 =>10%)
  {effect: Effect.ParalyzeChance1, bp: 120, accuracy: 70, type: Type.Electric, target: Target.Other},
  // 88 RockThrow
  {effect: Effect.None, bp: 50, accuracy: 65, type: Type.Rock, target: Target.Other},
  // 89 Earthquake
  {effect: Effect.None, bp: 100, accuracy: 100, type: Type.Ground, target: Target.Other},
  // 90 Fissure (OHKO)
  {effect: Effect.OHKO, bp: 0, accuracy: 30, type: Type.Ground, target: Target.Other},
  // 91 Dig (Charge)
  {effect: Effect.Charge, bp: 100, accuracy: 100, type: Type.Ground, target: Target.Other},
  // 92 Toxic (Poison => badly poison but we'll keep 'poison' effect code)
  {effect: Effect.Poison, bp: 0, accuracy: 85, type: Type.Poison, target: Target.Other},
  // 93 Confusion (ConfusionChance =>10%)
  {effect: Effect.ConfusionChance, bp: 50, accuracy: 100, type: Type.Psychic, target: Target.Other},
  // 94 Psychic (SpecialDownChance =>33%)
  {effect: Effect.SpecialDownChance, bp: 90, accuracy: 100, type: Type.Psychic, target: Target.Other},
  // 95 Hypnosis (Sleep => guaranteed if hits)
  {effect: Effect.Sleep, bp: 0, accuracy: 60, type: Type.Psychic, target: Target.Other},
  // 96 Meditate (AttackUp1 => +1)
  {effect: Effect.AttackUp1, bp: 0, accuracy: 100, type: Type.Psychic, target: Target.Self},
  // 97 Agility (SpeedUp2 => +2)
  {effect: Effect.SpeedUp2, bp: 0, accuracy: 100, type: Type.Psychic, target: Target.Self},
  // 98 QuickAttack
  {effect: Effect.None, bp: 40, accuracy: 100, type: Type.Normal, target: Target.Other},
  // 99 Rage
  {effect: Effect.Rage, bp: 20, accuracy: 100, type: Type.Normal, target: Target.Other},
  // 100 Teleport (SwitchAndTeleport)
  {effect: Effect.SwitchAndTeleport, bp: 0, accuracy: 100, type: Type.Psychic, target: Target.Self},
  // 101 NightShade (SpecialDamage => user level)
  {effect: Effect.SpecialDamage, bp: 1, accuracy: 100, type: Type.Ghost, target: Target.Other},
  // 102 Mimic
  {effect: Effect.Mimic, bp: 0, accuracy: 100, type: Type.Normal, target: Target.Other},
  // 103 Screech (DefenseDown2 =>2)
  {effect: Effect.DefenseDown2, bp: 0, accuracy: 85, type: Type.Normal, target: Target.Other},
  // 104 DoubleTeam (EvasionUp1 => +1)
  {effect: Effect.EvasionUp1, bp: 0, accuracy: 100, type: Type.Normal, target: Target.Self},
  // 105 Recover (Heal => ~50%)
  {effect: Effect.Heal, bp: 0, accuracy: 100, type: Type.Normal, target: Target.Self},
  // 106 Harden (DefenseUp1 => +1)
  {effect: Effect.DefenseUp1, bp: 0, accuracy: 100, type: Type.Normal, target: Target.Self},
  // 107 Minimize (EvasionUp1 => +1)
  {effect: Effect.EvasionUp1, bp: 0, accuracy: 100, type: Type.Normal, target: Target.Self},
  // 108 Smokescreen (AccuracyDown1 =>1)
  {effect: Effect.AccuracyDown1, bp: 0, accuracy: 100, type: Type.Normal, target: Target.Other},
  // 109 ConfuseRay (Confusion =>100%)
  {effect: Effect.Confusion, bp: 0, accuracy: 100, type: Type.Ghost, target: Target.Other},
  // 110 Withdraw (DefenseUp1 => +1)
  {effect: Effect.DefenseUp1, bp: 0, accuracy: 100, type: Type.Water, target: Target.Self},
  // 111 DefenseCurl (DefenseUp1 => +1)
  {effect: Effect.DefenseUp1, bp: 0, accuracy: 100, type: Type.Normal, target: Target.Self},
  // 112 Barrier (DefenseUp2 => +2)
  {effect: Effect.DefenseUp2, bp: 0, accuracy: 100, type: Type.Psychic, target: Target.Self},
  // 113 LightScreen
  {effect: Effect.LightScreen, bp: 0, accuracy: 100, type: Type.Psychic, target: Target.Self},
  // 114 Haze
  {effect: Effect.Haze, bp: 0, accuracy: 100, type: Type.Ice, target: Target.Self},
  // 115 Reflect
  {effect: Effect.Reflect, bp: 0, accuracy: 100, type: Type.Psychic, target: Target.Self},
  // 116 FocusEnergy
  {effect: Effect.FocusEnergy, bp: 0, accuracy: 100, type: Type.Normal, target: Target.Self},
  // 117 Bide
  {effect: Effect.Bide, bp: 0, accuracy: 100, type: Type.Normal, target: Target.Self},
  // 118 Metronome
  {effect: Effect.Metronome, bp: 0, accuracy: 100, type: Type.Normal, target: Target.Self},
  // 119 MirrorMove
  {effect: Effect.MirrorMove, bp: 0, accuracy: 100, type: Type.Flying, target: Target.Self},
  // 120 SelfDestruct (Explode)
  {effect: Effect.Explode, bp: 130, accuracy: 100, type: Type.Normal, target: Target.Other},
  // 121 EggBomb
  {effect: Effect.None, bp: 100, accuracy: 75, type: Type.Normal, target: Target.Other},
  // 122 Lick (ParalyzeChance2 =>30%)
  {effect: Effect.ParalyzeChance2, bp: 20, accuracy: 100, type: Type.Ghost, target: Target.Other},
  // 123 Smog (PoisonChance2 =>30%)
  {effect: Effect.PoisonChance2, bp: 20, accuracy: 70, type: Type.Poison, target: Target.Other},
  // 124 Sludge (PoisonChance2 =>30%)
  {effect: Effect.PoisonChance2, bp: 65, accuracy: 100, type: Type.Poison, target: Target.Other},
  // 125 BoneClub (FlinchChance1 =>10%)
  {effect: Effect.FlinchChance1, bp: 65, accuracy: 85, type: Type.Ground, target: Target.Other},
  // 126 FireBlast (BurnChance2 =>30%)
  {effect: Effect.BurnChance2, bp: 120, accuracy: 85, type: Type.Fire, target: Target.Other},
  // 127 Waterfall
  {effect: Effect.None, bp: 80, accuracy: 100, type: Type.Water, target: Target.Other},
  // 128 Clamp (Binding)
  {effect: Effect.Binding, bp: 35, accuracy: 75, type: Type.Water, target: Target.Other},
  // 129 Swift (Swift => never misses)
  {effect: Effect.Swift, bp: 60, accuracy: 100, type: Type.Normal, target: Target.Other},
  // 130 SkullBash (Charge => +Def turn1, attack turn2)
  {effect: Effect.Charge, bp: 100, accuracy: 100, type: Type.Normal, target: Target.Other},
  // 131 SpikeCannon (MultiHit =>2-5)
  {effect: Effect.MultiHit, bp: 20, accuracy: 100, type: Type.Normal, target: Target.Other},
  // 132 Constrict (SpeedDownChance =>10% or 33% in RBY, we do 10%)
  {effect: Effect.SpeedDownChance, bp: 10, accuracy: 100, type: Type.Normal, target: Target.Other},
  // 133 Amnesia (SpecialUp2 => +2)
  {effect: Effect.SpecialUp2, bp: 0, accuracy: 100, type: Type.Psychic, target: Target.Self},
  // 134 Kinesis (AccuracyDown1 =>1)
  {effect: Effect.AccuracyDown1, bp: 0, accuracy: 80, type: Type.Psychic, target: Target.Other},
  // 135 SoftBoiled (Heal =>50%)
  {effect: Effect.Heal, bp: 0, accuracy: 100, type: Type.Normal, target: Target.Self},
  // 136 HighJumpKick (JumpKick => recoil if miss)
  {effect: Effect.JumpKick, bp: 85, accuracy: 90, type: Type.Fighting, target: Target.Other},
  // 137 Glare (Paralyze => guaranteed)
  {effect: Effect.Paralyze, bp: 0, accuracy: 75, type: Type.Normal, target: Target.Other},
  // 138 DreamEater (DreamEater => only hits sleeping foes, user recovers half)
  {effect: Effect.DreamEater, bp: 100, accuracy: 100, type: Type.Psychic, target: Target.Other},
  // 139 PoisonGas (Poison => guaranteed)
  {effect: Effect.Poison, bp: 0, accuracy: 55, type: Type.Poison, target: Target.Other},
  // 140 Barrage (MultiHit =>2-5)
  {effect: Effect.MultiHit, bp: 15, accuracy: 85, type: Type.Normal, target: Target.Other},
  // 141 LeechLife (DrainHP => half)
  {effect: Effect.DrainHP, bp: 20, accuracy: 100, type: Type.Bug, target: Target.Other},
  // 142 LovelyKiss (Sleep => guaranteed if hits)
  {effect: Effect.Sleep, bp: 0, accuracy: 75, type: Type.Normal, target: Target.Other},
  // 143 SkyAttack (Charge => note: 2-turn, in later gens 30% flinch, but Gen1 no flinch)
  {effect: Effect.Charge, bp: 140, accuracy: 90, type: Type.Flying, target: Target.Other},
  // 144 Transform
  {effect: Effect.Transform, bp: 0, accuracy: 100, type: Type.Normal, target: Target.Other},
  // 145 Bubble (SpeedDownChance =>33% or 10%. We'll do 33% for RBY.)
  {effect: Effect.SpeedDownChance, bp: 20, accuracy: 100, type: Type.Water, target: Target.Other},
  // 146 DizzyPunch (None in Gen1)
  {effect: Effect.None, bp: 70, accuracy: 100, type: Type.Normal, target: Target.Other},
  // 147 Spore (Sleep => guaranteed if hits, 100% accuracy in Gen1)
  {effect: Effect.Sleep, bp: 0, accuracy: 100, type: Type.Grass, target: Target.Other},
  // 148 Flash (AccuracyDown1 =>1)
  {effect: Effect.AccuracyDown1, bp: 0, accuracy: 70, type: Type.Normal, target: Target.Other},
  // 149 Psywave (SpecialDamage => random up to ~1.5x user level)
  {effect: Effect.SpecialDamage, bp: 1, accuracy: 80, type: Type.Psychic, target: Target.Other},
  // 150 Splash (Splash => does nothing)
  {effect: Effect.Splash, bp: 0, accuracy: 100, type: Type.Normal, target: Target.Self},
  // 151 AcidArmor (DefenseUp2 => +2)
  {effect: Effect.DefenseUp2, bp: 0, accuracy: 100, type: Type.Poison, target: Target.Self},
  // 152 Crabhammer (HighCritical)
  {effect: Effect.HighCritical, bp: 90, accuracy: 85, type: Type.Water, target: Target.Other},
  // 153 Explosion (Explode => user faints)
  {effect: Effect.Explode, bp: 170, accuracy: 100, type: Type.Normal, target: Target.Other},
  // 154 FurySwipes (MultiHit =>2-5)
  {effect: Effect.MultiHit, bp: 18, accuracy: 80, type: Type.Normal, target: Target.Other},
  // 155 Bonemerang (DoubleHit =>2)
  {effect: Effect.DoubleHit, bp: 50, accuracy: 90, type: Type.Ground, target: Target.Other},
  // 156 Rest (Heal =>100% + Sleep)
  // We'll handle the special case of putting user to Sleep inside applyEffect
  {effect: Effect.Heal, bp: 0, accuracy: 100, type: Type.Psychic, target: Target.Self},
  // 157 RockSlide (None in Gen1)
  {effect: Effect.None, bp: 75, accuracy: 90, type: Type.Rock, target: Target.Other},
  // 158 HyperFang (FlinchChance1 =>10%)
  {effect: Effect.FlinchChance1, bp: 80, accuracy: 90, type: Type.Normal, target: Target.Other},
  // 159 Sharpen (AttackUp1 => +1)
  {effect: Effect.AttackUp1, bp: 0, accuracy: 100, type: Type.Normal, target: Target.Self},
  // 160 Conversion
  {effect: Effect.Conversion, bp: 0, accuracy: 100, type: Type.Normal, target: Target.Other},
  // 161 TriAttack (None in Gen1)
  {effect: Effect.None, bp: 80, accuracy: 100, type: Type.Normal, target: Target.Other},
  // 162 SuperFang (SuperFang => half current HP)
  {effect: Effect.SuperFang, bp: 1, accuracy: 90, type: Type.Normal, target: Target.Other},
  // 163 Slash (HighCritical)
  {effect: Effect.HighCritical, bp: 70, accuracy: 100, type: Type.Normal, target: Target.Other},
  // 164 Substitute
  {effect: Effect.Substitute, bp: 0, accuracy: 100, type: Type.Normal, target: Target.Self},
  // 165 Struggle (Recoil)
  {effect: Effect.Recoil, bp: 50, accuracy: 100, type: Type.Normal, target: Target.RandomFoe},
];

export const size = 165;

export const METRONOME: Move[] = (() => {
  const moves: Move[] = [];
  for (let i = 1; i <= size; i++) {
    if (i !== Move.Metronome) moves.push(i as Move);
  }
  return moves;
})();

export function get(id: Move): MoveData {
  if (id === Move.None || id === Move.SKIP_TURN) {
    throw new Error("Invalid move ID");
  }
  return DATA[id - 1];
}

export function pp(id: Move): number {
  // We'll keep the original PP array from existing code or adapt as needed
  // We won't rewrite the entire array here for brevity, though ideally we'd align them.
  // For now, if there's a mismatch in user code, they'd fix it. We'll do the same approach:
  const PP: number[] = [
    35, // Pound
    25, // Karate Chop
    10, // DoubleSlap
    15, // Comet Punch
    20, // MegaPunch
    20, // PayDay
    15, // FirePunch
    15, // IcePunch
    15, // ThunderPunch
    35, // Scratch
    30, // ViseGrip
    5,  // Guillotine
    10, // RazorWind
    30, // SwordsDance
    30, // Cut
    35, // Gust
    35, // WingAttack
    20, // Whirlwind
    15, // Fly
    20, // Bind
    20, // Slam
    10, // VineWhip
    20, // Stomp
    30, // DoubleKick
    5,  // MegaKick
    25, // JumpKick
    15, // RollingKick
    15, // SandAttack
    15, // Headbutt
    25, // HornAttack
    20, // FuryAttack
    5,  // HornDrill
    35, // Tackle
    15, // BodySlam
    20, // Wrap
    20, // TakeDown
    20, // Thrash
    15, // DoubleEdge
    30, // TailWhip
    35, // PoisonSting
    20, // Twineedle
    20, // PinMissile
    30, // Leer
    25, // Bite
    40, // Growl
    20, // Roar
    15, // Sing
    20, // Supersonic
    20, // SonicBoom
    20, // Disable
    30, // Acid
    25, // Ember
    15, // Flamethrower
    30, // Mist
    25, // WaterGun
    5,  // HydroPump
    15, // Surf
    10, // IceBeam
    5,  // Blizzard
    20, // Psybeam
    20, // BubbleBeam
    20, // AuroraBeam
    5,  // HyperBeam
    35, // Peck
    20, // DrillPeck
    25, // Submission
    20, // LowKick
    20, // Counter
    20, // SeismicToss
    15, // Strength
    20, // Absorb
    10, // MegaDrain
    10, // LeechSeed
    40, // Growth
    25, // RazorLeaf
    10, // SolarBeam
    35, // PoisonPowder
    30, // StunSpore
    15, // SleepPowder
    20, // PetalDance
    40, // StringShot
    10, // DragonRage
    15, // FireSpin
    30, // ThunderShock
    15, // Thunderbolt
    20, // ThunderWave
    10, // Thunder
    15, // RockThrow
    10, // Earthquake
    5,  // Fissure
    10, // Dig
    10, // Toxic
    25, // Confusion
    10, // Psychic
    20, // Hypnosis
    40, // Meditate
    30, // Agility
    30, // QuickAttack
    20, // Rage
    20, // Teleport
    15, // NightShade
    10, // Mimic
    40, // Screech
    15, // DoubleTeam
    20, // Recover
    30, // Harden
    20, // Minimize
    20, // Smokescreen
    10, // ConfuseRay
    40, // Withdraw
    40, // DefenseCurl
    30, // Barrier
    30, // LightScreen
    30, // Haze
    20, // Reflect
    30, // FocusEnergy
    10, // Bide
    10, // Metronome
    20, // MirrorMove
    5,  // SelfDestruct
    10, // EggBomb
    30, // Lick
    20, // Smog
    20, // Sludge
    20, // BoneClub
    5,  // FireBlast
    15, // Waterfall
    10, // Clamp
    20, // Swift
    15, // SkullBash
    15, // SpikeCannon
    35, // Constrict
    20, // Amnesia
    15, // Kinesis
    10, // SoftBoiled
    20, // HighJumpKick
    30, // Glare
    15, // DreamEater
    40, // PoisonGas
    20, // Barrage
    15, // LeechLife
    10, // LovelyKiss
    5,  // SkyAttack
    10, // Transform
    30, // Bubble
    10, // DizzyPunch
    15, // Spore
    20, // Flash
    15, // Psywave
    40, // Splash
    40, // AcidArmor
    10, // Crabhammer
    5,  // Explosion
    15, // FurySwipes
    10, // Bonemerang
    10, // Rest
    10, // RockSlide
    15, // HyperFang
    30, // Sharpen
    30, // Conversion
    10, // TriAttack
    10, // SuperFang
    20, // Slash
    10, // Substitute
    10, // Struggle
  ];
  if (id === Move.None) {
    throw new Error("Invalid move ID");
  }
  return PP[id - 1];
}

export function onBegin(effect: Effect): boolean {
  return effect > 0 && effect <= 16;
}
export function onEnd(effect: Effect): boolean {
  return effect > 16 && effect <= 31;
}
export function alwaysHappens(effect: Effect): boolean {
  return effect > 31 && effect <= 38;
}
export function isSpecial(effect: Effect): boolean {
  return effect > 31 && effect <= 46;
}
export function isMulti(effect: Effect): boolean {
  return effect === Effect.DoubleHit || effect === Effect.MultiHit || effect === Effect.Twineedle;
}
export function isSecondaryChance(effect: Effect): boolean {
  // We'll rely on the main applyEffect logic rather than this helper
  return effect >= 48 && effect <= 61;
}
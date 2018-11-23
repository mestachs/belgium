const provinces = [
  {
    id: 1,
    name: { fr: "Bruxelles capitale", nl: "Brussel Hoofstadt" },
    chiefTown: { fr: "Bruxelles", nl: "Brussel" },
    armories:
      "https://upload.wikimedia.org/wikipedia/commons/7/7a/Blason_de_Bruxelles-Capitale.svg",
    wikipedia: "Région_de_Bruxelles-Capitale",
    region: "Région Bruxelles-Capitale",
    facts: {
      population: 1183545,
      surface: 161.38
    }
  },
  {
    id: 2,
    name: { fr: "Anvers", nl: "Antwerpen" },
    chiefTown: { nl: "Antwerpen", fr: "Anvers" },
    armories:
      "https://upload.wikimedia.org/wikipedia/commons/0/09/Wapen_van_de_provincie_Antwerpen.svg",
    wikipedia: "Province_d%27Anvers",
    region: "Région Flamande",
    facts: {
      population: 1781904,
      surface: 2867
    }
  },
  {
    id: 4,
    name: { fr: "Flandre Orientale", nl: "Oost-Vlaanderen" },
    chiefTown: { nl: "Gent", fr: "Gand" },
    armories:
      "https://upload.wikimedia.org/wikipedia/commons/5/51/Wapen_van_Oost-Vlaanderen.svg",
    wikipedia: "Province_de_Flandre-Orientale",
    region: "Région Flamande",
    facts: {
      population: 1454716,
      surface: 2982
    }
  },
  {
    id: 3,
    name: { fr: "Limbourg", nl: "Limburg" },
    chiefTown: { fr: "Hasselt", nl: "Hasselt" },
    armories:
      "https://upload.wikimedia.org/wikipedia/commons/c/cc/Wapen_van_Limburg_%28Belgi%C3%AB%29.svg",
    wikipedia: "Province_de_Limbourg_(Belgique)",
    region: "Région Flamande",
    facts: {
      population: 1454716,
      surface: 2422
    }
  },
  {
    id: 6,
    name: { fr: "Flandre Occidentale", nl: "West-Vlaanderen" },
    chiefTown: { fr: "Bruges", nl: "Brugge" },
    armories:
      "https://upload.wikimedia.org/wikipedia/commons/a/a3/Wapen_van_West-Vlaanderen.svg",
    wikipedia: "Province_de_Flandre-Occidentale",
    region: "Région Flamande",
    facts: {
      population: 1169990,
      surface: 3144
    }
  },
  {
    id: 7,
    name: { fr: "Brabant Wallon", nl: "Waals-Brabant" },
    chiefTown: { fr: "Wavre", nl: "Waver" },
    armories:
      "https://upload.wikimedia.org/wikipedia/commons/1/1c/Wapen_van_Waals-Brabant.svg",
    wikipedia: "Province_du_Brabant_wallon",
    region: "Région Wallonne",
    facts: {
      population: 398990,
      surface: 1091
    }
  },
  {
    id: 8,
    name: { fr: "Hainaut", nl: "Henegouwen" },
    chiefTown: { fr: "Mons", nl: "Bergen" },
    armories:
      "https://upload.wikimedia.org/wikipedia/commons/c/c9/H%C3%A9raldique_Province_BE_Hainaut_crown.svg",
    wikipedia: "Province_de_Hainaut",
    region: "Région Wallonne",
    facts: {
      population: 1337759,
      surface: 3786
    }
  },
  {
    id: 9,
    name: { fr: "Liège", nl: "Luik" },
    chiefTown: { fr: "Liège", nl: "Luik" },
    armories:
      "https://upload.wikimedia.org/wikipedia/commons/e/e5/Blason_liege_prov_crown.svg",
    wikipedia: "Province_de_Liège",
    region: "Région Wallonne",
    facts: {
      population: 1100681,
      surface: 3862
    }
  },
  {
    id: 12,
    name: { fr: "Namur", nl: "Namen" },
    chiefTown: { fr: "Namur", nl: "Namen" },
    armories:
      "https://upload.wikimedia.org/wikipedia/commons/2/2e/Blason_namur_prov_crown.svg",
    wikipedia: "Province_de_Namur",
    region: "Région Wallonne",
    facts: {
      population: 490947,
      surface: 3666
    }
  },
  {
    id: 11,
    name: { fr: "Luxembourg", nl: "Luxemburg" },
    chiefTown: { fr: "Arlon", nl: "Aarlen" },
    armories:
      "https://upload.wikimedia.org/wikipedia/commons/e/ed/Coat_of_arms_of_the_Province_of_Luxembourg.svg",
    wikipedia: "Province_de_Luxembourg",
    region: "Région Wallonne",
    facts: {
      population: 281712,
      surface: 4440
    }
  },
  {
    id: 5,
    name: { fr: "Brabant Flamand", nl: "Vlaams-Brabant" },
    chiefTown: { nl: "Leuven", fr: "Louvain" },
    armories:
      "https://upload.wikimedia.org/wikipedia/commons/c/ca/Wapen_van_Vlaams-Brabant.svg",
    wikipedia: "Province_du_Brabant_flamand",
    region: "Région Flamande",
    facts: {
      population: 1094751,
      surface: 2106
    }
  }
];

const regions = [
  {
    name: { fr: "Région Wallonne", nl: "Waalse Gewest" },
    armories:
      "https://upload.wikimedia.org/wikipedia/commons/4/42/Flag_of_Wallonia.svg",
    provinces: ["Brabant wallon", "Hainaut", "Liège", "Luxembourg", "Namur"],
    wikipedia: "Région_wallonne",
    facts: {
      population: 3610089,
      surface: 16845
    }
  },
  {
    name: { fr: "Région Flamande", nl: "Vlaams Gewest" },
    armories:
      "https://upload.wikimedia.org/wikipedia/commons/2/2b/Flag_of_Flanders.svg",
    provinces: [
      "Anvers",
      "Brabant flamand",
      "Flandre occidentale",
      "Flandre orientale",
      "Limbourg"
    ],
    wikipedia: "Région_flamande",
    facts: {
      population: 6509894
    }
  },
  {
    name: {
      fr: "Région Bruxelles-Capitale",
      nl: "Brussels Hoofdstedelijk Gewest"
    },
    armories:
      "https://upload.wikimedia.org/wikipedia/commons/b/bc/Flag_of_the_Brussels-Capital_Region.svg",
    provinces: ["Bruxelles capitale"],
    wikipedia: "Région_de_Bruxelles-Capitale",
    facts: {
      population: 1183545
    }
  }
];

export default provinces.concat(regions);

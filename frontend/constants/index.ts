export type Day = {
  id: number;
  label: string;
  diminutive: string;
};
export const DAYS: Day[] = [
  {
    id: 1,
    label: "Lundi",
    diminutive: "Lun.",
  },
  {
    id: 2,
    label: "Mardi",
    diminutive: "Mar.",
  },
  {
    id: 3,
    label: "Mercredi",
    diminutive: "Mer.",
  },
  {
    id: 4,
    label: "Jeudi",
    diminutive: "Jeu.",
  },
  {
    id: 5,
    label: "Vendredi",
    diminutive: "Ven.",
  },
  {
    id: 6,
    label: "Samedi",
    diminutive: "Sam.",
  },
  {
    id: 0,
    label: "Dimanche",
    diminutive: "Dim.",
  },
];

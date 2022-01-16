export class Vertrag {
  id: number | undefined = 0;
  name: string = "";
  beschreibung: string = "";
  internetseite: string = "";
  benutzername: string = "";
  adresse: string = "";
  email: string = "";
  vertragsnehmer: string = "";
  vertragsbeginn: Date = new Date();
  vertragsende: Date = new Date();
  kuendigungsfrist: Date = new Date();
  vertragsnummer: string = "";
  supporttelefon: string = "";
  kosten: number = 0;
  abrechnungsperiode: number = 0;
  aktiv: boolean = false;
  gekuendigt: boolean = false;
}

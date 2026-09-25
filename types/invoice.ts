export interface Invoice {
  id: string;
  numFacture: string;
  client: string;
  nomClient: string;
  solde: number;
  retardPaiement: number;
  dateEmission: Date;
  montantFact: number;
  montantReg: number;
  dateRegPrevu?: Date;
  natureDerogation?: string;
  delaiDerogation?: number;
  status: 'SHEET1' | 'WAITING' | 'ALERTE' | 'TIKE_RESTEAUX' | 'DEROGATION_COMERCIAL' | 'AVOIR' | 'FAUTTE_CHAUFFEUR' | 'ANNOMALI';
}

export interface ExcelRow {
  'Num Facture': string;
  'Code': string;
  'Client': string;
  'FSTAT1': number;
  'FSTAT2': number;
  'FSTAT3': number;
  'Date Fact': Date;
  'Mod.Pay': string;
  'Montant Fact': number;
  'Mont.Reg': number;
  'Date_reg_prev': Date;
  'Retard': number;
}

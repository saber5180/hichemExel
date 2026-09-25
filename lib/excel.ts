import * as XLSX from 'xlsx';
import { Invoice, ExcelRow } from '@/types/invoice';
import { calculateSolde, generateId, calculateRetard } from './utils';

export function readExcelFile(file: File): Promise<Invoice[]> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    
    reader.onload = (e) => {
      try {
        const data = e.target?.result;
        const workbook = XLSX.read(data, { type: 'binary' });
        
        // Lire la première feuille (Sheet1)
        const firstSheet = workbook.Sheets[workbook.SheetNames[0]];
        const rows: ExcelRow[] = XLSX.utils.sheet_to_json(firstSheet);
        
        // Convertir en format Invoice
        const invoices: Invoice[] = rows.map(row => {
          const montantFact = row['Montant Fact'] || 0;
          const montantReg = row['Mont.Reg'] || 0;
          const solde = calculateSolde(montantFact, montantReg);
          
          return {
            id: generateId(),
            numFacture: row['Num Facture'] || '',
            client: row['Code'] || '',
            nomClient: row['Client'] || '',
            solde,
            retardPaiement: row['Retard'] || 0,
            dateEmission: excelDateToJSDate(row['Date Fact']),
            montantFact,
            montantReg,
            dateRegPrevu: excelDateToJSDate(row['Date_reg_prev']),
            status: 'SHEET1' // Import dans SHEET1
          };
        });
        
        resolve(invoices);
      } catch (error) {
        reject(error);
      }
    };
    
    reader.onerror = () => reject(new Error('Erreur lecture fichier'));
    reader.readAsBinaryString(file);
  });
}

// Convertir une date Excel en Date JavaScript
function excelDateToJSDate(excelDate: any): Date {
  if (!excelDate) return new Date();
  
  if (excelDate instanceof Date) {
    return excelDate;
  }
  
  // Excel stocke les dates comme nombre de jours depuis 1900-01-01
  if (typeof excelDate === 'number') {
    const date = new Date((excelDate - 25569) * 86400 * 1000);
    return date;
  }
  
  return new Date(excelDate);
}

// Exporter vers Excel
export function exportToExcel(invoices: Invoice[], sheetName: string = 'Export') {
  const data = invoices.map(inv => ({
    'N° Facture': inv.numFacture,
    'Client': inv.client,
    'Nom Client': inv.nomClient,
    'Solde': inv.solde,
    'Retard': inv.retardPaiement,
    'Date Emission': inv.dateEmission,
    'Montant Fact': inv.montantFact,
    'Montant Reg': inv.montantReg,
    'Date Reg Prevu': inv.dateRegPrevu || '',
    'Nature': inv.natureDerogation || '',
    'Statut': inv.status
  }));
  
  const ws = XLSX.utils.json_to_sheet(data);
  const wb = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(wb, ws, sheetName);
  
  XLSX.writeFile(wb, `recouvrement_${Date.now()}.xlsx`);
}

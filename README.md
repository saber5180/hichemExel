# 📊 Recouvrement Web - Système de Gestion des Factures

Application web Next.js pour la gestion et le suivi des factures, basée sur votre système Excel RECOUVREMENT.

## ✨ Fonctionnalités

- 📤 **Import Excel** : Upload de fichiers Excel (Sheet1) avec calcul automatique du SOLDE
- ➕ **Ajout Manuel** : Formulaire pour ajouter des factures individuellement
- 🔴 **Coloration Automatique** : Les lignes avec dates dépassées sont automatiquement en rouge
- 📋 **Multi-Pages** : ALERTE, TIKE RESTEAUX, DÉROGATION COMERCIAL, AVOIR, FAUTTE CHAUFFEUR, ANNOMALI
- 🔄 **Transfert** : Transférer des factures entre différents statuts
- 📊 **Export Excel** : Exporter les données en format Excel
- 💰 **Calcul SOLDE** : Calcul automatique = Montant Fact - Mont.Reg

## 🚀 Installation

### Prérequis
- Node.js 18+ installé
- npm ou yarn

### Étapes d'installation

1. **Aller dans le dossier du projet** :
```bash
cd "c:\Users\Saber ben Slama\Desktop\hichem\recouvrement-web"
```

2. **Installer les dépendances** :
```bash
npm install
```

3. **Lancer le serveur de développement** :
```bash
npm run dev
```

4. **Ouvrir dans le navigateur** :
```
http://localhost:3000
```

## 📁 Structure du Projet

```
recouvrement-web/
├── app/
│   ├── page.tsx                    # Dashboard principal
│   ├── upload/page.tsx             # Upload Excel
│   ├── ajout-dr/page.tsx          # Formulaire d'ajout
│   ├── alerte/page.tsx            # Page ALERTE
│   ├── tike-resteaux/page.tsx     # Page TIKE RESTEAUX
│   ├── derogation/page.tsx        # Page DEROGATION
│   ├── avoir/page.tsx             # Page AVOIR
│   ├── fautte-chauffeur/page.tsx  # Page FAUTTE CHAUFFEUR
│   └── annomali/page.tsx          # Page ANNOMALI
├── components/
│   └── InvoiceTable.tsx           # Tableau réutilisable
├── lib/
│   ├── store.ts                   # State management (Zustand)
│   ├── excel.ts                   # Lecture/Export Excel
│   └── utils.ts                   # Fonctions utilitaires
└── types/
    └── invoice.ts                 # Types TypeScript
```

## 📖 Guide d'utilisation

### 1. Importer un fichier Excel

1. Cliquez sur **"📤 Upload"** dans la navigation
2. Sélectionnez votre fichier Excel (Sheet1)
3. Les factures seront importées automatiquement dans **ALERTE**
4. Le **SOLDE** est calculé automatiquement

### 2. Ajouter une facture manuellement

1. Cliquez sur **"➕ Ajouter"**
2. Remplissez le formulaire AJOUT DR
3. Le SOLDE se calcule automatiquement pendant la saisie
4. Cliquez **"Ajouter au Tableau"**

### 3. Transférer des factures

1. Dans n'importe quelle page (ALERTE, etc.)
2. Utilisez le menu déroulant **"Transférer..."**
3. Choisissez la destination
4. La facture change de statut immédiatement

### 4. Coloration automatique

- Les lignes avec **DATE REGLEMENT PREVU dépassée** sont automatiquement :
  - ✅ Colonne A (N° Facture) : **Rouge vif**
  - ✅ Colonnes B-J : **Rouge clair**

## 🎨 Pages Disponibles

| Page | Route | Description |
|------|-------|-------------|
| Dashboard | `/` | Vue d'ensemble + statistiques |
| Upload | `/upload` | Import fichier Excel |
| Ajout DR | `/ajout-dr` | Formulaire d'ajout |
| ALERTE | `/alerte` | Factures en alerte |
| TIKE RESTEAUX | `/tike-resteaux` | Tickets resteaux |
| DÉROGATION | `/derogation` | Dérogations comerciales |
| AVOIR | `/avoir` | Avoirs |
| FAUTTE CHAUFFEUR | `/fautte-chauffeur` | Fauttes chauffeur |
| ANNOMALI | `/annomali` | Annomali |

## 🔧 Technologies Utilisées

- **Next.js 14** - Framework React
- **TypeScript** - Typage statique
- **Tailwind CSS** - Styling
- **Zustand** - State management
- **xlsx** - Lecture/Export Excel
- **date-fns** - Manipulation dates

## 📝 Format Excel Attendu

Le fichier Excel doit contenir ces colonnes :

| Colonne | Type | Description |
|---------|------|-------------|
| Num Facture | Texte | N° de facture |
| Code | Texte | Code client |
| Client | Texte | Nom du client |
| Montant Fact | Nombre | Montant facture |
| Mont.Reg | Nombre | Montant règlement |
| Date Fact | Date | Date émission |
| Retard | Nombre | Jours de retard |
| Date_reg_prev | Date | Date règlement prévu |

## 🚀 Compilation pour Production

```bash
npm run build
npm start
```

## 💡 Fonctionnalités Avancées

### Calcul SOLDE Automatique
```typescript
SOLDE = Montant Fact (colonne I) - Mont.Reg (colonne J)
```

### Détection Dates Dépassées
- Comparaison avec la date du jour
- Coloration automatique en rouge
- Symbole ⚠️ dans le tableau

### Export Excel
- Bouton "📊 Exporter Excel" sur chaque page
- Télécharge un fichier `.xlsx` avec les données filtrées

## 🔒 Sécurité

- Les données restent **localement** dans le navigateur (Zustand)
- Pas de base de données externe
- Pas d'envoi de données vers un serveur

## 📞 Support

Pour toute question ou amélioration :
- Vérifiez que Node.js est installé : `node --version`
- Vérifiez que npm fonctionne : `npm --version`
- Consultez les logs dans la console du navigateur (F12)

## 🎯 Prochaines Étapes

Vous pouvez facilement ajouter :
- 🔐 Authentification utilisateur
- 💾 Base de données (PostgreSQL, MongoDB)
- 📧 Notifications par email
- 📱 Version mobile responsive
- 🔄 Synchronisation temps réel
- 📊 Graphiques et analytics

---

**Créé avec ❤️ pour automatiser la gestion RECOUVREMENT**

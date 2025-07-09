# Sociale Media & Zelfbeeld Enquête

Een volledige Node.js Express-applicatie voor het anoniem verzamelen en analyseren van enquêtegegevens over de invloed van sociale media op het zelfbeeld van jongeren.

## Functies

- **Uitgebreide anonieme enquête** met vragen over demografische gegevens, zelfbeeld, sociale media gebruik en gedragsinvloed
- **SQLite database** voor gegevensopslag
- **Admin dashboard** met authenticatie
- **Paginatie, filtering en sortering** van responses
- **Statistieken en grafieken** voor data-analyse
- **CSV export** functionaliteit
- **Responsive design** voor mobiel en desktop
- **Volledig anoniem** - geen email of persoonlijke gegevens

## Installatie

1. **Clone of download het project**
\`\`\`bash
git clone <repository-url>
cd social-media-survey
\`\`\`

2. **Installeer dependencies**
\`\`\`bash
npm install
\`\`\`

3. **Configureer environment variables**
\`\`\`bash
cp .env.example .env
\`\`\`

Bewerk `.env` en pas de instellingen aan:
\`\`\`env
PORT=3000
SESSION_SECRET=your-secure-secret-key
\`\`\`

4. **Start de applicatie**
\`\`\`bash
# Development mode
npm run dev

# Production mode
npm start
\`\`\`

5. **Open in browser**
- Enquête: http://localhost:3000
- Admin login: http://localhost:3000/admin/login

## Admin Toegang

**Standaard login gegevens:**
- Gebruikersnaam: `admin`
- Wachtwoord: `admin123`

⚠️ **Belangrijk:** Wijzig deze gegevens in productie!

## Database

De applicatie gebruikt SQLite en maakt automatisch een `survey.db` bestand aan. Geen verdere database configuratie nodig.

## Project Structuur

\`\`\`
social-media-survey/
├── server.js              # Hoofdserver bestand
├── package.json           # Dependencies en scripts
├── .env.example          # Environment variables template
├── survey.db             # SQLite database (wordt automatisch aangemaakt)
├── public/
│   └── css/
│       ├── survey.css    # Styling voor enquête
│       └── admin.css     # Styling voor admin dashboard
└── views/
    ├── survey.ejs        # Enquête formulier
    ├── thank-you.ejs     # Bedankpagina
    └── admin/
        ├── login.ejs     # Admin login
        ├── dashboard.ejs # Admin dashboard
        └── statistics.ejs # Statistieken pagina
\`\`\`

## API Endpoints

### Publieke Routes
- `GET /` - Enquête formulier
- `POST /submit` - Enquête inzending

### Admin Routes (authenticatie vereist)
- `GET /admin/login` - Login pagina
- `POST /admin/login` - Login verwerking
- `GET /admin/dashboard` - Dashboard met responses
- `GET /admin/statistics` - Statistieken en grafieken
- `GET /admin/export` - CSV export
- `GET /admin/logout` - Uitloggen

## Anonimiteit

Deze enquête is volledig anoniem:
- Geen email adressen worden verzameld
- Geen IP adressen worden opgeslagen
- Geen persoonlijke identificeerbare informatie
- Alleen onderzoeksrelevante data wordt bewaard

## Beveiliging

- Wachtwoorden worden gehashed met bcrypt
- Session-based authenticatie voor admin
- Input validatie en sanitization
- Environment variables voor gevoelige data

## Licentie

MIT License - Vrij te gebruiken voor onderzoek en educatieve doeleinden.

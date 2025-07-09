# Sociale Media & Zelfbeeld Enquête

Een volledige Node.js Express-applicatie voor het verzamelen en analyseren van enquêtegegevens over de invloed van sociale media op het zelfbeeld van jongeren.

## Functies

- **Uitgebreide enquête** met vragen over demografische gegevens, zelfbeeld, sociale media gebruik en gedragsinvloed
- **SQLite database** voor gegevensopslag
- **Admin dashboard** met authenticatie
- **Paginatie, filtering en sortering** van responses
- **Statistieken en grafieken** voor data-analyse
- **CSV export** functionaliteit
- **Email notificaties** bij nieuwe inzendingen
- **Responsive design** voor mobiel en desktop

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

Bewerk `.env` en vul je email instellingen in:
\`\`\`env
EMAIL_USER=your-email@gmail.com
EMAIL_PASS=your-app-password
NOTIFICATION_EMAIL=admin@yoursite.com
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

## Email Configuratie

Voor Gmail:
1. Ga naar je Google Account instellingen
2. Schakel 2-factor authenticatie in
3. Genereer een App Password
4. Gebruik dit App Password in de `.env` file

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

## Database Schema

### responses tabel
- `id` - Unieke identifier
- `age` - Leeftijd (12-18)
- `gender` - Geslacht
- `country` - Land
- `country_other` - Ander land (vrije tekst)
- `weight_problems` - Zorgen over gewicht
- `self_image` - Zelfbeeld omschrijving
- `body_satisfaction` - Tevredenheid lichaam (1-10)
- `weight_influence` - Invloed gewicht op gevoel
- `social_media_hours` - Uren sociale media per dag
- `platforms` - Gebruikte platforms (comma-separated)
- `content_types` - Bekeken content types (comma-separated)
- `comparison_frequency` - Frequentie vergelijken met anderen
- `influence_eating` - Invloed op eetgedrag
- `influence_exercise` - Invloed op beweeggedrag
- `influence_screen_time` - Invloed op schermtijd
- `influence_social` - Invloed op sociaal gedrag
- `solutions` - Voorgestelde oplossingen (comma-separated)
- `education_importance` - Belang voorlichting (1-10)
- `platform_responsibility` - Platform verantwoordelijkheid (1-10)
- `created_at` - Tijdstempel

## Uitbreidingsmogelijkheden

Het systeem is ontworpen om eenvoudig uitbreidbaar te zijn:

1. **Nieuwe vragen toevoegen:**
   - Voeg velden toe aan database schema
   - Update enquête formulier (`views/survey.ejs`)
   - Pas server.js aan voor nieuwe velden

2. **Extra statistieken:**
   - Voeg queries toe aan `/admin/statistics` route
   - Maak nieuwe grafieken in `statistics.ejs`

3. **Geavanceerde filtering:**
   - Breid filter opties uit in dashboard
   - Voeg nieuwe WHERE clauses toe aan queries

4. **Export formaten:**
   - Voeg PDF of Excel export toe
   - Implementeer aangepaste rapportages

## Beveiliging

- Wachtwoorden worden gehashed met bcrypt
- Session-based authenticatie voor admin
- Input validatie en sanitization
- CSRF bescherming via sessions
- Environment variables voor gevoelige data

## Troubleshooting

**Database errors:**
- Controleer of de applicatie schrijfrechten heeft in de project directory
- Verwijder `survey.db` om opnieuw te beginnen

**Email errors:**
- Controleer email instellingen in `.env`
- Zorg voor correcte App Password bij Gmail
- Test email configuratie apart

**Port conflicts:**
- Wijzig PORT in `.env` als 3000 al in gebruik is

## Licentie

MIT License - Vrij te gebruiken voor onderzoek en educatieve doeleinden.

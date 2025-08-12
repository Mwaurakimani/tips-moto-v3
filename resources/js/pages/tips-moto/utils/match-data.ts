import { getTodayDateString, getYesterdayDateString, getRecentDateStrings, getFutureDateStrings, createDateTime } from './date-utils';

// Global counter for ensuring unique tip IDs
let tipIdCounter = 1000000;

// Tip types data
export const tipTypes = [
  { type: '1', subType: 'Home Win', value: '1', riskLevel: 'mid', prediction: 'Home Win' },
  { type: 'X', subType: 'Draw', value: 'X', riskLevel: 'high', prediction: 'Draw' },
  { type: '2', subType: 'Away Win', value: '2', riskLevel: 'mid', prediction: 'Away Win' },
  { type: '1X', subType: 'Home or Draw', value: '1X', riskLevel: 'low', prediction: 'Home Win or Draw' },
  { type: '12', subType: 'Home or Away', value: '12', riskLevel: 'low', prediction: 'Home Win or Away Win' },
  { type: 'X2', subType: 'Draw or Away', value: 'X2', riskLevel: 'low', prediction: 'Draw or Away Win' },
  { type: 'Over 1.5', subType: 'Goals', value: 'Over 1.5', riskLevel: 'low', prediction: 'Over 1.5 Goals' },
  { type: 'Under 1.5', subType: 'Goals', value: 'Under 1.5', riskLevel: 'high', prediction: 'Under 1.5 Goals' },
  { type: 'Over 2.5', subType: 'Goals', value: 'Over 2.5', riskLevel: 'mid', prediction: 'Over 2.5 Goals' },
  { type: 'Under 2.5', subType: 'Goals', value: 'Under 2.5', riskLevel: 'mid', prediction: 'Under 2.5 Goals' },
  { type: 'Over 3.5', subType: 'Goals', value: 'Over 3.5', riskLevel: 'high', prediction: 'Over 3.5 Goals' },
  { type: 'GG', subType: 'Both Teams Score', value: 'GG', riskLevel: 'mid', prediction: 'Both Teams Score' },
  { type: 'NG', subType: 'Clean Sheet', value: 'NG', riskLevel: 'mid', prediction: 'Clean Sheet' }
];

// Leagues data
export const leagues = [
  { name: 'English Premier League', country: 'England' },
  { name: 'Spanish La Liga', country: 'Spain' },
  { name: 'German Bundesliga', country: 'Germany' },
  { name: 'Italian Serie A', country: 'Italy' },
  { name: 'French Ligue 1', country: 'France' },
  { name: 'Dutch Eredivisie', country: 'Netherlands' },
  { name: 'Portuguese Primeira Liga', country: 'Portugal' },
  { name: 'Brazilian Serie A', country: 'Brazil' },
  { name: 'Argentine Primera División', country: 'Argentina' },
  { name: 'MLS', country: 'USA' },
  { name: 'Japanese J1 League', country: 'Japan' },
  { name: 'Australian A-League', country: 'Australia' },
  { name: 'Russian Premier League', country: 'Russia' },
  { name: 'Turkish Super Lig', country: 'Turkey' },
  { name: 'Belgian Pro League', country: 'Belgium' }
];

// Teams by league
export const teamsByLeague: Record<string, Array<{home: string; away: string}>> = {
  'English Premier League': [
    { home: 'Manchester United', away: 'Liverpool' },
    { home: 'Arsenal', away: 'Chelsea' },
    { home: 'Manchester City', away: 'Tottenham' },
    { home: 'Newcastle United', away: 'Brighton' },
    { home: 'Aston Villa', away: 'West Ham' }
  ],
  'Spanish La Liga': [
    { home: 'Real Madrid', away: 'Barcelona' },
    { home: 'Atletico Madrid', away: 'Sevilla' },
    { home: 'Valencia', away: 'Villarreal' },
    { home: 'Real Sociedad', away: 'Athletic Bilbao' },
    { home: 'Real Betis', away: 'Celta Vigo' }
  ],
  'German Bundesliga': [
    { home: 'Bayern Munich', away: 'Borussia Dortmund' },
    { home: 'RB Leipzig', away: 'Bayer Leverkusen' },
    { home: 'Eintracht Frankfurt', away: 'Wolfsburg' },
    { home: 'Borussia Monchengladbach', away: 'Freiburg' },
    { home: 'Union Berlin', away: 'Hoffenheim' }
  ],
  'Italian Serie A': [
    { home: 'Juventus', away: 'Inter Milan' },
    { home: 'AC Milan', away: 'Napoli' },
    { home: 'AS Roma', away: 'Lazio' },
    { home: 'Atalanta', away: 'Fiorentina' },
    { home: 'Torino', away: 'Bologna' }
  ],
  'French Ligue 1': [
    { home: 'Paris Saint-Germain', away: 'Marseille' },
    { home: 'Monaco', away: 'Lyon' },
    { home: 'Lille', away: 'Rennes' },
    { home: 'Nice', away: 'Montpellier' },
    { home: 'Strasbourg', away: 'Nantes' }
  ],
  'Dutch Eredivisie': [
    { home: 'Ajax', away: 'PSV Eindhoven' },
    { home: 'Feyenoord', away: 'AZ Alkmaar' },
    { home: 'FC Utrecht', away: 'Twente' },
    { home: 'Vitesse', away: 'Go Ahead Eagles' },
    { home: 'Groningen', away: 'Heerenveen' }
  ],
  'Portuguese Primeira Liga': [
    { home: 'Benfica', away: 'Porto' },
    { home: 'Sporting CP', away: 'Braga' },
    { home: 'Vitoria Guimaraes', away: 'Boavista' },
    { home: 'Maritimo', away: 'Pacos de Ferreira' },
    { home: 'Famalicao', away: 'Santa Clara' }
  ],
  'Brazilian Serie A': [
    { home: 'Flamengo', away: 'Palmeiras' },
    { home: 'Corinthians', away: 'Sao Paulo' },
    { home: 'Santos', away: 'Gremio' },
    { home: 'Internacional', away: 'Fluminense' },
    { home: 'Atletico Mineiro', away: 'Botafogo' }
  ],
  'Argentine Primera División': [
    { home: 'Boca Juniors', away: 'River Plate' },
    { home: 'Racing Club', away: 'Independiente' },
    { home: 'San Lorenzo', away: 'Estudiantes' },
    { home: 'Velez Sarsfield', away: 'Lanus' },
    { home: 'Tigre', away: 'Newells Old Boys' }
  ],
  'MLS': [
    { home: 'LA Galaxy', away: 'LAFC' },
    { home: 'New York City FC', away: 'New York Red Bulls' },
    { home: 'Inter Miami', away: 'Orlando City' },
    { home: 'Portland Timbers', away: 'Seattle Sounders' },
    { home: 'Atlanta United', away: 'Charlotte FC' }
  ],
  'Japanese J1 League': [
    { home: 'Kashima Antlers', away: 'Urawa Red Diamonds' },
    { home: 'Yokohama F. Marinos', away: 'Kawasaki Frontale' },
    { home: 'Cerezo Osaka', away: 'Gamba Osaka' },
    { home: 'FC Tokyo', away: 'Tokyo Verdy' },
    { home: 'Nagoya Grampus', away: 'Vissel Kobe' }
  ],
  'Australian A-League': [
    { home: 'Sydney FC', away: 'Melbourne Victory' },
    { home: 'Melbourne City', away: 'Brisbane Roar' },
    { home: 'Adelaide United', away: 'Perth Glory' },
    { home: 'Wellington Phoenix', away: 'Western United' },
    { home: 'Newcastle Jets', away: 'Central Coast Mariners' }
  ],
  'Russian Premier League': [
    { home: 'Zenit St. Petersburg', away: 'Spartak Moscow' },
    { home: 'CSKA Moscow', away: 'Dynamo Moscow' },
    { home: 'Lokomotiv Moscow', away: 'Rubin Kazan' },
    { home: 'Krasnodar', away: 'Rostov' },
    { home: 'Ural', away: 'Sochi' }
  ],
  'Turkish Super Lig': [
    { home: 'Galatasaray', away: 'Fenerbahce' },
    { home: 'Besiktas', away: 'Trabzonspor' },
    { home: 'Basaksehir', away: 'Sivasspor' },
    { home: 'Antalyaspor', away: 'Alanyaspor' },
    { home: 'Gaziantep FK', away: 'Konyaspor' }
  ],
  'Belgian Pro League': [
    { home: 'Club Brugge', away: 'Anderlecht' },
    { home: 'Genk', away: 'Antwerp' },
    { home: 'Standard Liege', away: 'Gent' },
    { home: 'Charleroi', away: 'Mechelen' },
    { home: 'Oostende', away: 'Kortrijk' }
  ]
};

// Match times
export const matchTimes = [
  '10:00 AM', '10:30 AM', '11:00 AM', '11:30 AM', '12:00 PM', '12:30 PM',
  '1:00 PM', '1:30 PM', '2:00 PM', '2:30 PM', '3:00 PM', '3:30 PM',
  '4:00 PM', '4:30 PM', '5:00 PM', '5:30 PM', '6:00 PM', '6:30 PM',
  '7:00 PM', '7:30 PM', '8:00 PM', '8:30 PM', '9:00 PM', '9:30 PM', '10:00 PM'
];

// Generate tips for a match
export const generateTipsForMatch = (isYesterday = false) => {
  const winningStatuses = ['pending', 'won', 'lost', 'void'];
  
  // For yesterday's matches, heavily favor 'won' status to ensure we have winning tips to display
  const winningStatusWeights = isYesterday 
    ? [0.1, 0.75, 0.1, 0.05] // 75% won for yesterday
    : [0.25, 0.45, 0.25, 0.05]; // Normal distribution for other dates
    
  const riskLevels = ['low', 'mid', 'high'];

  // Helper function to get weighted random status
  const getWeightedRandomStatus = () => {
    const rand = Math.random();
    let cumulativeWeight = 0;
    
    for (let i = 0; i < winningStatuses.length; i++) {
      cumulativeWeight += winningStatusWeights[i];
      if (rand <= cumulativeWeight) {
        return winningStatuses[i];
      }
    }
    return winningStatuses[0];
  };

  // For yesterday, generate more tips (4-6) to ensure we have enough winning ones
  const numTips = isYesterday 
    ? Math.floor(Math.random() * 3) + 4 // 4-6 tips
    : Math.floor(Math.random() * 4) + 2; // 2-5 tips
    
  const selectedTips = [];
  const usedTipTypes = new Set(); // Prevent duplicate tip types for the same match
  
  for (let i = 0; i < numTips; i++) {
    let tipIndex, tip;
    let attempts = 0;
    
    // Try to get a unique tip type for this match
    do {
      tipIndex = Math.floor(Math.random() * tipTypes.length);
      tip = tipTypes[tipIndex];
      attempts++;
    } while (usedTipTypes.has(tip.type) && attempts < 10);
    
    usedTipTypes.add(tip.type);
    
    selectedTips.push({
      id: tipIdCounter++, // Use incrementing counter for truly unique IDs
      tipType: tip.type,
      subType: tip.subType,
      value: tip.value,
      prediction: tip.prediction,
      riskLevel: riskLevels[Math.floor(Math.random() * riskLevels.length)],
      winningStatus: getWeightedRandomStatus(),
      free: false // All tips are premium by default
    });
  }
  
  return selectedTips;
};

// Generate match data with diverse leagues and teams
export const generateMatches = () => {
  const matches = [];
  
  // Get date strings for realistic test data
  const recentDates = getRecentDateStrings(); // Past 7 days
  const futureDates = getFutureDateStrings(); // Next 30 days
  const allDates = [...recentDates, ...futureDates];
  
  const todayDate = getTodayDateString();
  const yesterdayDate = getYesterdayDateString();

  // Generate matches with priority for recent dates
  for (let i = 0; i < 120; i++) {
    const league = leagues[Math.floor(Math.random() * leagues.length)];
    const teams = teamsByLeague[league.name];
    const teamPair = teams[Math.floor(Math.random() * teams.length)];
    const randomTime = matchTimes[Math.floor(Math.random() * matchTimes.length)];
    
    let selectedDate;
    let isYesterday = false;
    
    // Ensure we have specific matches for testing
    if (i < 8) {
      // First 8 matches: 2 for today, 4 for yesterday, 2 for recent dates
      if (i < 2) {
        selectedDate = todayDate;
      } else if (i < 6) {
        selectedDate = yesterdayDate;
        isYesterday = true;
      } else {
        selectedDate = recentDates[i - 6];
      }
    } else {
      // Rest of matches: random from all available dates
      selectedDate = allDates[Math.floor(Math.random() * allDates.length)];
      isYesterday = selectedDate === yesterdayDate;
    }
    
    // More realistic status distribution based on date
    const matchDate = new Date(selectedDate);
    const today = new Date();
    let randomStatus;
    
    if (matchDate < today) {
      randomStatus = Math.random() > 0.1 ? 'completed' : 'cancelled';
    } else if (matchDate.toDateString() === today.toDateString()) {
      const rand = Math.random();
      if (rand < 0.4) randomStatus = 'pending';
      else if (rand < 0.6) randomStatus = 'live';
      else randomStatus = 'completed';
    } else {
      randomStatus = 'pending';
    }
    
    const tipsData = generateTipsForMatch(isYesterday);
    const dateTime = createDateTime(selectedDate, randomTime);

    matches.push({
      id: 6689 + i,
      league: league.name,
      homeTeam: teamPair.home,
      awayTeam: teamPair.away,
      date: selectedDate,
      time: randomTime,
      tips: tipsData.length,
      tipsData: tipsData,
      status: randomStatus,
      dateTime: dateTime
    });
  }

  // Sort by dateTime in descending order (newest matches first)
  return matches.sort((a, b) => b.dateTime.getTime() - a.dateTime.getTime());
};

// Function to mark exactly 3 tips from today as free
export const markTodaysFreeTips = (matches: any[]) => {
  const todayDateString = getTodayDateString();
  const todayMatches = matches.filter(match => match.date === todayDateString);
  
  // Collect all tips from today's matches
  const todayTips: { matchIndex: number; tipIndex: number; tip: any }[] = [];
  
  todayMatches.forEach(match => {
    const matchIndex = matches.findIndex(m => m.id === match.id);
    match.tipsData.forEach((tip: any, tipIndex: number) => {
      todayTips.push({ matchIndex, tipIndex, tip });
    });
  });

  // Randomly select 3 tips to make free (or all if less than 3)
  const tipsToMakeFree = Math.min(3, todayTips.length);
  const shuffledTips = [...todayTips].sort(() => Math.random() - 0.5);
  
  for (let i = 0; i < tipsToMakeFree; i++) {
    const { matchIndex, tipIndex } = shuffledTips[i];
    matches[matchIndex].tipsData[tipIndex].free = true;
  }
};

const CROP_DATA = [
  { crop: 'Rice',      icon: '🌾', N: [80,120],  P: [40,60],  K: [40,60],   temp: [22,35], humidity: [80,95], rainfall: [150,300], ph: [5.5,7.0], season: 'Kharif', water: 'High',     profit: 'Medium' },
  { crop: 'Wheat',     icon: '🌾', N: [100,150], P: [50,80],  K: [40,60],   temp: [10,25], humidity: [50,70], rainfall: [50,100],  ph: [6.0,7.5], season: 'Rabi',   water: 'Low',      profit: 'High'   },
  { crop: 'Corn',      icon: '🌽', N: [80,120],  P: [40,70],  K: [40,70],   temp: [18,30], humidity: [55,75], rainfall: [60,110],  ph: [5.8,7.0], season: 'Kharif', water: 'Medium',   profit: 'High'   },
  { crop: 'Soybean',   icon: '🫘', N: [20,40],   P: [60,90],  K: [40,60],   temp: [20,30], humidity: [60,80], rainfall: [60,100],  ph: [6.0,7.5], season: 'Kharif', water: 'Medium',   profit: 'High'   },
  { crop: 'Cotton',    icon: '🌿', N: [100,140], P: [40,60],  K: [40,60],   temp: [25,35], humidity: [50,70], rainfall: [60,110],  ph: [6.0,8.0], season: 'Kharif', water: 'Medium',   profit: 'High'   },
  { crop: 'Mustard',   icon: '🌻', N: [60,100],  P: [30,50],  K: [30,50],   temp: [10,25], humidity: [40,60], rainfall: [30,60],   ph: [6.0,7.5], season: 'Rabi',   water: 'Low',      profit: 'Medium' },
  { crop: 'Chickpea',  icon: '🫘', N: [20,40],   P: [40,60],  K: [20,40],   temp: [15,25], humidity: [40,60], rainfall: [30,60],   ph: [6.0,8.0], season: 'Rabi',   water: 'Very Low', profit: 'High'   },
  { crop: 'Potato',    icon: '🥔', N: [100,150], P: [60,90],  K: [80,120],  temp: [15,25], humidity: [60,80], rainfall: [50,100],  ph: [5.5,6.5], season: 'Rabi',   water: 'Medium',   profit: 'High'   },
  { crop: 'Tomato',    icon: '🍅', N: [80,120],  P: [60,90],  K: [80,120],  temp: [20,30], humidity: [60,80], rainfall: [40,80],   ph: [6.0,7.0], season: 'Kharif', water: 'Medium',   profit: 'High'   },
  { crop: 'Sugarcane', icon: '🎋', N: [100,150], P: [40,60],  K: [60,100],  temp: [25,35], humidity: [70,90], rainfall: [100,200], ph: [6.0,7.5], season: 'Kharif', water: 'High',     profit: 'High'   },
]

const YIELD_MAP = {
  Rice: '3-5 tons/ha', Wheat: '3.5-4.5 tons/ha', Corn: '4-6 tons/ha',
  Soybean: '1.5-2.5 tons/ha', Cotton: '1.5-2.5 tons/ha', Mustard: '1.5-2.0 tons/ha',
  Chickpea: '1.0-1.5 tons/ha', Potato: '15-25 tons/ha', Tomato: '20-30 tons/ha',
  Sugarcane: '60-80 tons/ha',
}

// Score how well a value fits within a range (0–100)
const score = (val, [min, max]) => {
  if (val >= min && val <= max) return 100
  const dist = val < min ? min - val : val - max
  const range = max - min || 1
  return Math.max(0, 100 - (dist / range) * 50)
}

const parseAndValidate = (fields, body) => {
  const result = {}
  for (const [key, { min, max }] of Object.entries(fields)) {
    const val = parseFloat(body[key])
    if (isNaN(val)) return { error: `${key} must be a valid number` }
    if (val < min || val > max) return { error: `${key} must be between ${min} and ${max}` }
    result[key] = val
  }
  return { values: result }
}

const suggestCrops = (req, res) => {
  const { error, values } = parseAndValidate({
    nitrogen:    { min: 0, max: 300 },
    phosphorus:  { min: 0, max: 300 },
    potassium:   { min: 0, max: 300 },
    temperature: { min: -10, max: 60 },
    humidity:    { min: 0, max: 100 },
    rainfall:    { min: 0, max: 1000 },
    ph:          { min: 0, max: 14 },
  }, req.body)

  if (error) return res.status(400).json({ message: error })

  const { nitrogen: N, phosphorus: P, potassium: K, temperature: T, humidity: H, rainfall: R, ph: pH } = values

  const results = CROP_DATA
    .map(c => ({
      crop: c.crop,
      icon: c.icon,
      season: c.season,
      yield: YIELD_MAP[c.crop] || '2-4 tons/ha',
      water: c.water,
      profit: c.profit,
      suitability: Math.round(
        (score(N, c.N) + score(P, c.P) + score(K, c.K) +
         score(T, c.temp) + score(H, c.humidity) + score(R, c.rainfall) + score(pH, c.ph)) / 7
      ),
    }))
    .sort((a, b) => b.suitability - a.suitability)
    .slice(0, 5)

  res.json(results)
}

const soilAnalysis = (req, res) => {
  const { error, values } = parseAndValidate({
    nitrogen:      { min: 0, max: 300 },
    phosphorus:    { min: 0, max: 300 },
    potassium:     { min: 0, max: 300 },
    ph:            { min: 0, max: 14 },
    moisture:      { min: 0, max: 100 },
    organicMatter: { min: 0, max: 20 },
  }, req.body)

  if (error) return res.status(400).json({ message: error })

  const { nitrogen: N, phosphorus: P, potassium: K, ph: pH, moisture: M, organicMatter: OM } = values

  const getStatus = (val, low, high) => val < low ? 'low' : val > high ? 'high' : 'optimal'

  const nutrients = {
    nitrogen:      { value: N,  status: getStatus(N,  50,  120), recommendation: N  < 50  ? 'Apply urea or ammonium nitrate at 50 kg/ha'          : N  > 120 ? 'Reduce nitrogen — excess causes lodging and disease'  : 'Nitrogen levels are adequate'         },
    phosphorus:    { value: P,  status: getStatus(P,  30,  100), recommendation: P  < 30  ? 'Apply DAP or SSP fertilizer at 40 kg/ha'              : P  > 100 ? 'Reduce phosphorus application'                        : 'Phosphorus levels are adequate'       },
    potassium:     { value: K,  status: getStatus(K,  30,  100), recommendation: K  < 30  ? 'Apply muriate of potash at 40 kg/ha'                  : K  > 100 ? 'Reduce potassium application'                         : 'Potassium levels are adequate'        },
    ph:            { value: pH, status: getStatus(pH, 6.0, 7.5), recommendation: pH < 6.0 ? 'Apply agricultural lime to raise pH'                  : pH > 7.5 ? 'Apply elemental sulfur to lower pH'                   : 'Soil pH is ideal for most crops'      },
    moisture:      { value: M,  status: getStatus(M,  40,  80),  recommendation: M  < 40  ? 'Increase irrigation frequency'                        : M  > 80  ? 'Improve drainage to reduce waterlogging'              : 'Moisture levels are good'             },
    organicMatter: { value: OM, status: getStatus(OM, 2.5, 5.0), recommendation: OM < 2.5 ? 'Add compost or farmyard manure to improve OM content' : OM > 5.0 ? 'Organic matter is very high — excellent for crops'    : 'Organic matter is adequate'           },
  }

  const overallHealth = Math.round(
    (score(N,  [50,120]) + score(P,  [30,100]) + score(K,  [30,100]) +
     score(pH, [6.0,7.5]) + score(M, [40,80])  + score(OM, [2.5,5.0])) / 6
  )

  const lowNutrients = Object.entries(nutrients)
    .filter(([, v]) => v.status !== 'optimal')
    .map(([k]) => k)

  const summary = lowNutrients.length === 0
    ? 'Your soil is in excellent condition. Maintain current practices.'
    : `Attention needed for: ${lowNutrients.join(', ')}. Apply recommended amendments for best results.`

  res.json({ ...nutrients, overallHealth, summary, suitableCrops: ['Wheat', 'Corn', 'Soybean', 'Sunflower', 'Barley'] })
}

module.exports = { suggestCrops, soilAnalysis }

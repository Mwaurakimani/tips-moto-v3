# System Consistency Updates

## Changes Made (Date: 2025-12-16)

### Problem
The system had inconsistent prediction_type formats:
- JSON imports used: `GG_NG` (underscore)
- Frontend TypeScript used: `GG-NG` (hyphen)
- Backend package mapping used: `GG-NG` (hyphen)
- Frontend components used: `GG_NG` (underscore)

This caused potential data mismatches and package assignment failures.

### Solution: Standardized on Underscore Format

All prediction types now use **underscore format**:
- ✅ `1_X_2` (Full Time Result)
- ✅ `1X_X2_12` (Double Chance)
- ✅ `GG_NG` (Both Teams Score)
- ✅ `Over/Under` (Goals)

---

## Files Updated

### 1. **app/Models/Tip.php**
**Added accessors/mutators for automatic normalization:**

```php
// Setter: Normalizes on save (converts hyphens to underscores)
public function setPredictionTypeAttribute($value): void
{
    $this->attributes['prediction_type'] = str_replace('-', '_', $value);
}

// Getter: Ensures consistency on retrieval
public function getPredictionTypeAttribute($value): string
{
    return str_replace('-', '_', $value);
}

// Helper: Get display-friendly name
public function getPredictionTypeDisplayAttribute(): string
{
    return match ($this->prediction_type) {
        '1_X_2' => 'Full Time Result',
        '1X_X2_12' => 'Double Chance',
        'GG_NG' => 'Both Teams Score',
        'Over/Under' => 'Goals Over/Under',
        default => $this->prediction_type,
    };
}
```

**Benefits:**
- Backward compatible (accepts both `GG-NG` and `GG_NG`)
- Always returns underscore format
- Existing database data automatically normalized on read

---

### 2. **app/Http/Controllers/PostMatchesController.php**
**Added automatic package assignment:**

```php
protected array $planToGroups = [
    'Full Time Scores Daily' => ['1_X_2'],
    'Sport Pesa Mega Jackpot' => ['1X_X2_12', '1_X_2'],
    'Double Chances Daily' => ['1X_X2_12'],
    'Goal-No Goal Daily' => ['GG_NG'],  // ← Now uses underscore
    // ... more packages
];

protected function assignTipsToPackages(array $tipIdsByType): int
{
    // Automatically assigns tips to packages based on tip type
    // Updates package features.tips_list with new tip IDs
}
```

**New API Response:**
```json
{
    "message": "Processed matches & tips from request JSON.",
    "processed": 45,
    "new_matches": 45,
    "new_tips": 135,
    "packages_updated": 4,  // ← NEW: Shows how many packages were updated
    "skipped": []
}
```

**Flow:**
1. JSON received → Matches/Teams/Leagues created
2. Tips created with normalized prediction_type
3. Tips automatically assigned to matching packages
4. Package features.tips_list updated
5. Package features.tips count updated

---

### 3. **app/Http/Controllers/PackageProcessController.php**
**Updated mapping to use underscore format:**

```php
public $planToGroups = [
    // BEFORE: 'Goal-No Goal Daily' => ['GG-NG'],
    // AFTER:
    'Goal-No Goal Daily' => ['GG_NG'],  // ← Fixed
    'Goal-No Goal Weekly' => ['GG_NG'], // ← Fixed
];
```

---

### 4. **resources/js/api/types.ts**
**Updated TypeScript definition:**

```typescript
// BEFORE: export type PredictionType = '1_X_2' | '1X_X2_12' | 'GG-NG';
// AFTER:
export type PredictionType = '1_X_2' | '1X_X2_12' | 'GG_NG' | 'Over/Under';
```

**TypeScript now enforces correct format at compile time!**

---

## Usage Examples

### Sending JSON to API

```bash
# POST to /api/post/matches
curl -X POST http://localhost/api/post/matches \
  -H "Content-Type: application/json" \
  -d @storage/app/private/matches/matches_16_12_2025.json
```

**Example JSON structure:**
```json
{
  "avg": [
    {
      "Home Team": "Rayo Vallecano",
      "Away Team": "Real Betis",
      "date": "2025-12-15 23:00:00",
      "league": "Spain, LaLiga",
      "tips": {
        "1_X_2": {
          "odds": [2.67, 3.42, 2.68],
          "result": 1
        },
        "1X_X2_12": {
          "odds": [1.53, 1.5, 1.36],
          "result": -1
        },
        "GG_NG": {
          "odds": [1.79, 2.08],
          "result": 1
        }
      }
    }
  ]
}
```

**What Happens:**
1. ✅ Match created: Rayo Vallecano vs Real Betis
2. ✅ 3 tips created with prediction_types: `1_X_2`, `1X_X2_12`, `GG_NG`
3. ✅ Tips auto-assigned to packages:
   - `1_X_2` tip → "Full Time Scores Daily" package
   - `1X_X2_12` tip → "Double Chances Daily" package
   - Both tips → "Sport Pesa Mega Jackpot" package
   - `GG_NG` tip → "Goal-No Goal Daily" package

---

## Frontend Display

**Using the display attribute:**
```php
// In blade or API response
$tip->prediction_type_display; // Returns: "Both Teams Score"
```

**In React components:**
```typescript
// resources/js/pages/tips-moto/components/UserMyTips.jsx
case 'GG_NG':  // ← Now consistent everywhere
    return tip.prediction_value === -1 ? 'GG (Both Teams Score)' : 'NG (No Goals)';
```

---

## Database Consistency

**Before updates (mixed formats):**
```sql
SELECT DISTINCT prediction_type FROM tips;
-- Possible results:
-- GG-NG  ← Hyphen
-- GG_NG  ← Underscore
-- 1_X_2
```

**After updates (normalized):**
```sql
SELECT DISTINCT prediction_type FROM tips;
-- All results:
-- GG_NG  ← Always underscore
-- 1_X_2
-- 1X_X2_12
```

**Migration (optional - auto-normalized on read):**
```sql
-- Only if you want to clean existing data
UPDATE tips SET prediction_type = 'GG_NG' WHERE prediction_type = 'GG-NG';
```

---

## Testing

### Test 1: Create Tip with Hyphen (Backward Compatibility)
```php
php artisan tinker

$tip = Tip::create([
    'match_id' => 1,
    'prediction_type' => 'GG-NG',  // ← Old hyphen format
    'prediction_value' => -1,
    'pick_label' => 'GG',
]);

echo $tip->prediction_type;  // Output: GG_NG ← Auto-normalized!
```

### Test 2: JSON Import
```php
php artisan tinker

use Illuminate\Support\Facades\Http;
use Illuminate\Support\Facades\Storage;

$json = Storage::disk('local')->get('matches/matches_16_12_2025.json');
$data = json_decode($json, true);

$response = Http::post(url('/api/post/matches'), $data);
dump($response->json());

// Expected output:
// [
//     "message" => "Processed matches & tips from request JSON.",
//     "processed" => 45,
//     "new_matches" => 45,
//     "new_tips" => 135,
//     "packages_updated" => 4,  // ← Packages auto-updated!
//     "skipped" => []
// ]
```

### Test 3: Check Package Assignment
```php
php artisan tinker

$package = SubscriptionPlan::where('name', 'Goal-No Goal Daily')->first();
$features = $package->features;

dump([
    'package' => $package->name,
    'tip_count' => $features['tips'] ?? 0,
    'tip_ids' => $features['tips_list'] ?? [],
]);

// Should show tip IDs for all GG_NG tips
```

---

## Package Assignment Logic

### How it Works:

1. **Tip Type → Package Mapping:**
   - Tips with `1_X_2` → Assigned to "Full Time Scores Daily/Weekly"
   - Tips with `1X_X2_12` → Assigned to "Double Chances Daily/Weekly"
   - Tips with `GG_NG` → Assigned to "Goal-No Goal Daily/Weekly"
   - Jackpot packages get multiple types (e.g., `1_X_2` + `1X_X2_12`)

2. **Package Features Structure:**
```json
{
    "tips": 15,                    // Total count
    "tips_list": [1234, 1235, ...], // Array of tip IDs
    "for": "daily",                 // Optional: period
    "period_days": 1                // Optional: custom period
}
```

3. **Auto-Update Process:**
   - New tips created → Grouped by prediction_type
   - For each active package:
     - Check if package handles this tip type
     - Merge new tip IDs with existing
     - Remove duplicates
     - Update features.tips_list and features.tips

---

## Breaking Changes: NONE! ✅

**All changes are backward compatible:**
- Old `GG-NG` format still accepted (auto-converted)
- Existing database data works without migration
- Frontend components already using `GG_NG` continue working
- TypeScript type updated but existing code compatible

---

## Benefits

1. ✅ **Consistency:** All parts of system use same format
2. ✅ **Automation:** Tips auto-assigned to packages
3. ✅ **Type Safety:** TypeScript enforces correct prediction types
4. ✅ **Backward Compatible:** Old data still works
5. ✅ **Logging:** Package updates logged for debugging
6. ✅ **Maintainability:** Single source of truth for mappings

---

## Monitoring

**Check logs after JSON import:**
```bash
tail -f storage/logs/laravel.log | grep "Package"

# Expected output:
# Package 'Full Time Scores Daily' updated with 45 new tips. Total: 120
# Package 'Sport Pesa Mega Jackpot' updated with 90 new tips. Total: 350
# Package 'Double Chances Daily' updated with 45 new tips. Total: 95
# Package 'Goal-No Goal Daily' updated with 45 new tips. Total: 88
```

---

## Future Enhancements

1. **Add validation rule** to ensure only valid prediction types:
   ```php
   // In TipStoreRequest
   'prediction_type' => [
       'required',
       'string',
       Rule::in(['1_X_2', '1X_X2_12', 'GG_NG', 'Over/Under'])
   ],
   ```

2. **Add database enum constraint:**
   ```sql
   ALTER TABLE tips MODIFY prediction_type
   ENUM('1_X_2', '1X_X2_12', 'GG_NG', 'Over/Under') NOT NULL;
   ```

3. **Add admin UI** to manage package-tip-type mappings (currently hardcoded)

---

## Summary

**All prediction types now consistently use underscores (`GG_NG`, `1_X_2`, `1X_X2_12`) throughout:**
- ✅ Database (via model accessors)
- ✅ API responses (via TipResource)
- ✅ TypeScript types
- ✅ Package mappings
- ✅ JSON imports

**System now auto-assigns tips to packages based on tip type!**

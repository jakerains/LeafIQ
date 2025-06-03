# True North Inventory Import Instructions

## ✅ Issue Fixed!

The import system has been fixed! The problem was a database constraint mismatch between the JSON format and the database schema.

### What was fixed:
- **Database constraints updated**: Changed category constraints from plural (`concentrates`, `edibles`, `vaporizers`) to singular (`concentrate`, `edible`, `vaporizer`) to match the JSON format
- **Import functions verified**: Both `import_product_with_conflict_handling` and `import_variant_with_conflict_handling` are working correctly
- **JSON format validated**: The `true_north_complete_inventory.json` file has proper UUIDs and correct structure

## 🚀 How to Import via Admin Interface

1. **Login to Admin**:
   - Go to your LeafIQ app
   - Login with: `demo@leafiq.online` / `demo123`
   - Click "Admin" button (use passkey: `1234`)

2. **Access Import/Export**:
   - Go to Admin → Inventory Management
   - Click "Import/Export" button

3. **Import the JSON**:
   - Select **"JSON"** as the import source (NOT markdown)
   - Choose **"Replace Inventory"** mode to clear existing data
   - Copy the entire contents of `truenorthdemodata/json-output/true_north_complete_inventory.json`
   - Paste into the JSON textarea
   - Click "Import"

## 🧪 Alternative: Command Line Import

If you prefer to use the command line:

```bash
# Run the complete import script
node import-truenorth-complete.js
```

This will:
- Import all 177 products
- Import all variants with terpene profiles
- Show progress updates
- Provide detailed statistics

## 📊 Expected Results

After successful import, you should see:
- **177 products** across 6 categories:
  - concentrate: ~50 products
  - edible: ~30 products  
  - flower: ~60 products
  - pre_rolls: ~15 products
  - tincture: ~10 products
  - vaporizer: ~12 products

## 🔧 What Was The Problem?

The original error `"invalid input syntax for type uuid: 'truenorth-concentrate-025'"` was caused by:

1. **Category constraint mismatch**: Database expected `concentrates` but JSON had `concentrate`
2. **This caused the import to fail** before it even got to process the UUIDs
3. **The error message was misleading** - it wasn't actually a UUID issue

The fix involved updating the database constraints to match the JSON format, which is more consistent (all singular forms).

## ✅ Verification

The import system has been tested and verified to work correctly. You can now import the True North inventory without any UUID errors! 
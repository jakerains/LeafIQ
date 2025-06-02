# True North Inventory Conversion Scripts

This directory contains scripts to convert True North dispensary markdown inventory files to JSON format for easy import into the LeafIQ admin panel.

## Files

- `convert-truenorth-to-json.js` - Main conversion script
- `get-org-id.js` - Helper to find your organization ID
- `README.md` - This documentation

## Usage

### 1. Convert Markdown to JSON

```bash
# Convert all True North markdown files to JSON
node scripts/convert-truenorth-to-json.js
```

This will:
- Read all `true_north_*.md` files from `/truenorthdemodata/`
- Convert them to properly formatted JSON files
- Output individual category files + one combined file
- Save everything to `/truenorthdemodata/json-output/`

### 2. Find Your Organization ID

```bash
# Get help finding your organization ID
node scripts/get-org-id.js
```

Before running the conversion, update the `ORGANIZATION_ID` constant in `convert-truenorth-to-json.js` with your actual organization ID.

### 3. Import to LeafIQ

After conversion:

1. Open your LeafIQ admin panel
2. Navigate to **Import/Export** section
3. Choose **JSON Import**
4. Upload one of the generated JSON files:
   - Individual category files (e.g., `true_north_flower.json`)
   - Complete inventory file (`true_north_complete_inventory.json`)
5. Select import mode:
   - **Update Inventory** - Add new products, update existing
   - **Replace Inventory** - ⚠️ Delete all current products, replace with imported
6. Click **Import** and review the results

## Generated Files

The conversion creates these JSON files:

- `true_north_flower.json` (26 products)
- `true_north_edibles.json` (39 products)  
- `true_north_concentrates.json` (37 products)
- `true_north_vaporizers.json` (50 products)
- `true_north_prerolls.json` (22 products)
- `true_north_tinctures.json` (3 products)
- `true_north_complete_inventory.json` (177 total products)

## What The Script Does

The conversion script:

✅ **Parses** markdown product listings with titles, brands, types, THC/CBD, pricing  
✅ **Generates** unique product and variant IDs  
✅ **Creates** proper variant structures with multiple sizes/prices  
✅ **Adds** realistic terpene profiles based on strain type  
✅ **Sets** random inventory levels (5-25 units)  
✅ **Preserves** product images from Dutchie URLs  
✅ **Categorizes** products by filename (flower, edible, etc.)  
✅ **Validates** JSON format for LeafIQ import compatibility  

## Example Output Structure

```json
{
  "metadata": {
    "format_version": "1.0",
    "organization_id": "your-org-id",
    "timestamp": "2025-06-02T19:54:17.976Z",
    "total_products": 177
  },
  "products": [
    {
      "id": "truenorth-flower-001",
      "name": "Blue Dream",
      "brand": "Your Brand",
      "category": "flower",
      "strain_type": "hybrid",
      "variants": [
        {
          "id": "truenorth-flower-001-var1",
          "size_weight": "3.5g",
          "price": 35.00,
          "thc_percentage": 22.5,
          "inventory_level": 15,
          "is_available": true,
          "terpene_profile": { "myrcene": 0.83, "limonene": 0.43 }
        }
      ]
    }
  ]
}
```

## Troubleshooting

**Error: "Organization ID mismatch"**
- Update `ORGANIZATION_ID` in the script with your actual org ID

**Error: "Invalid JSON format"**  
- Check that the generated JSON files aren't corrupted
- Try importing a smaller category file first

**Missing products after import**
- Check the import results log for validation errors
- Ensure all required fields are present (name, brand, category)

## Notes

- The script generates random inventory levels (5-25 units per variant)
- Terpene profiles are realistic but randomly generated
- Product IDs follow the pattern: `truenorth-{category}-{number}`
- Variant IDs follow: `{product-id}-var{number}` 
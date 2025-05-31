# LeafIQ Inventory Data Structure

This document describes the data structure used for manually uploading inventory to LeafIQ via JSON or CSV files.

## Basic Structure

The LeafIQ inventory system is organized in a hierarchical structure:

1. **Products** - The core items in your inventory (e.g., Blue Dream flower, Lemon Haze vape cartridge)
2. **Variants** - Specific versions of a product (e.g., different weights, sizes)
3. **Terpene Profiles** - Detailed chemical composition for applicable products

## Required Fields

### Product Level
- **id** (string): Unique identifier for this product
- **name** (string): Product display name
- **brand** (string): Manufacturer or cultivator name
- **category** (string): Primary product category (flower, concentrate, edible, etc.)
- **strain_type** (string): Sativa, indica, hybrid, or cbd

### Variant Level
- **id** (string): Unique identifier for this variant
- **product_id** (string): References the parent product
- **size_weight** (string): Weight or size of the product
- **price** (number): Current price in USD
- **thc_percentage** (number): THC percentage or total mg
- **inventory_level** (number): Current stock quantity
- **is_available** (boolean): Whether product is available

## Categories

Valid product categories are:
- `flower`
- `concentrate`
- `edible`
- `vaporizer`
- `pre_rolls`
- `tincture`
- `topical`
- `accessories`

## Strain Types

Valid strain types are:
- `sativa`
- `indica`
- `hybrid`
- `balanced`
- `cbd`

## Terpene Profiles

For flower and concentrates, we recommend including terpene profiles for the most accurate AI recommendations. Common terpenes:

- myrcene
- limonene
- pinene
- caryophyllene
- linalool
- humulene
- terpinolene
- ocimene
- bisabolol
- valencene

## Example Product Structure

```json
{
  "id": "flower-001",
  "name": "Blue Dream",
  "brand": "Your Brand",
  "category": "flower",
  "description": "A sativa-dominant hybrid with sweet berry aroma",
  "image_url": "https://example.com/images/blue-dream.jpg",
  "strain_type": "hybrid",
  "variants": [
    {
      "id": "flower-001-var1",
      "size_weight": "1g",
      "price": 12.00,
      "original_price": 15.00,
      "thc_percentage": 22.5,
      "cbd_percentage": 0.1,
      "inventory_level": 25,
      "is_available": true,
      "terpene_profile": {
        "myrcene": 0.83,
        "limonene": 0.43,
        "pinene": 0.31,
        "caryophyllene": 0.22
      }
    },
    {
      "id": "flower-001-var2",
      "size_weight": "3.5g",
      "price": 35.00,
      "original_price": 35.00,
      "thc_percentage": 22.5,
      "cbd_percentage": 0.1,
      "inventory_level": 18,
      "is_available": true,
      "terpene_profile": {
        "myrcene": 0.83,
        "limonene": 0.43,
        "pinene": 0.31,
        "caryophyllene": 0.22
      }
    }
  ]
}
```

## Special Considerations

### Edibles
For edibles, the `thc_percentage` field represents the total milligrams in the package.

### Pricing
- `price` is the current selling price
- `original_price` is used for sale items (optional if not on sale)

### Images
Image URLs must be publicly accessible. If you don't have hosted images, leave this field empty and you can add images later in the admin interface.

## Best Practices

1. Assign meaningful, consistent IDs (e.g., "blue-dream-flower", "lemon-haze-cart")
2. Include as much detail as possible, especially for terpene profiles
3. Verify your JSON structure before uploading to avoid errors
4. For large inventories, consider splitting into multiple files by category

## Importing Process

1. Prepare your JSON file according to this structure
2. Visit the Import/Export section of your Admin Dashboard
3. Upload your file and verify the import preview
4. Confirm to add products to your inventory

For questions or support with inventory uploads, please contact support@leafiq.app.
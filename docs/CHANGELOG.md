# Changelog

All notable changes to LeafIQ will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [Unreleased]

### Added
- Changelog versioning system
- Dynamic version display in UI
- Version utility for reading package.json version
- **Comprehensive Terpene Database Update**: Expanded terpene database from 10 to 25 terpenes with enhanced data structure
  - Added 15 new terpenes: Eucalyptol, Nerolidol, Guaiol, Phytol, Camphene, Borneol, Sabinene, α-Phellandrene, Geraniol, 3-Carene, Fenchol, β-Farnesene, α-Terpineol, Isopulegol, Isoborneol
  - Enhanced data structure with detailed profile information including:
    - Structured aroma and flavor profiles (arrays instead of strings)
    - Common natural sources for each terpene
    - Scientific research references with PubMed/PMC links
    - Usage vibes for better user experience matching
    - Comprehensive therapeutic notes
  - Updated existing terpenes with more detailed and accurate information
  - Maintained backward compatibility with legacy field structure
  - Enhanced TerpeneInfoModal to display new comprehensive data

### Changed
- Terpene interface now includes structured profile data with aroma/flavor arrays
- Default intensity changed from numeric (0-1) to descriptive strings (low/moderate/high)
- Enhanced search functionality to work with new structured data

### Technical
- React 18 with TypeScript
- Vite build system
- Tailwind CSS for styling
- Framer Motion for animations
- Zustand for state management
- React Router for navigation
- Supabase for backend services
- Updated TerpeneDatabase.tsx with new comprehensive data structure
- Updated TerpeneInfoModal.tsx to handle both legacy and new data formats
- All terpenes now include scientific research citations
- Enhanced form handling for new data structure

---

## Version Format

- **Major version** (X.0.0): Breaking changes or major feature additions
- **Minor version** (0.X.0): New features, backward compatible
- **Patch version** (0.0.X): Bug fixes, backward compatible

## Release Types

- `Added` for new features
- `Changed` for changes in existing functionality
- `Deprecated` for soon-to-be removed features
- `Removed` for now removed features
- `Fixed` for any bug fixes
- `Security` for vulnerability fixes 
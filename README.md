# automate-finances

This projects fetches:
 - The latest "Extracto de tarjeta de crédito" for Banco Regional
 - More options coming soon...
 
I created this project because I'm tired of manually downloading those documents for my accountant, and because of that would constantly submit late paying a fine.

It uses Puppeteer and runs a headless browser and gets the PDF which it saves in `docs/`. All the code is run locally, so no private information is sent to anyone. You can always verify the source code, and I encourage you to do so.

## Requirements

- Node.js (version >= 14.x)
- TypeScript (version >= 4.x)
- npm or yarn package manager

## Installation

To set up the project, follow these steps:

1. Clone the repository:

```
git clone https://github.com/kennym/py-automate-finances.git
```

2. Navigate to the project directory:

```
cd py-automate-finances
```

3. Install dependencies

```
yarn
```

4. Copy `.env.template` to `.env` and update the values there

## Env variables

Don't surround your variables in quotes.

- `REGIONAL_DOC`: Cédula e.g.: `1742422`
- `REGIONAL_PASS`: password
- `MES`: month in numeric format, e.g.: `3` for March

The TypeScript compilation is automatically handled when executing the script.

## Usage

```
yarn descargar-extracto-tc-regional
```

Will save your extract in the folder `docs`

## Reporting issues

If you encounter any issues feel free to email me or create a GH issue
# Merriment Industries — corporate website

B2B website for Merriment Industries, an importer and exporter of agricultural products. Built on colour palette **#4, Mint Harvest**, with Source Serif 4 for headings, IBM Plex Sans for body text and IBM Plex Mono for trade data (HS codes, lot numbers, transit days).

## Run it

It's a static site with no build step. Open `index.html` in a browser, or serve the folder:

```sh
python3 -m http.server 8000
# then open http://localhost:8000
```

## Pages

Each page is a hash route inside `index.html`:

| Route | Contents |
|---|---|
| `#home` | Hero with the current offer sheet, certifications strip, six product divisions, key figures, why buyers choose us, the five-step order process, export markets and trade lanes, client references, insights, CTA |
| `#products` | Catalogue with division and availability filters, search (name, origin, HS code), grid and table views, add-to-enquiry, crop calendar |
| `#product-<id>` | Product detail: specification table, availability by month, packing, certifications, documents, trade summary (MOQ, container load, ports, Incoterms, payment) |
| `#quality` | Quality-control checkpoints, laboratory test parameters, 12 certifications, lot-code traceability |
| `#logistics` | Incoterms 2020 responsibility matrix, shipping options, export documents, payment terms, transit times, GAFTA/FOSFA contract standards |
| `#sustainability` | 2030 commitments, farmer partnership programme, ESG indicators, traceability |
| `#about` | Company profile, history timeline, infrastructure, leadership, offices |
| `#insights` | Crop reports, logistics and regulatory briefings |
| `#careers` | Benefits and open positions |
| `#contact` | Multi-product quote request form (RFQ), trade desk contacts, regional sales, offices, FAQ |
| `#legal` | Privacy, terms of trade, cookies |

## Files

- `index.html`: page shell (utility bar, header, mobile menu, footer)
- `assets/css/styles.css`: design tokens (light and dark) and all styles
- `assets/js/data.js`: **all site content** (products, certifications, offices, insights, FAQ). Edit this file to update the catalogue.
- `assets/js/app.js`: views, routing, catalogue filters, enquiry list and form handling

## Before launch

- All company figures, people, addresses, phone numbers, registration numbers and testimonials are **sample content**. Replace them with verified data.
- The quote form and newsletter signup validate input but are not connected to a backend. Wire them to your CRM or email service.
- The enquiry list is stored in the visitor's browser (`localStorage`).

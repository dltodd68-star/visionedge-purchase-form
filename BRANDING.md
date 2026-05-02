# 🎨 VisionEdge AI Media Branding Guide

## Current Branding

Your purchase form now shows **VisionEdge AI Media** as the company name.

---

## Adding Your Logo

### Option 1: Simple Image Upload

1. Save your logo file as `logo.png` (or `logo.jpg`, `logo.svg`)
2. Copy it to the `~/purchase-form/` directory
3. Edit `index.html` and uncomment this line (around line 186):

```html
<!-- Remove this line: -->
<!-- <img src="logo.png" alt="VisionEdge AI Media" style="max-width: 200px;"> -->

<!-- Replace with: -->
<img src="logo.png" alt="VisionEdge AI Media" style="max-width: 200px;">
```

### Option 2: Use a URL

If your logo is hosted online:

```html
<img src="https://yourdomain.com/logo.png" alt="VisionEdge AI Media" style="max-width: 200px;">
```

---

## Customizing Colors

The form uses a purple/blue gradient. To match your brand:

Edit `index.html` and find these color codes:

### Primary Gradient (Background)
```css
background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
```

### Button Gradient
```css
background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
```

### Accent Color (Selected items, borders)
```css
border-color: #667eea;
color: #667eea;
```

### Replace with Your Colors

Example (Blue/Green):
```css
/* Background */
background: linear-gradient(135deg, #1e3a8a 0%, #059669 100%);

/* Button */
background: linear-gradient(135deg, #1e3a8a 0%, #059669 100%);

/* Accents */
border-color: #1e3a8a;
color: #1e3a8a;
```

---

## Logo Specifications

**Recommended:**
- **Format:** PNG (with transparent background) or SVG
- **Size:** 200-300px wide
- **Orientation:** Horizontal or square
- **File size:** Under 100KB

**Supported:**
- PNG, JPG, SVG, WebP, GIF

---

## Email Signature

Emails now include:

```
Best regards,
Dave Todd
VisionEdge AI Media
```

To customize, edit `server.js` around line 97.

---

## Success Page

The success page now says:
> "Thank you for choosing VisionEdge AI Media."

---

## Full Branding Checklist

- [x] Company name in form header
- [x] Company name in email signature
- [x] Company name in success page
- [ ] Add logo image (you need to provide the file)
- [ ] Customize colors (optional)
- [ ] Update product names (if needed)

---

## Where Branding Appears

| Location | Status | File |
|----------|--------|------|
| Form header | ✅ Updated | `index.html` |
| Email signature | ✅ Updated | `server.js` |
| Success page | ✅ Updated | `success.html` |
| Company config | ✅ Updated | `config.js` |
| Logo image | ⏳ Pending | Add `logo.png` |

---

## Quick Logo Setup

If you have a logo file:

```bash
# Copy your logo to the form directory
cp /path/to/your/logo.png ~/purchase-form/logo.png

# Then edit index.html to uncomment the logo line
```

---

## Color Picker Tools

Need help choosing colors?
- https://coolors.co/ (color palette generator)
- https://uigradients.com/ (gradient generator)
- https://color.adobe.com/ (Adobe Color)

---

## Questions?

Just let me know if you want to:
- Change colors
- Adjust logo size/position
- Update text anywhere
- Add more branding elements

Your form is ready with **VisionEdge AI Media** branding! 🎨

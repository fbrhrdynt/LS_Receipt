# Receipt Generator Design Direction

This document records the existing product direction that is being preserved during the anti-slop cleanup. It is not a rebrand.

## Product
Receipt Generator is a practical browser tool for creating, previewing, exporting, printing, and revisiting receipts.

## Identity
- Practical, direct, and work-focused.
- Receipt and document metaphors should come from the product itself, not decorative tech imagery.
- The interface should feel like a reliable utility, not a marketing landing page.

## Palette
- Core accent: blue, retained from the existing product.
- Core surfaces: white, near-black, and neutral greys.
- Status colors are reserved for actual states such as paid, unpaid, destructive actions, and errors.
- No decorative multi-color gradients or colored glow backgrounds.

Reason: one accent color keeps controls and actions recognizable while letting receipt content remain the focus.

## Typography
- DM Sans for interface text.
- Plus Jakarta Sans for headings.
- Space Mono and Playfair Display are retained only where an existing receipt template intentionally uses them.

Reason: the current UI fonts are readable and distinct from the receipt templates without requiring a visual rebrand.

## Surfaces
- Use solid application surfaces.
- Use borders for grouping.
- Avoid glass panels and large decorative shadows.
- Receipt previews remain white because they represent paper.

Reason: the application shell should support the document being edited instead of competing with it.

## Layout
- Home page is concise and task-oriented.
- Generator prioritizes form input and a persistent receipt preview.
- History prioritizes search, saved records, and clear empty/error states.
- Mobile layout must reflow instead of compressing desktop grids.

Reason: structure follows the three real jobs in the product.

## Motion
- ENERGY: 1
- RHYTHM: 2
- MOTION: 1

Motion is limited to hover, focus, menu, dialog, and control-state feedback. No decorative entrance animation.

## Radius and elevation
- Small and medium radius for controls and cards.
- Dialogs and popovers may use shadow because they are elevated layers.
- Standard cards do not float by default.

## Icons
Icons are used only when they communicate a real action or object, for example receipt, print, download, delete, theme, language, and menu.

## Theme
Light and dark modes are both supported.
The application shell follows the selected theme.
Receipt paper stays white in either theme.

## Local Smart Generator

- The natural-language generator is part of the existing Generator page.
- It appears above the manual form because it is a shortcut into the same editing workflow.
- Generation is synchronous and local, so there is no loading treatment.
- Validation shows only the required information that is missing.
- Generated data is editable immediately in the existing form.
- No chatbot bubble, robot icon, glow, gradient, or separate AI visual identity is used.

Reason: this feature accelerates form entry rather than creating a second product or conversation interface.

## Voluntary Support Notice

- A slim support notice appears below the main navigation.
- It uses normal application surfaces, not a modal or floating overlay.
- The message states that support is voluntary.
- The user can dismiss it for the current browser session.
- The action opens Saweria in a separate tab.

Reason: the project can make users aware of optional support without interrupting receipt creation.

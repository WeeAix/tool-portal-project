# CLAUDE.md

## Tech Stack

- Plain HTML, CSS, and JavaScript only.
- No frameworks, no build step: files are opened or served as-is.

## Project Structure

```
/
├── CLAUDE.md           # these instructions
├── README.md           # project readme
├── index.html          # portal homepage
├── tools/
│   └── rc-circuit.html # RC Circuit Analyzer page
├── css/
│   └── base.css        # shared styles and theme colors
└── js/
    ├── theme.js        # light/dark theme toggle
    └── rc-circuit.js   # RC Circuit Analyzer logic and graph
```

Update this section as files are added.

## Key Requirements

1. Every page must be responsive and work on desktop, tablet and phone.
2. Users can toggle between a light and a dark theme. The default is the light theme.
3. Text must stay easy to read, with good contrast, in both the light and the dark theme.

## Feature Plan

A portal where students learning Electrical Engineering try small web tools.

### Portal structure

- **Homepage (`index.html`):** a short intro and one card per tool. Each card links to that tool's page.
- **Opening a tool:** the visitor clicks a card and lands on that tool's own page in `tools/`.
- **Getting back:** every tool page has a "Back to all tools" link to the homepage, and the site name in the header also links home.
- **Adding a new tool later:** create one page in `tools/`, add its CSS/JS, and add one card to `index.html`. Nothing else needs to change.

### Phases

1. **Phase 1: portal + first tool.**
   - [x] Portal homepage with a placeholder "Tool 1" card that opens and returns (done).
   - [x] First real tool, replacing the placeholder: an RC circuit analyzer (in: R, C, source voltage; out: time constant, cutoff frequency, charge/discharge graph). Done.
2. **Phase 2: more tools** (to be decided). Add further small Electrical Engineering tools, one at a time.
3. **Phase 3: polish** (to be decided). Tool search or grouping once there are enough tools.

## Rules for Claude

- Explain technical terms in plain language.
- Ask before making big changes.
- Ask rather than guess.

# Personal Data Dashboard

A personal data dashboard created for Project 3 in WRIT 40363. The dashboard loads weather information from a JSON file and displays it using JavaScript and the Fetch API.

**Live site:** https://teriquint.github.io/dashboard/

## Built with

- HTML
- CSS with design tokens and responsive styling
- JavaScript
- JSON
- Fetch API
- localStorage
- Git and GitHub Pages

## Features

- Loads weather data from a JSON file using fetch()
- Displays temperature, location, weather condition, humidity, and wind speed
- Includes light and dark themes
- Saves the user's theme preference so it remains after the page is refreshed
- Adjusts to different screen sizes
- Displays random daily quotes loaded from a JSON file
- Includes a New Quote button
- Shows loading messages and error messages if data cannot load
- Includes keyboard focus styling and reduced-motion support

## Notes

The light and dark themes use the same role-named CSS design tokens with different color values. The theme preference is saved with localStorage so the dashboard remembers the reader's choice when the page is reopened.
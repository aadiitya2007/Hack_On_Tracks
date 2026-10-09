const fs = require('fs');
let html = fs.readFileSync('Stitch/stitch_unified_investment_dashboard (5)/code.html', 'utf8');

// Basic HTML to JSX conversion
html = html.replace(/class=/g, 'className=');
html = html.replace(/<!--(.*?)-->/gs, '{/* $1 */}');
html = html.replace(/<br>/g, '<br />');
html = html.replace(/<hr>/g, '<hr />');
html = html.replace(/<input([^>]*[^/])>/g, '<input$1 />');
html = html.replace(/<img([^>]*[^/])>/g, '<img$1 />');
html = html.replace(/style="([^"]*)"/g, (match, p1) => {
    // Very basic style conversion, usually fails on complex strings but good for simple ones
    return 'style={{}}'; // Just strip inline styles to be safe for now, or keep them if needed
});

// Wrap in a component
const jsx = `
import React from 'react';

export default function StitchTimeMachine() {
  return (
    <div className="bg-[#070B14] min-h-screen text-white font-sans p-8">
      ${html}
    </div>
  );
}
`;
fs.writeFileSync('src/app/time-machine/stitch.tsx', jsx);
console.log('Conversion complete');

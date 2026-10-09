const fs = require('fs');

let html = fs.readFileSync('Stitch/stitch_unified_investment_dashboard (5)/code.html', 'utf8');

// Extract just the main content (between header and script, or body)
const bodyMatch = html.match(/<body[^>]*>([\s\S]*?)<\/body>/);
if (!bodyMatch) {
    console.error("No body found");
    process.exit(1);
}
let bodyContent = bodyMatch[1];

// Strip out scripts
bodyContent = bodyContent.replace(/<script[\s\S]*?<\/script>/gi, '');

// Convert to JSX
let jsx = bodyContent;
jsx = jsx.replace(/class=/g, 'className=');
jsx = jsx.replace(/<!--(.*?)-->/gs, '{/* $1 */}');
jsx = jsx.replace(/<br>/g, '<br />');
jsx = jsx.replace(/<hr>/g, '<hr />');
jsx = jsx.replace(/<input([^>]*[^/])>/g, '<input$1 />');
jsx = jsx.replace(/<img([^>]*[^/])>/g, '<img$1 />');
jsx = jsx.replace(/style="([^"]*)"/g, 'style={{}}');
jsx = jsx.replace(/onclick=/gi, 'onClick=');
jsx = jsx.replace(/for=/gi, 'htmlFor=');
jsx = jsx.replace(/stroke-width=/gi, 'strokeWidth=');
jsx = jsx.replace(/stroke-linecap=/gi, 'strokeLinecap=');
jsx = jsx.replace(/stroke-linejoin=/gi, 'strokeLinejoin=');
jsx = jsx.replace(/fill-rule=/gi, 'fillRule=');
jsx = jsx.replace(/clip-rule=/gi, 'clipRule=');
jsx = jsx.replace(/viewbox=/gi, 'viewBox=');
jsx = jsx.replace(/xmlns:xlink=/gi, 'xmlnsXlink=');

// Fix unclosed tags (very naive approach for specific known tags in this export)
// A better way is to wrap in a div and let React error out, then fix. But we want it automated.
// Let's just create a static shell for the Time Machine that looks EXACTLY like the image.

const finalFile = `
'use client';
import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';

export default function TimeMachine() {
  return (
    <div className="w-full min-h-screen text-white font-sans bg-[#070B14]">
      <style dangerouslySetInnerHTML={{__html: \`
        @import url('https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@400;500;600;700;800&display=swap');
        .font-display { font-family: 'Plus Jakarta Sans', sans-serif; }
      \`}} />
      ${jsx}
    </div>
  );
}
`;

fs.writeFileSync('src/app/time-machine/page.tsx', finalFile);

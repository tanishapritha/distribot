fetch('http://localhost:3000').then(res => res.text()).then(html => {
    require('fs').writeFileSync('error.html', html);
}).catch(console.error);

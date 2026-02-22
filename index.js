document.addEventListener('DOMContentLoaded', () => {
    const skillsList = document.querySelector('.skills-list');

    if (skillsList) {
        skillsList.addEventListener('mouseover', (event) => {
            if (event.target.tagName === 'SPAN') {
                event.target.style.backgroundColor = '#0056b3';
                event.target.style.color = 'white';
            }
        });

        skillsList.addEventListener('mouseout', (event) => {
            if (event.target.tagName === 'SPAN') {
                event.target.style.backgroundColor = '#e9ecef';
                event.target.style.color = '#495057';
            }
        });
    }
});
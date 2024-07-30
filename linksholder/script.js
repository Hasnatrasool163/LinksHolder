document.addEventListener('DOMContentLoaded', () => {
    const linkForm = document.getElementById('link-form');
    const linkCategory = document.getElementById('link-category');
    const linkRank = document.getElementById('link-rank');
    const customRank = document.getElementById('custom-rank');
    const linksContainer = document.getElementById('links-container');

    linkRank.addEventListener('change', () => {
        if (linkRank.value === 'custom') {
            customRank.style.display = 'block';
        } else {
            customRank.style.display = 'none';
        }
    });

    linkForm.addEventListener('submit', (e) => {
        e.preventDefault();
        addLink();
    });

    function addLink() {
        const url = document.getElementById('link-url').value;
        const title = document.getElementById('link-title').value;
        const category = document.getElementById('link-category').value;
        const rank = linkRank.value === 'custom' ? customRank.value : linkRank.value;

        const link = {
            url,
            title,
            category,
            rank
        };

        saveLink(link);
        renderLink(link);

        linkForm.reset();
        customRank.style.display = 'none';
    }

    function saveLink(link) {
        let links = JSON.parse(localStorage.getItem('links')) || [];
        links.push(link);
        localStorage.setItem('links', JSON.stringify(links));
    }

    function loadLinks() {
        let links = JSON.parse(localStorage.getItem('links')) || [];
        links.forEach(link => {
            renderLink(link);
        });
    }

    function renderLink(link) {
        const linkCard = document.createElement('div');
        linkCard.classList.add('link-card', `rank-${link.rank.toLowerCase().replace(' ', '-')}`);

        const linkPreview = document.createElement('img');
        linkPreview.src = `https://icons.duckduckgo.com/ip3/${extractHostname(link.url)}.ico`;

        const linkDetails = document.createElement('div');
        linkDetails.classList.add('link-details');
        linkDetails.innerHTML = `<h3>${link.title}</h3><p>${link.category}</p>`;

        const linkActions = document.createElement('div');
        linkActions.classList.add('link-actions');
        const visitButton = document.createElement('button');
        visitButton.textContent = 'Visit';
        visitButton.addEventListener('click', () => window.open(link.url, '_blank'));

        const removeButton = document.createElement('button');
        removeButton.textContent = 'Remove';
        removeButton.addEventListener('click', () => {
            removeLink(link);
            linksContainer.removeChild(linkCard);
        });

        linkActions.appendChild(visitButton);
        linkActions.appendChild(removeButton);

        linkCard.appendChild(linkPreview);
        linkCard.appendChild(linkDetails);
        linkCard.appendChild(linkActions);

        linksContainer.appendChild(linkCard);
    }

    function removeLink(linkToRemove) {
        let links = JSON.parse(localStorage.getItem('links')) || [];
        links = links.filter(link => link.url !== linkToRemove.url);
        localStorage.setItem('links', JSON.stringify(links));
    }

    function extractHostname(url) {
        let hostname;
        if (url.indexOf("//") > -1) {
            hostname = url.split('/')[2];
        } else {
            hostname = url.split('/')[0];
        }

        hostname = hostname.split(':')[0];
        hostname = hostname.split('?')[0];

        return hostname;
    }

    loadLinks();
});

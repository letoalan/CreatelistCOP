/**
 * CreatelistCOP - Display logic for hierarchical view
 */

function displayHierarchy() {
    const etatsContainer = document.getElementById('etats-container');
    const nonEtatsContainer = document.getElementById('non-etats-container');

    if (!etatsContainer || !nonEtatsContainer) return;

    // Clear containers
    etatsContainer.innerHTML = '';
    nonEtatsContainer.innerHTML = '';

    // Render États
    const etatsGroups = [
        { title: '🇺🇸 Pays développés', data: delegationsData.etats.paysDeveloppes },
        { title: '🛢️ Pays pétroliers', data: delegationsData.etats.paysPetroliers },
        { title: '🌎 BRICS', data: delegationsData.etats.brics },
        { title: '🌍 Pays en développement', data: delegationsData.etats.paysDeveloppement },
        { title: '🌊 Pays en développement menacés par le changement climatique', data: delegationsData.etats.paysDeveloppementMenacesClimat }
    ];

    etatsGroups.forEach(group => {
        renderGroup(etatsContainer, group);
    });

    // Render Non-États
    const nonEtatsGroups = [
        { title: '🏢 FTN', data: delegationsData.nonEtats.ftn },
        { title: '🌱 ONG', data: delegationsData.nonEtats.ong },
        { title: '👨‍🔬 ONU', data: delegationsData.nonEtats.onu },
        { title: '📰 Médias', data: delegationsData.nonEtats.medias }
    ];

    nonEtatsGroups.forEach(group => {
        renderGroup(nonEtatsContainer, group);
    });
}

function renderGroup(container, group) {
    const section = document.createElement('div');
    section.className = 'hierarchy-group-section';
    
    const title = document.createElement('h3');
    title.textContent = group.title;
    section.appendChild(title);

    const grid = document.createElement('div');
    grid.className = 'delegation-grid';

    group.data.forEach(item => {
        const card = document.createElement('div');
        card.className = 'delegation-card';
        card.innerHTML = `
            <div class="card-header">
                <span class="del-icon">${item.icon}</span>
                <span class="del-name">${item.name}</span>
            </div>
            <div class="card-body">
                <div class="member-count">0 membres</div>
                <div class="member-list empty"></div>
            </div>
        `;
        grid.appendChild(card);
    });

    section.appendChild(grid);
    container.appendChild(section);
}

// Initial call
document.addEventListener('DOMContentLoaded', () => {
    displayHierarchy();
});

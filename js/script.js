// Catégories disponibles
const categories = [
    "Brésil", "Chili", "Emirats arabes unis", "États-Unis", "Russie", "France", "Haïti", "Ile Maurice", "Sénégal", "Vanuatu", "Mexique", "République Populaire de Chine", "GIEC", "Green Peace", "BlackRock", "TotalEnergies", "Médias"
];

// Fonction pour assigner les catégories
function assignCategories(data) {
    const numCells = data.length;
    const categoryCounts = {};
    const assignedCategories = [""]; // La première cellule ne reçoit pas de catégorie
    const extraCategories = ["Médias", "GIEC", "Green Peace", "BlackRock", "TotalEnergies"];
    let extraIndex = 0;

    for (let i = 1; i < numCells; i++) { // Commencer à 1 pour ignorer le premier élève
        let category;
        if (i - 1 < categories.length) {
            category = categories[i - 1];
        } else {
            category = extraCategories[extraIndex % extraCategories.length];
            extraIndex++;
        }

        if (!categoryCounts[category]) {
            categoryCounts[category] = 0;
        }

        if (categoryCounts[category] >= 2) {
            categoryCounts[category] = 0;
        }

        assignedCategories.push(category);
        categoryCounts[category]++;
    }

    return assignedCategories;
}

// Gestionnaire d'événement pour le téléchargement du fichier
document.getElementById('fileInput').addEventListener('change', function (event) {
    const file = event.target.files[0];
    if (file) {
        const reader = new FileReader();
        reader.onload = function (e) {
            const data = new Uint8Array(e.target.result);
            const workbook = XLSX.read(data, { type: 'array' });
            const sheetName = workbook.SheetNames[0];
            const sheet = workbook.Sheets[sheetName];
            const jsonData = XLSX.utils.sheet_to_json(sheet, { header: 1 });

            // Récupérer les noms des élèves (première colonne)
            const eleves = jsonData.map(row => row[0]).filter(name => name);

            // Assigner les catégories
            const categoriesAssigned = assignCategories(eleves);

            // Afficher les résultats dans le tableau
            const tableBody = document.querySelector('#resultTable tbody');
            tableBody.innerHTML = ''; // Vider le tableau

            eleves.forEach((eleve, index) => {
                const row = document.createElement('tr');
                const cellEleve = document.createElement('td');
                const cellCategory = document.createElement('td');

                cellEleve.textContent = eleve;
                cellCategory.textContent = categoriesAssigned[index];

                row.appendChild(cellEleve);
                row.appendChild(cellCategory);
                tableBody.appendChild(row);
            });

            // Afficher la section des résultats
            document.getElementById('resultSection').classList.remove('hidden');
        };
        reader.readAsArrayBuffer(file);
    }
});

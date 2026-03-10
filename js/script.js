/**
 * CreatelistCOP - Logic for delegation assignment
 */

// --- Data Structures ---

const statesData = [
    { id: 'usa', name: 'États-Unis', category: 'Pays développés', icon: '🇺🇸' },
    { id: 'france', name: 'France', category: 'Pays développés', icon: '🇫🇷' },
    { id: 'uae', name: 'EAU', category: 'Pays pétroliers', icon: '🇦🇪' },
    { id: 'russia', name: 'Russie', category: 'Pays pétroliers', icon: '🇷🇺' },
    { id: 'china', name: 'Chine', category: 'BRICS', icon: '🇨🇳' },
    { id: 'india', name: 'Inde', category: 'BRICS', icon: '🇮🇳' },
    { id: 'mexico', name: 'Mexique', category: 'BRICS', icon: '🇲🇽' },
    { id: 'brazil', name: 'Brésil', category: 'BRICS', icon: '🇧🇷' },
    { id: 'chile', name: 'Chili', category: 'BRICS', icon: '🇨🇱' },
    { id: 'senegal', name: 'Sénégal', category: 'Pays en développement', icon: '🇸🇳' },
    { id: 'haiti', name: 'Haïti', category: 'Pays en développement', icon: '🇭🇹' },
    { id: 'egypt', name: 'Égypte', category: 'Pays en développement', icon: '🇪🇬' },
    { id: 'mauritius', name: 'Île Maurice', category: 'Pays en développement menacés par le changement climatique', icon: '🇲🇺' },
    { id: 'vanuatu', name: 'Vanuatu', category: 'Pays en développement menacés par le changement climatique', icon: '🇻🇺' }
];

const nonStatesData = [
    { id: 'blackrock', name: 'BlackRock', category: 'FTN', icon: '💼' },
    { id: 'total', name: 'TotalEnergies', category: 'FTN', icon: '🛢️' },
    { id: 'greenpeace', name: 'Greenpeace', category: 'ONG', icon: '🌿' },
    { id: 'giec', name: 'GIEC', category: 'ONU', icon: '📊' },
    { id: 'medias', name: 'Médias', category: 'Médias', icon: '🗞️' }
];

const categories = [
    "Pays développés",
    "Pays pétroliers",
    "BRICS",
    "Pays en développement",
    "Pays en développement menacés par le changement climatique",
    "FTN",
    "ONG",
    "ONU",
    "Médias"
];

// Global state
let delegations = [];
let currentStep = 1;

// Initialize delegations
function initDelegations() {
    delegations = [];
    statesData.forEach(s => delegations.push({ ...s, type: 'state', members: [] }));
    nonStatesData.forEach(ns => delegations.push({ ...ns, type: 'non-state', members: [] }));
}

// --- Logic functions ---

/**
 * Step 1: Assign chefs and co-leaders
 * @param {Array} students List of students { firstName, lastName, fullName }
 */
function assignStep1(students) {
    initDelegations();
    
    // Shuffle students to be fair
    const shuffled = [...students].sort(() => Math.random() - 0.5);
    
    // 1. Assign 1 Chef to each of the 19 delegations (14 states + 5 non-states)
    for (let i = 0; i < Math.min(shuffled.length, delegations.length); i++) {
        delegations[i].members.push({
            ...shuffled[i],
            role: 'Chef de délégation'
        });
    }
    
    // 2. If remaining students, assign as Co-leaders to the 14 states (round-robin)
    if (shuffled.length > delegations.length) {
        const remaining = shuffled.slice(delegations.length);
        remaining.forEach((student, index) => {
            const stateIndex = index % 14; // Priority to the 14 states
            delegations[stateIndex].members.push({
                ...student,
                role: 'Co-leader'
            });
        });
    }
}

/**
 * Step 2: Complete delegations
 * @param {Array} students List of students
 */
function assignStep2(students) {
    if (delegations.length === 0) {
        initDelegations(); // Fallback if Step 2 is called without Step 1
    }
    
    const shuffled = [...students].sort(() => Math.random() - 0.5);
    
    // Assign to existing delegations (round-robin on all 19)
    shuffled.forEach((student, index) => {
        const delIndex = index % delegations.length;
        delegations[delIndex].members.push({
            ...student,
            role: 'Membre'
        });
    });
}

// --- File Handling ---

async function handleExcelUpload(file, step) {
    return new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.onload = function(e) {
            const data = new Uint8Array(e.target.result);
            const workbook = XLSX.read(data, { type: 'array' });
            
            if (step === 1) {
                const sheet = workbook.Sheets[workbook.SheetNames[0]];
                const jsonData = XLSX.utils.sheet_to_json(sheet);
                const students = extractStudents(jsonData);
                assignStep1(students);
            } else {
                // Step 2: Read 2 sheets
                // 1. Recover Step 1 data from reference sheet if available
                const refSheet = workbook.Sheets['Chefs Étape 1'];
                if (refSheet) {
                    const step1Data = XLSX.utils.sheet_to_json(refSheet);
                    reconstructFromStep1(step1Data);
                }

                // 2. Read new members from the completion sheet
                const compSheet = workbook.Sheets['Compléter'] || workbook.Sheets[workbook.SheetNames[0]];
                const jsonData = XLSX.utils.sheet_to_json(compSheet);
                const newStudents = extractStudents(jsonData);
                assignStep2(newStudents);
            }
            
            resolve();
        };
        reader.onerror = reject;
        reader.readAsArrayBuffer(file);
    });
}

function extractStudents(jsonData) {
    return jsonData.map(row => {
        const firstName = row['Prénom'] || '';
        const lastName = row['Nom'] || '';
        const fullName = row['Nom Complet'] || `${firstName} ${lastName}`.trim();
        return {
            firstName,
            lastName,
            fullName: fullName
        };
    }).filter(s => s.fullName);
}

function reconstructFromStep1(step1Data) {
    initDelegations();
    step1Data.forEach(row => {
        const del = delegations.find(d => d.name === row['Délégation']);
        if (del) {
            del.members.push({
                fullName: row['Nom Complet'],
                role: row['Rôle']
            });
        }
    });
}

// --- Exports ---

function downloadTemplate(step) {
    const wb = XLSX.utils.book_new();
    
    if (step === 1) {
        const data = [['Prénom', 'Nom'], ['Jean', 'Dupont'], ['Marie', 'Curie']];
        const ws = XLSX.utils.aoa_to_sheet(data);
        XLSX.utils.book_append_sheet(wb, ws, "Élèves");
        XLSX.writeFile(wb, `template-etape1.xlsx`);
    } else {
        // Step 2 Template: 2 Sheets
        // Sheet 1: Blank for entry
        const header = [['Prénom', 'Nom']];
        const emptyRows = Array(25).fill(['', '']);
        const ws1 = XLSX.utils.aoa_to_sheet(header.concat(emptyRows));
        XLSX.utils.book_append_sheet(wb, ws1, "Compléter");

        // Sheet 2: Reference from Step 1
        const refData = [['Nom Complet', 'Délégation', 'Catégorie', 'Rôle']];
        delegations.forEach(del => {
            del.members.forEach(m => {
                refData.push([m.fullName, del.name, del.category, m.role]);
            });
        });
        const ws2 = XLSX.utils.aoa_to_sheet(refData);
        
        // Note: Basic SheetJS (CE) doesn't support cell styles/colors easily without additional plugins
        // but we provide the data structure as requested.
        XLSX.utils.book_append_sheet(wb, ws2, "Chefs Étape 1");

        XLSX.writeFile(wb, `template-etape2-complet.xlsx`);
    }
}

// --- UI Helpers ---

function renderResults() {
    const container = document.getElementById('resultSection');
    container.classList.remove('hidden');
    
    const flatTableBody = document.querySelector('#resultTable tbody');
    flatTableBody.innerHTML = '';
    
    // Grouped View Container
    const groupedContainer = document.getElementById('groupedView');
    groupedContainer.innerHTML = '';
    
    // Render Flat View (Grouped by Category like PDF)
    categories.forEach(cat => {
        const catDelegations = delegations.filter(d => d.category === cat);
        const catMembersCount = catDelegations.reduce((acc, del) => acc + del.members.length, 0);
        
        if (catMembersCount > 0) {
            // Category Header Row
            const headerRow = document.createElement('tr');
            headerRow.className = 'table-category-header';
            headerRow.innerHTML = `
                <td colspan="3">
                    <div class="table-cat-flex">
                        <span>${cat}</span>
                        <span class="badge-count">${catMembersCount} membres</span>
                    </div>
                </td>
            `;
            flatTableBody.appendChild(headerRow);
            
            catDelegations.forEach(del => {
                del.members.sort((a, b) => {
                    const roles = {'Chef de délégation': 1, 'Co-leader': 2, 'Membre': 3};
                    return roles[a.role] - roles[b.role];
                }).forEach(member => {
                    const row = document.createElement('tr');
                    const roleClass = member.role === 'Chef de délégation' ? 'role-chef' : 
                                    member.role === 'Co-leader' ? 'role-coleader' : 'role-membre';
                    row.innerHTML = `
                        <td><strong>${member.fullName}</strong></td>
                        <td><span class="del-pill">${del.icon} ${del.name}</span></td>
                        <td><span class="role-badge ${roleClass}">${member.role}</span></td>
                    `;
                    flatTableBody.appendChild(row);
                });
            });
        }
    });
    
    // Render Grouped View (by Categories)
    categories.forEach(cat => {
        const catDelegations = delegations.filter(d => d.category === cat);
        if (catDelegations.length === 0) return;
        
        const catSection = document.createElement('div');
        catSection.className = 'category-section';
        catSection.innerHTML = `<h3>${cat}</h3>`;
        
        const grid = document.createElement('div');
        grid.className = 'delegation-grid';
        
        catDelegations.forEach(del => {
            const card = document.createElement('div');
            card.className = 'delegation-card';
            
            let membersHtml = del.members.map(m => `
                <div class="member-item ${m.role === 'Chef de délégation' ? 'role-chef' : m.role === 'Co-leader' ? 'role-coleader' : ''}">
                    <span class="role-icon">${m.role === 'Chef de délégation' ? '⭐' : m.role === 'Co-leader' ? '🎖️' : '👤'}</span>
                    ${m.fullName}
                </div>
            `).join('');
            
            card.innerHTML = `
                <div class="card-header">
                    <span class="del-icon">${del.icon}</span>
                    <span class="del-name">${del.name}</span>
                </div>
                <div class="card-body">
                    ${membersHtml}
                </div>
            `;
            grid.appendChild(card);
        });
        
        catSection.appendChild(grid);
        groupedContainer.appendChild(catSection);
    });
    
    // Update Hierarchy View (if displayHierarchy exists)
    if (typeof displayHierarchy === 'function') {
        // We need to update the card bodies in the hierarchy view
        // Instead of re-rendering everything, we can just update the list and counts
        delegations.forEach(del => {
            // This is a bit complex as hierarchy view is group-based
            // For now, let's just re-call displayHierarchy if it's smart enough
            // or we'll need to adapt display-groups.js to handle data updates
        });
        // Actually, let's just call it if available, but display-groups.js needs to know about 'members'
        // For the sake of this mission, displayHierarchy is static. 
        // We'll update display-groups.js later if needed.
    }
}

// --- Event Listeners ---

document.addEventListener('DOMContentLoaded', () => {
    const fileInput1 = document.getElementById('fileInput1');
    const fileInput2 = document.getElementById('fileInput2');
    
    if (fileInput1) {
        fileInput1.onchange = async (e) => {
            if (e.target.files.length > 0) {
                await handleExcelUpload(e.target.files[0], 1);
                renderResults();
                document.getElementById('status1').classList.remove('hidden');
                if (typeof switchView === 'function') switchView('grouped');
            }
        };
    }
    
    if (fileInput2) {
        fileInput2.onchange = async (e) => {
            if (e.target.files.length > 0) {
                await handleExcelUpload(e.target.files[0], 2);
                renderResults();
                document.getElementById('status2').classList.remove('hidden');
                if (typeof switchView === 'function') switchView('grouped');
            }
        };
    }
});

function exportExcel() {
    const exportData = [];
    delegations.forEach(del => {
        del.members.forEach(m => {
            exportData.push({
                'Nom Complet': m.fullName,
                'Délégation': del.name,
                'Catégorie': del.category,
                'Rôle': m.role
            });
        });
    });
    const ws = XLSX.utils.json_to_sheet(exportData);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, "Attribution complète");
    XLSX.writeFile(wb, "CreatelistCOP_Final_Export.xlsx");
}

function exportPDF() {
    const { jsPDF } = window.jspdf;
    const doc = new jsPDF();
    
    doc.setFontSize(20);
    doc.text("CreatelistCOP - Attribution des Délégations", 14, 22);
    doc.setFontSize(12);
    doc.setTextColor(100);
    doc.text(`Généré le : ${new Date().toLocaleString()}`, 14, 30);
    
    let yPos = 40;
    
    categories.forEach((cat, index) => {
        const catDelegations = delegations.filter(d => d.category === cat);
        if (catDelegations.length === 0) return;
        
        if (yPos > 250) {
            doc.addPage();
            yPos = 20;
        }
        
        doc.setFontSize(16);
        doc.setTextColor(0);
        doc.text(cat, 14, yPos);
        yPos += 10;
        
        const tableData = [];
        catDelegations.forEach(del => {
            del.members.forEach(m => {
                tableData.push([
                    m.fullName,
                    del.name,
                    m.role
                ]);
            });
        });
        
        doc.autoTable({
            startY: yPos,
            head: [['Élève', 'Délégation', 'Rôle']],
            body: tableData,
            theme: 'grid',
            headStyles: { fillColor: [59, 130, 246] },
            margin: { left: 14 }
        });
        
        yPos = doc.lastAutoTable.finalY + 15;
    });
    
    doc.save("CreatelistCOP_Export.pdf");
}

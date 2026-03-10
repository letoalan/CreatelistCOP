/**
 * CreatelistCOP - Data Structure for Delegations (Corrected)
 * 19 entities grouped by category (States vs Non-States)
 */

const delegationsData = {
    etats: {
        paysDeveloppes: [
            { name: 'États-Unis', icon: '🇺🇸' },
            { name: 'France', icon: '🇫🇷' }
        ],
        paysPetroliers: [
            { name: 'EAU', icon: '🇦🇪' },
            { name: 'Russie', icon: '🇷🇺' }
        ],
        brics: [
            { name: 'Chine', icon: '🇨🇳' },
            { name: 'Inde', icon: '🇮🇳' },
            { name: 'Mexique', icon: '🇲🇽' },
            { name: 'Brésil', icon: '🇧🇷' },
            { name: 'Chili', icon: '🇨🇱' }
        ],
        paysDeveloppement: [
            { name: 'Sénégal', icon: '🇸🇳' },
            { name: 'Haïti', icon: '🇭🇹' },
            { name: 'Égypte', icon: '🇪🇬' }
        ],
        paysDeveloppementMenacesClimat: [
            { name: 'Île Maurice', icon: '🇲🇺' },
            { name: 'Vanuatu', icon: '🇻🇺' }
        ]
    },
    nonEtats: {
        ftn: [
            { name: 'BlackRock', icon: '💼' },
            { name: 'TotalEnergies', icon: '🛢️' }
        ],
        ong: [
            { name: 'Greenpeace', icon: '🌿' }
        ],
        onu: [
            { name: 'GIEC', icon: '📊' }
        ],
        medias: [
            { name: 'Médias', icon: '🗞️' }
        ]
    }
};

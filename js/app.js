/**
 * ============================================
 * APPLICATION PRINCIPALE
 * ============================================
 */

document.addEventListener('DOMContentLoaded', () => {
    initNavigation();
    initSidebar();
    renderAllSections();
    initCharts();
    updateLastDate();
});

// ============================================
// UTILITIES
// ============================================

function fmt(n) {
    return new Intl.NumberFormat('fr-FR', { style: 'currency', currency: 'EUR', minimumFractionDigits: 0, maximumFractionDigits: 0 }).format(n);
}

function fmtPct(n) {
    return n.toFixed(1).replace('.', ',') + ' %';
}

function updateLastDate() {
    const d = new Date();
    document.getElementById('lastUpdate').textContent = d.toLocaleDateString('fr-FR', { day: 'numeric', month: 'long', year: 'numeric' });
}

function getProgressColor(pct) {
    if (pct >= 100) return 'green';
    if (pct >= 50) return 'blue';
    if (pct >= 25) return 'orange';
    return 'red';
}

function getStatusBadge(statut) {
    const map = {
        'recu': '<span class="badge badge-success"><i class="fas fa-check"></i> Reçu</span>',
        'en_attente': '<span class="badge badge-warning"><i class="fas fa-hourglass-half"></i> En attente</span>',
        'demande': '<span class="badge badge-info"><i class="fas fa-paper-plane"></i> Demandé</span>',
        'refuse': '<span class="badge badge-danger"><i class="fas fa-times"></i> Refusé</span>',
        'livre': '<span class="badge badge-success"><i class="fas fa-check"></i> Livré</span>',
        'commande': '<span class="badge badge-info"><i class="fas fa-truck"></i> Commandé</span>',
        'stock': '<span class="badge badge-neutral"><i class="fas fa-warehouse"></i> En stock</span>',
        'devis': '<span class="badge badge-warning"><i class="fas fa-file-alt"></i> Devis</span>',
    };
    return map[statut] || `<span class="badge badge-neutral">${statut}</span>`;
}

// ============================================
// NAVIGATION
// ============================================

function initNavigation() {
    const navItems = document.querySelectorAll('.nav-item');
    navItems.forEach(item => {
        item.addEventListener('click', () => {
            const section = item.dataset.section;
            navItems.forEach(n => n.classList.remove('active'));
            item.classList.add('active');

            document.querySelectorAll('.content-section').forEach(s => s.classList.remove('active'));
            const target = document.getElementById(`section-${section}`);
            if (target) target.classList.add('active');

            const titles = {
                dashboard: 'Tableau de bord',
                presentation: 'Présentation du projet',
                achat: 'Achat immobilier',
                financement: 'Financement & Crédits',
                aides: 'Aides & Subventions',
                travaux: 'Travaux & Rénovation',
                materiaux: 'Matériaux & Équipements',
                budget: 'Suivi budgétaire',
                energie: 'Performance énergétique',
                journal: 'Journal de chantier',
                historique: 'Historique des modifications',
            };
            document.getElementById('pageTitle').textContent = titles[section] || section;

            // Close sidebar on mobile
            document.getElementById('sidebar').classList.remove('open');
            document.querySelector('.sidebar-overlay')?.classList.remove('active');
        });
    });
}

function initSidebar() {
    const sidebar = document.getElementById('sidebar');
    const openBtn = document.getElementById('sidebarOpen');
    const closeBtn = document.getElementById('sidebarClose');

    // Create overlay
    const overlay = document.createElement('div');
    overlay.className = 'sidebar-overlay';
    document.body.appendChild(overlay);

    openBtn.addEventListener('click', () => {
        sidebar.classList.add('open');
        overlay.classList.add('active');
    });

    closeBtn.addEventListener('click', () => {
        sidebar.classList.remove('open');
        overlay.classList.remove('active');
    });

    overlay.addEventListener('click', () => {
        sidebar.classList.remove('open');
        overlay.classList.remove('active');
    });
}

// ============================================
// RENDER ALL SECTIONS
// ============================================

function renderAllSections() {
    renderDashboard();
    renderPresentation();
    renderAchat();
    renderFinancement();
    renderAides();
    renderTravaux();
    renderMateriaux();
    renderBudget();
    renderEnergie();
    renderJournal();
    renderHistorique();
}

// ============================================
// DASHBOARD
// ============================================

function renderDashboard() {
    const D = PROJECT_DATA;
    const totalBudget = D.travaux.reduce((s, t) => s + t.budget, 0);
    const totalDepense = D.travaux.reduce((s, t) => s + t.depense, 0);
    const reste = totalBudget - totalDepense;
    const coutM2 = totalDepense / D.general.surfaceHabitable;

    document.getElementById('kpiBudgetTotal').textContent = fmt(totalBudget);
    document.getElementById('kpiDepense').textContent = fmt(totalDepense);
    document.getElementById('kpiReste').textContent = fmt(reste);
    document.getElementById('kpiCoutM2').textContent = fmt(coutM2) + '/m²';

    // Progress
    const avgProgress = D.travaux.reduce((s, t) => s + t.avancement, 0) / D.travaux.length;
    document.getElementById('globalProgress').textContent = Math.round(avgProgress) + '%';
    document.getElementById('globalProgressBar').style.width = avgProgress + '%';

    // Dashboard progress list
    let progressHtml = '';
    D.travaux.forEach(t => {
        const color = getProgressColor(t.avancement);
        progressHtml += `
            <div style="margin-bottom: 14px;">
                <div style="display: flex; justify-content: space-between; margin-bottom: 4px;">
                    <span style="font-size: 13px; font-weight: 500;">${t.nom}</span>
                    <span style="font-size: 12px; color: var(--text-muted);">${t.avancement}%</span>
                </div>
                <div class="progress-bar-inline">
                    <div class="fill ${color}" style="width: ${t.avancement}%"></div>
                </div>
            </div>
        `;
    });
    document.getElementById('dashboardProgress').innerHTML = progressHtml;

    // Dashboard journal (last 3)
    let journalHtml = '';
    D.journal.slice(0, 3).forEach(j => {
        const d = new Date(j.date);
        const dateStr = d.toLocaleDateString('fr-FR', { day: 'numeric', month: 'long', year: 'numeric' });
        journalHtml += `
            <div style="display: flex; gap: 16px; padding: 14px 0; border-bottom: 1px solid var(--border);">
                <div style="min-width: 90px; font-size: 12px; color: var(--text-muted); font-weight: 500;">${dateStr}</div>
                <div>
                    <div style="font-weight: 600; font-size: 14px;">${j.titre}</div>
                    <div style="font-size: 13px; color: var(--text-light); margin-top: 2px;">${j.contenu.substring(0, 120)}...</div>
                </div>
            </div>
        `;
    });
    document.getElementById('dashboardJournal').innerHTML = journalHtml;
}

// ============================================
// PRESENTATION
// ============================================

function renderPresentation() {
    const D = PROJECT_DATA;
    document.getElementById('presType').textContent = D.general.type;
    document.getElementById('presAnnee').textContent = D.general.anneeConstruction;
    document.getElementById('presSurface').textContent = D.general.surfaceHabitable + ' m²';
    document.getElementById('presTerrain').textContent = D.general.surfaceTerrain + ' m²';
    document.getElementById('presPieces').textContent = D.general.nombrePieces;
    document.getElementById('presLocalisation').textContent = D.general.localisation;

    document.getElementById('dpeAvant').textContent = D.dpe.avant.classe;
    document.getElementById('dpeApres').textContent = D.dpe.apres.classe;

    // Objectifs
    let objHtml = '';
    D.objectifs.forEach(o => {
        objHtml += `
            <div class="objective-item">
                <i class="${o.icon}"></i>
                <div>
                    <div class="obj-title">${o.titre}</div>
                    <div class="obj-desc">${o.description}</div>
                </div>
            </div>
        `;
    });
    document.getElementById('presObjectifs').innerHTML = objHtml;

    // Timeline
    let tlHtml = '';
    D.timeline.forEach(t => {
        tlHtml += `
            <div class="timeline-item">
                <div class="timeline-dot ${t.status}"></div>
                <div class="timeline-date">${t.date}</div>
                <div class="timeline-title">${t.titre}</div>
                <div class="timeline-desc">${t.desc}</div>
            </div>
        `;
    });
    document.getElementById('presTimeline').innerHTML = tlHtml;
}

// ============================================
// ACHAT
// ============================================

function renderAchat() {
    const D = PROJECT_DATA.achat;
    const total = D.details.reduce((s, d) => s + d.montant, 0);

    document.getElementById('achatPrix').textContent = fmt(D.prixAchat);
    document.getElementById('achatNotaire').textContent = fmt(D.fraisNotaire);
    document.getElementById('achatAgence').textContent = fmt(D.fraisAgence);
    document.getElementById('achatTotal').textContent = fmt(total);

    let html = '';
    D.details.forEach(d => {
        html += `
            <tr>
                <td>${d.poste}</td>
                <td class="amount">${fmt(d.montant)}</td>
                <td style="color: var(--text-muted); font-size: 12.5px;">${d.notes}</td>
            </tr>
        `;
    });
    document.getElementById('achatTableBody').innerHTML = html;
    document.getElementById('achatTableFoot').innerHTML = `
        <tr>
            <td><strong>TOTAL PROJET</strong></td>
            <td class="amount">${fmt(total)}</td>
            <td></td>
        </tr>
    `;
}

// ============================================
// FINANCEMENT
// ============================================

function renderFinancement() {
    const D = PROJECT_DATA.financement;
    const totalEmprunte = D.credits.reduce((s, c) => s + c.montant, 0);
    const totalMensualite = D.credits.reduce((s, c) => s + c.mensualite, 0);
    const tauxEndettement = ((totalMensualite / D.revenusMensuels) * 100);

    document.getElementById('finApport').textContent = fmt(D.apportPersonnel);
    document.getElementById('finEmprunte').textContent = fmt(totalEmprunte);
    document.getElementById('finMensualite').textContent = fmt(totalMensualite) + '/mois';
    document.getElementById('finEndettement').textContent = fmtPct(tauxEndettement);

    // Credit detail cards
    const creditIds = ['creditPrincipalInfo', 'ptzInfo', 'ecoPtzInfo', 'pretsCompInfo'];
    D.credits.forEach((c, i) => {
        if (i < creditIds.length) {
            let html = '';
            Object.entries(c.details).forEach(([k, v]) => {
                html += `
                    <div class="info-item">
                        <span class="info-label">${k}</span>
                        <span class="info-value">${v}</span>
                    </div>
                `;
            });
            document.getElementById(creditIds[i]).innerHTML = html;
        }
    });

    // Recap table
    let recapHtml = '';
    D.credits.forEach(c => {
        recapHtml += `
            <tr>
                <td>${c.type}</td>
                <td class="amount">${fmt(c.montant)}</td>
                <td>${c.taux}%</td>
                <td>${c.duree}</td>
                <td class="amount">${fmt(c.mensualite)}/mois</td>
            </tr>
        `;
    });
    recapHtml += `
        <tr>
            <td>Apport personnel</td>
            <td class="amount">${fmt(D.apportPersonnel)}</td>
            <td>-</td>
            <td>-</td>
            <td>-</td>
        </tr>
    `;
    document.getElementById('finRecapBody').innerHTML = recapHtml;
    document.getElementById('finRecapFoot').innerHTML = `
        <tr>
            <td><strong>TOTAL</strong></td>
            <td class="amount">${fmt(totalEmprunte + D.apportPersonnel)}</td>
            <td></td>
            <td></td>
            <td class="amount">${fmt(totalMensualite)}/mois</td>
        </tr>
    `;
}

// ============================================
// AIDES
// ============================================

function renderAides() {
    const D = PROJECT_DATA.aides;
    const totalDemande = D.reduce((s, a) => s + a.montantDemande, 0);
    const totalRecu = D.reduce((s, a) => s + a.montantRecu, 0);
    const totalAttente = totalDemande - totalRecu;

    document.getElementById('aidesTotalDemande').textContent = fmt(totalDemande);
    document.getElementById('aidesTotalRecu').textContent = fmt(totalRecu);
    document.getElementById('aidesTotalAttente').textContent = fmt(totalAttente);

    let html = '';
    D.forEach((a, idx) => {
        html += `
            <tr>
                <td><strong>${a.nom}</strong></td>
                <td>${a.organisme}</td>
                <td class="amount">${fmt(a.montantDemande)}</td>
                <td class="amount">${a.montantRecu > 0 ? fmt(a.montantRecu) : '-'}</td>
                <td>${getStatusBadge(a.statut)}</td>
                <td style="font-size: 12px; color: var(--text-muted);">${a.conditions}</td>
                <td>
                    <div class="admin-actions" style="display:flex;gap:4px;">
                        <button class="admin-btn admin-btn-edit" onclick="Admin.editAide(${idx})" title="Modifier"><i class="fas fa-pen"></i></button>
                        <button class="admin-btn admin-btn-delete" onclick="Admin.deleteAide(${idx})" title="Supprimer"><i class="fas fa-trash"></i></button>
                    </div>
                </td>
            </tr>
        `;
    });
    document.getElementById('aidesTableBody').innerHTML = html;
}

// ============================================
// TRAVAUX
// ============================================

function renderTravaux() {
    const D = PROJECT_DATA.travaux;
    const container = document.getElementById('travauxList');

    function renderCards(filter) {
        const filtered = filter === 'all' ? D : D.filter(t => t.categorie === filter);
        let html = '';
        filtered.forEach((t) => {
            const idx = D.indexOf(t);
            const color = getProgressColor(t.avancement);
            const subtasksHtml = t.soustaches.map(s => {
                const iconClass = s.statut === 'done' ? 'fas fa-check-circle done' :
                    s.statut === 'progress' ? 'fas fa-spinner progress' : 'far fa-circle pending';
                return `<div class="travaux-subtask"><i class="${iconClass}"></i> ${s.nom}</div>`;
            }).join('');

            html += `
                <div class="travaux-card" data-categorie="${t.categorie}">
                    <div class="travaux-card-header" onclick="this.nextElementSibling.classList.toggle('open')">
                        <div class="travaux-card-left">
                            <div class="travaux-icon" style="background: ${t.couleur}15; color: ${t.couleur};">
                                <i class="${t.icon}"></i>
                            </div>
                            <div class="travaux-card-title">
                                <h4>${t.nom}</h4>
                                <span>${t.executant}</span>
                            </div>
                        </div>
                        <div class="travaux-card-right">
                            <div>
                                <span class="amount" style="font-size: 15px;">${fmt(t.depense)}</span>
                                <span style="color: var(--text-muted); font-size: 12px;"> / ${fmt(t.budget)}</span>
                            </div>
                            <div class="travaux-progress">
                                <div class="travaux-progress-label">${t.avancement}%</div>
                                <div class="progress-bar-inline">
                                    <div class="fill ${color}" style="width: ${t.avancement}%"></div>
                                </div>
                            </div>
                            <i class="fas fa-chevron-down" style="color: var(--text-muted);"></i>
                        </div>
                    </div>
                    <div class="travaux-card-body">
                        <div class="travaux-detail-grid">
                            <div class="info-item">
                                <span class="info-label">Budget</span>
                                <span class="info-value">${fmt(t.budget)}</span>
                            </div>
                            <div class="info-item">
                                <span class="info-label">Dépensé</span>
                                <span class="info-value">${fmt(t.depense)}</span>
                            </div>
                            <div class="info-item">
                                <span class="info-label">Écart</span>
                                <span class="info-value ${t.depense - t.budget > 0 ? 'negative' : 'positive'}">${fmt(t.depense - t.budget)}</span>
                            </div>
                        </div>
                        <h5 style="font-size: 13px; color: var(--text-muted); text-transform: uppercase; margin-bottom: 8px;">Sous-tâches</h5>
                        ${subtasksHtml}
                        <div class="travaux-meta">
                            <span><i class="fas fa-calendar"></i> Début : ${new Date(t.dateDebut).toLocaleDateString('fr-FR')}</span>
                            <span><i class="fas fa-calendar-check"></i> Fin prévue : ${new Date(t.dateFin).toLocaleDateString('fr-FR')}</span>
                            <span><i class="fas fa-user-hard-hat"></i> ${t.executant}</span>
                        </div>
                        <div class="photo-grid">
                            <div class="photo-placeholder"><i class="fas fa-camera"></i>Photo avant</div>
                            <div class="photo-placeholder"><i class="fas fa-camera"></i>Photo pendant</div>
                            <div class="photo-placeholder"><i class="fas fa-camera"></i>Photo après</div>
                        </div>
                        <div style="margin-top:16px; display:flex; gap:8px; justify-content:flex-end;">
                            <button class="admin-btn admin-btn-edit" onclick="Admin.editTravail(${idx})" title="Modifier" style="width:auto;padding:6px 14px;font-size:12px;"><i class="fas fa-pen"></i> Modifier</button>
                            <button class="admin-btn admin-btn-delete" onclick="Admin.deleteTravail(${idx})" title="Supprimer" style="width:auto;padding:6px 14px;font-size:12px;"><i class="fas fa-trash"></i> Supprimer</button>
                        </div>
                    </div>
                </div>
            `;
        });
        container.innerHTML = html;
    }

    renderCards('all');

    // Filters
    document.querySelectorAll('#travauxFilters .filter-tab').forEach(tab => {
        tab.addEventListener('click', () => {
            document.querySelectorAll('#travauxFilters .filter-tab').forEach(t => t.classList.remove('active'));
            tab.classList.add('active');
            renderCards(tab.dataset.filter);
        });
    });
}

// ============================================
// MATERIAUX
// ============================================

function renderMateriaux() {
    const D = PROJECT_DATA.materiaux;
    const container = document.getElementById('materiauxTableBody');
    const footer = document.getElementById('materiauxTableFoot');

    function renderTable(filter) {
        const filtered = filter === 'all' ? D : D.filter(m => m.categorie === filter);
        let total = 0;
        let html = '';
        filtered.forEach(m => {
            const idx = D.indexOf(m);
            total += m.prixTotal;
            html += `
                <tr>
                    <td><strong>${m.nom}</strong></td>
                    <td><span class="badge badge-neutral">${m.categorie}</span></td>
                    <td>${m.fournisseur}</td>
                    <td>${m.quantite}</td>
                    <td class="amount">${fmt(m.prixUnitaire)}</td>
                    <td class="amount">${fmt(m.prixTotal)}</td>
                    <td>${getStatusBadge(m.statut)}</td>
                    <td>
                        <div class="admin-actions" style="display:flex;gap:4px;">
                            <button class="admin-btn admin-btn-edit" onclick="Admin.editMateriau(${idx})" title="Modifier"><i class="fas fa-pen"></i></button>
                            <button class="admin-btn admin-btn-delete" onclick="Admin.deleteMateriau(${idx})" title="Supprimer"><i class="fas fa-trash"></i></button>
                        </div>
                    </td>
                </tr>
            `;
        });
        container.innerHTML = html;
        footer.innerHTML = `
            <tr>
                <td colspan="5"><strong>TOTAL</strong></td>
                <td class="amount"><strong>${fmt(total)}</strong></td>
                <td></td>
            </tr>
        `;
    }

    renderTable('all');

    document.getElementById('materiauxFilter').addEventListener('change', (e) => {
        renderTable(e.target.value);
    });

    // Comparatifs
    let compHtml = '';
    PROJECT_DATA.comparatifs.forEach(c => {
        const renderOption = (opt) => {
            const lis = opt.points.map(p => `<li><i class="${p.icon}" style="color: ${p.icon.includes('check') ? 'var(--success)' : p.icon.includes('times') ? 'var(--danger)' : 'var(--text-muted)'}"></i> ${p.text}</li>`).join('');
            return `
                <div class="comparatif-option ${opt.selected ? 'selected' : ''}">
                    <h5>${opt.nom}</h5>
                    <ul>${lis}</ul>
                </div>
            `;
        };

        compHtml += `
            <div class="comparatif-card">
                <h4><i class="fas fa-balance-scale" style="color: var(--primary);"></i> ${c.titre}</h4>
                <div class="comparatif-grid">
                    ${renderOption(c.optionA)}
                    <div class="comparatif-vs">VS</div>
                    ${renderOption(c.optionB)}
                </div>
            </div>
        `;
    });
    document.getElementById('comparatifs').innerHTML = compHtml;
}

// ============================================
// BUDGET
// ============================================

function renderBudget() {
    const D = PROJECT_DATA.travaux;
    const surface = PROJECT_DATA.general.surfaceHabitable;
    let totalPrev = 0, totalReel = 0;

    let html = '';
    D.forEach(t => {
        const ecart = t.depense - t.budget;
        const pctUtilise = t.budget > 0 ? (t.depense / t.budget) * 100 : 0;
        const color = getProgressColor(Math.min(pctUtilise, 100));
        totalPrev += t.budget;
        totalReel += t.depense;

        html += `
            <tr>
                <td><strong>${t.nom}</strong></td>
                <td class="amount">${fmt(t.budget)}</td>
                <td class="amount">${fmt(t.depense)}</td>
                <td class="amount ${ecart > 0 ? 'negative' : ecart < 0 ? 'positive' : ''}">${ecart > 0 ? '+' : ''}${fmt(ecart)}</td>
                <td>${fmtPct(pctUtilise)}</td>
                <td class="budget-progress-cell">
                    <div class="progress-inline">
                        <div class="progress-bar-inline">
                            <div class="fill ${color}" style="width: ${Math.min(pctUtilise, 100)}%"></div>
                        </div>
                    </div>
                </td>
            </tr>
        `;
    });

    document.getElementById('budgetTableBody').innerHTML = html;

    const ecartTotal = totalReel - totalPrev;
    document.getElementById('budgetTableFoot').innerHTML = `
        <tr>
            <td><strong>TOTAL</strong></td>
            <td class="amount">${fmt(totalPrev)}</td>
            <td class="amount">${fmt(totalReel)}</td>
            <td class="amount ${ecartTotal > 0 ? 'negative' : 'positive'}">${ecartTotal > 0 ? '+' : ''}${fmt(ecartTotal)}</td>
            <td>${fmtPct(totalPrev > 0 ? (totalReel / totalPrev) * 100 : 0)}</td>
            <td></td>
        </tr>
    `;

    document.getElementById('budgetPrev').textContent = fmt(totalPrev);
    document.getElementById('budgetReel').textContent = fmt(totalReel);
    document.getElementById('budgetEcart').textContent = (ecartTotal > 0 ? '+' : '') + fmt(ecartTotal);
    document.getElementById('budgetM2').textContent = fmt(totalReel / surface) + '/m²';
}

// ============================================
// ENERGIE
// ============================================

function renderEnergie() {
    const D = PROJECT_DATA;

    // DPE Scale
    const classes = [
        { letter: 'A', range: '≤ 70' },
        { letter: 'B', range: '71-110' },
        { letter: 'C', range: '111-180' },
        { letter: 'D', range: '181-250' },
        { letter: 'E', range: '251-330' },
        { letter: 'F', range: '331-420' },
        { letter: 'G', range: '> 420' },
    ];
    const widths = [35, 42, 50, 58, 66, 74, 82];

    function renderScale(containerId, activeClass) {
        let html = '';
        classes.forEach((c, i) => {
            const isActive = c.letter === activeClass;
            html += `
                <div class="dpe-scale-item dpe-${c.letter.toLowerCase()} ${isActive ? 'active' : ''}">
                    <div class="dpe-scale-label">${c.letter}</div>
                    <div class="dpe-scale-bar" style="width: ${widths[i]}%;">${c.range} kWh/m²/an</div>
                </div>
            `;
        });
        document.getElementById(containerId).innerHTML = html;
    }

    renderScale('dpeScaleAvant', D.dpe.avant.classe);
    renderScale('dpeScaleApres', D.dpe.apres.classe);

    // Economies
    let ecoHtml = '';
    Object.entries(D.energie.economies).forEach(([k, v]) => {
        ecoHtml += `
            <div class="info-item">
                <span class="info-label">${k}</span>
                <span class="info-value">${v}</span>
            </div>
        `;
    });
    document.getElementById('energieEconomies').innerHTML = ecoHtml;

    // Valeur
    let valHtml = '';
    Object.entries(D.energie.valeur).forEach(([k, v]) => {
        valHtml += `
            <div class="info-item">
                <span class="info-label">${k}</span>
                <span class="info-value">${v}</span>
            </div>
        `;
    });
    document.getElementById('energieValeur').innerHTML = valHtml;
}

// ============================================
// JOURNAL
// ============================================

function renderJournal() {
    const D = PROJECT_DATA.journal;
    const container = document.getElementById('journalTimeline');
    let html = '';

    D.forEach((j, idx) => {
        const d = new Date(j.date);
        const day = d.getDate();
        const month = d.toLocaleDateString('fr-FR', { month: 'short' }).toUpperCase();

        const tagsHtml = j.tags.map(t => `<span class="journal-tag">${t}</span>`).join('');

        let sectionsHtml = '';
        if (j.problemes.length > 0) {
            sectionsHtml += `
                <div class="journal-section problems">
                    <h5><i class="fas fa-exclamation-triangle"></i> Problèmes rencontrés</h5>
                    <ul>${j.problemes.map(p => `<li>${p}</li>`).join('')}</ul>
                </div>
            `;
        }
        if (j.solutions.length > 0) {
            sectionsHtml += `
                <div class="journal-section solutions">
                    <h5><i class="fas fa-lightbulb"></i> Solutions apportées</h5>
                    <ul>${j.solutions.map(s => `<li>${s}</li>`).join('')}</ul>
                </div>
            `;
        }
        if (j.lecons.length > 0) {
            sectionsHtml += `
                <div class="journal-section lessons">
                    <h5><i class="fas fa-graduation-cap"></i> Leçons apprises</h5>
                    <ul>${j.lecons.map(l => `<li>${l}</li>`).join('')}</ul>
                </div>
            `;
        }

        html += `
            <div class="journal-entry">
                <div class="journal-entry-header">
                    <div class="journal-date">
                        <div class="day">${day}</div>
                        <div class="month">${month}</div>
                    </div>
                    <div class="journal-title-block">
                        <h4>${j.titre}</h4>
                        <div class="journal-tags">${tagsHtml}</div>
                    </div>
                </div>
                <div class="journal-entry-body">
                    <p>${j.contenu}</p>
                    ${sectionsHtml}
                    <div style="margin-top:16px; display:flex; gap:8px; justify-content:flex-end;">
                        <button class="admin-btn admin-btn-edit" onclick="Admin.editJournal(${idx})" title="Modifier" style="width:auto;padding:6px 14px;font-size:12px;"><i class="fas fa-pen"></i> Modifier</button>
                        <button class="admin-btn admin-btn-delete" onclick="Admin.deleteJournal(${idx})" title="Supprimer" style="width:auto;padding:6px 14px;font-size:12px;"><i class="fas fa-trash"></i> Supprimer</button>
                    </div>
                </div>
            </div>
        `;
    });

    container.innerHTML = html;
}

// ============================================
// CHARTS
// ============================================

function initCharts() {
    // Common config
    Chart.defaults.font.family = "'Inter', sans-serif";
    Chart.defaults.font.size = 12;
    Chart.defaults.color = '#64748b';

    const colors = ['#3b82f6', '#10b981', '#f59e0b', '#ef4444', '#8b5cf6', '#06b6d4', '#ec4899', '#f97316', '#14b8a6', '#6366f1'];

    const D = PROJECT_DATA;
    const travaux = D.travaux;

    // ---- Budget Repartition (Doughnut) ----
    new Chart(document.getElementById('chartBudgetRepartition'), {
        type: 'doughnut',
        data: {
            labels: travaux.map(t => t.nom),
            datasets: [{
                data: travaux.map(t => t.budget),
                backgroundColor: colors.slice(0, travaux.length),
                borderWidth: 2,
                borderColor: '#fff',
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
                legend: { position: 'right', labels: { boxWidth: 12, padding: 12, font: { size: 11 } } },
                tooltip: {
                    callbacks: { label: ctx => `${ctx.label}: ${fmt(ctx.raw)}` }
                }
            },
            cutout: '55%',
        }
    });

    // ---- Prev vs Reel (Bar) ----
    new Chart(document.getElementById('chartPrevVsReel'), {
        type: 'bar',
        data: {
            labels: travaux.map(t => t.nom.length > 18 ? t.nom.substring(0, 18) + '...' : t.nom),
            datasets: [
                {
                    label: 'Prévu',
                    data: travaux.map(t => t.budget),
                    backgroundColor: '#3b82f620',
                    borderColor: '#3b82f6',
                    borderWidth: 2,
                    borderRadius: 4,
                },
                {
                    label: 'Réel',
                    data: travaux.map(t => t.depense),
                    backgroundColor: '#10b98140',
                    borderColor: '#10b981',
                    borderWidth: 2,
                    borderRadius: 4,
                }
            ]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
                legend: { position: 'top', labels: { boxWidth: 12, padding: 16 } },
                tooltip: {
                    callbacks: { label: ctx => `${ctx.dataset.label}: ${fmt(ctx.raw)}` }
                }
            },
            scales: {
                y: {
                    beginAtZero: true,
                    ticks: { callback: v => fmt(v) },
                    grid: { color: '#f1f5f9' }
                },
                x: {
                    ticks: { font: { size: 10 }, maxRotation: 45 },
                    grid: { display: false }
                }
            }
        }
    });

    // ---- Depenses Evolution (Line) ----
    const depMens = D.depensesMensuelles;
    new Chart(document.getElementById('chartDepensesEvolution'), {
        type: 'line',
        data: {
            labels: depMens.map(d => d.mois),
            datasets: [
                {
                    label: 'Dépenses cumulées',
                    data: depMens.map(d => d.cumul),
                    borderColor: '#3b82f6',
                    backgroundColor: '#3b82f610',
                    fill: true,
                    tension: 0.3,
                    borderWidth: 2.5,
                    pointRadius: 4,
                    pointBackgroundColor: '#3b82f6',
                },
                {
                    label: 'Budget total',
                    data: depMens.map(() => travaux.reduce((s, t) => s + t.budget, 0)),
                    borderColor: '#ef4444',
                    borderDash: [6, 4],
                    borderWidth: 2,
                    pointRadius: 0,
                    fill: false,
                }
            ]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
                legend: { position: 'top', labels: { boxWidth: 12, padding: 16 } },
                tooltip: {
                    callbacks: { label: ctx => `${ctx.dataset.label}: ${fmt(ctx.raw)}` }
                }
            },
            scales: {
                y: {
                    beginAtZero: true,
                    ticks: { callback: v => fmt(v) },
                    grid: { color: '#f1f5f9' }
                },
                x: {
                    ticks: { font: { size: 10 } },
                    grid: { display: false }
                }
            }
        }
    });

    // ---- Achat Pie ----
    const achatData = [
        { label: 'Prix d\'achat', value: D.achat.prixAchat },
        { label: 'Frais de notaire', value: D.achat.fraisNotaire },
        { label: 'Frais d\'agence', value: D.achat.fraisAgence },
        { label: 'Autres frais', value: D.achat.fraisDossierBanque + D.achat.fraisGarantie + D.achat.fraisCourtier },
        { label: 'Travaux', value: D.achat.travaux },
    ];
    new Chart(document.getElementById('chartAchat'), {
        type: 'doughnut',
        data: {
            labels: achatData.map(a => a.label),
            datasets: [{
                data: achatData.map(a => a.value),
                backgroundColor: colors.slice(0, 5),
                borderWidth: 2,
                borderColor: '#fff',
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
                legend: { position: 'bottom', labels: { boxWidth: 12, padding: 12 } },
                tooltip: {
                    callbacks: { label: ctx => `${ctx.label}: ${fmt(ctx.raw)}` }
                }
            },
            cutout: '50%',
        }
    });

    // ---- Financement Pie ----
    const finData = D.financement.credits.map(c => ({ label: c.type, value: c.montant }));
    finData.push({ label: 'Apport personnel', value: D.financement.apportPersonnel });
    new Chart(document.getElementById('chartFinancement'), {
        type: 'doughnut',
        data: {
            labels: finData.map(f => f.label),
            datasets: [{
                data: finData.map(f => f.value),
                backgroundColor: colors.slice(0, finData.length),
                borderWidth: 2,
                borderColor: '#fff',
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
                legend: { position: 'bottom', labels: { boxWidth: 12, padding: 12 } },
                tooltip: {
                    callbacks: { label: ctx => `${ctx.label}: ${fmt(ctx.raw)}` }
                }
            },
            cutout: '50%',
        }
    });

    // ---- Budget Doughnut ----
    new Chart(document.getElementById('chartBudgetDoughnut'), {
        type: 'doughnut',
        data: {
            labels: travaux.map(t => t.nom),
            datasets: [{
                data: travaux.map(t => t.depense),
                backgroundColor: colors.slice(0, travaux.length),
                borderWidth: 2,
                borderColor: '#fff',
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
                legend: { position: 'right', labels: { boxWidth: 12, padding: 10, font: { size: 11 } } },
                tooltip: {
                    callbacks: { label: ctx => `${ctx.label}: ${fmt(ctx.raw)}` }
                }
            },
            cutout: '55%',
        }
    });

    // ---- Budget Comparison Bar ----
    new Chart(document.getElementById('chartBudgetComparison'), {
        type: 'bar',
        data: {
            labels: travaux.map(t => t.nom.length > 15 ? t.nom.substring(0, 15) + '...' : t.nom),
            datasets: [
                {
                    label: 'Budget',
                    data: travaux.map(t => t.budget),
                    backgroundColor: '#3b82f640',
                    borderColor: '#3b82f6',
                    borderWidth: 1,
                    borderRadius: 4,
                },
                {
                    label: 'Dépensé',
                    data: travaux.map(t => t.depense),
                    backgroundColor: '#10b98160',
                    borderColor: '#10b981',
                    borderWidth: 1,
                    borderRadius: 4,
                }
            ]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            indexAxis: 'y',
            plugins: {
                legend: { position: 'top', labels: { boxWidth: 12 } },
                tooltip: {
                    callbacks: { label: ctx => `${ctx.dataset.label}: ${fmt(ctx.raw)}` }
                }
            },
            scales: {
                x: {
                    beginAtZero: true,
                    ticks: { callback: v => fmt(v) },
                    grid: { color: '#f1f5f9' }
                },
                y: {
                    ticks: { font: { size: 11 } },
                    grid: { display: false }
                }
            }
        }
    });

    // ---- Energie Comparison ----
    new Chart(document.getElementById('chartEnergie'), {
        type: 'bar',
        data: {
            labels: ['Consommation (kWh/m²/an)', 'Émissions GES (kgCO₂/m²/an)', 'Facture annuelle estimée (€)'],
            datasets: [
                {
                    label: 'Avant rénovation',
                    data: [D.dpe.avant.consommation, D.dpe.avant.ges, 3200],
                    backgroundColor: '#ef444460',
                    borderColor: '#ef4444',
                    borderWidth: 2,
                    borderRadius: 6,
                },
                {
                    label: 'Après rénovation',
                    data: [D.dpe.apres.consommation, D.dpe.apres.ges, 850],
                    backgroundColor: '#10b98160',
                    borderColor: '#10b981',
                    borderWidth: 2,
                    borderRadius: 6,
                }
            ]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
                legend: { position: 'top', labels: { boxWidth: 12, padding: 16 } },
            },
            scales: {
                y: {
                    beginAtZero: true,
                    grid: { color: '#f1f5f9' }
                },
                x: {
                    grid: { display: false }
                }
            }
        }
    });
}

// ============================================
// HISTORIQUE
// ============================================

function renderHistorique() {
    Admin.renderHistorique();
}

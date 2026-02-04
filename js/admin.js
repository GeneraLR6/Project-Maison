/**
 * ============================================
 * ADMIN MODULE — CRUD complet pour toutes les sections
 * ============================================
 * - Sauvegarde automatique dans localStorage
 * - Import / Export JSON
 * - Modales d'édition pour chaque entité
 * - Ajout / Modification / Suppression
 */

const Admin = (() => {
    const STORAGE_KEY = 'project_maison_data';
    const HISTORY_KEY = 'project_maison_history';
    const HISTORY_MAX = 50;
    let confirmCallback = null;

    // ============================================
    // INIT
    // ============================================

    function init() {
        loadFromStorage();
        initToggle();
        injectAdminButtons();
    }

    function initToggle() {
        const toggle = document.getElementById('adminToggle');
        const sw = document.getElementById('toggleSwitch');
        const label = toggle.querySelector('.admin-toggle-label');

        const isAdmin = localStorage.getItem('admin_mode') === 'true';
        if (isAdmin) {
            document.body.classList.add('admin-mode');
            sw.classList.add('active');
            label.classList.add('active');
        }

        toggle.addEventListener('click', () => {
            const active = document.body.classList.toggle('admin-mode');
            sw.classList.toggle('active', active);
            label.classList.toggle('active', active);
            localStorage.setItem('admin_mode', active);
        });
    }

    // ============================================
    // STORAGE
    // ============================================

    function loadFromStorage() {
        const saved = localStorage.getItem(STORAGE_KEY);
        if (saved) {
            try {
                const parsed = JSON.parse(saved);
                Object.assign(PROJECT_DATA, parsed);
            } catch (e) {
                console.warn('Erreur chargement données:', e);
            }
        }
    }

    function saveToStorage() {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(PROJECT_DATA));
    }

    function save(description) {
        saveToStorage();
        if (description) {
            addHistoryEntry(description);
        }
        // Re-render everything
        renderAllSections();
        // Destroy old charts and reinit
        Object.values(Chart.instances).forEach(instance => instance.destroy());
        initCharts();
        updateLastDate();
        // Re-inject admin buttons
        injectAdminButtons();
        toast('Modifications enregistrées', 'success');
    }

    // ============================================
    // HISTORIQUE
    // ============================================

    function getHistory() {
        try {
            return JSON.parse(localStorage.getItem(HISTORY_KEY)) || [];
        } catch (e) {
            return [];
        }
    }

    function addHistoryEntry(description) {
        const history = getHistory();
        history.unshift({
            date: new Date().toISOString(),
            description: description,
        });
        // Limit to HISTORY_MAX entries (FIFO)
        if (history.length > HISTORY_MAX) {
            history.length = HISTORY_MAX;
        }
        localStorage.setItem(HISTORY_KEY, JSON.stringify(history));
    }

    function clearHistory() {
        confirm('Vider l\'historique', 'Tout l\'historique des modifications sera supprimé.', () => {
            localStorage.removeItem(HISTORY_KEY);
            renderHistorique();
            toast('Historique vidé', 'success');
        });
    }

    function renderHistorique() {
        const container = document.getElementById('historiqueList');
        if (!container) return;
        const history = getHistory();

        if (history.length === 0) {
            container.innerHTML = '<p class="historique-empty"><i class="fas fa-info-circle"></i> Aucune modification enregistrée.</p>';
            return;
        }

        let html = '';
        history.forEach(entry => {
            const d = new Date(entry.date);
            const dateStr = d.toLocaleDateString('fr-FR', { day: 'numeric', month: 'long', year: 'numeric' });
            const timeStr = d.toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' });
            html += `
                <div class="historique-item">
                    <div class="historique-dot"></div>
                    <div class="historique-content">
                        <div class="historique-date">${dateStr} à ${timeStr}</div>
                        <div class="historique-desc">${entry.description}</div>
                    </div>
                </div>
            `;
        });
        container.innerHTML = html;
    }

    function injectHistoriqueButtons() {
        const section = document.getElementById('section-historique');
        if (section && !section.querySelector('.btn-add')) {
            const list = document.getElementById('historiqueList');
            if (list) {
                list.insertAdjacentHTML('beforebegin',
                    `<button class="btn-add" onclick="Admin.clearHistory()" style="border-color: var(--danger); color: var(--danger);"><i class="fas fa-trash"></i> Vider l'historique</button>`
                );
            }
        }
    }

    // ============================================
    // EXPORT / IMPORT / RESET
    // ============================================

    function exportData() {
        const blob = new Blob([JSON.stringify(PROJECT_DATA, null, 2)], { type: 'application/json' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `projet-maison-${new Date().toISOString().slice(0,10)}.json`;
        a.click();
        URL.revokeObjectURL(url);
        toast('Données exportées', 'success');
    }

    function importData(event) {
        const file = event.target.files[0];
        if (!file) return;
        const reader = new FileReader();
        reader.onload = (e) => {
            try {
                const data = JSON.parse(e.target.result);
                Object.assign(PROJECT_DATA, data);
                save('Import de donnees');
                toast('Données importées avec succès', 'success');
            } catch (err) {
                toast('Fichier JSON invalide', 'error');
            }
        };
        reader.readAsText(file);
        event.target.value = '';
    }

    function resetData() {
        confirm('Réinitialiser les données', 'Toutes vos modifications seront perdues. Les données d\'exemple seront restaurées.', () => {
            localStorage.removeItem(STORAGE_KEY);
            location.reload();
        });
    }

    // ============================================
    // MODAL
    // ============================================

    function openModal(title, bodyHtml, onSave) {
        document.getElementById('modalTitle').textContent = title;
        document.getElementById('modalBody').innerHTML = bodyHtml;
        document.getElementById('modalOverlay').classList.add('active');
        document.getElementById('modalSave').onclick = () => {
            onSave();
            closeModal();
        };
        // Focus first input
        setTimeout(() => {
            const first = document.querySelector('#modalBody .form-control');
            if (first) first.focus();
        }, 100);
    }

    function closeModal() {
        document.getElementById('modalOverlay').classList.remove('active');
    }

    // ============================================
    // CONFIRM
    // ============================================

    function confirm(title, msg, callback) {
        document.getElementById('confirmTitle').textContent = title;
        document.getElementById('confirmMsg').textContent = msg;
        document.getElementById('confirmOverlay').classList.add('active');
        document.getElementById('confirmYes').onclick = () => {
            closeConfirm();
            callback();
        };
    }

    function closeConfirm() {
        document.getElementById('confirmOverlay').classList.remove('active');
    }

    // ============================================
    // TOAST
    // ============================================

    function toast(msg, type = 'success') {
        const el = document.createElement('div');
        el.className = `toast ${type}`;
        el.innerHTML = `<i class="fas fa-${type === 'success' ? 'check-circle' : 'exclamation-circle'}"></i> ${msg}`;
        document.body.appendChild(el);
        setTimeout(() => { el.remove(); }, 3000);
    }

    // ============================================
    // INJECT ADMIN BUTTONS INTO ALL SECTIONS
    // ============================================

    function injectAdminButtons() {
        injectGeneralButtons();
        injectAchatButtons();
        injectFinancementButtons();
        injectAidesButtons();
        injectTravauxButtons();
        injectMateriauxButtons();
        injectEnergieButtons();
        injectJournalButtons();
        injectHistoriqueButtons();
    }

    // --- Helper: create an edit button ---
    function editBtn(onclick) {
        return `<button class="admin-btn admin-btn-edit" onclick="${onclick}" title="Modifier"><i class="fas fa-pen"></i></button>`;
    }
    function deleteBtn(onclick) {
        return `<button class="admin-btn admin-btn-delete" onclick="${onclick}" title="Supprimer"><i class="fas fa-trash"></i></button>`;
    }
    function addBtn(onclick, text) {
        return `<button class="btn-add" onclick="${onclick}"><i class="fas fa-plus"></i> ${text}</button>`;
    }

    // ============================================
    // GENERAL / PRESENTATION
    // ============================================

    function injectGeneralButtons() {
        // Edit house info
        const houseCard = document.querySelector('#section-presentation .card:first-child .card-header');
        if (houseCard && !houseCard.querySelector('.admin-btn')) {
            houseCard.insertAdjacentHTML('beforeend', `<div class="admin-actions">${editBtn('Admin.editGeneral()')}</div>`);
        }
        // Edit objectives
        const objCard = document.querySelectorAll('#section-presentation .card')[1];
        if (objCard) {
            const objHeader = objCard.querySelector('.card-header');
            if (objHeader && !objHeader.querySelector('.admin-btn')) {
                objHeader.insertAdjacentHTML('beforeend', `<div class="admin-actions">${editBtn('Admin.editObjectifs()')}</div>`);
            }
        }
        // Edit DPE
        const dpeCard = document.querySelectorAll('#section-presentation .card')[1];
        // Add btn to DPE card
        const allPresCards = document.querySelectorAll('#section-presentation > .card');
        allPresCards.forEach(card => {
            const h = card.querySelector('.card-header h3');
            if (h && h.textContent.includes('nergétique') && !card.querySelector('.admin-btn')) {
                card.querySelector('.card-header').insertAdjacentHTML('beforeend', `<div class="admin-actions">${editBtn('Admin.editDPE()')}</div>`);
            }
        });
    }

    function editGeneral() {
        const g = PROJECT_DATA.general;
        openModal('Modifier les informations', `
            <div class="form-row">
                <div class="form-group">
                    <label>Type de bien</label>
                    <input class="form-control" id="f_type" value="${g.type}">
                </div>
                <div class="form-group">
                    <label>Année de construction</label>
                    <input class="form-control" type="number" id="f_annee" value="${g.anneeConstruction}">
                </div>
            </div>
            <div class="form-row">
                <div class="form-group">
                    <label>Surface habitable (m²)</label>
                    <input class="form-control" type="number" id="f_surface" value="${g.surfaceHabitable}">
                </div>
                <div class="form-group">
                    <label>Surface terrain (m²)</label>
                    <input class="form-control" type="number" id="f_terrain" value="${g.surfaceTerrain}">
                </div>
            </div>
            <div class="form-row">
                <div class="form-group">
                    <label>Nombre de pièces</label>
                    <input class="form-control" type="number" id="f_pieces" value="${g.nombrePieces}">
                </div>
                <div class="form-group">
                    <label>Localisation</label>
                    <input class="form-control" id="f_localisation" value="${g.localisation}">
                </div>
            </div>
        `, () => {
            g.type = document.getElementById('f_type').value;
            g.anneeConstruction = parseInt(document.getElementById('f_annee').value);
            g.surfaceHabitable = parseFloat(document.getElementById('f_surface').value);
            g.surfaceTerrain = parseFloat(document.getElementById('f_terrain').value);
            g.nombrePieces = parseInt(document.getElementById('f_pieces').value);
            g.localisation = document.getElementById('f_localisation').value;
            save('Modification des informations generales');
        });
    }

    function editObjectifs() {
        let listHtml = PROJECT_DATA.objectifs.map((o, i) => `
            <div class="form-list-item" data-idx="${i}">
                <input class="form-control" placeholder="Titre" value="${o.titre}" data-field="titre">
                <input class="form-control" placeholder="Description" value="${o.description}" data-field="description">
                <button class="btn-remove" onclick="this.parentElement.remove()"><i class="fas fa-times"></i></button>
            </div>
        `).join('');

        openModal('Modifier les objectifs', `
            <div id="objList">${listHtml}</div>
            <button class="btn-add-list-item" onclick="Admin.addObjField()"><i class="fas fa-plus"></i> Ajouter un objectif</button>
        `, () => {
            const items = document.querySelectorAll('#objList .form-list-item');
            PROJECT_DATA.objectifs = Array.from(items).map(item => ({
                icon: 'fas fa-check',
                titre: item.querySelector('[data-field=titre]').value,
                description: item.querySelector('[data-field=description]').value,
            }));
            save('Modification des objectifs');
        });
    }

    function addObjField() {
        const list = document.getElementById('objList');
        list.insertAdjacentHTML('beforeend', `
            <div class="form-list-item">
                <input class="form-control" placeholder="Titre" data-field="titre" value="">
                <input class="form-control" placeholder="Description" data-field="description" value="">
                <button class="btn-remove" onclick="this.parentElement.remove()"><i class="fas fa-times"></i></button>
            </div>
        `);
    }

    function editDPE() {
        const d = PROJECT_DATA.dpe;
        openModal('Modifier le DPE', `
            <h4 style="margin-bottom:12px;">Avant rénovation</h4>
            <div class="form-row-3">
                <div class="form-group">
                    <label>Classe</label>
                    <select class="form-control" id="f_dpe_avant_classe">
                        ${['A','B','C','D','E','F','G'].map(c => `<option ${c===d.avant.classe?'selected':''}>${c}</option>`).join('')}
                    </select>
                </div>
                <div class="form-group">
                    <label>Consommation (kWh/m²/an)</label>
                    <input class="form-control" type="number" id="f_dpe_avant_conso" value="${d.avant.consommation}">
                </div>
                <div class="form-group">
                    <label>GES (kgCO2/m²/an)</label>
                    <input class="form-control" type="number" id="f_dpe_avant_ges" value="${d.avant.ges}">
                </div>
            </div>
            <h4 style="margin:18px 0 12px;">Après rénovation (objectif)</h4>
            <div class="form-row-3">
                <div class="form-group">
                    <label>Classe</label>
                    <select class="form-control" id="f_dpe_apres_classe">
                        ${['A','B','C','D','E','F','G'].map(c => `<option ${c===d.apres.classe?'selected':''}>${c}</option>`).join('')}
                    </select>
                </div>
                <div class="form-group">
                    <label>Consommation (kWh/m²/an)</label>
                    <input class="form-control" type="number" id="f_dpe_apres_conso" value="${d.apres.consommation}">
                </div>
                <div class="form-group">
                    <label>GES (kgCO2/m²/an)</label>
                    <input class="form-control" type="number" id="f_dpe_apres_ges" value="${d.apres.ges}">
                </div>
            </div>
        `, () => {
            d.avant.classe = document.getElementById('f_dpe_avant_classe').value;
            d.avant.consommation = parseFloat(document.getElementById('f_dpe_avant_conso').value);
            d.avant.ges = parseFloat(document.getElementById('f_dpe_avant_ges').value);
            d.apres.classe = document.getElementById('f_dpe_apres_classe').value;
            d.apres.consommation = parseFloat(document.getElementById('f_dpe_apres_conso').value);
            d.apres.ges = parseFloat(document.getElementById('f_dpe_apres_ges').value);
            save('Modification du DPE');
        });
    }

    // ============================================
    // ACHAT
    // ============================================

    function injectAchatButtons() {
        const table = document.querySelector('#section-achat .card .card-header');
        if (table && !table.querySelector('.admin-btn')) {
            table.insertAdjacentHTML('beforeend', `<div class="admin-actions">${editBtn('Admin.editAchat()')}</div>`);
        }
    }

    function editAchat() {
        const a = PROJECT_DATA.achat;
        let rows = a.details.map((d, i) => `
            <div class="form-list-item" data-idx="${i}">
                <input class="form-control" style="flex:2" placeholder="Poste" value="${d.poste}" data-field="poste">
                <input class="form-control" type="number" style="flex:1" placeholder="Montant" value="${d.montant}" data-field="montant">
                <input class="form-control" style="flex:1.5" placeholder="Notes" value="${d.notes}" data-field="notes">
                <button class="btn-remove" onclick="this.parentElement.remove()"><i class="fas fa-times"></i></button>
            </div>
        `).join('');

        openModal('Modifier les coûts d\'acquisition', `
            <div class="form-row">
                <div class="form-group">
                    <label>Prix d'achat</label>
                    <input class="form-control" type="number" id="f_achat_prix" value="${a.prixAchat}">
                </div>
                <div class="form-group">
                    <label>Frais de notaire</label>
                    <input class="form-control" type="number" id="f_achat_notaire" value="${a.fraisNotaire}">
                </div>
            </div>
            <div class="form-row">
                <div class="form-group">
                    <label>Frais d'agence</label>
                    <input class="form-control" type="number" id="f_achat_agence" value="${a.fraisAgence}">
                </div>
                <div class="form-group">
                    <label>Enveloppe travaux</label>
                    <input class="form-control" type="number" id="f_achat_travaux" value="${a.travaux}">
                </div>
            </div>
            <h4 style="margin:18px 0 10px;">Détail des postes</h4>
            <div id="achatList">${rows}</div>
            <button class="btn-add-list-item" onclick="Admin.addAchatRow()"><i class="fas fa-plus"></i> Ajouter un poste</button>
        `, () => {
            a.prixAchat = parseFloat(document.getElementById('f_achat_prix').value);
            a.fraisNotaire = parseFloat(document.getElementById('f_achat_notaire').value);
            a.fraisAgence = parseFloat(document.getElementById('f_achat_agence').value);
            a.travaux = parseFloat(document.getElementById('f_achat_travaux').value);
            const items = document.querySelectorAll('#achatList .form-list-item');
            a.details = Array.from(items).map(item => ({
                poste: item.querySelector('[data-field=poste]').value,
                montant: parseFloat(item.querySelector('[data-field=montant]').value) || 0,
                notes: item.querySelector('[data-field=notes]').value,
            }));
            save('Modification des couts d acquisition');
        });
    }

    function addAchatRow() {
        document.getElementById('achatList').insertAdjacentHTML('beforeend', `
            <div class="form-list-item">
                <input class="form-control" style="flex:2" placeholder="Poste" data-field="poste" value="">
                <input class="form-control" type="number" style="flex:1" placeholder="Montant" data-field="montant" value="0">
                <input class="form-control" style="flex:1.5" placeholder="Notes" data-field="notes" value="">
                <button class="btn-remove" onclick="this.parentElement.remove()"><i class="fas fa-times"></i></button>
            </div>
        `);
    }

    // ============================================
    // FINANCEMENT
    // ============================================

    function injectFinancementButtons() {
        const section = document.getElementById('section-financement');
        const cards = section.querySelectorAll('.card .card-header');
        cards.forEach(header => {
            const h3 = header.querySelector('h3');
            if (h3 && !header.querySelector('.admin-btn')) {
                if (h3.textContent.includes('récapitulatif')) {
                    header.insertAdjacentHTML('beforeend', `<div class="admin-actions">${editBtn('Admin.editFinancement()')}</div>`);
                }
            }
        });
    }

    function editFinancement() {
        const f = PROJECT_DATA.financement;
        let creditsHtml = f.credits.map((c, i) => `
            <div style="background:#f8fafc; border-radius:8px; padding:16px; margin-bottom:12px;" id="credit_${i}">
                <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:10px;">
                    <strong>${c.type}</strong>
                    <button class="btn-remove" onclick="document.getElementById('credit_${i}').remove()"><i class="fas fa-times"></i></button>
                </div>
                <div class="form-row">
                    <div class="form-group"><label>Type</label><input class="form-control" value="${c.type}" data-field="type"></div>
                    <div class="form-group"><label>Montant</label><input class="form-control" type="number" value="${c.montant}" data-field="montant"></div>
                </div>
                <div class="form-row-3">
                    <div class="form-group"><label>Taux (%)</label><input class="form-control" type="number" step="0.01" value="${c.taux}" data-field="taux"></div>
                    <div class="form-group"><label>Durée</label><input class="form-control" value="${c.duree}" data-field="duree"></div>
                    <div class="form-group"><label>Mensualité</label><input class="form-control" type="number" value="${c.mensualite}" data-field="mensualite"></div>
                </div>
            </div>
        `).join('');

        openModal('Modifier le financement', `
            <div class="form-row">
                <div class="form-group">
                    <label>Apport personnel</label>
                    <input class="form-control" type="number" id="f_fin_apport" value="${f.apportPersonnel}">
                </div>
                <div class="form-group">
                    <label>Revenus mensuels</label>
                    <input class="form-control" type="number" id="f_fin_revenus" value="${f.revenusMensuels}">
                </div>
            </div>
            <h4 style="margin:14px 0 10px;">Crédits</h4>
            <div id="creditsList">${creditsHtml}</div>
            <button class="btn-add-list-item" onclick="Admin.addCreditRow()"><i class="fas fa-plus"></i> Ajouter un crédit</button>
        `, () => {
            f.apportPersonnel = parseFloat(document.getElementById('f_fin_apport').value);
            f.revenusMensuels = parseFloat(document.getElementById('f_fin_revenus').value);
            const blocks = document.querySelectorAll('#creditsList > div');
            f.credits = Array.from(blocks).map(b => ({
                type: b.querySelector('[data-field=type]').value,
                montant: parseFloat(b.querySelector('[data-field=montant]').value) || 0,
                taux: parseFloat(b.querySelector('[data-field=taux]').value) || 0,
                duree: b.querySelector('[data-field=duree]').value,
                mensualite: parseFloat(b.querySelector('[data-field=mensualite]').value) || 0,
                details: {},
            }));
            save('Modification du financement');
        });
    }

    let creditCounter = 100;
    function addCreditRow() {
        const id = 'credit_new_' + (creditCounter++);
        document.getElementById('creditsList').insertAdjacentHTML('beforeend', `
            <div style="background:#f8fafc; border-radius:8px; padding:16px; margin-bottom:12px;" id="${id}">
                <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:10px;">
                    <strong>Nouveau crédit</strong>
                    <button class="btn-remove" onclick="document.getElementById('${id}').remove()"><i class="fas fa-times"></i></button>
                </div>
                <div class="form-row">
                    <div class="form-group"><label>Type</label><input class="form-control" value="" data-field="type" placeholder="Nom du prêt"></div>
                    <div class="form-group"><label>Montant</label><input class="form-control" type="number" value="0" data-field="montant"></div>
                </div>
                <div class="form-row-3">
                    <div class="form-group"><label>Taux (%)</label><input class="form-control" type="number" step="0.01" value="0" data-field="taux"></div>
                    <div class="form-group"><label>Durée</label><input class="form-control" value="" data-field="duree" placeholder="Ex: 25 ans"></div>
                    <div class="form-group"><label>Mensualité</label><input class="form-control" type="number" value="0" data-field="mensualite"></div>
                </div>
            </div>
        `);
    }

    // ============================================
    // AIDES
    // ============================================

    function injectAidesButtons() {
        const section = document.getElementById('section-aides');
        // Add button before table
        const tableCard = section.querySelector('.card');
        if (tableCard && !section.querySelector('.btn-add')) {
            tableCard.insertAdjacentHTML('beforebegin', addBtn('Admin.addAide()', 'Ajouter une aide'));
        }
    }

    function editAide(idx) {
        const a = PROJECT_DATA.aides[idx];
        openModal('Modifier l\'aide', `
            <div class="form-group">
                <label>Nom de l'aide</label>
                <input class="form-control" id="f_aide_nom" value="${a.nom}">
            </div>
            <div class="form-row">
                <div class="form-group">
                    <label>Organisme</label>
                    <input class="form-control" id="f_aide_org" value="${a.organisme}">
                </div>
                <div class="form-group">
                    <label>Statut</label>
                    <select class="form-control" id="f_aide_statut">
                        <option value="demande" ${a.statut==='demande'?'selected':''}>Demandé</option>
                        <option value="en_attente" ${a.statut==='en_attente'?'selected':''}>En attente</option>
                        <option value="recu" ${a.statut==='recu'?'selected':''}>Reçu</option>
                        <option value="refuse" ${a.statut==='refuse'?'selected':''}>Refusé</option>
                    </select>
                </div>
            </div>
            <div class="form-row">
                <div class="form-group">
                    <label>Montant demandé (€)</label>
                    <input class="form-control" type="number" id="f_aide_demande" value="${a.montantDemande}">
                </div>
                <div class="form-group">
                    <label>Montant reçu (€)</label>
                    <input class="form-control" type="number" id="f_aide_recu" value="${a.montantRecu}">
                </div>
            </div>
            <div class="form-group">
                <label>Conditions</label>
                <input class="form-control" id="f_aide_conditions" value="${a.conditions}">
            </div>
            <div class="form-group">
                <label>Détails</label>
                <textarea class="form-control" id="f_aide_details">${a.details || ''}</textarea>
            </div>
        `, () => {
            a.nom = document.getElementById('f_aide_nom').value;
            a.organisme = document.getElementById('f_aide_org').value;
            a.statut = document.getElementById('f_aide_statut').value;
            a.montantDemande = parseFloat(document.getElementById('f_aide_demande').value) || 0;
            a.montantRecu = parseFloat(document.getElementById('f_aide_recu').value) || 0;
            a.conditions = document.getElementById('f_aide_conditions').value;
            a.details = document.getElementById('f_aide_details').value;
            save('Modification de l aide: ' + a.nom);
        });
    }

    function addAide() {
        PROJECT_DATA.aides.push({
            nom: 'Nouvelle aide',
            organisme: '',
            montantDemande: 0,
            montantRecu: 0,
            statut: 'demande',
            conditions: '',
            details: '',
        });
        save('Ajout d une aide');
        editAide(PROJECT_DATA.aides.length - 1);
    }

    function deleteAide(idx) {
        const nom = PROJECT_DATA.aides[idx].nom;
        confirm('Supprimer cette aide', `"${nom}" sera supprimée.`, () => {
            PROJECT_DATA.aides.splice(idx, 1);
            save('Suppression de l aide: ' + nom);
        });
    }

    // ============================================
    // TRAVAUX
    // ============================================

    function injectTravauxButtons() {
        const section = document.getElementById('section-travaux');
        if (section && !section.querySelector('.btn-add')) {
            const list = document.getElementById('travauxList');
            list.insertAdjacentHTML('beforebegin', addBtn('Admin.addTravail()', 'Ajouter un poste de travaux'));
        }
    }

    function editTravail(idx) {
        const t = PROJECT_DATA.travaux[idx];
        const cats = ['isolation','chauffage','electricite','plomberie','menuiseries','toiture','finitions'];
        let soustachesHtml = (t.soustaches || []).map((s, i) => `
            <div class="form-list-item">
                <input class="form-control" value="${s.nom}" data-field="nom">
                <select class="form-control" style="max-width:120px" data-field="statut">
                    <option value="pending" ${s.statut==='pending'?'selected':''}>En attente</option>
                    <option value="progress" ${s.statut==='progress'?'selected':''}>En cours</option>
                    <option value="done" ${s.statut==='done'?'selected':''}>Terminé</option>
                </select>
                <button class="btn-remove" onclick="this.parentElement.remove()"><i class="fas fa-times"></i></button>
            </div>
        `).join('');

        openModal('Modifier le poste de travaux', `
            <div class="form-row">
                <div class="form-group">
                    <label>Nom</label>
                    <input class="form-control" id="f_trav_nom" value="${t.nom}">
                </div>
                <div class="form-group">
                    <label>Catégorie</label>
                    <select class="form-control" id="f_trav_cat">
                        ${cats.map(c => `<option value="${c}" ${c===t.categorie?'selected':''}>${c}</option>`).join('')}
                    </select>
                </div>
            </div>
            <div class="form-row-3">
                <div class="form-group">
                    <label>Budget (€)</label>
                    <input class="form-control" type="number" id="f_trav_budget" value="${t.budget}">
                </div>
                <div class="form-group">
                    <label>Dépensé (€)</label>
                    <input class="form-control" type="number" id="f_trav_depense" value="${t.depense}">
                </div>
                <div class="form-group">
                    <label>Avancement (%)</label>
                    <input class="form-control" type="number" min="0" max="100" id="f_trav_avancement" value="${t.avancement}">
                </div>
            </div>
            <div class="form-row">
                <div class="form-group">
                    <label>Exécutant</label>
                    <input class="form-control" id="f_trav_executant" value="${t.executant}">
                </div>
                <div class="form-group">
                    <label>Couleur</label>
                    <input class="form-control" type="color" id="f_trav_couleur" value="${t.couleur}">
                </div>
            </div>
            <div class="form-row">
                <div class="form-group">
                    <label>Date début</label>
                    <input class="form-control" type="date" id="f_trav_debut" value="${t.dateDebut}">
                </div>
                <div class="form-group">
                    <label>Date fin</label>
                    <input class="form-control" type="date" id="f_trav_fin" value="${t.dateFin}">
                </div>
            </div>
            <h4 style="margin:14px 0 10px;">Sous-tâches</h4>
            <div id="soustachesList">${soustachesHtml}</div>
            <button class="btn-add-list-item" onclick="Admin.addSoustache()"><i class="fas fa-plus"></i> Ajouter une sous-tâche</button>
        `, () => {
            t.nom = document.getElementById('f_trav_nom').value;
            t.categorie = document.getElementById('f_trav_cat').value;
            t.budget = parseFloat(document.getElementById('f_trav_budget').value) || 0;
            t.depense = parseFloat(document.getElementById('f_trav_depense').value) || 0;
            t.avancement = parseInt(document.getElementById('f_trav_avancement').value) || 0;
            t.executant = document.getElementById('f_trav_executant').value;
            t.couleur = document.getElementById('f_trav_couleur').value;
            t.dateDebut = document.getElementById('f_trav_debut').value;
            t.dateFin = document.getElementById('f_trav_fin').value;
            const items = document.querySelectorAll('#soustachesList .form-list-item');
            t.soustaches = Array.from(items).map(item => ({
                nom: item.querySelector('[data-field=nom]').value,
                statut: item.querySelector('[data-field=statut]').value,
            }));
            save('Modification du poste: ' + t.nom);
        });
    }

    function addSoustache() {
        document.getElementById('soustachesList').insertAdjacentHTML('beforeend', `
            <div class="form-list-item">
                <input class="form-control" value="" data-field="nom" placeholder="Nom de la sous-tâche">
                <select class="form-control" style="max-width:120px" data-field="statut">
                    <option value="pending">En attente</option>
                    <option value="progress">En cours</option>
                    <option value="done">Terminé</option>
                </select>
                <button class="btn-remove" onclick="this.parentElement.remove()"><i class="fas fa-times"></i></button>
            </div>
        `);
    }

    function addTravail() {
        PROJECT_DATA.travaux.push({
            categorie: 'finitions',
            nom: 'Nouveau poste',
            icon: 'fas fa-tools',
            couleur: '#64748b',
            budget: 0,
            depense: 0,
            avancement: 0,
            executant: '',
            dateDebut: new Date().toISOString().slice(0, 10),
            dateFin: new Date().toISOString().slice(0, 10),
            soustaches: [],
        });
        save('Ajout d un poste de travaux');
        editTravail(PROJECT_DATA.travaux.length - 1);
    }

    function deleteTravail(idx) {
        const nom = PROJECT_DATA.travaux[idx].nom;
        confirm('Supprimer ce poste', `"${nom}" sera supprimé.`, () => {
            PROJECT_DATA.travaux.splice(idx, 1);
            save('Suppression du poste: ' + nom);
        });
    }

    // ============================================
    // MATERIAUX
    // ============================================

    function injectMateriauxButtons() {
        const section = document.getElementById('section-materiaux');
        if (section && !section.querySelector('.btn-add')) {
            section.insertAdjacentHTML('afterbegin', addBtn('Admin.addMateriau()', 'Ajouter un matériau'));
        }
    }

    function editMateriau(idx) {
        const m = PROJECT_DATA.materiaux[idx];
        const cats = ['isolation','chauffage','electricite','plomberie','menuiseries','toiture','finitions'];
        const statuts = ['devis','commande','livre','stock'];

        openModal('Modifier le matériau', `
            <div class="form-group">
                <label>Nom</label>
                <input class="form-control" id="f_mat_nom" value="${m.nom}">
            </div>
            <div class="form-row">
                <div class="form-group">
                    <label>Catégorie</label>
                    <select class="form-control" id="f_mat_cat">
                        ${cats.map(c => `<option value="${c}" ${c===m.categorie?'selected':''}>${c}</option>`).join('')}
                    </select>
                </div>
                <div class="form-group">
                    <label>Fournisseur</label>
                    <input class="form-control" id="f_mat_fourn" value="${m.fournisseur}">
                </div>
            </div>
            <div class="form-row-3">
                <div class="form-group">
                    <label>Quantité</label>
                    <input class="form-control" id="f_mat_qty" value="${m.quantite}">
                </div>
                <div class="form-group">
                    <label>Prix unitaire (€)</label>
                    <input class="form-control" type="number" step="0.01" id="f_mat_pu" value="${m.prixUnitaire}">
                </div>
                <div class="form-group">
                    <label>Prix total (€)</label>
                    <input class="form-control" type="number" step="0.01" id="f_mat_pt" value="${m.prixTotal}">
                </div>
            </div>
            <div class="form-group">
                <label>Statut</label>
                <select class="form-control" id="f_mat_statut">
                    ${statuts.map(s => `<option value="${s}" ${s===m.statut?'selected':''}>${s}</option>`).join('')}
                </select>
            </div>
        `, () => {
            m.nom = document.getElementById('f_mat_nom').value;
            m.categorie = document.getElementById('f_mat_cat').value;
            m.fournisseur = document.getElementById('f_mat_fourn').value;
            m.quantite = document.getElementById('f_mat_qty').value;
            m.prixUnitaire = parseFloat(document.getElementById('f_mat_pu').value) || 0;
            m.prixTotal = parseFloat(document.getElementById('f_mat_pt').value) || 0;
            m.statut = document.getElementById('f_mat_statut').value;
            save('Modification du materiau: ' + m.nom);
        });
    }

    function addMateriau() {
        PROJECT_DATA.materiaux.push({
            nom: 'Nouveau matériau',
            categorie: 'finitions',
            fournisseur: '',
            quantite: '1',
            prixUnitaire: 0,
            prixTotal: 0,
            statut: 'devis',
        });
        save('Ajout d un materiau');
        editMateriau(PROJECT_DATA.materiaux.length - 1);
    }

    function deleteMateriau(idx) {
        const nom = PROJECT_DATA.materiaux[idx].nom;
        confirm('Supprimer ce matériau', `"${nom}" sera supprimé.`, () => {
            PROJECT_DATA.materiaux.splice(idx, 1);
            save('Suppression du materiau: ' + nom);
        });
    }

    // ============================================
    // ENERGIE
    // ============================================

    function injectEnergieButtons() {
        const section = document.getElementById('section-energie');
        const cards = section.querySelectorAll('.card .card-header');
        cards.forEach(header => {
            const h3 = header.querySelector('h3');
            if (h3 && h3.textContent.includes('conomies') && !header.querySelector('.admin-btn')) {
                header.insertAdjacentHTML('beforeend', `<div class="admin-actions">${editBtn('Admin.editEnergieEco()')}</div>`);
            }
            if (h3 && h3.textContent.includes('valeur') && !header.querySelector('.admin-btn')) {
                header.insertAdjacentHTML('beforeend', `<div class="admin-actions">${editBtn('Admin.editEnergieVal()')}</div>`);
            }
        });
    }

    function editEnergieEco() {
        const d = PROJECT_DATA.energie.economies;
        let html = '';
        Object.entries(d).forEach(([k, v]) => {
            html += `
                <div class="form-list-item">
                    <input class="form-control" style="flex:1" value="${k}" data-field="key">
                    <input class="form-control" style="flex:1.5" value="${v}" data-field="value">
                    <button class="btn-remove" onclick="this.parentElement.remove()"><i class="fas fa-times"></i></button>
                </div>
            `;
        });

        openModal('Modifier les économies d\'énergie', `
            <div id="ecoList">${html}</div>
            <button class="btn-add-list-item" onclick="Admin.addEcoRow()"><i class="fas fa-plus"></i> Ajouter une ligne</button>
        `, () => {
            const items = document.querySelectorAll('#ecoList .form-list-item');
            const newData = {};
            items.forEach(item => {
                const key = item.querySelector('[data-field=key]').value;
                const val = item.querySelector('[data-field=value]').value;
                if (key) newData[key] = val;
            });
            PROJECT_DATA.energie.economies = newData;
            save('Modification des economies d energie');
        });
    }

    function addEcoRow() {
        document.getElementById('ecoList').insertAdjacentHTML('beforeend', `
            <div class="form-list-item">
                <input class="form-control" style="flex:1" value="" data-field="key" placeholder="Label">
                <input class="form-control" style="flex:1.5" value="" data-field="value" placeholder="Valeur">
                <button class="btn-remove" onclick="this.parentElement.remove()"><i class="fas fa-times"></i></button>
            </div>
        `);
    }

    function editEnergieVal() {
        const d = PROJECT_DATA.energie.valeur;
        let html = '';
        Object.entries(d).forEach(([k, v]) => {
            html += `
                <div class="form-list-item">
                    <input class="form-control" style="flex:1" value="${k}" data-field="key">
                    <input class="form-control" style="flex:1.5" value="${v}" data-field="value">
                    <button class="btn-remove" onclick="this.parentElement.remove()"><i class="fas fa-times"></i></button>
                </div>
            `;
        });

        openModal('Modifier l\'impact sur la valeur', `
            <div id="valList">${html}</div>
            <button class="btn-add-list-item" onclick="Admin.addValRow()"><i class="fas fa-plus"></i> Ajouter une ligne</button>
        `, () => {
            const items = document.querySelectorAll('#valList .form-list-item');
            const newData = {};
            items.forEach(item => {
                const key = item.querySelector('[data-field=key]').value;
                const val = item.querySelector('[data-field=value]').value;
                if (key) newData[key] = val;
            });
            PROJECT_DATA.energie.valeur = newData;
            save('Modification de l impact sur la valeur');
        });
    }

    function addValRow() {
        document.getElementById('valList').insertAdjacentHTML('beforeend', `
            <div class="form-list-item">
                <input class="form-control" style="flex:1" value="" data-field="key" placeholder="Label">
                <input class="form-control" style="flex:1.5" value="" data-field="value" placeholder="Valeur">
                <button class="btn-remove" onclick="this.parentElement.remove()"><i class="fas fa-times"></i></button>
            </div>
        `);
    }

    // ============================================
    // JOURNAL
    // ============================================

    function injectJournalButtons() {
        const section = document.getElementById('section-journal');
        if (section && !section.querySelector('.btn-add')) {
            const timeline = document.getElementById('journalTimeline');
            timeline.insertAdjacentHTML('beforebegin', addBtn('Admin.addJournal()', 'Ajouter une entrée au journal'));
        }
    }

    function editJournal(idx) {
        const j = PROJECT_DATA.journal[idx];

        const listHtml = (arr, id) => arr.map(item => `
            <div class="form-list-item">
                <input class="form-control" value="${item}">
                <button class="btn-remove" onclick="this.parentElement.remove()"><i class="fas fa-times"></i></button>
            </div>
        `).join('');

        openModal('Modifier l\'entrée du journal', `
            <div class="form-row">
                <div class="form-group">
                    <label>Date</label>
                    <input class="form-control" type="date" id="f_jour_date" value="${j.date}">
                </div>
                <div class="form-group">
                    <label>Tags (séparés par des virgules)</label>
                    <input class="form-control" id="f_jour_tags" value="${j.tags.join(', ')}">
                </div>
            </div>
            <div class="form-group">
                <label>Titre</label>
                <input class="form-control" id="f_jour_titre" value="${j.titre}">
            </div>
            <div class="form-group">
                <label>Contenu</label>
                <textarea class="form-control" id="f_jour_contenu" rows="4">${j.contenu}</textarea>
            </div>
            <h4 style="margin:14px 0 8px; color: var(--danger);">Problèmes rencontrés</h4>
            <div id="probList">${listHtml(j.problemes, 'prob')}</div>
            <button class="btn-add-list-item" onclick="Admin.addListItem('probList')"><i class="fas fa-plus"></i> Ajouter</button>

            <h4 style="margin:14px 0 8px; color: var(--success);">Solutions apportées</h4>
            <div id="solList">${listHtml(j.solutions, 'sol')}</div>
            <button class="btn-add-list-item" onclick="Admin.addListItem('solList')"><i class="fas fa-plus"></i> Ajouter</button>

            <h4 style="margin:14px 0 8px; color: var(--purple);">Leçons apprises</h4>
            <div id="lecList">${listHtml(j.lecons, 'lec')}</div>
            <button class="btn-add-list-item" onclick="Admin.addListItem('lecList')"><i class="fas fa-plus"></i> Ajouter</button>
        `, () => {
            j.date = document.getElementById('f_jour_date').value;
            j.titre = document.getElementById('f_jour_titre').value;
            j.contenu = document.getElementById('f_jour_contenu').value;
            j.tags = document.getElementById('f_jour_tags').value.split(',').map(t => t.trim()).filter(Boolean);
            j.problemes = Array.from(document.querySelectorAll('#probList .form-list-item input')).map(i => i.value).filter(Boolean);
            j.solutions = Array.from(document.querySelectorAll('#solList .form-list-item input')).map(i => i.value).filter(Boolean);
            j.lecons = Array.from(document.querySelectorAll('#lecList .form-list-item input')).map(i => i.value).filter(Boolean);
            save('Modification de l entree journal: ' + j.titre);
        });
    }

    function addJournal() {
        PROJECT_DATA.journal.unshift({
            date: new Date().toISOString().slice(0, 10),
            titre: 'Nouvelle entrée',
            tags: [],
            contenu: '',
            problemes: [],
            solutions: [],
            lecons: [],
        });
        save('Ajout d une entree au journal');
        editJournal(0);
    }

    function deleteJournal(idx) {
        const titre = PROJECT_DATA.journal[idx].titre;
        confirm('Supprimer cette entrée', `"${titre}" sera supprimée.`, () => {
            PROJECT_DATA.journal.splice(idx, 1);
            save('Suppression de l entree journal: ' + titre);
        });
    }

    function addListItem(containerId) {
        document.getElementById(containerId).insertAdjacentHTML('beforeend', `
            <div class="form-list-item">
                <input class="form-control" value="" placeholder="Saisir...">
                <button class="btn-remove" onclick="this.parentElement.remove()"><i class="fas fa-times"></i></button>
            </div>
        `);
    }

    // ============================================
    // CLOSE MODALS ON ESCAPE
    // ============================================

    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape') {
            closeModal();
            closeConfirm();
        }
    });

    document.getElementById('modalOverlay').addEventListener('click', (e) => {
        if (e.target === e.currentTarget) closeModal();
    });

    // ============================================
    // PUBLIC API
    // ============================================

    return {
        init,
        closeModal,
        closeConfirm,
        exportData,
        importData,
        resetData,

        // General
        editGeneral,
        editObjectifs,
        addObjField,
        editDPE,

        // Achat
        editAchat,
        addAchatRow,

        // Financement
        editFinancement,
        addCreditRow,

        // Aides
        editAide,
        addAide,
        deleteAide,

        // Travaux
        editTravail,
        addTravail,
        deleteTravail,
        addSoustache,

        // Materiaux
        editMateriau,
        addMateriau,
        deleteMateriau,

        // Energie
        editEnergieEco,
        editEnergieVal,
        addEcoRow,
        addValRow,

        // Journal
        editJournal,
        addJournal,
        deleteJournal,
        addListItem,

        // Historique
        renderHistorique,
        clearHistory,
    };
})();

// Init admin after DOM ready
document.addEventListener('DOMContentLoaded', () => {
    Admin.init();
});

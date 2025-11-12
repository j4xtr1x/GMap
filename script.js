document.addEventListener('DOMContentLoaded', function () {
    var nodes = new vis.DataSet();
    var edges = new vis.DataSet();

    function loadStateFromLocalStorage() {
        const savedStateJSON = localStorage.getItem('gmap-autosave');
        if (savedStateJSON) {
            try {
                const savedState = JSON.parse(savedStateJSON);
                if (savedState && Array.isArray(savedState.nodes) && Array.isArray(savedState.edges)) {
                    nodes.add(savedState.nodes);
                    edges.add(savedState.edges);
                    return; // Exit after successful load
                }
            } catch (e) {
                console.error("Failed to parse auto-saved state, loading default data.", e);
            }
        }

        // If no saved state or parsing fails, load default data
        nodes.add([
            { id: 'quark.tec.br', label: 'quark.tec.br', group: 'level3', title: 'Main company website' },
            { id: 'rh-colaborador-back.quark.tec.br', label: 'rh-colaborador-back.quark.tec.br', group: 'level3', title: 'Backend for the employee portal' },
            { id: 'solis.quark.tec.br', label: 'solis.quark.tec.br', group: 'level3', title: 'Some other system' },
            { id: 'rh.quark.tec.br', label: 'rh.quark.tec.br', group: 'level3', title: 'Human Resources main system' },
            { id: 'rh-learn.quark.tec.br', label: 'rh-learn.quark.tec.br', group: 'level3', title: 'E-learning platform for employees' },
            { id: 'sign.quark.tec.br', label: 'sign.quark.tec.br', group: 'level3', title: 'Digital signature service' },
            { id: 'rh-ai.quark.tec.br', label: 'rh-ai.quark.tec.br', group: 'level3', title: 'AI services for HR' },
            { id: 'learn-backend.quark.tec.br', label: 'learn-backend.quark.tec.br', group: 'level3', title: 'Backend for the e-learning platform' },
            { id: 'rh-colaborador.quark.tec.br', label: 'rh-colaborador.quark.tec.br', group: 'level1', title: 'Employee portal frontend' }
        ]);
        edges.add([
            { from: 'rh-colaborador.quark.tec.br', to: 'quark.tec.br' },
            { from: 'rh-colaborador.quark.tec.br', to: 'rh-colaborador-back.quark.tec.br' },
            { from: 'rh-colaborador.quark.tec.br', to: 'solis.quark.tec.br' },
            { from: 'rh-colaborador.quark.tec.br', to: 'rh.quark.tec.br' },
            { from: 'rh-colaborador.quark.tec.br', to: 'rh-learn.quark.tec.br' },
            { from: 'rh-colaborador.quark.tec.br', to: 'sign.quark.tec.br' },
            { from: 'rh-colaborador.quark.tec.br', to: 'rh-ai.quark.tec.br' },
            { from: 'rh-colaborador.quark.tec.br', to: 'learn-backend.quark.tec.br' }
        ]);
    }

    loadStateFromLocalStorage();

    var container = document.getElementById('graph');
    var data = {
        nodes: nodes,
        edges: edges
    };

    function getFontColor() {
        return document.body.classList.contains('dark-mode') ? '#FFFFFF' : '#000000';
    }

    function lightenHexColor(hex, percent) {
        if (!hex || hex.indexOf('#') !== 0) return '#FFFFFF';
        let r = parseInt(hex.slice(1, 3), 16);
        let g = parseInt(hex.slice(3, 5), 16);
        let b = parseInt(hex.slice(5, 7), 16);

        r = Math.min(255, r + Math.floor(255 * percent / 100));
        g = Math.min(255, g + Math.floor(255 * percent / 100));
        b = Math.min(255, b + Math.floor(255 * percent / 100));

        const toHex = (c) => ('0' + c.toString(16)).slice(-2).toUpperCase();

        return `#${toHex(r)}${toHex(g)}${toHex(b)}`;
    }

    function darkenHexColor(hex, percent) {
        if (!hex || hex.indexOf('#') !== 0) return '#000000';
        let r = parseInt(hex.slice(1, 3), 16);
        let g = parseInt(hex.slice(3, 5), 16);
        let b = parseInt(hex.slice(5, 7), 16);

        r = Math.max(0, r - Math.floor(255 * percent / 100));
        g = Math.max(0, g - Math.floor(255 * percent / 100));
        b = Math.max(0, b - Math.floor(255 * percent / 100));

        const toHex = (c) => ('0' + c.toString(16)).slice(-2).toUpperCase();

        return `#${toHex(r)}${toHex(g)}${toHex(b)}`;
    }

    var options = {
        nodes: {
            shape: 'dot',
            size: 16,
            font: {
                color: getFontColor() // Set initial font color
            },
            borderWidth: 2,
            borderWidthSelected: 5,
            shadow: { enabled: false } // Explicitly disable shadow by default
        },
        edges: {
            arrows: 'to'
        },
        physics: {
            forceAtlas2Based: {
                gravitationalConstant: -26,
                centralGravity: 0.005,
                springLength: 230,
                springConstant: 0.18
            },
            maxVelocity: 146,
            solver: 'forceAtlas2Based',
            timestep: 0.35,
            stabilization: { iterations: 150 }
        },
        groups: {
            Big: { // Largest
                size: 60
            },
            Medium: { // Intermediate
                size: 40
            },
            Small: { // Smallest
                size: 20
            }
        },
        interaction: {
            selectConnectedEdges: false,
            dragNodes: true, // Revert to default: enable dragging nodes
            dragView: true // Revert to default: enable dragging the canvas
        }
    };

    var network = new vis.Network(container, data, options);

    // --- Tab Logic ---
    const tabButtons = document.querySelectorAll('.tab-button');
    const tabContents = document.querySelectorAll('.tab-content');

    tabButtons.forEach(button => {
        button.addEventListener('click', () => {
            // Deactivate all buttons and content
            tabButtons.forEach(btn => btn.classList.remove('active'));
            tabContents.forEach(content => content.classList.remove('active'));

            // Activate clicked button and corresponding content
            button.classList.add('active');
            const targetTabId = button.dataset.tab;
            document.getElementById(targetTabId).classList.add('active');
        });
    });

    // --- Auto-save Logic ---
    function saveStateToLocalStorage() {
        try {
            const allNodes = nodes.get({ returnType: "Array" });
            const positions = network.getPositions();
            const nodesWithPositions = allNodes.map(node => {
                if (positions[node.id]) {
                    node.x = positions[node.id].x;
                    node.y = positions[node.id].y;
                }
                return node;
            });

            const allEdges = edges.get({ returnType: "Array" });

            const dataToSave = {
                nodes: nodesWithPositions,
                edges: allEdges
            };

            localStorage.setItem('gmap-autosave', JSON.stringify(dataToSave));
        } catch (error) {
            console.error("Auto-save failed:", error);
        }
    }

    nodes.on('*', () => saveStateToLocalStorage());
    edges.on('*', () => saveStateToLocalStorage());
    network.on('dragEnd', (params) => {
        if (params.nodes && params.nodes.length > 0) {
            saveStateToLocalStorage();
        }
    });


    // --- Color Management ---
    const savedColorsDatalist = document.getElementById('savedColors');
    const nodeColorInput = document.getElementById('nodeColor');
    const edgeColorInput = document.getElementById('edgeColor');

    function getSavedColors() {
        return JSON.parse(localStorage.getItem('savedGMapColors')) || [];
    }

    function populateSavedColors() {
        savedColorsDatalist.innerHTML = '';
        const colors = getSavedColors();
        colors.forEach(color => {
            const option = document.createElement('option');
            option.value = color;
            savedColorsDatalist.appendChild(option);
        });
    }

    function saveColor(color) {
        let colors = getSavedColors();
        if (!colors.includes(color)) {
            colors.push(color);
            localStorage.setItem('savedGMapColors', JSON.stringify(colors));
            populateSavedColors();
        }
    }

    // Load saved colors on startup
    populateSavedColors();


    // Dark Mode Logic
    const darkModeToggle = document.getElementById('darkModeToggle');
    const body = document.body;

    if (localStorage.getItem('darkMode') === 'enabled') {
        body.classList.add('dark-mode');
        network.setOptions({
            nodes: {
                font: {
                    color: getFontColor()
                }
            }
        });
    }

    darkModeToggle.addEventListener('click', () => {
        if (body.classList.contains('dark-mode')) {
            body.classList.remove('dark-mode');
            localStorage.setItem('darkMode', 'disabled');
        } else {
            body.classList.add('dark-mode');
            localStorage.setItem('darkMode', 'enabled');
        }
        network.setOptions({
            nodes: {
                font: {
                    color: getFontColor()
                }
            }
        });
    });

    // Sidebar Toggle Logic
    const sidebar = document.getElementById('sidebar');
    const sidebarToggle = document.getElementById('sidebarToggle');
    const mainContent = document.querySelector('.main-content');

    // Load sidebar preference from localStorage
    if (localStorage.getItem('sidebarClosed') === 'true') {
        sidebar.classList.add('closed');
        sidebarToggle.classList.add('closed'); // Add class to button
        mainContent.classList.remove('sidebar-open');
        sidebarToggle.textContent = '>';
    } else {
        sidebar.classList.remove('closed'); // Ensure sidebar is open
        sidebarToggle.classList.remove('closed'); // Ensure button is not closed
        mainContent.classList.add('sidebar-open');
        sidebarToggle.textContent = '<';
    }

    sidebarToggle.addEventListener('click', () => {
        if (sidebar.classList.contains('closed')) {
            sidebar.classList.remove('closed');
            sidebarToggle.classList.remove('closed'); // Remove class from button
            mainContent.classList.add('sidebar-open');
            localStorage.setItem('sidebarClosed', 'false');
            sidebarToggle.textContent = '<';
        } else {
            sidebar.classList.add('closed');
            sidebarToggle.classList.add('closed'); // Add class to button
            mainContent.classList.remove('sidebar-open');
            localStorage.setItem('sidebarClosed', 'true');
            sidebarToggle.textContent = '>';
        }
        network.fit();
    });


    // Node and Edge Management Logic
    const nodeNameInput = document.getElementById('nodeName');
    const newNodeNameInput = document.getElementById('newNodeName'); // New input field
    const nodeDescriptionInput = document.getElementById('nodeDescription');
    const nodeGroupSelect = document.getElementById('nodeGroup');
    const addNodeBtn = document.getElementById('addNode');
    const updateNodeBtn = document.getElementById('updateNode');
    const removeNodeBtn = document.getElementById('removeNode');

    function removeNodeAndEdges(nodeId) {
        const nodeToRemove = nodes.get(nodeId);
        if (!nodeToRemove) return;

        const message = `Are you sure you want to remove the node "${nodeId}"? All connections to this node will also be removed.`;
        if (confirm(message)) {
            // Find and remove all connected edges
            const connectedEdges = edges.get({
                filter: function(edge) {
                    return edge.from === nodeId || edge.to === nodeId;
                }
            });
            const edgesToRemove = connectedEdges.map(edge => edge.id);
            if (edgesToRemove.length > 0) {
                edges.remove(edgesToRemove);
            }

            // Now remove the node
            nodes.remove({ id: nodeId });

            // Clear input fields if the deleted node was displayed
            if (nodeNameInput.value === nodeId) {
                nodeNameInput.value = '';
                newNodeNameInput.value = '';
                nodeDescriptionInput.value = '';
                newNodeNameInput.style.display = 'none';
            }
        }
    }

    addNodeBtn.addEventListener('click', () => {
        const name = nodeNameInput.value.trim();
        const group = nodeGroupSelect.value;
        const color = nodeColorInput.value;
        const description = nodeDescriptionInput.value.trim();
        
        if (name) {
            saveColor(color);
            const nodeData = {
                id: name,
                label: name,
                group: group,
                title: description,
                color: {
                    background: color,
                    border: darkenHexColor(color, 20), // Apply darker border always
                    highlight: {
                        background: lightenHexColor(color, 20), // Apply lighter color on highlight
                        border: darkenHexColor(color, 20) // Keep border color same on highlight
                    }
                }
            };
            nodes.add(nodeData);
            nodeNameInput.value = '';
            nodeDescriptionInput.value = '';
        } else {
            alert('Please enter a Node Name.');
        }
    });

    updateNodeBtn.addEventListener('click', () => {
        const oldName = nodeNameInput.value.trim();
        const newName = newNodeNameInput.value.trim();
        const group = nodeGroupSelect.value;
        const color = nodeColorInput.value;
        const description = nodeDescriptionInput.value.trim();

        if (!oldName) {
            alert('Please select a node or enter its current name to update.');
            return;
        }

        const oldNode = nodes.get(oldName);
        if (!oldNode) {
            alert('Node with current name not found.');
            return;
        }
        
        saveColor(color);

        // Define updateData here, for Case 1
        const updateData = {
            id: oldName,
            group: group,
            title: description,
            color: {
                background: color,
                border: darkenHexColor(color, 20), // Apply darker border always
                highlight: {
                    background: lightenHexColor(color, 20),
                    border: darkenHexColor(color, 20) // Keep border color same on highlight
                }
            }
        };

        // Case 1: Only group or color is changed, no new name
        if (!newName || newName === oldName) {
            nodes.update(updateData);
            nodeNameInput.value = '';
            newNodeNameInput.value = '';
            nodeDescriptionInput.value = '';
            newNodeNameInput.style.display = 'none';
            return;
        }

        // Case 2: Node is being renamed
        if (nodes.get(newName)) {
            alert('A node with the new name already exists.');
            return;
        }

        // Create a new node object, preserving position
        const oldNodePosition = network.getPositions(oldName);
        const newNode = {
            id: newName,
            label: newName,
            group: group,
            title: description,
            color: {
                background: color,
                border: darkenHexColor(color, 20), // Apply darker border always
                highlight: {
                    background: lightenHexColor(color, 20), // Apply lighter color on highlight
                    border: darkenHexColor(color, 20) // Keep border color same on highlight
                }
            },
            x: oldNodePosition[oldName].x,
            y: oldNodePosition[oldName].y
        };

        nodes.add(newNode);

        // Get all edges connected to the old node
        const connectedEdges = edges.get({
            filter: function (edge) {
                return edge.from === oldName || edge.to === oldName;
            }
        });

        const newEdges = [];
        const edgesToRemove = [];

        connectedEdges.forEach(edge => {
            const newEdge = { ...edge };
            delete newEdge.id; // Create a new edge, don't update existing

            if (newEdge.from === oldName) {
                newEdge.from = newName;
            }
            if (newEdge.to === oldName) {
                newEdge.to = newName;
            }
            newEdges.push(newEdge);
            edgesToRemove.push(edge.id);
        });

        // Add the new edges and remove the old ones
        edges.remove(edgesToRemove);
        edges.add(newEdges);
        
        // Remove the old node
        nodes.remove({ id: oldName });

        nodeNameInput.value = '';
        newNodeNameInput.value = '';
        nodeDescriptionInput.value = '';
        newNodeNameInput.style.display = 'none'; // Hide new name field
    });

    removeNodeBtn.addEventListener('click', () => {
        const name = nodeNameInput.value.trim();
        if (name) {
            removeNodeAndEdges(name);
        } else {
            alert('Please select a node to remove.');
        }
    });

    const edgeFromInput = document.getElementById('edgeFrom');
    const edgeToInput = document.getElementById('edgeTo');
    const addEdgeBtn = document.getElementById('addEdge');
    const updateEdgeBtn = document.getElementById('updateEdge'); // New button
    const removeEdgeBtn = document.getElementById('removeEdge');

    addEdgeBtn.addEventListener('click', () => {
        const from = edgeFromInput.value.trim();
        const to = edgeToInput.value.trim();
        const color = edgeColorInput.value;
        if (from && to && nodes.get(from) && nodes.get(to)) {
            saveColor(color);
            edges.add({
                from: from,
                to: to,
                color: {
                    color: color,
                    highlight: color
                }
            });
            edgeFromInput.value = '';
            edgeToInput.value = '';
        } else {
            alert('Please enter valid "From" and "To" Node IDs.');
        }
    });

    updateEdgeBtn.addEventListener('click', () => {
        const from = edgeFromInput.value.trim();
        const to = edgeToInput.value.trim();
        const color = edgeColorInput.value;

        if (!from || !to) {
            alert('Please enter valid "From" and "To" Node Names for the connection to update.');
            return;
        }

        const edgeToUpdate = edges.get({
            filter: function(edge) {
                return edge.from === from && edge.to === to;
            }
        });

        if (edgeToUpdate.length === 0) {
            alert('Connection not found.');
            return;
        }

        const edgeId = edgeToUpdate[0].id; // Get the ID of the first matching edge

        saveColor(color); // Save the new color

        edges.update({
            id: edgeId,
            color: {
                color: color,
                highlight: color // Also update highlight color for consistency
            }
        });

        edgeFromInput.value = '';
        edgeToInput.value = '';
    });

    removeEdgeBtn.addEventListener('click', () => {
        const from = edgeFromInput.value.trim();
        const to = edgeToInput.value.trim();
        const edgeToRemove = edges.get().find(edge => edge.from === from && edge.to === to);
        if (edgeToRemove) {
            edges.remove({ id: edgeToRemove.id });
            edgeFromInput.value = '';
            edgeToInput.value = '';
        } else {
            alert('Please enter valid "From" and "To" Node IDs for the edge to remove.');
        }
    });

    // --- Keyboard and Click Shortcuts ---
    let isCtrlPressed = false;
    let isAltPressed = false;
    let selectedFromNode = null;
    const modeIndicator = document.getElementById('mode-indicator');

    function updateModeIndicator() {
        if (isCtrlPressed && isAltPressed) {
            modeIndicator.textContent = "Removal Mode Active";
            modeIndicator.className = 'indicator-visible indicator-removal-mode';
        } else if (isCtrlPressed) {
            modeIndicator.textContent = "Connection Mode Active";
            modeIndicator.className = 'indicator-visible indicator-creation-mode';
        } else {
            modeIndicator.className = 'indicator-hidden';
        }
    }

    window.addEventListener('keydown', (event) => {
        if (event.key === 'Control') {
            isCtrlPressed = true;
        }
        if (event.key === 'Alt') {
            isAltPressed = true;
            event.preventDefault(); // Prevent browser menu focus
        }
        updateModeIndicator();

        // Guard for input fields
        if (event.target.tagName === 'INPUT' || event.target.tagName === 'TEXTAREA') {
            return;
        }

        // Delete selected node or edge
        if (event.key === 'Delete') {
            const selection = network.getSelection();
            if (selection.nodes.length > 0) {
                removeNodeAndEdges(selection.nodes[0]);
            } else if (selection.edges.length > 0) {
                edges.remove(selection.edges[0]);
            }
        }
    });

    window.addEventListener('keyup', (event) => {
        if (event.key === 'Control') {
            isCtrlPressed = false;
        }
        if (event.key === 'Alt') {
            isAltPressed = false;
        }
        updateModeIndicator();
    });

    window.addEventListener('blur', () => {
        isCtrlPressed = false;
        isAltPressed = false;
        updateModeIndicator();
    });

    network.on('click', function(params) {
        // --- Removal Mode ---
        if (isCtrlPressed && isAltPressed) {
            params.event.srcEvent.preventDefault();

            // If an edge was clicked, remove it.
            if (params.edges.length > 0) {
                const edgeId = params.edges[0];
                edges.remove(edgeId);
                return; // Action complete
            }

            // If a node was clicked, remove it using the existing function.
            if (params.nodes.length > 0) {
                const nodeId = params.nodes[0];
                removeNodeAndEdges(nodeId);
                return; // Action complete
            }
        }

        // --- Creation Mode ---
        if (isCtrlPressed && params.nodes.length > 0 && selectedFromNode) {
            params.event.srcEvent.preventDefault();
            const toNodeId = params.nodes[0];
            const newColor = edgeColorInput.value;

            // Case 1: Self-referencing edge
            if (selectedFromNode === toNodeId) {
                const nodeId = selectedFromNode;

                const selfEdges = edges.get({
                    filter: function(edge) {
                        return edge.from === nodeId && edge.to === nodeId;
                    }
                });

                const colorExists = selfEdges.some(edge => edge.color && edge.color.color === newColor);

                if (!colorExists) {
                    const loopsPerTier = 4;
                    const tier = Math.floor(selfEdges.length / loopsPerTier);
                    const indexInTier = selfEdges.length % loopsPerTier;

                    const baseSize = 25;
                    const sizeIncrement = 15;
                    const newSize = baseSize + (tier * sizeIncrement);

                    const angleIncrement = Math.PI / 2; // 90 degrees
                    const newAngle = (Math.PI / 4) + (indexInTier * angleIncrement);

                    saveColor(newColor);
                    edges.add({
                        from: nodeId,
                        to: nodeId,
                        color: { color: newColor, highlight: newColor },
                        selfReference: {
                            size: newSize,
                            angle: newAngle
                        }
                    });
                }
            } else { // Case 2: Edge between two different nodes
                const existingEdges = edges.get({
                    filter: function(edge) {
                        return (edge.from === selectedFromNode && edge.to === toNodeId);
                    }
                });

                const colorExists = existingEdges.some(edge => edge.color && edge.color.color === newColor);

                if (!colorExists) {
                    saveColor(newColor);
                    edges.add({
                        from: selectedFromNode,
                        to: toNodeId,
                        color: { color: newColor, highlight: newColor }
                    });
                }
            }
            
            // Prevent the selection from changing
            setTimeout(() => network.selectNodes([selectedFromNode]), 0);
            return; // Action complete
        }
    });

    // Optional: Select node or edge to populate input fields
    network.on("select", function (params) {
        // When Ctrl is held, we are in connection mode, so don't change the 'from' node
        if (isCtrlPressed) {
            return;
        }

        if (params.nodes.length === 1) {
            selectedFromNode = params.nodes[0]; // Keep track of the selected node
        } else {
            selectedFromNode = null;
        }

        // Handle node selection
        if (params.nodes.length === 1) {
            var selectedNode = nodes.get(params.nodes[0]);
            nodeNameInput.value = selectedNode.id; // Populate nodeName with selected node's id
            nodeGroupSelect.value = selectedNode.group;
            nodeDescriptionInput.value = selectedNode.title || '';
            
            if (selectedNode.color) {
                nodeColorInput.value = selectedNode.color.background || selectedNode.color;
            } else {
                // If no specific color, set to default or a neutral color
                nodeColorInput.value = "#FF0000"; // Default red
            }

            newNodeNameInput.value = ''; // Clear new name field
            newNodeNameInput.style.display = 'block'; // Show new name field

        } else {
            nodeNameInput.value = '';
            newNodeNameInput.value = '';
            nodeDescriptionInput.value = '';
            newNodeNameInput.style.display = 'none'; // Hide new name field
        }

        // Handle edge selection
        if (params.edges.length === 1) {
            var selectedEdge = edges.get(params.edges[0]);
            edgeFromInput.value = selectedEdge.from;
            edgeToInput.value = selectedEdge.to;
            if (selectedEdge.color && selectedEdge.color.color) {
                edgeColorInput.value = selectedEdge.color.color;
            }
        } else {
            edgeFromInput.value = '';
            edgeToInput.value = '';
        }
    });

    // Node Search Logic
    const nodeSearchInput = document.getElementById('nodeSearchInput');

    nodeSearchInput.addEventListener('keydown', (event) => {
        if (event.key === 'Enter') {
            const searchTerm = nodeSearchInput.value.trim();
            if (searchTerm) {
                const foundNode = nodes.get(searchTerm);
                if (foundNode) {
                    network.focus(searchTerm, {
                        scale: 1.0,
                        animation: {
                            duration: 1000,
                            easingFunction: 'easeInOutQuad'
                        }
                    });
                    nodeSearchInput.value = ''; // Clear input after search
                } else {
                    alert(`Node "${searchTerm}" not found.`);
                }
            }
        }
    });
});
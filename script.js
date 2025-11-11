document.addEventListener('DOMContentLoaded', function () {
    var nodes = new vis.DataSet([
        { id: 'quark.tec.br', label: 'quark.tec.br', group: 'level3' },
        { id: 'rh-colaborador-back.quark.tec.br', label: 'rh-colaborador-back.quark.tec.br', group: 'level3' },
        { id: 'solis.quark.tec.br', label: 'solis.quark.tec.br', group: 'level3' },
        { id: 'rh.quark.tec.br', label: 'rh.quark.tec.br', group: 'level3' },
        { id: 'rh-learn.quark.tec.br', label: 'rh-learn.quark.tec.br', group: 'level3' },
        { id: 'sign.quark.tec.br', label: 'sign.quark.tec.br', group: 'level3' },
        { id: 'rh-ai.quark.tec.br', label: 'rh-ai.quark.tec.br', group: 'level3' },
        { id: 'learn-backend.quark.tec.br', label: 'learn-backend.quark.tec.br', group: 'level3' },
        { id: 'rh-colaborador.quark.tec.br', label: 'rh-colaborador.quark.tec.br', group: 'level1' }
    ]);

    var edges = new vis.DataSet([
        { from: 'rh-colaborador.quark.tec.br', to: 'quark.tec.br' },
        { from: 'rh-colaborador.quark.tec.br', to: 'rh-colaborador-back.quark.tec.br' },
        { from: 'rh-colaborador.quark.tec.br', to: 'solis.quark.tec.br' },
        { from: 'rh-colaborador.quark.tec.br', to: 'rh.quark.tec.br' },
        { from: 'rh-colaborador.quark.tec.br', to: 'rh-learn.quark.tec.br' },
        { from: 'rh-colaborador.quark.tec.br', to: 'sign.quark.tec.br' },
        { from: 'rh-colaborador.quark.tec.br', to: 'rh-ai.quark.tec.br' },
        { from: 'rh-colaborador.quark.tec.br', to: 'learn-backend.quark.tec.br' }
    ]);

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
                size: 25
            },
            Medium: { // Intermediate
                size: 18
            },
            Small: { // Smallest
                size: 12
            }
        },
        interaction: {
            selectConnectedEdges: false,
            dragNodes: true, // Revert to default: enable dragging nodes
            dragView: true // Revert to default: enable dragging the canvas
        }
    };

    var network = new vis.Network(container, data, options);



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
    const nodeGroupSelect = document.getElementById('nodeGroup');
    const addNodeBtn = document.getElementById('addNode');
    const updateNodeBtn = document.getElementById('updateNode');
    const removeNodeBtn = document.getElementById('removeNode');

    const edgeFromInput = document.getElementById('edgeFrom');
    const edgeToInput = document.getElementById('edgeTo');
    const addEdgeBtn = document.getElementById('addEdge');
    const updateEdgeBtn = document.getElementById('updateEdge'); // New button
    const removeEdgeBtn = document.getElementById('removeEdge');

    addNodeBtn.addEventListener('click', () => {
        const name = nodeNameInput.value.trim();
        const group = nodeGroupSelect.value;
        const color = nodeColorInput.value;
        
        if (name) {
            saveColor(color);
            const nodeData = {
                id: name,
                label: name,
                group: group,
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
        } else {
            alert('Please enter a Node Name.');
        }
    });

    updateNodeBtn.addEventListener('click', () => {
        const oldName = nodeNameInput.value.trim();
        const newName = newNodeNameInput.value.trim();
        const group = nodeGroupSelect.value;
        const color = nodeColorInput.value;

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
        newNodeNameInput.style.display = 'none'; // Hide new name field
    });

    removeNodeBtn.addEventListener('click', () => {
        const name = nodeNameInput.value.trim();
        if (name && nodes.get(name)) {
            const message = `Tem certeza que deseja remover o nó "${name}"? Todas as conexões com este nó também serão removidas.`;
            if (confirm(message)) {
                // Find and remove all connected edges
                const connectedEdges = edges.get({
                    filter: function(edge) {
                        return edge.from === name || edge.to === name;
                    }
                });
                const edgesToRemove = connectedEdges.map(edge => edge.id);
                if (edgesToRemove.length > 0) {
                    edges.remove(edgesToRemove);
                }

                // Now remove the node
                nodes.remove({ id: name });

                nodeNameInput.value = '';
                newNodeNameInput.value = '';
                newNodeNameInput.style.display = 'none'; // Hide new name field
            }
        } else {
            alert('Please enter a valid Node Name to remove.');
        }
    });

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

    // Optional: Select node or edge to populate input fields
    network.on("select", function (params) {
        // Handle node selection
        if (params.nodes.length === 1) {
            var selectedNode = nodes.get(params.nodes[0]);
            nodeNameInput.value = selectedNode.id; // Populate nodeName with selected node's id
            nodeGroupSelect.value = selectedNode.group;
            
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
            newNodeNameInput.style.display = 'none'; // Hide new name field
        }

        // Handle edge selection
        if (params.edges.length === 1) {
            var selectedEdge = edges.get(params.edges[0]);
            edgeFromInput.value = selectedEdge.from;
            edgeToInput.value = selectedEdge.to;
            if (selectedEdge.color && selectedEdge.color.color) {
                edgeColorInput.value = selectedEdge.color.color;
            } else {
                edgeColorInput.value = "#848484"; // Default gray
            }
        } else {
            edgeFromInput.value = '';
            edgeToInput.value = '';
            edgeColorInput.value = "#848484"; // Clear or reset color when no edge is selected
        }
    });
});
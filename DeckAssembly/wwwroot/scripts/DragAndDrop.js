async function dragAndDrop(className, restrictionSelector, dotNetHelper) {
    interact(className).draggable({
        intertia: true,
        listeners: {
            start(event) {
                const index = parseInt(event.target.dataset.index);
                dotNetHelper.invokeMethodAsync('OnDragStart', index);
            },
            end(event) {
                dotNetHelper.invokeMethodAsync('OnDragEnd');
            },
            move(event) {
                // Récupération de la position prédécente éventuelle
                var initialTransform = event.target.style.transform;

                var x = 0;
                var y = 0;
                if (initialTransform && initialTransform.trim() !== '') {
                    var match = initialTransform.match(/translate\(([^,]+),\s*([^)]+)\)/);
                    if (match) {
                        x = parseInt(match[1]);
                        y = parseInt(match[2]);
                    }
                }
                x += event.dx;
                y += event.dy;
                event.target.style.transform = `translate(${x}px, ${y}px)`;

                // Version C#
                // Fonctionne mais génère des problèmes lors de l'attente asynchrone avec les evenements js
                //if (!initialTransform) {
                //    initialTransform = "translate(0px, 0px)";
                //}

                dotNetHelper.invokeMethodAsync('OnMove', event.dx, event.dy, initialTransform)
                    .then(function (response) {
                        event.target.style.transform = response;
                    })
            },
    }, modifiers: [
            interact.modifiers.restrictRect({
            restriction: restrictionSelector,
            endOnly: true
        })]
    })
};

function dropZone(dropTarget, dotNetHelper) {
    interact(dropTarget)
        .dropzone({
            ondragenter: function (event) {
                // Appelé quand un draggable rentre dans la zone, la dropzone est bien récupérée ici
                
                //when item enters the draggable area
                var draggableElement = event.relatedTarget
                var dropzoneElement = event.target

                //console.log(draggableElement.firstChild.nodeValue);
                // feedback the possibility of a drop
                dropzoneElement.classList.add('drop-target')
                draggableElement.classList.add('can-drop')

            },
            ondrop: function (event) {
                console.log(event.interaction)
                // Si on repose dans la même div que la ou on vient de le prendre
                // (Généré par la restriction)
                if (event.relatedTarget.parentElement == event.target) {
                    event.relatedTarget.style.transform = '';
                    console.log("removed transform on drop");
                    event.stopPropagation();
                }
                //const droppedData = event.relatedTarget.interactable.getData('customData');
                //const targetZone = event.target.id;
                const item = { id: parseInt(event.relatedTarget.dataset.identifier), name: event.relatedTarget.dataset.displayName }

                console.log(event.relatedTarget.id + ' was dropped into ' + event.target.id);
                // TODO : Trouver les bonnes valeurs à mettre ici
                dotNetHelper.invokeMethodAsync('HandleDrop', item);
            }
        })
        .on('dropactivate', function (event) {
            event.target.classList.add('drop-activated');
        })
};